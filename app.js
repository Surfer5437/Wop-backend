"use strict";

/** Express app for invoice manager. */

const express = require("express");
// Use morgan middleware to log requests
const morgan = require('morgan');

const cors = require('cors');

const companyRoutes = require("./routes/companies");
const usersRoutes = require("./routes/users");
const app = express();
app.use(express.json());
// Enable CORS for all routes
const allowedOrigins = ['http://localhost:3000', 'https://invoicemanager-7023bcd0d92d.herokuapp.com'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept'],
}));
app.use(morgan('dev'));
app.options('*', cors());
app.use("/companies",companyRoutes);
app.use("/users",usersRoutes);
app.get('/', function (req, res) {
    res.send('Home Page')
  })

module.exports = app;