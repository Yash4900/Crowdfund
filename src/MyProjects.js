import React, { Component } from 'react';
import { ABI, ADDRESS } from './config.js';
import Web3 from 'web3';

class MyProjects extends Component {

	constructor(props) {
		super(props);
		var web3 = new Web3("http://localhost:7545");
		var contract = new web3.eth.Contract(ABI, ADDRESS);
		this.state = { projectCount: 0, contributions: [], projects: [], account: '', time: 0, web3: web3, contract: contract, index: 0, value: 0 };
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
					if (this.props.account === res.owner) {
						this.setState({
							projects: [...this.state.projects,
							{
								owner: res.owner,
								title: res.title,
								desc: res.description,
								goal: res.goalAmount / Math.pow(10, 18),
								gathered: res.gatheredAmount / Math.pow(10, 18),
								status: this.findStatus(res.goalAmount, res.gatheredAmount, res.deadline)
							}]
						});
					}
				}
			});
		}

		this.state.contract.getPastEvents('contribution', { fromBlock: 0, toBlock: 'latest', filter: { by: this.state.account } }).then((events) => {
			for (let i = 0; i < events.length; i++) {
				this.setState({
					contributions: [...this.state.contributions,
					{
						id: events[i].returnValues._pid,
						projectTitle: events[i].returnValues._title,
						amt: events[i].returnValues._amt / Math.pow(10, 18)
					}]
				});
			}
		});


	}

	claimFund(id) {
		this.state.contract.methods.claimFunds(id).send({ from: this.props.account }).then((res) => {
			this.showToast("Funds claimed successfully!", "success");
		}).catch((err) => {
			this.showToast(err, "error");
		});
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
			<div className="row mt-3">
				<div className="col-md-9" >
					<div><p style={{ fontSize: "25px", marginLeft: "20px" }}><b>Your Projects</b></p></div>
					<div style={{ display: "flex", flexWrap: "wrap" }}>
						{
							this.state.projects.map((project, index) => {
								return (
									<div className="project-tile">
										<div style={{ margin: "20px", padding: "15px" }} className="bg-light rounded-lg">
											<p style={{ fontSize: "20px" }}><b>{project.title}</b> <span className={project.status} >{project.status}</span></p>
											<p>{project.desc}</p>
											<div style={{ margin: "5px", backgroundColor: "white", display: "flex" }}>
												<div style={{ textAlign: "center", width: "50%" }}>
													<p style={{ margin: "5px" }}>Goal</p>
													<p style={{ margin: "5px" }}><b>{project.goal}</b> ETH</p>
												</div>
												<div style={{ textAlign: "center", width: "50%" }}>
													<p style={{ margin: "5px" }}>Gathered</p>
													<p style={{ margin: "5px" }}><b>{project.gathered}</b> ETH</p>
												</div>
											</div>
											<div style={{ display: "flex", justifyContent: "center", margin: "20px" }}>
												{
													project.status === "Successful" ?
														<button className="btn btn-dark btn-sm" onClick={(e) => this.claimFund(index + 1)}>
															CLAIM FUNDS
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
				<div className="col-md-3">
					<p style={{ fontSize: "25px" }}><b>Your Contributions</b></p>
					<table class="table table-striped">
						<thead>
							<tr>
								<th scope="col">Project ID</th>
								<th scope="col">Project Title</th>
								<th scope="col">Ethers</th>
							</tr>
						</thead>
						<tbody>
							{

								this.state.contributions.map((contribution, index) => {
									return (
										<tr>
											<th scope="row">{contribution.id}</th>
											<td>{contribution.projectTitle}</td>
											<td>{contribution.amt}</td>
										</tr>

									);
								})}
						</tbody>
					</table>
				</div>
			</div>
		);
	}
}

export default MyProjects;