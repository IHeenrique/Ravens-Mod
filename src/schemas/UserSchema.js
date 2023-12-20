const db = require("mongoose");

const ClientModel = new db.Schema({ 
    userID: { type: String, require: true, unique: true},
    userLanguage: { type: String, enum: ["ptbr", "enus", "eses"], default: "ptbr"},

    premium: { 
        status: { type: Boolean, default: false },
        expiration: { type: Date }
     },
    
    partner: { type: Boolean, default: false },
    verified: { type: Boolean, default: false },
    tester: { type: Boolean, default: false },
    commandAutorization: { type: Boolean, default: false },
    colaborator: { type: Boolean, default: false },
    profile: { 
        banner: { type: String },
    },
    upgrades: [{ id: Number, level: { type: Number, default: 0} }],
    coins: { type: Number, default: 0},
    stardust: { type: Number, default: 0},
    quests: {
        questsConcluided: [],
    },
    autoroll: { type: Boolean, default: false },
    roll: {
        configAutoDelete: {
            B: { type: Boolean, default: false },
            A: { type: Boolean, default: false },
            S: { type: Boolean, default: false },
            SS: { type: Boolean, default: false },
        }
    },
    cooldowns: {
        daily: { type: Date },
    },
    lembretes: {
        roll: {
            active: { type: Boolean, default: false },
            date: { type: Date }
        },
    },
    vote: {
        voted: { type: Boolean, default: false },
        totalVotes: { type: Number, default: 0 },
        voteExpireIn: { type: Date },
        voteClaimed: { type: Boolean, default: false },
        voteMessage: { type: String },
        voteChannel: { type: String }
    },
});


module.exports = db.model('Users', ClientModel);