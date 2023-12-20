const db = require("mongoose");

const ClientModel = new db.Schema({ 
    owner: { type: String },
    card: {
        name: { type: String },
        tier: { type: String, default: "SSS" }
    },
    uniqueId: { type: Number, default: 0 }
});


module.exports = db.model('RubyDexControl', ClientModel); 