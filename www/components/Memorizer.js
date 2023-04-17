// Yarn Modules
import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Input, Button } from "reactstrap";

// User Components
import { putMemoAsChunk, getMemoAsChunk, MESSENGER_SHOW } from "../modules/Reducer";
import { MESSENGER_THEME, API_STATUS } from "meta";


// Memorizer class:
//   Put your new memo
class Memorizer extends React.Component
{
	constructor(props)
	{
		super(props);

		// Initialize Local State
		this.state = {
			// Memo ID
			memo_id: this.props.match.params.id || null,
			// Title
			title: "" ,
			// Sub Title
			sub_title: "" ,
			// Contents
			contents: ""
		}

		// Bind user functions
		this.onUpdateState = this.onUpdateState.bind(this);
		this.onMemo = this.onMemo.bind(this);
	}

	componentDidMount()
	{
		// Bind data
		if (this.state.memo_id)
		{			
			//TODO: Make API to Memorizer 
			this.props.getMemoAsChunk({
				memo_id: this.state.memo_id
			})
			.then((response) => {
				this.setState({
					title: response.data.data.data.memolist[0]["title"] ,
					sub_title: response.data.data.data.memolist[0]["sub_title"] ,
					contents: response.data.data.data.memolist[0]["contents"]
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

	render()
	{
		return (
			<div className="memorizer-wrap">
				<div className="memorizer">
					<div className="label remove-margin-top">
						<span>New Title</span>
					</div>
					<div className="input">
						<Input type="text"
						   	   id="title"
						   	   value={this.state.title}
						   	   onChange={this.onUpdateState} />
					</div>
					<div className="label">
						<span>New Subtitle</span>
					</div>
					<div className="input">
						<Input type="text"
						   	   id="sub_title"
						   	   value={this.state.sub_title}
						   	   onChange={this.onUpdateState} />
					</div>
					<div className="label">
						<span>New Contents</span>
					</div>
					<div className="input">
						<Input type="textarea"
						   	   id="contents"
						   	   value={this.state.contents}
						   	   onChange={this.onUpdateState} />
					</div>
				</div>
				<div className="buttons">
					<Button color="info"
							disabled={API_STATUS.PREPARING === this.props.api_status}
							children="Memo"
							onClick={this.onMemo} />
				</div>
			</div>
		);
	}


	//######################################
	//## User functions					  ##
	//######################################
	// Update state
	onUpdateState(e)
	{
		this.setState({
			[e.target.id]:e.target.value
		});
	}

	// Save memo
	onMemo()
	{
		let params = {
			memo_id: this.state.memo_id,
			title: this.state.title,
			sub_title: this.state.sub_title,
			contents: this.state.contents
		}

		this.props.putMemoAsChunk(params)
		.then((res) => {
			// Update Memo ID
			if (res.code === API_STATUS.SUCCESS) this.setState({memo_id: res.memo_id});

			// Show Messenger
			this.props.show({
				theme: (res.code === API_STATUS.FAILURE? MESSENGER_THEME.DANGER : MESSENGER_THEME.SUCCESS),
				message: res.message
			});
		});
	}
}


// Default Props & Prop Types
Memorizer.defaultProps = {
	api_status: API_STATUS.INITIALIZATION
}

Memorizer.propTypes = {
	api_status: PropTypes.number
}


// Connect to redux store
let mapStateToProps = (state) => {
	return {
		api_status: state.memorizer.getIn(["meta","api_status"])
	}
}
let mapDispatchToProps = (dispatch) => {
	return {
		putMemoAsChunk: (params) => dispatch(putMemoAsChunk(params)),
		getMemoAsChunk: (params) => dispatch(getMemoAsChunk(params)),
		show: (payload) => dispatch(MESSENGER_SHOW(payload))
	}
}
export default connect(mapStateToProps,mapDispatchToProps)(Memorizer);