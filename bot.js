//Modules
const Discord = require('discord.js');
const cheerio = require('cheerio');
const fetch = require('node-fetch');

//Client
const client = new Discord.Client();

let generated = 0

//Imports
const presidentes = require('./presidentes.json');
const token = require('./secret.json');
const strings = require('./strings/strings.json');

client.on('ready', () => {
  client.user.setActivity('Hino Nacional Brasileiro', { type: 'LISTENING' });
  console.log(`Logged in as ${client.user.tag}!`);
})

var randomProperty = function (obj) {
  var keys = Object.keys(obj);
  return obj[keys[keys.length * Math.random() << 0]];
};

client.on('message', async msg => {

  if (msg.author.bot)
    return;

  if (msg.content == strings.help_cmd) {
    msg.reply(strings.help);
    return;
  }

  if (msg.content == strings.about_cmd) {
    msg.channel.send(strings.about);
    return;
  }

  if (msg.content == strings.status_cmd) {
    msg.channel.send(`Já foram geradas ${generated} frases aleatórias.`);
    return;
  }

  if (msg.content == '.') {
    const safePresidentes = JSON.parse(JSON.stringify(presidentes))
    const parsePresidentes = (obj) => {
      const keys = Object.keys(obj)

      for (key of keys) {
        console.log(key)

        if (!obj[key].key) {
          delete obj[key]
        }
      }

      console.log(obj)
    }

    parsePresidentes(safePresidentes)
    const randomPresident = randomProperty(safePresidentes)

    const nome = randomPresident.name;
    const presidentKey = randomPresident.key

    const response = await fetch(`https://www.pensador.com/author/${presidentKey}/`);
    const body = await response.text();

    const $ = cheerio.load(body)
    const frases = []

    $('.frase.fr').each((index, item) => {
      const children = item.children

      children && children.map(item => frases.push(item.data))

    })

    $('.frase.fr0').each((index, item) => {
      const children = item.children

      children && children.map(item => frases.push(item.data))

    })

    const frase = frases[Math.floor(Math.random() * frases.length)];
    const msg_channel = frase + '\n-' + nome

    msg.channel.send(msg_channel, {
      files: ['https://upload.wikimedia.org/wikipedia/commons/8/81/Dilma_Rousseff_-_foto_oficial_2011-01-09.jpg']
    })



  }
});

client.login(process.env.DISCORD_TOKEN || token.token);
