const HdWalletProvide = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');
const mnemonic = require('./Key');
const api = require('./API');

const provider = new HdWalletProvide(
    mnemonic,
    api
);

const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();

    console.log("Attempting to deploy from - ", accounts[0]);

    const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode })
    .send({ gas: '1000000', from: accounts[0] });

    console.log(interface);
    console.log("Contract is deployed on - ",result.options.address);
}
deploy();