// Dependencies
const { Interaction, ApplicationCommandOptionType, ApplicationCommandType, Message, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, StringSelectMenuBuilder } = require("discord.js")
const client = require("../../..")
const commandTraduction = require("../../traductions/Utility/ping")
const WarningSchema = require("../../schemas/WarningSchema")
const Logs = require("../../schemas/Logs")
const Warning = require("../../traductions/Mod/Warning")
const ModLogs = require("../../traductions/Logs/ModLogs")
const getColors = require('get-image-colors');
const axios = require('axios');
const sharp = require('sharp');

const fs = require("fs")

// Exporting Command
module.exports = {
    name: "mod",
    type: ApplicationCommandType.ChatInput,
    description: "test",
    options: [
        {
            name: `logs`,
            type: ApplicationCommandOptionType.Subcommand,
            description: "View punishment logs",
            descriptionLocalizations: ({ 'en-US': "View punishment logs", 'pt-BR': 'Visualize os logs de punições', 'es-ES': "Ver registros de castigo" }),
            options: [
                {
                    name: "user",
                    nameLocalizations: ({ 'en-US': 'user', 'pt-BR': 'usuario', 'es-ES': "usuario" }),
                    type: ApplicationCommandOptionType.User,
                    description: 'Mention or insert user ID',
                    descriptionLocalizations: ({ 'en-US': 'Mention or insert user ID', 'pt-BR': 'Mencione ou insira o id do usuario', 'es-ES': "Mencionar o insertar ID de usuario" }),
                    required: true
                },
                {
                    name: "page",
                    nameLocalizations: ({ 'en-US': 'page', 'pt-BR': 'pagina', 'es-ES': "pagina" }),
                    type: ApplicationCommandOptionType.Number,
                    description: "Choose the log Page",
                    descriptionLocalizations: ({ 'en-US': "Choose the log Page", 'pt-BR': 'Escolha a pagina de log', 'es-ES': "Elija la página de registro" }),
                    required: false
                },
            ]
        },
        {
            name: `stats`,
            type: ApplicationCommandOptionType.Subcommand,
            description: "View mod stats",
            descriptionLocalizations: ({ 'en-US': "View mod stats", 'pt-BR': 'Visualize o stats do mod', 'es-ES': "Ver estadísticas de mod" }),
            options: [
                {
                    name: "mod",
                    nameLocalizations: ({ 'en-US': 'mod', 'pt-BR': 'mod', 'es-ES': "mod" }),
                    type: ApplicationCommandOptionType.User,
                    description: 'Mention or insert mod ID',
                    descriptionLocalizations: ({ 'en-US': 'Mention or insert mod ID', 'pt-BR': 'Mencione ou insira o id do mod', 'es-ES': "Mencionar o insertar ID de mod" }),
                    required: true
                },
            ]
        },
    ],

    /**
     * 
     * @param {client} client 
     * @param {Interaction} interaction
     * @returns 
     */
    run: async (client, interaction) => {

        const maxPerPage = 3

        let lang = interaction.locale || interaction.guild.preferredLocale || "enus"
        lang = lang.replace('-', '').toLowerCase()

        let traduction = ModLogs[lang]
        if (!traduction?.length) traduction = ModLogs["enus"]



        switch (interaction.options.getSubcommand()) {
            case "logs": {

                // URL da imagem do usuário

                interaction.member.timeout()

                let user = await interaction.options.getUser("user")
                user = await client.users.cache.get(user.id);

                const imageUrl = await user.avatarURL()
                let color = "#ff1f4a";

                // Faz o download da imagem


                axios.get(imageUrl, { responseType: 'arraybuffer' })
                    .then(response => {
                        // Converte o arquivo .webp em .png
                        return sharp(response.data).toFormat('png').toBuffer();
                    })
                    .then(pngBuffer => {
                        getColors(pngBuffer, 'image/png').then(colors => {
                            console.log(colors[0].hex())
                            color = colors[0].hex()
                          })
                    })

                console.log(color)

                const logs = await Logs.find({ server: interaction.guildId, user: user.id })
                const serverPunishments = await Logs.find({ server: interaction.guildId })

                if (!logs?.length) return interaction.reply({ content: `${traduction.error.noLogs.replace("{user}", `${user}`)}` })

                let page = await interaction.options.getNumber("page") || 1;
                page = page - 1

                let total = Math.ceil(logs.length / maxPerPage);

                if ((page + 1) > total || (page + 1) < 1) return interaction.reply({ content: `${traduction.error.general}` })

                let filtred = await Promise.all(logs.map(async (log) => {
                    let logCase = await serverPunishments.findIndex(x => x.id === log.id)
                    let mod = await client.users.cache.get(log.mod)
                    let date = new Date(log.date)
                    let timestamp = date.getTime();
                    return `> ${traduction.punishment} **${logCase + 1}**\n**${traduction.user}**: ${user.username} (${log.user})\n**${traduction.mod}**: ${mod.username} (${log.mod})\n**${traduction.reason}**: ${log.reason}\n**${traduction.attachments}**: ${log.proofCode ? `[${traduction.accessAttachments}](${log.proofCode})` : `${traduction.error.noAttachments}`}\n**${traduction.creationDate}**: <t:${Math.floor(timestamp / 1000)}>`
                }))

                filtred.reverse()

                let punishments = await filtred.slice(page * maxPerPage, (page * maxPerPage) + maxPerPage).map((e, i) => `${e}`).join("\n\n")

                const logsEmbed = new EmbedBuilder()
                    .setAuthor({ name: user.username, iconURL: user.avatarURL() })
                    .setTitle(`${traduction.embeds.viewLogs.replace("{page}", `${page + 1}`).replace("{total}", `${total}`)}`)
                    .setFooter({ text: `${traduction.embeds.found.replace("{logs}", `${logs.length}`)}` })
                    .setColor(`${color}`)
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

                const msg = await interaction.reply(component)
                const filter = (m) => m.member.id == interaction.user.id
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
                        if (interaction.customId === "home") {
                            page = 0
                            prev.setDisabled(true)
                            home.setDisabled(true)
                            next.setDisabled(false)
                            end.setDisabled(false)
                        }
                        if (interaction.customId === "end") {
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
                break;
            }
            case "stats": {
                let user = await interaction.options.getUser("mod")
                user = await client.users.cache.get(user.id);

                const logs = await Logs.find({ server: interaction.guildId, mod: user.id })
                let acertos = 0

                for (let data of logs) {
                    let log = await WarningSchema.findById(data.schema);
                    if (!log) return
                    acertos += 1
                }

                interaction.reply({ content: `Acertos: ${acertos}/${logs.length}` })
                break;
            }
            default: {
                return;
            }
        }

    }
}