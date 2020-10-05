//Modules
const Discord = require('discord.js');
const rp = require('request-promise');
const $ = require('cheerio');

//Client
const client = new Discord.Client();

let generated = 0

//Imports
const auth = require('./auth.json');
const presidentes = require('./presidentes.json');
const strings = require('./strings/strings.json');

client.on('ready', () => {
  client.user.setActivity('Hino Nacional Brasileiro', {type:'LISTENING'});
  console.log(`Logged in as ${client.user.tag}!`);
})

client.on('message', msg => {

  if(msg.author.bot)
  return;

  if(msg.content == strings.help_cmd){
  msg.reply(strings.help);
  return;
  }

  if(msg.content == strings.about_cmd){
  msg.channel.send(strings.about);
  return;
  }

  if(msg.content == strings.status_cmd){
    msg.channel.send(`Já foram geradas ${generated} frases aleatórias.`);
    return;
    }

  if(msg.content == strings.random_cmd){

    let rand = Math.floor(Math.random() * presidentes.name.length);
    let nome = presidentes.name[rand];

    let parseNome = nome.replace(/\s/g, "_");

    rp(strings.url + parseNome)
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

      let photosrc = $('div > a > img', html).attr("src");
      let photourl = 'http:' + photosrc

      let indexFrase = Math.floor(Math.random() * frases.length);
      let message = frases[indexFrase];

      //Send photo
      msg.channel.send({
        files: [photourl]
      })
      .then(function(){
        generated++;
        msg.channel.send(message)  //After photo sent, sent quote
      })
      .catch(console.error);
    })
  }
});

client.login(auth.token);
