import React, { Component } from "react";
import { DropDown } from "./DropDown";
//import { InputField4 } from './inputField4';
import { InputField } from "./inputField";
import { cleanFormat, getListItemKeyFromName } from "../utils/helper";
import { CONTROLTITLE, PROVINCE } from "../definitions/generalDefinitions";
import { DROPDOWN_WIDE } from "../definitions/generalDefinitions";
import { getListItemNameFromKey, getListToShowByOrder } from "../utils/helper";
import { getInfoIconNotes } from "../definitions/infoIconsDefinitions";
import { Info } from "./Info";

export class Presentation extends Component {
  displayName = Presentation.name;

  constructor(props) {
    super(props);
    /*     this.state = {
      image: this.props.presentationCurr.adviserLogo
    };
 */

    let i;
    /* let typeValues = [];
    for (i = 0; i <= 9; ++i) {
      typeValues.push({
        label: PROVINCE[this.props.language].Values[i],
        value: i + 1
      });
    } */

    let typeValues = [];
    const listProvincesToShow = getListToShowByOrder(PROVINCE);
    // console.log(listProvincesToShow)
    for (i = 0; i < listProvincesToShow.length; ++i) {
      typeValues.push({
        label: listProvincesToShow[i].value[this.props.language],
        value: i + 1,
      });
    }

    this.state = {
      designedFor: "",
      designedBy: "",
      notes: "",
      showSaved:false
    };
    
    this.dataValues = {
      DD: [
        {
          id: 1,
          Title: CONTROLTITLE[this.props.language].province,
          defValue: getListItemNameFromKey(
            PROVINCE,
            this.props.presentationCurr.provinceKey,
            this.props.language
          ),
          Values: typeValues,
        },
      ],
    };
  }
  // unsafe use getDerivedStateFromProps TBD

  componentDidMount = () => {
    this.setState({
      designedFor: this.props.presentationCurr.designedFor,
      designedBy: this.props.presentationCurr.designedBy,
      notes: this.props.presentationCurr.notes,
    });
  };
  componentWillReceiveProps(nextProps) {
    if (nextProps.presentationCurr !== this.props.presentationCurr) {
      this.dataValues.DD[0].defValue = getListItemNameFromKey(
        PROVINCE,
        nextProps.presentationCurr.provinceKey,
        this.props.language
      );
      //		this.dataValues.DD[0].Title = CONTROLTITLE[this.props.language].province;
     }
  }

  /* static getDerivedStateFromProps(nextProps, prevState){
    
    if(nextProps.presentationCurr!==prevState.presentationCurr){
      return {presentationCurr : nextProps.presentationCurr};
    }
    else return null;
  }

 */

  getNewPresentation = () => {
    return {
      id: this.props.id,
      provinceKey: this.props.presentationCurr.provinceKey,
      invRate: this.props.presentationCurr.invRate,
      inflation: this.props.presentationCurr.inflation,
      taxRate: this.props.presentationCurr.taxRate,
      designedFor: this.props.presentationCurr.designedFor,
      designedBy: this.props.presentationCurr.designedBy,
      notes: this.props.presentationCurr.notes,
      periodOption: this.props.presentationCurr.periodOption,
      language: this.props.presentationCurr.language,
      resultsOption: this.props.presentationCurr.resultsOption,
      adviserLogo: this.props.presentationCurr.adviserLogo,
      appletImage: this.props.presentationCurr.appletImage,
    };
  };

  updateDDown = (id, selection) => {
    let pres = this.getNewPresentation();
    if (id === 1)
      pres.provinceKey = getListItemKeyFromName(PROVINCE, selection);
    this.props.handleUpdate(pres);
  };

  handleUpdateInput = (id, value) => {
    let pres = this.getNewPresentation();
    const lang=this.props.language;
    let changed = false;
    const valueClean = cleanFormat(value,lang);
   
    if (id === 1) {
      changed =
        pres.invRate !==
        parseInt(10000 * valueClean) / 10000
          ? true
          : false;
      pres.invRate =
        parseInt(10000 * valueClean) / 10000;
    } else if (id === 2) {
      changed =
        pres.inflation !==
        parseInt(10000 * valueClean) / 10000
          ? true
          : false;

      pres.inflation =
        parseInt(10000 * valueClean) / 10000;
    } else if (id === 3) {
       changed =
        pres.taxRate !==
        parseInt(10000 * valueClean) / 10000
          ? true
          : false;

      pres.taxRate =
        parseInt(10000 * valueClean) / 10000;
    }
    //changed = pres.adviserLogo !== this.state.image ? true : false;
 
    
    if (changed) this.props.handleUpdate(pres);
  };

  updateInputValue(id, evt) {
     let pres = this.getNewPresentation();
    let changed = false;
    if (id === 3) {
      changed = pres.designedFor !== evt.target.value;
      pres.designedFor = evt.target.value;
    } else if (id === 4) {
      changed = pres.designedBy !== evt.target.value;
      pres.designedBy = evt.target.value;
    } else if (id === 5) {
      changed = pres.notes !== evt.target.value;
      pres.notes = evt.target.value;
    }
    if (changed) this.props.handleUpdate(pres);
  }

 

  render() {
     const infoIcon = getInfoIconNotes(this.props.language);
    return (
      <div className="inputRow">
        {this.dataValues.DD.map((dd) => (
          <DropDown
            key={dd.id}
            id={dd.id}
            Count={1}
            Title={dd.Title}
            width={DROPDOWN_WIDE}
            defValue={dd.defValue}
            Values={dd.Values}
            updateDDown={this.updateDDown}
          />
        ))}
        <InputField
          inputName={CONTROLTITLE[this.props.language].taxRate}
          format={3}
          id={3}
          Count={1}
          language={this.props.language}
          inputValue={Math.round(10000*this.props.presentationCurr.taxRate)/10000}
          inputTitle={this.props.id}
          handleUpdateInput={this.handleUpdateInput}
        />
        <InputField
          inputName={CONTROLTITLE[this.props.language].invRate}
          format={3}
          id={1}
          Count={1}
          language={this.props.language}
          inputValue={Math.round(10000*this.props.presentationCurr.invRate)/10000}
          inputTitle={this.props.id}
          handleUpdateInput={this.handleUpdateInput}
        />
        <InputField
          inputName={CONTROLTITLE[this.props.language].inflation}
          format={3}
          id={2}
          Count={1}
          language={this.props.language}
          inputValue={Math.round(10000*this.props.presentationCurr.inflation)/10000}
          inputTitle={this.props.id}
          handleUpdateInput={this.handleUpdateInput}
        />
        <div className="dropDown inputText">
          <span className="controlTitle">
            {CONTROLTITLE[this.props.language].designedFor}
          </span>
          <input
            id={3}
            className="inputField Text"
            value={this.state.designedFor}
            onFocus={this.handleFocus}
            onClick={this.select}
            type="text"
            onBlur={(evt) => this.updateInputValue(3, evt)}
            onChange={(evt) => this.setState({ designedFor: evt.target.value })}
          />
        </div>
        <div className="dropDown inputText">
          <span className="controlTitle">
            {CONTROLTITLE[this.props.language].designedBy}
          </span>
          <input
            id={4}
            className="inputField Text"
            onFocus={this.handleFocus}
            onClick={this.select}
            type="text"
            value={this.state.designedBy}
            onBlur={(evt) => this.updateInputValue(4, evt)}
            onChange={(evt) => this.setState({ designedBy: evt.target.value })}
          />
        </div>
     
        <div className="dropDown inputTextNotes">
          <span className="controlTitle">
            {CONTROLTITLE[this.props.language].notes}
          </span>
          <Info infoIcon={infoIcon} />{" "}
          <textarea
            id={5}
            className="inputField textarea"
            onFocus={this.handleFocus}
            onClick={this.select}
            type="text"
            value={this.state.notes}
            onBlur={(evt) => this.updateInputValue(5, evt)}
            onChange={(evt) => this.setState({ notes: evt.target.value })}
          />
        </div>
      </div>
    );
  }
}
