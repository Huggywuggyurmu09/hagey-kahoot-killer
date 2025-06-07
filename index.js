const Kahoot = require("kahoot.js-latest");
const { spawn } = require("child_process");
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const logoPath = path.join(__dirname, 'logo.txt');
const logo = fs.readFileSync(logoPath, 'utf-8');

console.log(logo);

let CODE_TO_JOIN;
let PREFIX;
let BOT_NUMBER;

const setGreenConsole = () => {
  process.stdout.write('\x1Bc');
  process.stdout.write('\x1b[92m');
};

rl.question("Game PIN: ", (gamePin) => {
  CODE_TO_JOIN = gamePin;

  rl.question("Bot Name: ", (botPrefix) => {
    PREFIX = botPrefix;

    rl.question("Amount of bots: ", (botCount) => {
      BOT_NUMBER = botCount;
      rl.close();
	  setGreenConsole();
      console.log("⏳ Starting to join Kahoot...");
	  main();
    });
  });
});

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function setupListeners(client) {
  client.on("Joined", () => {
    console.log(`✅ Client ${client.name} joined the Kahoot!`);
  });

  const onQuizStart = () => {
    console.log("🔔 The quiz has started!");
    client.off("QuizStart", onQuizStart);
  };
  client.on("QuizStart", onQuizStart);

  const onQuestionStart = question => {
    console.log("🚀 A new question has started, answering the first answer.");
    question.answer(Math.floor(Math.random() * 4));
  };

  const onQuizEnd = () => {
    console.log("🏆 The quiz has ended.");
    client.off("QuizEnd", onQuizEnd);
  };
  client.on("QuizEnd", onQuizEnd);

  client.on("Disconnect", reason => {
    console.log(`❌ Client ${client.name} left the game: ${reason}`);
  });
}

async function main() {
  const clients = [];

  for (let i = 0; i < BOT_NUMBER; i++) {
    const client = new Kahoot();
    clients.push(client);

    setupListeners(client);

    const username = PREFIX + (Math.floor(1000 + Math.random() * 9000));
    client.join(CODE_TO_JOIN, username);
    await delay(500);
  }
}
