import React from "react";
import { connect } from "react-redux";
import TestType from "./TestType";
import Question from "./Question";
import { checkTestStateASChunk, MESSENGER_SHOW } from "../modules/Reducer"
import { MESSENGER_THEME, API_STATUS } from "meta";


class Test extends React.Component
{
	constructor(props)
	{
		super(props);
	}

	componentDidMount()
	{
		// Call API
		this.props.checkTestStateASChunk()
		.then((response) => {
			if (response.state === API_STATUS.FAILURE) throw {message: response.message};
		})
		.catch((error) => {
			// Show Messenger
			this.props.show({
				theme: MESSENGER_THEME.DANGER,
				message: error.message
			});
		});
	}

	render()
	{
		return (
			<div>
				{
					[API_STATUS.INITIALIZATION,API_STATUS.PREPARING,API_STATUS.FAILURE].indexOf(this.props.api_state) !== -1?
					'' :
					!this.props.continuous?
					<TestType /> :
					<Question />
				}
			</div>
		)
	}
}

let mapStateToProps = (state) => {
	return {
		api_state: state.test.getIn(["meta","api_state"]),
		continuous: state.test.getIn(["api","continuous"]),
	}
};

let mapDispatchToProps = (dispatch) => {
	return {
		checkTestStateASChunk: () => dispatch(checkTestStateASChunk()),
		show: (payload) => dispatch(MESSENGER_SHOW(payload))
	}
};

export default connect(mapStateToProps,mapDispatchToProps)(Test);