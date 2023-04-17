// Yarn Packages
import React from "react";
import PropTypes from "prop-types";
import { List } from "immutable";
import { connect } from "react-redux";
import { Row, Col } from "reactstrap";

// User Components
import MemoItem from "./MemoItem";
import FunctionProvider from "./FunctionProvider";
import { getMemolistAsChunk, MESSENGER_SHOW } from "../modules/Reducer";
import { API_STATUS, MESSENGER_THEME } from "meta";


// MemorizeViewer class:
//   Memo Viewer
// Props:
//  memolist(store value): MemoList what you should memorize
class MemorizeViewer extends React.Component
{
	constructor(props)
	{
		super(props);
	}

	componentDidMount()
	{
		// Execute Actions
		this.props.getMemolistAsChunk()
		.then((res) => {
			if (res.code === API_STATUS.FAILURE) 
				this.props.show({
					message: res.message,
					theme: MESSENGER_THEME.DANGER
				});
		});
	}

	render()
	{
		return (
			<div className="memorize">
				<FunctionProvider />
				{
					this.props.memolist.map((item,i) => {
						// Rendering Memoitem
						return (
							<MemoItem key={i}
									  idx={i}
									  memoId={item.memo_id}
								   	  title={item.title}
						  		  	  subTitle={item.sub_title}
						  		  	  contents={item.contents}
						  		  	  appear={item.appear} />
						);
					})
				}
			</div>
		);
	}
}

// Defaut value & prop types
MemorizeViewer.defaultProps = {
	memolist: List([]),
	api_status: API_STATUS.INITIALIZATION
}

MemorizeViewer.propTypes = {
	memolist: PropTypes.instanceOf(List),
	api_status: PropTypes.number
}


// Connect to Store
let mapStateToProps = (state) => {
	return {
		memolist: state.memolist.getIn(["data","memolist"]),
		api_status: state.memolist.getIn(["meta","api_status"])
	}
}
let mapDispatchToProps = (dispatch) => {
	return {
		getMemolistAsChunk: () => dispatch(getMemolistAsChunk()),
		show: (payload) => dispatch(MESSENGER_SHOW(payload))
	}
}
export default connect(mapStateToProps,mapDispatchToProps)(MemorizeViewer);