import { chromium, errors } from 'playwright';

class Scraper {
  constructor() {
    return (async () => {
      this.browser = await chromium.launch({ headless: false });
      this.context = await this.browser.newContext({ viewport: null });
      this.page = await this.context.newPage();
      this.responses = [];
      return this;
    })();
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

  async routeRequests() {
    await this.page.route('**/*', route => {
      const isDupeSong =
        route.request().url().includes('webm') &&
        !route.request().url().includes('moeVideo') &&
        !route.request().redirectedFrom();

      return isDupeSong ? route.abort() : route.continue();
    });
  }

  async captureResponses() {
    this.page.on('response', response => {
      response.url().includes('webm') && self.responses.push(response)
    })
  }
}

(async () => {
  const scraper = await new Scraper();
  await scraper.login();
  await scraper.checkQuit()
  await scraper.routeRequests();

  while (true)
})();
