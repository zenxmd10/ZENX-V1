const config = require('../config');
const fs = require('fs');
const path = require('path');

// Config ഫയൽ അപ്‌ഡേറ്റ് ചെയ്യാനുള്ള ഫംഗ്ഷൻ
const updateConfig = () => {
    fs.writeFileSync(path.join(__dirname, '../config.js'), `module.exports = ${JSON.stringify(config, null, 4)};`);
};

Module({ 
    pattern: 'setsudo',
    desc: 'Add a permanent sudo user'
}, async (message, match) => {
    if (!message.isSudo) return;
    
    let newSudo = message.reply_message ? message.reply_message.sender.split('@')[0] : match.replace(/[^0-9]/g, '');
    
    if (!newSudo) return await message.reply('❌ Reply to a message or give a number.');
    if (config.SUDO.length >= 4) return await message.reply('❌ Max 4 SUDO allowed.');
    
    if (!config.SUDO.includes(newSudo)) {
        config.SUDO.push(newSudo);
        updateConfig();
        await message.reply(`✅ @${newSudo} added as SUDO.`);
    } else {
        await message.reply('ℹ️ This number is already in SUDO list.');
    }
});

Module({ 
    pattern: 'delsudo',
    desc: 'Remove a sudo user'
}, async (message, match) => {
    if (!message.isSudo) return;

    let toDel = message.reply_message ? message.reply_message.sender.split('@')[0] : match.replace(/[^0-9]/g, '');

    if (!toDel) return await message.reply('❌ Give a number or reply to a message to remove.');

    if (config.SUDO.includes(toDel)) {
        // ലിസ്റ്റിൽ നിന്ന് നീക്കം ചെയ്യുന്നു
        config.SUDO = config.SUDO.filter(num => num !== toDel);
        updateConfig();
        await message.reply(`✅ @${toDel} removed from SUDO list.`);
    } else {
        await message.reply('❌ This number is not in SUDO list.');
    }
});

Module({ 
    pattern: 'getsudo',
    desc: 'List all sudo users'
}, async (message) => {
    if (!message.isSudo) return;
    if (config.SUDO.length === 0) return await message.reply('ℹ️ No SUDO users added.');
    
    let list = '👑 *ZENX-GOD SUDO USERS:*\n\n';
    config.SUDO.forEach((num, i) => {
        list += `${i + 1}. @${num}\n`;
    });
    await message.reply(list);
});

Module({ 
    pattern: 'setmode',
    desc: 'Change bot mode'
}, async (message, match) => {
    if (!message.isSudo) return;
    if (match === 'public' || match === 'private') {
        config.MODE = match;
        updateConfig();
        await message.reply(`✅ Mode changed to *${match}*`);
    } else {
        await message.reply('❌ Use: `.setmode public` or `.setmode private`');
    }
});
