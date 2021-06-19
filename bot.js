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

    let rand = Math.floor(Math.random() * presidentes.name.length);
    let nome = presidentes.name[rand];

    let parseNome = nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/\s/g, "_");
    console.log('nome', nome)

    const url = strings.url + parseNome

    const response = await fetch(url);
    const body = await response.text();

    const $ = cheerio.load(body)
    const bodyContent = $('#bodyContent');
    console.log(bodyContent)

  }
});

client.login(process.env.DISCORD_TOKEN || token.token);
