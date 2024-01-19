// Dependencies
const { Interaction, ApplicationCommandOptionType,ApplicationCommandType, Message, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require("discord.js")
const client = require("../../..")
const commandTraduction = require("../../traductions/Utility/ping")
const WarningSchema = require("../../schemas/WarningSchema")
const Logs = require("../../schemas/Logs")
const Warning = require("../../traductions/Mod/Warning")
const ms = require("ms")
const getColors = require('get-image-colors');
const axios = require('axios');
const sharp = require('sharp');

// Exporting Command
module.exports = {
    name: "reminder",
    type: ApplicationCommandType.ChatInput,
    description: "Warn members who break the rules",
    descriptionLocalizations: ({ 'en-US': "Warn members who break the rules",'pt-BR': 'Avise membros que quebram as regras','es-ES': "Advertir a los miembros que infrinjan las reglas." }),
    options: [
        {
            name: "method",
            nameLocalizations: ({ 'en-US': 'method','pt-BR': 'method','es-ES': "method" }),
            type: ApplicationCommandOptionType.String,
            description: 'Mention or insert user ID',
            descriptionLocalizations: ({ 'en-US': 'Mention or insert user ID','pt-BR': 'Mencione ou insira o id do usuario','es-ES': "Mencionar o insertar ID de usuario" }),
            required: true,
            choices: [
                {
                    name: `DM Notification`,
                    value: `dm`
                },
                {
                    name: `This Channel Notification`,
                    value: `channel`
                }
            ]
        },
        {
            name: "timestamp",
            nameLocalizations: ({ 'en-US': 'timestamp','pt-BR': 'timestamp','es-ES': "timestamp" }),
            descriptionLocalizations: ({ 'en-US': "Choose the reason for punishment",'pt-BR': "Escolha o motivo da punição",'es-ES': "Elige el motivo del castigo" }),
            type: ApplicationCommandOptionType.String,
            description: "Choose the reason for punishment",
            autocomplete: true,
            required: true
        },
        {
            name: "name",
            nameLocalizations: ({ 'en-US': 'name','pt-BR': 'nome','es-ES': "nombre" }),
            type: ApplicationCommandOptionType.String,
            description: 'Choose a name to identify the reminder',
            descriptionLocalizations: ({ 'en-US': 'Choose a name to identify the reminder','pt-BR': 'Escolha um nome para identificar o lembrete','es-ES': "Elija un nombre para identificar el recordatorio" }),
            required: true,
        },
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
       if(!traduction?.length) traduction = Warning["enus"]

        let milisec = await interaction.options.getString("timestamp");
        if(milisec.toLowerCase == "err") return;

        let number = parseFloat(milisec)

        const imageUrl = await interaction.user.avatarURL()
        console.log(imageUrl)
        let color2 = "#302c34";

        await axios.get(imageUrl, { responseType: 'arraybuffer' })
            .then(response => {
                // Converte o arquivo .webp em .png
                return sharp(response.data).toFormat('png').toBuffer();
            })
            .then(pngBuffer => {
                getColors(pngBuffer, 'image/png').then(colors => {
                    console.log(colors[0].hex())
                    color2 = colors[0].hex()
                  })
            })


        let cancel = new ButtonBuilder()
        .setEmoji(`<:cancel:1196638409255567440>`)
        .setCustomId(`cancel`)
        .setStyle(ButtonStyle.Secondary)

        let confirm = new ButtonBuilder()
        .setEmoji(`<:check:1196638474292428861>`)
        .setCustomId(`confirm`)
        .setStyle(ButtonStyle.Success)

        let actions = new ActionRowBuilder().addComponents(confirm, cancel)

        let confirmEmbed = new EmbedBuilder()
        .setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL() })
        .setColor(color2)
        .setDescription(`Você está criando um Reminder, você será notificado <t:${Math.floor((Date.now() + number) / 1000)}:R>! Por favor confirme que está tudo correto`)

        interaction.reply({ embeds: [confirmEmbed], components: [actions]})

        
    }
}