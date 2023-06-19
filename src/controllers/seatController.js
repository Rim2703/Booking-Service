const Seat = require('../models/seatModel')
const SeatPricing = require('../models/seatPricing')

// Get all seats in sorted order
const getSeats = async (req, res) => {
    try {
        const seats = await Seat.find().sort('seat_class seat_identifier')
        return res.status(200).send({ status: true, data: seats })

    } catch (err) {
        return res.status(500).json({ status: false, error: err.message })
    }
}

// Get seat pricing
const getSeatById = async (req, res) => {
    try {
        const seatId = req.params.id;
        const seat = await Seat.findById(seatId)

        if (!seat) {
            return res.status(404).json({ error: 'Seat not found' })
        }

        const seatPricing = await SeatPricing.findOne({ seat_class: seat.seat_class })
        if (!seatPricing) {
            return res.status(500).json({ error: 'Seat pricing not available' })
        }

        const bookingsCount = await Seat.countDocuments({ seat_class: seat.seat_class, is_booked: true })
        let price;

        if (bookingsCount < 0.4 * bookingsCount) {
            price = seatPricing.min_price || seatPricing.normal_price;
        } else if (bookingsCount >= 0.4 * bookingsCount && bookingsCount <= 0.6 * bookingsCount) {
            price = seatPricing.normal_price || seatPricing.max_price;
        } else {
            price = seatPricing.max_price || seatPricing.normal_price;
        }

        res.json({
            seat,
            price,
        })

    } catch (err) {
        return res.status(500).json({ status: false, error: err.message })
    }
}

module.exports = { getSeats, getSeatById }
