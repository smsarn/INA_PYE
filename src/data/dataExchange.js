import { name, version } from "../../package.json";
import {
  GROWTHDIR,
  MONTHS,
  ASSETS,
  ASSET_OWNERSHIP_ACTION,
  ASSET_TAX,
  INCOMESOURCES,
  OWNERSHIP,
  SEX,
  SMOKING,
  MEMBER,
  LIABILITIES,
  INCOMENEEDS,
  PROVINCE,
  QUOTE_SPOUSE,
  QUOTE_CLIENT,
  DEFAULT_QUOTE,
  OUTPUT_WIDTH_PCT,
  APPLET_EP,
  MAX_ORPHAN_DUR_QC,
  MAX_ORPHAN_DUR_NON_QC,
} from "../definitions/generalDefinitions";
import {
  cleanFormat,
  formatMoney,
  getListItemNameFromKey,
  isSingleFamily,
  getDefaultImages,
  getListItemKeyFromName,
} from "../utils/helper";

import { versionDetails, getAfterTaxTotalIncome } from "../utils/helper";
import { appletMode } from "../../package.json";
import { element } from "prop-types";

export function setUIDataToAPI(dataInput, outputInsuranceNeed) {
// console.log(dataInput)
  let age = dataInput.Clients[0].Age;
  const taxRate =
    dataInput.length > 1
      ? dataInput.Clients[QUOTE_SPOUSE].avgTaxRate / 100
      : dataInput.Clients[QUOTE_CLIENT].avgTaxRate / 100;
  if (dataInput.length > 1 && dataInput.Clients[QUOTE_SPOUSE].Age < age)
    age = dataInput.Clients[QUOTE_SPOUSE].Age;
  let dataLives = setLives(dataInput);
  let dataAssets = setAssets(dataInput);
  let dataLiabs = setLiabs(dataInput);
  let dataSources = setSources(dataInput, taxRate);
  let dataEstateContings = setEstateContings();
  let dataIncomeNeeds = setIncomeNeeds(dataInput);
  let dataRates = setRates(dataInput);
  let dataProjSettings = setProjSettings(age, dataInput, parseFloat(cleanFormat(outputInsuranceNeed, dataInput.Presentations[0].language)));
  let dataNA = {
    lives: dataLives,
    assets: dataAssets,
    liabilities: dataLiabs,
    personalIncomeSources: dataSources,
    estateContingiencies: dataEstateContings,
    incomeNeeds: dataIncomeNeeds,
    ratesPack: dataRates,
    projectionSettings: dataProjSettings,
    //liabilities: null,
    //personalIncomeSources: null,
    //estateContingiencies:  null,
    //incomeNeeds:  null
    //ratesPack:  null,
    //projectionSettings:  null
  };
 // console.log(dataNA)
  return dataNA;
}

function setLives(dataInput) {
  let dataE = [];
  let i;
  // for calc purposes
  for (i = 0; i < dataInput.Clients.length; i++) {
    dataE.push({
      Age: dataInput.Clients[i].Age,
      Sex: dataInput.Clients[i].sexKey, // === SEX.FEMALE.Key ? SEX.FEMALE : SEX.MALE,
      Smk:
        dataInput.Clients[i].smokerKey === SMOKING.SMOKER.Key
          ? "S_STD"
          : "NS_STD", // 2 and 5 : this MCC stuff with 5 leveles elite ...
      Rating: 100,
      //		member: (i===1 && dataInput.Clients[i].memberKey===MEMBER.DEPENDENT_ADULT.Key)? MEMBER.SPOUSE.Key: //MEMBER["en"].Values[MEMBER[lang].Values.indexOf(dataInput.Clients[i].member)],
      //					dataInput.Clients[i].memberKey,//Object.values(MEMBER).filter(obj => obj.Key=== dataInput.Clients[i].memberKey)[0],//.value.en,
      member: dataInput.Clients[i].memberKey,
      salary: dataInput.Clients[i].Income,
      CPPeligibility: dataInput.Clients[i].Eligibility / 100,
      retirementAge: dataInput.Clients[i].retirementAge,
      avgTaxRate: dataInput.Clients[i].avgTaxRate / 100,
      isQC: dataInput.Presentations[0].provinceKey === "QC" ? true : false,
      Name: dataInput.Clients[i].Name,
    });
  }
  return dataE;
}

function setTaxAPIMethod(TaxKey, assetKey) {
  // based on API enum
  /* public enum taxTreatments
        {
            NonTaxable=0,
            CapitalGainIncome, 1
            CapitalGainAnnual, 2
            Registered, 3
            FullyTaxable, 4
            CapitalGainDividend,  5
            Dividend, 6
            RRIF, 7
            LifeInsurance, 8
            Cash, 9
            InterestIncome, 10
            CapitalGainQSmallBusiness, 11
        } */
  // from
  /* 'Non-taxable',	
			"Capital Gains Deferred",
			"Capital Gains Annual",
			'Registered',	
			'Fully Taxable',	
			'Dividend'	 */
  //console.log(Tax,Type,)

  let taxMethodIndex = 0;

  if (TaxKey === ASSET_TAX.NON_TAXABLE.Key) taxMethodIndex = 0;
  //NonTaxable
  else if (TaxKey === ASSET_TAX.CAPITAL_GAINS_DEFERRED.Key) {
    if (assetKey === ASSETS.SMALL_BUSINESS_SHARES.Key)
      //value[lang])
      taxMethodIndex = 11;
    // CapitalGainQSmallBusiness, 11
    else taxMethodIndex = 1; // CapitalGainIncome, 1
  } else if (TaxKey === ASSET_TAX.CAPITAL_GAINS_ANNUAL.Key) taxMethodIndex = 2;
  //  CapitalGainAnnual
  else if (TaxKey === ASSET_TAX.FULLY_TAXABLE.Key) {
    if (assetKey === ASSETS.INTEREST_BEARING.Key)
      //value[lang])
      taxMethodIndex = 10;
    //InterestIncome, 10
    else taxMethodIndex = 4; // FullyTaxable, 4
  } else if (TaxKey === ASSET_TAX.REGISTERED.Key) taxMethodIndex = 3;
  //Registered, 3
  else if (TaxKey === ASSET_TAX.DIVIDEND.Key) taxMethodIndex = 6; //  Dividend, 6

  // console.log(taxMethodIndex)
  return taxMethodIndex;
}

function setAssets(dataInput) {
  let dataE = [];
  let i;
  for (i = 0; i < dataInput.Assets.length; i++) {
    const asset = dataInput.Assets[i];
    const assetDesc = asset.description;
    const assetTypeKey =
      asset.assetTypeKey; /*
      dataInput,
      asset.assetTypeKey,
      asset.assetTaxTypeKey
    ); */ // don't add survivor's insurance do in API // const nonClientInsurance=!(asset.assetTypeKey===ASSETS.LIFE_INSURANCE.Key && (asset.ownerKey===ASSET_OWNERSHIP_ACTION.CLIENT_LIQUIDATE.Key || element.ownerKey===ASSET_OWNERSHIP_ACTION.CLIENT_ROLLOVER.Key))
    /*    console.log(asset) */ dataE.push({
      name: Object.values(ASSETS).filter((obj) => obj.Key === assetTypeKey)[0]
        .value.en,
      desc: assetDesc,
      ID: Object.values(ASSETS).filter((obj) => obj.Key === assetTypeKey)[0].ID,
      //taxMethod: setTaxAPIMethod( asset.assetTaxTypeKey,asset.assetTypeKey),
      taxMethod: asset.assetTaxTypeKey,
      //Object.values(ASSET_TAX).filter(obj => obj.Key=== asset.assetTaxTypeKey)[0].value.en,
      owner: Object.values(ASSET_OWNERSHIP_ACTION).filter(
        (obj) => obj.Key === asset.ownerKey
      )[0].ID, // enums in API is same 0-4
      ACB: asset.ACB,
      smallBusinessCapGainExemption: asset.smallBusinessCapGainExemption,
      dispositionYr:
        asset.assetTaxTypeKey === ASSET_TAX.REGISTERED.Key &&
        asset.ownerKey !== ASSET_OWNERSHIP_ACTION.CLIENT_LIQUIDATE.Key
          ? 99
          : asset.DisposeYr,
      dispositionDur: asset.DisposeDur === 0 ? 1 : asset.DisposeDur,
      dispositionYrUlt: 100,
      currValue: asset.currValue,
      annualGrowth: asset.growth / 100,
      incomeRate: asset.incomeRate / 100,
      contributionAmt: asset.contributionAmt,
      contributionStartYr: asset.contributionStartYr,
      contributionDur: asset.contributionDur,
      withdrawalAmt: asset.withdrawalAmt,
      withdrawalStartYr: asset.withdrawalStartYr,
      withdrawalDur: asset.withdrawalDur,
      RRIFStartAge: asset.RRIFStartAge,
    });
  }
  return dataE;
}

function setLiabs(dataInput) {
  let dataE = [];
  let i;
  for (i = 0; i < dataInput.Liabilitys.length; i++) {
    const growth =
      /*  GROWTHDIR[dataInput.Presentations[0].language].Values.indexOf(
        dataInput.Liabilitys[i].growthDir
      ) */

      dataInput.Liabilitys[i].growthDirKey === GROWTHDIR.GROWS.Key
        ? dataInput.Liabilitys[i].growth / 100
        : -dataInput.Liabilitys[i].growth / 100;
    const liabTypeKey = dataInput.Liabilitys[i].liabTypeKey;
    const liabDesc = dataInput.Liabilitys[i].description;
  
    dataE.push({
      name: Object.values(LIABILITIES).filter(
        (obj) => obj.Key === liabTypeKey
      )[0].value.en,
      ID: Object.values(LIABILITIES).filter((obj) => obj.Key === liabTypeKey)[0]
        .ID,
      owner: dataInput.Liabilitys[i].ownerKey, // OWNERSHIP["en"].Values[OWNERSHIP[lang].Values.indexOf(dataInput.Liabilitys[i].Owner)],
      desc: liabDesc,
      currValue: dataInput.Liabilitys[i].currValue,
      annualGrowth: growth,
      exposureDur: dataInput.Liabilitys[i].exposureDur,
      annualRepay: dataInput.Liabilitys[i].repay,
    });
  }
  return dataE;
}

function setSources(dataInput, avgTaxRate) {
  let dataE = [];
  let i;
  for (i = 0; i < dataInput.Sources.length; i++) {
    // find source owner avgtaxrate
    let avgTaxRate;
    let salaryOwner = dataInput.Clients.filter((item) => {
      return item.id === dataInput.Sources[i].ownerID;
    });
    if (salaryOwner !== undefined && salaryOwner.length > 0)
      avgTaxRate = salaryOwner[0].avgTaxRate / 100;

    const sourceTypeKey = dataInput.Sources[i].sourceTypeKey;
    // gov is taken care of in API only needs elig %
    //if (dataInput.Sources[i].Type !== INCOMESOURCES[lang].Values[1] && dataInput.Sources[i].Type !== INCOMESOURCES[lang].Values[2] && dataInput.Sources[i].Type !== INCOMESOURCES[lang].Values[3]) {
    if (
      !(
        dataInput.Sources[i].sourceTypeKey ===
          INCOMESOURCES.GOV_SURVIVORS_PENSION.Key ||
        dataInput.Sources[i].sourceTypeKey ===
          INCOMESOURCES.GOV_ORPHANS_BENEFIT.Key ||
        dataInput.Sources[i].sourceTypeKey ===
          INCOMESOURCES.GOV_DEATH_BENEFIT.Key
      )
    ) {
      dataE.push({
        ID: Object.values(INCOMESOURCES).filter(
          (obj) => obj.Key === sourceTypeKey
        )[0].ID,
        name: Object.values(INCOMESOURCES).filter(
          (obj) => obj.Key === sourceTypeKey
        )[0].value.en,
        amount: dataInput.Sources[i].amount,
        startYear: dataInput.Sources[i].startYear,
        duration: dataInput.Sources[i].duration,
        annualGrowth: dataInput.Presentations[0].inflation / 100,
        taxRate:
          sourceTypeKey === INCOMESOURCES.DIVIDEND_INCOME.Key
            ? dataInput.Sources[i].taxRate / 100
            : avgTaxRate,
        ownerID: dataInput.Sources[i].ownerID,
      });
    }
  }
  return dataE;
}

function setEstateContings() {
  let dataE = [];
  return dataE;
}

function setIncomeNeeds(dataInput) {
  let dataItems = [];
  let i;
  for (i = 0; i < dataInput.Needs.length; i++) {
    const needTypeKey = dataInput.Needs[i].needTypeKey;
    dataItems.push({
      ID: Object.values(INCOMENEEDS).filter((obj) => obj.Key === needTypeKey)[0]
        .ID,
      name: Object.values(INCOMENEEDS).filter(
        (obj) => obj.Key === needTypeKey
      )[0].value.en,

      amount: dataInput.Needs[i].amount,
      incomePercent: dataInput.Needs[i].Percent / 100,
      startYear: dataInput.Needs[i].startYear,
      duration: dataInput.Needs[i].duration,
      annualGrowth: dataInput.Presentations[0].inflation / 100,
    });
  }
  let dataE = {
    incomePercentAfterDeath: 0.6,
    incomeNeedItems: dataItems,
    upToChildrenOutYrs: 0,
    childrenOutToRetirementYrs: 0,
    retirementToEndYrs: 0,
  };

  return dataE;
}

function setProjSettings(age, dataInput, outputInsuranceNeed) {
  var tempDate = new Date();
  var date =
    tempDate.getFullYear() +
    "-" +
    (tempDate.getMonth() + 1) +
    "-" +
    tempDate.getDate();

  let dataE = {
    deathYear: 0,
    deathOf: 0,
    startYear: 1,
    endYear: 100 - age + 1,
    province: dataInput.Presentations[0].provinceKey,
    language: dataInput.Presentations[0].language === "en" ? 0 : 1,
    returnType: 4,
    projectEndOption: dataInput.Presentations[0].periodOption, //toRetirement ? 0 : 1,
    clientsName1: dataInput.Presentations[0].designedFor,
    agentName: dataInput.Presentations[0].designedBy,
    valuationDate: date,
    notes: dataInput.Presentations[0].notes,
    version: versionDetails().version,
    caller: appletMode,
    insuranceAmt: outputInsuranceNeed,
    /*   imageLogo: dataInput.Presentations[0].adviserLogo.image,
    imageLogoSize:dataInput.Presentations[0].adviserLogo.size,
    imageLogoLeft:dataInput.Presentations[0].adviserLogo.left,
    imageLogoAllPages: dataInput.Presentations[0].adviserLogo.allPages,
    imageApplet: dataInput.Presentations[0].adviserLogo.imageApplet */
  };
  return dataE;
}

function setRates(dataInput) {
  // console.log(dataInput.Presentations[0].taxRate / 100)
  let dataE = {
    investmentRate: dataInput.Presentations[0].invRate / 100,
    taxRate: dataInput.Presentations[0].taxRate / 100,
    dividendTaxRate: 0.33,
    capitalGainsInclusion: 0.5,
    inflationRate: dataInput.Presentations[0].inflation / 100,
  };

  return dataE;
}

export function loadSavedDataToUI(savedJSon, dataInput) {
  //console.log(savedJSon)
  dataInput.Presentations[0].language =
    savedJSon.projectionSettings.language === 0 ? "en" : "fr";
  let i;
  dataInput.Clients = [];
  dataInput.clientsNo = savedJSon.lives.length;
  //console.log(dataInput.Clients)

  let smk;
  for (i = 0; i < savedJSon.lives.length; i++) {
    smk = savedJSon.lives[i].Smk <= 2 ? "NS_STD" : "S_STD";
    const memberKey = Object.values(MEMBER).filter(
      (obj) => obj.ID === savedJSon.lives[i].member
    )[0].Key;
    let addLife = true;

    if (
      APPLET_EP &&
      !(memberKey === MEMBER.CLIENT.Key || memberKey === MEMBER.SPOUSE.Key)
    )
      addLife = false;

    if (addLife) {
      dataInput.Clients.push({
        id: i + 1,
        Age: savedJSon.lives[i].Age,
        //savedJSon.lives[i].Sex===0? SEX.MALE.Key : SEX.FEMALE.Key,
        sexKey: Object.values(SEX).filter(
          (obj) => obj.ID === savedJSon.lives[i].Sex
        )[0].Key,
        smokerKey:
          smk === "NS_STD" ? SMOKING.NON_SMOKER.Key : SMOKING.SMOKER.Key,
        Income: savedJSon.lives[i].salary,
        avgTaxRate: 100 * savedJSon.lives[i].avgTaxRate,
        //member: MEMBER[data.lang].Values[savedJSon.lives[i].member],
        //MEMBER.[savedJSon.lives[i].member].value[data.lang],
        memberKey: memberKey,
        retirementAge: savedJSon.lives[i].retirementAge,
        Eligibility: 100 * savedJSon.lives[i].CPPeligibility,
        Name: savedJSon.lives[i].Name,
      });
    }
  }

  //console.log(dataInput.Clients)

  dataInput.Assets = [];
  dataInput.assetsNo = savedJSon.assets.length;

  for (i = 0; i < savedJSon.assets.length; i++) {
    // console.log((savedJSon.assets[i].owner),Object.values(ASSET_OWNERSHIP_ACTION).filter(obj => obj.ID=== savedJSon.assets[i].owner)[0].Key)
    // console.log(Object.values(ASSET_OWNERSHIP_ACTION).filter(obj => obj.ID=== savedJSon.assets[i].owner)[0].Key, Object.values(ASSET_TAX).filter(obj => obj.ID=== savedJSon.assets[i].taxMethod)[0].Key)
    // as of ver 1.0.7 personal residence became principal residence

    if (savedJSon.assets[i].name === ASSETS.PERSONAL_RESIDENCE.value.oldName)
      savedJSon.assets[i].name = ASSETS.PERSONAL_RESIDENCE.value.en;

    let ownerKey = Object.values(ASSET_OWNERSHIP_ACTION).filter(
      (obj) => obj.ID === savedJSon.assets[i].owner
    )[0].Key;

    if (APPLET_EP && savedJSon.assets[i].name === ASSETS.RRSP_RRIF.value.en) {
      if (savedJSon.lives.length === 1)
        ownerKey = ASSET_OWNERSHIP_ACTION.CLIENT.Key;
      else {
        if (ownerKey !== ASSET_OWNERSHIP_ACTION.CLIENT.Key)
          ownerKey = ASSET_OWNERSHIP_ACTION.SPOUSE.Key;
      }
    }

    dataInput.Assets.push({
      id: i + 1,
      //assetTypeKey: Object.values(ASSETS).filter(obj => obj.ID=== savedJSon.assets[i].ID)[0].Key,
      assetTypeKey: findMatchingKey(
        Object.values(ASSETS),
        savedJSon.assets[i].name
      ),
      description: savedJSon.assets[i].desc,
      ownerKey: ownerKey,
      assetTaxTypeKey: Object.values(ASSET_TAX).filter(
        (obj) => obj.ID === savedJSon.assets[i].taxMethod
      )[0].Key,
      currValue: savedJSon.assets[i].currValue,
      growth: savedJSon.assets[i].annualGrowth * 100,
      DisposeYr: savedJSon.assets[i].dispositionYr,
      DisposeDur: savedJSon.assets[i].dispositionDur,
      ACB: savedJSon.assets[i].ACB,
      smallBusinessCapGainExemption:
        savedJSon.assets[i].smallBusinessCapGainExemption,
      contributionAmt: savedJSon.assets[i].contributionAmt,
      contributionStartYr: savedJSon.assets[i].contributionStartYr,
      contributionDur: savedJSon.assets[i].contributionDur,
      withdrawalAmt: savedJSon.assets[i].withdrawalAmt,
      withdrawalStartYr: savedJSon.assets[i].withdrawalStartYr,
      withdrawalDur: savedJSon.assets[i].withdrawalDur,
      incomeRate: savedJSon.assets[i].incomeRate * 100,
      RRIFStartAge: savedJSon.assets[i].RRIFStartAge,
    });
  }

  dataInput.Liabilitys = [];
  dataInput.liabilitysNo = savedJSon.liabilities.length;

  for (i = 0; i < savedJSon.liabilities.length; i++) {
    // console.log(savedJSon.liabilities[i])
    // console.log(findMatchingKey(Object.values(LIABILITIES),savedJSon.liabilities[i].name))
    dataInput.Liabilitys.push({
      id: i + 1,
      //liabTypeKey: Object.values(LIABILITIES).filter(obj => obj.ID=== savedJSon.liabilities[i].ID)[0].Key,
      liabTypeKey: findMatchingKey(
        Object.values(LIABILITIES),
        savedJSon.liabilities[i].name
      ),
      description: savedJSon.liabilities[i].desc,
   
      ownerKey: OWNERSHIP.CLIENT.Key,
      currValue: savedJSon.liabilities[i].currValue,
      /* growthDir:
        savedJSon.liabilities[i].annualGrowth >= 0
          ? GROWTHDIR[dataInput.Presentations[0].language].Values[0]
          : GROWTHDIR[dataInput.Presentations[0].language].Values[1], */
      growthDirKey:
        savedJSon.liabilities[i].annualGrowth >= 0
          ? GROWTHDIR.GROWS.Key
          : GROWTHDIR.REDUCES.Key,
      growth: Math.abs(savedJSon.liabilities[i].annualGrowth * 100),
      exposureDur: savedJSon.liabilities[i].exposureDur,
      assetTaxLiabID: 0,
      repay: savedJSon.liabilities[i].annualRepay,
    });
  }

  dataInput.Sources = [];

  dataInput.sourcesNo = savedJSon.personalIncomeSources.length;

  for (i = 0; i < savedJSon.personalIncomeSources.length; i++) {
    dataInput.Sources.push({
      id: i + 1,
      //sourceTypeKey: Object.values(INCOMESOURCES).filter(obj => obj.ID=== savedJSon.personalIncomeSources[i].ID)[0].Key,
      //sourceTypeKey: Object.values(INCOMESOURCES).filter(obj => obj.value.en=== savedJSon.personalIncomeSources[i].Name)[0].Key,
      sourceTypeKey: findMatchingKey(
        Object.values(INCOMESOURCES),
        savedJSon.personalIncomeSources[i].Name
      ),

      amount: savedJSon.personalIncomeSources[i].amount,
      startYear: savedJSon.personalIncomeSources[i].startYear,
      duration: savedJSon.personalIncomeSources[i].duration,
      taxRate: savedJSon.personalIncomeSources[i].taxRate * 100,
      ownerID:
        savedJSon.personalIncomeSources[i].ownerID === undefined ||
        savedJSon.personalIncomeSources[i].ownerID === 0
          ? dataInput.Clients.length > 1
            ? 2
            : 1
          : savedJSon.personalIncomeSources[i].ownerID, // spouse or 1st child
    });
  }

  dataInput.Needs = [];

  //console.log(savedJSon.incomeNeeds.incomeNeedItems.length)

  dataInput.needsNo = savedJSon.incomeNeeds.incomeNeedItems.length;

  for (i = 0; i < savedJSon.incomeNeeds.incomeNeedItems.length; i++) {
    //console.log(i,savedJSon.incomeNeeds.incomeNeedItems[i].amount, Object.values(INCOMENEEDS).filter(obj => obj.ID=== savedJSon.incomeNeeds.incomeNeedItems[i].ID)[0].Key)
    const needKey = findMatchingKey(
      Object.values(INCOMENEEDS),
      savedJSon.incomeNeeds.incomeNeedItems[i].name
    );
    let amt = savedJSon.incomeNeeds.incomeNeedItems[i].amount;
    if (
      needKey === INCOMENEEDS.PERCET_OF_INCOME.Key &&
      dataInput.Clients.length > 1
    )
      // ie not single or EP
      amt = parseInt(
        savedJSon.incomeNeeds.incomeNeedItems[i].incomePercent *
          getAfterTaxTotalIncome(dataInput.Clients, 1)
      );
    dataInput.Needs.push({
      id: i + 1,
      //needTypeKey: Object.values(INCOMENEEDS).filter(obj => obj.ID=== savedJSon.incomeNeeds.incomeNeedItems[i].ID)[0].Key,
      //needTypeKey: Object.values(INCOMENEEDS).filter(obj => obj.value.en=== savedJSon.incomeNeeds.incomeNeedItems[i].name)[0].Key,
      needTypeKey: needKey,

      Percent: savedJSon.incomeNeeds.incomeNeedItems[i].incomePercent * 100,
      amount: amt,
      startYear: savedJSon.incomeNeeds.incomeNeedItems[i].startYear,
      duration: savedJSon.incomeNeeds.incomeNeedItems[i].duration,
    });
  }

  dataInput.Presentations = [];
  dataInput.presentationsNo = 1;

  //for (i = 0; i < savedJSon.liabilities.length; i++) {

  const dataInputDefImages = loadDefaultCase();
  let logo;
  let appletImage;
  /* console.log(dataInputDefImages) */
  if (dataInputDefImages !== undefined && dataInputDefImages !== null) {
    logo = dataInputDefImages.Presentations[0].adviserLogo;
    appletImage = dataInputDefImages.Presentations[0].appletImage;
  } else {
    /* logo={image:null, left: 0,size: 90, allPages: false}
    appletImage={image:null, left: 0,size: 90, allPages: false} */
    const images = getDefaultImages();
    logo = images.adviserLogo; //  {image:null, left: 0,size: OUTPUT_WIDTH_PCT, allPages: false, top:true, showDetails:false}
    appletImage = images.appletImage; //{image:APPLET_INA? require("../images/INA.png"):require("../images/estate.protection.applet.cover.graphic.png"), left: 0,size: OUTPUT_WIDTH_PCT, allPages: false, top:true, showDetails:false}
  }

  dataInput.Presentations.push({
    id: 1,
    provinceKey: Object.values(PROVINCE).filter(
      (obj) => obj.ID === savedJSon.projectionSettings.province
    )[0].Key,
    invRate: savedJSon.ratesPack.investmentRate * 100,
    inflation: savedJSon.ratesPack.inflationRate * 100,
    taxRate: savedJSon.ratesPack.taxRate * 100,
    designedFor: savedJSon.projectionSettings.clientsName1,
    designedBy: savedJSon.projectionSettings.agentName,
    valuationDate: savedJSon.projectionSettings.valuationDate,
    notes: savedJSon.projectionSettings.notes,
    // version: savedJSon.projectionSettings.version, keep curr app version as opposed to saved ver
    language: savedJSon.projectionSettings.language === 0 ? "en" : "fr",
    periodOption: savedJSon.projectionSettings.projectEndOption, //=== DISPLAY_RETIREMENT add this for saved files

    adviserLogo: logo,
    appletImage: appletImage,
    //imageApplet:savedJSon.projectionSettings.imageApplet,
  });

  return dataInput;
}

export function loadDefaultCase() {
  let storageKey = DEFAULT_QUOTE;

  const objJSONData = JSON.parse(localStorage.getItem(storageKey));
  // make sure details dont show
  //objJSONData.Presentations[0].adviserLogo.showDetails=false
  return objJSONData;
}

export function getOutputValues(data) {
  let output = {
    designedFor: "",
    designedBy: "",
    dateApplet: "",
    province: "",
    clients: [],
    assets: [],
    liabilities: [],
    source: [],
    totalLiab: 0,
    Income: 0,
    Income2: 0,
    survivorATaxIncome: 0,
    percentNeed1: 0,
    percentNeed2: [],
    govDB: 0,
    totalAsset: 0,
    totalDisposeAsset: 0,
    totalLiab: 0,
    totalSource: 0,
    totalSource2: 0,
    percentNeed1: 0,
    totalSource: 0,
    totalSourceATax: 0,
    totalSource2ATax: 0,
    infRate: 0,
    invRate: 0,
    insNeedLE: 0,
    insNeedRet: 0,
    insNeedYgChild25: 0,
    insNeedYgChild18: 0,
    ygChild: 100,
    hasChild: false,
  };

  let dateObj = new Date();
  let month = dateObj.getUTCMonth() + 1; //months from 1-12
  let day = dateObj.getUTCDate();
  let year = dateObj.getUTCFullYear();
  const input = data.dataInput;
  const singleFamily = isSingleFamily(input.Clients);

  output.language = input.Presentations[0].language;
  output.dateApplet =
    output.language === "en"
      ? MONTHS[output.language][month - 1] + " " + day + ", " + year
      : day + " " + MONTHS[output.language][month - 1] + " " + year;
  //output.language === "en"
  //	? months[month - 1] + " " + day + ", " + year
  //	: day + " " + monthsFr[month - 1] + " " + year;
  output.designedFor = input.Presentations[0].designedFor;
  output.designedBy = input.Presentations[0].designedBy;
  output.province = getListItemNameFromKey(
    //input.Presentations[0].Province
    PROVINCE,
    input.Presentations[0].provinceKey,
    output.language
  );

  //const retAge = input.Clients[0].retirementAge;
  //const retAge2 = input.Clients[1].retirementAge;
  output.Income = input.Clients[QUOTE_CLIENT].Income;
  output.Income2 =
    input.Clients.length > 1 ? input.Clients[QUOTE_SPOUSE].Income : 0;

  output.invRate = input.Presentations[0].invRate;
  output.infRate = input.Presentations[0].inflation;
 
  output.insNeedRet = parseFloat(cleanFormat(data.insuranceNeedRet, output.language));
  output.insNeedLE = parseFloat(cleanFormat(data.insuranceNeedLE, output.language));

  output.ygChild = 100;
  output.hasChild = false;
  const childMember = MEMBER.CHILD.Key;
  let Children = input.Clients.filter(function (item) {
    return item.memberKey === childMember;
  });
  if (Children.length > 0) {
    output.hasChild = true;
    Children.forEach((element) => {
      if (element.Age <= output.ygChild) output.ygChild = element.Age;
    });
  }

  const provinceKey = getListItemKeyFromName(PROVINCE, output.province);
  const maxDur =
    provinceKey === "QC" ? MAX_ORPHAN_DUR_QC : MAX_ORPHAN_DUR_NON_QC;
  output.youngestChildEndAge = maxDur;
  if (output.hasChild)
    output.youngestChildEndAge = Math.min(
      maxDur,
      input.Clients.filter((item) => {
        return item.Age === output.ygChild;
      })[0].retirementAge
    );

  //console.log(data);
  output.insNeedYgChild25 = 0;
  output.insNeedYgChild18 = 0;
  for (
    let i = 0;
    i < output.youngestChildEndAge - output.ygChild;
    output.insNeedYgChild25 +=
      data.dataShortfall[i++] / Math.pow(1 + output.invRate / 100, i - 1)
  );

  for (
    let i = 0;
    i < 18 - output.ygChild;
    output.insNeedYgChild18 +=
      data.dataShortfall[i++] / Math.pow(1 + output.invRate / 100, i - 1)
  );

  output.insNeedYgChild25 =
    output.insNeedYgChild25 < 0 ? 0 : output.insNeedYgChild25;
  output.insNeedYgChild18 =
    output.insNeedYgChild18 < 0 ? 0 : output.insNeedYgChild18;

  /* let insNeedYgChild18=cleanFormat(insNeedRet)*((Math.pow(1+invRate/100,18-ygChild))/(Math.pow(1+invRate/100,retAge2-input.Clients[1].Age)));
			 let insNeedYgChild25=cleanFormat(insNeedRet)*((Math.pow(1+invRate/100,25-ygChild))/(Math.pow(1+invRate/100,retAge2-input.Clients[1].Age)));*/

  output.liabilities = [];

  Object.values(LIABILITIES).forEach((element) => {
    if (element.order > 0)
      output.liabilities.push({
        name: element.value[output.language],
        value: 0,
      });
  });

  /* LIABILITIES[output.language].Values.forEach(function(element) {
		  liabilities.push({ name: element, value: 0 });
		}); */
  /* 		output.incomeNeeds = [];
		INCOMENEEDS[output.language].Values.forEach(function(element) {
		  output.incomeNeeds.push({ name: element, value: 0 });
		});
 */

  output.incomeNeeds = [];
  Object.values(INCOMENEEDS).forEach((element) => {
    output.incomeNeeds.push({ name: element.value[output.language], value: 0 });
  });

  // populate with what was assigned'
  output.totalLiab = 0;
  output.totalLiabExcludeDeathRelated = 0;
  input.Liabilitys.forEach((element) => {
    //let pos = liabilities.findIndex(i => i.name === element.Type);
    /* let pos = liabilities.indexOf(
			liabilities.filter(i => i.name === element.Type)[0]
		  ); */
    let pos = output.liabilities.indexOf(
      output.liabilities.filter(
        (i) =>
          i.name ===
          getListItemNameFromKey(
            LIABILITIES,
            element.liabTypeKey,
            output.language
          )
      )[0]
    );
    output.totalLiab += element.currValue;

    output.totalLiabExcludeDeathRelated +=
      element.liabTypeKey === LIABILITIES.LAST_EXPENSES.Key ||
      element.liabTypeKey === LIABILITIES.LEGAL_AND_EXECUTOR_FEES.Key ||
      element.liabTypeKey === LIABILITIES.PROBATE.Key
        ? 0
        : element.currValue;
    if (pos !== undefined) output.liabilities[pos].value += element.currValue;
  });

  output.clients = [];
  let grossIncome = 0;
  input.Clients.forEach(function (element) {
    //let income = "$" + formatMoney(element.Income, 0, ",", ",");
    grossIncome += element.Income;
    output.clients.push({
      id: element.id,
      memberKey: element.memberKey,
      age: element.Age,
      name: element.Name,
      income: element.Income, //income,//element.memberKey === childMember ? " - " : income,
      ret:
        element.memberKey === childMember && !singleFamily
          ? " - "
          : element.retirementAge,
    });
  });

  output.assets = [];
  Object.values(ASSETS).forEach((element) => {
    // console.log(element)
    if (
      !(
        appletMode === "EP" &&
        element.Key === ASSETS.CHARITABLE_GIFTS_TAX_CREDIT.Key
      )
    )
      output.assets.push({
        name: element.value[output.language],
        value: 0,
        disposeValue: 0,
      });
  });

  /*     ASSETS[output.language].Values.forEach(function(element) {
		  assets.push({ name: element, value: 0 });
		}); */
  /*  UNLISTED[output.language].Assets.Values.forEach(function(element) {
		  assets.push({ name: element, value: 0 });
		}); */
  output.totalAsset = 0;
  output.totalAssetExcludeInsurance = 0;
  output.totalAssetInsurance = 0;
  output.totalAssetInsuranceIfSpouse = 0;
  input.Assets.forEach((element) => {
    // console.log(element)
    //let pos = assets.findIndex(i => i.name === element.Type);
    let pos = output.assets.indexOf(
      output.assets.filter(
        (i) =>
          i.name ===
          getListItemNameFromKey(ASSETS, element.assetTypeKey, output.language)
      )[0]
    );
    let showAsDisposed =
      pos !== undefined && pos >= 0 && element.DisposeYr === 0;
    if (
      element.assetTypeKey === ASSETS.LIFE_INSURANCE.Key &&
      !(
        element.ownerKey === ASSET_OWNERSHIP_ACTION.CLIENT_LIQUIDATE.Key ||
        element.ownerKey === ASSET_OWNERSHIP_ACTION.CLIENT_ROLLOVER.Key
      )
    )
      showAsDisposed = false;
    output.totalAsset += element.currValue;
    output.totalAssetExcludeInsurance +=
      element.assetTypeKey === ASSETS.LIFE_INSURANCE.Key
        ? 0
        : element.currValue;
    output.totalAssetInsurance +=
      element.assetTypeKey === ASSETS.LIFE_INSURANCE.Key &&
      !(
        element.ownerKey === ASSET_OWNERSHIP_ACTION.SPOUSE.Key ||
        element.ownerKey === ASSET_OWNERSHIP_ACTION.JOINT.Key
      )
        ? element.currValue
        : 0;
    output.totalAssetInsuranceIfSpouse +=
      element.assetTypeKey === ASSETS.LIFE_INSURANCE.Key &&
      element.ownerKey !== ASSET_OWNERSHIP_ACTION.CLIENT_LIQUIDATE.Key &&
      element.ownerKey !== ASSET_OWNERSHIP_ACTION.CLIENT_ROLLOVER.Key
        ? element.currValue
        : 0;
    output.totalDisposeAsset += showAsDisposed ? element.currValue : 0;

    if (pos !== undefined && pos >= 0)
      output.assets[pos].value += element.currValue;
    if (showAsDisposed) output.assets[pos].disposeValue += element.currValue;
  });

  let otherAssetsList = "";
  input.Assets.forEach((element) => {
    if (
      element.assetTypeKey === ASSETS.OTHER_ASSETS.Key &&
      element.currValue > 0
    )
      otherAssetsList +=
        " " +
        (element.description === "" ? "..." : element.description) +
        " - ";
  });
  if (otherAssetsList !== "")
    output.otherAssetsList =
      "* " +
      ASSETS.OTHER_ASSETS.value[output.language] +
      ":" +
      otherAssetsList.substring(0, otherAssetsList.length - 3);
  else output.otherAssetsList = "";
  /* output.sources = [];
		output.govDB = 0;
		const srcDB =INCOMESOURCES.GOV_DEATH_BENEFIT.value[output.language];
		INCOMESOURCES[output.language].Values.forEach(function(element) {
		  output.sources.push({ name: element, value: 0 });
		}); */

  output.sources = [];
  output.govDB = 0;
  const srcDB = INCOMESOURCES.GOV_DEATH_BENEFIT.Key; //value[output.language];
  Object.values(INCOMESOURCES).forEach((element) => {
    output.sources.push({
      name: element.value[output.language],
      value: 0,
      valueAtDeath: 0,
    });
  });

  // populate with what was assigned'
  output.totalSource = 0;
  output.totalSource2 = 0;
  output.totalSourceATax = 0;
  output.totalSource2ATax = 0;
  output.totalSourceAtDeath = 0;
  output.totalSource2AtDeath = 0;
  output.totalSourceATaxAtDeath = 0;
  output.totalSource2ATaxAtDeath = 0;
  output.totalDesiredGrossIncome = 0;
  output.totalDesiredGrossIncome2 = 0;
  // NOTE "this" is not available inside inline functions, hence:
  // or just use arrow functions
  let srcOrphan = INCOMESOURCES.GOV_ORPHANS_BENEFIT.Key; //value[output.language];
 // console.log(input.Sources);
  input.Sources.forEach(function (element) {
    /*  let pos = output.sources.indexOf(
			output.sources.filter(i => i.name === element.Type)[0]
		  );
		   */
    let pos = output.sources.indexOf(
      output.sources.filter(
        (i) =>
          i.name ===
          getListItemNameFromKey(
            INCOMESOURCES,
            element.sourceTypeKey,
            output.language
          )
      )[0]
    );

    if (element.sourceTypeKey === srcDB) {
      // add gov DB
      output.govDB = element.amount;
      output.totalAsset += output.govDB;
      output.totalDisposeAsset += output.govDB;
    } else {
      output.totalSource += element.amount;
      if (element.startYear === 0) output.totalSourceAtDeath += element.amount;
      // no orphans
      output.totalSource2 +=
        element.sourceTypeKey !== srcOrphan ? element.amount : 0;
      if (element.startYear === 0)
        output.totalSource2AtDeath +=
          element.sourceTypeKey !== srcOrphan ? element.amount : 0;
    }
    if (pos !== undefined) {
      output.sources[pos].value += element.amount;
      if (element.startYear === 0)
        output.sources[pos].valueAtDeath += element.amount;
    }
  });
  // remove gov db from sources
  output.sources = output.sources.filter(
    (i) =>
      i.name !== getListItemNameFromKey(INCOMESOURCES, srcDB, output.language)
  ); //output.srcDB);
  // after tax
  output.totalSourceATax =
    input.Clients.length > 1
      ? output.totalSource * (1 - input.Clients[QUOTE_SPOUSE].avgTaxRate / 100)
      : output.totalSource * (1 - input.Clients[QUOTE_CLIENT].avgTaxRate / 100);
  output.totalSource2ATax =
    input.Clients.length > 1
      ? output.totalSource2 * (1 - input.Clients[QUOTE_SPOUSE].avgTaxRate / 100)
      : output.totalSource2 *
        (1 - input.Clients[QUOTE_CLIENT].avgTaxRate / 100);

  output.totalSourceATaxAtDeath =
    input.Clients.length > 1
      ? output.totalSourceAtDeath *
        (1 - input.Clients[QUOTE_SPOUSE].avgTaxRate / 100)
      : output.totalSourceAtDeath *
        (1 - input.Clients[QUOTE_CLIENT].avgTaxRate / 100);
  output.totalSource2ATaxAtDeath =
    input.Clients.length > 1
      ? output.totalSource2AtDeath *
        (1 - input.Clients[QUOTE_SPOUSE].avgTaxRate / 100)
      : output.totalSource2AtDeath *
        (1 - input.Clients[QUOTE_CLIENT].avgTaxRate / 100);

  output.percentNeed1 = 0;
  output.percentNeed2 = [];
  output.percent1 = 0;
  output.percent2 = [];
  var totalNeed = 0;
  const needPercent = INCOMENEEDS.PERCET_OF_INCOME.Key;
  /* output.needs = [];
		INCOMENEEDS[output.language].Values.forEach(function(element) {
		  output.needs.push({ name: element, value: 0 });
		});
 */
  output.needs = [];
  Object.values(INCOMENEEDS).forEach((element) => {
    output.needs.push({ name: element.value[output.language], value: 0 });
  });

  output.totalNeed = 0;
  input.Needs.forEach(function (element) {
    //let pos = needs.findIndex(i => i.name === element.Type);
    //let pos = output.needs.indexOf(output.needs.filter(i => i.name === element.Type)[0]);
    let pos = output.needs.indexOf(
      output.needs.filter(
        (i) =>
          i.name ===
          getListItemNameFromKey(
            INCOMENEEDS,
            element.needTypeKey,
            output.language
          )
      )[0]
    );

    output.totalNeed += element.amount;
    if (element.needTypeKey === needPercent) {
      if (output.percent1 === 0) {
        output.percent1 = element.Percent;
        output.percentNeed1 = element.amount;
        output.totalDesiredGrossIncome = (grossIncome * element.Percent) / 100;
      } else {
        output.percent2.push(element.Percent);
        output.percentNeed2.push(element.amount);
        output.totalDesiredGrossIncome2 +=
          (grossIncome * element.Percent) / 100;
      }
    }
    if (pos !== undefined) output.needs[pos].value += element.amount;
  });

  //		if (data.dataCashFlowGov !== undefined)
  //			var maxYScale = 10000 * Math.ceil(1 + Math.max(Math.max(...data.dataCashFlowGov), Math.max(...data.dataCashFlowNeeds), Math.max(...data.dataShortfall), Math.max(...data.dataCashFlowPersonal)) / 10000);
 // console.log(output);

  return output;
}

function findMatchingKey(objValues, nameFromFile) {
  return objValues.filter(
    (obj) =>
      obj.value.en
        .replace(/ /g, "")
        .replace(
          /[\u00A0\u1680​\u180e\u2000-\u2009\u200a​\u200b​\u202f\u205f​\u3000]/g,
          ""
        ) ==
        nameFromFile
          .replace(/ /g, "")
          .replace(
            /[\u00A0\u1680​\u180e\u2000-\u2009\u200a​\u200b​\u202f\u205f​\u3000]/g,
            ""
          ) ||
      obj.value.fr
        .replace(/ /g, "")
        .replace(
          /[\u00A0\u1680​\u180e\u2000-\u2009\u200a​\u200b​\u202f\u205f​\u3000]/g,
          ""
        ) ==
        nameFromFile
          .replace(/ /g, "")
          .replace(
            /[\u00A0\u1680​\u180e\u2000-\u2009\u200a​\u200b​\u202f\u205f​\u3000]/g,
            ""
          )
  )[0].Key;
}
