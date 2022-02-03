import React, { Component } from 'react';
import { Navbar} from 'react-bootstrap';
import { TITLES} from '../definitions/generalDefinitions';

export class TopNav extends Component {
	constructor(props) {
		super(props);
	}
	
	
	render() {
			return (
				<div style={{ width: '100%', float: 'left', backgroundColor: this.props.themeColor }}>
					<Navbar fixedTop fluid collapseOnSelect style={{ backgroundColor: 'white', marginTop: '0px', marginBottom: '35px', height: '65px' }}>
						<Navbar.Header style={{ marginTop: '0px', height: '0px', paddingTop: '0px' }}>
							<Navbar.Brand style={{ color: '#455560', marginTop: '0px', height: '42px', paddingTop: '0px', paddingLeft: '25px' }}>
								<span><h4>{TITLES[this.props.language].applet}</h4></span> <br />
							</Navbar.Brand>
						
						</Navbar.Header>
							<div>
								<span style={{ marginRight: '14px', float: 'right' }}>
									<input className="language" style={{ marginTop: '2px' }} onClick={this.props.changeLang} type="button" value={this.props.language === "en" ? "Français" : "English"} />
									<input className="titleButtons" onClick={this.props.saveToFile} type="button" value="Save" />
									<label className="titleButtons">
										<input type="file" required style={{ display: 'none' }} onChange={this.props.loadFromFile} onClick={(event) => { event.target.value = null }} />
										<span className="titleLoad">Load</span>
									</label>
								</span>
							</div>

					</Navbar>
				</div>
			);
		}
	}
