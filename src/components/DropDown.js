import React, { Component } from "react";
import Select from "react-select";
import { MESSAGES } from "../definitions/generalDefinitions";
import { Info } from "./Info";
import { DROPDOWN_WIDE } from "../definitions/generalDefinitions";

export class DropDown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //	id: this.props.Count,
      //Title: this.props.Title,
      selection: "?",
      valueSelected: this.props.defValue,
    };
    this.update = false;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps !== this.props && nextProps.defValue !== undefined) {
      this.setState({ valueSelected: nextProps.defValue });
    }
  }

  handleChange = (event) => {
    this.setState(
      {
        selection: event.label.valueOf(),
        valueSelected: event.label.valueOf(),
      },
      () => this.afterStateUpdate()
    );
    this.update = true;
  };

  afterStateUpdate() {
    this.props.updateDDown(this.props.id, this.state.selection);
  }

  getDefault() {
    try {
      return this.props.Values[
        this.props.Values.find((x) => x.label === this.props.defValue).value - 1
      ];
    } catch (error) {
      return this.props.defValue;
    }
  }

  disableOption = (option) => {
    let disable =
      this.props.disableOption === undefined
        ? false
        : this.props.disableOption[option.value - 1];
    return disable;
    //(

    //  this.props.disableOption[option.value-1]===true
    /* (this.props.Title === "Member" || this.props.Title === "Membre") &&
      (option.label === "Client" ||
        (this.props.hasSurivor &&
          (option.label === "Spouse" || option.label === "Conjoint"))) */
    //);
  };

  render() {
    let styleDD = "dropDown";
    if (this.props.width === DROPDOWN_WIDE) styleDD = "dropDown dropDown2";
    const title = this.props.Title; // this.state.Title;
    // console.log(this.props.Title)
    const customStyles = {
      control: (base) => ({
        ...base,
        height: 35,
        minHeight: 35,
        backgroundColor: "#e9eef1",
        "&:hover": {
          backgroundColor: "#d6e5ee",
        },
      }),
    };

    const taxCredit =
      this.getDefault() === this.props.unlistedValue ? true : false;
    var charOp = [];
    charOp.push({
      label: this.props.unlistedValue,
      value: 1,
    });

    let selectComponent = (
      <Select
        isSearchable={true}
        onfocus={this.oc}
        styles={customStyles}
        key={this.props.defValue}
        isDisabled={this.props.disable}
        value={this.getDefault()}
        id={this.props.id}
        onChange={this.handleChange}
        options={this.props.Values}
        isOptionDisabled={(option) => this.disableOption(option)}
      />
    );

    if (taxCredit === true)
      selectComponent = (
        <Select
          isSearchable={true}
          styles={customStyles}
          key={this.props.defValue}
          isDisabled={false}
          value={charOp[0]}
          id={this.props.id}
          options={charOp}
        />
      );

    if (this.props.unlistedGreyedOption !== undefined)
      selectComponent = (
        <Select
          isSearchable={true}
          styles={customStyles}
          key={this.props.defValue}
          isDisabled={true}
          value={this.props.unlistedGreyedOption[0]}
          id={this.props.id}
          options={this.props.unlistedGreyedOption}
        />
      );

    // console.log(this.props.infoIcon)
    return (
      <div>
        <div className={styleDD} key={this.props.defValue}>
          <div className="controlTitle">
            {title}
            {/* {checkInfo===true?<Info iconName={gov!==-1 || idM==="infoOther"?"infoRed.png":"info.png"}  id={idM} msg={msg} popupRight={idM==="infoOther"||idM==="infogov"?true:false}/>:''} */}
            {this.props.infoIcon !== undefined ? (
              <Info infoIcon={this.props.infoIcon} zIndex={999} /> //id={this.props.infoIcon.infoID} msg={this.props.infoIcon.infoText}  popupRight={this.props.infoIcon.popupRight}  iconName={this.props.infoIcon.infoAlert? "infoRed.png":"info.png"} />
            ) : (
              ""
            )}
          </div>

          {selectComponent}
          {/* <Select  isSearchable={false} onfocus={this.oc} styles={customStyles} key={this.state.valueSelected} isDisabled={this.props.disable} value={this.getDefault()} id={this.props.id} onChange={this.handleChange} options={this.props.Values} isOptionDisabled={(option)=>this.disableOption(option)} />
					{taxCredit===true&&<Select  isSearchable={false} onfocus={this.oc} styles={customStyles} key={this.state.valueSelected} isDisabled={true} value={charOp[0]} id={this.props.id} onChange={this.handleChange} options={charOp}  />} */}
        </div>
      </div>
    );
  }
}
