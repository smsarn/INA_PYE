import { numFormat, cleanFormat, formatMoney2 } from "../utils/helper";
import { getAssetGridValues } from "./assetGridProjections";
import { setUIDataToAPI } from "./dataExchange";
import _ from "lodash";

import {
  COLUMN_TITLES,
  TITLES,
  INCOMESOURCES,
  MEMBER,
} from "../definitions/generalDefinitions";
import {
  getInfoExcelcapFund,
  getInfoExcelAllAfterTax,
  getInfoBOYEOY
} from "../definitions/infoIconsDefinitions";

import {
  ASSETS,
  ASSET_TAX,
  CONTROLTITLE,
  TOTALS,
  QUOTE_SPOUSE,
  QUOTE_CLIENT,
  ASSET_YEAR_TODAY,
  FIRST_BENEFICIARY_ID
} from "../definitions/generalDefinitions";

import {
  ASSET_TAX_TYPE_PRINCIPAL_RES,
  ASSET_TAX_TYPE_REAL_ESTATE,
  ASSET_TAX_TYPE_STOCKS,
  ASSET_TAX_TYPE_SMALL_BUS,
  ASSET_TAX_TYPE_RRSP,
  ASSET_TAX_TYPE_INTEREST,
  ASSET_TAX_TYPE_OTHER,
  ASSET_TAX_TYPE_COUNT,
} from "../definitions/outputDefinitionsEP";

const COLUMN_YEAR = 0;
const COLUMN_AGE = 1;
const COLUMN_INCOME_NEED = 2;
const COLUMN_CPP = 3;
const COLUMN_SURVIVOR_INCOME = 4;
const COLUMN_OTHER_INCOME = 5;
const COLUMN_TOTAL_INCOME = 6;
const COLUMN_TOTAL_ASSET_LIAB = 7;
const COLUMN_SHORTFALL = 8;
const COLUMN_INSURANCE_NEED = 9;
const COLUMN_FUND = 10;

// INA

function INAFullSpreadsheetData(
  cols,
  insNeed,
  dataInput,
  dataPCV,
  //Spouse,
  survivors,
  dataNeed,
  dataGov,
  dataShort,
  inflation,
  invRate,
  afterTaxCPP_DB,
  language
) {


  let dataColumns = [];
  let dataColumn = [];
  let noYrs = dataNeed.length;
  const tempDate = new Date();
  const year = tempDate.getFullYear();

  let dataColumnCapFund = [];

  let colNo;
  let yr;
  let survivorsIncome = 0;
  let surivorsSalaryProjection = getSurivorsSalaryProjection(
    dataInput,
    noYrs,
    survivors,
    inflation
  );
  let surivorsCashFlowsFromAllSources=dataPCV;
  let survivorsNonGovNonAssetLiabIncomeProjection = getSurvivorsNonGovNonAssetLiabIncomeProjections(
    dataInput,
    noYrs,
    //Spouse.avgTaxRate,
    survivors,
    inflation
  );
  //const formatFr = language === "fr" ? true : false;
  const decimalChar = language === "en" ? "." : ",";
  const thousands = language === "en" ? "," : " ";
  const capFundBase = cleanFormat(insNeed, language); //+parseFloat(CPP_DB)

  //console.log(Spouse);

  // console.log(surivorsSalaryProjection,survivorsNonGovNonAssetLiabIncomeProjection)
  // for cap fund use first survivor tax rate   
  let avgTaxRate=0;
  let beneficiaryAge=0;
  if(survivors.length>0)
  {
    avgTaxRate=survivors.filter((item)=> { return item.id===FIRST_BENEFICIARY_ID})[0].avgTaxRate;
    beneficiaryAge=survivors.filter((item)=> { return item.id===FIRST_BENEFICIARY_ID})[0].Age;
  }
   for (colNo = 0; colNo < cols; colNo++) {
    dataColumn = [];
    for (yr = 0; yr < noYrs; yr++) {
      if (yr === 0)
        dataColumnCapFund[yr] = Math.max(
          0,
          (capFundBase -
            cleanFormat(dataShort[yr] > 0 ? dataShort[yr] : 0, language)) *
            Math.pow(1 + (invRate / 100) * (1 - avgTaxRate / 100), 1)
        );
      else
        dataColumnCapFund[yr] = Math.max(
          0,
          (dataColumnCapFund[yr - 1] -
            cleanFormat(dataShort[yr] > 0 ? dataShort[yr] : 0, language)) *
            Math.pow(1 + (invRate / 100) * (1 - avgTaxRate / 100), 1)
        );

      if (colNo === COLUMN_YEAR) dataColumn.push(year + yr);
      else if (colNo === COLUMN_AGE) dataColumn.push(beneficiaryAge + yr);
      else if (colNo === COLUMN_INCOME_NEED)
        dataColumn.push(formatMoney2(-dataNeed[yr], 0, language, false));
      //numFormat(dataNeed[yr],  language==="en"?false:true, 2, language==="en"?",":" "));
      else if (colNo === COLUMN_CPP)
        dataColumn.push(formatMoney2(dataGov[yr], 0, language, false));
      //numFormat(dataGov[yr],   language==="en"?false:true, 2,  language==="en"?",":" "));
      else if (colNo === COLUMN_SURVIVOR_INCOME) {
        survivorsIncome = surivorsSalaryProjection[yr];
        dataColumn.push(formatMoney2(survivorsIncome, 0, language, false)); //numFormat(spouseIncome,   language==="en"?false:true, 2, language==="en"?",":" "));
      } else if (colNo === COLUMN_OTHER_INCOME) {
        let otherIncome = ( //Math.round((dataPCV[yr] - surivorsSalaryProjection[yr]) * 100) / 100
          Math.round(
            (parseFloat(survivorsNonGovNonAssetLiabIncomeProjection[yr]) -
            parseFloat(surivorsSalaryProjection[yr])) *
              100
          ) / 100
        ).toFixed(0);
        if (Math.abs(otherIncome) <= 1) otherIncome = 0;
        dataColumn.push(formatMoney2(otherIncome, 0, language, false)); //numFormat(otherIncome,   language==="en"?false:true, 2, language==="en"?",":" "));
      } else if (colNo === COLUMN_TOTAL_INCOME)
        dataColumn.push(
          formatMoney2(
            parseFloat(survivorsNonGovNonAssetLiabIncomeProjection[yr]) + parseFloat(dataGov[yr]),
            0,
            language,
            false
          )
        );
      //numFormat(dataPCV[yr] + dataGov[yr],   language==="en"?false:true, 2, language==="en"?",":" "));
      else if (colNo === COLUMN_TOTAL_ASSET_LIAB)
        dataColumn.push(
          formatMoney2(
            Math.abs(
              dataPCV[yr] - (parseFloat(survivorsNonGovNonAssetLiabIncomeProjection[yr]))
            ) > 1
              ? dataPCV[yr] - (parseFloat(survivorsNonGovNonAssetLiabIncomeProjection[yr]))
              : 0,
            0,
            language,
            false
          )
        ); //numFormat(dataPCV[yr] + dataGov[yr],   language==="en"?false:true, 2, language==="en"?",":" "));
      if (colNo === COLUMN_SHORTFALL)
        dataColumn.push(
          formatMoney2(
            dataShort[yr] > 0 ? dataShort[yr] : 0,
            0,
            language,
            false
          )
          // numFormat(dataShort[yr] > 0 ? dataShort[yr] : 0, false,   language==="en"?false:true, 2, language==="en"?",":" ")
        );
      else if (colNo === COLUMN_INSURANCE_NEED)
        dataColumn.push(
          yr === 0 ? formatMoney2(capFundBase, 0, language, false) : 0
        );
      //numFormat(insNeed, false,   language==="en"?false:true, 2, language==="en"?",":" ") : 0);
      else if (colNo === COLUMN_FUND)
        dataColumn.push(
          formatMoney2(dataColumnCapFund[yr], 0, language, false)
        ); //numFormat(0, false,   language==="en"?false:true, 2, language==="en"?",":" "));
    }
    
    // add CPP DB to other from CPP do this above before formatting
    /* if (colNo === COLUMN_CPP)
      dataColumn[0] = formatMoney2(parseFloat(cleanformat(dataColumn[0])) - parseFloat(afterTaxCPP_DB));
    
    if (colNo === COLUMN_OTHER_INCOME)
      dataColumn[0] = formatMoney2(parseFloat(cleanformat(ddataColumn[0])) - parseFloat(afterTaxCPP_DB)); */

    dataColumns.push(dataColumn);

    dataColumn = [];
  }
  return dataColumns;
}

function getSurivorsSalaryProjection(
  sources,
  noYrs,
  survivors,
  inflation
) {
  let totalIncome = Array(noYrs).fill(0);
  let yr;
  // console.log(sources)

  let avgTaxRate=0;
  sources.forEach((element) => {
    if (element.sourceTypeKey === INCOMESOURCES.SURVIVORS_INCOME.Key) {
      try {
        avgTaxRate=survivors.filter((item)=> { return item.id===element.ownerID})[0].avgTaxRate
      } catch (error) {
        
      }
      /* console.log(element,survivors,avgTaxRate) */
      for (yr = 0; yr < noYrs; yr++) {
        totalIncome[yr] +=
          yr >= element.startYear &&
          yr < parseInt(element.startYear) + parseInt(element.duration)
            ? parseFloat(element.amount) *
              (1 - avgTaxRate / 100) *
              Math.pow(1 + inflation / 100, yr)
            : 0;
      }
    }
  });
  for (yr = 0; yr < noYrs; yr++)
    totalIncome[yr] = (Math.round(totalIncome[yr] * 100) / 100).toFixed(0);

  return totalIncome;
}

function getSurvivorsNonGovNonAssetLiabIncomeProjections(
  sources,
  noYrs,
  //avgTaxRate,
  survivors,
  inflation
) {
  let totalIncome = Array(noYrs).fill(0);
  let yr;
  // console.log(sources)

  let avgTaxRate=0;
  sources.forEach((element) => {
    if (
      !(
        element.sourceTypeKey === INCOMESOURCES.GOV_DEATH_BENEFIT.Key ||
        element.sourceTypeKey === INCOMESOURCES.GOV_ORPHANS_BENEFIT.Key ||
        element.sourceTypeKey === INCOMESOURCES.GOV_SURVIVORS_PENSION.Key
      )
    ) {
      // console.log(element.sourceTypeKey)
      try {
        avgTaxRate=survivors.filter((item)=> { return item.id===element.ownerID})[0].avgTaxRate
      } catch (error) {
        
      }
      for (yr = 0; yr < noYrs; yr++) {
        totalIncome[yr] +=
          yr >= element.startYear &&
          yr < parseInt(element.startYear) + parseInt(element.duration)
            ? parseFloat(element.amount) *
              (1 - avgTaxRate / 100) *
              Math.pow(1 + inflation / 100, yr)
            : 0;
      }
    }
  });
  for (yr = 0; yr < noYrs; yr++)
    totalIncome[yr] = (Math.round(totalIncome[yr] * 100) / 100).toFixed(0);

  return totalIncome;
}

// INA spreadsheet
export function getINAGridData(
  insNeed,
  insNeedRet,
  insNeedLE,
  dataPCV,
 // Spouse,
  Survivors,
  dataNeed,
  dataGov,
  dataShort,
  inflation,
  language,
  invRate,
  Sources,
  afterTaxCPP_DB
) {
  let gridColumnAligns;
  let dataTitle;
  let dataColHeaders;
  let dataColumns;
  let excelDataInfoSection;
  let gridIcons;

  {
    // spreadsheet
    dataTitle = TITLES[language].appletINA;
    dataColHeaders = INAFullSpreadsheetHeaders(language);
    dataColumns = INAFullSpreadsheetData(
      dataColHeaders.length,
      insNeed,
      Sources,
      dataPCV,
  //    Spouse,
      Survivors,
      dataNeed,
      dataGov,
      dataShort,
      inflation,
      invRate,
      afterTaxCPP_DB,
      language
    );
    gridColumnAligns = new Array(dataColHeaders.length).fill(2);

    gridIcons = new Array(dataColHeaders.length);
    gridIcons[COLUMN_FUND] = getInfoExcelcapFund(language);
    gridIcons[COLUMN_YEAR] = getInfoExcelAllAfterTax(language);
    
    const singleFamily=Survivors.filter(client => client.memberKey ===MEMBER.SPOUSE.Key).length===0


    const decimalChar = language === "en" ? "." : ",";
    const thousands = language === "en" ? "," : " ";

    if(singleFamily) 
    {

      excelDataInfoSection = [
        [
          COLUMN_TITLES[language].intRate,
          COLUMN_TITLES[language].infRate,
          COLUMN_TITLES[language].surplusCapital,
          COLUMN_TITLES[language].blank,
          COLUMN_TITLES[language].additionalCapitalReq,
          COLUMN_TITLES[language].survivorProtection,
          
        ],
        [
          invRate.toString() + "%",
          inflation.toString() + "%",
          parseFloat(afterTaxCPP_DB),
          "",
          "",
          insNeedRet,
        ],
      ];

    } else
    {

    excelDataInfoSection = [
      [
        COLUMN_TITLES[language].intRate,
        COLUMN_TITLES[language].infRate,
        COLUMN_TITLES[language].surplusCapital,
        COLUMN_TITLES[language].blank,
        COLUMN_TITLES[language].additionalCapitalReq,
        COLUMN_TITLES[language].survivor65,
        COLUMN_TITLES[language].survivorLE,
      ],
      [
        invRate.toString() + "%",
        inflation.toString() + "%",
        parseFloat(afterTaxCPP_DB),
        "",
        "",
        insNeedRet,
        insNeedLE,
      ],
    ];
  }
  }
  return {
    gridTitle: dataTitle,
    dataColTitles: dataColHeaders,
    dataProjection: dataColumns,
    gridColumnsDataExcelInfoSection: excelDataInfoSection,
    gridColumnAligns: gridColumnAligns,
    gridIcons: gridIcons,
  };
}

function INAFullSpreadsheetHeaders(lang) {
  let headers = [];
  let i;

  for (i = 0; i < COLUMN_TITLES.INA_SHEET_HEADERS[lang].Full.length; ++i) {
    headers.push(COLUMN_TITLES.INA_SHEET_HEADERS[lang].Full[i]);
  }

  return headers;
}

// ESTATE PROTECTION
async function EPFullSpreadsheetData(
  cols,
  noProjectYrs, // + 1,
  input
) {
  let noYrs = noProjectYrs;
  const language = input.Presentations[0].language;
 // const formatFr = language === "fr" ? true : false;
  const decimalChar = language === "en" ? "." : ",";
  const thousands = language === "en" ? "," : " ";

  let count = 0;
  let dataColumns = new Array(cols).fill(0).map(() => new Array(noYrs).fill(0));

  const dataNA = await setUIDataToAPI(input);

  const assetsLength = input.Assets.length;

  for (let i = 0; i < assetsLength; i++) {
    const element = input.Assets[i];
    const data = await getAssetGridValues(dataNA, element, language, true);
    count += 1;
    
    for (let col = 0; col < 2; col++) {
      for (let yr = 0; yr < noYrs; yr++) {
        dataColumns[col][yr] = data.dataProjection[col][yr];
        
      }
    }
    // year 0 is today, change it
    // dataColumns[0][0]=ASSET_YEAR_TODAY[language].today;
    // dont add up year and age
    for (let col = 2; col < Math.min(cols, data.dataProjection.length); col++) {
      for (let yr = 0; yr < noYrs; yr++) {
        dataColumns[col][yr] =
          parseInt(cleanFormat(dataColumns[col][yr], language)) +
          parseInt(cleanFormat(data.dataProjection[col][yr], language));
      }
    }
  //  console.log(dataColumns)
  }

  
  for (let col = 0; col < cols; col++) {
    for (let yr = 0; yr < noYrs; yr++) {
      if (yr === 0)
        dataColumns[2][yr] =
          parseInt(dataColumns[10][yr]) -
          parseInt(dataColumns[4][yr]) -
          parseInt(dataColumns[5][yr]) +
          parseInt(dataColumns[6][yr]) +
          parseInt(dataColumns[7][yr]);
      else dataColumns[2][yr] = dataColumns[10][yr - 1];

      
      
      dataColumns[11][yr] =
        Math.round(
          10000 *
            (-1 +
              (parseInt(dataColumns[10][yr]) + parseInt(dataColumns[6][yr])) /
                parseInt(dataColumns[2][yr]))
        ).toFixed(2) /
          100 +
        " %";
    }
  }
  
  for (let col = 0; col < cols; col++) {
    if (col !== 11 && col !== 1) {
      for (let yr = 0; yr < noYrs; yr++) {
        dataColumns[col][yr] = formatMoney2(
          dataColumns[col][yr],
          0,
          language,
          false
        );
      }
  
    } else
      for (let yr = 0; yr < noYrs; yr++) {
        if (col !== 1 && isNaN(dataColumns[col][yr])) dataColumns[col][yr] = 0;
      }
  
  }
  // year 0 is today, change it
  dataColumns[0][0] = ASSET_YEAR_TODAY[language].today;
  return dataColumns;
}

// EP spreadsheet
export async function getEPGridData(noProjectYrs, input) {
  let gridColumnAligns;
  let dataTitle;
  let dataColHeaders;
  let dataColumns;
  let excelDataInfoSection;
  let gridIcons;

  // spreadsheet
  const language = input.Presentations[0].language;

  dataTitle = TITLES[language].appletEP;
  dataColHeaders = EPFullSpreadsheetHeaders(language);

  dataColumns = await EPFullSpreadsheetData(
    dataColHeaders.length,
    noProjectYrs+1, // + 1,
    input
  );
  gridColumnAligns = new Array(dataColHeaders.length).fill(2);
  gridIcons = new Array(dataColHeaders.length);
  dataColHeaders.forEach((item) => {
    if (item === COLUMN_TITLES.[language].EOYBalance)
      gridIcons[2] = getInfoBOYEOY(  // boy
        language
      );
      gridIcons[dataColHeaders.length-3]=gridIcons[2] //eoy
  });
  const decimalChar = language === "en" ? "." : ",";
  const thousands = language === "en" ? "," : " ";

  return {
    gridTitle: dataTitle,
    dataColTitles: dataColHeaders,
    dataProjection: dataColumns,
    gridIcons: gridIcons,
  };
}

function EPFullSpreadsheetHeaders(lang) {
  let headers = [];
  let i;

  for (i = 0; i < COLUMN_TITLES.EP_SHEET_HEADERS[lang].Full.length; ++i) {
    headers.push(COLUMN_TITLES.EP_SHEET_HEADERS[lang].Full[i]);
  }

  return headers;
}

export function getAssetLiabProjections(props) {
  // add liab and tax liab
  const input = props.dataInput;
  const assetProjections = props.assetProjections;
  //console.log(assetProjections)
  const lang = input.Presentations[0].language;
 // const formatFr = lang === "fr" ? true : false;
  const clients = input.Clients;
  const startAge =
    clients.length > 1
      ? Math.min(clients[QUOTE_SPOUSE].Age, clients[QUOTE_CLIENT].Age)
      : clients[QUOTE_CLIENT].Age;

  const LE3 = parseInt(props.LE) + 3;
  let EstateLiabsByType = Array(ASSET_TAX_TYPE_COUNT).fill(0);
  let EstateLiabsByTypeLE3 = Array(ASSET_TAX_TYPE_COUNT).fill(0);
  let proj = [];
  let dataEstateLiability = Array(100 - startAge + 1).fill(0);

  //const dataNA = setUIDataToAPI(props.dataInput);

  let tmpGrids = [];
  let AssetProjectionsGrid = [];
  let taxLiabCol = 0;
  let FMVCol = 0;
  let EstateLiabsByTypeTotal = 0;
  let EstateLiabsByTypeLE3Total = 0;
  let EstateLiabsByTypeGrowth = [];
  let EstateLiabsByTypeInitialAmt = [];
  EstateLiabsByTypeGrowth = Array(ASSET_TAX_TYPE_COUNT).fill(0);
  EstateLiabsByTypeInitialAmt = Array(ASSET_TAX_TYPE_COUNT).fill(0);
  // add all assets

  if (input.Assets.length === 0) {
    proj.values = Array(100).fill(0);
    const grid = assetProjections[0].grid;
    tmpGrids.push(grid);
  } else {
    input.Assets.forEach((element) => {
      proj.values = Array(100).fill(0);
      //console.log(assetProjections);
      //console.log(assetProjections[element.id - 1]);

      const grid = assetProjections[element.id - 1].grid;
      tmpGrids.push(grid);
      FMVCol = 2;
      let fmv = [];
      for (let i = 0; i < 100 - startAge; i++) {
        fmv.push(parseFloat(cleanFormat(grid.dataProjection[FMVCol][i])));
      }

      if (element.assetTaxTypeKey !== ASSET_TAX.NON_TAXABLE.Key) {
        if (element.assetTypeKey === ASSETS.PERSONAL_RESIDENCE.Key) {
          taxLiabCol = grid.dataProjection.length - 1;
          EstateLiabsByType[ASSET_TAX_TYPE_PRINCIPAL_RES] += parseFloat(
            cleanFormat(grid.dataProjection[taxLiabCol][0], lang)
          );
          EstateLiabsByTypeLE3[ASSET_TAX_TYPE_PRINCIPAL_RES] += parseFloat(
            cleanFormat(grid.dataProjection[taxLiabCol][LE3], lang)
          );
          addAssetToProjections(
            proj,
            fmv,
            ASSETS.PERSONAL_RESIDENCE.value[lang],
            ASSETS.PERSONAL_RESIDENCE.colour
          );
        } else if (element.assetTypeKey === ASSETS.REAL_ESTATE.Key) {
          taxLiabCol = grid.dataProjection.length - 1;
          FMVCol = 2;

          EstateLiabsByTypeGrowth[ASSET_TAX_TYPE_REAL_ESTATE] +=
            (parseFloat(cleanFormat(element.currValue, lang)) *
              element.growth) /
            100;
          EstateLiabsByTypeInitialAmt[ASSET_TAX_TYPE_REAL_ESTATE] += parseFloat(
            cleanFormat(element.currValue, lang)
          );

          EstateLiabsByType[ASSET_TAX_TYPE_REAL_ESTATE] += parseFloat(
            cleanFormat(grid.dataProjection[taxLiabCol][0], lang)
          );

          EstateLiabsByTypeLE3[ASSET_TAX_TYPE_REAL_ESTATE] += parseFloat(
            cleanFormat(grid.dataProjection[taxLiabCol][LE3], lang)
          );
          addAssetToProjections(
            proj,
            fmv,
            ASSETS.REAL_ESTATE.value[lang],
            ASSETS.REAL_ESTATE.colour
          );
        } else if (element.assetTypeKey === ASSETS.STOCKS_BONDS.Key) {
          taxLiabCol = grid.dataProjection.length - 1;
          FMVCol = 2;
          EstateLiabsByTypeGrowth[ASSET_TAX_TYPE_STOCKS] +=
            (parseFloat(cleanFormat(element.currValue, lang)) *
              element.growth) /
            100;
          EstateLiabsByTypeInitialAmt[ASSET_TAX_TYPE_STOCKS] += parseFloat(
            cleanFormat(element.currValue, lang)
          );
          EstateLiabsByType[ASSET_TAX_TYPE_STOCKS] += parseFloat(
            cleanFormat(grid.dataProjection[taxLiabCol][0], lang)
          );
          EstateLiabsByTypeLE3[ASSET_TAX_TYPE_STOCKS] += parseFloat(
            cleanFormat(grid.dataProjection[taxLiabCol][LE3], lang)
          );
          addAssetToProjections(
            proj,
            fmv,
            ASSETS.STOCKS_BONDS.value[lang],
            ASSETS.STOCKS_BONDS.colour
          );
        } else if (element.assetTypeKey === ASSETS.SMALL_BUSINESS_SHARES.Key) {
          taxLiabCol = grid.dataProjection.length - 1;
          FMVCol = 2;
          EstateLiabsByTypeGrowth[ASSET_TAX_TYPE_SMALL_BUS] +=
            (parseFloat(cleanFormat(element.currValue, lang)) *
              element.growth) /
            100;
          EstateLiabsByTypeInitialAmt[ASSET_TAX_TYPE_SMALL_BUS] += parseFloat(
            cleanFormat(element.currValue, lang)
          );
          EstateLiabsByType[ASSET_TAX_TYPE_SMALL_BUS] += parseFloat(
            cleanFormat(grid.dataProjection[taxLiabCol][0], lang)
          );
          EstateLiabsByTypeLE3[ASSET_TAX_TYPE_SMALL_BUS] += parseFloat(
            cleanFormat(grid.dataProjection[taxLiabCol][LE3], lang)
          );
          addAssetToProjections(
            proj,
            fmv,
            ASSETS.SMALL_BUSINESS_SHARES.value[lang],
            ASSETS.SMALL_BUSINESS_SHARES.colour
          );
        } else if (element.assetTypeKey === ASSETS.RRSP_RRIF.Key) {
          taxLiabCol = grid.dataProjection.length - 1;
          FMVCol = 2;
          EstateLiabsByTypeGrowth[ASSET_TAX_TYPE_RRSP] +=
            (parseFloat(cleanFormat(element.currValue, lang)) *
              element.growth) /
            100;
          EstateLiabsByTypeInitialAmt[ASSET_TAX_TYPE_RRSP] += parseFloat(
            cleanFormat(element.currValue, lang)
          );
          EstateLiabsByType[ASSET_TAX_TYPE_RRSP] += parseFloat(
            cleanFormat(grid.dataProjection[taxLiabCol][0], lang)
          );
          EstateLiabsByTypeLE3[ASSET_TAX_TYPE_RRSP] += parseFloat(
            cleanFormat(grid.dataProjection[taxLiabCol][LE3], lang)
          );
          addAssetToProjections(
            proj,
            fmv,
            ASSETS.RRSP_RRIF.value[lang],
            ASSETS.RRSP_RRIF.colour
          );
        } else if (element.assetTypeKey === ASSETS.INTEREST_BEARING.Key) {
          taxLiabCol = grid.dataProjection.length - 1;
          FMVCol = 2;

          EstateLiabsByTypeGrowth[ASSET_TAX_TYPE_INTEREST] +=
            (parseFloat(cleanFormat(element.currValue, lang)) *
              element.growth) /
            100;
          EstateLiabsByTypeInitialAmt[ASSET_TAX_TYPE_INTEREST] += parseFloat(
            cleanFormat(element.currValue, lang)
          );
          EstateLiabsByType[ASSET_TAX_TYPE_INTEREST] += parseFloat(
            cleanFormat(grid.dataProjection[taxLiabCol][0], lang)
          );
          EstateLiabsByTypeLE3[ASSET_TAX_TYPE_INTEREST] += parseFloat(
            cleanFormat(grid.dataProjection[taxLiabCol][LE3], lang)
          );
          addAssetToProjections(
            proj,
            fmv,
            ASSETS.INTEREST_BEARING.value[lang],
            ASSETS.INTEREST_BEARING.colour
          );
        }
        // take other, bundle taxable together
        else if (element.assetTypeKey === ASSETS.OTHER_ASSETS.Key) {
          taxLiabCol = grid.dataProjection.length - 1;
          FMVCol = 2;
          EstateLiabsByTypeGrowth[ASSET_TAX_TYPE_OTHER] +=
            (parseFloat(cleanFormat(element.currValue, lang)) *
              element.growth) /
            100;
          EstateLiabsByTypeInitialAmt[ASSET_TAX_TYPE_OTHER] += parseFloat(
            cleanFormat(element.currValue, lang)
          );
          EstateLiabsByType[ASSET_TAX_TYPE_OTHER] += parseFloat(
            cleanFormat(grid.dataProjection[taxLiabCol][0], lang)
          );
          EstateLiabsByTypeLE3[ASSET_TAX_TYPE_OTHER] += parseFloat(
            cleanFormat(grid.dataProjection[taxLiabCol][LE3], lang)
          );
          addAssetToProjections(
            proj,
            fmv,
            ASSETS.OTHER_ASSETS.value[lang],
            ASSETS.OTHER_ASSETS.colour
          );
        }
        // bundle non-taxable together
        /* else if (element.assetTypeKey === ASSETS.CASH.Key) {
      FMVCol = 2;
      addAssetToProjections(
        proj,
        fmv,
        ASSET_TAX.NON_TAXABLE.value[lang],
        ASSETS.CASH.colour
      );
    } else if (element.assetTypeKey === ASSETS.LIFE_INSURANCE.Key) {
      FMVCol = 2;
      addAssetToProjections(
        proj,
        fmv,
        ASSET_TAX.NON_TAXABLE.value[lang],
        ASSETS.LIFE_INSURANCE.colour
      );
    } else if (
      element.assetTypeKey === ASSETS.CHARITABLE_GIFTS_TAX_CREDIT.Key
    ) {
      FMVCol = 2;
      addAssetToProjections(
        proj,
        fmv,
        ASSET_TAX.NON_TAXABLE.value[lang],
        ASSETS.CHARITABLE_GIFTS_TAX_CREDIT.colour
      );
    } */
        /* else {
      taxLiabCol = grid.dataProjection.length - 1;
      FMVCol = 2;
     
      EstateLiabsByTypeGrowth[ASSET_TAX_TYPE_OTHER] +=  parseFloat(cleanFormat(element.currValue, lang))*element.growth/100;
      EstateLiabsByTypeInitialAmt[ASSET_TAX_TYPE_OTHER]+=parseFloat(cleanFormat(element.currValue, lang));
      EstateLiabsByType[ASSET_TAX_TYPE_OTHER] += parseFloat(
        cleanFormat(grid.dataProjection[taxLiabCol][0], lang)
      );
      EstateLiabsByTypeLE3[ASSET_TAX_TYPE_OTHER] += parseFloat(
        cleanFormat(grid.dataProjection[taxLiabCol][LE3], lang)
      );
      addAssetToProjections(
        proj,
        fmv,
        ASSETS.OTHER_BEARING.value[lang],
        ASSETS.OTHER_BEARING.colour
      );
    }
 */
        EstateLiabsByTypeTotal += parseFloat(
          cleanFormat(grid.dataProjection[taxLiabCol][0], lang)
        );
        EstateLiabsByTypeLE3Total += parseFloat(
          cleanFormat(grid.dataProjection[taxLiabCol][LE3], lang)
        );
        // sum all for total tax liab
        if (proj.length > 0) {
          for (let i = 0; i < grid.dataProjection[0].length - 1; i++) {
            if (grid.dataProjection[taxLiabCol][i] !== undefined)
              dataEstateLiability[i] += parseFloat(
                cleanFormat(grid.dataProjection[taxLiabCol][i], lang)
              );
          }
          dataEstateLiability[100 - startAge] =
            dataEstateLiability[100 - startAge - 1];
        }
      }
    });
  }
  proj.push({
    name: TOTALS.TAX_LIAB.value[lang], // TOTALS.ESTATE_LIAB.value[lang],
    colour: TOTALS.ESTATE_LIAB.colour,
    values: dataEstateLiability,
  });

  const rateRS =
    EstateLiabsByTypeInitialAmt[ASSET_TAX_TYPE_REAL_ESTATE] === 0
      ? 0
      : (100 * EstateLiabsByTypeGrowth[ASSET_TAX_TYPE_REAL_ESTATE]) /
        EstateLiabsByTypeInitialAmt[ASSET_TAX_TYPE_REAL_ESTATE];
  const rateS =
    EstateLiabsByTypeInitialAmt[ASSET_TAX_TYPE_STOCKS] === 0
      ? 0
      : (100 * EstateLiabsByTypeGrowth[ASSET_TAX_TYPE_STOCKS]) /
        EstateLiabsByTypeInitialAmt[ASSET_TAX_TYPE_STOCKS];
  const rateSB =
    EstateLiabsByTypeInitialAmt[ASSET_TAX_TYPE_SMALL_BUS] === 0
      ? 0
      : (100 * EstateLiabsByTypeGrowth[ASSET_TAX_TYPE_SMALL_BUS]) /
        EstateLiabsByTypeInitialAmt[ASSET_TAX_TYPE_SMALL_BUS];
  const rateRR =
    EstateLiabsByTypeInitialAmt[ASSET_TAX_TYPE_RRSP] === 0
      ? 0
      : (100 * EstateLiabsByTypeGrowth[ASSET_TAX_TYPE_RRSP]) /
        EstateLiabsByTypeInitialAmt[ASSET_TAX_TYPE_RRSP];
  const rateI =
    EstateLiabsByTypeInitialAmt[ASSET_TAX_TYPE_INTEREST] === 0
      ? 0
      : (100 * EstateLiabsByTypeGrowth[ASSET_TAX_TYPE_INTEREST]) /
        EstateLiabsByTypeInitialAmt[ASSET_TAX_TYPE_INTEREST];
  const rateO =
    EstateLiabsByTypeInitialAmt[ASSET_TAX_TYPE_OTHER] === 0
      ? 0
      : (100 * EstateLiabsByTypeGrowth[ASSET_TAX_TYPE_OTHER]) /
        EstateLiabsByTypeInitialAmt[ASSET_TAX_TYPE_OTHER];

  EstateLiabsByTypeGrowth[ASSET_TAX_TYPE_REAL_ESTATE] =
    lang === "en"
      ? numFormat(rateRS, false, 3)
      : numFormat(rateRS, false, 3).replace(".", ",");
  EstateLiabsByTypeGrowth[ASSET_TAX_TYPE_STOCKS] =
    lang === "en"
      ? numFormat(rateS, false, 3)
      : numFormat(rateS, false, 3).replace(".", ",");
  EstateLiabsByTypeGrowth[ASSET_TAX_TYPE_SMALL_BUS] =
    lang === "en"
      ? numFormat(rateSB, false, 3)
      : numFormat(rateSB, false, 3).replace(".", ",");
  EstateLiabsByTypeGrowth[ASSET_TAX_TYPE_RRSP] =
    lang === "en"
      ? numFormat(rateRR, false, 3)
      : numFormat(rateRR, false, 3).replace(".", ",");
  EstateLiabsByTypeGrowth[ASSET_TAX_TYPE_INTEREST] =
    lang === "en"
      ? numFormat(rateI, false, 3)
      : numFormat(rateI, false, 3).replace(".", ",");
  EstateLiabsByTypeGrowth[ASSET_TAX_TYPE_OTHER] =
    lang === "en"
      ? numFormat(rateO, false, 3)
      : numFormat(rateO, false, 3).replace(".", ",");

  let projectionsGrids = tmpGrids;
  //setState({ grids: tmpGrids, loading: false });

  const AssetnEstateLiabs = proj;
  

  return {
    EstateLiabsByType,
    EstateLiabsByTypeTotal,
    EstateLiabsByTypeLE3,
    EstateLiabsByTypeLE3Total,
    EstateLiabsByTypeGrowth,
    AssetnEstateLiabs,
    projectionsGrids,
  };
}

function addAssetToProjections(proj, data, assetName, colour) {
  let alreadyThere = false;
  for (let i = 0; i < proj.length; i++) {
    if (proj[i].colour === colour) {
      alreadyThere = true;
       for (let j = 0; j < 100; j++) proj[i].values[j] += data[j];
    }
  }
  if (alreadyThere === false)
    proj.push({ name: assetName, colour: colour, values: data });

  //console.log(proj);
  return proj;
}
