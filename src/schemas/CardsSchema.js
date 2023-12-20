const db = require("mongoose");

const CardsSchema = new db.Schema({ 
    cardName: { type: String },
    cardValue: { type: Number, default: "0" },
    cardPronums: { type: String },
    cardStarsCount: { type: Number },
    cardStarsLevel:  { type: String, default: "Normal" },
    cardHEX: { type: String, default: "none"},
    cardURL: { type: String },
});


module.exports = db.model('CardsRegistred', CardsSchema);