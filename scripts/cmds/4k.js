const axios = require("axios");

module.exports.config = {
    name: "4k",
    aliases: ["enhance", "remini"],
    version: "1.0",
    author: "♡︎ 𝐻𝐴𝑆𝐴𝑁 ♡︎",
    countDown: 3, 
    role: 0,
    longDescription: {
        en: "enhanced your images"
    },
    category: "tools",
    guide: {
        en: "{pn} reply to an image for enhance"
    } 
};

module.exports.onStart = async ({ api, event, args }) => {
    try {
        if (!event.messageReply || !event.messageReply.attachments || !event.messageReply.attachments[0]) {
            return api.sendMessage("𝐏𝐥𝐞𝐚𝐬𝐞 𝐫𝐞𝐩𝐥𝐲 𝐭𝐨 𝐚𝐧 𝐢𝐦𝐚𝐠𝐞 𝐰𝐢𝐭𝐡 𝐭𝐡𝐞 𝐜𝐨𝐦𝐦𝐚𝐧𝐝.", event.threadID, event.messageID);
        }

        const hasan = event.messageReply.attachments[0].url;
        
        api.setMessageReaction("✨", event.messageID, () => {}, true);
        const toxic = "https://www.noobs-api-69.rf.gd/api";
        let apiUrl = `${toxic}/upscale?imageUrl=${encodeURIComponent(hasan)}`;
        
        if (args[0] === "ultra") {
            apiUrl = `${toxic}/enhance?imageUrl=${encodeURIComponent(hasan)}`;
}

        const response = await global.utils.getStreamFromURL(apiUrl);
       
        api.setMessageReaction("😍", event.messageID, () => {}, true);

        api.sendMessage({
            body: "✨| 𝐇𝐞𝐫𝐞 𝐢𝐬 𝐲𝐨𝐮𝐫 𝐞𝐧𝐡𝐚𝐧𝐜𝐞𝐝 𝐩𝐡𝐨𝐭𝐨",
            attachment: response
        }, event.threadID, event.messageID);

    } catch (e) {
        api.sendMessage(`Error: ${e.message}`, event.threadID, event.messageID);
    }
};