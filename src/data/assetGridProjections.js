import {
  ASSETS,
  ASSET_TAX,
  ASSET_OWNERSHIP_ACTION,
  COLUMN_TITLES,
} from "../definitions/generalDefinitions";
import { getListItemNameFromKey, arrayFormatMoney } from "../utils/helper";

import { fetchAssetAllGridColumns } from "../utils/FetchAPIs";

import {
  ASSET_API_OUTPUT_Year,
  ASSET_API_OUTPUT_Age,
  ASSET_API_OUTPUT_FMV,
  ASSET_API_OUTPUT_EOYBalance,
  ASSET_API_OUTPUT_ACB,
  ASSET_API_OUTPUT_CapitalGain,
  ASSET_API_OUTPUT_TaxPayable,
  ASSET_API_OUTPUT_CapGainsExemption,
  ASSET_API_OUTPUT_Deposits,
  ASSET_API_OUTPUT_Withdrawals,
  ASSET_API_OUTPUT_RRIF,
  ASSET_API_OUTPUT_TaxPayableonIncome,
  ASSET_API_OUTPUT_DispositionAmount,
  ASSET_YEAR_TODAY,
  APPLET_INA,
  APPLET_EP,
} from "../definitions/generalDefinitions";
import { appletMode } from "../../package.json";

export async function getAssetGridValues(dataNA, assetCurr, lang, aggregate) {
  const title = COLUMN_TITLES[lang];

  let data = await fetchAssetAllGridColumns(dataNA, assetCurr.id);
  if (data !== undefined && data !== undefined) {
    console.log("POST: NA_AssetProj success");

    let taxOnDisposition = [];
    let yr;
    for (
      yr = 0;
      yr < data[ASSET_API_OUTPUT_TaxPayable].numericValues.length;
      ++yr
    ) {
      taxOnDisposition[yr] =
        data[ASSET_API_OUTPUT_DispositionAmount].numericValues[yr] > 0
          ? data[ASSET_API_OUTPUT_TaxPayable].numericValues[yr]
          : 0;
    }
    taxOnDisposition = arrayFormatMoney(taxOnDisposition, lang, 0);

    let arrYear = data[ASSET_API_OUTPUT_Year].numericValues;
    
    // year 0 is today, change it
    arrYear[0] = ASSET_YEAR_TODAY[lang].today;
    const arrAge = data[ASSET_API_OUTPUT_Age].numericValues;
    let arrAdjAge = [];// to be used for all and JLTD
    if(appletMode === "EP" && dataNA.lives.length>1) // JLTD
    {
      const age1=dataNA.lives[0].Age // missing age is clients if 2 lives surviver is picked up in API
      const age2=dataNA.lives[1].Age // missing age is clients if 2 lives surviver is picked up in API
      
      for (
          let i = 0;
          i < arrYear.length;
          ++i
        ) {
          arrAdjAge.push(parseInt(age1+i) + "/" + parseInt(age2+i));
      }
    }
    else
      arrAdjAge =arrAge
    
    const arrDeposits = arrayFormatMoney(
      data[ASSET_API_OUTPUT_Deposits].numericValues,
      lang,
      0
    );
    const arrFMV = arrayFormatMoney(
      data[ASSET_API_OUTPUT_FMV].numericValues,
      lang,
      0
    );
    
    const arrRRIF = arrayFormatMoney(
      data[ASSET_API_OUTPUT_RRIF].numericValues,
      lang,
      0
    );
    const arrEOYBalance = arrayFormatMoney(
      data[ASSET_API_OUTPUT_EOYBalance].numericValues,
      lang,
      0
    );
    const arrWithdrawals = arrayFormatMoney(
      data[ASSET_API_OUTPUT_Withdrawals].numericValues,
      lang,
      0
    );
    const arrTaxPayableonIncome = arrayFormatMoney(
      data[ASSET_API_OUTPUT_TaxPayableonIncome].numericValues,
      lang,
      0
    );
    const arrTaxPayable = arrayFormatMoney(
      data[ASSET_API_OUTPUT_TaxPayable].numericValues,
      lang,
      0
    );
    const arrDispositionAmount = arrayFormatMoney(
      data[ASSET_API_OUTPUT_DispositionAmount].numericValues,
      lang,
      0
    );
    const arrACB = arrayFormatMoney(
      data[ASSET_API_OUTPUT_ACB].numericValues,
      lang,
      0
    );



    const arrCapitalGain = arrayFormatMoney(
      data[ASSET_API_OUTPUT_CapitalGain].numericValues,
      lang,
      0
    );
    const arrCapGainsExemption = arrayFormatMoney(
      data[ASSET_API_OUTPUT_CapGainsExemption].numericValues,
      lang,
      0
    );

    
    var sum = data[ASSET_API_OUTPUT_Withdrawals].numericValues.map(function (num, idx) {
      return num + data[ASSET_API_OUTPUT_RRIF].numericValues[idx];
    });

    const arrIncome = arrayFormatMoney(
      sum,
      lang,
      0
    );



    const gridTitleSection =
      appletMode === "INA"
        ? " (" +
          getListItemNameFromKey(
            ASSET_OWNERSHIP_ACTION,
            assetCurr.ownerKey,
            lang
          ) +
          ")"
        : "" +
          (assetCurr.description !== ""
            ? " (" + assetCurr.description + ")"
            : "");
    const gridTitle =
      getListItemNameFromKey(ASSETS, assetCurr.assetTypeKey, lang) +
      gridTitleSection +
      " Projection";

    let dataColTitles = [];
    let dataProjection = [];

   // console.log(arrCapitalGain)
    // aggregate table
    if (aggregate === true) {
      for (
        let i = 0;
        i < COLUMN_TITLES.EP_SHEET_HEADERS[lang].Full.length;
        ++i
      ) {
        dataColTitles.push(COLUMN_TITLES.EP_SHEET_HEADERS[lang].Full[i]);
      }

      dataProjection[0] = arrYear;
      dataProjection[1] = arrAdjAge;
      dataProjection[2] = arrFMV;
      dataProjection[3] = arrFMV;
      dataProjection[4] = arrDeposits;
      dataProjection[5] = arrIncome;//arrRRIF; //+ arrWithdrawals;
      dataProjection[6] = arrDispositionAmount;
      dataProjection[7] = arrTaxPayableonIncome;
      dataProjection[8] = arrCapitalGain;
      dataProjection[9] = arrCapGainsExemption;
      dataProjection[10] = arrEOYBalance;
      dataProjection[11] = arrFMV;
      dataProjection[12] = arrTaxPayable;
    }

    // individual tables
    else {
      if (assetCurr.assetTaxTypeKey === ASSET_TAX.REGISTERED.Key) {
        //		'Registered')
        if (APPLET_INA) {
          dataColTitles = [
            title.Year,
            title.Age,
            title.FMV,
            title.AnnualContribution,
            title.MinRRIFIncome,
            title.Withdrawal,
            //title.Taxonincome,
            title.EOYBalance,
          ];

          // F^
          dataProjection[0] = arrYear;
          dataProjection[1] = arrAdjAge;
          dataProjection[2] = arrFMV;
          dataProjection[3] = arrDeposits;
          dataProjection[4] = arrRRIF;
          dataProjection[5] = arrWithdrawals;
          //dataProjection[6] = arrTaxPayableonIncome;
          dataProjection[6] = arrEOYBalance;
        } else {
          dataColTitles = [
            title.Year,
            title.Age,
            title.FMV,
            title.AnnualContribution,
            title.MinRRIFIncome,
            title.Withdrawal,
            //title.Taxonincome,
            title.EOYBalance,
            //title.TaxLiabilityatDeath,
            title.TaxLiability,
          ];

          // F^
          dataProjection[0] = arrYear;
          dataProjection[1] = arrAdjAge;
          dataProjection[2] = arrFMV;
          dataProjection[3] = arrDeposits;
          dataProjection[4] = arrRRIF;
          dataProjection[5] = arrWithdrawals;
          //dataProjection[6] = arrTaxPayableonIncome;
          dataProjection[6] = arrEOYBalance;
          dataProjection[7] = arrTaxPayable;
        }
      } else if (assetCurr.assetTypeKey === ASSETS.PERSONAL_RESIDENCE.Key) {
        if (APPLET_INA) {
          dataColTitles = [
            title.Year,
            title.Age,
            title.FMV,
            title.SaleProceeds,
          ];
          dataProjection[0] = arrYear;
          dataProjection[1] = arrAdjAge;
          dataProjection[2] =
            //arrEOYBalance;
            arrFMV;
          dataProjection[3] = arrDispositionAmount;
        } else {
          dataColTitles = [
            title.Year,
            title.Age,
            title.FMV,
            title.SaleProceeds,
            title.TaxLiability,
          ];
          dataProjection[0] = arrYear;
          dataProjection[1] = arrAdjAge;
          dataProjection[2] =
            //arrEOYBalance;
            arrFMV;
          dataProjection[3] = arrDispositionAmount;
          dataProjection[4] = arrTaxPayable;
        }

      } else if (assetCurr.assetTypeKey === ASSETS.LIFE_INSURANCE.Key) {
        if (APPLET_INA) {
          dataColTitles = [title.Year, title.Age, title.FA];
          dataProjection[0] = arrYear;
          dataProjection[1] = arrAdjAge;
          dataProjection[2] =
            //arrEOYBalance;
            arrFMV;
        } else {
          dataColTitles = [title.Year, title.Age, title.FA];
          dataProjection[0] = arrYear;
          dataProjection[1] = arrAdjAge;
          dataProjection[2] =
            //arrEOYBalance;
            arrFMV;
        }

      } else if (assetCurr.assetTypeKey === ASSETS.REAL_ESTATE.Key) {
        if (APPLET_INA) {
          dataColTitles = [
            title.Year,
            title.Age,
            title.FMV,
            title.ACB,
            title.RentalIncome,
            title.SaleProceeds,
          ];
          dataProjection[0] = arrYear;
          dataProjection[1] = arrAdjAge;
          dataProjection[2] =
            //arrEOYBalance;
            arrFMV;
          dataProjection[3] = arrACB;
          dataProjection[4] = arrWithdrawals;
          dataProjection[5] = arrDispositionAmount;
          dataProjection[6] = taxOnDisposition;
        } else {
          dataColTitles = [
            title.Year,
            title.Age,
            title.FMV,
            title.ACB,
            title.RentalIncome,
            title.Taxonincome,
            title.SaleProceeds,
            title.CapitalGain,
            title.TaxLiability,
          ];
          dataProjection[0] = arrYear;
          dataProjection[1] = arrAdjAge;
          dataProjection[2] =
            //arrEOYBalance;
            arrFMV;
          dataProjection[3] = arrACB;
          dataProjection[4] = arrWithdrawals;
          dataProjection[5] = arrTaxPayableonIncome;
          dataProjection[6] = arrDispositionAmount;
          dataProjection[7] = arrCapitalGain;
          dataProjection[8] = arrTaxPayable;
        }
      } else if (assetCurr.assetTypeKey === ASSETS.SMALL_BUSINESS_SHARES.Key) {
        if (APPLET_INA) {
          dataColTitles = [
            title.Year,
            title.Age,
            title.FMV,
            title.ACB,
            title.SaleProceeds,
            title.TaxLiability,
          ];
          dataProjection[0] = arrYear;
          dataProjection[1] = arrAdjAge;
          dataProjection[2] =
            //arrEOYBalance;

            arrFMV;
          dataProjection[3] = arrACB;
          dataProjection[4] = arrDispositionAmount;
          dataProjection[5] = taxOnDisposition;
        } else {
          dataColTitles = [
            title.Year,
            title.Age,
            title.FMV,
            title.ACB,
            title.SaleProceeds,
            title.CapitalGainsExemption,
            title.CapitalGain,
            title.TaxLiability,
          ];
          dataProjection[0] = arrYear;
          dataProjection[1] = arrAdjAge;
          dataProjection[2] =
            //arrEOYBalance;

            arrFMV;
          dataProjection[3] = arrACB;
          dataProjection[4] = arrDispositionAmount;
          dataProjection[5] = arrCapGainsExemption;
          dataProjection[6] = arrCapitalGain;
          dataProjection[7] = arrTaxPayable;
        }
      } else if (
        assetCurr.assetTypeKey === ASSETS.INTEREST_BEARING.Key ||
        assetCurr.assetTypeKey === ASSETS.STOCKS_BONDS.Key ||
        assetCurr.assetTypeKey === ASSETS.TFSA.Key
      ) {
        if (APPLET_INA) {
          dataColTitles = [
            title.Year,
            title.Age,
            title.FMV,
            title.AnnualContribution,
            title.Withdrawal,
            title.EOYBalance,
          ];
          dataProjection[0] = arrYear;
          dataProjection[1] = arrAdjAge;
          dataProjection[2] = arrFMV;
          dataProjection[3] = arrDeposits;
          dataProjection[4] = arrWithdrawals;
          dataProjection[5] = arrEOYBalance;
        } else {
          dataColTitles = [
            title.Year,
            title.Age,
            title.FMV,
            title.AnnualContribution,
            title.Withdrawal,
            title.Taxonincome,
            title.EOYBalance,
            title.TaxLiability,
          ];
          dataProjection[0] = arrYear;
          dataProjection[1] = arrAdjAge;
          dataProjection[2] = arrFMV;
          dataProjection[3] = arrDeposits;
          dataProjection[4] = arrWithdrawals;
          dataProjection[5] = arrTaxPayableonIncome;
          dataProjection[6] = arrEOYBalance;
          dataProjection[7] = arrTaxPayable;
          if (assetCurr.assetTypeKey === ASSETS.STOCKS_BONDS.Key) {
            dataColTitles = [
              title.Year,
              title.Age,
              title.FMV,
              title.ACB,
              title.AnnualContribution,
              title.Withdrawal,
              title.SaleProceeds,
              title.CapitalGain,
              title.EOYBalance,
              title.TaxLiability,
            ];
            dataProjection[0] = arrYear;
            dataProjection[1] = arrAdjAge;
            dataProjection[2] = arrFMV;
            dataProjection[3] = arrACB;
            dataProjection[4] = arrDeposits;
            dataProjection[5] = arrWithdrawals;
            dataProjection[6] = arrDispositionAmount;
            dataProjection[7] = arrCapitalGain;
            dataProjection[8] = arrEOYBalance;
            dataProjection[9] = arrTaxPayable;
          }
        }

        //  arrTaxPayable;
      } else {
        if (APPLET_INA) {
          dataColTitles = [title.Year, title.Age, title.FMV, title.EOYBalance];

          dataProjection[0] = arrYear;
          dataProjection[1] = arrAdjAge;
          dataProjection[2] = arrFMV;
          dataProjection[3] = arrEOYBalance;
        } else {
          dataColTitles = [
            title.Year,
            title.Age,
            title.FMV,
            title.EOYBalance,
            title.Withdrawal,
            title.TaxLiability,
          ];

          dataProjection[0] = arrYear;
          dataProjection[1] = arrAdjAge;
          dataProjection[2] = arrFMV;
          dataProjection[3] = arrEOYBalance;
          dataProjection[4] = arrWithdrawals;
          dataProjection[5] = arrTaxPayable;
        }
      }
    }
    return { dataColTitles, dataProjection, gridTitle };
  }
}
