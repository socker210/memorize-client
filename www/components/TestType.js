import React from "react";
import { connect } from "react-redux";
import { FormGroup, Label, Input, Button } from "reactstrap";
import { API_STATUS, MESSENGER_THEME, TEST_TYPE } from "meta";
import { initializationTestAsChunk, MESSENGER_SHOW, TEST_CONTINUOUS } from "../modules/Reducer";


class TestType extends React.Component
{
	constructor(props)
	{
		super(props);

		// Initialize Local State
		this.state = {
			type: TEST_TYPE.MULTIPLE_CHOICE
		};

		// Bind User Function
		this.onChangeTestType = this.onChangeTestType.bind(this);
		this.onClickStartTest = this.onClickStartTest.bind(this);
	}

	render()
	{
		return (
			<div className="test-type-wrap">
				<div className="test-type">
					<FormGroup>
						<legend>Choose your test type</legend>
				        <FormGroup check>
				        	<Label check>
			              		<Input type="radio" 
			              			   value={TEST_TYPE.MULTIPLE_CHOICE}
			              			   checked={this.state.type === TEST_TYPE.MULTIPLE_CHOICE}
			              			   onChange={this.onChangeTestType} />
		          			   {` Multiple Choice`}
			              	</Label>
			            </FormGroup>
		          		<FormGroup check>
		            		<Label check>
		              			<Input type="radio" 
		              				   value={TEST_TYPE.SHORT_ANSWER_QUESTION}
		              				   checked={this.state.type === TEST_TYPE.SHORT_ANSWER_QUESTION}
		              				   onChange={this.onChangeTestType} />
		      				   {` Short answer Question`}
		              		</Label>
		          		</FormGroup>
					</FormGroup>
					<Button color="primary"
							children="Start"
							disabled={API_STATUS.PREPARING === this.props.api_state}
							onClick={this.onClickStartTest} />
				</div>
			</div>
		)
	}

	onChangeTestType(e)
	{
		// Updatae State
		this.setState({
			type: parseInt(e.target.value)
		});
	}

	onClickStartTest(e)
	{
		this.props.initializationTestAsChunk({
			_test_type: this.state.type
		})
		.then((response) => {
			if (response.state === API_STATUS.FAILURE) throw {message: response.message};
			if (response.code !== 200) throw {message: response.message};

			// Proceed Test
			this.props.continuous({
				continuous: true
			});
		})
		.catch((error) => {
			// Show Messenger
			this.props.show({
				theme: MESSENGER_THEME.DANGER,
				message: error.message
			});
		});
	}
}

let mapStateToProps = (state) => {
	return {
		api_state: state.testtype.getIn(["meta","api_state"])
	}
};
let mapDispatchToProps = (dispatch) => {
	return {
		initializationTestAsChunk: (params) => dispatch(initializationTestAsChunk(params)),
		show: (payload) => dispatch(MESSENGER_SHOW(payload)),
		continuous: (params) => dispatch(TEST_CONTINUOUS(params))
	}
};

export default connect(mapStateToProps,mapDispatchToProps)(TestType);