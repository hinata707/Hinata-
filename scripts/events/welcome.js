const { getTime, drive } = global.utils;
if (!global.temp.welcomeEvent)
  global.temp.welcomeEvent = {};

module.exports = {
  config: {
    name: "welcome",
    version: "1.5",
    author: "NTKhang",
    category: "events"
  },

  langs: {
    vi: {
      session1: "sáng",
      session2: "trưa",
      session3: "chiều",
      session4: "tối",
      welcomeMessage: "Cảm ơn bạn đã mời tôi vào nhóm!\nPrefix bot: %1\nĐể xem danh sách lệnh hãy nhập: %1help",
      multiple1: "bạn",
      multiple2: "các bạn",
      defaultWelcomeMessage: "Xin chào {userName}.\nChào mừng bạn đến với {boxName}.\nChúc bạn có buổi {session} vui vẻ!"
    },
    en: {
      session1: "•°*”˜.•°*”˜🔖˜”*°•.˜”*°•",
      session2: "noon",
      session3: "afternoon",
      session4: "evening",
      welcomeMessage: `⫷\n●▬▬▬▬▬๑⇩⇩๑▬▬▬▬▬●\n[⚜️] 𝙱𝚘𝚝 𝙽𝚊𝚖𝚎:- 𝗛𝗜𝗡𝗔𝗧𝗔 🌸 \n\n[⚜️] 𝚍𝚘𝚗𝚝 𝚜𝚙𝚊𝚖 𝚝𝚑𝚎 𝚋𝚘𝚝\n[⚜️ ]  𝚝𝚘 𝚜𝚎𝚎 𝚊𝚒𝚕𝚊𝚋𝚕𝚎 𝚌𝚘𝚖𝚖𝚊𝚗𝚍 𝚝𝚢𝚙𝚎 [ !help ] \n \n●▬▬▬▬▬๑⇧⇧๑▬▬▬▬▬●\n❛━━･❪ 𝑷𝒓𝒆𝒇𝒊𝒙 [ ! ]❫･━━❜\n[⚜️] 𝙸𝚏 𝙰𝚗𝚢 𝚀𝚞𝚎𝚜𝚝𝚒𝚘𝚗 𝙾𝚛 𝙽𝚎𝚎𝚍 𝙷𝚎𝚕𝚙 𝙲𝚘𝚗𝚗𝚎𝚌𝚝 𝙱𝚘𝚝 - 𝙰𝚍𝚖𝚒𝚗 \n  \n◆━━━━━━━━━━━━━◆\n[⚜️] 𝙱𝚘𝚝 𝙿𝚛𝚎𝚏𝚒𝚡 - ! \n[⚜️] 𝙰𝚍𝚖𝚒𝚗 - 𝙶𝚡 𝚁𝚊𝚒𝚑𝚊𝚗`,
      multiple1: "you",
      multiple2: "you guys",
      defaultWelcomeMessage:" ▂▃▅▆ 𝐖𝐞𝐥𝐜𝐨𝐦𝐞...▆▅▃▂\n⫸ 𝙎𝙪𝙘𝙘𝙚𝙨𝙨𝙛𝙪𝙡... ⫷\n●▬▬▬▬▬๑⇩⇩๑▬▬▬▬▬●\n[⚜️] 𝙃𝙚𝙡𝙡𝙤. ${userName} 👋\n[⚜️] 𝙒𝙚𝙡𝙘𝙤𝙢𝙚 ${multiple} 𝙩𝙤 𝙩𝙝𝙚 𝙘𝙝𝙖𝙩 𝙜𝙧𝙤𝙪𝙥: 『 ${boxName} 』\n[⚜️] 𝙃𝙖𝙫𝙚 𝙖 𝙣𝙞𝙘𝙚 ${session} ✨\n●▬▬▬▬▬๑⇧⇧๑▬▬▬▬▬●"

    }
  },

  onStart: async ({ threadsData, message, event, api, getLang }) => {
    if (event.logMessageType == "log:subscribe")
      return async function () {
        const hours = getTime("HH");
        const { threadID } = event;
        const { nickNameBot } = global.GoatBot.config;
        const prefix = global.utils.getPrefix(threadID);
        const dataAddedParticipants = event.logMessageData.addedParticipants;
        // if new member is bot
        if (dataAddedParticipants.some((item) => item.userFbId == api.getCurrentUserID())) {
          if (nickNameBot)
            api.changeNickname(nickNameBot, threadID, api.getCurrentUserID());
          return message.send(getLang("welcomeMessage", prefix));
        }
        // if new member:
        if (!global.temp.welcomeEvent[threadID])
          global.temp.welcomeEvent[threadID] = {
            joinTimeout: null,
            dataAddedParticipants: []
          };

        global.temp.welcomeEvent[threadID].dataAddedParticipants.push(...dataAddedParticipants);
        clearTimeout(global.temp.welcomeEvent[threadID].joinTimeout);

        global.temp.welcomeEvent[threadID].joinTimeout = setTimeout(async function () {
          const dataAddedParticipants = global.temp.welcomeEvent[threadID].dataAddedParticipants;
          const threadData = await threadsData.get(threadID);
          const dataBanned = threadData.data.banned_ban || [];
          if (threadData.settings.sendWelcomeMessage == false)
            return;
          const threadName = threadData.threadName;
          const userName = [],
            mentions = [];
          let multiple = false;

          if (dataAddedParticipants.length > 1)
            multiple = true;

          for (const user of dataAddedParticipants) {
            if (dataBanned.some((item) => item.id == user.userFbId))
              continue;
            userName.push(user.fullName);
            mentions.push({
              tag: user.fullName,
              id: user.userFbId
            });
          }
          // {userName}:   name of new member
          // {multiple}:
          // {boxName}:    name of group
          // {threadName}: name of group
          // {session}:    session of day
          if (userName.length == 0) return;
          let { welcomeMessage = getLang("defaultWelcomeMessage") } =
            threadData.data;
          const form = {
            mentions: welcomeMessage.match(/\{userNameTag\}/g) ? mentions : null
          };
          welcomeMessage = welcomeMessage
            .replace(/\{userName\}|\{userNameTag\}/g, userName.join(", "))
            .replace(/\{boxName\}|\{threadName\}/g, threadName)
            .replace(
              /\{multiple\}/g,
              multiple ? getLang("multiple2") : getLang("multiple1")
            )
            .replace(
              /\{session\}/g,
              hours <= 10
                ? getLang("session1")
                : hours <= 12
                  ? getLang("session2")
                  : hours <= 18
                    ? getLang("session3")
                    : getLang("session4")
            );

          form.body = welcomeMessage;

          if (threadData.data.welcomeAttachment) {
            const files = threadData.data.welcomeAttachment;
            const attachments = files.reduce((acc, file) => {
              acc.push(drive.getFile(file, "stream"));
              return acc;
            }, []);
            form.attachment = (await Promise.allSettled(attachments))
              .filter(({ status }) => status == "fulfilled")
              .map(({ value }) => value);
          }
          message.send(form);
          delete global.temp.welcomeEvent[threadID];
        }, 1500);
      };
  }
};
	    
