import React, { Component } from 'react';
import { ABI, ADDRESS } from './config.js';
import Web3 from 'web3';

class MyProjects extends Component {

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
					if (this.props.account == res.owner) {
						this.setState({
							projects: [...this.state.projects,
							{
								owner: res.owner,
								title: res.name,
								desc: res.description,
								goal: res.goalAmount,
								gathered: res.gatheredAmount,
								status: this.findStatus(res.goalAmount, res.gatheredAmount, res.deadline)
							}]
						});
					}
				}
			});
		}
	}

	contribute(id) {

		if (this.state.index == id && this.state.value > 0) {
			this.state.contract.methods.contribute(id + 1, this.state.value).send({ from: this.props.account, value: this.state.web3.utils.toWei(this.state.value, "ether") })
				.then((res) => {
					let projects = [...this.state.projects];
					let project = { ...projects[id] };
					project.gathered = parseInt(project.gathered) + parseInt(this.state.value);
					projects[id] = project;
					this.setState({ projects });
				}).catch((err) => {
					alert(err);
				});
		} else {

		}
	}

	claimFund(id) {
		this.state.contract.methods.claimFunds(id).send({ from: this.props.account }).then((res) => {

		}).catch((err) => {
			alert(err);
		});
	}

	render() {
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
												project.status == "Successful" ?
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
		);
	}
}

export default MyProjects;