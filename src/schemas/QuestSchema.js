const db = require("mongoose");

const QuestModel = new db.Schema({ 
    userID: { type: String, require: true, unique: true},
    rollUses: { type: Number, default: 0 },
    dailyUses: { type: Number, default: 0 },
    cardStarsGet: {
        stars3: { type: Number, default: 0},
        stars4: { type: Number, default: 0},
        stars5: { type: Number, default: 0},
        stars5E: { type: Number, default: 0},
        stars6SECRET: { type: Number, default: 0}
    }
});


module.exports = db.model('QuestsData', QuestModel);