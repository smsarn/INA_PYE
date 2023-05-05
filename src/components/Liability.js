import React, { Component } from "react";
import { DropDown } from "./DropDown";
import { InputField } from "./inputField";
import { Info } from "./Info";
import { Switch } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import {
  getInfoIconProbate,
  getInfoIconLiabDesc,
} from "../definitions/infoIconsDefinitions";

import { AddRemove } from "./AddRemove";
import {
  getListToShowByOrder,
  getProjectedLiability,
  cleanFormat,
  getListItemNameFromKey,
  getListItemKeyFromName,
  arrayFormatMoney,
} from "../utils/helper";

import {
  LIABILITIES,
  ASSETS,
  OWNERSHIP,
  CONTROLTITLE,
  GROWTHDIR,
  UNLISTED,
  ASSET_TaxCredit,
  APPLET_INA,
  APPLET_EP,
  ASSET_YEAR_TODAY,
  CONTROLTITLELIABS,
} from "../definitions/generalDefinitions";
import { isMobileDevice } from "../utils/helper";
import DataTable from "./GridExcelComponent/DataTable";
import { fetchAssetProjection } from "../utils/FetchAPIs";
import {
  LIABILITY_API_OUTPUT_Year,
  LIABILITY_API_OUTPUT_Age,
  LIABILITY_API_OUTPUT_ProjectedValue,
  LIABILITY_API_OUTPUT_TaxCredit,
  DROPDOWN_WIDE,
} from "../definitions/generalDefinitions";

const styles = (theme) => ({
  switchBase: {
    color: "rgb(235,235,235)",
    "&$checked": {
      color: "#4775ae",
    },
    "&$checked + $track": {
      backgroundColor: "rgb(117, 134, 145)",
    },
  },
  checked: {},
  track: {
    backgroundColor: "rgb(117, 134, 145)",
  },
});

class Liability extends Component {
  displayName = Liability.name;

  constructor(props) {
    super(props);
    this.state = {
      description: "",
      displaySreadsheet: false,
      loading: false,
      dataProjection: [],
      overWriteProbate: APPLET_INA ? this.props.overwriteProbate : false,
    };
    var i;
    var typeValues = [];
    this.desc = this.props.liabilityCurr.description;
    const listLiabsToShow = getListToShowByOrder(LIABILITIES);
    for (i = 0; i < listLiabsToShow.length; ++i) {
      typeValues.push({
        label: listLiabsToShow[i].value[this.props.language],
        value: i + 1,
      });
    }
    var ownerValues = [
      { label: OWNERSHIP.CLIENT.value[this.props.language], value: 1 },
      { label: OWNERSHIP.SPOUSE.value[this.props.language], value: 2 },
      { label: OWNERSHIP.JOINT.value[this.props.language], value: 3 },
    ];

    var growthDirValues = [
      //{ label: GROWTHDIR[this.props.language].Values[0], value: 1 },
      //{ label: GROWTHDIR[this.props.language].Values[1], value: 2 },
      { label: GROWTHDIR.GROWS.value[this.props.language], value: 1 },
      { label: GROWTHDIR.REDUCES.value[this.props.language], value: 2 },
    ];

    this.dataValues = {
      DD: [
        {
          id: 1,
          Title: CONTROLTITLE[this.props.language].type,
          defValue: getListItemNameFromKey(
            LIABILITIES,
            this.props.liabilityCurr.liabTypeKey,
            this.props.language
          ),
          Values: typeValues,
        },
        {
          id: 2,
          Title: CONTROLTITLE[this.props.language].owner,
          defValue: getListItemNameFromKey(
            OWNERSHIP,
            this.props.liabilityCurr.ownerKey,
            this.props.language
          ),
          Values: ownerValues,
        },
        {
          id: 3,
          Title: CONTROLTITLE[this.props.language].growthDir,
          //this.props.liabilityCurr.growthDir,
          defValue: getListItemNameFromKey(
            GROWTHDIR,
            this.props.liabilityCurr.growthDirKey,
            this.props.language
          ),
          Values: growthDirValues,
        },
      ],
    };
    //this.dataProjection = [];
    this.dataColTitles = [];
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.liabilityCurr !== this.props.liabilityCurr ||
      nextProps.id !== this.props.id ||
      nextProps.liabilitysNo !== this.props.liabilitysNo ||
      nextProps.overWriteProbate !== this.props.overWriteProbate
    ) {
      // console.log(nextProps.liabilityCurr.liabTypeKey)
      this.dataValues.DD[0].defValue = getListItemNameFromKey(
        LIABILITIES,
        nextProps.liabilityCurr.liabTypeKey,
        this.props.language
      );
      this.dataValues.DD[1].defValue = getListItemNameFromKey(
        OWNERSHIP,
        nextProps.liabilityCurr.ownerKey,
        this.props.language
      );
      this.dataValues.DD[2].defValue = getListItemNameFromKey(
        // nextProps.liabilityCurr.growthDir;
        GROWTHDIR,
        nextProps.liabilityCurr.growthDirKey,
        this.props.language
      );

      this.setState({ description: nextProps.liabilityCurr.description });
    }
    if (
      nextProps.probate !== this.props.probate ||
      this.props.overWriteProbate !== nextProps.overWriteProbate
    ) {
      this.setLiabData(nextProps.liabilityCurr, nextProps.probate);
      if (nextProps.overWriteProbate !== undefined)
        this.setState({ overWriteProbate: nextProps.overWriteProbate });
    }
  }

  componentDidMount = () => {
    this.setState({ description: this.props.liabilityCurr.description });
  };

  handleDoRemove = (id) => {
    this.props.handleRemoveLiability(id);
  };

  handleDoAdd = () => {
    var liabNo =
      this.props.liabilitysNo > this.dataValues.DD[0].Values.length - 1
        ? this.dataValues.DD[0].Values.length - 1
        : this.props.liabilitysNo;

    var liabNext = this.dataValues.DD[0].Values[liabNo].label;
    const liabTypeKey = getListItemKeyFromName(LIABILITIES, liabNext);

    let liability = {
      id: this.props.liabilitysNo + 1,
      //Type: liabNext,
      liabTypeKey: liabTypeKey,
      description: "",
      ownerKey: OWNERSHIP.CLIENT.Key,
      currValue: 0,
      //growthDir: GROWTHDIR[this.props.language].Values[0],
      growthDirKey: GROWTHDIR.GROWS.Key,
      growth: 0,
      repay: 0,
      exposureDur: 99,
      assetTaxLiabID: 0,
      assetTaxLiabProj: [],
    };

    liability = this.setLiabilityValuesToDefault(liability);

    this.props.handleAddLiability(liability); //liabNext);
  };

  updateDDown = (id, selection) => {
    let liability = {
      id: this.props.liabilityCurr.id,
      //Type: this.props.liabilityCurr.Type,
      liabTypeKey: this.props.liabilityCurr.liabTypeKey,
      ownerKey: this.props.liabilityCurr.ownerKey,
      currValue: this.props.liabilityCurr.currValue,
      growth: this.props.liabilityCurr.growth,
      //growthDir: this.props.liabilityCurr.growthDir,
      growthDirKey: this.props.liabilityCurr.growthDirKey,
      exposureDur: this.props.liabilityCurr.exposureDur,
      repay: this.props.liabilityCurr.repay,
      description: "",
    };
    if (id === 1) {
      //liability.Type = selection;
      liability.liabTypeKey = getListItemKeyFromName(LIABILITIES, selection);
    } else if (id === 2) {
      liability.ownerKey = getListItemKeyFromName(OWNERSHIP, selection);
    } else if (id === 3) {
      //liability.growthDir = selection;
      liability.growthDirKey = getListItemKeyFromName(GROWTHDIR, selection);
    }

    liability = this.setLiabilityValuesToDefault(liability);

    this.props.handleUpdate(liability);
    if (this.state.displaySreadsheet) this.setLiabData(liability); // this.handleClick()
  };

  updateDesc = (evt) => {
    //console.log(evt.target.value);
    let liab = JSON.parse(JSON.stringify(this.props.liabilityCurr));
    liab.description = evt.target.value!==undefined?evt.target.value:"";
    this.props.handleUpdate(liab);
  };

  handleUpdateInput = (id, value, updateProbateOW) => {
    let liability = {
      id: this.props.liabilityCurr.id,
      //Type: this.props.liabilityCurr.Type,
      liabTypeKey: this.props.liabilityCurr.liabTypeKey,
      ownerKey: this.props.liabilityCurr.ownerKey,
      currValue: this.props.liabilityCurr.currValue,
      growth: this.props.liabilityCurr.growth,
      exposureDur: this.props.liabilityCurr.exposureDur,
      repay: this.props.liabilityCurr.repay,
      //growthDir: this.props.liabilityCurr.growthDir,
      growthDirKey: this.props.liabilityCurr.growthDirKey,
    };

    let changed = false;
    const lang = this.props.language;
    const valueClean = cleanFormat(value, lang);
    const valueCleanInt = parseInt(valueClean);

    if (id === 1) {
      changed = liability.currValue !== valueCleanInt ? true : false;
      liability.currValue = valueCleanInt;
    } else if (id === 2) {
      changed =
        liability.growth !== parseInt(100 * valueClean) / 100 ? true : false;
      liability.growth = parseInt(100 * valueClean) / 100;
    } else if (id === 3) {
      changed = liability.exposureDur !== parseInt(value) ? true : false;
      liability.exposureDur = parseInt(value);
    } else if (id === 5) {
       changed = liability.description !== value ? true : false;
      liability.description = value;
    }
    if (id === 4) {
      changed = liability.repay !== valueCleanInt ? true : false;
      liability.repay = valueCleanInt;
    }

    if (changed || updateProbateOW) {
      //alert('sending to NA  ' + this.state.overWriteProbate)
      this.props.handleUpdate(
        liability,
        liability.liabTypeKey === LIABILITIES.PROBATE.Key
          ? this.state.overWriteProbate
          : undefined
      );
      if (this.state.displaySreadsheet) this.setLiabData(liability); //  this.handleClick()
    }
    // if(!this.state.displaySreadsheet)  this.setState({ loading: this.props.disableAddRemove });
  };

  setLiabData = (liability, probate) => {
    this.setState({ loading: true });
    let dataProjection = [];
    const lang = this.props.language;
    const loan =
      liability.liabTypeKey === LIABILITIES.OUTSTANDING_LOANS.Key ||
      liability.liabTypeKey === LIABILITIES.MORTGAGE_REDEMPTION.Key;

    if (loan)
      this.dataColTitles = [
        CONTROLTITLELIABS[lang].year,
        CONTROLTITLELIABS[lang].repay,
        CONTROLTITLELIABS[lang].projValue,
        //   "Tax Credit"
      ];
    else
      this.dataColTitles = [
        CONTROLTITLELIABS[lang].year,
        CONTROLTITLELIABS[lang].projValue,
        //   "Tax Credit"
      ];

    //console.log(this.props.probate)
    let liabs = getProjectedLiability(liability, probate);

    let years = [];
    let repays = [];
    let i;
    let repay;
    let year;
    for (i = 0; i < liability.exposureDur + 1; ++i) {
      repay = i > 0 ? liability.repay : 0;
      year = i > 0 ? i : ASSET_YEAR_TODAY[lang].today;
      years.push(year);
      repays.push(repay);
    }

    let taxCredits = [];
    dataProjection[0] = years;
    if (loan) {
      dataProjection[1] = arrayFormatMoney(repays, lang, 0);
      dataProjection[2] = arrayFormatMoney(liabs, lang, 0);
    } else dataProjection[1] = arrayFormatMoney(liabs, lang, 0);

    this.setState({ dataProjection: dataProjection, loading: false });
  };

  handleClick = () => {
    if (!this.props.disableAddRemove) {
      this.setState({ loading: true });

      this.setLiabData(
        this.props.liabilityCurr,
        this.state.overWriteProbate === false
          ? this.props.probate
          : this.props.liabilityCurr.currValue
      );
      /* const loan =
      this.props.liabilityCurr.liabTypeKey ===
        LIABILITIES.OUTSTANDING_LOANS.Key ||
      this.props.liabilityCurr.liabTypeKey ===
        LIABILITIES.MORTGAGE_REDEMPTION.Key;

    if (loan)
      this.dataColTitles = [
        "Year",
        "Repayment",
        "Projected Value",
        //   "Tax Credit"
      ];
    else
      this.dataColTitles = [
        "Year",
        "Projected Value",
        //   "Tax Credit"
      ];

    const lang = this.props.language;
    let liabs = getProjectedLiability(this.props.liabilityCurr, lang);

    let years = [];
    let repays = [];
    let i;
    let repay;
    let year;
    for (i = 0; i < this.props.liabilityCurr.exposureDur + 1; ++i) {
      repay=i>0?this.props.liabilityCurr.repay:0;
      year=i>0?i:"today";
      years.push(year);
      repays.push(repay);
    }

    let taxCredits = [];
    this.dataProjection[0] = years;
    if (loan) {
      this.dataProjection[1] = arrayFormatMoney(repays, lang, 0);
      this.dataProjection[2] = arrayFormatMoney(liabs, lang, 0);
    } else this.dataProjection[1] = arrayFormatMoney(liabs, lang, 0);
 */
      //this.dataProjection[3] = taxCredits;

      // console.log(this.dataProjection);

      this.setState((prevState) => {
        let display = prevState.displaySreadsheet;
        return {
          displaySreadsheet: !display,
          loading: this.props.disableAddRemove,
        };
      });
    }
  };
  //});
  //}

  setLiabilityValuesToDefault = (liability) => {
    if (liability.liabTypeKey === LIABILITIES.OUTSTANDING_LOANS.Key) {
      liability.exposureDur = 10;
    } else if (liability.liabTypeKey === LIABILITIES.MORTGAGE_REDEMPTION.Key) {
      liability.exposureDur = 25;
    }

    return liability;
  };

  toggleCheckbox = (element) => {
    element.checked = !element.checked;
    this.setState({ overWriteProbate: element.checked }, () => {
      this.handleUpdateInput(
        1,
        element.checked === false
          ? this.props.probate
          : this.props.liabilityCurr.currValue,
        true
      );
    });
  };

  render() {
    const { classes } = this.props;
    //const growthSel = GROWTHDIR[this.props.language].Values.indexOf(
    //  this.props.liabilityCurr.growthDir );
    const growthSel =
      this.props.liabilityCurr.growthDirKey === GROWTHDIR.GROWS.Key
        ? GROWTHDIR.GROWS.ID
        : GROWTHDIR.REDUCES.ID;

    const loanOrTax =
      this.props.liabilityCurr.liabTypeKey ===
        LIABILITIES.OUTSTANDING_LOANS.Key ||
      this.props.liabilityCurr.liabTypeKey ===
        LIABILITIES.MORTGAGE_REDEMPTION.Key ||
      this.props.liabilityCurr.liabTypeKey ===
        LIABILITIES.CLIENT_TAX_LIABILITY.Key;

    const probate =
      this.props.liabilityCurr.liabTypeKey === LIABILITIES.PROBATE.Key;

    //alert("disable probate:   is it probate: " + probate + "    OW: " + this.state.overWriteProbate)
    const showGrowth =
      !APPLET_INA &&
      !loanOrTax &&
      !probate &&
      this.dataValues.DD.map((dd) => dd.id === 3);
    const showRepay =
      !APPLET_INA &&
      (this.props.liabilityCurr.liabTypeKey ===
        LIABILITIES.MORTGAGE_REDEMPTION.Key ||
        this.props.liabilityCurr.liabTypeKey ===
          LIABILITIES.OUTSTANDING_LOANS.Key);

    const showExposure =
      !APPLET_INA &&
      !probate &&
      !(
        this.props.liabilityCurr.liabTypeKey ===
        LIABILITIES.CLIENT_TAX_LIABILITY.Key
      );

    // console.log(this.props.liabilityCurr.id,this.props.liabilityCurr.liabTypeKey,this.props.liabilitysNo)

    if (this.state.loading === true && this.props.disableAddRemove === true) {
      return "";
    } else {
      return (
        <div className="inputRow">
          {this.dataValues.DD.map(
            (
              dd // don't show ownership dosen't matter
            ) =>
              dd.id < 3 &&
              !(dd.id === 2) && (
                <DropDown
                  key={dd.id}
                  id={dd.id}
                  Count={this.props.liabilitysNo}
                  Title={dd.Title}
                  infoIcon={
                    dd.Title === CONTROLTITLE[this.props.language].type &&
                    this.props.liabilityCurr.liabTypeKey ===
                      LIABILITIES.PROBATE.Key
                      ? getInfoIconProbate(this.props.language)
                      : undefined
                  }
                  width={DROPDOWN_WIDE}
                  defValue={dd.defValue}
                  Values={dd.Values}
                  updateDDown={this.updateDDown}
                />
              )
          )}
          <div className="dropDown inputDiv">
            <div className="controlTitle">
              {CONTROLTITLE[this.props.language].desc}
              {this.props.language === "en" ? (
                <Info infoIcon={getInfoIconLiabDesc(this.props.language)} />
              ) : undefined}{" "}
            </div>
            <input
              key={"desc"}
              id={5}
              className="inputField  textareaAssetName"
              value={this.state.description}
              onClick={this.select}
              type="text"
              onChange={(evt) =>
                this.setState({ description: evt.target.value })
              }
              onBlur={(evt) => this.updateDesc(evt)}
            />
          </div>

          <InputField
            inputName={CONTROLTITLE[this.props.language].amount}
            id={1}
            format={2}
            
            Count={this.props.liabilitysNo}
            language={this.props.language}
            readOnly={probate && this.state.overWriteProbate === false}
            inputValue={this.props.liabilityCurr.currValue}
            handleUpdateInput={this.handleUpdateInput}
          />

          {showRepay && (
            <InputField
              inputName={CONTROLTITLE[this.props.language].repay}
              id={4}
              format={2}
              Count={this.props.liabilitysNo}
              language={this.props.language}
              inputValue={this.props.liabilityCurr.repay}
              handleUpdateInput={this.handleUpdateInput}
            />
          )}

          {!APPLET_INA &&
            !loanOrTax &&
            !probate &&
            this.dataValues.DD.map(
              (dd) =>
                dd.id === 3 && (
                  <DropDown
                    key={dd.id}
                    id={dd.id}
                    Count={this.props.liabilitysNo}
                    Title={dd.Title}
                    defValue={dd.defValue}
                    Values={dd.Values}
                    updateDDown={this.updateDDown}
                  />
                )
            )}
          {!APPLET_INA && !loanOrTax && !probate && (
            <InputField
              inputName={
                growthSel === 0
                  ? CONTROLTITLE[this.props.language].growth
                  : CONTROLTITLE[this.props.language].changeRate
              }
              id={2}
              format={3}
              Count={this.props.liabilitysNo}
              language={this.props.language}
              inputValue={
                Math.round(10000 * this.props.liabilityCurr.growth) / 10000
              }
              handleUpdateInput={this.handleUpdateInput}
            />
          )}

          {showExposure && (
            <InputField
              inputName={CONTROLTITLE[this.props.language].exposureDur}
              id={3}
              format={1}
              Count={this.props.liabilitysNo}
              language={this.props.language}
              inputValue={this.props.liabilityCurr.exposureDur}
              handleUpdateInput={this.handleUpdateInput}
            />
          )}

          {!APPLET_INA && (
            <img
              className="iconMore"
              onClick={this.handleClick}
              id="gridOn"
              alt="ll"
              src={
                this.state.displaySreadsheet === true
                  ? require("../images/gridOff.png")
                  : require("../images/gridOn.png")
              }
            />
          )}

          {APPLET_INA &&
            this.props.liabilityCurr.liabTypeKey ===
              LIABILITIES.PROBATE.Key && (
              <span
                style={{
                  marginLeft: "10px",
                  marginTop: "20px",
                  display: "inline-block",
                }}
              >
                <Switch
                  focusVisibleClassName={classes.focusVisible}
                  disableRipple
                  classes={{
                    root: classes.root,
                    switchBase: classes.switchBase,
                    thumb: classes.thumb,
                    track: classes.track,
                    checked: classes.checked,
                  }}
                  checked={this.state.overWriteProbate}
                  onChange={this.toggleCheckbox}
                />
                <label className="controlTitle" htmlFor="probate">
                  {CONTROLTITLE[this.props.language].probateOW}
                </label>
              </span>
            )}
          {/* <span style={{marginTop:"20px", display: "inline-block"}}><label className="controlTitle" style={{position:"relative", marginLeft:"15px"}} for="probate"> {CONTROLTITLE[this.props.language].probateOW}</label>
        <FormControlLabel
              control={
                <Checkbox style={{ marginLeft:"6px"}}
                  checked={this.state.overWriteProbate}
                  onChange={this.toggleCheckbox}
                  size="small"
                  color="default"
                />
              }
              label=""
            />
             </span>} */}
          <AddRemove
            currentID={this.props.liabilityCurr.id}
            minComps={0}
            lang={this.props.language}
            id={this.props.liabilityCurr.liabTypeKey}
            numberComps={this.props.liabilitysNo}
            handleDoAdd={this.handleDoAdd}
            handleDoRemove={this.handleDoRemove}
            disabled={this.props.disableAddRemove}
          />
          {/*isMobileDevice() &&
        this.props.liabilityCurr.id < this.props.liabilitysNo ? (
          <hr className="ppi2" />
        ) : (
          ""
        )*/}
          {this.state.displaySreadsheet === true && (
            <div style={{ clear: "both", float: "left", width: "60%" }}>
              <DataTable
                dataColTitles={this.dataColTitles}
                dataProjection={this.state.dataProjection}
                gridTitle={
                  getListItemNameFromKey(
                    LIABILITIES,
                    this.props.liabilityCurr.liabTypeKey,
                    this.props.language
                  ) + " Projection"
                }
                language={this.props.language}
              />
            </div>
          )}
        </div>
      );
    }
  }
}

export default withStyles(styles, { withTheme: true })(Liability);
