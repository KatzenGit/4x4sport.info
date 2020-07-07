const express = require("express");
const cheerio = require("cheerio");
const fs = require("fs");

const app = express();

app.get("/", function(req, res) {
    console.log("Handling / request...");

    res.sendFile(__dirname + "/templates/home.html");
});

app.get("/events", function(req, res) {
    console.log("Handling /events request...");

    res.sendFile(__dirname + "/templates/events.html");
});

app.get("/query", function(req, res) {
    console.log("Handling /query request with query [" + JSON.stringify(req.query) + "]...");

    const query = req.query;
    const events = JSON.parse(fs.readFileSync("events.json"));

    // Return Full List
    if(Object.keys(query).length == 0) {
        res.send(events);
        return;
    }

    // Set Up Filter Criteria
    let search_name = query.name.toLowerCase();
    let search_types = query.types.split(",");

    let data = events;
    
    // Filter Name
    if(query.name != "") {
        data = data.filter(i => i.name.toLowerCase().includes(search_name));
    }
    // Filter Type
    if(search_types.length != 5) {
        data = data.filter(i => search_types.some(j => i.types.includes(j)));
    }

    // Send Filtered Data
    res.send(data);
});

app.listen(8080, "localhost", function() {
    console.log("Started Web Server On Port 8080...");
});