import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import image from './home.svg';

class Home extends Component {

	showToast(message) {
		// Get the snackbar DIV
		var x = document.getElementById("snackbar");
		document.querySelector("#snackbar #title #bold").innerHTML = "Oops!";
		x.style.backgroundColor = "#b00020";
		// Add the "show" class to DIV
		x.className = "show";
		// After 3 seconds, remove the show class from DIV
		setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
	}

	render() {
		return (
			<div className="col-md-10 offset-md-1" style={{ marginTop: "70px" }}>
				<div className="row">
					<div className="col-md-1"></div>
					<div className="col-md-5">
						<p style={{ fontSize: "50px", lineHeight: "1", marginTop: "100px" }} onClick={(e) => this.showToast("Hello my name is yash")}><b>Need funds for your project?</b></p>
						<div className="start" style={{ marginTop: "50px", backgroundColor: "#f7f7f7", width: "35%", height: "50px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius:"5px" }}>
							<Link to='/start-project' style={{ textDecoration: "none", color: "gray", fontSize: "20px" }}><span style={{ fontSize: "25px" }}>+</span> Start a project</Link>
						</div>
						<div style={{marginTop: "50px"}}>
						<small>
							<Link to="all-projects" style={{ textDecoration:"none" }}>Want to contribute?</Link>
						</small>
						</div>
					</div>

					<div className="col-md-6">
						<img src={image} width="100%" />
					</div>
				</div>
			</div>
		);
	}
}

export default Home;