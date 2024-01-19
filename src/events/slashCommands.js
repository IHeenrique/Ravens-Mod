const { Events, Message, Interaction } = require("discord.js")
const client = require("../..")
const Discord = require("discord.js")

module.exports = {
    name: Events.InteractionCreate,
    once: false,
    disabled: false,
    /**
     * 
     * @param {Interaction} interaction
     */
    async execute(interaction) {

      /*let cooldown = client.commandsCooldowns
      cooldown = cooldown.findIndex(user => user.userID === interaction.user.id)
      cooldown = cooldown + 1
      console.log(cooldown)*/

        if (interaction.type === Discord.InteractionType.ApplicationCommand) {
            
            const cmd = client.slashCommands.get(interaction.commandName);
        
            interaction["member"] = interaction.guild.members.cache.get(interaction.user.id);
        
            /*let temp;
            if(cooldown == 0) {
              temp = client.commandsCooldowns
              temp.push({ userID: interaction.user.id, tempToNext: null, notified: false, infractions: 0 })
              temp = temp.findIndex(user => user.userID === interaction.user.id)
              temp = temp + 1
              console.log("Created")
            } else {
              temp = client.commandsCooldowns
              temp = temp[cooldown]
              console.log(temp)
              if(temp.tempToNext >= Date.now()) {
                console.log("Puni")
                if(temp.notified) return
                temp.notified = true
                temp.infractions += 1
                return interaction.reply({ content: "Aguarde alguns instantes para utilizar comandos."})
              }
            }
            temp.tempToNext = Date.now() + 2500*/
        
            await cmd.run(client, interaction)
        
          }

    }
}