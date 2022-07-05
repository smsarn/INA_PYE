import { appletMode } from "../../package.json";
import {
  ASSETS,
  ASSET_TAX,
  ASSET_OWNERSHIP_ACTION,
  INCOMESOURCES,
  LIABILITIES,
  OWNERSHIP,
  GROWTHDIR,
  INCOMENEEDS,
  PROVINCE,
  APPLET_INA,
  OUTPUT_WIDTH_PCT,
  DEFAULT_QUOTE
} from "../definitions/generalDefinitions";

import {
  SEX,
  SMOKING,
  MEMBER,
  DEFAULT_DIVIDEND_TAX_RATE,
  DEFAULT_AVG_TAX_RATE,
  DEFAULT_CLIENT_AGE,
  DEFAULT_SPOUSE_AGE,
  DEFAULT_SPOUSE_SALARY,
  DEFAULT_CLIENT_SALARY,
  DEFAULT_SPOUSE_CPP,
  DEFAULT_CLIENT_CPP,
  DEFAULT_SPOUSE_RETIREMENT,
  DEFAULT_CLIENT_RETIREMENT,
  DEFAULT_PROVINCE,
  DEFAULT_INFLATION,
  DEFAULT_INVESTMENT,
  DEFAULT_NEED_PERCENT1,
  DEFAULT_NEED_PERCENT2,
  QUOTE_CLIENT,
  QUOTE_SPOUSE,
  DEFAULT_RRIF_AGE,
  appSiteAPI,
  DISPLAY_RETIREMENT,
  DISPLAY_LIFEEXP,
  DISPLAY_ENDAGE,
  DISPLAY_LIFEEXP_PLUS_3,
  ORPHAN_AGE_QC,
  ORPHAN_AGE_NON_QC,
  MAX_ORPHAN_DUR_QC,
  MAX_ORPHAN_DUR_NON_QC,
  UNIVERSITY_START_AGE,
  UNIVERSITY_END_AGE,
  DISPLAY_PRESENTATION,
} from "../definitions/generalDefinitions";
import { versionDetails, getDefaultImages } from "../utils/helper";
import {loadDefaultCase} from "../data/dataExchange";


export function createDefaultAsset(id) {
  let asset = {
    id: id,
    assetTypeKey: ASSETS.PERSONAL_RESIDENCE.Key,
    description: "",
    ownerKey: appletMode==="EP" ?ASSET_OWNERSHIP_ACTION.CLIENT_ROLLOVER.Key:ASSET_OWNERSHIP_ACTION.JOINT.Key,
    currValue: 0,
    assetTaxTypeKey: ASSET_TAX.NON_TAXABLE.Key,
    growth: 0,
    DisposeYr: 99,
    DisposeDur: 1,
    ACB: 0,
    smallBusinessCapGainExemption: 0,
    contributionAmt: 0,
    contributionStartYr: 0,
    contributionDur: 0,
    withdrawalAmt: 0,
    withdrawalStartYr: 1,
    withdrawalDur: 0,
    incomeRate: 0,
    RRIFStartAge: DEFAULT_RRIF_AGE,
    projection: null,
  };
  return asset;
}

export function copyFromAnotherAsset(anotherAsset) {
  return JSON.parse(JSON.stringify(anotherAsset));
}

export function copyFromAnotherObject(sourceObject) {
  return JSON.parse(JSON.stringify(sourceObject));
}
export function createDefaultClient(id) {
  const defaultClient1 = {
    id: 1,
    Age: DEFAULT_CLIENT_AGE,
    sexKey: SEX.MALE.Key, //["en"].Values[0],
    smokerKey: SMOKING.NON_SMOKER.Key,
    Income: DEFAULT_CLIENT_SALARY,
    avgTaxRate: DEFAULT_AVG_TAX_RATE,
    //  member: MEMBER.CLIENT.value["en"],
    memberKey: MEMBER.CLIENT.Key,
    retirementAge: DEFAULT_CLIENT_RETIREMENT,
    Eligibility: DEFAULT_CLIENT_CPP,
    Name: "",
  };
  const defaultClient2 = {
    id: 2,
    Age: DEFAULT_SPOUSE_AGE,
    //Sex: SEX["en"].Values[1],
    sexKey: SEX.FEMALE.Key, //["en"].Values[0],
    smokerKey: SMOKING.NON_SMOKER.Key,
    Income: DEFAULT_SPOUSE_SALARY,
    avgTaxRate: DEFAULT_AVG_TAX_RATE,
    //member: MEMBER.SPOUSE.value["en"],
    memberKey: MEMBER.SPOUSE.Key,
    retirementAge: DEFAULT_SPOUSE_RETIREMENT,
    Eligibility: DEFAULT_SPOUSE_CPP,
    Name: "",
  };
  const child = {
    id: id, //this.state.dataInput.clientsNo,
    Age: 1,
    sexKey: SEX.MALE.Key,
    smokerKey: SMOKING.NON_SMOKER.Key,
    Income: 0,
    avgTaxRate: 0.0,
    memberKey: MEMBER.CHILD.Key,
    retirementAge: 65,
    Eligibility: 0,
    Name: "",
  };
  if (id === 1) return defaultClient1;
  else if (id === 2) return defaultClient2;
  else return child;
}

export function createDefaultSource(id) {
  const defaultSource = {
    id: id,
    //Type: INCOMESOURCES.SURVIVORS_INCOME.value["en"],
    sourceTypeKey: INCOMESOURCES.SURVIVORS_INCOME.Key,
    amount: DEFAULT_SPOUSE_SALARY,
    startYear: 0,
    duration: DEFAULT_SPOUSE_RETIREMENT - DEFAULT_SPOUSE_AGE,
    ownerID: 2,
    taxRate: DEFAULT_AVG_TAX_RATE,
    growthRate: DEFAULT_INFLATION,
  };
  return defaultSource;
}

export function createDefaultLiab(id) {
  const defaultLiab = {
    id: id,
    //Type: LIABILITIES.LAST_EXPENSES.value["en"],
    liabTypeKey: LIABILITIES.PROBATE.Key,//.LAST_EXPENSES.Key,
    description: "",
    ownerKey: OWNERSHIP.CLIENT.Key,
    currValue: 0,
    //growthDir: GROWTHDIR["en"].Values[0], //increases
    growthDirKey: GROWTHDIR.GROWS.Key, //increases
    growth: 0,
    repay: 0,
    exposureDur: 99,
    assetTaxLiabID: 0,
    assetTaxLiabProj: [],
  };
  return defaultLiab;
}

export function createDefaultNeed(id) {
  const defaultNeed1 = {
    id: 1,
    needTypeKey: INCOMENEEDS.PERCET_OF_INCOME.Key,
    Percent: DEFAULT_NEED_PERCENT1,
    amount:
      (DEFAULT_NEED_PERCENT1 *
        (DEFAULT_SPOUSE_SALARY + DEFAULT_CLIENT_SALARY) *
        (1 - DEFAULT_AVG_TAX_RATE / 100)) /
      100,
    startYear: 0,
    duration: DEFAULT_SPOUSE_RETIREMENT - DEFAULT_SPOUSE_AGE,
  };
  const defaultNeed2 = {
    id: id,
    needTypeKey: INCOMENEEDS.PERCET_OF_INCOME.Key,
    Percent: DEFAULT_NEED_PERCENT2,
    amount:
      (DEFAULT_NEED_PERCENT2 *
        (DEFAULT_SPOUSE_SALARY + DEFAULT_CLIENT_SALARY) *
        (1 - DEFAULT_AVG_TAX_RATE / 100)) /
      100,
    startYear: DEFAULT_SPOUSE_RETIREMENT - DEFAULT_SPOUSE_AGE,
    duration: 100,
  };
  if (id === 1) return defaultNeed1;
  else return defaultNeed2;
}

export function createDefaultPres(id, tax) {
  const images=getDefaultImages()
  const defaultPres = {
    id: id,
    provinceKey: PROVINCE.BC.Key,
    invRate: DEFAULT_INVESTMENT,
    inflation: DEFAULT_INFLATION,
    taxRate: tax,
    designedFor: "",
    designedBy: "",
    valuationDate: new Date(),
    presentationDate: new Date(),
    notes: "",
    version: versionDetails().version,
    periodOption: APPLET_INA ? DISPLAY_RETIREMENT : DISPLAY_ENDAGE,
    language: global.langFr? "fr" : "en",// "en",
    resultsOption: DISPLAY_PRESENTATION,
    adviserLogo: images.adviserLogo,// {image:null, left: 0,size: OUTPUT_WIDTH_PCT, allPages: false, top:true, showDetails:false},
    appletImage:images.appletImage ,//{image:APPLET_INA? require("../images/INA.png"):require("../images/estate.protection.applet.cover.graphic.png"), left: 0,size: OUTPUT_WIDTH_PCT, allPages: false, top:true, showDetails:false},
    overwriteProbate: false,
    contribsGrowByInflation: false,
    withdsGrowByInflation: false,
  };
  return defaultPres;
}


export function getDefaultData(){
  let dataInput;
 
  if(localStorage.getItem(DEFAULT_QUOTE)===null)
  {
    dataInput= getDefaultCase()

    }
    else
{
  try {
    dataInput=loadDefaultCase()  
  } catch (error) {
    dataInput= getDefaultCase()
  }  
  
}
return dataInput;
}

function getDefaultCase()
{
  let dataInput;
  let defaultClients = [];
defaultClients.push(createDefaultClient(1));
if (APPLET_INA) defaultClients.push(createDefaultClient(2));
let defaultAssets = [];
defaultAssets.push(createDefaultAsset(1));
let defaultSources =[]
if (APPLET_INA) defaultSources.push(createDefaultSource(1));
 
const defaultLiab = [createDefaultLiab(1)];
let defaultNeeds = [];
defaultNeeds.push(createDefaultNeed(1));
defaultNeeds.push(createDefaultNeed(2));
const defaultPresentation = [createDefaultPres(1, 0)];

// build state with defaults
dataInput={      
    Clients: defaultClients, //, clientsNo: defaultClients.length },
    Assets: defaultAssets, //, assetsNo: defaultAsset.length },
    Liabilitys: defaultLiab, //, liabilitysNo: 1 },
    Sources: defaultSources, //, sourcesNo: 1 },
    Needs: defaultNeeds, //,  needsNo: 2},
    Presentations: defaultPresentation, //, presentationsNo: 1 },
  }
  return dataInput;
}