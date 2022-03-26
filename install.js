// Very basic install handling script required to install Slack apps in other workspaces
const { WebClient } = require("@slack/web-api");

function authorizer (code) {
    try {
        oauth_response = await (new WebClient()).oauth.v2.access({
            client_id: process.env.SLACK_CLIENT_ID,
            client_secret: process.env.SLACK_CLIENT_SECRET,
            code: req.query.code
        });
        return oauth_response
    } catch (e) {
        console.error(e);
    }
}

exports.authorizer = authorizer;