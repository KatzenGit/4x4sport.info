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

    // Send Filtered Data
    res.send(getEvents(query));
});

app.listen(8080, "localhost", function() {
    console.log("Started Web Server On Port 8080...");
});

function getEvents(query) {
    const events = JSON.parse(fs.readFileSync("events.json"));

    if(Object.keys(query).length == 0) {
        // Empty Query
        return events;
    }

    // Set Up Filter Criteria
    let search_name = query.name != "" ? query.name : false;
    if(search_name) search_name = search_name.toLowerCase();

    let search_types = query.types != "" ? query.types : false;
    if(search_types) search_types = search_types.split(",");

    let data = events;
    
    // Filter Name
    if(search_name) {
        data = data.filter(i => i.name.toLowerCase().includes(search_name));
    }
    // Filter Type
    if(search_types) {
        data = data.filter(i => i.types.some(j => search_types.includes(j)));
    } else {
        data = [];
    }

    return data;
}