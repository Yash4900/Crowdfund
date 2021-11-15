import React, { Component } from 'react';
import './App.css';
import Header from './Header.js';
import Web3 from 'web3';
import { ABI, ADDRESS } from './config.js';

class App extends Component {

  componentWillMount() {
    this.initialize();
  }

  constructor(props) {
    super(props);
    this.state = { web3: undefined, account: '', contract: undefined, network: '' }
  }

  async initialize() {
    const web3 = new Web3("http://localhost:7545");
    const accounts = await web3.eth.getAccounts();
    const net = await web3.eth.net.getNetworkType();
    const contract = new web3.eth.Contract(ABI, ADDRESS);
    this.setState({ web3: web3, account: accounts[0], contract: contract, network: net });
  }

  render() {
    return (
      <>
        <Header account={this.state.account} contract={this.state.contract} web3={this.state.web3}></Header>
      </>
    );
  }
}

export default App;
