const db = require("mongoose");

const ClientModel = new db.Schema({ 
    owner: { type: String },
    card: {
        name: { type: String },
        inicialValue: { type: Number, default: 0 },
        tier: { type: String, default: "B" },
        url: { type: String }
    },
    unique: {
        id: { type: Number, default: 0 },
        schema: { type: String }
    }
    /*cardName: { type: String },
    cardValue: { type: Number },
    cardTier: {
        starsCount: { type: Number },
        starsLevel: { type: String }
    },
    cardPronums: { type: String },
    cardHEX: { type: String },
    cardURL: { type: String },
    evolveDetails: { 
        canEvolve: { type: Boolean, default: false },
        quantityToEvolve: { type: Number },
        needs: {
            lingotes: { type: Number },
        }
     },
    controlID: { type: String },
    gettingID: { type: Number},
    stats: {
        hp: {
            defaultHP: { type: Number },
            nowHP: { type: Number } 
        }
    }*/
});


module.exports = db.model('RubyDex', ClientModel); 