import {
  TITLES,
  APPLET_INA,
  DEFAULT_QUOTE,
} from "../definitions/generalDefinitions";
import React, { Component } from "react";
import { Info } from "./Info";
import { getInfoRecover  } from "../definitions/infoIconsDefinitions";

//import {convertToINA} from '../utils/helper'
import { versionDetails, isVersion2019, isMobileDevice } from "../utils/helper";
import { version } from "../../package.json";

export function hideRecover() {
  document.getElementById("last").style.display = "none";
  document.getElementById("defaultIcon").style.display = "none";
  
}

export class Header extends Component {
  constructor(props) {
    super(props);
    this.last = React.createRef();
    this.default = React.createRef();
    //    this.defaultButton=this.defaultCommand(this.props.language);
    const language = this.props.language;
    const storageName = DEFAULT_QUOTE;
    const set = TITLES[language].default;
    const clear = TITLES[language].defaultClear;
    this.defaultButton =
      localStorage.getItem(storageName) === null ? set : clear;
  }

/*   hideRecover = () => {
    const ref = this.last.current;
    //const last = document.getElementById("last");
    if (ref !== undefined) ref.style.display = "none";
   
  }; */

  saveDefault = () => {
    //const def = document.getElementById("default");

    const ref = this.default.current;
    const val = ref.value;
    //console.log(ref)
    if (ref !== undefined) {
      if (ref.value === TITLES[this.props.language].default) {
        this.props.saveAsDefaultCase(false);

        //  ref.style.backgroundColor = "lightgrey";
        // ref.style.color = "white";
        ref.value = TITLES[this.props.language].defaultClear;
        //  setTimeout(() => {
        //    ref.style.backgroundColor = "white";
        //ref.style.color = "#455560";
        // ref.value = val;
        //  }, 1000);
      } else {
        this.props.saveAsDefaultCase(true);

        ref.value = TITLES[this.props.language].default;
      }
    }
  };

  defaultCommand = (language) => {
    const storageName = DEFAULT_QUOTE;
    const set = TITLES[language].default;
    const clear = TITLES[language].defaultClear;
    return localStorage.getItem(storageName) === null ? set : clear;
  };

  changeLanguage = () => {
    this.defaultButton = this.defaultCommand(
      this.props.language === "en" ? "en" : "fr"
    );
    //this.props.changeLang()
  };

  render() {
    const vd = versionDetails();
    const emailAllowed = vd.allowEmail;
    let style1 =
      this.props.language === "en" ? { right: "45px" } : { right: "55px" };
    let style2 =
      this.props.language === "en" ? { right: "90px" } : { right: "152px" };
    let style3 =
      this.props.language === "en"
        ? { right: emailAllowed ? "145px" : "97px" }
        : { right: emailAllowed ? "210px" : "158px" };
    let style4 =
      this.props.language === "en"
        ? { right: emailAllowed ? "255px" : "197px" }
        : { right: emailAllowed ? "320px" : "256px" };
    //if(isVersion2019())
    //	style3= this.props.language==="en" ? {right: '90px'}:  {right: '152px'};
    var iOS = isMobileDevice(); // /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const class1 = iOS === true ? "headerBarIOS" : "headerBar";
    const styleTitle =
      iOS === true
        ? { color: "#282e31", marginBottom: "8px", marginTop: "-10px" }
        : { color: "#282e31", marginBottom: "8px" };
    const styleVersion =
      iOS === true
        ? { fontSize: "10px" }
        : { display: "inline-block", fontSize: "10px", paddingLeft: "4px" };
    
      const lang=this.props.language;
        
    return (
      <div className={class1}>
        <input
          className="language"
          style={{ marginTop: "0px", right: "0px" }}
          onClick={
            (this.changeLanguage(), this.props.changeLang)
          } /* this.changeLanguage()} */
          type="button"
          value={lang === "en" ? "Français" : "English"}
        />
        <span>
          <div style={{ maxWidth: "80%" }}>
            <div style={{ display: "inline-block" }}>
              <h2 className="headerTitle" /* style={styleTitle} */>
                {this.props.title}
              </h2>
            </div>
            <div style={styleVersion}>({version})</div>
          </div>
        </span>
        <span className="topCommandLine">
          <input
            className="titleButtons"
            onClick={this.props.saveToFile}
            // style={style1}
            id = "saveButton"
            type="button"
            value={lang === "en" ? "Save" : "Enregistrer"}
          />
          <label className="titleButtons" style={{ right: "0px" }}>
            <input
              type="file"
              required
              style={{ display: "none" }}
              accept=".ppi_INA_TKD, .ppi_EP_TKD, .json"
              onChange={this.props.loadFromFile}
              onClick={(event) => {
                event.target.value = null;
              }}
            />
            <span className="titleLoad">
              {lang === "en" ? "Load" : "Ouvrir"}
            </span>
          </label>
          {emailAllowed && (
            <input
              className="titleButtons"
              //  style={style2}
              onClick={this.props.EmailINA}
              type="button"
              value={lang === "en" ? "e-mail" : "e-mail"}
              id="email"
            />
          )}
          <input
            className="titleButtons"
            //  style={style3}
            onClick={(event) => {
              this.saveDefault();
            }}
            type="button"
            ref={this.default}
            value={this.defaultButton}
            id="default"
          />
          <span 
          ref={this.last}
          id="last">
          <input
            className="titleButtons"
            //  style={style4}
            onClick={(event) => {
              this.props.loadStorage();
              hideRecover();
            }}
            type="button"
            
            value={lang === "en" ? "Recover   " : "Récupérer   "}
            
          />
           </span>
          {/*<input className="titleButtons" onClick={this.EmailINA} style={{right: '130px'}} type="button" value={this.props.language=== "en"?"Email":"Email"} />*/}
          <span  
             id="defaultIcon"
              className={lang === "en" ? "headerIcon":"headerIconFr"}><Info  infoIcon={getInfoRecover(this.props.language)} /></span>
          
        </span>
        
      </div>
    );
  }
}
