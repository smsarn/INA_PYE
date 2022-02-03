import React, { Component } from "react";
import { DropDown } from "./DropDown";
import { AddRemove } from "./AddRemove";
import { cleanFormat, getListItemKeyFromName } from "../utils/helper";
import {
  MESSAGES,
  CONTROLTITLE,
  INCOMENEEDS,
  DROPDOWN_WIDE,
} from "../definitions/generalDefinitions";
//import { InputField4 } from './inputField4';
import { InputField } from "./inputField";
import {
  isMobileDevice,
  getListToShowByOrder,
  getListItemNameFromKey,
} from "../utils/helper";
import {
  getInfoSalaryPercent,
  getInfoIconAssetsYr0,
} from "../definitions/infoIconsDefinitions";

export class Need extends Component {
  displayName = Need.name;

  constructor(props) {
    super(props);
    let i;
    let typeValues = [];
    const listNeedsToShow = getListToShowByOrder(INCOMENEEDS);
    for (i = 0; i < listNeedsToShow.length; ++i) {
      typeValues.push({
        label: listNeedsToShow[i].value[this.props.language],
        value: i + 1,
      });
    }
    this.state = {
      loading: false,
    };
    this.dataValues = {
      DD: [
        {
          id: 1,
          Title: CONTROLTITLE[this.props.language].type,
          defValue: getListItemNameFromKey(
            INCOMENEEDS,
            this.props.needCurr.needTypeKey,
            this.props.language
          ),
          Values: typeValues,
        },
      ],
    };
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.needCurr !== this.props.needCurr ||
      nextProps.id !== this.props.id ||
      nextProps.needsNo !== this.props.needsNo
    ) {
      this.dataValues.DD[0].defValue = getListItemNameFromKey(
        INCOMENEEDS,
        nextProps.needCurr.needTypeKey,
        this.props.language
      );
    }
  }

  handleDoRemove = (id) => {
//    if (this.props.disableAddRemove === false) {
      this.props.handleRemoveNeed(id);
 //   }
  };

  handleDoAdd = () => {
 //   if (this.props.disableAddRemove === false) {

      let needNo =
      this.props.needsNo > this.dataValues.DD[0].Values.length - 1
        ? this.dataValues.DD[0].Values.length - 1
        : this.props.needsNo-1; // e % of income by default start from there

    if (needNo > this.dataValues.DD[0].Values.length - 1) needNo -= 1
    let needNext = this.dataValues.DD[0].Values[needNo].label;

    const startYear = 0; //this.props.startYear
    const dur = 1; //this.props.duration;

    this.props.handleAddNeed(
      getListItemKeyFromName(INCOMENEEDS, needNext),
      startYear,
      dur
    );
//    }
  };



  updateDDown = (id, selection) => {
    let need = {
      id: this.props.id,
      needTypeKey: this.props.needCurr.needTypeKey,

      Percent: this.props.needCurr.Percent,
      amount: this.props.needCurr.amount,
      startYear: this.props.needCurr.startYear,
      duration: this.props.needCurr.duration,
    };

    if (id === 1)
      need.needTypeKey = getListItemKeyFromName(INCOMENEEDS, selection);
    else if (id === 2) need.Owner = selection;
    // console.log(need)
    this.props.handleUpdate(need);
  };

  handleUpdateInput = (id, value) => {
    
    let need = {
      id: this.props.id,
      needTypeKey: this.props.needCurr.needTypeKey,
      Percent: this.props.needCurr.Percent,
      amount: this.props.needCurr.amount,
      startYear: this.props.needCurr.startYear,
      duration: this.props.needCurr.duration,
    };

    let changed = false;
    const lang = this.props.language;
    const valueClean = cleanFormat(value,lang);
    const valueCleanInt = parseInt(valueClean);
   
    if (id === 1) {
      changed = need.amount !== valueCleanInt ? true : false;
      need.amount = valueCleanInt;
      need.Percent = //100*need.amount/this.props.afterTaxTotalIncome
        (parseInt(1000000*need.amount / this.props.afterTaxTotalIncome)/10000).toFixed(2);
     } else if (id === 2) {
      changed = need.startYear !== value ? true : false;
      need.startYear = value;
    } else if (id === 3) {
      changed = need.duration !== value ? true : false;
      need.duration = value;
    } else if (id === 4) {
      changed =
        need.Percent !==
        parseInt(100 * valueClean) / 100
          ? true
          : false;
      need.Percent = parseFloat(valueClean);
    }
     if (changed) {
       this.props.handleUpdate(need);
       //this.setState({ loading: this.props.disableAddRemove });
     }
  };

  render() {
    let rOnly =
      this.props.needCurr.needTypeKey === INCOMENEEDS.PERCET_OF_INCOME.Key;
    rOnly = false;
    const percentN =
      this.props.needCurr.needTypeKey === INCOMENEEDS.PERCET_OF_INCOME.Key;
    let divStyleClass = "dropDown inputDiv";
    divStyleClass += this.props.language === "fr" ? " inputDivFrench" : "";

     if (this.state.loading === true && this.props.disableAddRemove=== true) {
      return (
       ""
      );
    } else {
    return (
      <div className="inputRow">
        {this.dataValues.DD.map((dd) => (
          <DropDown
            key={dd.id}
            id={dd.id}
            Count={this.props.needsNo}
            disable={this.props.needCurr.duration === 100}
            Title={dd.Title}
            defValue={dd.defValue}
            width={DROPDOWN_WIDE}
            Values={dd.Values}
            updateDDown={this.updateDDown}
          />
        ))}
        {percentN ? (
          <InputField
            inputName={CONTROLTITLE[this.props.language].percent}
            format={3}
            id={4}
            Count={this.props.needsNo}
            language={this.props.language}
            inputValue={this.props.needCurr.Percent}
            handleUpdateInput={this.handleUpdateInput}
          />
        ) : (
          ""
        )}
        <InputField
          inputName={CONTROLTITLE[this.props.language].afterTaxAmount}
          format={2}
          id={1}
          key={"am1"}
          readOnly={rOnly}
          Count={this.props.needsNo}
          language={this.props.language}
          infoIcon={getInfoSalaryPercent(this.props.language)}
          inputValue={this.props.needCurr.amount}
          handleUpdateInput={this.handleUpdateInput}
        />
        <InputField
          format={1}
          id={2}
          inputName={CONTROLTITLE[this.props.language].startYear}
          Count={this.props.needsNo}
          language={this.props.language}
          infoIcon={getInfoIconAssetsYr0(this.props.language)}
          inputValue={this.props.needCurr.startYear}
          handleUpdateInput={this.handleUpdateInput}
        />
        {this.props.needCurr.duration === 100 ? (
          <div className={divStyleClass}>
            <div className="controlTitle">
              {CONTROLTITLE[this.props.language].dur}
            </div>
            <input
              type="text"
              className="inputField inputFieldDisabled"
              isDisabled={true}
              value={MESSAGES[this.props.language].ever}
            />
          </div>
        ) : (
          <InputField
            format={1}
            id={3}
            inputName={CONTROLTITLE[this.props.language].dur}
            Count={this.props.needsNo}
            language={this.props.language}
            inputValue={this.props.needCurr.duration}
            handleUpdateInput={this.handleUpdateInput}
          />
        )}

        <AddRemove
          currentID={this.props.needCurr.id}
          minComps={0}
          id={this.props.needCurr.needTypeKey}
          numberComps={this.props.needsNo}
          handleDoAdd={this.handleDoAdd}
          handleDoRemove={this.handleDoRemove}
          disabled={this.props.disableAddRemove}
        />
        {/* {isMobileDevice() && this.props.id < this.props.needsNo ? (
          <hr className="ppi2" />
        ) : (
          ""
        )} */}
      </div>
    );
      }
  }
}
