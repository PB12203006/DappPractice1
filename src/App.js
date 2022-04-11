import { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import web3 from "./web3";
import lottery from "./lottery";

function App() {
  const [manager, setManager] = useState("");
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState("0");
  const [toBeDeposited, setToBeDeposited] = useState("0");
  const [account, setAccount] = useState("");
  const getData = async () => {
    const manager = await lottery.methods.manager().call();
    setManager(manager);

    const players = await lottery.methods.getPlayers().call();
    setPlayers(players);
    const balance = await web3.eth.getBalance(lottery.options.address);
    setBalance(balance);
    const account = (await web3.eth.getAccounts())[0];
    setAccount(account);
  };
  useEffect(() => {
    getData();
  }, []);

  const deposit = async () => {
    await lottery.methods.enter().send({
      from: account,
      value: web3.utils.toWei(toBeDeposited, "ether"),
    });
    alert("deposited");
    getData();
  };

  const pickWinner = async () => {
    await lottery.methods.pickWinner().send({
      from: account,
    });
    getData();
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <p>constract manager: {manager}</p>
        <p>playsers # {players.length}</p>
        <p>compete to win {web3.utils.fromWei(balance, "ether")}</p>
        <h5>deposit to win</h5>
        <input
          placeholder="amount in ether(minimum 0.01)"
          value={toBeDeposited}
          onChange={(event) => setToBeDeposited(event.target.value)}
        />
        <button onClick={deposit}>deposit</button>
        {account === manager && (
          <button onClick={pickWinner}>pickWinner</button>
        )}
      </header>
    </div>
  );
}

export default App;
