import { MessageEmbed } from 'discord.js';

const listMusics = (message, msg) => {
  const exampleEmbed = new MessageEmbed()
    .setColor('#59636b')
    .setTitle('Playlist')
    .setDescription(`${msg}`)
  message.channel.send({ embed: exampleEmbed });
}

export default listMusics;