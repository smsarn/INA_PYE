import { name, version } from "../../package.json";
import { SEX, SMOKING } from "../definitions/generalDefinitions";
import { QUOTE_CLIENT, QUOTE_SPOUSE, QUOTE_JOINT } from "../definitions/generalDefinitions";

export function readMCCData(dataInput, planID, client, insNeed) {
   let dataLives = setLives(
    client,
    dataInput
  );
  let dataMCC = {
    insured: {
      lives: dataLives,
      lifeStatus: client===QUOTE_JOINT?1:0
    },
    policy: {
      planName: "EquiBuild",
      carrierName: "Industrial Alliance",
      planID: planID,
      carrierID:5,
      faceAmount: insNeed,
      intRate: 0.0375,
      province: dataInput.Presentations[0].Province,
      objPremium: {
        DepositMode: 1, //annual
        PremCustom: false,
        PremSet: false,
        PremSolve: true,
        PremSetDur: 50,
        PremSolveDur: 99,
        PremOffsetOn: false,
        PremOffsetYear: 0
      },
      objCustomDB: {
        solveForPremium_On: false,
        solveForPUA_On: false,
        solveRider_On: false,
        customDB: []
      },
      objRider: {
      T10: false,
      T20: false,
      ICO10: false,
      ICO20: false,
      T25: false,
      T30: false,
      T25Amt: 0.0,
      T30Amt: 0.0,
      T10Dur: 10,
      T20Dur: 20,
      T10Amt: 0.0,
      T20Amt: 0.0
    }
    },
    objPUA: {
      MaxPUA: false,
      MaxPUAAmt: 90000000.0,
      BonusPUA: true,
      FundPUA: false,
      FundPUAAmt: 0.0,
      FundPUADur: 10.0
    },
    outputOptions: {
      extCoverage: false,
      IRR_ERR: false,
      outputColumnIDs: [0, 1, 2, 105, 14, 25]
    },
    generalInfo: {
      designedFor: "",
      designedBy: "",
      language: dataInput.lang === "en" ? 0 : 1,
      formatNumericOutput: true
    }
  };
  return dataMCC;
}

function setLives(clientID, dataInput) {
  let dataE = [];
  let i;
  // for calc purposes
  if (clientID === QUOTE_SPOUSE)
    dataE.push({
      age: dataInput.Clients[1].Age,
      sex: dataInput.Clients[1].sexKey === SEX.FEMALE.Key ? 1 : 0,
      smk:
        dataInput.Clients[1].smokerKey === SMOKING.SMOKER.Key ? "S_STD" : "NS_STD", //Smoker === SMOKING[lang].Values[1]
          //? "S_STD"
          //: "NS_STD",
      rating: 100 //dataInput.Clients[1].Rating
    });
  else if (clientID === QUOTE_CLIENT)
    dataE.push({
      age: dataInput.Clients[0].Age,
      sex: dataInput.Clients[0].sexKey === SEX.FEMALE.Key ? 1 : 0,
      smk:
        dataInput.Clients[0].smokerKey === SMOKING.SMOKER.Key ? "S_STD" : "NS_STD", //Smoker === SMOKING[lang].Values[1]
          //? "S_STD"
          //: "NS_STD",
      rating: 100 //dataInput.Clients[0].Rating
    });
  else {
    for (i = 0; i < dataInput.Clients.length; i++) {
      dataE.push({
        age: dataInput.Clients[i].Age,
        sex: dataInput.Clients[i].sexKey === SEX.FEMALE.Key ? 1 : 0,
        smk:
          dataInput.Clients[i].smokerKey === SMOKING.SMOKER.Key ? "S_STD" : "NS_STD", //Smoker === SMOKING[lang].Values[1]
            //? "S_STD"
            //: "NS_STD",
        rating: 100
      });
    }
  }
  return dataE;
}
