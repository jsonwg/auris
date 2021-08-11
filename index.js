import { chromium, errors } from 'playwright';
import { google } from 'googleapis';
import dotenv from 'dotenv';
dotenv.config();

const USERNAME = process.env.AMQUSER;
const PASSWORD = process.env.AMQPASS;

class Scraper {
  constructor() {
    return (async () => {
      this.browser = await chromium.launch({ headless: false });
      this.context = await this.browser.newContext({ viewport: null });
      this.page = await this.context.newPage();
      this.database = await this.pullDatabase();
      this.response;
      await this.checkQuit();
      await this.captureResponses();
      return this;
    })();
  }

  async pullDatabase() {
    const sheets = google.sheets('v4');
    const auth = new google.auth.GoogleAuth({
      keyFile: './key.json',
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: '1i-3PZDh6ug9L_NY1gCmWyyZZ24D-7uQoDxb9bf6ruEM',
      range: '1628663021488',
      auth,
    });

    let database = {};
    for (const row of response.data.values) database[row[4]] = row[0];
    return database;
  }

  async login() {
    await this.page.goto('https://animemusicquiz.com/');
    if (await this.page.$('#loadingScreen')) {
      return;
    }

    try {
      await this.page.fill('text=Username', USERNAME);
      await this.page.fill('text=Password', PASSWORD);
      await this.page.click('#loginButton');
      await this.page.waitForSelector('#loadingScreen', { timeout: 5000 });
    } catch (e) {
      if (e instanceof errors.TimeoutError) {
        await this.page.click('#alreadyOnlineContinueButton');
      } else {
        throw e;
      }
    }
  }

  async checkQuit() {
    ['SIGHUP', 'SIGBREAK', 'SIGTERM', 'SIGINT'].forEach(sig => {
      process.on(sig, async () => {
        console.log(`\nExiting program due to ${sig}...`);
        await this.page
          .evaluate(() => options.logout())
          .finally(process.exit(0));
      });
    });
  }

  async captureResponses() {
    this.page.on('request', async request => {
      if (
        request.redirectedFrom() &&
        request.url().includes('files.catbox.moe')
      ) {
        this.response = request.url();
        await this.guessSong();
      }
    });
  }

  async guessSong() {
    const song = this.database[this.response]
      ? this.database[this.response]
      : ' ';
    await this.page.waitForSelector('#quizPage', { timeout: 0 });
    await this.page.fill('#qpAnswerInput', song, { timeout: 0 });
    await this.page.keyboard.press('Enter');
  }
}

(async () => {
  const scraper = await new Scraper();
  await scraper.login();
})();
