// Yarn Packages
import React from "react";

// User Components
import Header from "./Header";


// Wrapper class:
//   Component wrapper component
export default class Wrapper extends React.Component
{
	constructor(props)
	{
		super(props);
	}

	render()
	{
		return (
			<div>
				<Header />
			</div>
		);
	}
}