// lib/events.js
var config = require('../config');
var commands = [];

function Module(info, func) {
    var types = ['photo', 'video', 'audio', 'sticker', 'quoter', 'text', 'misc'];
    var infos = {
        fromMe: info['fromMe'] === undefined ? true : info['fromMe'],
        onlyGroup: info['onlyGroup'] === undefined ? false : info['onlyGroup'],
        onlyPinned: info['onlyPinned'] === undefined ? false : info['onlyPinned'],
        onlyPm: info['onlyPm'] === undefined ? false : info['onlyPm'],
        deleteCommand: info['deleteCommand'] === undefined ? true : info['deleteCommand'],
        desc: info['desc'] === undefined ? '' : info['desc'],
        usage: info['usage'] === undefined ? '' : info['usage'],
        dontAddCommandList: info['dontAddCommandList'] === undefined ? false : info['dontAddCommandList'],
        warn: info['warn'] === undefined ? '' : info['warn'],
        function: func
    };

    if (info['on'] !== undefined) {
        infos['on'] = info['on'];
    } else {
        infos['pattern'] = info['pattern'];
    }

    commands.push(infos);
    return infos;
}

module.exports = {
    Module: Module,
    commands: commands
};
