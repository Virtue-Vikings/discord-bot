const animals = require('./animals');
const botConfig = require('../config');
const axios = require('axios');
jest.mock('axios');

const mockMath = Object.create(global.Math);
mockMath.random = () => 1;
global.Math = mockMath;

describe('commands/animals', () => {
    let message = {};

    beforeEach(() => {
        message = {
            author: { id: botConfig.serverOwner, username: 'guy' },
            channel: { send: jest.fn().mockName('send') },
            reply: jest
                .fn()
                .mockResolvedValue(true)
                .mockName('reply'),
            edit: jest.fn(),
            error: jest.fn(),
            delete: jest.fn(),
        };
        axios.get.mockResolvedValue();
    });

    const run = async (command) => {
        return await animals(message, command);
    };

    it('should fetch a cute cat picture', async () => {
        axios.get.mockResolvedValue({ data: [{ id: 'fake-id', url: 'fake-cat-picture' }] });
        await run('cat');
        const send = message.channel.send;
        expect(send).toBeCalledTimes(1);
        expect(send).toBeCalledWith({ files: ['fake-cat-picture'] });
    });

    it('should fetch a cute dog picture', async () => {
        axios.get.mockResolvedValue({ data: 'fake-dog-image' });
        await run('dog');
        const send = message.channel.send;
        expect(send).toBeCalledTimes(1);
        expect(send).toBeCalledWith({ files: ['http://random.dog/fake-dog-image'] });
    });

    it('should fetch a cute goat picture', async () => {
        axios.get.mockResolvedValue({ data: 'fake-dog-image' });
        await run('goat');
        const send = message.channel.send;
        expect(send).toBeCalledTimes(1);
        expect(send).toBeCalledWith({ files: ['https://placegoat.com/800/800.jpg'] });
    });

    it('should fetch a cute fox picture', async () => {
        axios.get.mockResolvedValue({ data: { image: 'fake-fox-image' } });
        await run('fox');
        const send = message.channel.send;
        expect(send).toBeCalledTimes(1);
        expect(send).toBeCalledWith({ files: ['fake-fox-image'] });
    });

    it('should throw an error if not recognized', async () => {
        axios.get.mockResolvedValue({});
        await run('cat');
        const send = message.channel.send;
        expect(send).toBeCalledTimes(1);
        expect(send).toBeCalledWith('Failed to transform image URL!');
    });

    it('should throw an error if failed to fetch', async () => {
        axios.get.mockRejectedValue(new Error('error'));
        await run('dog');
        const send = message.channel.send;
        expect(send).toBeCalledTimes(1);
        expect(send).toBeCalledWith('Failed to fetch data.');
    });

    it('should respond with animal not supported', async () => {
        axios.get.mockRejectedValue(new Error('error'));
        await run('chicken');
        const reply = message.reply;
        expect(reply).toBeCalledTimes(1);
        expect(reply).toBeCalledWith('Animal not supported.');
    });
});