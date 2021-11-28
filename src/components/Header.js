import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Projects from './Projects.js';
import MyProjects from './MyProjects.js';
import Home from './Home.js';
import StartProject from './StartProject.js';
import { useState } from 'react';
import image from '../images/account.png';

function Header(props) {

	const [balance, setBalance] = useState(0);

	async function getBalance() {
		let bal = await props.web3.eth.getBalance(props.account);
		bal = props.web3.utils.fromWei(bal, 'ether');
		bal = parseFloat(bal).toFixed(4);
		setBalance(bal);
	}

	async function showPopup(e) {
		await getBalance();
		document.getElementsByClassName("modal")[0].style.display = "block";
	}

	function closePopup(e) {
		document.getElementsByClassName("modal")[0].style.display = "none";
	}

	return (
		<>
			<Router>
				<nav className="navbar navbar-expand-lg navbar-light bg-light">
					<Link to="/" style={{ textDecoration: "none", color: "black", fontSize: "25px", marginLeft: "60px" }}>Crowd<b>fund</b><b style={{ color: "red" }}>.</b></Link>
					<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
						<span className="navbar-toggler-icon"></span>
					</button>
					<div className="collapse navbar-collapse" id="navbarNav" >
						<ul className="navbar-nav mt-2" style={{ position: "absolute", right: "60px", fontSize: "18px" }}>
							<li className="nav-item">
								<Link to="/all-projects" className="nav-link">Browser Projects</Link>
							</li>
							<li className="nav-item">
								<Link to="/my-projects" className="nav-link">Your Projects</Link>
							</li>
							<li className="nav-item">
								<Link to="/start-project" className="nav-link">Start Fundraiser Project</Link>
							</li>
							<li>
								<p className="account" onClick={showPopup}>Account</p>
							</li>
						</ul>
					</div>
				</nav>
				<Routes>
					<Route exact path="/" element={<Home />}>
					</Route>
					<Route path="/all-projects" element={<Projects account={props.account} />}>
					</Route>
					<Route path="/my-projects" element={<MyProjects account={props.account} />}>
					</Route>
					<Route path="/start-project" element={<StartProject contract={props.contract} account={props.account} />}>
					</Route>
				</Routes>
			</Router>
			<div className="modal">
				<div className="modal_content mx-auto">
					<div style={{ display: "flex", flexDirection: "row-reverse" }}><span className="close" onClick={closePopup}>&times;</span></div>
					<div style={{ display: "flex", justifyContent: "center" }}>
						<img src={image} width="40%" />
					</div>
					<div style={{ textAlign: "center", marginTop: "40px" }}>
						<span style={{ margin: "auto", color: "grey" }}>Account </span>
						<span style={{ textTransform: "uppercase", color: "#1e88e5" }}>{props.network} TEST NETWORK</span>
						<p style={{ fontSize: "20px" }}><b>{props.account}</b></p>
					</div>
					<div style={{ textAlign: "center" }}>
						<p><b style={{ fontSize: "50px" }}>{balance}</b> ETH</p>
					</div>
				</div>
			</div>
		</>
	);
}

export default Header;