import React from "react";
import { Badge } from "reactstrap";
import { TEST_TYPE } from "meta";


export default class MetaData extends React.Component
{
	constructor(props)
	{
		super(props);

		// Initialize Statics Value
		this.statics = {
			[TEST_TYPE.MULTIPLE_CHOICE]: "Multiple choice",
			[TEST_TYPE.SHORT_ANSWER_QUESTION]: "Short answer question"
		};
	}

	render()
	{
		return (
			<div className="meta-data">
				<div><small>Test type <Badge pill={true} color="dark">{this.statics[this.props.meta.test_type]}</Badge></small></div>
				<small>Total <Badge pill={true} color="info">{this.props.meta.total_cnt}</Badge></small>
				<small>Proceed <Badge pill={true} color="primary">{this.props.meta.proceed_cnt}</Badge></small>
				<small>Right Count <Badge pill={true} color="success">{this.props.meta.right_cnt}</Badge></small>
				<small>Wrong Count <Badge pill={true} color="danger">{this.props.meta.wrong_cnt}</Badge></small>
			</div>
		)
	}
}