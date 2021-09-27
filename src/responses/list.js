import { MessageEmbed } from 'discord.js';

const listMusics = (message, msg) => {
  const exampleEmbed = new MessageEmbed()
    .setColor('#0099ff')
    .setTitle('Playlist')
    .setDescription(`${msg}`)
  message.channel.send({ embed: exampleEmbed });
}

export default listMusics;