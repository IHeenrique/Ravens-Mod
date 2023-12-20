const Discord = require("discord.js")
const RubyDex = require("../../schemas/RubyDex")
const Ravens = require("../../controllers/ravensGeral")
const UserSchema = require("../../schemas/UserSchema")
const ErrorSchema = require("../../schemas/ErrorSchema")
const client = require("../../..")

module.exports = {
    name: "cards",
    aliases: ["dex", "cartas"],
    avaliable: true,
    manutence: false,
    onlyTeam: false,
    /**
     * 
     * @param {client} client 
     * @param {Discord.Message} message 
     * @param {*} args 
     */
    run: async (client, message, args) => {

        try {

            async function reloadCommand(msg, type) {
                let command = client.commands.get("cards")
                command.run(client, message, args)
            }

            let reciclarMenu = []

            let member = message.mentions.members.first() || client.users.cache.get(args[0]) || message.author
            member = await client.users.cache.get(member.id)

            let userModel = await UserSchema.findOne({ userID: member.id }) || new UserSchema({ userID: member.id })
            let dexModel = await RubyDex.find({ owner: member.id }) || new RubyDex({ owner: member.id })

            let details = {
                tiers: {
                    B: { emoji: "<:TB:1185306285856530565>", registerId: false },
                    A: { emoji: "<:TA:1185306072341291139>", registerId: false },
                    S: { emoji: "<:TS:1185305945362944133>", registerId: false },
                    SS: { emoji: "<:TSS:1185305852043874315>", registerId: false },
                    SSS: { emoji: "<:SSS:1185306121204928622>", registerId: true },
                    U: { emoji: "<:TU:1185305730140614716>", registerId: true },
                },
                values: {
                    space: { default: 100, premium: 200 },
                    maxPerPage: { default: 10 }
                },
            }

            let allCards = dexModel.sort((a, b) => a.unique.id - b.unique.id)
            allCards = allCards.sort((a, b) => b.card.inicialValue - a.card.inicialValue)

            let cards = await Promise.all(allCards.map(async (data) => {
                if (!data) return
                return `**${details.tiers[data.card.tier].emoji} ${data.card.name} ${details.tiers[data.card.tier].registerId ? `| #${data.unique.id}` : ""}**`
            }))

            let pageChoiced = 0

            let totalPag = Math.ceil(cards.length / details.values.maxPerPage["default"])

            let cardsShow = await cards.slice(pageChoiced * details.values.maxPerPage["default"], (pageChoiced * details.values.maxPerPage["default"]) + details.values.maxPerPage["default"]).map((e, i) => `${(i + 1) + pageChoiced * details.values.maxPerPage["default"]}. ${e}`).join("\n> ")

            allCards.slice(pageChoiced * details.values.maxPerPage["default"], (pageChoiced * details.values.maxPerPage["default"]) + details.values.maxPerPage["default"]).forEach(data => {
                reciclarMenu.push({ label: `Reciclar ${data.card.name} ${details.tiers[data.card.tier].registerId ? `| #${data.unique.id}` : ""}`, description: `O Valor da Carta: ${data.card.inicialValue}`, value: `${data.id}`, emoji: details.tiers[data.card.tier].emoji })
            })

            if (!dexModel?.length) cardsShow = `**<:SaberCry:1132848003405856880> Você não possui nenhuma Carta em seu Dex!**`
            else if (!cardsShow?.length) cardsShow = `**<:SaberCry:1132848003405856880> Esta página não possui Cartas!**`

            let invViewer = new Discord.EmbedBuilder()
                .setAuthor({ name: member.username, iconURL: member.avatarURL() })
                .setColor(`#e8b556`)
                .setDescription(`Boas-vindas ao Dex de Cartas Rubys, aqui você poderá ver todos os seus Personagens! Veja abaixo:\n\nEMOJI_KIMMECOINS Você possui: -\n\n> ${cardsShow.toString()}`)
                .setFooter({ text: `Página • ${pageChoiced + 1}/${totalPag} | Total de Cartas • ${dexModel.length}` })

            let infoSpace = new Discord.ButtonBuilder()
                .setCustomId(`onlyinformation`)
                .setLabel(`Espaço de Cartas: ${dexModel.length}/${details.values.space[userModel.premium ? "premium" : "default"]}`)
                .setDisabled(true)
                .setStyle(Discord.ButtonStyle.Primary)

            let prev = new Discord.ButtonBuilder()
                .setLabel(`Anterior`)
                .setDisabled(true)
                .setCustomId(`prev`)
                .setStyle(Discord.ButtonStyle.Danger)

            let next = new Discord.ButtonBuilder()
                .setLabel(`Próximo`)
                .setDisabled(false)
                .setCustomId(`next`)
                .setStyle(Discord.ButtonStyle.Success)

            if (totalPag < 2) next.setDisabled(true)

            let menu = new Discord.StringSelectMenuBuilder()
                .setCustomId(`reciclar`)
                .setPlaceholder("Clique para Reciclar Cartas")
                .setMaxValues(reciclarMenu.length)
                .setOptions(reciclarMenu)

            let delThisPage = new Discord.ActionRowBuilder().addComponents(
                new Discord.ButtonBuilder()
                    .setLabel(`Deletar esta página inteira [Não pode ser desfeito]`)
                    .setDisabled(true)
                    .setCustomId(`delthispage`)
                    .setStyle(Discord.ButtonStyle.Secondary)
            )

            let row1 = new Discord.ActionRowBuilder().addComponents(prev, infoSpace, next)

            let delCards = new Discord.ActionRowBuilder().addComponents(menu)

            let components = [row1, delThisPage, delCards]

            if (!dexModel?.length || member.id !== message.author.id) components = [row1]

            let dexMessage = await message.reply({ embeds: [invViewer], components: components })
            const filter = (m) => m.member.id === message.author.id
            const collector = await dexMessage.createMessageComponentCollector({ filter })


            collector.on("collect", async (interaction) => {

                let id = interaction.customId
                if (id === "prev" || id === "next") {
                    if (id === "prev") {
                        pageChoiced--
                        // Manipulando Botão "Anterior"
                        if (pageChoiced == 0) prev.setDisabled(true)
                        if (pageChoiced >= 1) prev.setDisabled(false)
                        // Manipulando Botão "Próximo"
                        if (pageChoiced < totalPag - 1) next.setDisabled(false)
                        if (pageChoiced == totalPag - 1) next.setDisabled(true)
                    }
                    if (id === "next") {
                        pageChoiced++
                        // Manipulando Botão "Próximo"
                        if (pageChoiced == totalPag) next.setDisabled(false)
                        if (pageChoiced == totalPag - 1) next.setDisabled(true)
                        // Manipulando Botão "Anterior"     
                        if (pageChoiced >= 1) prev.setDisabled(false)
                        if (pageChoiced == 0) prev.setDisabled(true)
                    }
                    let newReciclarMenu = []
                    let cardsShow = await cards.slice(pageChoiced * details.values.maxPerPage["default"], (pageChoiced * details.values.maxPerPage["default"]) + details.values.maxPerPage["default"]).map((e, i) => `${(i + 1) + pageChoiced * details.values.maxPerPage["default"]}. ${e}`).join("\n> ")
                    let allCards = dexModel.sort((a, b) => a.unique.id - b.unique.id)
                    allCards = allCards.sort((a, b) => b.card.inicialValue - a.card.inicialValue)
                    allCards.slice(pageChoiced * details.values.maxPerPage["default"], (pageChoiced * details.values.maxPerPage["default"]) + details.values.maxPerPage["default"]).forEach(data => {
                        newReciclarMenu.push({ label: `Reciclar ${data.card.name} ${details.tiers[data.card.tier].registerId ? `| #${data.unique.id}` : ""}`, description: `O Valor da Carta: ${data.card.inicialValue}`, value: `${data.id}`, emoji: details.tiers[data.card.tier].emoji })
                    })
                    console.log(newReciclarMenu)
                    menu.setMaxValues(newReciclarMenu.length)
                    menu.setOptions(newReciclarMenu)
                    invViewer.setDescription(`Boas-vindas ao Dex de Cartas Rubys, aqui você poderá ver todos os seus Personagens! Veja abaixo:\n\nEMOJI_KIMMECOINS Você possui: ${await Ravens.economy.getRubys(member.id)}\n\n> ${cardsShow.toString()}`)
                    invViewer.setFooter({ text: `Página • ${pageChoiced + 1}/${totalPag} | Total de Cartas • ${dexModel.length}` })
                    await interaction.update({ embeds: [invViewer], components: components, fetchReply: true })
                } if (id === "reciclar") {
                    let confirmButton = new Discord.ButtonBuilder()
                        .setLabel(`Confirmar`)
                        .setDisabled(false)
                        .setCustomId(`confirm`)
                        .setStyle(Discord.ButtonStyle.Success)

                    let cancelButton = new Discord.ButtonBuilder()
                        .setLabel(`Cancelar`)
                        .setDisabled(false)
                        .setCustomId(`cancel`)
                        .setStyle(Discord.ButtonStyle.Danger)

                    let buttons = new Discord.ActionRowBuilder().addComponents(confirmButton, cancelButton)
                    await interaction.update({ content: `Você tem certeza que deseja reciclar as ${interaction.values.length} cartas? (Versão TESTE sem recompensa)`, components: [buttons], embeds: [], fetchReply: true })
                    const filter = (m) => m.member.id === message.author.id
                    const reciclar = await dexMessage.createMessageComponentCollector({ filter })

                    reciclar.on("collect", async (rec) => {
                        if (rec.customId === "cancel") {
                            await dexMessage.delete()
                            await reloadCommand(rec, "interaction")
                        }
                        if (rec.customId === "confirm") {
                            for (let schema of interaction.values) {
                                try {
                                    let dex = await RubyDex.findById(schema)
                                    if (!dex) return

                                    await dex.deleteOne()
                                } catch (err) {
                                    return
                                }
                            }
                            await dexMessage.delete()
                            await reloadCommand(rec, "interaction")
                        }
                    })

                }
            })

        } catch (err) {
            new ErrorSchema({
                commandName: "Cartas",
                userID: message.author.id,
                errorDate: Date.now(),
                error: err
            }).save().then((error) => {

                const embedErr = new Discord.EmbedBuilder()
                    .setTitle(`<:SaberCry:1132848003405856880> Ocorreu um Erro`)
                    .setDescription(`${message.author} Infelizmente ocorreu um erro ao executar o seu comando, por favor tente novamente ou contate nosso suporte!`)
                    .addFields(
                        {
                            name: "ID para suporte",
                            value: `**${error.id}**`
                        }
                    )
                    .setFooter({ text: `Nos ajude a melhorar reportando este erro` })
                    .setColor(`#2578f5`)

                const serverBtn = new Discord.ActionRowBuilder().addComponents(
                    new Discord.ButtonBuilder()
                        .setURL(`https://discord.gg/Nk6Hg3XE4s`)
                        .setLabel(`Servidor de Suporte`)
                        .setStyle(Discord.ButtonStyle.Link)
                )

                message.reply({ embeds: [embedErr], components: [serverBtn] })

            })
        }

    }
}