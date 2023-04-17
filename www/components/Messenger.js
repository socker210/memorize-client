// Yarn Modules
import React from "react";
import PropTypes from "prop-types";
import { Alert } from "reactstrap";
import { connect } from "react-redux";

// User Modules
import { MESSENGER_THEME } from "meta";
import { MESSENGER_HIDE } from "../modules/Reducer";


// Messenger class:
//   Messenger
class Messenger extends React.Component
{
	constructor(props)
	{
		super(props);

		// Bind User functions
		this.onHideMessenger = this.onHideMessenger.bind(this);
	}

	render()
	{
		// Declare Inline Style 
		let style = { display: (this.props.show? '' : 'none') };
		
		return (
			<div className="messenger" style={style}>
				<Alert color={this.props.theme}
					   onClick={this.onHideMessenger}
					   children={this.props.message} />
			</div>
		);
	}


	//#############################
	//## User functions			 ##
	//#############################
	// Hide Messenger
	onHideMessenger()
	{
		this.props.hide();
	}
}

// Set Default Props & Set Prop Types
Messenger.defaultProps = {
	show: false,
	message: '',
	theme: MESSENGER_THEME.BASIC
}

Messenger.propTypes = {
	show: PropTypes.bool,
	message: PropTypes.string,
	theme: function(props) {
		let matched = undefined;
		for (let key in MESSENGER_THEME) 
		{
			matched = MESSENGER_THEME[key] === props.theme? MESSENGER_THEME[key] : matched;
			if (matched) return;
		}
		return (matched)? null : new Error("Messenger theme type is wrong");
	}
}


// Connect Messenger to Redux store
let mapStateToProps = (state) => {
	return {
		show: state.messenger.get("show"),
		message: state.messenger.get("message"),
		theme: state.messenger.get("theme")
	}
}
let mapDispatchToProps = (dispatch) => {
	return {
		hide: () => dispatch(MESSENGER_HIDE())
	}
}
export default connect(mapStateToProps,mapDispatchToProps)(Messenger);