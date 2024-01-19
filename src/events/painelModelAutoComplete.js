const { Events } = require("discord.js");
const client = require("../..");
const Server = require("../schemas/Server");
const ms = require("ms")

module.exports = {
    name: Events.InteractionCreate,
    disabled: false,
    once: false,

    /**
     * 
     * @param {import("discord.js").Interaction} interaction 
     */
    async execute(interaction) {

        async function getType(time) {
            const leters = time.match(/[a-zA-Z]+/g);

            // Verifique se há letras e junte-as
            const onlyleters = leters ? leters.join('') : '';

            const numbers = time.match(/\d+/g);

            // Verifique se há números e junte-os
            const onlyNumbers = numbers ? numbers.join('') : '';

            switch (onlyleters.toLowerCase()) {
                case "anos":
                case "ano":
                case "años":
                case "año":
                case "a":
                    return onlyNumbers + "y";
        
                case "semanas":
                case "semana":
                case "sem":
                case "se":
                    return onlyNumbers + "w";
        
                case "dias":
                case "dia":
                case "d":
                    return onlyNumbers + "d";
        
                case "horas":
                case "hora":
                case "h":
                    return onlyNumbers + "h";
        
                case "segundos":
                case "segundo":
                case "seg":
                case "s":
                    return onlyNumbers + "s";
        
                case "milisegundos":
                case "milissegundo":
                case "ms":
                    return onlyNumbers + "ms";
        
                default:
                    return "1 ms";
            }
        }
        if (!interaction.isAutocomplete) return;
        switch (interaction.commandName) {
            case "warn": {
                const painel = interaction.options.getFocused();

                const models = [
                    { punishment: painel, val: painel },
                    { punishment: "Spam [🐧 Padrão]", val: "Spam" },
                    { punishment: "Flood [🐧 Padrão]", val: "Flood" },
                    { punishment: "Ofensa [🐧 Padrão]", val: "Ofensa" },
                ]
                if (!painel || !painel?.length) models[0] = ({ punishment: "Sem motivo", val: "Sem motivo" })
                serverModel = await Server.findOne({ server: interaction.guild.id }) || new Server({ server: interaction.guild.id });
                serverModel.punishments.forEach(model => {
                    models.push({ modelName: model.name, value: model.id });
                });

                const filtered = models.filter(model => model.punishment.toLowerCase().startsWith(painel.toLowerCase()));

                let response = filtered.map(model => ({ name: model.punishment, value: model.val }));

                if (!response?.length) response = [{ name: painel, value: painel }];

                interaction.respond(response.slice(0, 10));
            }
            case "reminder": {

                let time = interaction.options.getFocused();
                let response = [];

                if (!isNaN(time)) {
                    time = time * 1000;
                    if (ms(time) <= 5000) {
                        response = [{ name: `The time needs to be at least 5 seconds`, value: `err` }];
                    } else {
                        response = [{ name: `⏰ in ${ms(time, { long: true })}`, value: `${time}` }];
                    }
                } else {
                    let type = await getType(time)
                    if (ms(type) <= 5000) {
                        response = [{ name: `The time needs to be at least 5 seconds`, value: `err` }];
                    } else {
                        response = [{ name: `⏰ in ${ms(ms(type), { long: true })}`, value: `${ms(type)}` }];
                    }
                }

                console.log(response);

                if (!response?.length) {
                    response = [{ name: `Error`, value: `err` }];
                }

                interaction.respond(response.slice(0, 10));

            }
        }
    }
}