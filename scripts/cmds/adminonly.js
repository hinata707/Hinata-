const fs = require("fs-extra");
const { config } = global.GoatBot;
const { client } = global;

module.exports = {
	config: {
		name: "adminonly",
		aliases: ["adonly", "onlyad", "onlyadmin"],
		version: "1.3",
		author: "NTKhang",
		countDown: 5,
		role: 2,
		shortDescription: {
			vi: "bật/tắt chỉ admin sử dụng bot",
			en: "turn on/off only admin can use bot"
		},
		longDescription: {
			vi: "bật/tắt chế độ chỉ admin mới có thể sử dụng bot",
			en: "turn on/off only admin can use bot"
		},
		category: "owner",
		guide: {
			vi: "   {pn} [on | off]: bật/tắt chế độ chỉ admin mới có thể sử dụng bot"
				+ "\n   {pn} noti [on | off]: bật/tắt thông báo khi người dùng không phải là admin sử dụng bot",
			en: "   {pn} [on | off]: turn on/off the mode only admin can use bot"
				+ "\n   {pn} noti [on | off]: turn on/off the notification when user is not admin use bot"
		}
	},

	langs: {
		vi: {
			turnedOn: "Đã bật chế độ chỉ admin mới có thể sử dụng bot",
			turnedOff: "Đã tắt chế độ chỉ admin mới có thể sử dụng bot",
			turnedOnNoti: "Đã bật thông báo khi người dùng không phải là admin sử dụng bot",
			turnedOffNoti: "Đã tắt thông báo khi người dùng không phải là admin sử dụng bot"
		},
		en: {
			turnedOn: "\n┏━━━━━━━━━━━━━━🔱━━━━━━━━━━━━━━┓\n┃ ✨ **𝐀𝐜𝐭𝐢𝐯𝐚𝐭𝐞𝐝 🔱**\n┃ 🌟 ଘ( ੭⁰̷̴͈ ᵕ ˘͈)੭* ☆『 **𝗔𝗰𝘁𝗶𝘃𝗲𝗿** 』\n┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛",
		      
			turnedOff: "\n┏━━━━━━━━━━━━━━👑━━━━━━━━━━━━━━┓\n┃ 🌟 **𝐃𝐞𝐚𝐜𝐭𝐢𝐯𝐚𝐭𝐞𝐝 𝐌𝐨𝐝𝐞 👑\n┃ 💤 /ᐠ - ˕ -マ ✰︵『 **𝗗𝗲𝘀𝗮𝗰𝘁𝗶𝘃𝗲𝗿** 』\n┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛",
			
			turnedOnNoti: "\n┏━━━━━━━━━━━━━━🔔━━━━━━━━━━━━━━┓\n┃ ✅ **𝐍𝐨𝐭𝐢𝐟𝐢𝐜𝐚𝐭𝐢𝐨𝐧 𝐀𝐜𝐭𝐢𝐯𝐚𝐭𝐞𝐝:** Alerts when non-admin users try to use the bot.\n┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛",
			
			turnedOffNoti: "\n┏━━━━━━━━━━━━━━🔕━━━━━━━━━━━━━━┓\n┃ ❌ **𝐍𝐨𝐭𝐢𝐟𝐢𝐜𝐚𝐭𝐢𝐨𝐧 𝐃𝐞𝐚𝐜𝐭𝐢𝐯𝐚𝐭𝐞𝐝:** No alerts for non-admin users.\n┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛"
		      }
		      
	},

	onStart: function ({ args, message, getLang }) {
		let isSetNoti = false;
		let value;
		let indexGetVal = 0;

		if (args[0] == "noti") {
			isSetNoti = true;
			indexGetVal = 1;
		}

		if (args[indexGetVal] == "on")
			value = true;
		else if (args[indexGetVal] == "off")
			value = false;
		else
			return message.SyntaxError();

		if (isSetNoti) {
			config.adminOnly.hideNotiMessage = !value;
			message.reply(getLang(value ? "turnedOnNoti" : "turnedOffNoti"));
		}
		else {
			config.adminOnly.enable = value;
			message.reply(getLang(value ? "turnedOn" : "turnedOff"));
		}

		fs.writeFileSync(client.dirConfig, JSON.stringify(config, null, 2));
	}
};
