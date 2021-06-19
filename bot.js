//Modules
const Discord = require('discord.js');
const cheerio = require('cheerio');
const fetch = require('node-fetch');

//Client
const client = new Discord.Client();

let generated = 0

//Imports
const presidentes = require('./presidentes.json');
const strings = require('./strings/strings.json');

client.on('ready', () => {
  client.user.setActivity('Hino Nacional Brasileiro', { type: 'LISTENING' });
  console.log(`Logged in as ${client.user.tag}!`);
})

var randomProperty = function (obj) {
  var keys = Object.keys(obj);
  return obj[keys[keys.length * Math.random() << 0]];
};

client.on("guildCreate", guild => {
  let channelID;
  let channels = guild.channels.cache;

  channelLoop:
  for (let key in channels) {
    let c = channels[key];
    if (c[1].type === "text") {
      channelID = c[0];
      break channelLoop;
    }
  }

  let channel = guild.channels.cache.get(guild.systemChannelID || channelID);
  channel.send(`Pra mim é uma enorme felicidade estar em meio ao povo! Utilize /help para aprender mais sobre mim.`);
});

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

  if (msg.content == strings.random_cmd) {
    const safePresidentes = JSON.parse(JSON.stringify(presidentes))
    const parsePresidentes = (obj) => {
      const keys = Object.keys(obj)

      for (key of keys) {
        if (!obj[key].key) {
          delete obj[key]
        }
      }
    }

    parsePresidentes(safePresidentes)
    const randomPresident = randomProperty(safePresidentes)

    const nome = randomPresident.name;
    const presidentKey = randomPresident.key

    const response = await fetch(`https://www.pensador.com/autor/${presidentKey}/`);
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

    generated++

    msg.channel.send(msg_channel, {
      files: [`${randomPresident.avatar}`]
    })



  }
});

client.login(process.env.DISCORD_TOKEN);
