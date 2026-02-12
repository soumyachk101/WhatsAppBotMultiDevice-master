import axios from "axios";

const handler = async (sock, msg, from, args, msgInfoObj) => {
	const { sendMessageWTyping } = msgInfoObj;

	let url = "https://zenquotes.io/api/random";
	await axios(url).then((res) => {
		let quote = res.data[0].q + "\n\n~*By*: " + res.data[0].a;
		sendMessageWTyping(from, { text: `ʕ•̫͡•ʔ❤️ 𝗧𝗼𝗱𝗮𝘆'𝘀 𝗤𝘂𝗼𝘁𝗲 𝗙𝗼𝗿 𝗬𝗼𝘂  ❤️ʕ•̫͡•ʔ\n\n${quote}` }, { quoted: msg });
	});
};

export default () => ({
	cmd: ["quote"],
	desc: "Get random quote",
	usage: "quote",
	handler,
});
