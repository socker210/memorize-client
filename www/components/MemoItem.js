// Yarn Modules
import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Card, CardBody, CardTitle, CardText, Button } from "reactstrap";
import { Link } from "react-router-dom";

// User Components
import { API_STATUS, MESSENGER_THEME } from "meta";
import { updateMemolistAsChunk, deleteMemoAsChunk, MESSENGER_SHOW, MEMOLIST_APPEAR } from "../modules/Reducer";


// MemoItem class:
//   Memo Item 
class MemoItem extends React.Component
{
	constructor(props)
	{
		super(props);

		// Bind User Functions
		this.onDeleteMemoClickEventHandler = this.onDeleteMemoClickEventHandler.bind(this);
		this.onAppearDisappearTitlesClickEventHandler = this.onAppearDisappearTitlesClickEventHandler.bind(this);
	}

	render()
	{
		return (
			<Card className="memoitem">
				<CardBody>
					<div className="buttons">
						<Button color="link"
						    	className="button appear"
						    	onClick={this.onAppearDisappearTitlesClickEventHandler}
						    	children={this.props.appear? "Hide" : "Show"} />
						<Link to={`/new/${this.props.memoId}`}
							  className="button edit"
							  children="Edit" />
						<Button color="link"
						    	className="button delete"
						    	onClick={this.onDeleteMemoClickEventHandler}
						    	children="Delete" />
					</div>
					<CardTitle children={this.props.appear? this.props.title : ""} />
					<CardText>
						<small className="text-muted">{this.props.appear? this.props.subTitle : ""}</small>
					</CardText>
					<CardText children={this.props.contents} />
				</CardBody>
			</Card>
		);
	}


	//###############################
	//## User Functions			   ##
	//###############################
	// Delete Memo
	onDeleteMemoClickEventHandler()
	{
		// Call API
		this.props.deleteMemoAsChunk({
			_memo_id: this.props.memoId,
			_start_row: this.props.start_row,
			_offset: this.props.offset
		})
		.then((response) => {
			this.props.show({
				theme:  (response.code === API_STATUS.SUCCESS? MESSENGER_THEME.SUCCESS : MESSENGER_THEME.DANGER),
				message: response.message
			});
			// Update Memolist
			this.props.updateMemolistAsChunk(response.data);
		})
		.catch((error) => {
			this.props.show({
				theme: MESSENGER_THEME.DANGER,
				message: response.message
			});
		});
	}

	// Appear & Disappear title & subtitle
	onAppearDisappearTitlesClickEventHandler(e)
	{
		if (e) e.preventDefault();

		// Dispatch Appear or Disappear
		let params = {
			idx: this.props.idx
		};
		this.props.appearDisappear(params);
	}
}


// Set Default Props & Prop Types
MemoItem.defaultProps = {
	api_status: API_STATUS.INITIALAZTION
}

MemoItem.propTypes = {
	api_status: PropTypes.number,
	start_row: PropTypes.number,
	offset: PropTypes.number
}


// Connect to Store
let mapStateToProps = (state) => {
	return {
		api_status: state.memoitem.getIn(["meta","api_status"]),
		start_row: state.memolist.getIn(["data","start_row"]),
		offset: state.memolist.getIn(["data","offset"])
	}
}
let mapDispatchToProps = (dispatch) => {
	return {
		show: (params) => dispatch(MESSENGER_SHOW(params)),
		updateMemolistAsChunk: (memolist) => dispatch(updateMemolistAsChunk(memolist)),
		deleteMemoAsChunk: (params)	=> dispatch(deleteMemoAsChunk(params)),
		appearDisappear: (params) => dispatch(MEMOLIST_APPEAR(params))
	}
}
export default connect(mapStateToProps,mapDispatchToProps)(MemoItem);