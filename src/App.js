import React, { Component } from 'react';
import { NA } from './components/NA';
import './App.css';
import {CacheBuster} from "./CacheBuster"

export default class App extends Component {
	displayName = "PPI Toolkit Direct";
	constructor(props) {
		super(props);
		this.state = { language: "en", loading:true };
		this.langText = "English";
	}

	changeLang = () => {
		var data2 = this.state;
		var oldLang = this.state.language;
		data2.language = this.state.language === "en" ? "fr" : "en";
		this.langText = this.state.language === "en" ? "Fran�ais" : "English";
		this.setState({ data2, loading: false });// () => this.updateDataLang(oldLang));
	}
	
	render() {

		return (
			<div> 
				<NA />
				
			</div>
		);
	  /* return (
      {/* <CacheBuster>
        {({ loading, isLatestVersion, refreshCacheAndReload }) => {
          if (loading) return null;
          if (!loading && !isLatestVersion) {
            // You can decide how and when you want to force reload
            refreshCacheAndReload();
          } 

          return (*/}
		/* 			<NA />
		  	
          );
		 */
     /*     }}
      </CacheBuster>
    ); 
 

	}*/
}
