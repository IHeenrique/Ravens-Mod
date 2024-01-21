// Dependencies
const { Message, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require("discord.js")
const client = require("../../..")
const commandTraduction = require("../../traductions/Utility/ping")
const WarningSchema = require("../../schemas/WarningSchema")
const Logs = require("../../schemas/Logs")
const Warning = require("../../traductions/Mod/Warning")

// Exporting Command
module.exports = {
    name: "warn",
    aliases: ["avisar"],
    guildOnly: false,   
    /**
     * 
     * @param {client} client 
     * @param {Message} message 
     * @param {Array} args 
     */
    async run(client, message, args) {
        
        let lang = message.guild.preferredLocale || "enus"
       lang = lang.replace('-', '').toLowerCase()

       let traduction = Warning[lang]
       if(!traduction) traduction = Warning["enus"]
       

        if(!message.member.permissions.has(PermissionFlagsBits.KickMembers)) return message.reply({ content: `${traduction.error.missingPerms}`})
    
        let user = await message.mentions.members.first() || await client.users.cache.get(args[0]);
        if(!user || !args[0]) return message.reply({ content: `${traduction.error.missingUser}`})
        user = await client.users.cache.get(user.id);

        if(user.id == message.author.id) return message.reply({ content: `${traduction.error.selfWarn}`})
        if(user.id == message.guild.ownerId) return message.reply({ content: `${traduction.error.ownerPunishment}`})
        if(user.bot) return message.reply({ content: `${traduction.error.botPunishment}`})

        if(user.id )

        if(message.guild.members.cache.get(user.id) && message.guild.ownerId != message.author.id) {
            let userRole = message.guild.members.cache.get(user.id).roles.highest.position
            let modRole = message.member.roles.highest.position

            if(userRole >= modRole) return message.reply({ content: `${traduction.error.highRole}`})
        }

        let reason = args.slice(1).join(" ") || `${traduction.noReason}`
        let proof = message.attachments.first() || null
        let proofCode = null
        if(message.attachments.first()) {
            console.log(proof.size)
            if(proof.size > 20000000) {
                message.channel.send({ content: `${traduction.error.proofSize}`})
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

        const msg = await message.reply({ embeds: [warn], components: [buttons]})
        const filter = (m) => m.member.id == message.author.id
        const collector = await msg.createMessageComponentCollector({ filter })

        collector.on("collect", async(interaction) => {
            switch(interaction.customId) {
                case "confirm": {
                    new WarningSchema({
                        server: message.guildId,
                        user: user.id,
                        mod: message.author.id,
                        reason: reason,
                        proofCode: proofCode,
                        date: Date.now()
                    }).save().then(schema => {
                        new Logs({
                            type: "warn",
                            server: message.guildId,
                        user: user.id,
                        mod: message.author.id,
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