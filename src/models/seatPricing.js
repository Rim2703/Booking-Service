const mongoose = require('mongoose')

const seatPricingSchema = new mongoose.Schema({
    seat_class: { type: String, required: true },
    min_price: { type: Number },
    normal_price: { type: Number },
    max_price: { type: Number }
})

module.exports = mongoose.model('SeatPricing', seatPricingSchema)
