// Dependencies
const { Message } = require("discord.js")
const client = require("../../..")

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
        // Send Message
        let pingMessage = await message.channel.send({ content: `Calculating Ping` })

        // Editing Message with Results
        await pingMessage.edit({ content: `🔎 Latency Results:\n\nAPI → **${client.ws.ping}ms**\nMessage → **${pingMessage.createdTimestamp - message.createdTimestamp}ms**`})
    }
}