const db = require("mongoose");

const PaymentModel = new db.Schema({
    userID: { type: String },
    type: { type: String, enum: ["Payment"], default: "Payment" },
    action: { type: String, enum: ["Add", "Remove"] },
    toOrFor: { type: String },
    date: { type: Date }
});


module.exports = db.model('PaymentsLogs', PaymentModel);