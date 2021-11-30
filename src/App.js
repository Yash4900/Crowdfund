import React, { Component } from 'react';
import './App.css';
import Header from './components/Header.js';
import Web3 from 'web3';
import { ABI, ADDRESS } from './config.js';
import image from './images/loading.png';

class App extends Component {

  componentWillMount() {
    this.initialize();
  }

  constructor(props) {
    super(props);
    this.state = { metamaskEnabled: false, web3: undefined, account: '', contract: undefined, network: '' }
  }

  async initialize() {
    if (window.ethereum) {
      try {
        await window.ethereum.enable();
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        const net = await web3.eth.net.getNetworkType();
        const contract = new web3.eth.Contract(ABI, ADDRESS);
        this.setState({ metamaskEnabled: true, web3: web3, account: accounts[0], contract: contract, network: net });
      } catch {
        this.setState({ metamaskEnabled: false });
      }

    } else {
      this.setState({ metamaskEnabled: false });
    }
  }

  render() {
    if (this.state.metamaskEnabled) {
      return (
        <>
          <Header account={this.state.account} contract={this.state.contract} web3={this.state.web3}></Header>
        </>
      );
    } else {
      return (
        <div>
          <div style={{marginTop: "10%", width:"100%", display: "flex", justifyContent: "center"}}>
            <img src={image} width="10%"/>
          </div>
          <div style={{width:"100%", display: "flex", justifyContent: "center", marginTop: "30px"}}>
            <p>Connecting with Metamask ...</p>
          </div>
        </div>
      );
    }
  }
}

export default App;
