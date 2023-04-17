import React from "react";
import { connect } from "react-redux";
import { Table, Card, CardBody } from 'reactstrap';
import { MESSENGER_THEME, API_STATUS } from "meta";
import { getTestResultAsChunk, MESSENGER_SHOW } from "../modules/Reducer";


class TestResult extends React.Component
{
	constructor(props)
	{
		super(props);
	}

	componentDidMount()
	{
		this.props.getTestResultAsChunk()
		.then((response) => {
			if (response.state === API_STATUS.FAILURE) throw {message: response.message};
		})
		.catch((error) => {
			// Show Message
			this.props.show({
				theme: MESSENGER_THEME.DANGER,
				message: error.message
			});
		});
	}

	render()
	{
		return (
			<div className="test-result-wrap">
				<Card>
					<CardBody>
						<Table responsive>
							<thead>
								<tr>
									<th className="center">#</th>
									<th className="center">Type</th>
									<th className="center">Total</th>
									<th className="center">Proceed</th>
									<th className="r center">Right</th>
									<th className="w center">Wrong</th>
									<th className="center">Percent</th>
								</tr>
							</thead>
							<tbody>
							{
								this.props.data.map((item,i) => {
									return (
										<tr key={i}>
											<th scope="row" className="center">{item._test_cnt}</th>
											<td className="center">{item._test_type}</td>
											<td className="right">{item._total_cnt}</td>
											<td className="right">{item._proceed_cnt}</td>
											<td className="right r">{item._right_cnt}</td>
											<td className="right w">{item._wrong_cnt}</td>
											<td className="right">{item._percent}%</td>
										</tr>
									);
								})
							}
							</tbody>
						</Table>
					</CardBody>
				</Card>	
			</div>
		)
	}
}


let mapStateToProps = (state) => {
	return {
		api_state: state.testresult.getIn(["meta","api_state"]),
		data: state.testresult.get("data")
	};
};

let mapDispatchToProps = (dispatch) => {
	return {
		getTestResultAsChunk: () => dispatch(getTestResultAsChunk()),
		show: (payload) => dispatch(MESSENGER_SHOW(payload))
	};
};

export default connect(mapStateToProps,mapDispatchToProps)(TestResult);