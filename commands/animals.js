const axios = require('axios');

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
    let res;
    try {
        res = await axios.get(url);
    } catch (error) {
        return msg.error('Failed to fetch data.');
    }

    let file;
    try {
        file = transformer(res.data);
    } catch (ignore) {
        return msg.error('Failed to transform image URL!');
    }

    msg.delete();
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

        default:
            return message.reply('Animal not supported.');
    }
};