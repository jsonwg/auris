import setup from './setup.js';

const player = await setup();

(async () => {
  await captureHTTPRequest();
})();

async function captureHTTPRequest() {
  // On any HTTP request check if it is that round's first song url
  player.page.on('request', async request => {
    if (
      request.redirectedFrom() &&
      request.url().includes('files.catbox.moe')
    ) {
      await guessAnime(request.url());
    }
  });
}

async function guessAnime(url) {
  // Match the latest GET request url to its corresponding song otherwise guess a random title
  const anime = player.database[url]
    ? player.database[url]
    : await randomAnime();

  // Wait until the player is in a game
  await player.page.waitForSelector('#quizPage', { timeout: 0 });

  // Enter the anime guess and then vote skip the phase
  await player.page.fill('#qpAnswerInput', anime, { timeout: 0 });
  await player.page.keyboard.press('Enter');
  await player.page.evaluate(() => quiz.skipClicked());
}

async function randomAnime() {
  // Get a list of all anime in the database and choose one
  const anime = Object.values(player.database);
  const guess = anime[Math.floor(Math.random() * anime.length)];
  return guess;
}
