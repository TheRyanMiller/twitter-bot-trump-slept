# Trump_slept Twitter Bot

This is a NodeJS bot built to make a best-guess mearsure of Donald Trump's sleeping habits based on the timestamps of his tweets. 

## Install and Config

- This bot depends on a MongoDB backend. Make sure Mongo is running and available to the bot process.
- This bot uses [node-cron](https://www.npmjs.com/package/node-cron), so make sure it is running on an always-on server.
- After cloning this repo, you must copy `example.env` to a new file called simply `.env` and add/modify the values as appropriate. These values set a number of configuration options that allow you to customize the bot's behavior.
- Run `npm install` at the root of the project directory to download all dependencies.
- To start the bot, execute `node runner.js` from project root.