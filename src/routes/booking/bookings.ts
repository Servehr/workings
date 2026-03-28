import express, { Express, Request, Response } from 'express';
const app = express();
import session from 'express-session';
const router = express.Router();
import bodyParser from 'body-parser';
import cors from 'cors';
import multer from 'multer';
const upload = multer();

const bookings = require('../../controller/booking');


router.get('/all-bookings', bookings.booking.allBookings);

router.get('/all-user-bookings', bookings.booking.allUserBookings)

router.get('/booking/:id', bookings.booking.userBooking)

router.post('/cancel-booking', bookings.booking.cancel)
 
router.post('/book', bookings.booking.book);

router.put('/book', bookings.booking.updateBook);

router.delete('/remove-bookings', bookings.booking.removeBookings);

router.delete('/remove-booking/:id', bookings.booking.removeBooking);

module.exports = router;