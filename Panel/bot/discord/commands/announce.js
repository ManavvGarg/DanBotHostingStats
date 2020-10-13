const Discord = require("discord.js");

const parse = (string, options) => {
    if (!(options instanceof Object)) options = {};

    let flagsToUse = ['e', 'ed', 'eh', 'ef', 'ec', 'et', 'nm'];

    string = string.trim();
    let flags = string.split(/-+/);

    let toReturn = {
        '__': flags.shift().trim().split(/ +/)
    };

    flags.forEach(x => {
        let args = x.trim().split(/ +/);

        if (!flagsToUse.includes(args[0].toLowerCase())) {
            toReturnKeys = Object.keys(toReturn);
            toReturn[toReturnKeys[toReturnKeys.length - 1]] = toReturn[toReturnKeys[toReturnKeys.length - 1]] + " -" + args.join(" ");
            return;
        }

        let flag = args.shift().toLowerCase();

        if (args.length == 0)
            if (flag) args = true;

        if (args.length > 0) args = args.join(" ");
        toReturn[flag] = args;
    });
    return toReturn;
};

exports.run = async (client, message, args) => {

    if (!message.member.hasPermission("ADMINISTRATOR") && message.author.id != "293841631583535106") return;

    let flags = {
        nm: 'Normal message',
        e: 'Enable embed',
        eh: 'Embed Header',
        ed: 'Embed Description',
        ef: 'Embed Footer',
        ec: 'Embed Color',
        et: 'Embed Timestamp'
    }
    let flagsdesc = ""
    const entries = Object.entries(flags)
    for (const [flags, value] of entries) {
        flagsdesc += `**-${flags}** >> ${value}\n`
    }
    if (args.length < 1) {
        message.channel.send("", {
            embed: new Discord.RichEmbed()
                .setColor("YELLOW")
                .setDescription(`Incorrect Usage!\nusage: \`DBH!announce <#channel | ChannelID> [-nm <message> | [-e [-eh <message> | -ed <message> | -ef <message> | -ec <color> | -et]]]\``)
                .addField("**Variables:**", flagsdesc)
                .setTimestamp().setFooter(message.guild.name, message.guild.iconURL)
        })
        return;
    }

    let channel = message.guild.channels.find(x => x.id == args[0].match(/[0-9]{18}/));
    if (!channel) {
        message.channel.send("", {
            embed: new Discord.RichEmbed()
                .setColor("YELLOW")
                .setDescription(`Couldn't find that channel.`)
                .setTimestamp().setFooter(message.guild.name, message.guild.iconURL)
        })
        return;
    }

    let embedData = parse(args.join(" ").slice(args[0].length + 1));
    let embed = null;
    let normalMessage = embedData.nm || "";
    if (embedData.e) {
        embed = new Discord.RichEmbed();
        if (embedData.ed) embed.setDescription(embedData.ed);
        if (embedData.ec) embed.setColor(embedData.ec.toUpperCase());
        if (embedData.eh) embed.setTitle(embedData.eh);
        if (embedData.ef) embed.setFooter(embedData.ef);
        if (embedData.et) embed.setTimestamp(embedData.et);
    }
    channel.send(normalMessage, embed);

};