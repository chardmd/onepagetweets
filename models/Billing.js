const mongoose = require('mongoose');

const { Schema } = mongoose;

const billingSchema = new Schema(
  {
    customer: String,
    amount: String,
    status: String,
    created: Date,
    paymentMethod: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

const Billing = mongoose.model('Billing', billingSchema);

module.exports = Billing;
