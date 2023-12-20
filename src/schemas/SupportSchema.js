const db = require("mongoose")

const ModMailModel = new db.Schema({ 
    userID: { type: String, require: true},
    claimedBy: { type: String },
    topicTicket: { type: String, require: true},
    endTicket: { type: Boolean, default: false},
    channelID: { type: String},
    messageModMail: { type: Array}
});


module.exports = 
    db.model('ModMail', ModMailModel);
    
