import React from "react";
import { FormGroup, Label, Input } from "reactstrap";


export default class MultipleChoice extends React.Component
{
	constructor(props)
	{
		super(props);

		const { answers, checked } = this.suffling(this.props)

		// Initialize Local State
		this.state = {
			answer: this.props.answer,
			answers: answers,
			checked: checked
		};

		// Bind User Function
		this.onChangeUserAnswer = this.onChangeUserAnswer.bind(this);
		this.refTakeValues = this.refTakeValues.bind(this);
	}

	componentWillReceiveProps(props)
	{
		if (props.answer === this.state.answer) return;

		const { answers, checked } = this.suffling(props)

		this.setState({
			answer: props.answer,
			answers,
			checked
		})
	}

	render()
	{
		return (
			<div className="multiple-choice-wrap">
				<FormGroup>
					{
						this.state.answers.map((item,i) => {
							return (
								<FormGroup check key={i}>
									<Label check>
										<Input type="radio"
											   checked={this.state.checked === item}
											   disabled={this.props.submit}
											   value={item} 
											   onChange={this.onChangeUserAnswer} />{item}
									</Label>
								</FormGroup>
							)		
						})
					}
				</FormGroup>
			</div>
		)
	}

	suffling(props)
	{
		// Suffling
		let answers = [props.answer,props.others.other_answer1,props.others.other_answer2,props.others.other_answer3];
		let randomIdx = 0;
		let targetIdx = 0;
		let tmp = "";

		for (let i=0; i<30; i++)
		{
			randomIdx = Math.floor(Math.random() * answers.length);
			if (i % 2 == 0)	targetIdx = randomIdx;
			else
			{
				tmp = answers[randomIdx];
				answers[randomIdx] = answers[targetIdx];
				answers[targetIdx] = tmp;
			}
		}

		return {
			answers,
			checked: answers[0]
		}
	}

	onChangeUserAnswer(e)
	{
		// Update State
		this.setState({
			checked: e.target.value
		});
	}

	refTakeValues()
	{
		return {
			value: this.state.checked
		}
	}
}