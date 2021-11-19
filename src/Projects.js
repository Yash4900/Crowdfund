import React, { Component } from 'react';
import { ABI, ADDRESS } from './config.js';
import Web3 from 'web3';

class Projects extends Component {

	constructor(props) {
		super(props);
		var web3 = new Web3("http://localhost:7545");
		var contract = new web3.eth.Contract(ABI, ADDRESS);
		this.state = { projectCount: 0, projects: [], account: '', time: 0, web3: web3, contract: contract, index: 0, value: 0 };
	}

	componentWillMount() {
		this.getProjects();
	}

	findStatus(goal, gathered, deadline) {
		if (this.state.time < deadline) {
			return "Active";
		} else if (goal > gathered) {
			return "Failed";
		} else {
			return "Successful";
		}
	}

	async getProjects() {

		var seconds = new Date().getTime() / 1000;
		this.setState({ time: seconds });

		await this.state.contract.methods.projectCount().call().then((res, err) => {
			if (err) {
				console.log(err);
			} else {
				console.log(`Project Count = `, res);
				this.setState({ projectCount: res });
			}
		});

		for (let i = 1; i <= this.state.projectCount; i++) {
			this.state.contract.methods.projects(i).call().then((res, err) => {
				if (err) {
					console.log(err);
				} else {
					this.setState({
						projects: [...this.state.projects,
						{
							owner: res.owner,
							title: res.title,
							desc: res.description,
							goal: res.goalAmount / Math.pow(10, 18),
							gathered: res.gatheredAmount / Math.pow(10, 18),
							deadline: this.getDeadline(res.deadline),
							status: this.findStatus(res.goalAmount, res.gatheredAmount, res.deadline)
						}]
					});
				}
			});
		}
	}

	contribute(id) {
		if (this.state.index === id && this.state.value > 0) {
			this.state.contract.methods.contribute(id + 1, this.state.web3.utils.toWei(this.state.value, "ether")).send({ from: this.props.account, value: this.state.web3.utils.toWei(this.state.value, "ether") })
				.then((res) => {
					let projects = [...this.state.projects];
					let project = { ...projects[id] };
					project.gathered = parseFloat(project.gathered) + parseFloat(this.state.value);
					projects[id] = project;
					this.setState({ projects });
					this.showToast("You have successfully contributed for the project!", "success");
				}).catch((err) => {
					this.showToast(err, "error");
				});
		}
	}

	getRefund(id) {
		this.state.contract.methods.getRefund(id).send({ from: this.props.account }).then((res) => {
			this.showToast("Refund received successfully!", "success");
		}).catch((err) => {
			this.showToast(err, "error");
		});
	}

	getDeadline(epoch) {
		var date = new Date(epoch * 1000);
		var year = date.getFullYear();
		var month = date.getMonth() + 1;
		var day = date.getDate();
		var hours = date.getHours();
		var minutes = date.getMinutes();
		var seconds = date.getSeconds();
		return (day + "-" + month + "-" + year + " " + hours + ":" + minutes + ":" + seconds);
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
		if (this.state.projectCount === 0) {
			return (
				<div style={{ display: "flex", justifyContent: "center", marginTop: "100px" }}>
					<p>No Projects!</p>
				</div>
			);
		}
		return (

			<div className="container">

				<div className="col-md-10 offset-md-1" style={{ display: "flex", flexWrap: "wrap" }}>
					{
						this.state.projects.map((project, index) => {
							return (
								<div className="project-tile">
									<div style={{ margin: "20px", padding: "15px" }} className="bg-light rounded-lg">
										<p style={{ fontSize: "20px" }}><b>{project.title}</b> <span className={project.status} >{project.status}</span></p>
										<p>{project.desc}</p>
										<div style={{ margin: "2px", backgroundColor: "white", display: "flex" }}>
											<div style={{ textAlign: "center", width: "50%" }}>
												<p style={{ margin: "5px" }}>Goal</p>
												<p style={{ margin: "5px" }}><b>{project.goal}</b> ETH</p>
											</div>
											<div style={{ textAlign: "center", width: "50%" }}>
												<p style={{ margin: "5px" }}>Gathered</p>
												<p style={{ margin: "5px" }}><b>{project.gathered}</b> ETH</p>
											</div>
										</div>
										<p style={{ marginTop: "10px" }}><b>Deadline: </b>{project.deadline}</p>
										<div style={{ display: "flex", justifyContent: "flex-start", margin: "20px" }}>
											<div >
												<input className="inp" type="number" step="0.1" onChange={(e) => {
													this.setState({ index: index, value: e.target.value });
												}} />
											</div>
											<div style={{ marginLeft: "15px" }}></div>
											<div>
												<button id="fund-btn" disabled={project.status !== "Active"} onClick={() => this.contribute(index)}>FUND</button>
											</div>
										</div>
										<div style={{ display: "flex", justifyContent: "center", margin: "20px" }}>
											{
												project.status === "Failed" ?
													<button className="btn btn-dark btn-sm" onClick={(e) => this.getRefund(index + 1)}>
														GET REFUND
													</button>
													:
													<div></div>
											}
										</div>
									</div>
								</div>
							);
						})
					}
				</div>
			</div>

		);
	}
}

export default Projects;