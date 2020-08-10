const { stripIndent } = require('common-tags');
const Discord = require('discord.js');
const db = require('sequelize');
const response = require('./responses');
const commands = require('./commands');
const models = require('./models');

// Create new client
const client = new Discord.Client();
const STATIC_PREFIX = '!';
const DYNAMIC_PREFIX = '?';

// TODO: Update database with username and password.
const dbAddress = process.env.DB_HOST;
const sequelize = new db.Sequelize('database', 'user', 'password', {
    host: dbAddress,
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite',
});

const Adlibs = models.Adlibs(sequelize);
const Config = models.Config(sequelize);
const { Memories } = models.Memories(sequelize);
const { Louds, Louds_Banned } = models.Louds(sequelize);

// Startup message
client.once('ready', () => {
    // Sync tables.
    Adlibs.sync();
    Config.sync();
    Louds.sync();
    Louds_Banned.sync();
    Memories.sync();

    // Announcements
    console.log(stripIndent`
        One day each of you will come face to face with the horror of your own existence.
        One day you will cry out for help. One day each of you will find yourselves alone.
    `);
    const devChannel = client.channels.cache.find(chan => chan.name === 'development');
    devChannel.send('Successfully deployed.');
});

client.login(process.env.BOT_TOKEN);

client.on('message', async message => {
    if (message.author.bot) {
        return '';
    }

    // Commands can tell Odin to do something specific.
    //  STATIC_PREFIX are for strict command structures.
    //  DYNAMIC_PREFIX are for loose command structures.
    if (message.content.startsWith(STATIC_PREFIX)) {
        const input = message.content.slice(STATIC_PREFIX.length).split(' ');
        const command = input.shift();
        const commandArgs = input.join(' ');

        if (command === 'fear') {
            message.channel.send('Fear is the mindkiller.');
        } else if (command === 'adlib') {
            commands.Adlibs(message, commandArgs, { Adlibs });
        } else if (command === 'config') {
            commands.Config(message, commandArgs, { Config });
        } else if (command === 'dadjoke') {
            commands.DadJokes(message);
        } else if (command === 'loud') {
            commands.Louds(message, commandArgs, { Louds, Louds_Banned });
        } else {
            return message.reply('Command not recognized.');
        }
    }

    if (message.content.startsWith(DYNAMIC_PREFIX)) {
        await commands.Memories(message, { Memories });
    }
});

client.on('message', async message => {
    // Odin doesn't respond to itself and other bots.
    if (message.author.bot) {
        return '';
    }

    // Call each response here. It will 'respond' to these functions.
    // They should have a regex, on what they are listening for.
    await response.Louds(message, { Louds, Louds_Banned });
    await response.Adlibs(message, { Adlibs });
});
