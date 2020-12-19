const mongoose = require('mongoose');

const { Schema } = mongoose;

const billingSchema = new Schema(
  {
    customer: String,
    amount: String,
    status: String,
    currency: String,
    type: String,
    sessionId: String,
    subscriptionId: String,
    isActive: Boolean,
    cancelAt: Date,
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
