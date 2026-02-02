const config = require('../config');

Module({
    pattern: 'menu',
    desc: 'Bot-ile ellaa commands-um list cheyyan'
}, async (message, match) => {
    // Commands grouping and listing
    let menuText = `╭━━━〔 *${config.BOT_NAME}* 〕━━━┈\n`;
    menuText += `┃ 👤 *User:* @${message.sender}\n`;
    menuText += `┃ ⚙️ *Prefix:* ${config.PREFIX}\n`;
    menuText += `┃ 🛠️ *Mode:* ${config.MODE}\n`;
    menuText += `╰━━━━━━━━━━━━━━━┈\n\n`;

    menuText += `╭━━━━〔 *COMMANDS* 〕━━━━┈\n`;

    // Global commands array-il ninnu ellaa patterns-um edukkunnu
    // index.js-il commands enna array-il aanu ellam store cheythittullath
    // Ithu work aakan index.js-il commands array global aakkanam
    
    global.commands.forEach((cmd, i) => {
        menuText += `┃ ${i + 1}. ${config.PREFIX}${cmd.pattern}\n`;
    });

    menuText += `╰━━━━━━━━━━━━━━━┈\n\n`;
    menuText += `*Total Commands:* ${global.commands.length}`;

    await message.reply(menuText);
});
       
