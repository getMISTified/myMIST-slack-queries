# Slack Slash Command Registration Data Query
Slack slash command app to pull registration data directly from myMIST. Slack Slash commands generates POST request which is handled by GCP Cloud Function which POSTs myMIST with GraphQL query.

## Example Use
`/reg_total` generates total number of competitors.

## Setup
* Set up Slash Commands in your Slack workspace following the guide [here](https://api.slack.com/interactivity/slash-commands)
  * Ignore the directions on Request URL and anything after "Preparing your app to receive commands"
* Set up a Google Cloud Platform (GCP) cloud function by following the "Before You Begin" section in [this guide](https://cloud.google.com/functions/docs/tutorials/slack)
  * The actual code for the function is irrelevant, we will replace it with our function instead. 
  * After this, create a local directory to store the code and clone this Git repository there  
  
```
mkdir slack-query-app
git clone https://github.com/getMISTified/myMIST-slack-queries.git
```
  
* Find your Slack signing secret from the **Basic Information** section of your newly created Slack App.
* Get your getMISTified token by logging into my.getmistified.com and head over to any registration management page where you can view coaches, students, admins, etc.
 * Open up your browser's Inspect tool, open up the "Network" tab at the top and view the "Headers" of any of the `graphql` requests that show up. Copy the `token` header.
* Assuming you've set up Google Cloud SDK correctly, go ahead and run  

```
gcloud functions deploy pullRegData \
--runtime nodejs14 \
--trigger-http \
--set-env-vars "SLACK_SECRET=<INSERT_YOUR_SECRET>,EVENT_ID=<YOUR_EVENT_ID>,TOKEN=<YOUR_GETMISTIFIED_TOKEN>" \
--allow-unauthenticated
```

* Return to the Slack App management interface and supply the Request URL with the URL of your cloud function (see **Configuring the application** from the GCP CF setup guide), but append it with the appropriate routes as listed in the next section. (e.g: for "reg_total" command, request URL should be XXX_YOUR_REQUEST_URL_XXX"**/total**")
* Test your slash command out in a private channel!

## Currently Supported Queries
* `reg_total`: Pulls total number of competitors registered for tournament. | Route: `/total`
* `reg_comp <comp_name> <lvl> <M/F>`: Pulls competitor count (soon other data) by competition | Route: `/comp`

## Contributions
* `index.js` contains all the logic for handling the different routes for each slash command and the query + data manipulation logic.
