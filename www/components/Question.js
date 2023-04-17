import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { API_STATUS, MESSENGER_THEME, TEST_TYPE } from "meta";
import { fetchTestAsChunk, saveQuestionAsChunk, finishTestAsChunk, stopTestAsChunk, MESSENGER_SHOW, MESSENGER_HIDE } from "../modules/Reducer";
import { Card, CardBody, CardTitle, CardSubtitle, CardText, Button } from "reactstrap";
import ShortAnswerQuestion from "./ShortAnswerQuestion";
import MultipleChoice from "./MultipleChoice";
import MetaData from "./MetaData";


class Question extends React.Component
{
	constructor(props)
	{
		super(props);

		// Initialize Statics Value
		this.statics = {
			answer_text: {
				show: "Show",
				hide: "Hide"
			}
		};

		// Intiialize Local State
		this.state = {
			show_answer: false,
			submit: false,
			right: false,
			finish: false,
			memolist: false
		};

		// Bind User Function
		this.fetchTestFromAPI = this.fetchTestFromAPI.bind(this);
		this.onClickShowHideAnswer = this.onClickShowHideAnswer.bind(this);
		this.onClickSubmitAnswer = this.onClickSubmitAnswer.bind(this);
		this.onClickSaveAndMoveToNextLevel = this.onClickSaveAndMoveToNextLevel.bind(this);
		this.onClickCloseTestAndCheckoutResult = this.onClickCloseTestAndCheckoutResult.bind(this);
		this.onClickStopTestAndGoToMemolist = this.onClickStopTestAndGoToMemolist.bind(this);
	}

	componentDidMount()
	{
		this.fetchTestFromAPI();
	}

	render()
	{
		return (
			<div className="question-wrap">
				{
					this.props.api_state === API_STATUS.SUCCESS?
					<div>
						<MetaData meta={this.props.test.metadata} />
						{
							!this.props.test.metadata.finish?
							<Card>
								<CardBody>
								{
									this.state.show_answer?
									<div className="answer">
										<CardTitle>{this.props.test.answer}</CardTitle>
										<CardSubtitle>{this.props.test.sub_answer}</CardSubtitle>
									</div> :
									''
								}
								<CardText>{this.props.test.contents}</CardText>
								{
									this.props.test.metadata.test_type === TEST_TYPE.MULTIPLE_CHOICE?
									<MultipleChoice ref="answer"
													answer={this.props.test.answer}
													others={this.props.test.multiple_choice}
													submit={this.state.submit} /> :
									<ShortAnswerQuestion ref="answer"
														 submit={this.state.submit} />
								}
								{
									!this.state.submit?
									<div>
										<Button color="primary"
												children="Submit"
												onClick={this.onClickSubmitAnswer} />
										<Button onClick={this.onClickShowHideAnswer}
												className="btn-show-answer"
												children={this.state.show_answer? this.statics.answer_text.hide : this.statics.answer_text.show} />
										<Button color="danger"
												className="btn-show-answer"
												disabled={this.props.api_state_stop === API_STATUS.PREPARING}
												onClick={this.onClickStopTestAndGoToMemolist}
												children="Stop" />
									</div> :
									<Button color="success"
											children="Save result & Go to next level!"
											disabled={this.props.api_state_save === API_STATUS.PREPARING}
											onClick={this.onClickSaveAndMoveToNextLevel} />
								}
								</CardBody>
							</Card> :
							<Card>
								<CardBody>
									<h3>You are finished your test :)</h3>
									<Button color="info"
											children="Close test & Check out test result"
											disabled={this.props.api_state_finish === API_STATUS.PREPARING}
											onClick={this.onClickCloseTestAndCheckoutResult} />
								</CardBody>
							</Card>
						}
					</div> :
		     		''
				}
				{
					this.state.finish?
					<Redirect to="/test_result" /> :
					this.state.memolist?
					<Redirect to="/" /> :
					''
				}
			</div>
		)
	}

	fetchTestFromAPI()
	{
		this.props.fetchTestAsChunk()
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

	onClickShowHideAnswer()
	{
		// Update State
		this.setState({
			show_answer: !this.state.show_answer
		});
	}

	onClickSubmitAnswer()
	{
		let userAnswer = this.refs["answer"].refTakeValues().value;
		let answers = [this.props.test.answer.trim()];

		// Add Sub Answer to answers array
		if (this.props.test.sub_answer.trim().length) 
			this.props.test.sub_answer.trim().split(",").map((item) => {
				answers.push(item.trim());
			});
	
		// Update State & Show Message
		let right = answers.indexOf(userAnswer) !== -1;
		this.setState({
			show_answer: true,
			submit: true,
			right: right
		},() => {
			this.props.show({
				theme: this.state.right? MESSENGER_THEME.SUCCESS : MESSENGER_THEME.DANGER,
				message: this.state.right? "You right! Keep it up :)" : "Wrong answer! Need more practice :("
			});
		});
	}

	onClickSaveAndMoveToNextLevel()
	{
		this.props.saveQuestionAsChunk({
			_right: this.state.right,
			_memo_id: this.props.test.metadata.memo_id
		})
		.then((response) => {
			if (response.state === API_STATUS.FAILURE) throw {message:response.message};

			// Initialize Local State
			this.setState({
				show_answer: false,
				submit: false,
				right: false
			},() => {
				// Hide Message & fetchTest
				this.props.hide();
				this.fetchTestFromAPI();
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

	onClickCloseTestAndCheckoutResult()
	{
		this.props.finishTestAsChunk()
		.then((response) => {
			if (response.state === API_STATUS.FAILURE) throw {message:response.message};

			// Show Messenger
			this.props.show({
				theme: MESSENGER_THEME.SUCCESS,
				message: "Check out your result!"
			});

			// Redirect URL
			this.setState({
				finish: true
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

	onClickStopTestAndGoToMemolist()
	{
		this.props.stopTestAsChunk()
		.then((response) => {
			if (response.state === API_STATUS.FAILURE) throw {message:response.message};

			// Show Messenger
			this.props.show({
				theme: MESSENGER_THEME.INFO,
				message: "You stoped test :("
			});

			// Redirect URL
			this.setState({
				memolist: true
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
		api_state: state.question.getIn(["meta","api_state"]),
		api_state_save: state.question.getIn(["meta","api_state_save"]),
		api_state_finish: state.question.getIn(["meta","api_state_finish"]),
		api_state_stop: state.question.getIn(["meta","api_state_stop"]),
		test: state.question.get("test")
	}
};

let mapDispatchToProps = (dispatch) => {
	return {
		fetchTestAsChunk: () => dispatch(fetchTestAsChunk()),
		saveQuestionAsChunk: (params) => dispatch(saveQuestionAsChunk(params)),
		finishTestAsChunk: () => dispatch(finishTestAsChunk()),
		stopTestAsChunk: () => dispatch(stopTestAsChunk()),
		show: (payload) => dispatch(MESSENGER_SHOW(payload)),
		hide: () => dispatch(MESSENGER_HIDE())
	};
};

export default connect(mapStateToProps,mapDispatchToProps)(Question);