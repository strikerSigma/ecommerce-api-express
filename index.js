const express = require('express');
const app = express();
const dotenv = require("dotenv").config();
const dbConnection = require('./config/dbConnection');
const appRouter = require('./routes/authRoutes');
const productRouter = require('./routes/productRotes');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const morgan = require('morgan');

const PORT = process.env.PORT || 4000;
dbConnection();


app.use(morgan("dev"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api/products',productRouter)
app.use('/api/user',appRouter)
app.use(notFound);
app.use(errorHandler)


app.listen(PORT,()=>{
    console.log(`listening on port ${PORT}`);
})
