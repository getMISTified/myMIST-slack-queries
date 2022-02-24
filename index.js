const express = require("express");
const bodyParser = require("body-parser");
const { request, gql, GraphQLClient } = require("graphql-request")
const { getOfficialName, getCompetitorCount, getAll } = require("./comp_input_handler")
const { IllegalInputError } = require("./errors.js")
const fetch = require("node-fetch")
require('dotenv').config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Set up some global variables
const graphQLClient = new GraphQLClient("https://api2.getmistified.com/graphql", {
    headers: {
        "accept":"application/json",
        "content-type":"application/json",
        "token": process.env.TOKEN
    },
    mode: "cors",
    credentials: "include",
})


app.post("/total", async (req, res) => {
    // Responding outside of 3000ms time limit
    // Start by sending 200 response so Slack doesn't error out
    res.sendStatus(200);

    // Get our data from myMIST
    let query = gql`
    query eventStudents($EVENT_ID: ID!) {
        eventStudents(eventId: $EVENT_ID) { id }
    }`;
    let variables = {
        EVENT_ID: process.env.EVENT_ID,
    };
    let gql_res = await graphQLClient.request(query, variables);
    
    // Construct response body
    res_body = {
        "response_type":"in_channel",
        "text": `Total No. Competitors: ${gql_res.eventStudents.length}`
    };
    // Grab request_url from Slack slash command POST - used to send an interactive message back outside of 3000ms limit
    response_url = req.body.response_url;
    fetch(response_url, {
        method: "POST",
        body: JSON.stringify(res_body),
        headers: {'Content-type': 'application/json'}
    });
});

app.post("/nat_total", async(req, res) => {
    // Responding outside of 3000ms time limit
    // Start by sending 200 response so Slack doesn't error out
    res.sendStatus(200);

    // Get our data from myMIST
    let query = gql`
    query eventStudents($EVENT_ID: ID!) {
        eventStudents(eventId: $EVENT_ID) { id }
    }`;
    let variables = {
        EVENT_ID: req.body.text,
    };
    let gql_res = await graphQLClient.request(query, variables);
    
    // Construct response body
    res_body = {
        "response_type":"in_channel",
        "text": `Total No. Competitors: ${gql_res.eventStudents.length}`
    };
    // Grab request_url from Slack slash command POST - used to send an interactive message back outside of 3000ms limit
    response_url = req.body.response_url;
    fetch(response_url, {
        method: "POST",
        body: JSON.stringify(res_body),
        headers: {'Content-type': 'application/json'}
    });
});

app.post("/comp", async(req, res) => {
        // const query = gql`
        // query fetchEventDetail($id: Int!) {
            // fetchEventDetail(id: $id) {
                // fetchEventCompetitions {id title joinedMemberCount }
            // }
        // }`
        // Responding outside of 3000ms time limit, start by sending 200 OK status
        res.sendStatus(200);
        res_body = {
            "text": "Your request returned an unhandled error. Sorry!"
        }; // JS object holding Block Kit formatted message, etc

        // Handle query creation and getting data from myMIST
        const query2 = gql`
        query eventDetail($id: Int!) {
            fetchEventAppDetail(id: $id) {
                id fetchEventCompetitions { id title joinedMemberCount users }
            }
        }`;
        let variables = {
            "id": parseInt(process.env.EVENT_ID),
        };
        gql_res = await graphQLClient.request(query2, variables);
        
        try {
            offName = getOfficialName(req.body.text);
            if (offName === "all") {
                res_body = getAll(offName, gql_res);
            } else {
                res_body = getCompetitorCount(offName, gql_res);
            }
        } catch (IllegalInputError) {
            res_body = {
                "response_type":"ephemeral",
                "type":"mrkdwn",
                "text": "Invalid competition entry. Please follow usage hints; for competition names, please select one of the following:" +
                "\n>```KT1, KT2, KT3\nQM1, QM2, QM3, QR\n2D Art, 3D Art, Fashion Design, Graphic Design, Photography\n" +
                "\nExtemp Speaking, Original Oratory, Spoken Word, Creative Writing\nDebate, Math Olympics, Quiz Bowl, Improv\n" +
                "\nBusiness Venture, Humanitarian Service\nNasheed, Science Fair, Short Film\nBasketball, Soccer```"
            }; 
        }
        
        // Get response_url to send a POST request back to the same place the slash command came from
        response_url = req.body.response_url;
        fetch(response_url, {
            method: "POST",
            body: JSON.stringify(res_body),
            headers: {"Content-type": "application/json"}
        });
});
exports.pullRegData = app;