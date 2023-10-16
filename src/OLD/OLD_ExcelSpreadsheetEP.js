import { formatMoney, cleanFormat } from "../utils/helper";
import {
  COLUMN_TITLES,
  TITLES,
  INCOMESOURCES,
} from "../definitions/generalDefinitions";
import {
  getInfoExcelcapFund,
  getInfoExcelAllAfterTax,
} from "../definitions/infoIconsDefinitions";
import { Info } from "./Info";
import { getAssetGridValues } from "../data/assetGridProjections";
import { getOutputValues, setUIDataToAPI } from "../data/dataExchange";

import {
  ASSET_API_OUTPUT_Year,
  ASSET_API_OUTPUT_Age,
  ASSET_API_OUTPUT_FMV,
  ASSET_API_OUTPUT_EOYBalance,
  ASSET_API_OUTPUT_ACB,
  ASSET_API_OUTPUT_UCC,
  ASSET_API_OUTPUT_CCA,
  ASSET_API_OUTPUT_CapitalGain,
  ASSET_API_OUTPUT_TaxabaleGain,
  ASSET_API_OUTPUT_Recapture,
  ASSET_API_OUTPUT_TaxPayable,
  ASSET_API_OUTPUT_CapGainsExemption,
  ASSET_API_OUTPUT_Deposits,
  ASSET_API_OUTPUT_Withdrawals,
  ASSET_API_OUTPUT_RRIF,
  ASSET_API_OUTPUT_TaxPayableonIncome,
  ASSET_API_OUTPUT_DispositionAmount,
} from "../definitions/generalDefinitions";

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

function EPFullSpreadsheetData(cols, noProjectYrs, input) {
  let noYrs = noProjectYrs;

  const language = input.Presentations[0].language;
  
  const formatFr = language   === "fr" ? true : false;
  const decimalChar = language   === "en" ? "." : ",";
  const thousands = language   === "en" ? "," : " ";

  let count = 0;
  let dataColumns = new Array(cols).fill(0).map(() => new Array(noYrs).fill(0));

  const dataNA = setUIDataToAPI(input);

  input.dataInput.Assets.forEach((element) => {
    //console.log(dataColumns, cols, noProjectYrs);

    getAssetGridValues(dataNA, element, language  , true)
      .then((data) => {
        count += 1;
        //   console.log(data, data.dataProjection[0][0], data.dataProjection[0][1])

        for (let col = 0; col < 2; col++) {
          for (let yr = 0; yr < noYrs; yr++) {
            dataColumns[col][yr] = parseInt(data.dataProjection[col][yr]);
          }
        }
        // dont add up year and age
        for (
          let col = 2;
          col < Math.min(cols, data.dataProjection.length);
          col++
        ) {
          for (let yr = 0; yr < noYrs; yr++) {
            //console.log(yr,col,parseInt(data.dataProjection[col]))
            //     console.log(col, yr, parseInt(data.dataProjection[col][yr]))
            dataColumns[col][yr] =
              parseInt(cleanFormat(dataColumns[col][yr], formatFr)) +
              parseInt(cleanFormat(data.dataProjection[col][yr], formatFr));
          }
        }
      })
      .then(() => {
        let dc = new Array(cols).fill(0).map(() => new Array(noYrs).fill(0));
        //console.log(dataColumns);

        for (let col = 0; col < cols; col++) {
          for (let yr = 0; yr < noYrs; yr++) {
            //      console.log(col, yr, dataColumns[col][yr])
            dataColumns[col][yr] = formatMoney(
              dataColumns[col][yr],
              0,
              decimalChar,
              thousands
            );
          }
        }
      });
  });

  return dataColumns;
}

function getSourcesSurvivorIncomeProjections(
  sources,
  noYrs,
  avgTaxRate,
  inflation
) {
  let totalIncome = Array(noYrs).fill(0);
  let yr;
  // console.log(sources)

  sources.forEach((element) => {
    if (element.sourceTypeKey === INCOMESOURCES.SURVIVORS_INCOME.Key) {
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

function getSourcesSurvivorTotalPersonalIncomeProjections(
  sources,
  noYrs,
  avgTaxRate,
  inflation
) {
  let totalIncome = Array(noYrs).fill(0);
  let yr;
  
  sources.forEach((element) => {
    if (
      !(
        element.sourceTypeKey === INCOMESOURCES.GOV_DEATH_BENEFIT.Key ||
        element.sourceTypeKey === INCOMESOURCES.GOV_ORPHANS_BENEFIT.Key ||
        element.sourceTypeKey === INCOMESOURCES.GOV_SURVIVORS_PENSION.Key
      )
    ) {
  
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

// EP spreadsheet
export function getEPGridData(noProjectYrs, input) {
  let gridColumnAligns;
  let dataTitle;
  let dataColHeaders;
  let dataColumns;
  let excelDataInfoSection;
  let gridIcons;

  {
    // spreadsheet
    const language = input.Presentations[0].language;
  
    dataTitle = TITLES[language  ].appletEP;
    dataColHeaders = EPFullSpreadsheetHeaders(language  );

    dataColumns = EPFullSpreadsheetData(
      dataColHeaders.length,
      noProjectYrs + 1,
      input
    );
    gridColumnAligns = new Array(dataColHeaders.length).fill(2);
    let gridIcons = new Array(dataColHeaders.length);

    const decimalChar = language === "en" ? "." : ",";
    const thousands = language === "en" ? "," : " ";

    //console.log(dataColHeaders, dataColumns);
  }
  return {
    gridTitle: dataTitle,
    gridColumnsHeaders: dataColHeaders,
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
