const Booking = require('../models/bookingModel')
const Seat = require('../models/seatModel')
const SeatPricing = require('../models/seatPricing')

// create booking
const createBooking = async (req, res) => {
    try {
        const { seat_id, name, email, phone_number } = req.body;

        if ((!name || !email || !phone_number)) return res.status(400).send({ status: false, message: "Please enter data" })

        //.............validation for email............
        const regx = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
        if (!regx.test(email)) return res.status(400).send({ status: false, message: "Enter Valid Email" })

        let emailData = await Booking.findOne({ email: email })

        //.............when email is already in use............
        if (emailData) return res.status(400).send({ status: false, msg: 'Duplicate email found, Please try with another!!' })

        // Check if seats are available
        const seats = await Seat.find({ _id: { $in: seat_id }, is_booked: false })

        if (seats.length !== seat_id.length) {
            return res.status(400).json({ error: 'Some seats are already booked' })
        }

        // Calculate total amount
        let totalAmount = 0;
        const seatClasses = Array.from(new Set(seats.map((seat) => seat.seat_class)))

        for (const seatClass of seatClasses) {
            const bookingsCount = await Seat.countDocuments({ seat_class: seatClass, is_booked: true })
            const seatPricing = await SeatPricing.findOne({ seat_class: seatClass })

            let price;

            if (bookingsCount < 0.4 * seats.length) {
                price = seatPricing.min_price || seatPricing.normal_price;
            } else if (bookingsCount >= 0.4 * seats.length && bookingsCount <= 0.6 * seats.length) {
                price = seatPricing.normal_price || seatPricing.max_price;
            } else {
                price = seatPricing.max_price || seatPricing.normal_price;
            }

            totalAmount += price;
        }

        function generateBookingID() {
            const prefix = 'BOOK';
            const randomString = Math.random().toString(36).substr(2, 8).toUpperCase();
            return `${prefix}-${randomString}`;
        }

        // Create bookings
        const bookings = []
        const bookingIDs = []

        for (const seat of seats) {
            const booking = new Booking({
                seat_id: seat._id,
                name,
                email,
                phone_number,
                booking_id: generateBookingID(),
                total_amount: totalAmount,
            })

            await booking.save()

            // Update seat status to booked
            seat.is_booked = true;
            await seat.save()

            bookings.push(booking)
            bookingIDs.push(booking.booking_id)
        }

        res.json({
            bookings: bookingIDs,
            total_amount: totalAmount,
        })
    } catch (err) {
        return res.status(500).json({ status: false, error: err.message })
    }
}


// Retrieve Bookings
const getBookings = async (req, res) => {
    try {
        const { userIdentifier } = req.query;

        if (!userIdentifier) {
            return res.status(400).json({ error: 'User identifier is required' })
        }

        const bookings = await Booking.find({ $or: [{ email: userIdentifier }, { phone_number: userIdentifier }] })
        res.json(bookings)

    } catch (err) {
        return res.status(500).json({ status: false, error: err.message })
    }
}

module.exports = { createBooking, getBookings }
