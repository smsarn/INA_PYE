import { readMCCData } from "../data/dataExchangeMCC";
import {
  PROVINCE,
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
  appSiteAPI,
  ASSETS,
  ASSET_TAX,
} from "../definitions/generalDefinitions";

export function fetchTimerAPICheck() {
  let fails = parseInt(localStorage.getItem("INAAPIFails"));
  fetch(appSiteAPI + "/api/MCC_Carriers?id=1")
    .then((response) => {
      //console.log(response);
      response.json();
    })
    .then((data) => console.log("timer API check"))
    .catch((error) => {
      if (!fails) fails = 0;
      fails++;
      localStorage.setItem("INAAPIFails", parseInt(fails));
      //console.log(error);
    });

  return fails;
}

export function fetchAssetProjection(dataNA, assetID) {
  return Promise.all([fetchAP(dataNA, assetID)]);
}

function fetchAP(dataNA, assetID) {
  let url = appSiteAPI + "/api/NA_AssetProjection/";
  let dataAsset = {};

  if (assetID === undefined) assetID = 0;
  dataAsset.lives = dataNA.lives;
  dataAsset.asset = dataNA.assets[assetID - 1];
  dataAsset.projectionSettings = dataNA.projectionSettings;
  dataAsset.ratesPack = dataNA.ratesPack;
  /* 
 dataAsset.asset.incomeRate= 0.0;
            dataAsset.asset.contributionAmt= 1000;
            dataAsset.asset.contributionStartYr= 1;
            dataAsset.asset.contributionDur= 20;  */

   return fetch(url, {
    method: "POST",
    //			redirect: 'follow',
    //			credentials: 'same-origin',
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataAsset),
  })
    .then((response) => {
      if (response.ok === false) {
        throw Error(response.statusText);
      }
      return response;
    })
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.log("handleAssetProjection failed: " + error);
      // this.setState({failedAPI: true});
    });
}

export function fetchMCCData(dataNA, insNeed) {
  return Promise.all([fetchMCC(dataNA, insNeed)]);
}

function fetchMCC(dataNA, insNeed) {
  // let dataMCC=readMCCData(dataNA, 48,insNeed);

  let url = appSiteAPI + "/api/MCC_OutputArrays/";
  // console.log(url, dataNA);

  return fetch(url, {
    method: "POST",
    //			redirect: 'follow',
    //			credentials: 'same-origin',
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataNA),
  })
    .then((response) => {
      if (response.ok === false) {
        throw Error(response.statusText);
      }
      return response;
    })
    .then((response) => response.json())
    .then((data) => {
      // console.log(data);
      return data;
    })
    .catch((error) => {
      console.log("handleFetchMCCData failed: " + error);
      // this.setState({failedAPI: true});
    });
}


//async function fetchTaxRate1(appSiteAPI, type, province) {
export async function getTaxRate(type, province) {
  try {
    let taxRate = await fetch(
      appSiteAPI + "/api/RATES?type=" + type + "&province=" + province
    );
    let data = await taxRate.json();
    // console.log(data)

    return (Math.round(parseFloat(data) * 10000) / 10000).toFixed(4);
  } catch (error) {
    console.log("error, rates API failed", error);
  }
}

export async function fetchGovBenefits(dataNA, provincekey) {
  try {
    if (provincekey !== undefined) {
      dataNA.projectionSettings.province = provincekey;
      dataNA.lives[1].isQC = provincekey === "QC" ? true : false;
    }
    let url = appSiteAPI + "/api/NA_GovBenefits/";
    let govBenefits = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataNA),
    });
    let data = await govBenefits.json();
    // console.log(data)

    return {
      cpp: data[0].Values[0],
      cppDB: Math.round(data[1].Values[0]),
      orphan: Math.round(data[2].Values[0]),
    };
  } catch (error) {
    console.log("error, InsuranceNeedsData API failed", error);
  }
}

export async function fetchInsuranceNeedsData(dataNA, provincekey) {
  try {
    if (provincekey !== undefined) {
      dataNA.projectionSettings.province = provincekey;
      dataNA.lives[1].isQC = provincekey === "QC" ? true : false;
    }
    let url = appSiteAPI + "/api/NA_OutputAll/";
    let insuranceNeedsData = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataNA),
    });
    let data = await insuranceNeedsData.json();
  //  console.log(dataNA, data)

    return {
      ages: data[1],
      govCF: data[3],
      personalCF: data[4],
      needs: data[5],
      shortfall: data[6],
      cpp: data[7].Values[0],
      cppDB: Math.round(data[8].Values[0]),
      orphan: Math.round(data[9].Values[0]),
      lifeExp: Math.round(data[12].Values[0]),
      lifeExpClient: Math.round(data[13].Values[0]),
      lifeExpJLTD: Math.round(data[14].Values[0]),
      provinceMargTax: data[15].Values[0],
      dataTaxLiability: data[16],
      encryptedInput: data[17].Values[0],
      probate: data[18],
    };
  } catch (error) {
    console.log("error, InsuranceNeedsData API failed", error);
  }
}

export async function handleFetchInsuranceNeeds(dataNA, dataP) {
  try {
    console.log("Data sent to POST:");
    // console.log(dataNA);

    let url = appSiteAPI + "/api/NA_InsuranceNeeds/";
    let insuranceNeeds = await fetch(url, {
      method: "POST",
      //			redirect: 'follow',
      //			credentials: 'same-origin',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataNA),
    });

    let data = await insuranceNeeds.json();
   
    return data;
  } catch (error) {
    console.log("handleFetchInsuranceNeeds failed: ", error);
  }
}

/* export async function fetchTaxRate(appSiteAPI, type, province) {
  await fetch(
    appSiteAPI +
      "/api/RATES?type=" +
      type +
      "&province=" +
      province
  )
    .then(response => response.json())
    .then(data => {
      console.log(data);
      return data;
    })
    .catch(error => {
      console.log("error, rates API failed", error);
    });
}

 */

// BEGIN TEMPALTE
// THIS IS THE WAY TO MAKE SURE DATA HAS COME BACK FROM API
// IN THE CALLING MODULE
/* updateClientTaxLiability = async () => {
    let dataNA = this.props.getAssetProjection();
    let appSiteAPI = "http://localhost:8082";
    let data = await fetchAssetProjection2(appSiteAPI, dataNA, this.props.id);
    console.log(data);
    if (data !== undefined) {
      console.log(data[ASSET_API_OUTPUT_TaxPayable].numericValues[0]);

      return data[ASSET_API_OUTPUT_TaxPayable].numericValues;
    }
  }; */

// USE componentDidUpdate IF NEED TO UPDATE SOMETHING BASED ON THE LATEST VALUE OF ANOTHER AFTER setState or changed props
// componentDidUpdate= async (prevProps, prevState) => {

// FETCH
export async function fetchAssetProjection2(dataNA, assetID) {
  try {
    let url = appSiteAPI + "/api/NA_AssetProjection/";
    let dataAsset = {};

    if (assetID === undefined) assetID = 0;
    dataAsset.lives = dataNA.lives;
    dataAsset.asset = dataNA.assets[assetID - 1];
    dataAsset.projectionSettings = dataNA.projectionSettings;
    dataAsset.ratesPack = dataNA.ratesPack;
    //   console.log(dataAsset);

    let dataProj = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataAsset),
    });

    let data = await dataProj.json();
    //      console.log(data);
    return data;
  } catch (error) {
    console.log("error, Asset proj API failed", error);
  }
}
// END TEMPALTE

async function asyncAPICall(dataNA, assetID) {
  let data = await fetchAssetProjection2(dataNA, assetID);
  // console.log(data);
  if (data !== undefined) {
    //   console.log(data);

    return data; //[ASSET_API_OUTPUT_TaxPayable].numericValues;
  }
}

/* async function fetchAssetProjectionAPI2 (appSiteAPI,dataNA, assetID){
  let data = await asyncAPICall(appSiteAPI, dataNA, assetID);

  return data
}
 */
export async function fetchAssetProjectionAPI(dataNA, assetID) {
   let dataProjection = {
    dataColTitles: [],
    dataValues: [],
  };
  // console.log(appSiteAPI,dataNA, assetID);

  //let data =await fetchAssetProjectionAPI2(appSiteAPI, dataNA, assetID);
  let data = await asyncAPICall(dataNA, assetID);

  return data;

}

export async function fetchAssetFMVandTaxLiab(dataNA, assetID) {
  let dataProjection = {
    FMV: [],
    TaxLiab: [],
  };
  let data = await asyncAPICall(dataNA, assetID);
  if (data[0] !== undefined) {
    dataProjection.FMV = data[ASSET_API_OUTPUT_FMV].numericValues;
    dataProjection.TaxLiab = data[ASSET_API_OUTPUT_TaxPayable].numericValues;
  }
  //console.log(dataProjection);
  return dataProjection;
}

export async function fetchAssetAllGridColumns(dataNA, assetID) {
  let data = await asyncAPICall(dataNA, assetID);
  //console.log(data);
  return data;
}

export async function handleFetchInsuranceNeedsNew(dataNA, dataInput) {
  try {
    let url = appSiteAPI + "/api/NA_InsuranceNeeds/";

    let data = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataNA),
    });

    let dataINA = await data.json();
    // console.log(data)

    let dataDetails = await fetchInsuranceNeedsData(
      dataNA,
      dataInput.Presentations[0].provincekey
    );

    if (dataINA !== undefined && dataDetails !== undefined) {
       console.log("POST: NA_OutputAll success");
       return {
        dataInsuranceNeeds: dataINA,
        dataNAAges: dataDetails.ages,
        dataCashFlowGov: dataDetails.govCF,
        dataCashFlowPersonal: dataDetails.personalCF,
        dataCashFlowNeeds: dataDetails.needs,
        dataShortfall: dataDetails.shortfall,
        cpp: dataDetails.cpp,
        cppDB: dataDetails.cppDB,
        orphan: dataDetails.orphan,
        probate: dataDetails.probate,
        lifeExp: dataDetails.lifeExp,
        lifeExpClient: dataDetails.lifeExpClient,
        lifeExpJLTD: dataDetails.lifeExpJLTD,
        provinceMargTax: dataDetails.provinceMargTax,
        dataTaxLiability: dataDetails.dataTaxLiability,
        encryptedInput: dataDetails.encryptedInput,
      };
    }
  } catch (error) {
    console.log("error, rates API failed", error);
  }
}

export async function handleFetchQueryStringSave(dataNA) {
  //console.log(dataNA);

  let url = appSiteAPI + "/api/NA_QS/";

  fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataNA),
  })
    .then((response) => {
      if (response.ok === false) {
        throw Error(response.statusText);
      }
      return response;
    })
    .then((response) => response.json())
    .then((data) => {
      if (data !== undefined) {
        //console.log(data);

        return data;
      }
    })
    .catch((error) => {
      console.log("handleFetchQueryString failed: " + error);
      // this.setState({failedAPI: true});
    });
}

export async function handleFetchLoadFromQueryString(contentsFile) {

  fetch(appSiteAPI + "/api/NA_QS?QS=" + contentsFile)
    .then((response) => {
      if (response.ok === false) {
        throw Error(response.statusText);
      }
      return response;
    })
    .then((response) => response.json())
    .then(async (data) => {
    
      return data;
    })
    .catch((error) => {
      console.log("handleFetchLoadFromQueryString failed: " + error);
    });
}

export async function handleFetchINADataFromQueryString(savedINA) {
  try {
    let url = appSiteAPI + "/api/NA_QS?QS=" + savedINA;
    
    try {
      let savedData = await fetch(url);
      let data = await savedData.json();
      
      return data;
    } catch (error) {
      console.log("error, handleFetchINADataFromQueryString failed", error);
    }
  } catch (error) {
    console.log("error, handleFetchINADataFromQueryString", error);
  }
}


export async function handleFetchQueryString2(dataNA){

  //const lang=this.state.dataInput.Presentations[0].language
  /* console.log(
    this.state.dataOutput.dataInsuranceNeeds[
      this.state.dataInput.Presentations[0].periodOption
    ].Value
  ); */
  /* const insuranceNeed = this.state.dataOutput.dataInsuranceNeeds[
    this.state.dataInput.Presentations[0].periodOption
  ].Value;
  let dataNA = setUIDataToAPI(this.state.dataInput, insuranceNeed); */
  //console.log(dataNA);

  let url = appSiteAPI + "/api/NA_QS/";

  //this.setState({ ...this.state });
  await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataNA),
  })
    .then((response) => {
      if (response.ok === false) {
        throw Error(response.statusText);
      }
      return response;
    })
    .then((response) => response.json())
    .then((data) => {
      if (data !== undefined) {
        return data;

        /* this.dataQS = data;
        if (mode === MODE_SAVE) this.setState({ showMsg: true });
        else if (mode === MODE_EMAIL){
       let url="mailto: ?subject= " +  (appletMode==="INA"?TITLES[lang].appletINA:TITLES[lang].appletEP) + " &body= " + (EMAIL[lang].body+ ".%0D%0A"  + appSiteParent + "?applet=EP\&QS=" + this.dataQS);
       /* const s1 ="?applet=EP"
       const s2="&QS=" + this.dataQS
        url="mailto: ?subject= Needs Analysis Quote &body=The following link takes you to the landing page of Toolkit Direct. Once there, click on Insurance Needs Analysis to open up the attached quote.%0D%0A" +
        + appSiteParent + ["applet=EP","QS=" + this.dataQS].join('&')
*/

      //  const ft=appSiteParent + "/?" + ["applet="+appletMode , "QS="+this.dataQS].join('&')
        /* url="mailto: ?subject= Needs Analysis Quote &body= The following link takes you to the landing page of Toolkit Direct. Once there, click on Insurance Needs Analysis to open up the attached quote.%0D%0A" +
        encodeURIComponent(ft) */
       // url="mailto: ?subject= " +  (appletMode==="INA"?TITLES[lang].appletINA:TITLES[lang].appletEP) + " &body= " + EMAIL[lang].body+ ".%0D%0A"  + encodeURIComponent(ft)

        //return url;
       // console.log(url)
        //  window.location.href = url; */
        }
      }
    )
    .catch((error) => {
      console.log("handleFetchQueryString failed: " + error);
      // this.setState({failedAPI: true});
      return "";
    });
};

export async function handleFetchQueryString(dataNA){

  try {
    const url = appSiteAPI + "/api/NA_QS/";
  let fetchData = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataNA),
  })
  let data = await fetchData.json();
  if (data !== undefined)
        return data;
 } catch (error) {
    console.log("handleFetchQueryString", error);
  }
}

export async function handleFetchPDF(){

  try {
    const dataNA={
      Html:"<span>goh</span>",
      Css:".canvas-containerWeb {Height: 20vh;}"
      
      }

      console.log( JSON.stringify(dataNA))
    const url = appSiteAPI + "/api/TKD_PDFGenerator/";
  let fetchData = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataNA),
  })
  let data = await fetchData.json();
  if (data !== undefined){
        console.log(data)
        return data;}
 } catch (error) {
    console.log("handleFetchQueryString", error);
  }
}
