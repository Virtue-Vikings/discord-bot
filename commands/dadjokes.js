const axios = require('axios');

module.exports = async (message) => {
    try {
        const { data: { joke } } = await axios.get('https://icanhazdadjoke.com/', { 
            headers: { 'Accept': 'application/json' } 
        });
        message.reply(joke);
    } catch (error) {
        console.log(error);
        message.reply('There was an error.');
    }
};