const express = require("express");
const bodyParser = require("body-parser");
const { request, gql, GraphQLClient } = require("graphql-request")
const { getOfficialName, getCompetitorCount, getAll, IllegalInputError } = require("./comp_input_handler")
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
    let query = gql`
    query eventStudents($EVENT_ID: ID!) {
        eventStudents(eventId: $EVENT_ID) { id }
    }`
    let variables = {
        EVENT_ID: process.env.EVENT_ID,
    }
    let gql_res = await graphQLClient.request(query, variables);
    res.json({
        "response_type":"in_channel",
        "text": `Total No. Competitors: ${gql_res.eventStudents.length}` 
    })
});

app.post("/comp", async(req, res) => {
        // const query = gql`
        // query fetchEventDetail($id: Int!) {
            // fetchEventDetail(id: $id) {
                // fetchEventCompetitions {id title joinedMemberCount }
            // }
        // }`
        const query2 = gql`
        query eventDetail($id: Int!) {
            fetchEventAppDetail(id: $id) {
                id fetchEventCompetitions { id title joinedMemberCount }
            }
        }`
        let variables = {
            "id": parseInt(process.env.EVENT_ID),
        }
        gql_res = await graphQLClient.request(query2, variables);
        
        try {
            offName = getOfficialName(req.body.text);
        } catch (IllegalInputError) {
            res.json({
                "response_type":"ephemeral",
                "type":"mrkdwn",
                "text": "Invalid competition entry. Please follow usage hints; for competition names, please select one of the following:" +
                "\n>```KT1, KT2, KT3\nQM1, QM2, QM3, QR\n2D Art, 3D Art, Fashion Design, Graphic Design, Photography\n" +
                "\nExtemp Speaking, Original Oratory, Spoken Word, Creative Writing\nDebate, Math Olympics, Quiz Bowl, Improv\n" +
                "\nBusiness Venture, Humanitarian Service\nNasheed, Science Fair, Short Film\nBasketball, Soccer```"
            })
        }
        
        // if user requests report of all competitors
        if (offName === "all") {
            res.json(getAll(offName, gql_res));
            return
        }

        memberCount = getCompetitorCount(offName, gql_res);
        res.json({
            "response_type":"in_channel",
            "type": "mrkdwn",
            "text": `Competitor Report for | *${offName.replace(/\*/g, "")}* |\n>*Competitor Count:* ${memberCount}` 
        });
});

app.listen(3000);