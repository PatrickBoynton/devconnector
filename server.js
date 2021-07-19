const express = require('express');

const app = express();

app.get('/', (request, response) => {
    response.send('API RUNNING');
});

const PORT = process.env | 5000;

app.listen(PORT, () => console.log(`Now listening on port: ${ PORT }`));
