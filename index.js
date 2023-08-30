const express = require('express');
const app = express();
const dotenv = require("dotenv").config();
const dbConnection = require('./config/dbConnection');
const appRouter = require('./routes/authRoutes');
const bodyParser = require('body-parser');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const PORT = process.env.PORT || 4000;
dbConnection();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api/user',appRouter)
app.use(notFound);
app.use(errorHandler)


app.listen(PORT,()=>{
    console.log(`listening on port ${PORT}`);
})
