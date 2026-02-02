Module({
    pattern: 'ping',
    desc: 'Check bot response time',
    type: 'misc'
}, async (message, match) => {
    const start = Date.now();
    await message.reply('🚀 *Pinging...*');
    const end = Date.now();
    await message.reply(`🏓 *Pong!* \nSpeed: \`${end - start}ms\``);
});
