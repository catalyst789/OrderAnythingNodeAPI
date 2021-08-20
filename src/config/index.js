require('dotenv').config();

const express = require('express');
const app = express();

//database configuration
require('../config/database');

//bodyparser configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(require('cors')());

//routes
app.use('/admin', require('../api/routes/adminRoutes'));
app.use('/agent', require('../api/routes/deliveryPartnerRoutes'));
app.use('/customer', require('../api/routes/customerRoutes'));

app.listen(process.env.PORT, console.log(`Server is Running at PORT ${process.env.PORT}`));