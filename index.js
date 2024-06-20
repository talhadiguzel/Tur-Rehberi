const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    fs.readFile("city.json", (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send("Internal Server Error");
            return;
        }
        const cities = JSON.parse(data);
        res.render('index', { secim: cities, req: req });
    });
});

app.get("/search", (req, res) => {
    fs.readFile("city.json", (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send("Internal Server Error");
            return;
        }
        const cities = JSON.parse(data);
        const searchQuery = req.query.search ? req.query.search.toLocaleLowerCase('tr-TR') : '';
        if (searchQuery && searchQuery.trim() !== '') {
            const filteredCities = cities.filter(city =>
                city.name.toLocaleLowerCase('tr-TR').startsWith(searchQuery)
            );
            res.render('index', { secim: filteredCities, req: req });
        } else {
            res.render('index', { secim: cities, req: req });
        }
    });
});

app.get("/city", (req, res) => {
    fs.readFile("city.json", (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send("Internal Server Error");
            return;
        }
        const cities = JSON.parse(data);
        const selectedCity = cities.find(city => city.name === req.query.choice);
        if (selectedCity) {
            res.render('city', { secim: selectedCity, req: req });
        } else {
            res.status(404).send("City not found");
        }
    });
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});