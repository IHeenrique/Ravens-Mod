const db = require("mongoose");

const ServerModel = new db.Schema({ 
    guildID: { type: String, require: true, unique: true},
    prefix: { type: String, default: "k." },
    betaOption: { type: Boolean, default: false }
});


module.exports = db.model('ServerConfig', ServerModel);