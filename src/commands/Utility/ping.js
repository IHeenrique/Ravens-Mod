// Dependencies
const { Message } = require("discord.js")
const client = require("../../..")
const commandTraduction = require("../../traductions/Utility/ping")

// Exporting Command
module.exports = {
    name: "ping",
    aliases: ["latency"],
    guildOnly: false,
    /**
     * 
     * @param {client} client 
     * @param {Message} message 
     * @param {Array} args 
     */
    async run(client, message, args) {
        // Traduction System
        args.includes
        let traduction = commandTraduction[process.env.defaultUserLang]

        // Send Message
        let pingMessage = await message.channel.send({ content: `🏓 → ${traduction.calculePing}` })
        // Editing Message with Results
        await pingMessage.edit({ content: `${traduction.latencyResults}:\n\nAPI → **${client.ws.ping}ms**\nMessage → **${pingMessage.createdTimestamp - message.createdTimestamp}ms**`})
    }
}