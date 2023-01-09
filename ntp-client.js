const NTP = require('ntp-time').Client;
const client = new NTP('a.st1.ntp.br', 123, { timeout: 5000 });

client
	.syncTime()
	.then(time => console.log(time)) // time is the whole NTP packet
	.catch(console.log);
