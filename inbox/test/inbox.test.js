const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const { interface, bytecode } = require('../compile');

let accounts;
let inbox;

beforeEach('Deploying', async () => {
    //fetched accounts by ganache
    accounts = await web3.eth.getAccounts();

    //user one from accounts and deploy contract
    inbox = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode, arguments: ['Hello world!'] })
        .send({ from: accounts[0], gas: '1000000' });
});

describe('Inbox', () => {
    it('deploy a contract', () => {
        assert.ok(inbox.options.address);
    });

    it('has a default value', async () => {
        const message = await inbox.methods.message().call();
        assert.equal(message, 'Hello world!');
    });

    it('can update message', async () => {
        await inbox.methods.setMessage('Lets start').send({ from: accounts[0] });
        const message = await inbox.methods.message().call();
        assert.equal(message, 'Lets start');
    });
});