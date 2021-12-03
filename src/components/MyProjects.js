import React, { Component } from 'react';
import { ABI, ADDRESS } from '../config.js';
import Web3 from 'web3';
import Loading from './Loading.js';

class MyProjects extends Component {

	constructor(props) {
		super(props);
		var web3 = new Web3(window.ethereum);
		var contract = new web3.eth.Contract(ABI, ADDRESS);
		this.state = { loading:false, projectCount: 0, contributions: [], projects: [], account: props.account, time: 0, web3: web3, contract: contract, index: 0, value: 0 };
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
		this.setState({loading:true});
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
							projects: [
							{
								id: i,
								owner: res.owner,
								title: res.title,
								desc: res.description,
								goal: res.goalAmount / Math.pow(10, 18),
								gathered: res.gatheredAmount / Math.pow(10, 18),
								claimed: res.fundsClaimed,
								status: this.findStatus(this.state.web3.utils.fromWei(res.goalAmount, "ether"), this.state.web3.utils.fromWei(res.gatheredAmount, "ether"), res.deadline)
							}, ...this.state.projects]
						});
					}
				}
			});
		}

		this.state.contract.getPastEvents('contribution', { fromBlock: 0, toBlock: 'latest' }).then((events) => {
			for (let i = 0; i < events.length; i++) {
				if(events[i].returnValues.by === this.state.account) {
				this.setState({
					contributions: [...this.state.contributions,
					{
						id: events[i].returnValues._pid,
						projectTitle: events[i].returnValues._title,
						amt: events[i].returnValues._amt / Math.pow(10, 18)
					}]
				});
			}}
		});

		this.setState({loading: false});
	}

	claimFund(id, claimed) {
		if(claimed) {
			this.showToast("Funds have been claimed already!", "error");
		} else{
		this.setState({loading: true});
		this.state.contract.methods.claimFunds(id).send({ from: this.props.account }).then((res) => {
			this.setState({loading: false});
			this.showToast("Funds claimed successfully!", "success");
		}).catch((err) => {
			this.setState({loading: false});
			this.showToast(err, "error");
		});
	}
	}

	getRefund(id) {
		this.setState({loading: true});
		this.state.contract.methods.getRefund(id).send({ from: this.props.account, gas:200000 }).then((res) => {
			this.setState({loading: false});
			this.showToast("Refund received successfully!", "success");
		}).catch((err) => {
			this.setState({loading: false});
			this.showToast(err, "error");
			console.log(err);
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
		if(this.state.loading) {
			return (<Loading></Loading>);
		}
		return (
			<div className="row mt-3">
				<div className="col-md-9" >
					<div><p style={{ fontSize: "25px", marginLeft: "20px" }}><b>Your Projects</b></p></div>
					<div style={{ display: "flex", flexWrap: "wrap" }}>
						{
							this.state.projects.map((project, index) => {
								return (
									<div className="project-tile">
										<div style={{ margin: "20px", padding: "15px", backgroundColor:"white", borderRadius:"10px" }} className="rounded-lg">
											<p style={{ fontSize: "20px" }}><b>{project.title}</b> <span className={project.status} >{project.status}</span></p>
											<p className="text-muted">{project.desc}</p>
											<div className="bg-light" style={{ margin: "5px", display: "flex" }}>
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
														<button disabled={this.state.loading} className="btn btn-dark btn-sm" onClick={(e) => this.claimFund(project.id, project.claimed)}>
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
					<table className="table table-striped">
						<thead>
							<tr>
								<th scope="col">Project ID</th>
								<th scope="col">Project Title</th>
								<th scope="col">Ethers</th>
								<th scope="col"></th>
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
											<td>
												<button disabled={this.state.loading} className="btn btn-dark btn-sm" onClick={(e) => this.getRefund(contribution.id)}>
													REFUND
												</button>
											</td>
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