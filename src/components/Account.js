import React, { Component } from 'react';
import Web3 from 'web3';

class Account extends Component {

	componentWillMount() {
		this.loadAccountInfo();
	}

	async loadAccountInfo() {
		const web3 = new Web3(window.ethereum);
		const accounts = await web3.eth.getAccounts();
		const net = await web3.eth.net.getNetworkType();
		var bal = await web3.eth.getBalance(accounts[0]);
		bal = web3.utils.fromWei(bal, 'ether');
		this.setState({ account: accounts[0], balance: bal, network: net });
	}

	constructor(props) {
		super(props);
		this.state = { account: '', balance: 0, network: '' };
	}

	render() {
		return (
			<>
				<div style={{ textAlign: "center", marginTop: "40px" }}>
					<span style={{ margin: "auto", color: "grey" }}>Account </span>
					<span style={{ textTransform: "uppercase", color: "#1e88e5" }}>{this.state.network} TEST NETWORK</span>
					<p style={{ fontSize: "20px" }}><b>{this.state.account}</b></p>
				</div>
				<div style={{ textAlign: "center" }}>
					<p><b style={{ fontSize: "50px" }}>{this.state.balance}</b> ETH</p>
				</div>
			</>
		);
	}
}

export default Account;