import React, { useState, useEffect } from 'react';
import './App.css';
import web3 from './web3';
import lottery from './lottery';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [Manager, setManager] = useState('');
  const [Players, setPlayers] = useState('');
  const [Balance, setBalance] = useState('');
  const [Value, setValue] = useState('');
  const [Accounts, setAccounts] = useState('');
  const [Message, setMessage] = useState('');
  const [Status, setStatus] = useState('');

  useEffect(() => {
    const getConnection = async () => {
      await window.ethereum.enable();
    }

    const getManager = async () => {
      const manager = await lottery.methods.manager().call();
      const players = await lottery.methods.allPlayers().call();
      const balance = await web3.eth.getBalance(lottery.options.address);
      const accounts = await web3.eth.getAccounts();

      setManager(manager);
      setPlayers(players);
      setBalance(balance);
      setAccounts(accounts);
    }

    getConnection();
    getManager();
  }, [Players, Balance, Manager, Accounts]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (Value > 0.1) {
      const accounts = await web3.eth.getAccounts();

      setMessage("Please Wait...");
      toast.info("Your transaction is being processed. Please Wait...", {autoClose:1500});

      await lottery.methods.enter().send({
        from: accounts[0],
        value: web3.utils.toWei(Value, 'ether')
      });

      setMessage("You entered in the lottery contract.");
      toast.info("Your transaction is done successfully and you are entered in lottery", {autoClose:1500});
    } else {
      toast.error("Please enter ethereum greater than 0.1", {autoClose:1500});
    }

  }

  const handlePickwinner = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    setMessage("Please Wait...");
    toast.info("Lottry contract is picking winner. Please Wait...", {autoClose:1500});

    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });

    setMessage("Winner declared.");
    toast.info("Winner is declared. Lottery contract is over...", {autoClose:1500});

    const win = await lottery.methods.getWinner().call();

    setStatus("Winner" + win);
  }

  const handleChange = (event) => {
    setValue(event.target.value);
  }

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>Lottery Contract</h2>
      <div style={{ marginLeft: "100px" }}>
        <p>Lottery contract is managed by - <u>{Manager}</u><br />
          There are currently <u>{Players.length}</u> players entered, competing to win <u>{web3.utils.fromWei(Balance, 'ether')}</u> ether!</p>
      </div>

      <hr></hr>

      <form onSubmit={handleSubmit}>
        <div style={{ marginLeft: "100px" }}>
          <h4>Do you want to try your luck ?</h4>
          <p>Amount of ether to enter :</p>
          <input style={{ width: "215px" }}
            type="text" id="ether" placeholder='Ether to participate' onChange={handleChange}
          /><br /><br />
          <button style={{ width: "60px", height: "30px" }}>Enter</button>
        </div>
        <ToastContainer/>
      </form>

      <hr></hr>

      <hr></hr>
      {
        Accounts[0] === Manager ?
          <div style={{ marginLeft: "100px" }}>
            <h4>Time to pick winner</h4>
            <button onClick={handlePickwinner} style={{ width: "100px", height: "30px" }}>Pick Winner</button>
          </div>
          : ""
      }

      <hr></hr>
      <div style={{ marginLeft: "100px" }}>
        {Message}
      </div>

      <hr></hr>

      <div style={{ marginLeft: "100px" }}>
        {Status}
      </div>
    </div>
  );
}

export default App;
