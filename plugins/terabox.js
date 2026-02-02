const axios = require('axios');

Module({
    pattern: 'terabox',
    desc: 'Download videos from Terabox',
    type: 'downloader'
}, async (message, match) => {
    if (!match || !/terabox|1024tera/.test(match)) {
        return await message.reply('❌ *Usage:* `.terabox <link>`');
    }

    await message.reply('🔍 *ZENX-GOD Processing...*');
    try {
        const { data } = await axios.get(`https://top-warbler-brofbdb699965-a3727b0a.koyeb.app/bypass?url=${match}`);
        if (data.status) {
            await message.sendVideo(data.result.list[0].direct_link, `✅ *ZENX-GOD Downloader*`);
        } else {
            await message.reply('❌ *Error:* Link bypass failed.');
        }
    } catch (e) {
        await message.reply('❌ *Error:* Failed to fetch video.');
    }
});
