// Dependencies

const Discord = require("discord.js")

const fs = require("fs")
const path = require("path")
const axios = require("axios")
const mg = require('mongoose');
const { Manager } = require("erela.js");

require("dotenv").config()

// Discord Client

const nodes = [
    {
      "host": "ravens.squareweb.app",
      "port": 443,
      "secure": true,
      "password": "JqRfdlynPH7d7CHxKD5w28WU4yEeyHD0elHOOKxZ",
    }
  ];

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
client.slashCommands = new Discord.Collection()
client.testModels = [{ name: "support ticket", value: "support%20"}, { name: "Nexus", value: "nexus"}, { name: "appeal", value: "appeal"}]
client.manager = new Manager({
    nodes,
    send: (id, payload) => {
      const guild = client.guilds.cache.get(id);
      if (guild) guild.shard.send(payload);
    }
  });


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
require('./src/handler/index')(client)
client.login(process.env.clientToken).then(() => {
}) 

client.on("ready", async() => {
    client.user.setPresence({ activities: [{ name: `New Auto Punishment System!`, type: Discord.ActivityType.Playing }], status: 'online' })
})

mg.set("strictQuery", true);
mg.connect(process.env.dataBase, {}).then(() => {
    console.log("Database")
});

client.manager.on("nodeConnect", node => {
    console.log(`Node "${node.options.identifier}" connected.`)
})

// Emitted whenever a node encountered an error
client.manager.on("nodeError", (node, error) => {
    console.log(`Node "${node.options.identifier}" encountered an error: ${error.message}.`)
})

client.on("raw", d => client.manager.updateVoiceState(d));


// Catch Errors

process.on("uncaughtException", (err) => {
    console.log('[ ✖️  Error ] ' + err.stack);
});
