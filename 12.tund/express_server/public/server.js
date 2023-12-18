const express = require('express');
const app = express();

const port = 3002;

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/about', (req, res) => {
    res.sendFile(__dirname + '/about.html');
});

app.get('/contact', (req, res) => {
    res.sendFile(__dirname + '/contact.html');
});

app.listen(port, () => {
    console.log(`Server kuulab pordil ${port}. Külasta http://localhost:${port}`)
});