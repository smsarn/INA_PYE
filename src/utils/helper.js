import { version } from "../../package.json";
import {
  GROWTHDIR,
  MEMBER,
  LIABILITIES,
  APPLET_EP,
  APPLET_INA,
  PROVINCE,
  SEX,
  SMOKING
} from "../definitions/generalDefinitions";
// import XLSX from "xlsx";
import React from "react";
import { fetchMCCData, fetchAssetProjection2 } from "../utils/FetchAPIs";
import { readMCCData } from "../data/dataExchangeMCC";
import {
  ASSET_API_OUTPUT_TaxPayable,
  QUOTE_CLIENT,
  QUOTE_SPOUSE,
} from "../definitions/generalDefinitions";
import { OUTPUTTEXT } from "../definitions/outputDefinitions";
import { OUTPUTTEXTEP } from "../definitions/outputDefinitionsEP";
import {
  DISPLAY_RETIREMENT,
  DISPLAY_LIFEEXP,
  DISPLAY_ENDAGE,
  DISPLAY_LIFEEXP_PLUS_3,
  DISPLAY_ANALYSIS,
  OUTPUT_WIDTH_PCT,
  IMAGE_LOGO_OTHERPAGES,
  IMAGE_LOGO,
  IMAGE_APPLET_INA,
  IMAGE_APPLET_EP,
  TITLES,
} from "../definitions/generalDefinitions";
import { AdjustibleImage } from "../components/AdjustibleImage";

// copy instead re lazyloading
//import { MAX_LOGO_HEIGHT, PAGE_HEIGHT } from "../components/PDF";
const PAGE_HEIGHT = 11;
const MAX_LOGO_HEIGHT = 0.38;

global.langFr =
  (
    (navigator.languages && navigator.languages[0]) ||
    navigator.language ||
    navigator.userLanguage
  )
    .toString()
    .indexOf("fr") >= 0;

export function cleanFormat(value, lang) {
  if (value !== null) {
    if (value !== undefined) {
      if (lang === undefined) lang = "en";
      if (!EngToFrConversion(value) && lang === "fr")
        return value
          .toString()
          .replace(",", ".")
          .replace("$", "")
          .replace("%", "")
          .replace(/ /g, "")
          .replace(" ", "")
          .replace(
            /[\u00A0\u1680​\u180e\u2000-\u2009\u200a​\u200b​\u202f\u205f​\u3000]/g,
            ""
          );
      else
        return value
          .toString()
          .replace(/,/g, "")
          .replace("$", "")
          .replace("%", "")
          .replace(/ /g, "")
          .replace(" ", "")
          .replace(
            /[\u00A0\u1680​\u180e\u2000-\u2009\u200a​\u200b​\u202f\u205f​\u3000]/g,
            ""
          );
    }
  }
}

function EngToFrConversion(amt) {
  let nSeperator = amt.toString().search(",");
  if (nSeperator < 0) return false;
  else {
    let s1 = amt;
    while (nSeperator >= 0) {
      s1 = s1.toString().substring(nSeperator + 1, parseInt(s1.length));
      nSeperator = s1.toString().search(",");
    }
    if (s1.length >= 3) return true;
    else return false;
  }
}

export function isMobileDevice() {
  return (
    typeof window.orientation !== "undefined" ||
    navigator.userAgent.indexOf("IEMobile") !== -1
  );
}

export function numFormat(v, bInput, mode, seperator, decimalChar) {
  var v1;
  var v2;
  var v3;

  var formatted;
  const lang = decimalChar === "." || decimalChar === undefined ? "en" : "fr";
  //const seperator = this.props.language === "en" ? "," : " ";
  //console.log(v);
  if (typeof v !== "undefined") {
    //console.log(v);
    v = cleanFormat(v, lang);
    if (mode !== 3) v = parseInt(v).toFixed(0);

    if (mode === 3 && bInput) {
      if (v[v.length - 1] === ".") v = v.substring(0, v.length - 1);
      else {
        if (v.length > 1) v = (v * 10).toFixed(2);
        if (v > 100) v = (v / 10).toFixed(2);
      }
    }

    //console.log(v);
    v1 = get1000(v);
    v2 = get1000((v - v1) / 1000);
    v3 = parseInt((v - v1 - 1000 * v2) / 1000000);

    if (v2 > 0 || v3 > 0) {
      v = v2 + seperator + (v1 > 99 ? v1 : v1 > 10 ? "0" + v1 : "00" + v1);
      if (v3 > 0)
        v =
          v3 +
          seperator +
          (v2 > 99 ? v2 : v2 > 10 ? "0" + v2 : "00" + v2) +
          seperator +
          (v1 > 99 ? v1 : v1 > 10 ? "0" + v1 : "00" + v1);
    }

    if (mode === 3) {
      if (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )
      )
        formatted = parseFloat(Math.round(v * 100) / 100).toFixed(2);
      else {
        formatted = parseFloat(
          Math.round(100 * v) / 100 / (v.length === 1 && bInput ? 100 : 1)
        ); // + '%';
        formatted = formatted > 100 ? 100 : formatted;
        formatted = formatted.toFixed(2) + "%";
        if (decimalChar !== undefined) {
          if (formatted.includes("."))
            formatted = formatted.replace(".", decimalChar);
        }
      }
    } else if (mode === 4) {
      formatted =
        25 * parseInt(parseFloat(Math.round(v * 100) / 100).toFixed(0) / 25);
      if (formatted < 100) formatted = 100;
      if (formatted > 400) formatted = 400;
      if (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )
      )
        formatted = formatted;
      else formatted = formatted + "%";
    } else if (mode === 2) formatted = "$" + v;
    else formatted = v;
  }
  if (isNaN(cleanFormat(formatted, lang))) formatted = 0;
  return formatted;
}

//valueChanged = (num, mode) => {
//	let seperator = this.props.language === "en" ? "," : " ";
//	var v = num.value.replace('$', '').replace('%', '').replace(seperator, '');
//	num.value = this.numFormat(v);
//}

function get1000(num) {
  return parseFloat(num) - 1000 * parseInt(num / 1000);
}

export function formatMoney(amount, decimalCount, decimal, thousands) {
  try {
    const lang = decimal === "." || decimal === undefined ? "en" : "fr";

    cleanFormat(amount, lang);
    decimalCount = Math.abs(decimalCount);
    decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

    const negativeSign = amount < 0 ? "-" : "";

    let i = parseFloat(
      (amount = Math.abs(Number(amount) || 0).toFixed(decimalCount))
    ).toString();

    let j = i.length > 3 ? i.length % 3 : 0;

    return (
      negativeSign +
      (j ? i.substr(0, j) + thousands : "") +
      i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) +
      (decimalCount
        ? decimal +
          Math.abs(amount - i)
            .toFixed(decimalCount)
            .slice(2)
        : "")
    );
  } catch (e) {
    //	console.log(e);
  }
}

export function formatMoney2(amount, decimalCount, lang, dollarSign) {
  const decimalChar = lang === "en" ? "." : ",";
  const thousands = lang === "en" ? "," : " ";
  // const formatFr = lang === "fr" ? true : false;

  try {
    cleanFormat(amount, lang);
    decimalCount = Math.abs(decimalCount);
    decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

    const negativeSign = amount < 0 ? "-" : "";

    let i = parseFloat(
      (amount = Math.abs(Number(amount) || 0).toFixed(decimalCount))
    ).toString();

    let j = i.length > 3 ? i.length % 3 : 0;

    const returnValue = (
      negativeSign +
      (lang === "en" && dollarSign ? "$" : "") +
      (j ? i.substr(0, j) + thousands : "") +
      i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) +
      (decimalCount
        ? decimalChar +
          Math.abs(amount - i)
            .toFixed(decimalCount)
            .slice(2)
        : "") +
      (lang === "fr" && dollarSign ? " $" : "")
    ).toString();

    return returnValue;
  } catch (e) {
    //	console.log(e);
  }
}

export function arrayFormatMoney(array, language, noOfDecimals) {
  let arrayFormatted = [];

  for (let i = 0; i < array.length; i++) {
    arrayFormatted[i] = formatMoney2(
      array[i],
      noOfDecimals,
      language,
      false
      /* decimalChar,
      thousands */
    );
  }
  // console.log(arrayFormatted,array)
  return arrayFormatted;
}

export function clearListCookies() {
  // console.log(document.cookie);
  var cookies = document.cookie.split(";");
  for (var i = 0; i < cookies.length; i++) {
    var spcook = cookies[i].split("=");
    deleteCookie(spcook[0]);
  }
  function deleteCookie(cookiename) {
    var d = new Date();
    d.setDate(d.getDate() - 1);
    var expires = ";expires=" + d;
    var name = cookiename;
    var value = "";
    document.cookie = name + "=" + value + "; " + expires + "; path=/acc/html";
  }
  localStorage.clear();
  //window .location = ""; // TO REFRESH THE PAGE
}

export function isVersion2019() {
  const ver = version;
  let verNo = 0;
  let inS = ver.indexOf(".");
  verNo = ver.substring(0, inS);
  let verS = num(Number(verNo));
  let inS2 = ver.indexOf(".", inS + 1);
  verNo = ver.substring(inS + 1, inS2);
  verS += num(Number(verNo));
  verNo = ver.substring(inS2 + 1, ver.length);
  verS += num(Number(verNo));

  return Number(verS) <= 10002;
}

export function versionDetails() {
  const ver = version;
  let verNo = 0;
  let inS = ver.indexOf(".");
  verNo = ver.substring(0, inS);
  let verS = num(Number(verNo));
  let inS2 = ver.indexOf(".", inS + 1);
  verNo = ver.substring(inS + 1, inS2);
  verS += num(Number(verNo));
  verNo = ver.substring(inS2 + 1, ver.length);
  verS += num(Number(verNo));
  let versionNumeric = Number(verS);

  // 1.0.4
  let allowEmail = false;
  let saveEncrypt = versionNumeric >= 10003 ? true : false;
  let allowAnalysis = versionNumeric > 10004 ? true : false;
  // 1.0.5
  allowEmail = true;
  saveEncrypt = true;
  allowAnalysis = true;
  let verDetails = {
    version: ver,
    versionNumeric: versionNumeric,
    allowEmail: allowEmail,
    saveEncrypt: saveEncrypt,
    allowAnalysis: allowAnalysis,
  };
  // 1.0.6
  allowEmail = true;
  saveEncrypt = true;
  allowAnalysis = false;
  verDetails = {
    version: ver,
    versionNumeric: versionNumeric,
    allowEmail: allowEmail,
    saveEncrypt: saveEncrypt,
    allowAnalysis: allowAnalysis,
  };
  return verDetails;
}

function num(n) {
  return n > 9 ? "" + n : "0" + n;
}

/* 16
 */
/* 
export function INAAssetSpreadsheetData(asset, taxRate, Spouse, inflation,language) {
  let dataColumns = [];
  let dataColumn = [];
  let noYrs = 100 - Spouse.Age;

  let i;
  let j;

  for (i = 0; i < 4; i++) {
    dataColumn = [];
    for (j = 0; j < noYrs; j++) {
      if (i === 0) dataColumn.push(1 + j);
      else if (i === 1) dataColumn.push(Spouse.Age + j);
      else if (i === 2)
        dataColumn.push(numFormat(asset.currValue * 1.03,   language==="en"?false:true, 2, language==="en"?",":" "));
      else if (i === 3)
        dataColumn.push(
          numFormat(
            (asset.currValue * 1.03 - asset.ACB) * taxRate,
            language==="en"?false:true, 2, language==="en"?",":" "
          )
        );
    }
    dataColumns.push(dataColumn);
    dataColumn = [];
  }

  //console.log(dataColumns);
  return dataColumns;
}
 */ /* 
export function handleCSVDownload2() {
  var de = document.getElementById("DExcel");
  de.setAttribute("downloadNow", "1");
}

export function handleCSVDownload(data, columns) {
  const CSVHead =
    columns
      .reduce((soFar, column) => soFar + '"' + column.name + '",', "")
      .slice(0, -1) + "\r\n";
  const CSVBody = data
    .reduce((soFar, row) => soFar + '"' + row.data.join('","') + '"\r\n', [])
    .trim();




  // taken from react-csv 
  const csv = `${CSVHead}${CSVBody}`;
  const blob = new Blob([csv], { type: "text/csv" });
  const dataURI = `data:text/csv;charset=utf-8,${csv}`;

  const URL = window.URL || window.webkitURL;
  const downloadURI =
    typeof URL.createObjectURL === "undefined"
      ? dataURI
      : URL.createObjectURL(blob);

  let link = document.createElement("a");
  link.setAttribute("href", downloadURI);
  link.setAttribute("download", "tableDownload.csv");
  // document.body.appendChild(link);
  //  link.click();
   // document.body.removeChild(link); 
    const XLSX = React.lazy(() => import('xls'));

  const workbook = XLSX.utils.book_new();
  workbook.SheetNames.push("T1");
  var d = [["hey", "goh"]];
  var v = XLSX.utils.aoa_to_sheet(d);
  workbook.Sheets["T1"] = v;
  const worksheet = XLSX.utils.aoa_to_sheet(
    [columns.map((r) => r.name)].concat(data.map((r) => r.data))
  );

  //	worksheet.cells(10,10).value=3333333
  XLSX.utils.book_append_sheet(workbook, worksheet, "Tabela Exportada");
  XLSX.writeFile(workbook, "TabelaExportada.xls", { compression: true });
} */

export function INAMCCQuote() {
  let MCC = async function (input, insuranceNeed) {
    const minPrem = await getMCCQuoteOutput1(input, insuranceNeed);
    const MCCData = await getMCCQuoteOutput2(input, insuranceNeed, minPrem);
    // console.log(minPrem);
    return MCCData;
  };

  // console.log(MCC);
  return MCC;
}

/* function getMCCQuoteOutput(){
  		return Promise.all([getMCCQuoteOutput1(),getMCCQuoteOutput2()])
	} */

function getMCCQuoteOutput1(input, insuranceNeed) {
  let quotePlanID = 48;
  let quoteClient = 1; //
  let dataMCC = readMCCData(input, quotePlanID, quoteClient, insuranceNeed);

  //let dataAPISite = "http://localhost:8082";
  fetchMCCData(dataMCC, insuranceNeed).then((data) => {
    // console.log(data[0]);
    if (data[0][1] !== undefined) {
      console.log("POST: MCC_OutputArrays success");
      return data[0];
    }
  });
}

function getMCCQuoteOutput2(input, insuranceNeed, minPrem) {
  let dataDB = [];
  let quotePlanID = 48;
  let quoteClient = 1; //
  //let dataAPISite = "http://localhost:8082";
  let dataMCC = readMCCData(input, quotePlanID, quoteClient, insuranceNeed);

  dataMCC.policy.objPremium.PremSet = true;
  dataMCC.policy.objPremium.PremSetAmt = minPrem;
  dataMCC.policy.objPremium.PremSetDur = 19;
  dataMCC.policy.objPremium.PremSolve = false;
  fetchMCCData(dataMCC, insuranceNeed).then((data) => {
    //console.log(data[0]);
    if (data[0][1] !== undefined) {
      //console.log("POST: MCC_OutputArrays success");
      dataDB = data[0][3].Values.map((x) => parseInt(cleanFormat(x)));
      dataDB.unshift(parseInt(cleanFormat(insuranceNeed)));
      return dataDB;
    }
  });
}

export function getProjectedLiabilities(dataInput, years, probate) {
  let i;
  let j;
  var totalLiabProjections = [];
  for (i = 0; i < years; ++i) totalLiabProjections.push(0);
  // add probate seperately
  for (j = 0; j < dataInput.Liabilitys.length; j++) {
    if (dataInput.Liabilitys[j].liabTypeKey !== LIABILITIES.PROBATE.Key) {
      const liabProj = getProjectedLiability(dataInput.Liabilitys[j]);
      for (i = 0; i < Math.min(years, liabProj.length); ++i)
        totalLiabProjections[i] += liabProj[i];
    }
  }
  //console.log(probate.numericValues,years, probate.length)
  // add probate
  if (probate !== undefined) {
    for (i = 0; i < Math.min(years, probate.numericValues.length); ++i)
      totalLiabProjections[i] += probate.numericValues[i];
    // console.log(probate.numericValues[i],totalLiabProjections[i])
  }

  return totalLiabProjections;
}

export function getProjectedLiability(liability, probate) {
  let i;
  var totalLiab = 0;
  var totalLiabProjections = [];

  if (
    liability.liabTypeKey === LIABILITIES.OUTSTANDING_LOANS.Key ||
    liability.liabTypeKey === LIABILITIES.MORTGAGE_REDEMPTION.Key
  ) {
    let amt = liability.currValue;
    totalLiabProjections.push(Math.round(amt));
    liability.growth = getLoanBalance(
      liability.currValue,
      liability.exposureDur,
      liability.repay
    );
    //console.log(liability.growth);
    for (i = 0; i < liability.exposureDur; ++i) {
      amt = (amt - liability.repay) * (1 + liability.growth);
      totalLiabProjections.push(Math.round(amt));
    }
  } else if (liability.liabTypeKey === LIABILITIES.CLIENT_TAX_LIABILITY.Key) {
    //console.log(liability.assetTaxLiabProj)
    let amt = liability.currValue;
    totalLiabProjections.push(Math.round(amt));
    for (i = 1; i < liability.exposureDur; ++i) {
      amt = liability.assetTaxLiabProj[i];
      totalLiabProjections.push(Math.round(amt));
    }
  } else if (liability.liabTypeKey === LIABILITIES.PROBATE.Key) {
    if (probate === undefined) {
      for (i = 0; i < liability.exposureDur; ++i) {
        const amt = i < liability.exposureDur ? liability.currValue : 0;
        totalLiab = amt;
        totalLiabProjections.push(totalLiab);
      }
    } else {
      for (i = 0; i < liability.exposureDur; ++i) {
        totalLiab = probate.numericValues[i];
        totalLiabProjections.push(totalLiab);
      }
    }
  } else {
    for (i = 0; i < liability.exposureDur; ++i) {
      const amt = i < liability.exposureDur ? liability.currValue : 0;
      const change =
        //liability.growthDir === GROWTHDIR[lang].Values[0]
        liability.growthDirKey === GROWTHDIR.GROWS.Key
          ? liability.growth / 100
          : -liability.growth / 100;
      totalLiab = amt * Math.pow(1 + change, i);
      totalLiabProjections.push(totalLiab);
    }
  }

  return totalLiabProjections;
}

function getLoanBalance(currValue, exposureDur, repay) {
  //console.log(currValue,exposureDur,repay)
  let rate = 0.1;
  let dU = 0.2;
  let dL = 0; //-.1111111;
  let dBal = 1;

  while (dU - dL > 0.0000001) {
    dBal =
      (currValue - repay) * Math.pow(1 + rate, exposureDur) -
      (repay * (1 + rate) * (1 - Math.pow(1 + rate, exposureDur - 1))) / -rate;

    if (dBal > 0) dU = rate;
    else dL = rate;

    rate = (dL + dU) / 2;
  }

  return rate;
}

export function getINA_LifeExp_Plus_yrs(
  INALifeExp,
  dataShortfall,
  invRate,
  lifeExp,
  yrs
) {
  let i;
  let INA = INALifeExp;

  for (i = 0; i < yrs; ++i) {
    INA =
      parseInt(INA) +
      parseInt(
        dataShortfall[lifeExp + i] *
          Math.pow(1 / (1 + invRate / 100), lifeExp + i)
      );
  }

  //console.log(INA)
  return numFormat(INA, false, 2, ",");
}

export function getDataFutureEstateLiability(
  dataTaxLiability,
  totalLiabProjections
) {
  let i;
  let projectEnd = Math.min(
    totalLiabProjections.length,
    dataTaxLiability.length
  );
  let dataFutureEstateLiability = [];

  for (i = 0; i < projectEnd; ++i) {
    dataFutureEstateLiability.push(dataTaxLiability[i]);
  }
  // add liab
  for (i = 0; i < projectEnd; ++i) {
    dataFutureEstateLiability[i] += totalLiabProjections[i];
  }
  return dataFutureEstateLiability;
}

export function getListToShowByOrder(fullListOfItems) {
  const showableList = Object.values(fullListOfItems)
    .filter((obj) => obj.order > 0)
    .slice(0);

  return showableList.sort(function (a, b) {
    return a.order - b.order;
  });
}

export function getListItemNameFromKey(list, Key, lang) {
  let found = Object.values(list).find((obj) => obj.Key === Key);
  if (found === undefined) found = "";
  else found = found.value[lang];
  return found;
}

export function getListItemKeyFromName(list, name) {
  // console.log(name,list)
  name = name.split(" ").join("").split(" ").join("");
  /*  Object.values(list).forEach(
    obj => console.log(obj.value.en.split(" ").join("").split(" ").join(""),name,obj.value.en==name))
   */

  let found = Object.values(list).find(
    (obj) =>
      obj.value.en.split(" ").join("").split(" ").join("") == name ||
      obj.value.fr.split(" ").join("").split(" ").join("") == name
  );
  if (found === undefined) found = 0;
  else found = found.Key;
  return found;
}

export function getAssetsTaxCategoryTotal(dataInput, key) {
  var totalAsset = 0;
  dataInput.Assets.forEach((element) => {
    if (element.assetTaxTypeKey === key) totalAsset += element.currValue;
  });

  return totalAsset;
}

export function getDisableValues(list) {
  let val = [];
  Object.values(list).forEach(() => {
    val.push(false);
  });
  return val;
}

export function getAssetsCategoryTotal(dataList, key) {
  var total = 0;
  dataList.Assets.forEach((element) => {
    if (element.assetTypeKey === key) total += element.currValue;
  });
  // // console.log(total,dataList,key)
  return total;
}

export function getLiabsCategoryTotal(dataList, key) {
  var total = 0;
  dataList.Liabilitys.forEach((element) => {
    if (element.liabTypeKey === key) total += element.currValue;
  });
  // console.log(total,dataList,key)
  return total;
}

export function getAgesEP(clients, LE) {
  const age1 = clients[QUOTE_CLIENT].Age;

  let dataAges = [];
  //for (let i = startAge; i < parseFloat(startAge + LE + 4); i++)
  if (clients.length > 1) {
    const age2 = clients[QUOTE_SPOUSE].Age;
    for (let i = 0; i < parseFloat(LE + 4); i++)
      dataAges.push(parseInt(age1 + i) + "/" + parseInt(age2 + i));
  } else {
    for (let i = 0; i < parseFloat(LE + 4); i++)
      dataAges.push(parseInt(age1 + i));
  }

  return dataAges;
}

export async function getTaxLiabCategoryTotal(dataInput, key, dataNA, yr) {
  //let appSiteAPI = "http://localhost:8082";

  var totalAsset = 0;

  let dataAss = dataInput.Assets.filter(
    (obj) => obj.assetTaxTypeKey === key
  ).slice(0);

  //await dataInput.Assets.forEach(async (element) => {
  // if(element.assetTaxTypeKey === key)
  //{
  for (var i = 0; i < dataAss.length; ++i) {
    let data = await getAssetTL(dataNA, dataAss[i].id, yr);
    if (data !== undefined) {
      totalAsset += data;
    }
  }
  return totalAsset;
}

async function getAssetTL(dataNA, id, yr) {
  let data = await fetchAssetProjection2(dataNA, id);
  if (data !== undefined) {
    if (data[ASSET_API_OUTPUT_TaxPayable] !== undefined) {
      return data[ASSET_API_OUTPUT_TaxPayable].numericValues[yr];
    }
  }
}

export function getDefaultImages() {
  return {
    adviserLogo: {
      image: null,
      left: 0,
      size: OUTPUT_WIDTH_PCT,
      allPages: false,
      top: true,
      showDetails: false,
    },
    appletImage: {
      image: APPLET_INA
        ? require("../images/INA.png")
        : require("../images/estate.protection.applet.cover.graphic.png"),
      left: 0,
      size: OUTPUT_WIDTH_PCT,
      allPages: false,
      top: true,
      showDetails: false,
    },
  };
}

export function getAfterTaxTotalIncome(clients, index) {
  return (
    clients[QUOTE_CLIENT].Income *
      (1 - clients[QUOTE_CLIENT].avgTaxRate / 100) +
    clients[index].Income * (1 - clients[index].avgTaxRate / 100)
  ); //* Math.pow(1+this.state.dataInput.Presentations[0].inflation / 100,data2.Needs[i].startYear)
}

export function isSingleFamily(clients) {
  const spouseKey = MEMBER.SPOUSE.Key;
  let survivors = clients.filter((x) => x.memberKey === spouseKey);
  if (APPLET_INA) return survivors === undefined || survivors.length === 0;
  else if (APPLET_INA) return false;
}

export function singleFamilyProjectionYears(clients) {
  let minAge = 0;
  let maxRet = 0;
  let noYrs = 0;
  const clientKey = MEMBER.CLIENT.Key;
  let survivors = clients.filter((x) => x.memberKey !== clientKey);
  if (survivors !== undefined && survivors.length > 0) {
    minAge = survivors.reduce(function (prev, curr) {
      return prev.Age < curr.Age ? prev : curr;
    }).Age;

    maxRet = survivors.reduce(function (prev, curr) {
      return prev.retirementAge > curr.retirementAge ? prev : curr;
    }).retirementAge;

    let noYrsDiff = survivors.reduce(function (prev, curr) {
      return prev.Age - prev.retirementAge < curr.Age - curr.retirementAge
        ? prev
        : curr;
    });
    noYrs = noYrsDiff.retirementAge - noYrsDiff.Age;
  } else {
    maxRet = clients[0].retirementAge;
    minAge = clients[0].Age;
    noYrs = clients[0].retirementAge - clients[0].Age;
  }
  return {
    projectionEnd: maxRet,
    noProjectionYrs: noYrs, //maxRet - minAge,
    survivorAge: minAge,
  };
}

export function familyProjectionYears(
  clients,
  periodOption,
  LE,
  insuranceNeeds,
  dataShortfall,
  presentation
) {
  let insNeed = 0;
  let insNeedRet = 0;
  let insNeedLE = 0;
  let insNeedLE3 = 0;
  let insNeedEAge = 0;

  if (insuranceNeeds.length > 0) {
    insNeedRet = cleanFormat(
      insuranceNeeds[DISPLAY_RETIREMENT].Value,
      presentation.language
    );
    insNeedLE = cleanFormat(
      insuranceNeeds[DISPLAY_LIFEEXP].Value,
      presentation.language
    );
    insNeedEAge = cleanFormat(
      insuranceNeeds[DISPLAY_ENDAGE].Value,
      presentation.language
    );
    const lifeExp = parseFloat(cleanFormat(LE.joint, presentation.language)); // this is either client or jltd if two lives

    insNeed =
      periodOption === DISPLAY_RETIREMENT
        ? insNeedRet
        : periodOption === DISPLAY_LIFEEXP
        ? insNeedLE
        : periodOption === DISPLAY_LIFEEXP_PLUS_3
        ? getINA_LifeExp_Plus_yrs(
            insNeedLE,
            dataShortfall,
            presentation.invRate,
            //LE.spouse,
            lifeExp, // this is either client or jltd if two lives
            3
          )
        : insNeedEAge;

    insNeedLE3 =
      dataShortfall !== undefined
        ? getINA_LifeExp_Plus_yrs(
            insNeedLE,
            dataShortfall,
            presentation.invRate,
            lifeExp,
            3
          )
        : insNeed;
  }

  // if single family survivor Index could be more than on child, otherwise it is always 1 for spouse
  if (isSingleFamily(clients) && !APPLET_EP) {
    let singleFamilyvalues = singleFamilyProjectionYears(clients);
    singleFamilyvalues.insuranceNeed = insNeedRet;
    singleFamilyvalues.insuranceNeedToRet = insNeedRet;
    singleFamilyvalues.insuranceNeedToLE = insNeedRet;
    singleFamilyvalues.insuranceNeedToLE3 = insNeedRet;
    singleFamilyvalues.insuranceNeedToEnd = insNeedRet;
    return singleFamilyvalues;
  } else {
    let projectEnd = 65;
    let noProjectYrs = 0;
    let noProjectYrsRet = 0;
    let noProjectYrsLE = 0;
    let noProjectYrs100 = 0;
    let survAge;
    const survIdx = 1; // spouse

    if (APPLET_EP) {
      // survivorExists or EP
      if (clients.length === 1) {
        projectEnd = LE.client + clients[QUOTE_CLIENT].Age + 3;
        noProjectYrs = projectEnd - clients[QUOTE_CLIENT].Age;
        survAge = clients[QUOTE_CLIENT].Age;

        noProjectYrsRet = noProjectYrs;
        noProjectYrsLE = noProjectYrs;
        noProjectYrs100 = noProjectYrs;
    
      } // jltd
      else {
        const minAge = Math.min(
          clients[QUOTE_CLIENT].Age,
          clients[QUOTE_SPOUSE].Age
        );
        projectEnd = LE.joint + minAge + 3;
        noProjectYrs = projectEnd - minAge;
        survAge = minAge;

        noProjectYrsRet = noProjectYrs;
        noProjectYrsLE = noProjectYrs;
        noProjectYrs100 = noProjectYrs;
    
      }
    } 
    else if (clients.length > 1) {
      // survivorExists or EP
      projectEnd =
        periodOption === DISPLAY_RETIREMENT
          ? clients[survIdx].retirementAge
          : periodOption === DISPLAY_LIFEEXP
          ? LE.spouse + clients[survIdx].Age
          : periodOption === DISPLAY_ANALYSIS
          ? LE.joint + clients[survIdx].Age + 3
          : 100;
      noProjectYrs = projectEnd - clients[survIdx].Age;

        noProjectYrsRet = clients[survIdx].retirementAge - clients[survIdx].Age;
        noProjectYrsLE = LE.spouse;
        noProjectYrs100 = 100- clients[survIdx].Age;
    
      
      survAge = clients[survIdx].Age;
    } else {
      survAge = clients[QUOTE_CLIENT].Age;
      noProjectYrs = 0;
    }
    return {
      projectionEnd: projectEnd,
      noProjectionYrs: noProjectYrs,
      noProjectYrsRet:noProjectYrsRet,
        noProjectYrsLE:noProjectYrsLE,
        noProjectYrs100:noProjectYrs100,
      survivorAge: survAge,
      insuranceNeed: insNeed,
      insuranceNeedToRet: insNeedRet,
      insuranceNeedToLE: insNeedLE,
      insuranceNeedToLE3: insNeedLE3,
      insuranceNeedToEnd: insNeedEAge,
    };
  }
}

export function getInsNeedLine(
  presentation,
  projEnd,
  lang,
  numSurvivor,
  singleFamily,
  protectionPeriod,
  insuranceNeed,
  name
) {
  const labelsBilingual = OUTPUTTEXT[lang];
  const decimalChar = lang === "en" ? "." : ",";
  const thousands = lang === "en" ? "," : " ";
  // const formatFr = lang === "fr" ? true : false;
  const dollarEn = lang === "fr" ? "" : "$";
  const dollarFr = lang === "fr" ? "$" : "";

  let needTo =
    presentation.periodOption === DISPLAY_RETIREMENT
      ? singleFamily
        ? numSurvivor > 0
          ? labelsBilingual.insNeedsSingleFamily
          : labelsBilingual.insNeedsSinglePerson
        : labelsBilingual.insNeedsRet
      : presentation.periodOption === DISPLAY_ENDAGE
      ? labelsBilingual.insNeeds100
      : labelsBilingual.insNeedsRetLE;

  if (false && numSurvivor === 0) // treat as 0 insurance need 
    needTo = labelsBilingual.addSurvivor;
  else if (singleFamily)
    needTo +=
      +protectionPeriod +
      labelsBilingual.years +
      ": " +
      dollarEn +
      formatMoney(cleanFormat(insuranceNeed, lang), 0, decimalChar, thousands) +
      dollarFr;
  else if (presentation.periodOption !== DISPLAY_ENDAGE)
    needTo +=
      +projEnd +
      "): " +
      dollarEn +
      formatMoney(cleanFormat(insuranceNeed, lang), 0, decimalChar, thousands) +
      dollarFr;
  else
    needTo +=
      ": " +
      dollarEn +
      formatMoney(cleanFormat(insuranceNeed, lang), 0, decimalChar, thousands) +
      dollarFr;
  if (name !== "" && name !== undefined && name !== TITLES[lang].insured)
    needTo += "  (" + name + ")";
  return needTo;
}

export function getInsNeedLineEP(
  taxOnly,
  atLE,
  lang,
  insuranceNeed,
  name
) {
  const labelsBilingual = OUTPUTTEXT[lang];
  const decimalChar = lang === "en" ? "." : ",";
  const thousands = lang === "en" ? "," : " ";
  // const formatFr = lang === "fr" ? true : false;
  const dollarEn = lang === "fr" ? "" : "$";
  const dollarFr = lang === "fr" ? "$" : "";

  let needTo = (taxOnly ?(atLE?"Insurance Needs to cover Tax Liabilities at Life Expectancy":"Insurance Needs to cover Tax Liabilities Today"):
  (atLE?"Insurance Needs to cover All Liabilities at Life Expectancy":"Insurance Needs to cover All Liabilities Today"))

    needTo += ": " 
      +
      dollarEn +
      formatMoney(cleanFormat(insuranceNeed, lang), 0, decimalChar, thousands) +
      dollarFr;
  if (name !== "" && name !== undefined && name !== TITLES[lang].insured)
    needTo += "  (" + name + ")";
  return needTo;
}

export function getName(name, lang) {
  if (
    !(
      name === "" ||
      name === undefined ||
      name === TITLES[lang].insured ||
      name === TITLES[lang].benef
    )
  )
    return " (" + name + ")";
  else return "";
}

export function formatted(value, lang) {
  const decimalChar = lang === "en" ? "." : ",";
  const thousands = lang === "en" ? "," : " ";

  const formattedValue =
    (lang === "en" ? "$" : "") +
    formatMoney(value, 0, decimalChar, thousands) +
    (lang === "en" ? "" : "$");

  return formattedValue;
}

export function getLeakageGraphs(
  assets,
  assetProjections,
  AssetLiabProjs,
  totalLiabProjections,
  lang,
  lifeExp
) {
  const optionsPie = {
    responsive: true,
    maintainAspectRatio: true,
    title: {
      display: true,
      position: "top",
      text: "",
      fontSize: 14, //8,
      fontColor: "#111",
    },
    legend: {
      display: true,
      position: "right",
      labels: {
        fontColor: "#333",
        fontSize: 12, //16
      },
    },
    /*  plugins: {
      // Change options for ALL labels of THIS CHART
      display: true,
      datalabels: {
        color: "white",
      },
    },  */
  };

  const space = "                                       ";
  let optionsPieEstateLeakage = JSON.parse(JSON.stringify(optionsPie));
  optionsPieEstateLeakage.title.text =
    OUTPUTTEXTEP[lang].graphsLeakageT2 + space;
  //optionsPieEstateLeakage.legend.labels.boxWidth = 20;
  //optionsPieEstateLeakage.plugins.display = true;

  let optionsPieEstateLeakageLE = JSON.parse(JSON.stringify(optionsPie));
  optionsPieEstateLeakageLE.title.text =
    OUTPUTTEXTEP[lang].graphsLeakageT3 + space; // needTo += +this.props.projectEnd + ")";
  // optionsPieEstateLeakageLE.legend.labels.boxWidth = 20;
  //optionsPieEstateLeakageLE.plugins.display = true;

  // asset info
  let assetsTotalNow = 0;
  let assetsTotalLE3 = 0;
  // const formatFr = lang === "fr" ? true : false;
  const FMVCol = 2;
  for (let i = 0; i < assets.length; ++i) {
    assetsTotalNow += assets[i].currValue;
    assetsTotalLE3 += parseFloat(
      cleanFormat(
        assetProjections[i].grid.dataProjection[FMVCol][lifeExp + 3],
        lang
      )
    );
  }

  // liab info
  const totalLiabProjectionsNow = parseInt(totalLiabProjections[0]);
  const totalLiabProjectionsLE3 = parseInt(totalLiabProjections[lifeExp + 3]);

  // leakage data
  // use net worth as full circle in pie chart
  const assetPercent =
    assetsTotalNow - totalLiabProjectionsNow === 0
      ? 0
      : parseInt(
          (100 *
            (assetsTotalNow -
              totalLiabProjectionsNow -
              AssetLiabProjs.EstateLiabsByTypeTotal)) /
            (assetsTotalNow - totalLiabProjectionsNow) +
            0.5
        );
  const taxPercent =
    AssetLiabProjs.EstateLiabsByTypeTotal === 0 ? 0 : 100 - assetPercent;

  let dataEstateLeakage = [];
  let dataEstateLeakageLE = [];
  dataEstateLeakage.push(
    assetsTotalNow -
      totalLiabProjectionsNow -
      AssetLiabProjs.EstateLiabsByTypeTotal >=
      0
      ? assetsTotalNow -
          totalLiabProjectionsNow -
          AssetLiabProjs.EstateLiabsByTypeTotal
      : 0
  );
  dataEstateLeakage.push(AssetLiabProjs.EstateLiabsByTypeTotal);
  dataEstateLeakageLE.push(
    assetsTotalLE3 -
      totalLiabProjectionsLE3 -
      AssetLiabProjs.EstateLiabsByTypeLE3Total >=
      0
      ? assetsTotalLE3 -
          totalLiabProjectionsLE3 -
          AssetLiabProjs.EstateLiabsByTypeLE3Total
      : 0
  );
  dataEstateLeakageLE.push(AssetLiabProjs.EstateLiabsByTypeLE3Total);

  const assetPercentLE3 =
    assetsTotalLE3 - totalLiabProjectionsLE3 === 0
      ? 0
      : parseInt(
          (100 *
            (assetsTotalLE3 -
              totalLiabProjectionsLE3 -
              AssetLiabProjs.EstateLiabsByTypeLE3Total)) /
            (assetsTotalLE3 - totalLiabProjectionsLE3) +
            0.5
        );
  const taxPercentLE3 =
    AssetLiabProjs.EstateLiabsByTypeLE3Total +
      assetsTotalLE3 -
      totalLiabProjectionsLE3 ===
    0
      ? 0
      : 100 - assetPercentLE3;

  //var ctx = document.getElementById('pieEstateLeakage').getContext('2d');
  var dataPieEstateLeakage = {
    labels: [
      // OUTPUTTEXT[lang].graphsL1,OUTPUTTEXT[lang].graphsL2,OUTPUTTEXT[lang].graphsL3,OUTPUTTEXT[lang].graphsL4,OUTPUTTEXT[lang].graphsL5,
      OUTPUTTEXTEP[lang].graphsLeakage1 + " (" + assetPercent + "%)" + space,
      OUTPUTTEXTEP[lang].graphsLeakage2 + " (" + taxPercent + "%)" + space,
    ],
    datasets: [
      {
        //data: this.state.estateLiabLE,
        data: dataEstateLeakage,
        //backgroundColor: ["#F7464A", "#46BFBD", "#FDB45C", "#949FB1", "#4D5360"]
        backgroundColor: ["#4D7966", "#872651"],
      },
    ],
  };
  const dataPieEstateLeakageLE = {
    labels: [
      // OUTPUTTEXT[lang].graphsL1,OUTPUTTEXT[lang].graphsL2,OUTPUTTEXT[lang].graphsL3,OUTPUTTEXT[lang].graphsL4,OUTPUTTEXT[lang].graphsL5,
      OUTPUTTEXTEP[lang].graphsLeakage1 + " (" + assetPercentLE3 + "%)" + space,
      OUTPUTTEXTEP[lang].graphsLeakage2 + " (" + taxPercentLE3 + "%)" + space,
    ],
    datasets: [
      {
        //data: this.state.estateLiabLE,
        data: dataEstateLeakageLE,
        //backgroundColor: ["#F7464A", "#46BFBD", "#FDB45C", "#949FB1", "#4D5360"]
        backgroundColor: ["#4D7966", "#872651"],
      },
    ],
  };
  return {
    dataPieEstateLeakage: dataPieEstateLeakage,
    dataPieEstateLeakageLE: dataPieEstateLeakageLE,
    optionsPieEstateLeakage: optionsPieEstateLeakage,
    optionsPieEstateLeakageLE: optionsPieEstateLeakageLE,
  };
}

export function getLogoAndAppletImage(dataInput, imageRemove, imageAdjust) {
  const lang = dataInput.Presentations[0].language;
  const allPages =
    dataInput.Presentations[0].adviserLogo.image !== null &&
    dataInput.Presentations[0].adviserLogo.allPages;
  const appletImage =
    dataInput.Presentations[0].appletImage === undefined
      ? APPLET_INA
        ? require("../images/INA.png")
        : require("../images/estate.protection.applet.cover.graphic.png")
      : dataInput.Presentations[0].appletImage.image;
  const logoSize = Math.max(
    500 * (MAX_LOGO_HEIGHT / PAGE_HEIGHT),
    Math.min(
      500 * (MAX_LOGO_HEIGHT / PAGE_HEIGHT),
      (100 *
        (MAX_LOGO_HEIGHT / PAGE_HEIGHT) *
        dataInput.Presentations[0].adviserLogo.size) /
        OUTPUT_WIDTH_PCT
    )
  );
  const logoLeft =
    dataInput.Presentations[0].adviserLogo.size / 2 +
    dataInput.Presentations[0].adviserLogo.left -
    logoSize / 2;
  const logo = allPages && (
    <AdjustibleImage
      image={dataInput.Presentations[0].adviserLogo.image}
      showDetails={false}
      size={logoSize}
      imageLeft={logoLeft}
      ID={IMAGE_LOGO_OTHERPAGES}
    />
  );
  const top = dataInput.Presentations[0].adviserLogo.top;
  /* const logoTop = dataInput.Presentations[0].adviserLogo.top && logo
  const logoBottom = !dataInput.Presentations[0].adviserLogo.top && logo
   */
  const logo1stPage = dataInput.Presentations[0].adviserLogo.image !==
    undefined && ( // from older files not null but undefined
    <AdjustibleImage
      image={dataInput.Presentations[0].adviserLogo.image}
      showDetails={true}
      size={dataInput.Presentations[0].adviserLogo.size}
      imageLeft={dataInput.Presentations[0].adviserLogo.left}
      allPages={dataInput.Presentations[0].adviserLogo.allPages}
      top={dataInput.Presentations[0].adviserLogo.top}
      imageRemove={imageRemove}
      imageAdjust={imageAdjust}
      buttonText={lang === "en" ? "Add/Edit logo" : "Ajouter/modifier le logo"}
      ID={IMAGE_LOGO}
      language={lang}
    />
  );
  const applet = (
    <div>
      <AdjustibleImage
        image={appletImage}
        showDetails={false}
        size={OUTPUT_WIDTH_PCT}
        imageLeft={0}
        imageAdjust={imageAdjust}
        //newImagethis.props.loadImage
        buttonText={
          lang === "en"
            ? "Replace Applet image"
            : "Remplacer l’image de l’applet"
        }
        language={lang}
        top={true}
        ID={APPLET_INA ? IMAGE_APPLET_INA : IMAGE_APPLET_EP}
        undoImage={
          APPLET_INA
            ? require("../images/INA.png")
            : require("../images/estate.protection.applet.cover.graphic.png")
        }
      />
    </div>
  );
  return {
    //appletImage: appletImage,
    logoSize: logoSize,
    logoLeft: logoLeft,
    logoTop: top ? logo : "",
    logoBottom: !top ? logo : "",
    logo1stPage: logo1stPage,
    applet: applet,
  };
}

export function extractCSS() {
  const allCSS = Object.values(document.styleSheets)
    // eslint-disable-next-line array-callback-return
    .map((styleSheet) => {
      try {
        return Object.values(styleSheet.cssRules)
          .map((rule) => rule.cssText)
          .join("");
      } catch (e) {
        console.log(
          "Access to stylesheet %s is denied. Ignoring...",
          styleSheet.href
        );
      }
    })
    .filter(Boolean)
    .join("");

  return allCSS;
}

export function doCompuLife(
  lang,
  insuranceNeed,
  provinceKey,
  Age,
  sexKey,
  smokerKey,
  designedBy,
  designedFor
) {
  // const formatFr = lang === "fr" ? true : false;
  const FA = parseFloat(cleanFormat(insuranceNeed, lang));
  const province = provinceKey;
  var today = new Date();
  const birthYr = today.getFullYear() - Age;
  const birthMth = today.getMonth() + 1;
  const birthDay = today.getDate();
  let provinceCode = 2;
  let url = "https://quotes.ppi.ca/canmain.html?comp=so";

  //console.log(url);
  url =
    url +
    "&lang=" +
    lang +
    "&ID=" +
    "TKD" +
    "&ORIGIN=" +
    "TKD" +
    "&face=" +
    parseInt(FA) +
    "&prepby=" +
    designedBy +
    "&prov=";

  if (province === PROVINCE.AB) provinceCode = "1";
  else if (province === PROVINCE.BC) provinceCode = "2";
  else if (province === PROVINCE.MB) provinceCode = "3";
  else if (province === PROVINCE.NB) provinceCode = "4";
  else if (province === PROVINCE.NF) provinceCode = "5";
  else if (province === PROVINCE.NS) provinceCode = "6";
  else if (province === PROVINCE.NT) provinceCode = "7";
  else if (province === PROVINCE.NU) provinceCode = "8";
  else if (province === PROVINCE.ON) provinceCode = "9";
  else if (province === PROVINCE.PE) provinceCode = "10";
  else if (province === PROVINCE.QC) provinceCode = "11";
  else if (province === PROVINCE.SK) provinceCode = "12";
  else if (province === PROVINCE.YU) provinceCode = "13";

  url = url + provinceCode;

  {
    url = url + "&prepfor=" + designedFor;
    url =
      url + "&byear=" + birthYr + "&bmonth=" + birthMth + "&bday=" + birthDay;

    url = url + "&sex=" + (sexKey === SEX.MALE.Key ? "M" : "F");
    url = url + "&smoker=" + (smokerKey === SMOKING.NON_SMOKER.Key ? "N" : "Y");
  }
  //console.log(url);
  const height = Math.min(window.innerHeight - 130 - 20, 800);
  let externalWindow = window.open(
    url,
    "_blank",
    "width=950,height=" + height + ",left=25,top=130"
  );
  let containerEl = externalWindow.document.createElement("div");
  externalWindow.document.body.appendChild(containerEl);

  /* try {
    window.open(url, "_blank");
  } catch (e) {} */
}
