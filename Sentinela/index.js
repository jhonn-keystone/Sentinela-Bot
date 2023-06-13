const { Client, Intents, MessageAttachment, GatewayIntentBits } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.on('ready', () => {
  console.log(`Bot conectado como ${client.user.tag}`);
});

const attachmentRegex = /https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp)/i;
const allowedChannel = '1116787446428995594'; // ID do canal permitido

const commandErrorMessages = [
  'Você só pode usar comandos no canal de comandos!',
  'Ops, parece que você usou um comando no canal errado!',
  'Esse comando só pode ser utilizado no canal de comandos.',
  'Desculpe, mas você não tem permissão para usar comandos fora do canal designado.',
  'Ei, preste atenção! Os comandos só funcionam no canal de comandos.',
  'Esse comando não pode ser executado neste canal. Tente novamente no canal de comandos.',
  'Acho que você se confundiu de canal. Os comandos só funcionam no canal de comandos.',
  'Oops! Parece que você tentou usar um comando em um canal incorreto. Utilize-o no canal apropriado.',
  'Desculpe, mas este não é o canal certo para usar esse comando. Por favor, vá para o canal de comandos.',
  'Infelizmente, você não pode usar esse comando aqui. Vá para o canal de comandos para utilizá-lo.'
];

client.on('messageCreate', async (message) => {
  if (message.content.startsWith('!') && message.channel.id !== allowedChannel) {
    const errorMessage = commandErrorMessages[Math.floor(Math.random() * commandErrorMessages.length)];
    message.reply(errorMessage);
    return;
  }

  if (message.content === '!help') {
    // Verificar se a mensagem foi enviada no canal permitido
    if (message.channel.id !== allowedChannel) {
      message.reply('Use o comando no canal de comandos!');
      return;
    }

    const helpMessage = `**Comandos disponíveis:**
- \`!help\`: Exibe a lista de comandos disponíveis.
- \`!add_border\`: Adiciona uma borda à uma imagem.

Exemplos de uso do comando \`!add_border\`:
- \`!add_border\`: Adiciona uma borda padrão.
- \`!add_border X-Men\`: Adiciona a borda da equipe dos X-Men.
- \`!add_border Vingadores\`: Adiciona a borda da equipe dos Vingadores.`;

    message.reply(helpMessage);
    return;
  }

  if (message.content.startsWith('!add_border')) {
    // Verificar se a mensagem foi enviada no canal permitido
    if (message.channel.id !== allowedChannel) {
      message.reply('Use o comando no canal de comandos!');
      return;
    }

    const user = message.author;
    const attachment = message.attachments.size > 0 ? message.attachments.first() : null;
    let imageUrl = '';
    let borderUrl = '';
    let borderName = '';

    if (attachment) {
      // A mensagem contém um anexo
      imageUrl = attachment.url;
    } else {
      // Verificar se a mensagem contém um link de imagem
      const match = message.content.match(attachmentRegex);
      if (match) {
        imageUrl = match[0];
      }
    }

    if (!imageUrl) {
      message.reply('Por favor, envie uma imagem ou forneça um link para uma imagem.');
      return;
    }

    const commandArgs = message.content.split(' ').slice(1);
    const borderKeywords = ['x-men', 'vingadores'];
    const chosenBorder = borderKeywords.find(keyword => commandArgs.includes(keyword));

    if (chosenBorder === 'x-men') {
      borderUrl = 'C:\\Users\\Administrator\\Documents\\Bot\\Magnebot\\border.png'; // Caminho para o PNG da borda "X-Men"
      borderName = 'X-Men'; // Nome da borda "X-Men"
    } else if (chosenBorder === 'vingadores') {
      borderUrl = 'C:\\Users\\Administrator\\Documents\\Bot\\Magnebot\\border2.png'; // Caminho para o PNG da borda "Vingadores"
      borderName = 'Vingadores'; // Nome da borda "Vingadores"
    } else {
      borderUrl = 'C:\\Users\\Administrator\\Documents\\Bot\\Magnebot\\border3.png'; // Caminho para o PNG da borda padrão
      borderName = 'padrão'; // Nome da borda padrão
    }

    try {
      // Carregar a imagem original e o PNG de borda usando a biblioteca 'canvas'
      const image = await loadImage(imageUrl);
      const border = await loadImage(borderUrl);

      // Definir a largura e altura desejadas
      const targetWidth = 512;
      const targetHeight = 512;

      // Calcular as proporções da imagem original
      const imageRatio = image.width / image.height;
      const targetRatio = targetWidth / targetHeight;

      let drawWidth, drawHeight, drawX, drawY;

      if (imageRatio > targetRatio) {
        // A imagem original é mais larga do que o tamanho alvo
        drawWidth = image.height * targetRatio;
        drawHeight = image.height;
        drawX = (image.width - drawWidth) / 2;
        drawY = 0;
      } else {
        // A imagem original é mais alta do que o tamanho alvo
        drawWidth = image.width;
        drawHeight = image.width / targetRatio;
        drawX = 0;
        drawY = (image.height - drawHeight) / 2;
      }

      // Criar um novo canvas com o tamanho alvo
      const canvas = createCanvas(targetWidth, targetHeight);
      const ctx = canvas.getContext('2d');

      // Desenhar a imagem original cortada no canvas
      ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight, 0, 0, targetWidth, targetHeight);

      // Desenhar a borda no canvas
      ctx.drawImage(border, 0, 0, targetWidth, targetHeight);

      // Converter o canvas em uma imagem
      const imageWithBorder = canvas.toBuffer('image/png');

      // Criar um objeto de anexo com a imagem e o nome
      const attachmentWithBorder = {
        attachment: imageWithBorder,
        name: 'image_with_border.png'
      };

      // Mensagens divertidas
      const funnyMessages = [
        'Tá na mão, chefia!',
        'Feito! Aqui está sua imagem com a borda!',
        'Adicionado com sucesso! Aqui está o resultado.',
        'Voilà! Sua imagem com a borda está pronta!',
        'Feito com maestria! Aproveite sua imagem com a borda!',
        'Sua imagem agora está mais estilosa com a borda!',
        'Borda adicionada! Veja como sua imagem ficou!',
        'Pronto! Sua imagem com a borda está pronta para brilhar!',
        'Borda adicionada com sucesso! Aprecie sua imagem!',
        'Missão cumprida! Sua imagem agora tem uma bela borda.'
      ];

      // Selecionar uma mensagem aleatória
      const randomMessage = funnyMessages[Math.floor(Math.random() * funnyMessages.length)];

      // Enviar a imagem com a borda e a mensagem divertida de volta para o canal
      message.reply({ content: `${randomMessage} 🖼️`, files: [attachmentWithBorder] });
    } catch (error) {
      console.error('Erro ao adicionar a borda:', error);
      message.reply('Ocorreu um erro ao adicionar a borda à imagem.');
    }
  }
});

// Array com as variações das reações negativas
const negativeReactions = [
  "Como ousa falar este nome?",
  "Se repetir isso de novo eu corto a sua língua!",
  "Não pronuncie essa palavra maldita!",
  "Você não sabe o que está invocando!",
  "Eu proíbo você de mencionar esse nome!",
  "Essa palavra traz más lembranças...",
  "Silêncio! Não profira esse nome em vão!",
  "Cuidado com o que você diz...",
  "Eu não tolero nem mesmo ouvir essa palavra!",
  "Desista! Esse nome não deve ser mencionado!"
];

let lastReaction = '';

client.on('messageCreate', (message) => {
  if (message.content.toLowerCase().includes('casablanca')) {
    let reaction = '';
    do {
      reaction = negativeReactions[Math.floor(Math.random() * negativeReactions.length)];
    } while (reaction === lastReaction);

    lastReaction = reaction;
    message.reply(reaction);
  }
});


client.login('MTExNTQ0MTQ5NTA1NTU0NDQxMA.GDE9RM.F5m4CzQnhgZtpWJwyX4c4wWjcpSGyKnaxoQeAE');