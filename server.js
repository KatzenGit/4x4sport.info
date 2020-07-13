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

app.get("/view", function(req, res) {
    res.sendFile(__dirname + "/templates/view.html");
});

app.listen(8080, "localhost", function() {
    console.log("Started Web Server On Port 8080...");
});

function getEvents(query) {
    const events = JSON.parse(fs.readFileSync("events.json"));

    // Set Up Filter Criteria
    let search_name = query.name != "" ? query.name : false;
    if(search_name) search_name = search_name.toLowerCase();

    let search_types = query.types != "" ? query.types : false;
    if(search_types) search_types = search_types.split(",");

    let search_future = query.future == "false" ? false : true;

    let search_id = query.id;

    let data = events;
    
    // Filter Name
    if(search_name) {
        data = data.filter(i => i.name.toLowerCase().includes(search_name));
    }
    // Filter Type
    if(search_types) {
        data = data.filter(i => i.types.some(j => search_types.includes(j)));
    }

    // Filter Future Only
    if(search_future) {
        let now = new Date();
        data = data.filter(i => new Date(i.start.split(".")[2], i.start.split(".")[1], i.start.split(".")[0]) > now);
    }

    // Filter Id
    if(search_id) {
        data = data.filter(i => i.id == search_id);
    }

    return data;
}