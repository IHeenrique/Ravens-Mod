const { ButtonStyle, Emoji } = require("discord.js");
const db = require("mongoose");

const ServerModel = new db.Schema({ 
    server: { type: String, require: true, unique: true},
    configuration: {
        autoPunishment: []
    }
});


module.exports = db.model('ServerData', ServerModel);