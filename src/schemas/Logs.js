const { ButtonStyle, Emoji } = require("discord.js");
const db = require("mongoose");

const ServerModel = new db.Schema({ 
    type: { type: String },
    server: { type: String, require: true },
    user: { type: String, require: true },
    mod: { type: String, require: true },
    reason: { type: String, default: "Sem motivo" },
    date: { type: Date },
    proofCode: { type: String, default: null },
    schema: { type: String }
});

module.exports = db.model('Logs', ServerModel);