// Yarn Packages
import React from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";
import { Container, Collapse } from "reactstrap";

// User Component
import Messenger from "./Messenger";
import MemorizeViewer from "./MemorizeViewer";
import Memorizer from "./Memorizer";
import Test from "./Test";
import TestResult from "./TestResult";


// Header class:
//   Page navigator Component
export default class Header extends React.Component
{
	constructor(props)
	{
		super(props);

		// Initialize Local State
		this.state = {
			links: [{to: "/test", children: "TI"},
					{to: "/test_result", children: "TO"},
					{to: "/", children: "O"},
					{to: "/new", children: "I"}],
			routes: [{path: "/test", exact: true, component: "Test"},
					 {path: "/test_result", exact: true, component: "TestResult"},
					 {path: "/", exact: true, component: "MemorizeViewer"},
				     {path: "/new/:id?", exact: true, component: "Memorizer"}]
		}
	}

	render()
	{
		return (
			<BrowserRouter>
				<div>
					<div className="header">
						<Container>
							<span className="logo">Memorize</span>
							<div className="links">
								{
									// Create Link
									this.state.links.map((item,i) => {
										return (
											<div key={i}
												 className="item">
												<Link to={item.to}
												      children={item.children} />
											</div>
										);
									})
								}
							</div>
						</Container>
					</div>
					<div>
						<Container>
						<Messenger />
						{
							// Create Route
							this.state.routes.map((item,i) => {
								return (
									<Route key={i}
										   path={item.path}
										   exact={item.exact}
										   component={this.onSwitchComponentAsText(item.component)} />
								);
							})
						}
						</Container>
					</div>
				</div>
			</BrowserRouter>
		);
	}


	//#######################################
	//## User Function					   ##
	//#######################################
	// Switch Text to Component
	onSwitchComponentAsText(component)
	{
		// Reg Component here
		switch(component)
		{
			case "MemorizeViewer": return MemorizeViewer;
			case "Memorizer": return Memorizer;
			case "Test": return Test;
			case "TestResult": return TestResult;
		}
	}
}