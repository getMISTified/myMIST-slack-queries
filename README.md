# Slack Slash Command Registration Data Query
Slack slash command app to pull registration data directly from myMIST. Slack Slash commands generates POST request which is handled by GCP Cloud Function which POSTs myMIST with GraphQL query.

## Example Use
`/nat_total <event_ID>` generates total number of competitors.  
`/nat_comp <event_ID> <competition title>` generates competition-specific information.

## Setup
Updated: Adding the app to your Slack workspace is as easy as pressing the button below!
<br>
<br>
<a href="https://slack.com/oauth/v2/authorize?client_id=9051026354.3028883127907&scope=commands,chat:write&user_scope="><img alt="Add to Slack" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcSet="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x" /></a>

If the above doesn't work you can also try [this link](https://slack.com/oauth/v2/authorize?client_id=9051026354.3028883127907&scope=commands,chat:write&user_scope=).

## Currently Supported Queries
* `nat_total <event_ID>`: Pulls total number of competitors registered for tournament. | Route: `/nat_total`
* `nat_comp <event_ID> <comp_name> <lvl> <M/F>`: Pulls competitor count, school count, competitor names, and school names for supplied competition. You can also provide "all" as `comp_name` to get a listing of all competitions in your event. When user provides `comp_name`, the name is checked against a mapping of potential inputs to official myMIST competition names (i.e: user inputs "BV" which maps to "Business Venture"). This mapping is specific to MIST Detroit competitions and may not contain certain competitions your region supports. See the top of `comp_input_handler.js` to edit accordingly. | Route: `/nat_comp`

## Event ID Table
These will change every cycle and are only valid for the 2022 season, contact mhaddara@getmistified.com for more information.

| **Region Name** | **Event ID** |
|-----------------|--------------|
|Houston|50
|Dallas|51
|New Jersey|52
|SoCal|55
|Toronto|56
|DC|57
|Atlanta|58
|Columbus|60
|Detroit|63
|Carolina|64
|Nashville|65
|Florida|66
|New York|67
|St. Louis|68
|Philadelphia|71

## Contributions
* `index.js` contains all the logic for handling the different routes for each slash command and the query + data manipulation logic.
