const db = require("mongoose");

const ClientModel = new db.Schema({ 
    type: { type: String },
    name: { type: String },
    data: { type: Buffer }
});


module.exports = db.model('Images', ClientModel); 