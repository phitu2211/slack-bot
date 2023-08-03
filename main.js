require('dotenv').config();
const { WebClient } = require('@slack/web-api');
const schedule = require('node-schedule');
const fs = require('fs');

const TOKEN = process.env.BOT_TOKEN || '';
const CHANNEL_ID = process.env.CHANNEL_ID || '';
const ID_MEMBER_D1 = JSON.parse(process.env.ID_MEMBER_D1) || '';

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
	const text =
		'<!channel> Mọi người nộp hết kế hoạch ngày hôm nay và tuần lên đây nha :heart:';
	const result = await client.chat.postMessage({
		channel: CHANNEL_ID,
		text: text,
	});

	fs.writeFile(`./thread-ts-${getDate()}.txt`, result.ts, function (err) {
		if (err) {
			return console.log(err);
		}
		console.log('The file was saved!');
	});
}

async function checkPlanDay() {
	const ts = (await fs.readFileSync(`./thread-ts-${getDate()}.txt`)).toString();

	const result = await client.conversations.replies({
		channel: CHANNEL_ID,
		ts: ts,
	});

	const listUser = [
		...new Set(
			result.messages
				.filter((message) => message.files)
				.map((message) => message.user)
		),
	];

	var text = ID_MEMBER_D1.filter((id) => {
		!listUser.fi.includes(id);
	})
		.map((m) => `<@${m}>`)
		.join('\n');

	text += "\n*Chống đẩy 3 chục cái nộp muộn 15'*".toUpperCase();

	await client.chat.postMessage({
		channel: CHANNEL_ID,
		text: text,
	});
}

async function sendReportWeek() {
	const text = `<!channel> Các bạn làm báo cáo tuần này trong sáng nay và báo lại thầy qua luồng này nhé!
Bước 1: Các bạn truy cập vào thư mục này https://drive.google.com/drive/folders/1jXDDMcusigpPBycW6FjJbhOuVbjsq2Sh?usp=sharing.
Bước 2: Tìm thư mục trùng với tên của mình và truy cập vào nó.
Bước 3: Truy cập vào file excel học kì 3 có tên của mình. VD: "IBSK1D1_Võ Cát Hải_Báo cáo tuần_HọcKyII"
Bước 4: Click chuột phải vào sheet đầu tiên -> chọn Duplicate (Nhân bản)
-> Đổi tên sheet thành ngày viết báo cáo (Ví dụ: 05/10/2022).
Bước 5: Tiến hành làm báo cáo
Cảm ơn tất cả mọi người :heart:`;

	await client.chat.postMessage({
		channel: CHANNEL_ID,
		text: text,
	});
}

schedule.scheduleJob('0 8 * * 1-5', sendPlanDay);
schedule.scheduleJob('0 8 * * 3', sendReportWeek);
schedule.scheduleJob('15 8 * * 1-5', checkPlanDay);

// (async () => {
// 	const result = await client.conversations.replies({
// 		channel: CHANNEL_ID,
// 		ts: '1691025840.755759',
// 	});

// 	const listUser = result.messages;
// 	console.log(listUser);
// })();
