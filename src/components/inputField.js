import React, { Component } from "react";
import { cleanFormat } from "../utils/helper";
import { Info } from "./Info";

export class InputField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: this.toFormat(this.props.inputValue),
      isEditing: false,
    };
    
    /* this.infoIcon= this.props.infoIcon === undefined? 
		{
			msg: "",
			iconAlert: false,
      checkInfo: false,
      popupRight:false,
			idM: 0
		} : {
			msg: this.props.infoIcon.infoText,
			iconAlert: this.props.infoIcon.infoAlert,
      checkInfo: this.props.infoIcon.showInfoIcon,
      popupRight: this.props.infoIcon.popupRight,
			idM: this.props.infoIcon.infoID
		} */
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.inputValue !== this.props.inputValue) {
      this.setState({ inputValue: this.toFormat(nextProps.inputValue) });
    }
  }

  updateInputValue(evt) {
    //  const input = this.getInut(evt);
    this.setState({ inputValue: evt.target.value }); // input });
  }

  getInut = (evt) => {
    var input;
    let chkNum;
    const value = evt.target.value;
    
    /* if (
      this.props.language === "fr" &&
      this.props.format === 3 
    )
      chkNum = cleanFormat(value, true, lang);
    else */ 
    chkNum = cleanFormat(value, this.props.language);

    if (
      (isNaN(chkNum.replace(",", ".")) || value === "") &&
      !(
        value.toString()[value.toString().length - 1] === "." ||
        value.toString()[value.toString().length - 1] === ","
      )
    )
      input = value.substring(0, value.length - 1);
    else input = chkNum;

    const max =
      this.props.format === 2
        ? this.props.maxValue === undefined
          ? 1000000000
          : this.props.maxValue
        : this.props.maxValue === undefined
        ? 100
        : this.props.maxValue;

    if (input > max) input = max;
    const min = this.props.minValue === undefined ? 0 : this.props.minValue;

    if (input < min) input = min;
  
    return input;
  };

  afterStateUpdate() {
    //this.props.handleUpdateInput(this.props.inputName, this.state.inputValue);
    this.props.handleUpdateInput(this.props.id, this.state.inputValue);
  }

  handleFocus = (event) => {
    if (navigator.userAgent.match(/Edge\/(13|14|15|16|17)/)) {
      //	return setTimeout( event.target.select.bind( event.target ), 1)
    } else event.target.select();
  };

  selectField = (event) => {
    if (navigator.userAgent.match(/Edge\/(13|14|15|16|17)/)) {
      event.target.setSelectionRange(0, event.target.value.length);
    }
  };
  onMouseUpSelect = (event) => {
    if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
      event.target.select();
    }
  };

  handleFocusIOS = (event) => {
    event.target.value = cleanFormat(event.target.value, this.props.language);
  };

  toFormat(number) {
    let formatter;
    const lang = this.props.language;
    /* if ((lang === "fr" || global.langFr) && this.props.format === 3)
      number = cleanFormat(number, true); 
    else */
    number = cleanFormat(number, lang);

    if (isNaN(number) || number === "") number = 0;
    if (this.props.format === 2) {
      formatter =
        (lang === "fr" ? "" : "$") +
        new Intl.NumberFormat(lang).format(parseInt(number));
    } else if (this.props.format === 3) {
      if (lang === "fr") {
        formatter =
          number.toString()[number.toString().length - 1] === "."
            ? parseFloat(number) + ","
            : parseFloat(number);
        formatter = formatter.toString().replace(".", ",");
      } else
        formatter =
          number.toString()[number.toString().length - 1] === "."
            ? parseFloat(number) + "."
            : parseFloat(number);
    } else formatter = parseInt(number);
    return formatter;
  }

  toggleEditing = (e) => {
    /* e.target.value=this.toFormat(e.target.value);		
				if(this.props.format === 3)e.target.value+="%"; */
    let input = this.getInut(e);
    input = this.toFormat(input);
    this.setState({ inputValue: input, isEditing: !this.state.isEditing }, () =>
      this.afterStateUpdate()
    );
    //	this.props.handleUpdateInput(this.props.id, this.state.inputValue);
  };

  getValue = (value) => {
    const dec = value.toString().indexOf(".");
    const first = value.toString()[0];

    if (first === 0 && dec === -1)
      return (
        parseFloat(100 * value.toString().slice(1, value.toString().length)) /
        100
      );
    else return parseFloat(100 * value) / 100;
  };

  selectText = () => {
    var s = this.refs.InputTxt.value;
    if (s.length) {
      window.setTimeout(function () {
        this.refs.InputTxt.setSelectionRange(s.length - 1, s.length);
      }, 0);
    }
  };

  getRidOfZerosAfterDecimal = (displayValue) => {
    const decimalPos = displayValue.indexOf(".");
    if (decimalPos >= 0) {
      if (displayValue.length >= decimalPos + 3)
        // 2 decimals max
        displayValue = displayValue.substring(0, decimalPos + 3);
      // get rid of zeros
      while (
        displayValue.slice(-1) === "0" &&
        displayValue.length > decimalPos + 3
      ) {
        displayValue = displayValue.substring(0, displayValue.length - 1);
      }
    }

    return displayValue;
  };

  render() {
    let displayValue =
      this.state.inputValue !== undefined
        ? this.state.inputValue.toString()
        : "";
    if (displayValue.indexOf(".") >= 0)
      displayValue = this.getRidOfZerosAfterDecimal(displayValue);
    //  displayValue=parseFloat(displayValue).toFixed(2);

    const title = this.props.inputName; //  this.props.Count === 1 ? this.state.inputName : this.state.inputName;
    const disable = this.props.readOnly ? true : false;
    let styleClass = disable ? "inputField inputFieldDisabled" : "inputField";
    styleClass += this.props.language === "fr" ? " inputFieldFrench" : "";
    const styleClass2 =
      styleClass +
      (this.props.format === 3 ||
      (this.props.format === 2 && this.props.language === "fr")
        ? " percentField"
        : "");

    let divStyleClass = "dropDown inputDiv";
    divStyleClass += this.props.language === "fr" ? " inputDivFrench" : "";

    let inputColorStyle =
      this.props.colorDiv === undefined
        ? {}
        : { border: "1px solid " + this.props.colorDiv };

    //iOS=false;
    var iOS2 = false;

    if (
      this.props.info !== undefined &&
      (this.props.showInfo === true || this.props.showInfo === undefined)
    ) {
    }
    //	let st1=this.props.format===3?"styleClass st1percentField":"";
    let perc = this.props.format === 3;
    const style = (this.props.titleColour===undefined || this.props.titleColour==="")?{}:{color:this.props.titleColour}

    if (this.props.language === "fr" && this.props.format === 2) {
      return (
        <div
          className={divStyleClass}
          french={this.props.language === "en" ? "true" : "false"}
        >
          <div className="controlTitle" style={style}>
            {title}
            {/*  {checkInfo === true ? (
              <Info id={idM} msg={msg} infoPosition={this.props.infoPosition} />
            ) : (
              ""
            )} */}
            {this.props.infoIcon !== undefined ? (
              <Info infoIcon={this.props.infoIcon} /> //id={this.props.infoIcon.infoID} msg={this.props.infoIcon.infoText}  popupRight={this.props.infoIcon.popupRight}  iconName={this.props.infoIcon.infoAlert? "infoRed.png":"info.png"} />
            ) : (
              ""
            )}
          </div>
          {/*{iOS ? <input type="number" inputmode="numeric" pattern="\d*"  min="0" max={max} step={step} className={styleClass} isDisabled={disable} onFocus={this.handleFocus} onClick={this.select} value={this.getValue(displayValue)} onChange={evt => this.updateInputValue(evt)} onBlur={this.toggleEditing.bind(this)} />*/}
          {iOS2 ? (
            "" //<input type="text" inputmode="decimal" min="0.0" max={max} step={step} className={styleClass} isDisabled={disable} onFocus={this.handleFocus} onClick={this.select} value={displayValue} onChange={evt => this.updateInputValue(evt)}  />
          ) : (
            <div className={styleClass}>
              <span>
                <input
                  type="text"
                  className={styleClass2}
                  style={{ paddingTop: "0px", width: "86%" }}
                  inputMode="decimal"
                  disabled={disable}
                  value={displayValue}
                  autoFocus
                  onFocus={(e) => this.handleFocus(e)}
                  onMouseUp={this.onMouseUpSelect}
                  onClick={this.selectField}
                  onChange={(evt) => this.updateInputValue(evt)}
                  onBlur={this.toggleEditing.bind(this)}
                />
                <label
                  style={{
                    display: "inline-block",
                    float: "left",
                    width: "3%",
                  }}
                >
                  $
                </label>
              </span>
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div
          className={divStyleClass}
          french={this.props.language === "en" ? "true" : "false"}
        >
         <div className="controlTitle" style={style}>
            {title}
            {/*  {checkInfo === true && (
              <Info id={idM} msg={msg} infoPosition={this.props.infoPosition}/>
            )} */}
            {this.props.infoIcon !== undefined ? (
              <Info infoIcon={this.props.infoIcon} /> // id={this.props.infoIcon.infoID} msg={this.props.infoIcon.infoText} popupRight={this.props.infoIcon.popupRight} iconName={this.props.infoIcon.infoAlert? "infoRed.png":"info.png"} />
            ) : (
              ""
            )}
          </div>
          {/*{iOS ? <input type="number" inputmode="numeric" pattern="\d*"  min="0" max={max} step={step} className={styleClass} isDisabled={disable} onFocus={this.handleFocus} onClick={this.select} value={this.getValue(displayValue)} onChange={evt => this.updateInputValue(evt)} onBlur={this.toggleEditing.bind(this)} />*/}
          {iOS2 ? (
            "" //<input type="text" inputmode="decimal" min="0.0" max={max} step={step} className={styleClass} isDisabled={disable} onFocus={this.handleFocus} onClick={this.select} value={displayValue} onChange={evt => this.updateInputValue(evt)}  />
          ) : (
            <div>
              {perc === false ? (
                <div>
                  <input
                    style={inputColorStyle}
                    type="text"
                    key="if"
                    className={styleClass}
                    inputMode="decimal"
                    disabled={disable}
                    value={displayValue}
                    onFocus={(e) => this.handleFocus(e)}
                    onClick={this.selectField}
                    onMouseUp={this.onMouseUpSelect}
                    onChange={(evt) => this.updateInputValue(evt)}
                    onBlur={this.toggleEditing.bind(this)}
                  />
                </div>
              ) : (
                <div className={styleClass}>
                  {/* <div className="percentDiv"> */}
                  <span>
                    <input
                      type="text"
                      key="if1"
                      className={styleClass2}
                      style={{ paddingTop: "0px", width: "86%" }}
                      inputMode="decimal"
                      disabled={disable}
                      value={displayValue}
                      onFocus={(e) => this.handleFocus(e)}
                      onMouseUp={this.onMouseUpSelect}
                      onClick={this.selectField}
                      onChange={(evt) => this.updateInputValue(evt)}
                      onBlur={this.toggleEditing.bind(this)}
                    />
                    <label
                      style={{
                        display: "inline-block",
                        float: "left",
                        width: "3%",
                      }}
                    >
                      %
                    </label>
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      );
    }
  }
}
