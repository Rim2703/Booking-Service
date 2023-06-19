const express = require('express')
const router = express.Router()
const { createBooking, getBookings } = require('./controllers/bookingController')
const { getSeats, getSeatById } = require('./controllers/seatController')

router.post('/booking', createBooking)
router.get('/seats', getSeats)
router.get('/seats/:id', getSeatById)
router.get('/bookings', getBookings)

module.exports = router;