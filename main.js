const { RTMClient } = require('@slack/rtm-api');
const token = 'bot-token'; // sửa token ở đây
const rtm = new RTMClient(token);
const axios = require('axios');

rtm.on('message', async (event) => {
	try {
		if (!event.bot_id) {
			const res = await axios({
				method: 'POST',
				url: 'https://api.simsimi.vn/v1/simtalk',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				data: {
					text: event.text,
					lc: 'vn',
				},
			});
			console.log(res.data);
			await rtm.sendMessage(res.data.message, event.channel);
		}
	} catch (error) {
		console.log(error);
	}
});

(async () => {
	await rtm.start();
})();
