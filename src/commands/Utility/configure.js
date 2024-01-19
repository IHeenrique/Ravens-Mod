// Dependencies
const { Message, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js")
const client = require("../../..")
const commandTraduction = require("../../traductions/Utility/ping")
const Server = require("../../schemas/Server")

// Exporting Command
module.exports = {
    name: "configure",
    aliases: ["config"],
    guildOnly: false,
    /**
     * 
     * @param {client} client 
     * @param {Message} message 
     * @param {Array} args 
     */
    async run(client, message, args) {

        

        const main = new EmbedBuilder()
            .setAuthor({ name: message.author.username, iconURL: message.author.avatarURL() })
            .setTitle(`Página Inicial`)
            .addFields(
                {
                    name: `Punições Automáticas`,
                    value: `Cansado das pessoas que levam vários warns e não tem tanto controle? Utilize as punições automáticas e defina um valor de warns que um usuário pode recebar e qual será a punição.`
                },
                {
                    name: `Comandos Personalizados (Em Breve)`,
                    value: `Crie comandos personalizados pro seu servidor!`
                }
            )
            .setColor(`#ed77c4`)

        let puniAuto = new ButtonBuilder()
            .setEmoji(`<:punishmentkick:1195822902499618916>`)
            .setLabel(`Punições Automáticas`)
            .setCustomId(`puniAuto`)
            .setStyle(ButtonStyle.Primary)

        let customCmd = new ButtonBuilder()
            .setEmoji(`<:link:1196638503426064496> `)
            .setLabel(`Comandos Personalizados`)
            .setCustomId(`customCmd`)
            .setDisabled(true)
            .setStyle(ButtonStyle.Secondary)

        let row1 = new ActionRowBuilder().addComponents(puniAuto)
        let row2 = new ActionRowBuilder().addComponents(customCmd)

        const msg = await message.reply({ embeds: [main], components: [row1, row2] })
        const filter = (m) => m.member.id == message.author.id
        const collector = await msg.createMessageComponentCollector({ filter })

        collector.on("collect", async (interaction) => {

            if (interaction.customId !== "puniAuto") return

            let server = await Server.findOne({ server: message.guild.id }) || new Server({ server: message.guild.id })

            let punis = []





            let home = new ButtonBuilder()
                .setEmoji(`<:gohome:1195802126291587094>`)
                .setCustomId(`home`)
                .setStyle(ButtonStyle.Secondary)

            let createAuto = new ButtonBuilder()
                .setEmoji(`<:new:1196983840707723304>`)
                .setLabel(`Criar uma nova Punição Automática`)
                .setCustomId(`newPuniAuto`)
                .setStyle(ButtonStyle.Success)

            let edit = new ButtonBuilder()
                .setEmoji(`<:edit:1196985609714151503>`)
                .setLabel(`Editar uma Punição Automática`)
                .setCustomId(`editPuniAuto`)
                .setStyle(ButtonStyle.Primary)

            let deletePuni = new ButtonBuilder()
                .setEmoji(`<:lixeira:1196985744288391219>`)
                .setLabel(`Deletar uma Punição Automática`)
                .setCustomId(`delPuniAuto`)
                .setStyle(ButtonStyle.Danger)

            let row1 = new ActionRowBuilder().addComponents(home, createAuto)
            let row2 = new ActionRowBuilder().addComponents(edit)
            let row3 = new ActionRowBuilder().addComponents(deletePuni)

            if (!punis?.length) {
                edit.setDisabled(true)
                deletePuni.setDisabled(true)
                punis = [{ name: `Nenhuma configuração encontrada`, value: `Parece que nenhuma configuração foi encontrada no servidor, crie uma no **Botão Abaixo**!` }]
            }
            else {
                await server.configuration.autoPunishment.forEach(puni => {
                    punis.push({ name: `${puni.warns} Warns`, value: `Esta Punição Automática executa a ação de **${puni.type}**!`})
                })
            }

            const autoPunishment = new EmbedBuilder()
                .setAuthor({ name: message.author.username, iconURL: message.author.avatarURL() })
                .setTitle(`Punições Automáticas (${server.configuration.autoPunishment?.length}/5)`)
                .addFields(punis)
                .setColor(`#ed77c4`)

            const int = await interaction.update({ content: ``, embeds: [autoPunishment], components: [row1, row2, row3] })
            const filter = (i) => i.member.id == interaction.user.id
            const collector = await int.createMessageComponentCollector({ filter })

            collector.on("collect", async (interaction) => {
                if (interaction.customId === "newPuniAuto") {
                    const step1 = new EmbedBuilder()
                        .setAuthor({ name: message.author.username, iconURL: message.author.avatarURL() })
                        .setTitle(`Criando uma nova Punição Automática (1/3)`)
                        .setDescription(`Quantos warns serão necessários para executar essa punição? **Valor Mínimo: 1**`)
                        .setColor(`#ffc852`)

                    await interaction.update({ embeds: [autoPunishment], components: [] })
                    const filter = (i) => i.member.id == interaction.user.id
                    const collector = await interaction.channel.createMessageCollector({ filter, max: 1 })

                    collector.on("collect", async (mess) => {

        })
    }
})
        })


    }
}