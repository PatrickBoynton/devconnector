const express = require('express');
const connectDb = require('./config/db');

const app = express();

connectDb();

app.get('/', (request, response) => {
    response.send('API RUNNING');
});

const PORT = process.env | 5000;

app.listen(PORT, () => console.log(`Now listening on port: ${ PORT }`));
