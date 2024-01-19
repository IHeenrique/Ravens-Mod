// Dependencies
const { Message, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js")
const client = require("../../..")
const commandTraduction = require("../../traductions/Utility/ping")
const Server = require("../../schemas/Server")

// Exporting Command
module.exports = {
    name: "mine",
    aliases: [""],
    guildOnly: false,
    /**
     * 
     * @param {client} client 
     * @param {Message} message 
     * @param {Array} args 
     */
    async run(client, message, args) {

        const nick = args[0]

        const profile = new EmbedBuilder()
            .setAuthor({ name:`${nick} Profile's`, iconURL: `https://mc-heads.net/avatar/${nick}/100/nohelm` })
            .setDescription(`Em breve!`)

        message.reply({ embeds: [profile]})

    }
}