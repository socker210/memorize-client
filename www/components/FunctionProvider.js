// yarn Modules
import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Container, Button, ButtonGroup } from "reactstrap";

// User Component
import { MEMOLIST_APPEAR_ALL, paging, getMemolistAsChunk } from "../modules/Reducer";
import { API_STATUS, PAGING_TYPE } from "meta";


// FunctionProvider class:
//   Extra function & Indicator provider Component
class FunctionProvider extends React.Component
{
	constructor(props)
	{
		super(props);

		// Bind User Function
		this.onPageIndicatorClickEventHandler = this.onPageIndicatorClickEventHandler.bind(this);
	}

	render()
	{
		return (
			<div className="function-provider-wrap">
				<Button color="success"
					    outline={true}
					    disabled={this.props.api_status === API_STATUS.PREPARING || this.props.api_status === API_STATUS.INITIALIZATION || this.props.api_status === API_STATUS.FAILURE}
					    onClick={this.props.appearDisappearAll}
					    children={this.props.show? "Hide All" : "Show All"} />
				<div className="page-indicator-wrap">
					<ButtonGroup>
						<Button color="info"
							    outline={true}
							    disabled={this.props.api_status === API_STATUS.PREPARING || this.props.api_status === API_STATUS.INITIALIZATION || this.props.api_status === API_STATUS.FAILURE || !this.props.prev}
							    children="Prev"
							    onClick={(e) => this.onPageIndicatorClickEventHandler(e,PAGING_TYPE.PREV)} />
						<Button color="info"
							    outline={true}
							    disabled={this.props.api_status === API_STATUS.PREPARING || this.props.api_status === API_STATUS.INITIALIZATION || this.props.api_status === API_STATUS.FAILURE || !this.props.next}
							    children="Next"
							    onClick={(e) => this.onPageIndicatorClickEventHandler(e,PAGING_TYPE.NEXT)} />
					</ButtonGroup>
				</div>
			</div>
		);
	}


	//###################################
	//## User Function 				   ##
	//###################################
	// Page Indicator 
	onPageIndicatorClickEventHandler(e,type)
	{
		if (e) e.preventDefault();

		// Call Paging Action
		this.props.paging(type)
		.then(() => {
			this.props.getMemolistAsChunk();
		});
	}
}


// Set Prop Types
FunctionProvider.propTypes = {
	show: PropTypes.bool,
	prev: PropTypes.bool,
	next: PropTypes.bool,
	api_status: PropTypes.number,
	appearDisappearAll: PropTypes.func,
	paging: PropTypes.func,
	getMemolistAsChunk: PropTypes.func
};


// Connect to Store
let mapStateToProps = (state) => {
	return {
		show: state.memolist.getIn(["data","show"]),
		prev: state.memolist.getIn(["data","prev"]),
		next: state.memolist.getIn(["data","next"]),
		api_status: state.memolist.getIn(["meta","api_status"])
	};
};
let mapDispatchToProps = (dispatch) => {
	return {
		appearDisappearAll: () => dispatch(MEMOLIST_APPEAR_ALL()),
		paging: (type) => dispatch(paging(type)),
		getMemolistAsChunk: () => dispatch(getMemolistAsChunk())
	};
};
export default connect(mapStateToProps,mapDispatchToProps)(FunctionProvider);