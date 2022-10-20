import React, { Component } from "react";
import "./info.css";
import {
  SHOW_AUTOMATIC_RED,
  SHOW_STANDARD,
  SHOW_STANDARD_RED,
  SHOW_STANDARD_LIGHT_BLUE,
  SHOW_NONE,
  SHOW_STANDARD_WHITE,
} from "../definitions/infoIconsDefinitions.js";
import { PopupInfoDialog } from "./PopupInfo";

export class Info extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: this.props.infoIcon.popupOpenByProps,
    };
    this.chkClose = false;
  }

  componentDidMount() {
    if (this.props.iconMode === SHOW_AUTOMATIC_RED) {
      //	  console.log('in info');

      this.popupInfo(0);
      this.chkClose = true;
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ open: this.props.infoIcon.popupOpenByProps });
  }

  showPopup = () => {
    this.setState({ open: !this.state.open });
    if (this.props.respondToPopUp !== undefined) this.props.respondToPopUp();
  };

  popupInfo = () => {
    var popup = document.getElementById(this.props.infoIcon.infoID);
    popup.classList.toggle("show");
    //	if (this.props.infoIcon.iconMode === SHOW_AUTOMATIC_RED && this.chkClose === true) {
    this.props.respondToPopUp();
    this.chkClose = false;
    //	}
  };

  render() {
    const position = this.props.infoIcon.position;
    // console.log(position)

    //var icon=this.props.icon===undefined?'../images/info.png':this.props.icon;

    //var style1=this.props.popupRightMiddle? {paddingLeft:"14px", marginLeft: '75px',marginTop: '-135px', width:'196px' }:(this.props.popupRight===true?{marginLeft: '50px'}:{});

    var stylePosition =
      position !== undefined
        ? {
            marginLeft: position.marginLeft + "px",
            marginTop: position.marginTop + "px",
            width: position.width + "px",
          }
        : {};
    //var style={paddingLeft: this.props.popupRightMiddle?'25px':'8px', height: this.props.sizeIcon===undefined?'14px':this.props.sizeIcon, };
    const style = { paddingLeft: "8px", height: "14px" };
    //var sour=this.props.iconName===undefined || this.props.iconName==='info.png'?require('../images/info.png'):require('../images/'+this.props.iconName);
    const source =
      this.props.infoIcon.iconMode === SHOW_STANDARD
        ? require("../images/info.png")
        : this.props.infoIcon.iconMode === SHOW_NONE
        ? ""
        : this.props.infoIcon.iconMode === SHOW_STANDARD_LIGHT_BLUE
        ? require("../images/infoLightBlue.png")
        : this.props.infoIcon.iconMode === SHOW_STANDARD_WHITE
        ? require("../images/infoWhite.png")
        : require("../images/infoRed.png");

    const classP = this.state.open === true ? "popup2" : "popup";

    //const width=this.props.infoIcon.infoText.length>120?'600%': (this.props.infoIcon.infoText.length>90?'420%':'350%');

    const marginLeft = position.marginLeft; //this.props.infoIcon.infoText.length>120?'-275%':'-125%';
    const marginTop = position.marginTop;
    const width = position.width;
    const height = position.height;

    const zIndx = this.props.zIndex === undefined ? 1 : this.props.zIndex;

    let borderColor;

    return (
      <div
        className={classP}
        style={{ float: "right", width: "40px", height: "40px" }}
      >
        <div>
          {this.props.iconMode !== SHOW_AUTOMATIC_RED &&
            this.props.infoIcon.iconMode !== SHOW_NONE && (
              <img
                onMouseEnter={this.showPopup}
                onMouseLeave={this.showPopup}
                onClick={this.showPopup}
                id={"info"}
                alt="info"
                src={source}
                style={style}
              />
            )}
          {/* <div className="popup"  onMouseEnter={this.popupInfo} onMouseLeave={this.popupInfo}   onClick={this.popupInfo}>{this.props.showMode!==SHOW_AUTOMATIC_RED && <img  id={"info"} alt="info" src={source} style={style} />} */}
          {/* <span className="popuptextBottom"   style={stylePosition} id={this.props.infoIcon.infoID}>{this.props.infoIcon.infoText}</span> */}
        </div>
        <div
          style={{
            position: "absolute",
            marginTop: "2px",
            marginTop: marginTop,
            marginLeft: marginLeft,
            width: width,
            zIndex: zIndx,
          }}
        >
          {" "}
          <span
            onMouseEnter={this.showPopup}
            onMouseLeave={this.showPopup}
            onClick={this.showPopup}
          >
            {this.state.open === true && (
              <PopupInfoDialog infoIcon={this.props.infoIcon} />
            )}
          </span>
        </div>
      </div>
    );
  }
}
