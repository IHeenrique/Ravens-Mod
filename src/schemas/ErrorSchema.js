const db = require("mongoose");

const ErrorModel = new db.Schema({ 
    commandName: { type: String },
    errorDate: { type: Date },
    userID: { type: String },
    status: { type: String, default: "Repported"},
    error: { type: String },
});


module.exports = db.model('Errors', ErrorModel);