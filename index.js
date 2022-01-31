const fetch = require("node-fetch");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/total", async (req, res) => {
    let raw_response = await fetch("https://api2.getmistified.com/graphql", {
        "headers": {
            "accept": "application/json",
            "content-type": "application/json",
            "token": "qN9450ZbWAgaktfKBUanMC5h"
        },
        "body": "{\"query\":\"{\\n  eventStudents(eventId: 63) {\\n    id\\n  }\\n}\",\"variables\":null}",
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    });
    let gql_res = await raw_response.json()

    // fetch returns a list of competitor IDs attending MIST. Return length of this array for registration numbers
    res.json({
        "response_type":"in_channel",
        "text": `Total No. Competitors: ${gql_res.data.eventStudents.length}` 
    })
});

exports.pullRegData = app;