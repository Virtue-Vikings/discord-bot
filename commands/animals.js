const axios = require('axios');
const { isEmpty } = require('lodash');

// module.exports = async (message) => {
//     try {
//         const { data: { joke } } = await axios.get('https://icanhazdadjoke.com/', { 
//             headers: { 'Accept': 'application/json' } 
//         });
//         message.reply(joke);
//     } catch (error) {
//         console.log(error);
//         message.reply('There was an error.');
//     }
// };

const getAnimal = async (msg, url, transformer) => {
    msg.edit(':arrows_counterclockwise:');
    let data;
    if (!isEmpty(url)) {
        try {
            const res = await axios.get(url);
            data = res.data;
        } catch (error) {
            return msg.channel.send('Failed to fetch data.');
        }
    }

    let file;
    try {
        file = transformer(data);
    } catch (ignore) {
        return msg.channel.send('Failed to transform image URL!');
    }

    // msg.delete();
    msg.channel.send({ files: [file] });
};

module.exports = async (message, commandArgs) => {
    const splitArgs = commandArgs.split(' ');
    const action = splitArgs.shift();

    switch (action) {
        case 'cat':
            return getAnimal(message, 'http://thecatapi.com/api/images/get?format=json', body => body[0].url);

        case 'dog':
            return getAnimal(message, 'http://random.dog/woof', body => `http://random.dog/${body}`);

        case 'goat':
            return getAnimal(message, '', () => {
                const width = Math.floor((Math.random() * 700) + 100);
                const height = Math.floor((Math.random() * 700) + 100);
                return `https://placegoat.com/${width}/${height}.jpg`;
            });

        case 'fox':
            return getAnimal(message, 'https://randomfox.ca/floof/', body => body.image);

        default:
            return message.reply('Animal not supported.');
    }
};