const mongoose = require('mongoose')

const seatSchema = new mongoose.Schema({
    seat_identifier: { type: String, required: true },
    seat_class: { type: String, required: true },
    is_booked: { type: Boolean, default: false }
})

module.exports = mongoose.model('Seat', seatSchema)