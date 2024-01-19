const { ButtonStyle, Emoji } = require("discord.js");
const db = require("mongoose");

const ServerModel = new db.Schema({ 
    server: { type: String, require: true },
    user: { type: String, require: true },
    mod: { type: String, require: true },
    reason: { type: String, default: "Sem motivo" },
    date: { type: Date },
    proofCode: { type: String, default: null },
});

module.exports = db.model('Warns', ServerModel);