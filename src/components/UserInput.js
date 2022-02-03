import React, { Component } from 'react';
import './info.css';
import { Info } from './Info';

const MESSAGES = {
    en: {
		saveAs1: "To save files in your desired location: ",
		saveAs2: " - Microsoft Edge: select 'SaveAs' when prompted ",
		saveAs3: " - Google Chrome: make a one time change: ",
		saveAs4: "go to Settings - Advanced - Downloads and turn on ",
		saveAs5: "'Ask where to save each file before downloading"
		
    },
    fr: {
		saveAs1: "To save files in your desired location: ^F",
		saveAs2: " - Microsoft Edge: select 'SaveAs' when prompted  ^F",
		saveAs3: " - Google Chrome: make a one time change:  ^F",
		saveAs4: "go to Settings - Advanced - Downloads and turn on  ^F",
		saveAs5: "'Ask where to save each file before downloading  ^F"
		
    }
  };

export class UserInput extends Component {
	constructor(props) {
		super(props);
		this.state = {
			inputValue:''
		};
		this.chkClose=false;	
	}

	componentDidMount() {
	  if(this.props.show){
		 // 	console.log('in mount');
	
			this.popupInfo(0);
			this.chkClose=true;
	  }
	}
	

popupInfo=()=> {
 //   console.log('in popup');
  var popup = document.getElementById(this.props.id);
  popup.classList.toggle("show");
  if(this.props.show && this.chkClose){
	this.props.respondToInput(this.state.inputValue,1);
	
	this.chkClose=false;
  }
}

 updateInputValue=(evt)=> {
    this.setState({
      inputValue: evt.target.value
    });
  }

	
	render() {
		const message=MESSAGES["en"]
		let msgSave=<div style={{textAlign: 'left'}}>{message.saveAs1}<br/>{message.saveAs2}<br/> {message.saveAs3} <br/>{message.saveAs3} <br/>{message.saveAs4}</div>;
					
     	var style1=this.props.popupRight===true?{  marginLeft: '-60px'}:{backgroundColor: '#e9eef1', border: '2px solid #B1CAE6' , color: 'rgb(28, 28, 29)',  width: '270px', textAlign: 'left',  paddingLeft: '12px'};
		return (
				<div className="popup" style={{marginTop: '5px', marginRight: '5px'}} > 
                    <span className="popuptext" style={style1} id={this.props.id}>{this.props.msg}
					<Info style={{float: 'right'}} iconName="info.png" id="headerInfo" msg={msgSave} width='278px' positionTop='20px' height='68px'/>
			
					<span><input style={{width:'210px',margin: '6px', marginLeft: '0px', marginRight: '8px'}} value={this.state.inputValue} onChange={evt => this.updateInputValue(evt)}/>
					
					<button onClick={this.popupInfo}>OK</button></span>
      				</span>
					
                </div>
			);
	}
}
