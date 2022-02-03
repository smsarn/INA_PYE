import React, { Component } from "react";
import { DropDown } from "./DropDown";
//import { InputField4 } from './inputField4';
import { InputField } from "./inputField";
import { AddRemove } from "./AddRemove";
import { cleanFormat, getDisableValues } from "../utils/helper";
import {
  getInfoIconAssetsIncomeRate,
  getInfoIconAssetsYr0,
  getInfoIconAssetsOwner,
  getInfoIconSourcesRRIF,
  getInfoTaxLiability,
  getInfoIconTaxExempt,
  getInfoIconAssetsIns,
  getInfoIconTFSA,
  getInfoIconDepositWithd,
  getInfoIconTaxLiab,
} from "../definitions/infoIconsDefinitions";

import {
  createDefaultAsset,
  copyFromAnotherAsset,
} from "../data/createDefaults";
import {
  MESSAGES,
  ASSETS,
  ASSET_TAX,
  CONTROLTITLE,
  OWNERSHIP,
  ASSET_OWNERSHIP_ACTION,
  //  ASSET_OWNERSHIP_ACTION2,
  COLUMN_TITLES,
} from "../definitions/generalDefinitions";
import {
  getListItemNameFromKey,
  getListItemKeyFromName,
  isMobileDevice,
  getListToShowByOrder,
  arrayFormatMoney,
} from "../utils/helper";

import { ProjectionGrid } from "./ProjectionGrid.js";
import ProjectionGrid1 from "./ProjectionGrid1.js";
import DataTable from "./GridExcelComponent/DataTable";
import {
  fetchAssetProjection2,
  fetchAssetProjectionAPI,
} from "../utils/FetchAPIs";
import {
  DEFAULT_RRIF_AGE,
  DROPDOWN_WIDE,
} from "../definitions/generalDefinitions";
import _ from "lodash";

import {
  ASSET_API_OUTPUT_TaxPayable,
  APPLET_INA,
  APPLET_EP,
} from "../definitions/generalDefinitions";

import { GridButton } from "./GridButton";
import { getAssetGridValues } from "../data/assetGridProjections";
import debounce from "lodash.debounce";
import { Language } from "@material-ui/icons";

const ASSET_DROPDOWN_TYPE = 0;
// inserted desc here not a dropdown no need for indes
const ASSET_DROPDOWN_OWNER = 2;
const ASSET_DROPDOWN_TAXTYPE = 3;

export class Asset extends Component {
  displayName = Asset.name;
  constructor(props) {
    super(props);
    this.state = {
      description: "",
      displaySreadsheet: false,
      loading: false,
    };
    var i;
    var typeValues = [];
    const listAssetsToShow = getListToShowByOrder(ASSETS);
    for (i = 0; i < listAssetsToShow.length; ++i) {
      typeValues.push({
        label: listAssetsToShow[i].value[this.props.language],
        value: i + 1,
      });
    }
    /* for (i = 0; i < ASSETS[this.props.language].Values.length; ++i) {
      typeValues.push({
        label: ASSETS[this.props.language].Values[i],
        value: i + 1
      });
    } */

    /* var ownerValues = [
      {
        label: OWNERSHIP[this.props.language].Values[0],
        value: 1
      },
      { label: OWNERSHIP[this.props.language].Values[1], value: 2 },
      { label: OWNERSHIP[this.props.language].Values[2], value: 3 },
      { label: OWNERSHIP[this.props.language].Values[3], value: 4 }
    ];
 */
    var ownerActionValues = [
      {
        label:
          ASSET_OWNERSHIP_ACTION.CLIENT_LIQUIDATE.value[this.props.language],
        value: 1,
      },
      {
        label:
          ASSET_OWNERSHIP_ACTION.CLIENT_ROLLOVER.value[this.props.language],
        value: 2,
      },
      {
        label: ASSET_OWNERSHIP_ACTION.SPOUSE.value[this.props.language],
        value: 3,
      },
      {
        label: ASSET_OWNERSHIP_ACTION.JOINT.value[this.props.language],
        value: 4,
      },
    ];
    if (APPLET_EP) {
      ownerActionValues = [
        {
          label: ASSET_OWNERSHIP_ACTION.CLIENT.value[this.props.language],
          value: 1,
        },
        {
          label: ASSET_OWNERSHIP_ACTION.SPOUSE.value[this.props.language],
          value: 2,
        },
      ];
    }

    /* var ownerActionValues2 = [
          {
            label:
              ASSET_OWNERSHIP_ACTION2.properties[this.props.language].Values[
                OWNER_ACTION_CLIENTLIQUIDATE
              ],
            value: 1
          },
          {
            label:
              ASSET_OWNERSHIP_ACTION[this.props.language].Values[
                OWNER_ACTION_CLIENTROLLOVER
              ],
            value: 2
          },
          {
            label:
              ASSET_OWNERSHIP_ACTION[this.props.language].Values[
                OWNER_ACTION_Spouse
              ],
            value: 3
          },
          {
            label:
              ASSET_OWNERSHIP_ACTION[this.props.language].Values[
                OWNER_ACTION_Joint
              ],
            value: 4
          }
        ];
    
     */
    this.taxValues = [];
    this.desc = this.props.assetCurr.description;
    const listAssetTaxesToShow = getListToShowByOrder(ASSET_TAX);
    // console.log(listAssetTaxesToShow)
    for (i = 0; i < listAssetTaxesToShow.length; ++i) {
      this.taxValues.push({
        label: listAssetTaxesToShow[i].value[this.props.language],
        value: i + 1,
      });
    }
    // console.log(this.props.assetCurr)
    /*     for (i = 0; i < ASSET_TAX[this.props.language].Values.length; ++i) {
          this.taxValues.push({
            label: ASSET_TAX[this.props.language].Values[i],
            value: i + 1
          });
        }
     */

    // console.log(this.props.assetCurr.ownerKey)
    this.dataValues = {
      DD: [
        // asset types
        {
          //ASSET_DROPDOWN_TYPE index =0
          id: 1,
          Title: CONTROLTITLE[this.props.language].type,
          defValue: getListItemNameFromKey(
            ASSETS,
            this.props.assetCurr.assetTypeKey,
            this.props.language
          ),
          Values: typeValues,
          disableOptionValue: getDisableValues(ASSETS),
        },
        {
          id: 12,
          Title: "Description",
        },
        {
          //ASSET_DROPDOWN_OWNER index =2
          id: 2,
          Title: CONTROLTITLE[this.props.language].owner,
          /* defValue: this.props.assetCurr.ownerKey,
          Values: ownerValues 
          Title: ASSET_OWNERSHIP.Title.value[this.props.language],//CONTROLTITLE[this.props.language].ownershipAction,           */
          defValue: getListItemNameFromKey(
            ASSET_OWNERSHIP_ACTION,
            this.props.assetCurr.ownerKey,
            this.props.language
          ),
          Values: ownerActionValues,
          disableOptionValue: getDisableValues(ASSET_OWNERSHIP_ACTION),
        },
        {
          id: 3, //ASSET_DROPDOWN_TAXTYPE index =3
          Title: CONTROLTITLE[this.props.language].tax,
          defValue: getListItemNameFromKey(
            ASSET_TAX,
            this.props.assetCurr.assetTaxTypeKey,
            this.props.language
          ), // this.props.assetCurr.Tax,
          disableOptionValue: getDisableValues(ASSET_TAX),
          Values: this.taxValues,
        },
      ],
    };

    this.DDTax = {
      disableOptionValue: getDisableValues(ASSET_TAX),
    };
    for (let i = 3; i < this.DDTax.disableOptionValue.length; i++)
      this.DDTax.disableOptionValue[i] = true;

    this.dataColTitles = [];
    this.taxLiabOfClient = [];
  }

  componentWillReceiveProps(nextProps) {
    //console.log(nextProps.assetCurr, this.props.assetCurr);
    if (
      !_.isEqual(nextProps.assetCurr, this.props.assetCurr) ||
      nextProps.id !== this.props.id ||
      nextProps.assetsNo !== this.props.assetsNo ||
      nextProps.clientsNo !== this.props.clientsNo ||
      !_.isEqual(nextProps.projection, this.props.projection)
    ) {
      if (
        this.props.assetCurr.assetTypeKey ===
          ASSETS.CHARITABLE_GIFTS_TAX_CREDIT.Key ||
        nextProps.assetCurr.assetTypeKey ===
          ASSETS.CHARITABLE_GIFTS_TAX_CREDIT.Key
      ) {
        // console.log(this.dataValues.DD[0].Values);
        //console.log(nextProps.projection, this.props.projection);

        this.dataValues.DD[ASSET_DROPDOWN_TYPE].Values.push({
          label: ASSETS.CHARITABLE_GIFTS_TAX_CREDIT.value[this.props.language],
          value: this.dataValues.DD[ASSET_DROPDOWN_TYPE].Values.length + 1,
        });
        // console.log(this.dataValues.DD[0].Values);
      }

      this.dataValues.DD[ASSET_DROPDOWN_TYPE].defValue = getListItemNameFromKey(
        ASSETS,
        nextProps.assetCurr.assetTypeKey,
        this.props.language
      );
      this.dataValues.DD[ASSET_DROPDOWN_OWNER].defValue =
        getListItemNameFromKey(
          ASSET_OWNERSHIP_ACTION,
          nextProps.assetCurr.ownerKey,
          this.props.language
        );
      this.dataValues.DD[ASSET_DROPDOWN_TAXTYPE].defValue =
        getListItemNameFromKey(
          ASSET_TAX,
          nextProps.assetCurr.assetTaxTypeKey,
          this.props.language
        ); //nextProps.assetCurr.Tax;

      this.dataValues.DD[2].disableOptionValue[1] =
        (APPLET_EP && nextProps.clientsNo === 1) ||
        nextProps.assetCurr.assetTypeKey === ASSETS.LIFE_INSURANCE.Key;
      //APPLET_EP && nextProps.clientsNo === 1;
      if (APPLET_INA && nextProps.clientsNo === 1) {
        nextProps.assetCurr.ownerKey =
          ASSET_OWNERSHIP_ACTION.CLIENT_LIQUIDATE.Key;
        this.dataValues.DD[2].disableOptionValue[1] = true;
        this.dataValues.DD[2].disableOptionValue[2] = true;
        this.dataValues.DD[2].disableOptionValue[3] = true;
      }

      this.setState({ description: nextProps.assetCurr.description });
      //this.dataValues.DD[3].defValue = nextProps.assetCurr.ownerKey;

      /* 
let i;
      this.typeValues = [];
       if(this.props.Type===ASSETS[this.props.language].Values[4])	//		'Registered')  
      {
        this.dataValues.DD[2].defValue =ASSET_TAX[this.props.language].Values[TAX_RRSP] 

      this.typeValues.push({
        label: ASSETS[this.props.language].Values[2],
       });
     }
      else{
      for (i = 0; i <= ASSETS[this.props.language].Values.length; ++i) {
        this.typeValues.push({
        label: ASSETS[this.props.language].Values[i],
        value: i + 1
      });
      }} */
    }
  }

  componentDidMount = () => {
    this.setState({ description: this.props.assetCurr.description });
  };

  handleDoRemove = (id) => {
    if (this.props.disableAddRemove === false) {
      this.props.handleRemoveAsset(id);
    }
  };

  handleDoAdd = () => {
    if (this.props.disableAddRemove === false) {
      var assNo =
        this.props.assetsNo >
        this.dataValues.DD[ASSET_DROPDOWN_TYPE].Values.length - 1
          ? this.dataValues.DD[ASSET_DROPDOWN_TYPE].Values.length - 2
          : this.props.assetsNo;
      var assNext = this.dataValues.DD[ASSET_DROPDOWN_TYPE].Values[assNo].label;
      if (assNo === 4 || assNo === 5) assNo = 0;
      else
        assNo =
          this.props.assetsNo >
          this.dataValues.DD[ASSET_DROPDOWN_TAXTYPE].Values.length - 1
            ? this.dataValues.DD[ASSET_DROPDOWN_TAXTYPE].Values.length - 1
            : this.props.assetsNo;
      var assTax =
        this.dataValues.DD[ASSET_DROPDOWN_TAXTYPE].Values[assNo].label;
      const assTaxTypeKey = getListItemKeyFromName(
        ASSET_TAX,
        this.dataValues.DD[ASSET_DROPDOWN_TAXTYPE].Values[assNo].label
      );
      // console.log(assTaxTypeKey,assTax )
      let asset = createDefaultAsset(this.props.assetsNo + 1);
      asset.assetTypeKey = getListItemKeyFromName(ASSETS, assNext);
      asset.description = "";
      /* asset.ownerKey = APPLET_INA
        ? (this.props.clientsNo === 1?ASSET_OWNERSHIP_ACTION.CLIENT_LIQUIDATE.Key:ASSET_OWNERSHIP_ACTION.CLIENT_ROLLOVER.Key)
        : ASSET_OWNERSHIP_ACTION.CLIENT.Key; // in EP RRSP owner client or spouse */
      if (APPLET_INA) {
        if (this.props.clientsNo === 1)
          asset.ownerKey = ASSET_OWNERSHIP_ACTION.CLIENT_LIQUIDATE.Key;
      } else asset.ownerKey = ASSET_OWNERSHIP_ACTION.CLIENT.Key; // in EP RRSP owner client or spouse

      if (asset.assetTypeKey === ASSETS.LIFE_INSURANCE.Key)
        asset.ownerKey = ASSET_OWNERSHIP_ACTION.CLIENT_LIQUIDATE.Key;
      asset.assetTaxTypeKey = assTaxTypeKey;

      asset = this.setAssetValuesToDefault(asset);

      this.dataValues.DD[ASSET_DROPDOWN_TAXTYPE].Values = this.taxValues;

      this.props.handleAddAsset(asset);
    }
  };

  updateDDown = (id, selection) => {
    const { id: propId, assetCurr } = this.props;

    let asset = copyFromAnotherAsset(assetCurr);
    asset.id = propId;
    if (id === 1) {
      asset = createDefaultAsset(propId);
      asset.assetTypeKey = getListItemKeyFromName(ASSETS, selection);
      asset = this.setAssetValuesToDefault(asset);
     
    } else if (id === 2) {
      asset.ownerKey = getListItemKeyFromName(
        ASSET_OWNERSHIP_ACTION,
        selection
      );
      asset = this.setAssetValuesToDefault(asset);
    } else if (id === 3)
      //asset.Tax = selection;
      asset.assetTaxTypeKey = getListItemKeyFromName(ASSET_TAX, selection);

    /* asset = this.setAssetValuesToDefault(asset);  */

    this.props.handleUpdate(asset);
    //if (this.state.displaySreadsheet === true)
    //this.handleUpdateGrid();
  };
  /*  debounceHandleUpdataDesc = debounce(
    (asset) => this.props.handleUpdate(asset),
    500
  ); */

  updateDesc = (evt) => {
    //console.log(evt.target.value);
    let asset = copyFromAnotherAsset(this.props.assetCurr);
    asset.description = evt.target.value;
    this.props.handleUpdate(asset);
  };

  handleUpdateInput = (id, value) => {
    //this.setState({ loading: true });
    let asset = copyFromAnotherAsset(this.props.assetCurr);
    asset.id = this.props.id;
    //console.log(value);
    /* let asset = {
      id: this.props.id,
      //Type: this.props.assetCurr.Type,
      assetTypeKey: this.props.assetCurr.assetTypeKey,
      ownerKey: this.props.assetCurr.ownerKey,
      //OwnerID: this.props.assetCurr.OwnerID,
      currValue: this.props.assetCurr.currValue,
      //Tax: this.props.assetCurr.Tax,
      assetTaxTypeKey: this.props.assetCurr.assetTaxTypeKey,
      //TaxID: this.props.assetCurr.TaxID,
      growth: this.props.assetCurr.growth,
      DisposeYr: this.props.assetCurr.DisposeYr,
      DisposeDur: this.props.assetCurr.DisposeDur,
      ACB: this.props.assetCurr.ACB,
      smallBusinessCapGainExemption: this.props.assetCurr
        .smallBusinessCapGainExemption,
      contributionAmt: this.props.assetCurr.contributionAmt,
      contributionStartYr: this.props.assetCurr.contributionStartYr,
      contributionDur: this.props.assetCurr.contributionDur,
      incomeRate: this.props.assetCurr.incomeRate,
      RRIFStartAge: this.props.assetCurr.RRIFStartAge
    };
 */
    let changed = false;
    const lang = this.props.language;
    const valueClean = cleanFormat(value, lang);
    const valueCleanInt = parseInt(valueClean);

    if (id === 2) {
      changed = asset.DisposeYr !== parseInt(value) ? true : false;
      asset.DisposeYr = parseInt(value);
    } else if (id === 3) {
      changed = asset.DisposeDur !== parseInt(value) ? true : false;
      asset.DisposeDur = parseInt(value);
    } else if (id === 4) {
      changed = asset.ACB !== valueCleanInt ? true : false;
      asset.ACB = valueCleanInt;
    } else if (id === 10) {
      changed =
        asset.smallBusinessCapGainExemption !== valueCleanInt ? true : false;
      asset.smallBusinessCapGainExemption = valueCleanInt;
    } else if (id === 1) {
      changed = asset.currValue !== valueCleanInt ? true : false;
      asset.currValue = valueCleanInt;
    } else if (id === 5) {
      changed =
        asset.growth !== parseInt(10000 * valueClean) / 10000 ? true : false;
      asset.growth = parseInt(10000 * valueClean) / 10000;
    } else if (id === 6) {
      changed = asset.contributionAmt !== valueCleanInt ? true : false;
      asset.contributionAmt = valueCleanInt;
    } else if (id === 7) {
      changed = asset.contributionStartYr !== parseInt(value) ? true : false;
      asset.contributionStartYr = parseInt(value);
    } else if (id === 8) {
      changed = asset.contributionDur !== parseInt(value) ? true : false;
      asset.contributionDur = parseInt(value);
    } else if (id === 13) {
      changed = asset.withdrawalAmt !== valueCleanInt ? true : false;
      asset.withdrawalAmt = valueCleanInt;
    } else if (id === 14) {
      changed = asset.withdrawalStartYr !== parseInt(value) ? true : false;
      asset.withdrawalStartYr = parseInt(value);
    } else if (id === 15) {
      changed = asset.withdrawalDur !== parseInt(value) ? true : false;
      asset.withdrawalDur = parseInt(value);
    } else if (id === 9) {
      changed =
        asset.incomeRate !== parseInt(10000 * valueClean) / 10000
          ? true
          : false;
      asset.incomeRate = parseInt(10000 * valueClean) / 10000;
    } else if (id === 11) {
      changed = asset.RRIFStartAge !== parseInt(value) ? true : false;
      asset.RRIFStartAge = parseInt(value);
    } else if (id === 12) {
      changed = asset.description !== value ? true : false;
      asset.description = value;
    }
    if (changed) {
      this.props.handleUpdate(asset);
      this.setState({ loading: this.props.disableAddRemove });

      //this.setState({ loading: false });
      // this.handleUpdateGrid();
    }
  };

  updateClientTaxLiability = async () => {
    let dataNA = this.props.getAssetProjection();
    //let appSiteAPI = "http://localhost:8082";
    let data = await fetchAssetProjection2(dataNA, this.props.id);
    if (data !== undefined) {
      // console.log(data[ASSET_API_OUTPUT_TaxPayable].numericValues[0]);

      return data[ASSET_API_OUTPUT_TaxPayable].numericValues;
    }
  };

  getData = async (dataNA, id) => {
    let data = await fetchAssetProjectionAPI(dataNA, id);

    return data;
  };

  handleClickGridButton = () => {
    this.setState({ loading: true });
    const display = this.state.displaySreadsheet;

    this.props.adjustVisibleOutputSection(display === false ? 1 : -1);
    this.setState({ displaySreadsheet: !display, loading: false });

    /* if (this.state.displaySreadsheet === true) {
      this.setState(prevState => {
        let display = prevState.displaySreadsheet;
        return { displaySreadsheet: !display,  loading:false };
      });
    }
    else {
      //await this.handleUpdateGrid()
      this.setState(prevState => {
        let display = prevState.displaySreadsheet;
        return { displaySreadsheet: !display,  loading:false };
      });
      } */
  };

  setAssetValuesToDefault = (asset) => {
    this.dataValues.DD[ASSET_DROPDOWN_TAXTYPE].Values = this.taxValues;

    if (asset.assetTypeKey === ASSETS.RRSP_RRIF.Key) {
      //value[this.props.language]) {
      //asset.Tax = ASSET_TAX.REGISTERED.value[this.props.language];
      asset.assetTaxTypeKey = ASSET_TAX.REGISTERED.Key;
      if (
        APPLET_INA &&
        this.props.clientsNo > 1 &&
        asset.ownerKey === ASSET_OWNERSHIP_ACTION.JOINT.Key
      ) {
        asset.ownerKey = ASSET_OWNERSHIP_ACTION.CLIENT_ROLLOVER.Key;
      }
    } else if (
      asset.assetTypeKey === ASSETS.PERSONAL_RESIDENCE.Key ||
      asset.assetTypeKey === ASSETS.TFSA.Key //value[this.props.language]
    ) {
      //asset.Tax = ASSET_TAX.NON_TAXABLE.value[this.props.language];
      asset.assetTaxTypeKey = ASSET_TAX.NON_TAXABLE.Key;
      asset.ACB = 0;
      asset.DisposeYr = 99;
      asset.DisposeDur = 1;
      if (asset.assetTypeKey === ASSETS.TFSA.Key && asset.ownerKey === ASSET_OWNERSHIP_ACTION.JOINT.Key)
        asset.ownerKey = ASSET_OWNERSHIP_ACTION.CLIENT_ROLLOVER.Key;
    } else if (asset.assetTypeKey === ASSETS.CASH.Key) {
      //value[this.props.language]) {
      //asset.Tax = ASSET_TAX.NON_TAXABLE.value[this.props.language];
      asset.assetTaxTypeKey = ASSET_TAX.NON_TAXABLE.Key;

      asset.ACB = 0;
    } else if (
      asset.assetTypeKey === ASSETS.LIFE_INSURANCE.Key //value[this.props.language]
    ) {
      //asset.Tax = ASSET_TAX.NON_TAXABLE.value[this.props.language];
      asset.assetTaxTypeKey = ASSET_TAX.NON_TAXABLE.Key;

      asset.DisposeYr = APPLET_INA ? 0 : 99;
      asset.DisposeDur = 1;
      asset.ACB = 0;

      //  asset.ownerKey = APPLET_INA?ASSET_OWNERSHIP_ACTION.CLIENT_LIQUIDATE.Key:ASSET_OWNERSHIP_ACTION.CLIENT_ROLLOVER.Key;  allow spouse ins
    } else if (
      asset.assetTypeKey === ASSETS.STOCKS_BONDS.Key || //value[this.props.language] ||
      asset.assetTypeKey === ASSETS.REAL_ESTATE.Key //value[this.props.language]
    ) {
      //asset.Tax = ASSET_TAX.CAPITAL_GAINS_DEFERRED.value[this.props.language];
      asset.assetTaxTypeKey = ASSET_TAX.CAPITAL_GAINS_DEFERRED.Key;

      /* this.dataValues.DD[ASSET_DROPDOWN_TAXTYPE].Values = [];
      this.dataValues.DD[ASSET_DROPDOWN_TAXTYPE].Values.push({
        label: ASSET_TAX.CAPITAL_GAINS_DEFERRED.value[this.props.language],
        value: 1,
      });
      this.dataValues.DD[ASSET_DROPDOWN_TAXTYPE].Values.push({
        label: ASSET_TAX.CAPITAL_GAINS_ANNUAL.value[this.props.language],
        value: 2,
      }); */
    } else if (asset.assetTypeKey === ASSETS.SMALL_BUSINESS_SHARES.Key)
      //value[this.props.language])
      //asset.Tax = ASSET_TAX.CAPITAL_GAINS_DEFERRED.value[this.props.language];
      asset.assetTaxTypeKey = ASSET_TAX.QUALIFYING_SMALL_BUSINESS.Key;
    //.CAPITAL_GAINS_DEFERRED.Key;
    else if (asset.assetTypeKey === ASSETS.INTEREST_BEARING.Key)
      asset.assetTaxTypeKey = ASSET_TAX.INTEREST.Key;
    //.FULLY_TAXABLE.Key;
    //asset.assetTaxTypeKey= ASSET_TAX.INTEREST.Key;
    else if (
      asset.assetTypeKey === ASSETS.OTHER_ASSETS.Key //value[this.props.language] ||
    )
      //asset.Tax = ASSET_TAX.FULLY_TAXABLE.value[this.props.language];
      asset.assetTaxTypeKey = ASSET_TAX.FULLY_TAXABLE.Key;
    
    if(APPLET_EP) 
      {
        if(asset.assetTypeKey === ASSETS.RRSP_RRIF.Key || asset.assetTypeKey === ASSETS.TFSA.Key)
        {   
         if(asset.ownerKey !== ASSET_OWNERSHIP_ACTION.CLIENT.Key  && asset.ownerKey !== ASSET_OWNERSHIP_ACTION.SPOUSE.Key)
            asset.ownerKey = ASSET_OWNERSHIP_ACTION.CLIENT.Key
        } 
      } 
      


    if (
      asset.ownerKey === ASSET_OWNERSHIP_ACTION.CLIENT_LIQUIDATE.Key //ASSET_OWNERSHIP.CLIENTLIQUIDATE.value[this.props.language]
    ) {
      asset.DisposeYr = 0;
      asset.DisposeDur = 1;
    }
    // console.log(asset)

    // single person
    if (APPLET_INA && this.props.clientsNo === 1) {
      asset.ownerKey = ASSET_OWNERSHIP_ACTION.CLIENT_LIQUIDATE.Key;
      asset.DisposeYr = 0;
    }
    return asset;
  };

  clone2 = () => {
    let id = "assetGrid";
    if (this.state.displaySreadsheet === true) {
      // console.log(this.state.displaySreadsheet)

      var itm = document.getElementById(id);
      // console.log(itm)

      var cln = itm.cloneNode(true);
      cln.id = "ll";
      //cln.style.position="relative"
      let cln2 = document.createElement("div");
      cln2.appendChild(cln);
      cln2.id = "lll";
      document.addEventListener("click", function (e) {
        if (e.target && e.target.id === "lll") {
        }
      });

      document.getElementById("copyDiv").appendChild(cln2);
    }
  };

  render() {
    const {
      id,
      assetCurr,
      /* Type,
      Owner,
      index,
      currValue,
      Tax,
      growth,
      Dispos
      eYr,
      DisposeDur,
      ACB,
      smallBusinessCapGainExemption,
      contributionAmt,
      contributionStartYr,
      contributionDur,
      incomeRate, */
      language,
      themeColor,
      assetsNo,
    } = this.props;
    const assetID = assetCurr.assetTypeKey; //ASSETS.INTEREST_BEARING.value[this.props.language]
    //Object.values(ASSETS).filter(obj => obj.value[language]=== assetCurr.Type)[0].Key
    let disableTaxMethods =
      assetCurr.assetTypeKey === ASSETS.LIFE_INSURANCE.Key || //value[language] ||
      assetCurr.assetTypeKey === ASSETS.CASH.Key || //value[language] ||
      assetCurr.assetTypeKey === ASSETS.PERSONAL_RESIDENCE.Key || //value[language] ||
      assetCurr.assetTypeKey === ASSETS.TFSA.Key || //value[language] ||
      assetCurr.assetTypeKey === ASSETS.RRSP_RRIF.Key || //value[language] ||
      assetCurr.assetTypeKey === ASSETS.INTEREST_BEARING.Key ||
      assetCurr.assetTypeKey === ASSETS.SMALL_BUSINESS_SHARES.Key
        ? true
        : false;
    const disableOwner = false; // allow ins for both
    const insurance = assetCurr.assetTypeKey === ASSETS.LIFE_INSURANCE.Key;

    const taxStocks = assetCurr.assetTypeKey === ASSETS.STOCKS_BONDS.Key;
    const taxRS = assetCurr.assetTypeKey === ASSETS.REAL_ESTATE.Key;

    // assetCurr.assetTypeKey === ASSETS.LIFE_INSURANCE.Key ? true : false;
    let hideOwner = false;
    if(APPLET_EP && this.props.assetCurr.assetTypeKey !== ASSETS.RRSP_RRIF.Key && this.props.assetCurr.assetTypeKey !== ASSETS.TFSA.Key)
        hideOwner = true;

    const taxT = CONTROLTITLE[language].tax;
    const ownerT = CONTROLTITLE[language].owner;
    const assetTypeIns =
      CONTROLTITLE[language].type &&
      assetCurr.assetTypeKey === ASSETS.LIFE_INSURANCE.Key;

    let assetTax = MESSAGES[language].assetTax;

    //const taxCredit=assetCurr.Type === UNLISTED[this.props.language].Assets.Values[ASSET_TaxCredit]
    const taxCredit =
      assetCurr.Type ===
      ASSETS.CHARITABLE_GIFTS_TAX_CREDIT.value[this.props.language];

    const rrsp = assetCurr.assetTaxTypeKey === ASSET_TAX.REGISTERED.Key; //value[language];
    const showACB = !(
      //assetCurr.Tax === ASSET_TAX.NON_TAXABLE.value[language] ||
      (
        assetCurr.assetTaxTypeKey === ASSET_TAX.NON_TAXABLE.Key || //value[language] ||
        rrsp ||
        assetCurr.assetTypeKey === ASSETS.INTEREST_BEARING.Key || //value[language] ||
        //assetCurr.Tax === ASSET_TAX.CAPITAL_GAINS_ANNUAL.value[language]
        assetCurr.assetTaxTypeKey === ASSET_TAX.CAPITAL_GAINS_ANNUAL.Key
      )
    );
    const showIncome =
      APPLET_INA &&
      assetCurr.assetTaxTypeKey === ASSET_TAX.CAPITAL_GAINS_DEFERRED.Key;
    //assetCurr.Tax === ASSET_TAX.CAPITAL_GAINS_DEFERRED.value[language] ||
    /* (APPLET_EP &&
        (assetCurr.assetTaxTypeKey === ASSET_TAX.CAPITAL_GAINS_DEFERRED.Key ||
        assetCurr.assetTypeKey === ASSETS.OTHER_ASSETS.Key || //value[language] ||
          rrsp)) ||
      (APPLET_INA &&
        rrsp &&
       assetCurr.ownerKey !== ASSET_OWNERSHIP_ACTION.CLIENT_LIQUIDATE.Key); //ASSET_OWNERSHIP.CLIENTLIQUIDATE.value[this.props.language]
     */

    const showDur = !(
      rrsp ||
      assetCurr.assetTypeKey === ASSETS.PERSONAL_RESIDENCE.Key || //value[language] ||
      assetCurr.assetTypeKey === ASSETS.REAL_ESTATE.Key || //value[language] ||
      taxCredit ||
      ASSET_OWNERSHIP_ACTION.CLIENT_LIQUIDATE.Key
    );
    const showGrowth = !(
      (
        assetCurr.assetTypeKey === ASSETS.LIFE_INSURANCE.Key ||
        assetCurr.assetTypeKey === ASSETS.CASH.Key || //value[language] ||
        taxCredit ||
        assetCurr.ownerKey === ASSET_OWNERSHIP_ACTION.CLIENT_LIQUIDATE.Key
      ) //ASSET_OWNERSHIP.CLIENTLIQUIDATE.value[this.props.language]
    );

    const showDispose = !(
      rrsp ||
      (APPLET_INA && assetCurr.assetTypeKey === ASSETS.LIFE_INSURANCE.Key) || //value[language] ||
      assetCurr.ownerKey === ASSET_OWNERSHIP_ACTION.CLIENT_LIQUIDATE.Key || //ASSET_OWNERSHIP.CLIENTLIQUIDATE.value[this.props.language]
      taxCredit
    );

    let showCotribution = //APPLET_EP &&
      assetCurr.ownerKey !== ASSET_OWNERSHIP_ACTION.CLIENT_LIQUIDATE.Key && //ASSET_OWNERSHIP.CLIENTLIQUIDATE.value[this.props.language]
      (rrsp ||
        assetCurr.assetTypeKey === ASSETS.INTEREST_BEARING.Key || //value[language] ||
        assetCurr.assetTypeKey === ASSETS.STOCKS_BONDS.Key ||
        assetCurr.assetTypeKey === ASSETS.TFSA.Key); //value[language];
    let showWithdrawal =
      (APPLET_EP ||
        (APPLET_INA && assetCurr.withdrawalAmt > 0) ||
        APPLET_INA) &&
      assetCurr.ownerKey !== ASSET_OWNERSHIP_ACTION.CLIENT_LIQUIDATE.Key && //ASSET_OWNERSHIP.CLIENTLIQUIDATE.value[this.props.language]
      (assetCurr.assetTypeKey === ASSETS.INTEREST_BEARING.Key || //value[language] ||
        assetCurr.assetTypeKey === ASSETS.STOCKS_BONDS.Key ||
        rrsp ||
        assetCurr.assetTypeKey === ASSETS.TFSA.Key); //value[language];

     // if client rollover dont contribute to rrsp ortfsa
    if (
      APPLET_INA &&
      assetCurr.ownerKey === ASSET_OWNERSHIP_ACTION.CLIENT_ROLLOVER.Key &&
      (rrsp || assetCurr.assetTypeKey === ASSETS.TFSA.Key)
    ) {
      showCotribution = false;
      showWithdrawal = false;
    }
    
    const showCGE = assetCurr.assetTypeKey === ASSETS.SMALL_BUSINESS_SHARES.Key; //value[language]
    // console.log(this.dataValues);

    let gridIcons = new Array(this.dataColTitles.length);
    this.dataColTitles.forEach((item) => {
      if (item === COLUMN_TITLES[this.props.language].TaxLiability)
        gridIcons[this.dataColTitles.length - 1] =
          getInfoTaxLiability(language);
    });

    //const disableDD=(dd.Title === CONTROLTITLE[language].owner && disableOwner)  || (dd.Title === taxT && disableTaxMethods) || (taxCredit && (dd.Title === taxT || dd.Title ===CONTROLTITLE[this.props.language].ownerAction))
    let disableAll = false;
    if (
      this.props.assetCurr.assetTypeKey ===
      ASSETS.CHARITABLE_GIFTS_TAX_CREDIT.Key
    ) {
      disableAll = true;
      this.dataValues.DD[ASSET_DROPDOWN_TYPE].Values.push({
        label: ASSETS.CHARITABLE_GIFTS_TAX_CREDIT.value[this.props.language],
        value: this.dataValues.DD[ASSET_DROPDOWN_TYPE].Values.length + 1,
      });
    }

    const p =
      this.props.projection[this.props.assetCurr.id - 1] === undefined
        ? null
        : this.props.projection[this.props.assetCurr.id - 1].grid;

    this.dataValues.DD[0].disableOptionValue[ASSETS.PERSONAL_RESIDENCE.ID] =
      this.props.hasPersonalResidenceAlready; // disable more

    this.dataValues.DD[2].disableOptionValue[1] =
      (APPLET_EP && this.props.clientsNo === 1) ||
      assetCurr.assetTypeKey === ASSETS.LIFE_INSURANCE.Key;

    this.dataValues.DD[2].disableOptionValue[3] =
      this.props.assetCurr.assetTypeKey === ASSETS.TFSA.Key ||
      this.props.assetCurr.assetTypeKey === ASSETS.RRSP_RRIF.Key;

    // single person
    if (APPLET_INA && this.props.clientsNo === 1) {
      this.dataValues.DD[2].disableOptionValue[1] = true;
      this.dataValues.DD[2].disableOptionValue[2] = true;
      this.dataValues.DD[2].disableOptionValue[3] = true;
    }

    //console.log(this.props.assetCurr.projection, this.props.projection[0].grid);
    if (this.state.loading === true && this.props.disableAddRemove === true) {
      return "";
    } else {
      return (
        <div className="inputRow">
          {this.dataValues.DD.map((dd) =>
            dd.id < 4 ? (
              !(hideOwner === true && dd.id === 2) && (
                <DropDown
                  key={dd.id.toString()}
                  id={dd.id}
                  Count={assetsNo}
                  Title={dd.Title}
                  disable={
                    disableAll === true ||
                    (dd.Title === CONTROLTITLE[language].owner &&
                      disableOwner) ||
                    (dd.Title === taxT && disableTaxMethods) ||
                    (taxCredit &&
                      (dd.Title === taxT ||
                        dd.Title ===
                          CONTROLTITLE[this.props.language].ownerAction))
                  }
                  defValue={dd.defValue}
                  unlistedValue={
                    taxCredit
                      ? ASSETS.CHARITABLE_GIFTS_TAX_CREDIT.value[
                          this.props.language
                        ]
                      : ""
                  } // TODO ideally find in list of values
                  Values={dd.Values}
                  //info={dd.Title === "Type" && id === 1 ? assetTax : ""}
                  infoIcon={
                    (dd.Title === ownerT && assetCurr.id === 1
                      ? getInfoIconAssetsOwner(this.props.language)
                      : assetTypeIns
                      ? getInfoIconAssetsIns(this.props.language)
                      : undefined) ||
                    (dd.Title === CONTROLTITLE[language].type &&
                    (this.props.assetCurr.assetTypeKey === ASSETS.TFSA.Key ||
                      this.props.assetCurr.assetTypeKey ===
                        ASSETS.RRSP_RRIF.Key)
                      ? getInfoIconTFSA(this.props.language)
                      : undefined) ||
                    (dd.Title === CONTROLTITLE[language].tax &&
                    this.props.assetCurr.id === 1 &&
                    APPLET_INA
                      ? getInfoIconTaxLiab(this.props.language)
                      : undefined)
                  }
                  language={language}
                  //   disableOption={dd.disableOptionValue}
                  disableOption={
                    dd.id !== 3
                      ? dd.disableOptionValue
                      : taxStocks || taxRS
                      ? this.DDTax.disableOptionValue
                      : dd.disableOptionValue
                  }
                  width={DROPDOWN_WIDE}
                  updateDDown={this.updateDDown}
                />
              )
            ) : (
              <div className="dropDown inputDiv">
                <div className="controlTitle">
                  {CONTROLTITLE[this.props.language].desc}
                </div>
                <input
                  key={dd.id.toString()}
                  id={12}
                  className="inputField  textareaAssetName"
                  value={this.state.description}
                  onClick={this.select}
                  type="text"
                  onChange={(evt) =>
                    this.setState({ description: evt.target.value })
                  }
                  onBlur={(evt) => this.updateDesc(evt)}
                />

                {/* 
              <input
                id={12}
                type="text"
                className="inputField  textareaAssetName"
                onChange={this.updateDesc}
                value={assetCurr.description}
              /> */}
              </div>
            )
          )}
          <InputField
            inputName={
              insurance
                ? CONTROLTITLE[language].FA
                : CONTROLTITLE[language].amount
            }
            id={1}
            format={2}
            Count={assetsNo}
            language={language}
            inputValue={assetCurr.currValue}
            handleUpdateInput={this.handleUpdateInput}
          />

          {showGrowth && (
            <InputField
              inputName={CONTROLTITLE[language].growth}
              format={3}
              id={5}
              Count={assetsNo}
              language={language}
              inputValue={Math.round(10000 * assetCurr.growth) / 10000}
              inputTitle={id}
              handleUpdateInput={this.handleUpdateInput}
            />
          )}

          {showDispose && (
            <InputField
              inputName={
                APPLET_INA
                  ? CONTROLTITLE[language].disposeYr
                  : CONTROLTITLE[language].disposeYr
              } //CONTROLTITLE[language].dur}
              id={2}
              //info={MESSAGES[language].infoYr0}
              infoIcon={getInfoIconAssetsYr0(this.props.language)}
              format={1}
              Count={assetsNo}
              language={language}
              inputValue={assetCurr.DisposeYr}
              handleUpdateInput={this.handleUpdateInput}
            />
          )}
          {showDur && (
            <InputField
              inputName={CONTROLTITLE[language].disposeDur}
              id={3}
              format={1}
              Count={assetsNo}
              language={language}
              inputValue={assetCurr.DisposeDur}
              handleUpdateInput={this.handleUpdateInput}
            />
          )}
          {(rrsp || this.props.assetCurr.assetTypeKey === ASSETS.TFSA.Key) &&
            assetCurr.ownerKey !== //ASSET_OWNERSHIP.CLIENTLIQUIDATE.value[this.props.language]
              ASSET_OWNERSHIP_ACTION.CLIENT_LIQUIDATE.Key && (
              <InputField
                inputName={CONTROLTITLE[language].RRIFAge}
                format={1}
                id={11}
                Count={assetsNo}
                infoIcon={getInfoIconSourcesRRIF(this.props.language)}
                language={language}
                inputValue={assetCurr.RRIFStartAge}
                handleUpdateInput={this.handleUpdateInput}
              />
            )}
          {showIncome && (
            <InputField
              inputName={
                rrsp
                  ? CONTROLTITLE[language].RRIFRate
                  : CONTROLTITLE[language].incomeRate
              }
              format={3}
              id={9}
              Count={assetsNo}
              infoIcon={getInfoIconAssetsIncomeRate(this.props.language)}
              language={language}
              inputValue={Math.round(10000 * assetCurr.incomeRate) / 10000}
              handleUpdateInput={this.handleUpdateInput}
            />
          )}

          {showCGE && (
            <InputField
              inputName={CONTROLTITLE[language].smallBusinessCapGainExemption}
              format={2}
              id={10}
              Count={assetsNo}
              language={language}
              infoIcon={getInfoIconTaxExempt(this.props.language)}
              inputValue={assetCurr.smallBusinessCapGainExemption}
              handleUpdateInput={this.handleUpdateInput}
            />
          )}
          {showACB && (
            <InputField
              inputName={CONTROLTITLE[language].ACB}
              format={2}
              id={4}
              Count={assetsNo}
              language={language}
              inputValue={assetCurr.ACB}
              //{/*readOnly={disableTaxMethods}*/}

              handleUpdateInput={this.handleUpdateInput}
            />
          )}

          {showCotribution && (
            <div>
              <InputField
                inputName={CONTROLTITLE[language].contributionAmt}
                id={6}
                format={2}
                Count={assetsNo}
                language={language}
                inputValue={assetCurr.contributionAmt}
                infoIcon={getInfoIconDepositWithd(this.props.language)}
                colorDiv={"green"}
                handleUpdateInput={this.handleUpdateInput}
              />
              {/* <InputField
              inputName={CONTROLTITLE[language].contributionStartYr}
              id={7}
              format={1}
              //info={MESSAGES[language].infoYr0}
              Count={assetsNo}
              language={language}
              inputValue={assetCurr.contributionStartYr}
              handleUpdateInput={this.handleUpdateInput}
            />  */}
              <InputField
                inputName={CONTROLTITLE[language].contributionDur}
                id={8}
                format={1}
                Count={assetsNo}
                language={language}
                inputValue={assetCurr.contributionDur}
                colorDiv={"green"}
                handleUpdateInput={this.handleUpdateInput}
              />
            </div>
          )}

          {showWithdrawal && (
            <div>
              <InputField
                inputName={CONTROLTITLE[language].withdrawalAmt}
                id={13}
                format={2}
                Count={assetsNo}
                language={language}
                inputValue={assetCurr.withdrawalAmt}
                colorDiv={"red"}
                handleUpdateInput={this.handleUpdateInput}
              />
              <InputField
                inputName={CONTROLTITLE[language].withdrawalStartYr}
                id={14}
                format={1}
                //info={MESSAGES[language].infoYr0}
                Count={assetsNo}
                language={language}
                inputValue={assetCurr.withdrawalStartYr}
                minValue={1}
                colorDiv={"red"}
                handleUpdateInput={this.handleUpdateInput}
              />
              <InputField
                inputName={CONTROLTITLE[language].withdrawalDur}
                id={15}
                format={1}
                Count={assetsNo}
                language={language}
                inputValue={assetCurr.withdrawalDur}
                colorDiv={"red"}
                handleUpdateInput={this.handleUpdateInput}
              />
            </div>
          )}
          {/*  <svg
          className="iconMore"
          onClick={this.handleClickGridButton}
          style={{ top: "140px" }}
          xmlns="http://www.w3.org/2000/svg"
          width="24"s
          height="24"
          viewBox="0 0 24 24"
        >
          <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
        </svg> */}
          {!taxCredit && !disableAll && (
            <GridButton
              className="iconMore"
              handleClickGridButton={this.handleClickGridButton}
              id="gridOn"
              alt="ll"
              src={
                this.state.displaySreadsheet === true
                  ? require("../images/gridOff.png")
                  : require("../images/gridOn.png")
              }
            />
          )}

          <AddRemove
            currentID={id}
            minComps={0}
            //currentIndex={index}
            id={assetID}
            numberComps={assetsNo}
            disabled={this.props.disableAddRemove}
            handleDoAdd={this.handleDoAdd}
            handleDoRemove={this.handleDoRemove}
          />
          {/* {isMobileDevice() && id < assetsNo ? <hr className="ppi2" /> : ""} */}

          {this.state.displaySreadsheet === true && (
            <div
              id="assetGrid"
              style={{
                clear: "both",
                float: "left",
              }} /*    onClick={this.clone2}  */
            >
              {p !== null && (
                <ProjectionGrid1 assetProjection={p} lang={language} />
              )}{" "}
            </div>
          )}
        </div>
      );
    }
  }
}
