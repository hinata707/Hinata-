module.exports = {
  config: {
    name: "dice",
    aliases: [],
    version: "1.3",
    author: "Raihan",
    countDown: 5,
    role: 0,
    shortDescription: "Play a dice game locally",
    longDescription: {
      en: "Roll a dice, if your number matches, you win double!",
    },
    category: "game",
    guide: {
      en: "{p}dice <number 1-6> <bet amount>\nExample: {p}dice 3 1000",
    },
  },

  onStart: async function ({ api, event, args, usersData, message }) {
    const { getPrefix } = global.utils;
    const p = getPrefix(event.threadID);
    const user = event.senderID;
    const userData = await usersData.get(event.senderID);

    // Check the user's previous usage details
    const userGameData = userData.diceGames || {};
    const useCount = userGameData.useCount || 0;
    const lastUsedTimestamp = userGameData.lastUsedTimestamp || 0;

    // Get the current time and calculate time since last use
    const currentTime = Date.now();
    const timeDifference = currentTime - lastUsedTimestamp;

    // If 5 hours have passed, reset the count
    if (timeDifference >= 5 * 60 * 60 * 1000) {
      userGameData.useCount = 0; // Reset use count after 5 hours
      userGameData.lastUsedTimestamp = currentTime;
      await usersData.set(user, userData); // Save updated data
    }

    // Limit check: Allow only up to 15 uses per 5 hours
    if (useCount >= 15) {
      const remainingTime = 5 * 60 * 60 * 1000 - timeDifference;
      const hoursLeft = Math.floor(remainingTime / (1000 * 60 * 60));
      const minutesLeft = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
      return message.reply(`You have reached the limit of 15 uses. Please wait ${hoursLeft} hours and ${minutesLeft} minutes before using the command again.`);
    }

    const guess = parseInt(args[0]);
    const betAmount = parseInt(args[1]);

    if (isNaN(guess) || guess < 1 || guess > 6) {
      return message.reply(`Invalid choice. Choose a number between 1 and 6.\n${p}dice <number> <bet amount>`);
    }

    if (isNaN(betAmount) || betAmount <= 0) {
      return message.reply(`Invalid bet amount. Enter a positive number.\n${p}dice <number> <bet amount>`);
    }

    if (userData.money < betAmount) {
      return message.reply("You don't have enough money to make that bet.");
    }

    // Biased dice roll for higher win chance (55%)
    let rolled;
    const biasChance = Math.random();
    if (biasChance < 0.55) {
      rolled = guess; // 55% chance to win
    } else {
      const options = [1, 2, 3, 4, 5, 6].filter(n => n !== guess);
      rolled = options[Math.floor(Math.random() * options.length)];
    }

    let resultMessage = `🎲You guessed: ${guess}\n🤖bot dice rolled: ${rolled}\n`;
    if (guess === rolled) {
      const winAmount = betAmount * 2;
      userData.money += betAmount;
      resultMessage += `🥳🎉Congratulations! You won ${winAmount}!`;
    } else {
      userData.money -= betAmount;
      resultMessage += `Sorry! You lost ${betAmount}. Better luck next time 🙃👍🏻.`;
    }

    // Update usage count and timestamp
    userGameData.useCount = useCount + 1;
    userGameData.lastUsedTimestamp = currentTime;
    userData.diceGames = userGameData; // Save the updated data
    await usersData.set(user, userData);

    message.reply(resultMessage);
  },
};