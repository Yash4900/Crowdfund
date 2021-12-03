import React, { Component } from 'react';
import { ABI, ADDRESS } from '../config.js';
import Web3 from 'web3';
import Loading from './Loading.js';

class Projects extends Component {

	constructor(props) {
		super(props);
		var web3 = new Web3(window.ethereum);
		var contract = new web3.eth.Contract(ABI, ADDRESS);
		this.state = { loading: false, projectCount: 0, projects: [], account: '', time: 0, web3: web3, contract: contract, index: 0, value: 0 };
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
		this.setState({ loading: true });
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
					console.log(res);
					this.setState({
						projects: [
							{
								id: i,
								owner: res.owner,
								title: res.title,
								desc: res.description,
								goal: res.goalAmount / Math.pow(10, 18),
								gathered: res.gatheredAmount / Math.pow(10, 18),
								status: this.findStatus(this.state.web3.utils.fromWei(res.goalAmount, "ether"), this.state.web3.utils.fromWei(res.gatheredAmount, "ether"), res.deadline)
							}, ...this.state.projects]
					});
				}
			});
		}
		this.setState({ loading: false });
	}

	contribute(id, index) {
		this.setState({ loading: true });
		if (this.state.index === id && this.state.value > 0) {
			this.state.contract.methods.contribute(id, this.state.web3.utils.toWei(this.state.value, "ether")).send({ from: this.props.account, value: this.state.web3.utils.toWei(this.state.value, "ether") })
				.then((res) => {
					let projects = [...this.state.projects];
					let project = { ...projects[index] };
					project.gathered = parseFloat(project.gathered) + parseFloat(this.state.value);
					projects[index] = project;
					this.setState({ projects });
					this.setState({ loading: false });
					this.showToast("You have successfully contributed for the project!", "success");
				}).catch((err) => {
					this.setState({ loading: false });
					this.showToast(err, "error");
				});
		}
	}

	// getDeadline(epoch) {
	// 	var date = new Date(epoch * 1000);
	// 	var year = date.getFullYear();
	// 	var month = date.getMonth() + 1;
	// 	var day = date.getDate();
	// 	var hours = date.getHours();
	// 	var minutes = date.getMinutes();
	// 	var seconds = date.getSeconds();
	// 	return (day + "-" + month + "-" + year + " " + hours + ":" + minutes + ":" + seconds);
	// }

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
		if (this.state.loading) {
			return (<Loading></Loading>);
		}
		return (

			<div className="container">
				<div className="col-md-10 offset-md-1 mt-3"><b style={{ fontSize: "30px", marginLeft: "22px" }}>Projects</b></div>
				<div className="col-md-10 offset-md-1" style={{ display: "flex", flexWrap: "wrap" }}>
					{
						this.state.projects.map((project, index) => {
							let width = project.gathered * 100 / project.goal;
							let perc = width.toString() + "%";

							return (
								<div className="project-tile">
									<div style={{ margin: "20px", padding: "15px", backgroundColor: "white", borderRadius: "10px" }} className="rounded-lg shadow-sm">
										<p style={{ fontSize: "20px" }}><b>{project.title}</b> <span className={project.status} >{project.status}</span></p>
										<p className="text-muted">{project.desc}</p>
										<div className="bg-light" style={{ margin: "2px", display: "flex" }}>
											<div style={{ textAlign: "center", width: "50%" }}>
												<p style={{ margin: "5px" }}>Goal</p>
												<p style={{ margin: "5px" }}><b>{project.goal}</b> ETH</p>
											</div>
											<div style={{ textAlign: "center", width: "50%" }}>
												<p style={{ margin: "5px" }}>Gathered</p>
												<p style={{ margin: "5px" }}><b>{project.gathered}</b> ETH</p>
											</div>
										</div>
										<div style={{ margin: "2px", width: "100%", backgroundColor: "#d0d0d0" }}>
											<div style={{ width: perc, height: "10px", backgroundColor: "#786694" }}></div>
										</div>
										<div style={{ display: "flex", justifyContent: "flex-start", margin: "20px" }}>
											<div >
												<input className="inp" type="number" step="0.1" onChange={(e) => {
													this.setState({ index: project.id, value: e.target.value });
												}} />
											</div>
											<div style={{ marginLeft: "15px" }}></div>
											<div>
												<button id="fund-btn" disabled={project.status !== "Active"} onClick={() => this.contribute(project.id, index)}>FUND</button>
											</div>
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