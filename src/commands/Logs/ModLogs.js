// Dependencies
const { Interaction, ApplicationCommandOptionType, ApplicationCommandType, Message, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, StringSelectMenuBuilder } = require("discord.js")
const client = require("../../..")
const commandTraduction = require("../../traductions/Utility/ping")
const WarningSchema = require("../../schemas/WarningSchema")
const Logs = require("../../schemas/Logs")
const Warning = require("../../traductions/Mod/Warning")
const ModLogs = require("../../traductions/Logs/ModLogs")

// Exporting Command
module.exports = {
    name: "modlogs",
    aliases: ["logs", "mod"],
    guildOnly: false,
    /**
     * 
     * @param {client} client 
     * @param {Message} message 
     * @param {Array} args 
     */
    async run(client, message, args) {

        const maxPerPage = 3

        let lang = message.guild.preferredLocale || "enus"
        lang = lang.replace('-', '').toLowerCase()

        console.log(lang)

        let traduction = ModLogs[lang]
        console.log(traduction)
        if(!traduction  ) traduction = ModLogs["enus"]

                let user = await message.mentions.members.first() || await client.users.cache.get(args[0]);
                if(!user || !args[0]) return message.reply({ content: `${traduction.error.missingUser}`})
                user = await client.users.cache.get(user.id);

                const logs = await Logs.find({ server: message.guildId, user: user.id })
                const serverPunishments = await Logs.find({ server: message.guildId })

                if (!logs?.length) return message.reply({ content: `${traduction.error.noLogs.replace("{user}", `${user}`)}` })

                let page = args[1] || 1;
                if(isNaN(page)) return message.reply({ content: `${traduction.error.nan}`})
                page = page - 1

                let total = Math.ceil(logs.length / maxPerPage);

                if((page + 1) > total || (page + 1) < 1) return message.reply({ content: `${traduction.error.general}`})

                let filtred = await Promise.all(logs.map(async (log) => {
                    let logCase = await serverPunishments.findIndex(x => x.id === log.id)
                    let mod = await client.users.cache.get(log.mod)
                    let date = new Date(log.date)
                    let timestamp = date.getTime();
                    return `> ${traduction.punishment} **${logCase + 1}**\n**${traduction.user}**: ${user.username} (${log.user})\n**${traduction.mod}**: ${mod.username} (${log.mod})\n**${traduction.reason}**: ${log.reason}\n**${traduction.attachments}**: ${log.proofCode ? `[${traduction.accessAttachment}](${log.proofCode})` : `${traduction.error.noAttachments}`}\n**${traduction.creationDate}**: <t:${Math.floor(timestamp / 1000)}>`
                }))

                filtred.reverse()

                let punishments = await filtred.slice(page * maxPerPage, (page * maxPerPage) + maxPerPage).map((e, i) => `${e}`).join("\n\n")

                const logsEmbed = new EmbedBuilder()
                    .setAuthor({ name: user.username, iconURL: user.avatarURL() })
                    .setTitle(`${traduction.embeds.viewLogs.replace("{page}", `${page + 1}`).replace("{total}", `${total}`)}`)
                    .setFooter({ text: `${traduction.embeds.found.replace("{logs}", `${logs.length}`)}` })
                    .setColor(`#ff1f4b`)
                    .setDescription(punishments)

                let home = new ButtonBuilder()
                    .setEmoji(`<:gohome:1195802126291587094>`)
                    .setDisabled(true)
                    .setCustomId(`home`)
                    .setStyle(ButtonStyle.Secondary)

                let end = new ButtonBuilder()
                    .setEmoji(`<:goend:1195802656703262740>`)
                    .setDisabled(false)
                    .setCustomId(`end`)
                    .setStyle(ButtonStyle.Secondary)

                let prev = new ButtonBuilder()
                    .setDisabled(true)
                    .setEmoji(`<:goprev:1195802174207311992>`)
                    .setCustomId(`prev`)
                    .setStyle(ButtonStyle.Danger)

                let next = new ButtonBuilder()
                    .setDisabled(false)
                    .setEmoji(`<:gonext:1195802633131274360>`)
                    .setCustomId(`next`)
                    .setStyle(ButtonStyle.Success)

                const actions = new ActionRowBuilder().addComponents(home, prev, next, end)

                let component = ({ embeds: [logsEmbed] })
                if (total > 1) component = ({ embeds: [logsEmbed], components: [actions] })

                const msg = await message.reply(component)
                const filter = (m) => m.member.id == message.author.id
                const collector = await msg.createMessageComponentCollector({ filter })

                collector.on("collect", async (interaction) => {
                    if (interaction.customId === "prev" || interaction.customId === "next" || interaction.customId === "home" || interaction.customId === "end") {
                        if (interaction.customId === "prev") {
                            page--
                            // Manipulando Botão "Anterior"
                            if (page == 0) {
                                prev.setDisabled(true)
                                home.setDisabled(true)
                            }
                            if (page >= 1) {
                                prev.setDisabled(false)
                                home.setDisabled(false)
                            }
                            // Manipulando Botão "Próximo"
                            if (page < total - 1) {
                                next.setDisabled(false)
                                end.setDisabled(false)
                            }
                            if (page == total - 1) {
                                next.setDisabled(true)
                                end.setDisabled(true)
                            }
                        }
                        if (interaction.customId === "next") {
                            page++
                            // Manipulando Botão "Próximo"
                            if (page == total) {
                                next.setDisabled(false)
                                end.setDisabled(false)
                            }
                            if (page == total - 1) {
                                next.setDisabled(true)
                                end.setDisabled(true)
                            }
                            // Manipulando Botão "Anterior"     
                            if (page >= 1) {
                                prev.setDisabled(false)
                                home.setDisabled(false)
                            }
                            if (page == 0) {
                                prev.setDisabled(true)
                                home.setDisabled(true)
                            }
                        }
                        if(interaction.customId === "home") {
                            page = 0
                            prev.setDisabled(true)
                            home.setDisabled(true)
                            next.setDisabled(false)
                                end.setDisabled(false)
                        }
                        if(interaction.customId === "end") {
                            page = total - 1
                            prev.setDisabled(false)
                            home.setDisabled(false)
                            next.setDisabled(true)
                                end.setDisabled(true)
                        }
                        let punishments = await filtred.slice(page * maxPerPage, (page * maxPerPage) + maxPerPage).map((e, i) => `${e}`).join("\n\n")

                        logsEmbed.setDescription(punishments)
                        .setTitle(`${traduction.embeds.viewLogs.replace("{page}", `${page + 1}`).replace("{total}", `${total}`)}`)

                        
                        interaction.update({ embeds: [logsEmbed], components: [actions] })

                    }
                })
        

    }
}