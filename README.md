# Slack Slash Command Registration Data Query
Slack slash command app to pull registration data directly from myMIST. Slack Slash commands generates POST request which is handled by GCP Cloud Function which POSTs myMIST with GraphQL query.

## Example Use
`reg_total` generates total number of competitors.

## Setting up Backend
If you would like to use the currently set up GCP Cloud Function backend, ping me (Sameed Khan) on Slack.

## Currently Supported Queries
* `reg_total`: Pulls total number of competitors registered for tournament.

