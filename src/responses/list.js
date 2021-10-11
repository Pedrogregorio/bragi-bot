import { MessageEmbed } from 'discord.js';

const listMusics = (message, msg) => {
  const exampleEmbed = new MessageEmbed()
    .setColor('#f28fa0')
    .setTitle('Playlist')
    .setDescription(`${msg}`)
  message.channel.send({ embed: exampleEmbed });
}

export default listMusics;