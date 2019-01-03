//Modules
const Discord = require('discord.js');
const rp = require('request-promise');
const $ = require('cheerio');
const express = require('express');

//Client
const client = new Discord.Client();
const app = express();

//Imports
const auth = require('./auth.json');
const presidentes = require('./presidentes.json');

//Commands
const PHRASE_CMD = "/pr";
const HELP = "/help";
const ABOUT = "/about";

//URL
const QUOTEURL = "https://pt.wikiquote.org/wiki/";

//Strings
const HELP_TEXT = 'Utilize: \n/help - Seção de ajuda\n/pr - Envia citação aleatória de presidente\n/about - Sobre o BOT';
const ABOUT_TEXT = 'Presidente BOT\nDisponível em https://github.com/paulo9mv/presidente-discord-bot\nPresidente BOT para Telegram: https://t.me/presidente_brasil_bot';

client.on('ready', () => {
  client.user.setActivity('Hino Nacional Brasileiro', {type:'LISTENING'});
  console.log(`Logged in as ${client.user.tag}!`);
})

app.listen(process.env.PORT || 5000);

client.on('message', msg => {

  if(msg.author.bot)
  return;

  if(msg.content == HELP){
	msg.reply(HELP_TEXT);
  }

  if(msg.content == ABOUT){
	msg.channel.send(ABOUT_TEXT);
  }

  if(msg.content == PHRASE_CMD){

    let rand = Math.floor(Math.random() * presidentes.name.length);
    let nome = presidentes.name[rand];
  
    let parseNome = nome.replace(/\s/g, "_");

    rp(QUOTEURL + parseNome)
    .then(function(html){
      let frases = [];
      let frase = $('.mw-parser-output', html);

      frase = frase[0];

      for(let i = 0; i < frase.children.length; i++){

        if(frase.children[i].attribs != undefined){
          let classe = frase.children[i].attribs.name;
          let tag = frase.children[i].name;

          if(classe == "noprint")
          break;
          if(tag == "h2"){
            let atributos = frase.children[i].children[0].attribs;

            if(atributos != undefined)
            if(atributos.id == "Sobre")
            break;
          }
        }

        if(frase.children[i].name == "ul"){
          let tmp = frase.children[i];

          if(tmp.children[0].name == "li"){
            let str = "";
            let tag_li = tmp.children[0];
            let tag_li_name = tag_li.name;
            let tag_li_type = tag_li.type;
            let tag_li_children_length = tag_li.children.length;

            for(let j = 0; j < tag_li_children_length; j++){
              let current_tag = tag_li.children[j];
              if(current_tag.children == undefined){
                let frase = current_tag.data;
                str = str.concat(frase);
              }
              else{
              let current_tag_children_length = current_tag.children.length;
              if(current_tag_children_length > 0)
              for(let k = 0; k < current_tag_children_length; k++){
                let frase = current_tag.children[k].data;
                str = str.concat(frase);
              }
              }
            }
            str = str.concat('\n-' + nome);
            frases.push(str);
            str = "";
          }
        }
      }

      //Envia a mensagem
      let randPhrase = Math.floor(Math.random() * frases.length);
      let message = frases[randPhrase];

      msg.channel.send(message);
    })
  }
});

client.login(auth.token);
