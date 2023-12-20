// Dependencies
const { Events, Message } = require("discord.js");
const client = require("../..");

// Exporting Event
module.exports = {
    name: Events.MessageCreate,
    disabled: false,
    once: false,
    /**
     * 
     * @param {Message} message 
     */
    async execute(message) {

        // Verifyng Author is a User
        if (message.author.bot) return

        const prefix = process.env.defaultPrefix // Default Prefix (!)

        if(!message.content.toLowerCase().startsWith(prefix.toLowerCase())) return

        // Getting Args (Prefix is not Incluided)
        const args = message.content.slice(prefix.length).trim().split(/ +/g);

        let command = args.shift().toLowerCase()
        if (command.length === 0) return;
        let Command = client.commands.get(command)
        if (!Command) Command = client.commands.get(client.aliases.get(command))

        // Permissions to execute the command
        if (command.guildOnly) if (!message.guild) return message.reply({ content: `This command only Accepts **Guild Execute**`})

        try {
            // Run Command
            Command.run(client, message, args)
        } catch(err) {
            console.error(err)
        }
    }
}