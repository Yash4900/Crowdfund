import React, { Component } from 'react';
import image from '../images/start.svg';
import { ABI, ADDRESS } from '../config.js';
import Web3 from 'web3';

class StartProject extends Component {

	constructor(props) {
		super(props);
		this.state = { title: '', desc: '', mins: 0, goal: 0 };
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	async createNewProject(title, desc, mins, goal) {
		const web3 = new Web3(window.ethereum);
		const contract = new web3.eth.Contract(ABI, ADDRESS);
		contract.methods.createProject(title, desc, mins, web3.utils.toWei(goal, "ether")).send({ from: this.props.account, gas: 200000 })
			.then((res) => {
				this.showToast("Project created successfully!", "success");
			}).catch((err) => {
				this.showToast("Something went wrong", "error");
			});
	}

	handleSubmit(e) {
		e.preventDefault();
		this.createNewProject(this.state.title, this.state.desc, this.state.mins, this.state.goal);
	}

	showToast(message, type) {
		var x = document.getElementById("snackbar");
		document.querySelector("#snackbar #message").innerHTML = message;
		if (type === "success") {
			document.querySelector("#snackbar #title #bold").innerHTML = "Success!";
			x.style.backgroundColor = "#9df2a3";
		} else {
			document.querySelector("#snackbar #title #bold").innerHTML = "Oops!";
			x.style.backgroundColor = "#fab1af";
		}
		x.className = "show";
		// After 3 seconds, remove the show class from DIV
		setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
	}

	render() {
		return (
			<div className="col-md-10 offset-md-1" style={{ marginTop: "20px" }}>
				<div className="row">
					<div className="col-md-6">
						<p style={{ fontSize: "50px", lineHeight: "1" }}><b>Start a new fundraiser project</b></p>
						<div className="bg-light px-2" style={{ marginTop: "40px", paddingTop: "40px", paddingBottom: "40px" }}>
							<form onSubmit={this.handleSubmit}>
								<div className="form-group row my-2">
									<label for="title" className="col-md-2 col-form-label">Title</label>
									<div className="col-md-10">
										<input type="text" onChange={(e) => this.setState({ title: e.target.value })} className="form-control" id="title" placeholder="Enter project title" />
									</div>
								</div>
								<div className="form-group row my-2">
									<label className="col-md-2" for="description">Description</label>
									<div className="col-md-10">
										<textarea class="form-control" onChange={(e) => this.setState({ desc: e.target.value })} id="description" rows="3" placeholder="Enter project description"></textarea></div>
								</div>
								<div className="form-group row" style={{ marginTop: "40px" }}>
									<div className="col-md-6 row">
										<label for="goal" className="col-md-3 col-form-label">Goal</label>
										<div className="col-md-9">
											<input type="number" step="0.1" className="form-control" onChange={(e) => this.setState({ goal: e.target.value })} id="goal" placeholder="Goal amount in ETH" />
										</div>
									</div>
									<div className="col-md-6 row">
										<label for="deadline" className="col-md-3 col-form-label">Deadline</label>
										<div className="col-md-9">
											<input type="number" className="form-control" onChange={(e) => this.setState({ mins: e.target.value })} id="deadline" placeholder="Enter project deadline" />
										</div>
									</div>
								</div>
								<div className="d-flex justify-content-center py-3">
									<button type="submit" className="btn btn-dark">CREATE</button>
								</div>
							</form>
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

export default StartProject;