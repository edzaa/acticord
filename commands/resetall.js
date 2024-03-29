const Discord = require("discord.js");
const db = require("quick.db");

exports.run = async (client, message, args) => {
  if(message.author.id !== message.guild.ownerID) return message.channel.send("Nemaš permisiju za korištenje ove komande!");
  
  let embed = new Discord.MessageEmbed()
  .setTitle("Resetovanje aktivnosti servera!")
  .setDescription("Da li želiš resetovati svu aktivnost na serveru?\nOva akcija će resetovati aktivnost svih članova na ovom serveru.\nDa nastaviš, reaguj na ovu poruku sa ✅. Imaš 30 sekundi za reakciju ili će se ova akcija poništiti.")
  .setColor("BLUE")
  .setFooter("Reset | " + client.config.name, client.user.displayAvatarURL())
  .setTimestamp();
  
  let msg = await message.channel.send(embed);
  msg.react("✅");
  
  msg.awaitReactions((reaction, user) => user.id === message.author.id && reaction.emoji.name === "✅", { max: 1, time: 30000 })
  .then(async (r) => {
    if(r.first().emoji.name === "✅") {
      let serverdata = await db.all().filter(data => data.ID.startsWith(`stats_${message.guild.id}`));
      let broj = 0;
      for(let i = 0; i < serverdata.length; i++) {
        db.delete(serverdata[i].ID);
        broj++;
      }
      let embed2 = embed
      .setDescription("Aktivnost na serveru je resetovana!\nBroj obrisanih računa: " + broj);
    
      msg.edit(embed2);
    }
    else {
      msg.delete();
      message.channel.send("Isteklo je vrijeme za reakciju!")
      .then(m => m.delete({ timeout: 5000 }));
    }
  })
  .catch(() => {});
}
exports.help = {
  ime: "resetall",
  opis: "resetovanje aktivnosti na serveru (samo vlasnik)",
  koristenje: "resetall",
  admin: true,
  ispisano: true
}