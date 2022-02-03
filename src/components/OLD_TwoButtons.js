import React, { Component } from 'react';

export class TwoButtons extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			style1: this.props.buttonActive === 2 ? 'twoButtons' : 'twoButtons twoButtonsAct',
			style2: this.props.buttonActive === 1 ? 'twoButtons' : 'twoButtons twoButtonsAct'
		};
	}


	select1 = () => {
		const s1 = 'twoButtons  twoButtonsAct';
		const s2 = 'twoButtons';
		this.setState({ style1: s1, style2: s2 });
		this.props.selectButton(1);
	}
	select2 = () => {
		const s1 = 'twoButtons  twoButtonsAct';
		const s2 = 'twoButtons';
		this.setState({ style2: s1, style1: s2 });
		this.props.selectButton(2);
	}

	render() {
		return <span><button className={this.state.style1} onClick={this.select1}>{this.props.button1}</button><button className={this.state.style2} onClick={this.select2}>{this.props.button2}</button></span>;
	}
}
