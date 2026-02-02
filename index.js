const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const fs = require('fs');
const path = require('path');
const pino = require('pino');
const qrcode = require('qrcode-terminal');
const config = require('./config');

// Commands list global aakkunnu (Menu-vin vendi)
global.commands = []; 
global.Module = (info, func) => {
    global.commands.push({ ...info, function: func });
};

async function startBot() {
    const authFolder = path.join(__dirname, 'auth_session');
    const { state, saveCreds } = await useMultiFileAuthState(authFolder);
    
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false, // Nammal manual aayi print cheyyunnu
        logger: pino({ level: 'silent' }),
        browser: [config.BOT_NAME, "Chrome", "1.0.0"] 
    });

    // QR Code terminal-il kaanikkan
    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;
        
        if (qr) {
            console.log('📢 Scan the QR code below:');
            qrcode.generate(qr, { small: true });
        }

        if (connection === 'open') {
            console.log(`✅ ${config.BOT_NAME} Online aayi!`);
            for (const num of config.SUDO) {
                await sock.sendMessage(num + '@s.whatsapp.net', { text: `🚀 *${config.BOT_NAME} Connected!*` });
            }
        } else if (connection === 'close') {
            const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) startBot();
        }
    });

    // Plugin loader
    const pluginsPath = path.join(__dirname, 'plugins');
    if (fs.existsSync(pluginsPath)) {
        fs.readdirSync(pluginsPath).forEach(file => {
            if (file.endsWith('.js')) require(path.join(pluginsPath, file));
        });
    }

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0];
        if (!msg.message) return; 

        const jid = msg.key.remoteJid;
        const sender = (msg.key.participant || jid).split('@')[0];
        const isSudo = config.SUDO.includes(sender) || msg.key.fromMe;

        if (config.MODE === 'private' && !isSudo) return;

        const text = msg.message.conversation || msg.message.extendedTextMessage?.text || "";
        const prefix = config.PREFIX;
        if (!text.startsWith(prefix)) return;

        const cmdName = text.slice(prefix.length).trim().split(' ')[0].toLowerCase();
        const match = text.slice((prefix + cmdName).length).trim();

        for (const cmd of global.commands) {
            if (cmd.pattern === cmdName) {
                const message = {
                    jid: jid,
                    isSudo: isSudo,
                    sender: sender,
                    reply_message: msg.message.extendedTextMessage?.contextInfo ? {
                        sender: msg.message.extendedTextMessage.contextInfo.participant
                    } : null,
                    reply: async (t) => sock.sendMessage(jid, { text: t }),
                    sendVideo: async (url, cap) => sock.sendMessage(jid, { video: { url }, caption: cap }),
                    key: msg.key
                };
                await cmd.function(message, match);
            }
        }
    });
}

startBot();
