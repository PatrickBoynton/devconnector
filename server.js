const express = require('express');
const connectDb = require('./config/db');

const app = express();

connectDb();

app.get('/', (request, response) => {
    response.send('API RUNNING');
});


app.use('/api/users', require('./routes/api/users'));

app.use('/api/auth', require('./routes/api/auth'));

app.use('/api/profile', require('./routes/api/profile'));

app.use('/api/posts', require('./routes/api/posts'));


const PORT = process.env | 5000;

app.listen(PORT, () => console.log(`Now listening on port: ${ PORT }`));
