// Dependencies

const Discord = require("discord.js")

const fs = require("fs")
const path = require("path")

require("dotenv").config()

// Discord Client

const client = new Discord.Client({
    intents: 3276799,
    partials: [
        Discord.Partials.Message,
        Discord.Partials.Channel,
        Discord.Partials.GuildMember,
        Discord.Partials.GuildScheduledEvent,
        Discord.Partials.User
    ]
})

client.commands = new Discord.Collection()
client.aliases = new Discord.Collection()

module.exports = client

// Reading Commands Files (Only Ends With .js)

fs.readdirSync('./src/commands/').forEach(local => {
    const comandos = fs.readdirSync(`./src/commands/${local}`).filter(arquivo => arquivo.endsWith('.js'))

    for (let file of comandos) {
        let cmd = require(`./src/commands/${local}/${file}`)

        if (cmd.name) {
            client.commands.set(cmd.name, cmd)
        }
        if (cmd.aliases && Array.isArray(cmd.aliases))
            cmd.aliases.forEach(x => client.aliases.set(x, cmd.name))
    }
});

// Events Handle

const eventsPath = path.join(__dirname, './src/events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.disabled) return
    else if (event.once) {
        try {
            client.once(event.name, (...args) => event.execute(...args));
        } catch (e) {
            console.error(e);
        }

    } else {
        try {
            client.on(event.name, (...args) => event.execute(...args));
        } catch (e) {
            console.error(e);
        }
    }
}

// Client Logging

client.login(process.env.clientToken).then(() => {
    console.log("Online")
})

// Catch Errors

process.on("uncaughtException", (err) => {
    console.log('[ ✖️  Error ] ' + err.stack);
});
