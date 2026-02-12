const handler = async (sock, msg, from, args, msgInfoObj) => {
	const { sendMessageWTyping } = msgInfoObj;

	const text = `*👨‍💻 Developer — Bot Developer*
	
	╭───────────────────────────
	│ *🔗 GitHub*
	│ github.com/username
	│
	│ *🌐 Portfolio*
	│ portfolio.com
	╰───────────────────────────`;

	await sendMessageWTyping(from, { text }, { quoted: msg });
};

export default () => ({
	cmd: ["dev", "developer"],
	desc: "Developer info",
	usage: "dev | developer",
	handler,
});
