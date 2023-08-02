require('dotenv').config();
const { WebClient } = require('@slack/web-api');
const schedule = require('node-schedule');
const fs = require('fs');

const TOKEN = process.env.BOT_TOKEN || '';
const CHANNEL_ID = process.env.CHANNEL_ID || '';
const ID_MEMBER_D1 = process.env.ID_MEMBER_D1 || '';

if (!TOKEN || !ID_MEMBER_D1 || !CHANNEL_ID) {
	console.log('.env not be configured');
	process.exit();
}

const client = new WebClient(TOKEN);

function getDate() {
	let date_ob = new Date();
	let date = ('0' + date_ob.getDate()).slice(-2);
	let month = ('0' + (date_ob.getMonth() + 1)).slice(-2);
	let year = date_ob.getFullYear();
	return `${date}${month}${year}`;
}

async function sendPlanDay() {
	const text = '<@channel>';
	const result = await client.chat.postMessage({
		channel: CHANNEL_ID,
		text: text,
	});
	console.log(result);

	// fs.writeFile(`./thread-ts-${getDate()}.txt`, 'abc', function (err) {
	// 	if (err) {
	// 		return console.log(err);
	// 	}
	// 	console.log('The file was saved!');
	// });
}

async function test() {
	console.log('Every minutes');
}

(async () => {
	// const text = '<@channel>';
	// const result = await client.chat.postMessage({
	// 	channel: CHANNEL_ID,
	// 	text: text,
	// });
	const result = await client.users.list({
		channel: CHANNEL_ID,
	});
	console.log(result);
})();

// schedule.scheduleJob('00 8 * * 1-5', sendPlanDay);

// schedule.scheduleJob('* * * * *', sendPlanDay);
