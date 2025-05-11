const axios = require("axios");

const baseApiUrl = async () => {
  const base = await axios.get(
    `https://raw.githubusercontent.com/Mostakim0978/D1PT0/refs/heads/main/baseApiUrl.json`
  );
  return base.data.api;
};

module.exports = {
  config: {
    name: "quiz",
    aliases: ["qz"],
    version: "1.0",
    author: "Dipto",
    countDown: 0,
    role: 0,
    category: "game",
    guide: "{p}quiz \n{p}quiz bn \n{p}quiz en",
  },

  onStart: async function ({ api, event, usersData, args }) {
    const input = args.join('').toLowerCase() || "bn";
    let timeout = 300;
    let category = "bangla";
    if (input === "bn" || input === "bangla") {
      category = "bangla";
    } else if (input === "en" || input === "english") {
      category = "english";
    }

    try {
      const response = await axios.get(
        `${await baseApiUrl()}/quiz?category=${category}&q=random`,
      );

      const quizData = response.data.question;
      const { question, correctAnswer, options } = quizData;
      const { a, b, c, d } = options;
      const namePlayerReact = await usersData.getName(event.senderID);
      const quizMsg = {
        body: `\n╭──✦ ${question}\n├‣ 𝗔) ${a}\n├‣ 𝗕) ${b}\n├‣ 𝗖) ${c}\n├‣ 𝗗) ${d}\n╰──────────────────‣\n𝚁𝚎𝚙𝚕𝚢 𝚝𝚘 𝚝𝚑𝚒𝚜 𝚖𝚎𝚜𝚜𝚊𝚐𝚎 𝚠𝚒𝚝𝚑 𝚢𝚘𝚞𝚛 𝚊𝚗𝚜𝚠𝚎𝚛.`,
      };

      api.sendMessage(
        quizMsg,
        event.threadID,
        (error, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            type: "reply",
            commandName: this.config.name,
            author: event.senderID,
            messageID: info.messageID,
            dataGame: quizData,
            correctAnswer,
            nameUser: namePlayerReact
          });
          setTimeout(() => {
            api.unsendMessage(info.messageID);
          }, timeout * 1000);
        },
        event.messageID,
      );
    } catch (error) {
      console.error("❌ | Error occurred:", error);
      api.sendMessage(error.message, event.threadID, event.messageID);
    }
  },

  onReply: async ({ event, api, Reply, usersData }) => {
    const { correctAnswer, nameUser, author } = Reply;
    if (event.senderID !== author)
      return api.sendMessage("Who are you bby🐸🦎", event.threadID, event.messageID);

    const userReply = event.body.toLowerCase();

    await api.unsendMessage(Reply.messageID).catch(console.error);

    if (userReply === correctAnswer.toLowerCase()) {
      const rewardCoins = 300;
      const rewardExp = 100;
      const userData = await usersData.get(author);

      await usersData.set(author, {
        money: userData.money + rewardCoins,
        exp: userData.exp + rewardExp,
        data: userData.data,
      });

      const correctMsg = `Congratulations, ${nameUser}! 🌟🎉\n\nYou're a Quiz Champion! 🏆\n\nYou've earned ${rewardCoins} Coins 💰 and ${rewardExp} EXP 🌟\n\nKeep it up!`;
      api.sendMessage(correctMsg, event.threadID, event.messageID);
    } else {
      const incorrectMsg = `❌ | Sorry, ${nameUser}, wrong answer.\n✅ | The correct answer was: ${correctAnswer}`;
      api.sendMessage(incorrectMsg, event.threadID, event.messageID);
    }
  },
};
