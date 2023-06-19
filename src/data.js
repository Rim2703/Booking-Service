const Seat = require('./models/seatModel')
const SeatPricing = require('./models/seatPricing')
const csv = require('csv-parser')
const fs = require('fs')

// Load seats from CSV file and populate the database
function loadSeats() {
    fs.createReadStream('src/files/Seats.csv')
        .pipe(csv())
        .on('data', (data) => {
            const seat = new Seat({
                seat_identifier: data.seat_identifier,
                seat_class: data.seat_class,
                is_booked: false
            });
            seat.save()
        })
        .on('end', () => {
            console.log('Seats have been loaded')
        })
}

// Load seat pricing from CSV file
function loadSeatPricing() {
    fs.createReadStream('src/files/SeatPricing.csv')
        .pipe(csv())
        .on('data', (data) => {
            const { seat_class, min_price, normal_price, max_price } = data;
            const seatPricing = new SeatPricing({
                seat_class,
                min_price: parseFloat(min_price.replace('$', '')) || null,
                normal_price: parseFloat(normal_price.replace('$', '')) || null,
                max_price: parseFloat(max_price.replace('$', '')) || null
            })
            seatPricing.save()
        })
        .on('end', () => {
            console.log('Seat pricing has been loaded')
        })
}

module.exports = { loadSeats, loadSeatPricing }
