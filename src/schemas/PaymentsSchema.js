const db = require("mongoose");

const PaymentModel = new db.Schema({ 
    paymentId: { type: Number },
    user: { type: String },
    status: {
        payment: { type: String },
        finished: { type: Boolean, default: false },
    },
    notify: {
        isNotified: { type: Boolean, default: false }
    },
    details: {
        payment: {
            url: { type: String },
            qrcode: { type: String }
        },
        product: { 
            id: { type: Number },
            description: { type: String },
            value: { type: Number },
         },
         method: { type: String },
         dates: {
            created: { type: Date },
            updated: { type: Date },
         }
    }
});


module.exports = db.model('PaymentsModel', PaymentModel);  