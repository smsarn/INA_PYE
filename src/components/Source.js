import React, { Component } from "react";
import { DropDown } from "./DropDown";
import { AddRemove } from "./AddRemove";
import { cleanFormat, getListToShowByOrder, getDisableValues } from "../utils/helper";

import { copyFromAnotherObject }  from "../data/createDefaults";
import {
  CONTROLTITLE,
  INCOMESOURCES,
  DEFAULT_DIVIDEND_TAX_RATE,
} from "../definitions/generalDefinitions";
//import { InputField4 } from './inputField4';
import { InputField } from "./inputField";
import {
  isMobileDevice,
  getListItemNameFromKey,
  getListItemKeyFromName,
} from "../utils/helper";
import { DROPDOWN_WIDE } from "../definitions/generalDefinitions";
import {
  getInfoIconSourcesGov,
  getInfoIconAssetsYr0,
  getInfoIconInflationGrowth
} from "../definitions/infoIconsDefinitions";

export class Source extends Component {
  displayName = Source.name;

  constructor(props) {
    super(props);
    let i;
    let typeValues = [];
    const listSourcesToShow = getListToShowByOrder(INCOMESOURCES);
    for (i = 0; i < listSourcesToShow.length; ++i) {
      {
        typeValues.push({
          label: listSourcesToShow[i].value[this.props.language],
          value: i + 1,
        });
      }
    }

    /* 
    for (i = 0; i <= 5; ++i) {
      typeValues.push({
        label: INCOMESOURCES[this.props.language].Values[i],
        value: i + 1
      });
    }
 */
    // console.log(this.props.sourceCurr)
    this.state = {};
    this.dataValues = {
      DD: [
        {
          id: 1,
          Title: CONTROLTITLE[this.props.language].type,
          defValue: getListItemNameFromKey(
            INCOMESOURCES,
            this.props.sourceCurr.sourceTypeKey,
            this.props.language
          ),
          disableOptionValue: getDisableValues(INCOMESOURCES),
          Values: typeValues,
        },
      ],
    };
    this.dataValues.DD[0].disableOptionValue[INCOMESOURCES.GOV_DEATH_BENEFIT.ID]=true;
    this.dataValues.DD[0].disableOptionValue[INCOMESOURCES.GOV_SURVIVORS_PENSION.ID]=true;
    this.dataValues.DD[0].disableOptionValue[INCOMESOURCES.GOV_ORPHANS_BENEFIT.ID]=true;

  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.sourceCurr !== this.props.sourceCurr ||
      nextProps.id !== this.props.id ||
      nextProps.sourcesNo !== this.props.sourcesNo
    ) {
      // console.log(nextProps.sourceCurr.sourceTypeKey)
      this.dataValues.DD[0].defValue = getListItemNameFromKey(
        INCOMESOURCES,
        nextProps.sourceCurr.sourceTypeKey,
        this.props.language
      );
    }
  }

  handleDoRemove = (id) => {
    if (this.props.disableAddRemove === false) {
      this.props.handleRemoveSource(id);
    }  
  };

  isSourceGovNonOrphanBenefit = (key) => {
    if (
      key === INCOMESOURCES.GOV_SURVIVORS_PENSION.Key ||
      key === INCOMESOURCES.GOV_DEATH_BENEFIT.Key
    )
      return true;
    else return false;
  };

  isDividendIncome = (key) => {
    if (key === INCOMESOURCES.DIVIDEND_INCOME.Key) return true;
    else return false;
  };
  isSourceGovOrphansBenefit = (key) => {
    if (key === INCOMESOURCES.GOV_ORPHANS_BENEFIT.Key) return true;
    else return false;
  };

  handleDoAdd = () => {
    // no gov stuff
    if (this.props.disableAddRemove === false) {
    
    var sourceNo =
      this.props.sourcesNo > this.dataValues.DD[0].Values.length - 1
        ? this.dataValues.DD[0].Values.length - 1
        : this.props.sourcesNo;
    //if(this.props.includeGovOrphanBenefit===false)
    //  sourceNo +=1;
    if (sourceNo > this.dataValues.DD[0].Values.length - 1) sourceNo -= 1;

    let sourceNextKey = getListItemKeyFromName(
      INCOMESOURCES,
      this.dataValues.DD[0].Values[sourceNo].label
    );

    // dont add gov stuff unless has child && orphanben
    while (
      sourceNextKey === INCOMESOURCES.GOV_DEATH_BENEFIT.Key ||
      sourceNextKey === INCOMESOURCES.GOV_SURVIVORS_PENSION.Key ||
      (sourceNextKey === INCOMESOURCES.GOV_ORPHANS_BENEFIT.Key &&
        this.props.includeGovOrphanBenefit === false)
    ) {
      sourceNo += 1;
      sourceNextKey = getListItemKeyFromName(
        INCOMESOURCES,
        this.dataValues.DD[0].Values[sourceNo].label
      );
    }

    // dont repeat
    while (
      sourceNextKey === this.props.sourceCurr.sourceTypeKey &&
      this.props.sourceCurr.sourceTypeKey !== INCOMESOURCES.OTHER.Key
    ) {
      sourceNo += 1;
      sourceNextKey = getListItemKeyFromName(
        INCOMESOURCES,
        this.dataValues.DD[0].Values[sourceNo].label
      );
    }

    const source = {
      id: this.props.sourcesNo + 1,
      sourceTypeKey: sourceNextKey,
      amount: 0,
      startYear: 0,
      // set others based on INA other values tax infl
      // duration, growthRate,ownerID,taxRate depends on clients

    };
    if (sourceNextKey === INCOMESOURCES.DIVIDEND_INCOME.Key)
      source.taxRate = DEFAULT_DIVIDEND_TAX_RATE;
    // console.log(source)
    this.props.handleAddSource(source);
  }
  };

  updateDDown = (id, selection) => {
    let source = {
      id: this.props.sourceCurr.id,
      //Type: this.props.Type,
      sourceTypeKey: this.props.sourceCurr.sourceTypeKey,
      amount: this.props.sourceCurr.amount,
      startYear: this.props.sourceCurr.startYear,
      duration: this.props.sourceCurr.duration,
      taxRate: this.props.sourceCurr.taxRate,
      annualGrowth: this.props.sourceCurr.annualGrowth,
    };

    if (id === 1)
      source.sourceTypeKey = getListItemKeyFromName(INCOMESOURCES, selection);
    else if (id === 2) source.ownerID = selection;
    this.props.handleUpdate(source);
  };

  handleUpdateInput = (id, value) => {
    let  s1 = {
      id: this.props.sourceCurr.id,
      //Type: this.props.Type,
      sourceTypeKey: this.props.sourceCurr.sourceTypeKey,
      amount: this.props.sourceCurr.amount,
      startYear: this.props.sourceCurr.startYear,
      duration: this.props.sourceCurr.duration,
      ownerID: this.props.sourceCurr.ownerID,
      taxRate: this.props.sourceCurr.taxRate,
      annualGrowth: this.props.sourceCurr.annualGrowth,
    };

//    s1 =copyFromAnotherObject(this.props.sourceCurr)

    let changed = false;
    const lang = this.props.language;
    const valueClean = cleanFormat(value,lang);
    const valueCleanInt = parseInt(valueClean);

    if (id === 1) {
      changed = s1.amount !== valueCleanInt ? true : false;
      s1.amount = valueCleanInt;
    } else if (id === 2) {
      changed = s1.startYear !== value ? true : false;
      s1.startYear = value;
    } else if (id === 3) {
      changed = s1.duration !== value ? true : false;
      s1.duration = value;
    } else if (id === 4) {
      changed =
        s1.taxRate !==
        parseInt(100 * valueClean) / 100
          ? true
          : false;
      s1.taxRate =
        parseInt(100 * valueClean) / 100;
    } else if (id === 5) {
      changed =
        s1.annualGrowth !==
        parseInt(100 * valueClean) / 100
          ? true
          : false;
      s1.annualGrowth =
        parseInt(100 * valueClean) / 100;
    }
    if (changed){
       this.props.handleUpdate(s1);
       this.setState({ loading: this.props.disableAddRemove });
    }
  };

  render() {
    const gov = this.isSourceGovNonOrphanBenefit(
      this.props.sourceCurr.sourceTypeKey
    );
    const govOrphan = this.isSourceGovOrphansBenefit(
      this.props.sourceCurr.sourceTypeKey
    );
    const dividend = this.isDividendIncome(this.props.sourceCurr.sourceTypeKey);
    const RRIF = this.props.sourceCurr.sourceTypeKey === INCOMESOURCES.RRIF.Key;
    // console.log(this.props.sourceCurr,govOrphan,this.props.sourceCurr.maxOrphan)
    
    
    let unlistedGreyedOption;
    if (RRIF) {
      unlistedGreyedOption = [];
      unlistedGreyedOption.push({
        label: INCOMESOURCES.RRIF.value[this.props.language],
        value: 1,
      });
    }

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
            Count={this.props.sourcesNo}
            Title={dd.Title}
            // infoIcon={gov && !govOrphan ? getInfoIconSourcesGov(this.props.language): undefined}
            width={DROPDOWN_WIDE}
            language={this.props.language}
            defValue={dd.defValue}
            Values={dd.Values}
            disableOption={dd.disableOptionValue}
            unlistedGreyedOption={unlistedGreyedOption}
            updateDDown={this.updateDDown}
          />
        ))}
        {!RRIF && (
          <InputField
            format={2}
            id={1}
            key="amt"
            inputName={CONTROLTITLE[this.props.language].amountGross}
            readOnly={gov}
            Count={this.props.sourcesNo}
            language={this.props.language}
            infoIcon={
              gov || govOrphan// && !govOrphan
                ? getInfoIconSourcesGov(this.props.language)
                : undefined
            }
            maxValue={govOrphan ? this.props.sourceCurr.maxOrphan : undefined}
            inputValue={this.props.sourceCurr.amount}
            inputTitle={this.props.sourceCurr.id}
            handleUpdateInput={this.handleUpdateInput}
          />
        )}

        {gov || govOrphan ? (
          ""
        ) : (
          <InputField
            format={1}
            id={2}
            inputName={
              RRIF
                ? CONTROLTITLE[this.props.language].RRIFAge
                : CONTROLTITLE[this.props.language].startYear
            }
            Count={this.props.sourcesNo}
            language={this.props.language}
            inputValue={this.props.sourceCurr.startYear}
            infoIcon={getInfoIconAssetsYr0(this.props.language)}
            //infoIcon={RRIF ? getInfoIconSourcesRRIF(this.props.language): undefined}
            readOnly={RRIF}
            inputTitle={this.props.sourceCurr.id}
            handleUpdateInput={this.handleUpdateInput}
          />
        )}
        {gov || RRIF ? (
          ""
        ) : (
          <InputField
            format={1}
            id={3}
            inputName={CONTROLTITLE[this.props.language].dur}
            Count={this.props.sourcesNo}
            language={this.props.language}
            inputValue={this.props.sourceCurr.duration}
            maxValue={
              govOrphan ? this.props.sourceCurr.maxOrphanDur : undefined
            }
            inputTitle={this.props.sourceCurr.id}
            handleUpdateInput={this.handleUpdateInput}
          />
        )}

        {dividend && (
          <InputField
            id={4}
            inputName={CONTROLTITLE[this.props.language].dividendTaxRate}
            format={3}
            Count={this.props.sourcesNo}
            language={this.props.language}
            //   infoIcon={getInfoIconDividend(this.props.language)}
            inputValue={this.props.sourceCurr.taxRate}
            inputTitle={this.props.sourceCurr.id}
            handleUpdateInput={this.handleUpdateInput}
          />
        )}

        <AddRemove
          currentID={this.props.sourceCurr.id}
          numberComps={this.props.sourcesNo}
          handleDoAdd={this.handleDoAdd}
          handleDoRemove={this.handleDoRemove}
          disabled={this.props.disableAddRemove}
          disabledRemove={gov}
        />
        {/* {isMobileDevice() && this.props.sourceCurr.id < this.props.sourcesNo ? (
          <hr className="ppi2" />
        ) : (
          ""
        )} */}
      </div>
    );
      }
  }
}
