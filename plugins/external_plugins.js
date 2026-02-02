const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Install Command (No Reboot)
Module({
    pattern: 'install',
    desc: 'Install a new plugin from a URL',
    category: 'owner'
}, async (message, match) => {
    if (!message.isSudo) return;
    if (!match) return await message.reply("❌ ഒരു URL നൽകുക.");

    let url = match;
    // Gist link handle cheyyാൻ
    if (url.includes('gist.github.com')) {
        url = url.endsWith('/raw') ? url : url + '/raw';
    } else {
        url = url.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
    }

    try {
        await message.reply("⏳ *Installing...*");
        const response = await axios.get(url);
        const pluginName = path.basename(url).replace('.js', '') + '_external.js';
        const filePath = path.join(__dirname, pluginName);

        fs.writeFileSync(filePath, response.data);
        
        // Reboot cheyyaathe plugin load cheyyunnu
        require(filePath); 
        
        await message.reply(`✅ *Plugin Installed Successfully!*\n\n*Name:* ${pluginName}\n*Status:* Active (No Reboot)`);
    } catch (e) {
        await message.reply("❌ Install cheyyan pattunnilla. Link check cheyyuka.");
    }
});

// Remove Command (With Reboot)
Module({
    pattern: 'remove',
    desc: 'Remove an external plugin',
    category: 'owner'
}, async (message, match) => {
    if (!message.isSudo) return;
    if (!match) return await message.reply("❌ പ്ലഗിൻ പേര് നൽകുക. (ഉദാ: .remove youtube_external)");

    const fileName = match.endsWith('.js') ? match : match + '.js';
    const filePath = path.join(__dirname, fileName);

    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        await message.reply(`🗑️ *${fileName}* removed. Bot restart aakunnu...`);
        
        // Remove cheydaal maathram restart cheyyunnu
        process.exit(0); 
    } else {
        await message.reply("❌ അങ്ങനെയൊരു പ്ലഗിൻ കണ്ടെത്തിയില്ല.");
    }
});
