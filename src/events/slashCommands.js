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

        if (interaction.type === Discord.InteractionType.ApplicationCommand) {
            
            const cmd = client.slashCommands.get(interaction.commandName);
        
            interaction["member"] = interaction.guild.members.cache.get(interaction.user.id);
        
            await cmd.run(client, interaction)
        
          }

    }
}