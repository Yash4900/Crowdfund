import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import image from '../images/home.svg';

class Home extends Component {

	render() {
		return (
			<div className="col-md-10 offset-md-1" style={{ marginTop: "70px" }}>
				<div className="row">
					<div className="col-md-1"></div>
					<div className="col-md-5">
						<p style={{ fontSize: "50px", lineHeight: "1", marginTop: "100px" }}><b>Need funds for your project?</b></p>
						<div className="start">
							<Link to='/start-project' style={{ textDecoration: "none", color: "gray", fontSize: "20px" }}><span style={{ fontSize: "25px" }}>+</span> Start a project</Link>
						</div>
						<div style={{ marginTop: "50px" }}>
							<small>
								<Link to="all-projects" style={{ textDecoration: "none" }}>Want to contribute?</Link>
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