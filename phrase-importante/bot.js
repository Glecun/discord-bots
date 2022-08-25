import Discord from 'discord.js'
import fetch from 'node-fetch';
import schedule from 'node-schedule';
const client = new Discord.Client()

client.on('ready', function () {
  console.log("Bot ON !")

  schedule.scheduleJob('30 18 * * 0,2,4,6', async function () {
    const {phrase} = await fetch('http://phraseimportante.fr/getPhrase.php').then(response => response.json());
    client.channels.cache.get(process.env.B4_BAMBOU_GENERAL_CHANNEL_KEY).send("**Phrase du jour:** " + phrase);
  });
})

client.on('message', async msg => {
  if (msg.content === '!phrase') {
    const { phrase } = await fetch('http://phraseimportante.fr/getPhrase.php').then(response => response.json());
    msg.channel.send(phrase);
  }
  if (msg.content.startsWith('!addPhrase')) {
    var phrase = msg.content.split('!addPhrase ')[1];
    const response = await fetch('http://phraseimportante.fr/addPhrase.php?phrase='+encodeURIComponent(phrase)).then(response => response);
    response.text().then(function (responseText) {
      msg.channel.send(responseText);
    });

  }
  if (msg.content === '!loremIpsum') {
    let loremIpsum = await fetch('http://phraseimportante.fr/getLoremIpsum.php').then(response => response.json());
    loremIpsum
       .replace(/<br\/>/g, '\n')
       .split('\n')
       .forEach((paragraph) => msg.channel.send(paragraph))
  }

  if (msg.content === '!phrase-help') {
    msg.channel.send(
       "!phrase : Poster une phrase aléatoire\n"+
       "!addPhrase VOTRE-PHRASE : Ajouter une phrase\n"+
       "!loremIpsum: Poster un lorem ipsum aléatoire"
    );
  }
});

client.login(process.env.PHRASE_IMPORTANTE_BOT_TOKEN);
