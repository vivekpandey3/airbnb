const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    home: { type: mongoose.Schema.Types.ObjectId, ref: 'Home', required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    guests: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);
