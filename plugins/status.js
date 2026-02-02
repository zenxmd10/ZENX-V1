const os = require('os');

Module({
    pattern: 'status',
    desc: 'Show system status',
    type: 'misc'
}, async (message, match) => {
    const ram = (os.totalmem() / (1024**2)).toFixed(0);
    const uptime = (os.uptime() / 3600).toFixed(2);
    await message.reply(`🤖 *ZENX-GOD Status*\n\n💾 *RAM:* ${ram} MB\n⚙️ *Uptime:* ${uptime} hours`);
});
