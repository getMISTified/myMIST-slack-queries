const fetch = require("node-fetch");
const express = require("express");
const bodyParser = require("body-parser");
require('dotenv').config();

console.log(process.env.EVENT_ID);

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
            "token": "qN9450ZbWAgaktfKBUanMC5h"
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
    console.log(gql_res)

    // fetch returns a list of competitor IDs attending MIST. Return length of this array for registration numbers
    res.json({
        "response_type":"in_channel",
        "text": `Total No. Competitors: ${gql_res.data.eventStudents.length}` 
    })
});

app.listen(3000);