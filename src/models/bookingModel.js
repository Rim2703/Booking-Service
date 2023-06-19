const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const bookingSchema = new mongoose.Schema({
    seat_id: { type: ObjectId, ref: 'Seat', required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, trim: true },
    phone_number: { type: String, required: true },
    booking_id: { type: String, required: true },
    total_amount: { type: Number, required: true }
})

module.exports = mongoose.model('Booking', bookingSchema)