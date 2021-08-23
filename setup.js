import { chromium, errors } from 'playwright';
import getDatabase from './google.js';
import dotenv from 'dotenv';
dotenv.config();

const USERNAME = process.env.AMQUSER;
const PASSWORD = process.env.AMQPASS;

const player = await new (class Player {
  constructor() {
    return (async () => {
      this.browser = await chromium.launch({ headless: false });
      this.context = await this.browser.newContext({ viewport: null });
      this.page = await this.context.newPage();
      this.database = await getDatabase();
      return this;
    })();
  }
})();

async function setup() {
  await checkQuit();
  await login();
  return player;
}

async function checkQuit() {
  // Add a listener to signals that kill the process
  ['SIGHUP', 'SIGBREAK', 'SIGTERM', 'SIGINT'].forEach(sig => {
    process.on(sig, async () => {
      console.log(`\nExiting program due to ${sig}...`);

      // Logout from AMQ before ending the process
      await player.page
        .evaluate(() => options.logout())
        .finally(process.exit(0));
    });
  });
}

async function login() {
  await player.page.goto('https://animemusicquiz.com/');

  // If the account is logged in on the same browser do nothing
  if (await player.page.$('#loadingScreen')) {
    return;
  }

  try {
    await player.page.fill('text=Username', USERNAME);
    await player.page.fill('text=Password', PASSWORD);
    await player.page.click('#loginButton');

    // If the account is already logged in it will throw an error
    await player.page.waitForSelector('#loadingScreen', { timeout: 5000 });
  } catch (e) {
    // Catch the error and continue to login
    if (e instanceof errors.TimeoutError) {
      await player.page.click('#alreadyOnlineContinueButton');
    } else {
      throw e;
    }
  }
}

export default setup;
