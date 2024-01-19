const { ButtonStyle, Emoji } = require("discord.js");
const db = require("mongoose");

const ServerModel = new db.Schema({ 
    user: { type: String },
    nickname: { type: String }
});


module.exports = db.model('Mines', ServerModel);