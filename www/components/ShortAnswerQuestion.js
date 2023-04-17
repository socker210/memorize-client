import React from "react";
import { Map } from "immutable";
import { FormGroup, Label, Input } from "reactstrap";


export default class ShortAnswerQuestion extends React.Component
{
	constructor(props)
	{
		super(props);

		// Initialize Local State
		this.state = {
			input: Map({
				answer: ""
			})
		};

		// Bind User Function
		this.onChangeUserAnswer = this.onChangeUserAnswer.bind(this);
	}

	render()
	{
		return (
			<div className="short-answer-question-wrap">
				<FormGroup>
					<Label for="answer">Your Answer is ..</Label>
					<Input type="text"
						   id="answer"
						   value={this.state.input.get("answer")}
						   disabled={this.props.submit}
						   onChange={this.onChangeUserAnswer} />
				</FormGroup>
			</div>
		)
	}

	onChangeUserAnswer(e)
	{
		// Update State
		this.setState({
			input: this.state.input.set(e.target.id,e.target.value)
		});
	}

	refTakeValues()
	{
		return {
			value: this.state.input.get("answer")
		}
	}
}