const fetch = require("node-fetch");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/total", async (req, res) => {
    let raw_response = await fetch("https://api2.getmistified.com/graphql", {
        method: "POST",
        mode: "cors",
        credentials: "include",
        headers: {
            "accept": "application/json",
            "content-type": "application/json",
            "token": process.env.TOKEN
        },
        body: JSON.stringify({
            query: `
            query eventStudents($EVENT_ID: ID!) {
                eventStudents(eventId: $EVENT_ID) { id }
            }`,
            variables: { EVENT_ID: process.env.EVENT_ID }
        })
    });
    let gql_res = await raw_response.json()

    // fetch returns a list of competitor IDs attending MIST. Return length of this array for registration numbers
    res.json({
        "response_type":"in_channel",
        "text": `Total No. Competitors: ${gql_res.data.eventStudents.length}` 
    })
});

exports.pullRegData = app;