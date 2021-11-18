require('dotenv').config();
require('express-async-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const passport = require('passport');
const cors = require('cors');

var methodOverride = require('method-override');
const app = express();
const db = require('./config/db');
const route = require('./routers');
const port = process.env.PORT || 8000;

app.use(morgan('combined'));
app.use(methodOverride('_method'));
app.use(cors({ origin: '*', optionsSuccessStatus: 200 }));
app.use(passport.initialize());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

require('./authenticate');
db.connect();
route(app);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
