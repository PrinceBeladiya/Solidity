const HdWalletProvide = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');

const provider = new HdWalletProvide(
    'paper enroll rookie laundry replace inspire wink pupil hip indoor absorb barrel',
    'https://rinkeby.infura.io/v3/d50e9e25f12e4dd6bfddd3c771b78ccd'
);

const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();

    console.log("Attempting to deploy from - ", accounts[0]);

    const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode, arguments: ['Hello world!']})
    .send({ gas: '1000000', from: accounts[0] });

    console.log("Contract is deployed on - ",result.options.address);
}
deploy();