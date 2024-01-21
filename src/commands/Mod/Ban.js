// Dependencies
const { Message, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require("discord.js")
const client = require("../../..")
const Logs = require("../../schemas/Logs")

// Exporting Command
module.exports = {
    name: "ban",
    aliases: ["banir"],
    guildOnly: true,   
    /**
     * 
     * @param {client} client 
     * @param {Message} message 
     * @param {Array} args 
     */
    async run(client, message, args) {

        
    }
}