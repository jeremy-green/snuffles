### Deploy with Jenkins using Slack.

Snuffles is just a Jenkins Webhook trigger bot. Once you have Jenkins configured correctly, you'll be able to tell Snuffles to deploy a Github repo. Using Natural Language Processing, you'll be able to say things like `@snuffles build x_project` or `@snuffles deploy x_project`.

#### Prerequisites :ballot_box_with_check:

My version of Node and NPM at the time of development:

`node v5.0.0`

`npm v3.3.10`

Slack will also end the RTM connection randomly after sometime, so we'll need to end the process and restart it using [Forever](https://github.com/foreverjs/forever).

`npm install -g forever`

You can adjust the timeout in the `default.json` file.

##### NLP

The way Snuffles knows what you're asking it to deploy is by using [wit.ai](https://wit.ai). You'll need to create a project there and obtain an API key.

##### Slack

Create a Slack bot and generate an API token. Documentation can be found [here](https://api.slack.com/bot-users).

##### Jenkins

Create a Jenkins deployment user. Find the users API token and copy it. 

##### Github

Create a Github personal access token and save it.

#### Setup :arrows_clockwise:

Clone the repo:

`git clone git@github.com:jeremy-green/snuffles.git`

Change directories to the repo:

`cd snuffles`

Install the Node dependencies:

`npm install`

Once the dependencies are installed, rename the `default.sample.json` file to `default.json`. Change the values in the `default.json` with your Slack, Wit and Jenkins tokens as well as other values.

Also fill in and edit any replies you may want Snuffles to say in [replies.js](lib/replies.js).

##### Config

* token: Your Slack bot token
* debug: Turn Slack debugging on or off
* deployChannel: A channel with a group of users that are allowed to deploy -- usually a private channel
* wit: Wit.ai configuration
    * token: Your Wit token
    * confidence: The confidence level returned from Wit
    * debug: Turn Wit debugging on or off
* github: Github configuration
    * token: Your personal user token
    * REPO_NAME: change the value to match how your tagging your repo in wit.ai -- `@snuffles deploy <REPO_NAME>`. <PATH_TO_BRANCHES> is what Snuffles -- currently -- uses to validate releases. In our typical branching model, we create a feature branch to deploy with and eventually merge that branch into master.
* jenkins: Your Jenkins configuration
    * token: Your Jenkins user token
    * username: Your Jenkins deplyoment user
    * protocol: The protocol for the URL where Jenkins lives
    * host: The host for the URL where Jenkins lives
    * pipelines: The pipeline object for Jenkins Build Pipelines
        * REPO_NAME: Ideally the same value as the Github configuration and the path to the job within Jenkins.

#### Run :running: 

After you've configured your `default.json` file, run `forever bot.js` and Snuffles will come online.

#### Todo

* Better documentation -- a lot of it
* Pull recent releases from :octocat: and validate on those
* ¯\\\_(ツ)_/¯
