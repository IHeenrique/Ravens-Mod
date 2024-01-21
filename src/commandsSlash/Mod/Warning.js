// Dependencies
const { Interaction, ApplicationCommandOptionType,ApplicationCommandType, Message, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require("discord.js")
const client = require("../../..")
const commandTraduction = require("../../traductions/Utility/ping")
const WarningSchema = require("../../schemas/WarningSchema")
const Logs = require("../../schemas/Logs")
const Warning = require("../../traductions/Mod/Warning")

// Exporting Command
module.exports = {
    name: "warn",
    type: ApplicationCommandType.ChatInput,
    description: "Warn members who break the rules",
    descriptionLocalizations: ({ 'en-US': "Warn members who break the rules",'pt-BR': 'Avise membros que quebram as regras','es-ES': "Advertir a los miembros que infrinjan las reglas." }),
    options: [
        {
            name: "user",
            nameLocalizations: ({ 'en-US': 'user','pt-BR': 'usuario','es-ES': "usuario" }),
            type: ApplicationCommandOptionType.User,
            description: 'Mention or insert user ID',
            descriptionLocalizations: ({ 'en-US': 'Mention or insert user ID','pt-BR': 'Mencione ou insira o id do usuario','es-ES': "Mencionar o insertar ID de usuario" }),
            required: true
        },
        {
            name: "reason",
            nameLocalizations: ({ 'en-US': 'reason','pt-BR': 'motivo','es-ES': "motivo" }),
            descriptionLocalizations: ({ 'en-US': "Choose the reason for punishment",'pt-BR': "Escolha o motivo da punição",'es-ES': "Elige el motivo del castigo" }),
            type: ApplicationCommandOptionType.String,
            description: "Choose the reason for punishment",
            autocomplete: true,
            required: false
        },
        {
            name: "attachment",
            nameLocalizations: ({ 'en-US': 'attachment','pt-BR': 'anexo','es-ES': "adjunto" }),
            descriptionLocalizations: ({ 'en-US': "Send a proof attachment",'pt-BR': "Envie um anexo de prova",'es-ES': "Enviar un archivo adjunto de prueba" }),
            type: ApplicationCommandOptionType.Attachment,
            description: "Envie um anexo de prova",
            required: false
        }

    ],

    /**
     * 
     * @param {client} client 
     * @param {Interaction} interaction
     * @returns 
     */
    run: async (client, interaction) => {
        
       let lang = interaction.locale || interaction.guild.preferredLocale || "enus"
       lang = lang.replace('-', '').toLowerCase()

       let traduction = Warning[lang]
       if(!traduction) traduction = Warning["enus"]

        if(!interaction.member.permissions.has(PermissionFlagsBits.KickMembers)) return interaction.reply({ content: `${traduction.error.missingPerms}`})
       
        let user = await interaction.options.getUser("user")
        if(!user) return interaction.reply({ content: `${traduction.error.missingUser}`})
        user = await client.users.cache.get(user.id);

        if(user.id == interaction.user.id) return interaction.reply({ content: `${traduction.error.selfWarn}`})
        if(user.id == interaction.guild.ownerId) return interaction.reply({ content: `${traduction.error.ownerPunishment}`})
        if(user.bot) return interaction.reply({ content: `${traduction.error.botPunishment}`})

        if(interaction.guild.members.cache.get(user.id) && interaction.guild.ownerId != interaction.user.id) {
            let userRole = interaction.guild.members.cache.get(user.id).roles.highest.position
            let modRole = interaction.member.roles.highest.position

            if(userRole >= modRole) return interaction.reply({ content: `${traduction.error.highRole}`})
        }

        let reason = interaction.options.getString("reason") || `${traduction.noReason}`
        let proof = interaction.options.getAttachment("attachment") || null
        let proofCode = null
        if(interaction.options.getAttachment("attachment")) {
            console.log(proof.size)
            if(proof.size > 20000000) {
                interaction.channel.send({ content: `${traduction.error.proofSize}`})
                proof = null
            }
            else proofCode = proof.url
        }
        
        const warn = new EmbedBuilder()
        .setAuthor({ name: user.username, iconURL: user.avatarURL()})
        .setTitle(`Warn`)
        .setDescription(`${traduction.warning.replace("{user}", `${user}`)}`)
        .addFields(
            {
                name: `${traduction.details}`,
                value: `**${traduction.user}**: ${user.username} (${user.id})\n**${traduction.reason}**: ${reason}\n**${traduction.attachment}**: ${proof ? `[${traduction.accessAttachment}](${proof.url})` : `${traduction.error.unavailable}`}`
            }
        )
        .setColor(`#eaa4a4`)
        .setTimestamp()

        const buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
            .setLabel(`${traduction.buttons.confirm}`)
            .setEmoji(`<:check:1195469163238535359>`)
            .setStyle(ButtonStyle.Success)
            .setCustomId("confirm"),
            new ButtonBuilder()
            .setLabel(`${traduction.buttons.cancel}`)
            .setEmoji(`<<:cancel:1195469261427183637>`)
            .setStyle(ButtonStyle.Secondary)
            .setCustomId("cancel"),
        )

        const msg = await interaction.reply({ embeds: [warn], components: [buttons]})
        const filter = (m) => m.member.id == interaction.user.id
        const collector = await msg.createMessageComponentCollector({ filter })

        collector.on("collect", async(interaction) => {
            switch(interaction.customId) {
                case "confirm": {
                    new WarningSchema({
                        server: interaction.guild.id,
                        user: user.id,
                        mod: interaction.user.id,
                        reason: reason,
                        proofCode: proofCode,
                        date: Date.now()
                    }).save().then(schema => {
                        new Logs({
                            type: "warn",
                            server: interaction.guild.id,
                        user: user.id,
                        mod: interaction.user.id,
                        reason: reason,
                        proofCode: proofCode,
                        date: Date.now(),
                        schema: schema.id,
                        }).save()
                    })
                    let error = false
                    //user.send({ content: "teste" }).catch(err => error = true)
                    let warned = new EmbedBuilder()
                    .setAuthor({ name: user.username, iconURL: user.avatarURL()})
                    .setTitle(`Warn`)
                    .setDescription(`${traduction.warned}`)
                    .setColor(`#23a55a`)
                    .setTimestamp()

                    await interaction.update({ embeds: [warned], components: []})
                    break;
                }
                case "cancel": {
                    let cancel = new EmbedBuilder()
                    .setAuthor({ name: user.username, iconURL: user.avatarURL()})
                    .setDescription(`${traduction.canceled}`)
                    .setColor(`#f23f43`)

                    await interaction.update({ embeds: [cancel], components: [] })
                    break;
                }
                default: {
                    return;
                }
            }
        })
        
    }
}