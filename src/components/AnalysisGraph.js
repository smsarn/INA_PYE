import React, { Component } from "react";
import { Bar, Line, Chart,Pie } from "react-chartjs-2";
//import "./Output.css";
import "./Output.css";
import { readMCCData } from "../data/dataExchangeMCC";
import { fetchMCCData } from "../utils/FetchAPIs";
import { setUIDataToAPI} from "../data/dataExchange";
import {
  getProjectedLiabilities,
  cleanFormat,
  numFormat,
  getAssetsTaxCategoryTotal,
  getAssetsCategoryTotal,
  getTaxLiabCategoryTotal,
  getLiabsCategoryTotal
} from "../utils/helper";
import {
  GROWTHDIR,
  QUOTE_CLIENT,
  QUOTE_SPOUSE,
  QUOTE_JOINT,
  ASSET_TAX,
  ASSETS,
  LIABILITIES
} from "../definitions/generalDefinitions";
import MCCGraph from "./MCCGraph";
import { MultiButtons } from "./MultiButtons";
import { InputField } from "./inputField";
import DataTable from "./GridExcelComponent/DataTable";

// props option
const DISPLAY_INCOME = 1;

// for Estate
const DISPLAY_TAXLIAB_CLIENT = 1;
const DISPLAY_TAXLIAB_JLTD = 2;

export class AnalysisGraphs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingMCC: true,
      estateLiab: [],
      estateLiabLE: [],
      taxL:0
    };
    this.dataAges = [];
    this.dataPremiums = [];
    this.dataDB = [];
    this.dataSVEquiBuild = [];
    this.dataSVManulife = [];
    this.Prem = 0;
    this.bestPremiumDur = 100;
    this.bestMinMultiple = 0;
    this.premiumDur = 10;
    this.lifeExp = 0;
    this.minMultiple = 0;
    this.insMultiple = 0;
    this.bestFitEquiBuild = false;
    this.INAEstateOption = DISPLAY_TAXLIAB_CLIENT;
    this.insuranceAmtInitial = this.props.INAOption === DISPLAY_INCOME
        ? this.props.insuranceNeed
        : this.props.dataEstateLiability[0];
this.chartRef = React.createRef();
  this.taxLiabChartRef = React.createRef();
  }

  componentDidMount() {
    this.getEstateLiabPieCharts()

  }


  shouldComponentUpdate(nextProps, nextState, prevState) {
    if (
      this.props.projectEnd !== nextProps.projectEnd ||
      this.state.loadingMCC !== prevState.loadingMCC || this.props.INAOption !== nextProps.INAOption
    ) {
      return true;
    }

    return false;
  }

  getMCCQuoteOutput = () => {
    return Promise.all([this.getMCCQuoteOutput1(), this.getMCCQuoteOutput4()]);
  };

  getMCCQuoteOutput1 = () => {
    let quotePlanID = 48;
    let quoteClient =
      this.INAEstateOption === DISPLAY_TAXLIAB_JLTD
        ? QUOTE_JOINT
        : QUOTE_CLIENT;
    let FA=this.props.INAOption === DISPLAY_INCOME
        ? this.props.insuranceNeed
        : this.props.dataEstateLiability[0];
        const FAClean=parseFloat(cleanFormat(FA))
    let dataMCC = readMCCData(
      this.props.input,
      quotePlanID,
      quoteClient,
      FAClean
    );

    // console.log(this.props.dataAPISite, dataMCC, FA);
    if(FA>0)
    {
    fetchMCCData(
      this.props.dataAPISite,
      dataMCC,
      FAClean
    )
      .then(data => {
        // console.log(data[0]);
        if (data[0] !== undefined) {
          //  console.log("POST: MCC_OutputArrays success");
          this.minPrem = parseInt(cleanFormat(data[0][2].Values[0]));
          //this.dataDB = data[0][3].Values.map(x=>parseInt(cleanFormat(x)));
          this.lifeExp = this.props.lifeExp; // Math.round(parseInt(data[0][4].Values[0]));

          //console.log(this.lifeExp,data[0][4].Values)
          // make render
        }
      })
      .then(data => {
        this.getMCCQuoteOutput4();
      });
    }
  };

 
  getMCCQuoteOutput4 = async () => {
    let quotePlanID = 48;
    let quoteClient =
      this.INAEstateOption === DISPLAY_TAXLIAB_JLTD
        ? QUOTE_JOINT
        : QUOTE_CLIENT;
    let FA= this.props.INAOption === DISPLAY_INCOME
        ? this.props.insuranceNeed
        : this.props.dataEstateLiability[0];    
    const FAClean=parseFloat(cleanFormat(FA))
    let dataMCC = readMCCData(
      this.props.input,
      quotePlanID,
      quoteClient,
      FAClean
    );
    let age = dataMCC.insured.lives[0].age;
    if (dataMCC.insured.lifeStatus > 0 && age > dataMCC.insured.lives[1].age)
      age = dataMCC.insured.lives[1].age;
    let years = this.props.projectEnd;
    dataMCC.policy.objPremium.PremSet = true;
    if (this.bestFitEquiBuild === true) {
      dataMCC.policy.faceAmount =
        FAClean / 2;
      dataMCC.policy.objRider.ICO20 = true;
      dataMCC.policy.objRider.T20Amt =
        FAClean / 2;
      dataMCC.policy.objCustomDB.solveForPremium_On = true;
      dataMCC.policy.objCustomDB.customDB =
        this.props.INAOption === DISPLAY_INCOME
          ? this.getDataFutureINA()
          : this.props.dataEstateLiability;
    } else {
      dataMCC.policy.objCustomDB.customDB = [];
      dataMCC.policy.objCustomDB.solveForPremium_On = false;
      dataMCC.policy.objPremium.PremSetAmt = this.Prem;
      dataMCC.policy.objPremium.PremSetDur = parseInt(this.premiumDur);
    }
    dataMCC.policy.objPremium.PremSolve = false;
    fetchMCCData(
      this.props.dataAPISite,
      dataMCC,
      FAClean
    ).then(data => {
       if (data[0][1] !== undefined) {
        console.log("POST: MCC_OutputArrays success");
        this.dataAges = data[0][1].Values.slice(0, years).map(x =>
          parseInt(cleanFormat(x))
        );
        this.dataPremiums = data[0][2].Values.map(x =>
          parseInt(cleanFormat(x))
        );
        this.dataDB = data[0][3].Values.slice(0, years).map(x =>
          parseInt(cleanFormat(x))
        );
        this.dataSVEquiBuild = data[0][4].Values.slice(0, years).map(x =>
          parseInt(cleanFormat(x))
        );
        this.dataDB.unshift(FAClean);
        let i;

        for (
          i = 0;
          i < this.dataDB.length + age - this.props.projectEnd + 3;
          ++i
        ) {
          this.dataAges.pop();
          this.dataDB.pop();
          this.dataPremiums.pop();
          this.dataSVEquiBuild.pop();
        }
        //console.log(this.dataDB);
        /* let l = this.state.loadingMCC;
        l = false;
        this.setState({ l }); */
      }
    });
  };

  getMCCQuoteOutputManu = async () => {
    let quotePlanID = 47; //MANU_UL_CLIENT_INVSEL = 47
    let quoteClient =
      this.INAEstateOption === DISPLAY_TAXLIAB_JLTD
        ? QUOTE_JOINT
        : QUOTE_CLIENT;
        let FA = this.props.INAOption === DISPLAY_INCOME
        ? this.props.insuranceNeed
        : this.props.dataEstateLiability[0];
        const FAClean=parseFloat(cleanFormat(FA))
    let dataMCC = readMCCData(
      this.props.input,
      quotePlanID,
      quoteClient,
      FAClean
    );
    //console.log(dataMCC);
    let age = dataMCC.insured.lives[0].age;
    if (dataMCC.insured.lifeStatus > 0 && age > dataMCC.insured.lives[1].age)
      age = dataMCC.insured.lives[1].age;
    let years = this.props.projectEnd;
    dataMCC.policy.objPremium.PremSet = false;
    dataMCC.policy.objPremium.PremSolve = true;
    dataMCC.policy.objPremium.PremSolveDur = 99; //years-age;
    dataMCC.policy.objCustomDB.customDB = [];
    dataMCC.policy.objCustomDB.solveForPremium_On = false;
    dataMCC.policy.intRate = 0.035;
    dataMCC.policy.province = "AB"; // data.dataInput.Presentations[0].Province,
    fetchMCCData(
      this.props.dataAPISite,
      dataMCC,
      FAClean
    ).then(data => {
       if (data[0][1] !== undefined) {
        console.log("POST: MCC_OutputArrays success");
        this.dataAges = data[0][1].Values.slice(0, years).map(x =>
          parseInt(cleanFormat(x))
        );
        this.dataPremiums = data[0][2].Values.map(x =>
          parseInt(cleanFormat(x))
        );
        this.dataDB = data[0][3].Values.slice(0, years).map(x =>
          parseInt(cleanFormat(x))
        );
        this.dataSVManulife = data[0][4].Values.slice(0, years).map(x =>
          parseInt(cleanFormat(x))
        );

        this.dataDB.unshift(FAClean);
        let i;

        for (
          i = 0;
          i < this.dataDB.length + age - this.props.projectEnd + 8;
          ++i
        ) {
          this.dataAges.pop();
          this.dataDB.pop();
          this.dataPremiums.pop();
          this.dataSVManulife.pop();
        }
        //console.log(this.dataDB);
        /* let l = this.state.loadingMCC;
        l = false;
        this.setState({ l }); */
      }
    });
  };

  selectMultiButton = (id, value) => {
    if (value !== undefined) {
      if (id === 1) this.premiumDur = value;
      else if (id === 2) this.minMultiple = value;
      else if (id === 3) this.insMultiple = value;
      else if (id === 4) this.insuranceAmtInitial = value;
    }
    this.getMCCQuoteOutput();
    //console.log(value);

    let b = !this.state.loadingMCC;
    this.setState({ loadingMCC: b });
    this.minPrem = 1;
  };

  solveForOptimumQuote = async () => {
    let min = 0;
    this.bestPremiumDur = 100;
    let k;
    let ratio;
    let dataFutureINA = this.getDataFutureINA();
    //let dataFutureEstateLiab = this.getDataFutureEstateLiability();
    this.bestFitEquiBuild = false;

    if (false) {
      let gotHereInInnerLoop = false;
      for (ratio = 0; ratio <= 40; ratio++) {
        for (k = 5; k < this.lifeExp + 1; k++) {
          this.premiumDur = k;
          this.Prem = (1 + ratio / 20) * this.minPrem;

          let dataFVofPrems = this.getDataFVofPrems(
            (this.props.INAOption = DISPLAY_INCOME
              ? dataFutureINA
              : this.props.dataEstateLiability)
          );

          await this.getMCCQuoteOutput4();
          let SumOfSquresDiff = 0;
          let i;
          for (i = 0; i < this.lifeExp; ++i) {
            let insVal = DISPLAY_INCOME
              ? dataFutureINA[i]
              : this.props.dataEstateLiability[i];
            //console.log(SumOfSquresDiff,dataFVofPrems,insVal)
            SumOfSquresDiff += Math.pow(dataFVofPrems[i] - insVal, 2);
          }
          SumOfSquresDiff = Math.round(
            SumOfSquresDiff / (1000000 * this.lifeExp)
          );

          if (min === 0) min = SumOfSquresDiff;
          else if (min > SumOfSquresDiff) {
            //console.log("k, min, SumOfSquresDiff");
            min = SumOfSquresDiff;
            this.bestPremiumDur = k;
            this.bestMinMultiple = 5 * ratio;
            gotHereInInnerLoop = true;
          } else if (gotHereInInnerLoop === true) k = this.lifeExp + 1; //get out
          //console.log(k, min, SumOfSquresDiff, ratio);
          //let b = !this.state.loadingMCC;
          //await this.setState({ loadingMCC: b });
        }
        gotHereInInnerLoop = false;
      }
      this.premiumDur = this.bestPremiumDur;
      this.minMultiple = this.bestMinMultiple;
      //await this.getMCCQuoteOutput();
    } else {
      //this.premiumDur = this.bestPremiumDur;
      //this.minMultiple =  this.bestMinMultiple;
      //this.premiumDur = k;
      this.Prem = (1 + this.bestMinMultiple) * this.minPrem;

      await this.getMCCQuoteOutput();
    }
    let b = !this.state.loadingMCC;
    await this.setState({ loadingMCC: b });
  };

  solveForOptimumEquiBuild = async e => {
    if (e === 1) {
      this.bestPremiumDur = 100;
      let dataFutureINA = this.getDataFutureINA();
      //let dataFutureEstateLiab = this.getDataFutureEstateLiability();

      this.bestFitEquiBuild = true;
      await this.getMCCQuoteOutput4();

      let dataFVofPrems = this.getDataFVofPrems(dataFutureINA);
      let SumOfSquresDiff = 0;
      let i;
      for (i = 0; i < this.lifeExp; ++i) {
        let insVal = DISPLAY_INCOME
          ? dataFutureINA[i]
          : this.props.dataEstateLiability[i];
        //console.log(SumOfSquresDiff,dataFVofPrems,insVal)
        SumOfSquresDiff += Math.pow(dataFVofPrems[i] - insVal, 2);
      }
      SumOfSquresDiff = Math.round(SumOfSquresDiff / (1000000 * this.lifeExp));
      //console.log(SumOfSquresDiff)
    } else if (e === 2) {
      this.bestPremiumDur = 100;
      let dataFutureINA = this.getDataFutureINA();

      this.bestFitEquiBuild = true;
      await this.getMCCQuoteOutputManu();

      let dataFVofPrems = this.getDataFVofPrems(dataFutureINA);
    }
    // await this.getMCCQuoteOutput();

    let b = !this.state.loadingMCC;
    await this.setState({ loadingMCC: b });
  };

  selectMultiButtonINAorTax = (e) => {
    if (e === DISPLAY_TAXLIAB_CLIENT) {
      this.INAEstateOption = DISPLAY_TAXLIAB_CLIENT;
    } else if (e === DISPLAY_TAXLIAB_JLTD) {
      this.INAEstateOption = DISPLAY_TAXLIAB_JLTD;
    }

    //let dataFutureEstateLiab = this.getDataFutureEstateLiability();
    this.insuranceAmtInitial =
      this.props.INAOption === DISPLAY_INCOME
        ? this.props.insuranceNeed
        : this.props.dataEstateLiability[0];
    //this.insuranceAmtInitial =parseInt(cleanFormat(this.insuranceAmtInitial))*(1 + this.insMultiple / 100);
    this.getMCCQuoteOutput();

    

    let b = !this.state.loadingMCC;
    this.setState({ loadingMCC: b });
    this.minPrem = 1;
    //this.setState({ loading: false });
  };



getEstateLiabPieCharts= async () => {
     
    const totalLiabProjections = getProjectedLiabilities(
      this.props.input.dataInput,
      this.props.projectEnd,
      this.props.language
    );



    // console.log(this.state.estateLiab,this.state.estateLiabLE)

    let dataNA = setUIDataToAPI(this.props.input, 0);

    let estateLiab2=[]
    estateLiab2.push(totalLiabProjections[0])
    const l1= await getTaxLiabCategoryTotal(this.props.input.dataInput,ASSET_TAX.REGISTERED.Key,dataNA, 0);
    this.setState({taxL: l1})
    estateLiab2.push(l1)
    const l2=await getTaxLiabCategoryTotal(this.props.input.dataInput,ASSET_TAX.CAPITAL_GAINS_ANNUAL.Key,dataNA, 0)
    const l3=await getTaxLiabCategoryTotal(this.props.input.dataInput,ASSET_TAX.CAPITAL_GAINS_DEFERRED.Key,dataNA, 0)
    estateLiab2.push(l2+l3)
    estateLiab2.push(await getTaxLiabCategoryTotal(this.props.input.dataInput,ASSET_TAX.FULLY_TAXABLE.Key,dataNA, 0))
    estateLiab2.push(await getTaxLiabCategoryTotal(this.props.input.dataInput,ASSET_TAX.DIVIDEND.Key,dataNA, 0));


    this.setState({estateLiab: estateLiab2});

    let estateLiab3=[]
    estateLiab3.push(totalLiabProjections[this.lifeExp])
    estateLiab3.push(await getTaxLiabCategoryTotal(this.props.input.dataInput,ASSET_TAX.REGISTERED.Key,dataNA, this.lifeExp))
    const l2LE=await getTaxLiabCategoryTotal(this.props.input.dataInput,ASSET_TAX.CAPITAL_GAINS_ANNUAL.Key,dataNA, this.lifeExp)
    const l3LE=await getTaxLiabCategoryTotal(this.props.input.dataInput,ASSET_TAX.CAPITAL_GAINS_DEFERRED.Key,dataNA, this.lifeExp)
    estateLiab3.push(l2LE+l3LE)
    estateLiab3.push(await getTaxLiabCategoryTotal(this.props.input.dataInput,ASSET_TAX.FULLY_TAXABLE.Key,dataNA, this.lifeExp))
    estateLiab3.push(await getTaxLiabCategoryTotal(this.props.input.dataInput,ASSET_TAX.DIVIDEND.Key,dataNA, this.lifeExp));
    this.setState({estateLiabLE: estateLiab3});

    // console.log(this.state.estateLiab,this.state.estateLiabLE)
// console.log(estateLiab2,estateLiab3)
}





  getDataFutureINA = () => {
    let dataFutureINA = [];
    let i;
    let j;
    var pv;
    var totalLiab = 0;
    var totalLiabProjections = [];
    // project liabs

    totalLiabProjections = getProjectedLiabilities(
      this.props.input.dataInput,
      this.props.projectEnd,
      this.props.language
    );

    

    const currINA = parseFloat(cleanFormat(this.props.insuranceNeed));
    const intRate = parseFloat(
      this.props.input.dataInput.Presentations[0].invRate / 100
    );
    const inflation = parseFloat(
      this.props.input.dataInput.Presentations[0].inflation / 100
    );
    dataFutureINA.push(currINA);
    //console.log(this.props.insuranceNeed)
    for (i = 1; i < this.props.projectEnd; ++i) {
      pv =
        (dataFutureINA[i - 1] - this.props.dataShortfall[i - 1]) *
        (1 + intRate);
      //   console.log(pv)
      dataFutureINA.push(Math.round(Math.max(0, pv)));
    }
    // add liab
    for (i = 1; i < this.props.projectEnd; ++i) {
      dataFutureINA[i] += totalLiabProjections[i];
    }
    return dataFutureINA;
  };

  /* getDataFutureEstateLiability = () => {
    let i;
    var totalLiabProjections = [];
    
    // project liabs
    totalLiabProjections=getProjectedLiabilities(this.props.input.dataInput, this.props.projectEnd, this.props.language) 

    const currEstateLiability=parseFloat(cleanFormat(this.props.insuranceNeed));
    const intRate=parseFloat(this.props.input.dataInput.Presentations[0].invRate/100);            
    const inflation=parseFloat(this.props.input.dataInput.Presentations[0].inflation/100);
    let dataFutureEstateLiability=[]
    
    for (i = 1; i < this.props.projectEnd; ++i) {
        dataFutureEstateLiability.push(this.props.dataTaxLiability[i]);
    }
    // add liab
    for (i = 1; i < this.props.projectEnd; ++i) {
        dataFutureEstateLiability[i]+=totalLiabProjections[i];
    }
    return dataFutureEstateLiability;
  };
 */

handleFocus = (event) => {
  event.target.select();
};

  getDataFVofPrems = dataFuture => {
    let dataFVofPrems = [];
    let i;
    let fv = 0;

    for (i = 0; i < this.dataPremiums.length; ++i) {
      let shortfall = dataFuture[i] - this.dataDB[i];
      fv = (fv + this.dataPremiums[i]) * 1.0375;
      dataFVofPrems.push(fv + shortfall);
    }
    for (i = this.dataPremiums.length; i < this.props.projectEnd; ++i) {
      let shortfall = dataFuture[i] - this.dataDB[i];
      fv = fv * 1.0375;
      dataFVofPrems.push(fv + shortfall);
    }

    return dataFVofPrems;
  };

  render() {
    let dtaAgesAll = [];
    let k;
    let lifeExp = this.props.lifeExp;
    let age = this.props.input.dataInput.Clients[1].Age;

    if (this.INAEstateOption === DISPLAY_TAXLIAB_CLIENT) {
      lifeExp = this.props.lifeExpClient;
      age = this.props.input.dataInput.Clients[0].Age;
    } else if (this.INAEstateOption === DISPLAY_TAXLIAB_JLTD) {
      lifeExp = this.props.lifeExpJLTD;
      if (age > this.props.input.dataInput.Clients[1].Age)
        age = this.props.input.dataInput.Clients[1].Age;
    }

    for (k = 0; k < lifeExp + 3; ++k) {
      dtaAgesAll.push(age + k);
    }

    //if (this.props.INAOption !== DISPLAY_INCOME) {
    var dataFutureINA = this.getDataFutureINA();
    const dataShortfallFV = {
      labels: dtaAgesAll, // this.dataAges,
      datasets: [
        {
          label:
            this.props.language === "en"
              ? "Future insurance needs"
              : "Besoins d’assurance futurs", //Income Shortfall',
          data: dataFutureINA,

          fill: true, // Don't fill area under the line
          borderColor: "darkred", // Line color
          backgroundColor: "rgba(244, 144, 128, 0.8)"
        }
      ]
    };
    //} else {
    let dataTaxLiabLifeExp = [];
    let dataTaxLiab = []; // this.props.dataEstateLiability;

    for (k = 0; k < lifeExp + 3; ++k) {
      dataTaxLiabLifeExp.push(0);
      dataTaxLiab.push(this.props.dataEstateLiability[k]);
    }
    dataTaxLiabLifeExp[lifeExp] = dataTaxLiab[lifeExp];
    dataTaxLiab[lifeExp] = 0;

    // console.log(this.INAEstateOption, age, dtaAgesAll, lifeExp);
    const dataTaxLiability = {
      labels: dtaAgesAll,
      datasets: [
        {
          label:
            this.props.language === "en"
              ? "Future insurance Needs"
              : "Future insurance Needs ^F", //Income Shortfall',
          //type: "line",
          data: dataTaxLiab,

          fill: true, // Don't fill area under the line
          borderColor: "darkGrey", // Line color
          backgroundColor: "#607d8b"
        },
        {
          label:
            this.props.language === "en"
              ? "Life Expectancy "
              : "Espérance de vie", //Income Shortfall',
          //type: "line",
          data: dataTaxLiabLifeExp,
          fill: true, // Don't fill area under the line
          borderColor: "#6AAd8b",
          backgroundColor: "rgb(106,173,139,.5)"// "rgba(96, 125, 139, .7)"
        }
      ]
    };

  const dataPieAssets = {
  labels: [
    "Cash/TFSA/Insurance", "RRSP/RRIF", "Public/Private shares", "Real Estate", "Other"
  ],
  datasets: [
    {
         data: [
        getAssetsCategoryTotal(this.props.input.dataInput,ASSETS.CASH.Key)+
        getAssetsCategoryTotal(this.props.input.dataInput,ASSETS.LIFE_INSURANCE.Key)+
        getAssetsCategoryTotal(this.props.input.dataInput,ASSETS.CHARITABLE_GIFTS_TAX_CREDIT.Key)
        , 
        getAssetsCategoryTotal(this.props.input.dataInput,ASSETS.RRSP_RRIF.Key), 
        getAssetsCategoryTotal(this.props.input.dataInput,ASSETS.SMALL_BUSINESS_SHARES.Key)+
        getAssetsCategoryTotal(this.props.input.dataInput,ASSETS.STOCKS_BONDS.Key),
        getAssetsCategoryTotal(this.props.input.dataInput,ASSETS.REAL_ESTATE.Key)+
        getAssetsCategoryTotal(this.props.input.dataInput,ASSETS.PERSONAL_RESIDENCE.Key),
        getAssetsCategoryTotal(this.props.input.dataInput,ASSETS.OTHER_ASSETS.Key)
      ],
      backgroundColor: ["#F7464A", "#46BFBD", "#FDB45C", "#949FB1", "#4D5360"]
    }
  ]
}
const dataPieTax = {
  labels: [
    "Non-Taxable", "RRSP/RRIF", "Capital Gains", "Taxed As Income", "Dividend"
  ],
  datasets: [
    {
         data: [
        getAssetsTaxCategoryTotal(this.props.input.dataInput,ASSET_TAX.NON_TAXABLE.Key), 
        getAssetsTaxCategoryTotal(this.props.input.dataInput,ASSET_TAX.REGISTERED.Key), 
        getAssetsTaxCategoryTotal(this.props.input.dataInput,ASSET_TAX.CAPITAL_GAINS_ANNUAL.Key)+
        getAssetsTaxCategoryTotal(this.props.input.dataInput,ASSET_TAX.CAPITAL_GAINS_DEFERRED.Key),
        getAssetsTaxCategoryTotal(this.props.input.dataInput,ASSET_TAX.FULLY_TAXABLE.Key), 
        getAssetsTaxCategoryTotal(this.props.input.dataInput,ASSET_TAX.DIVIDEND.Key)
      ],
      backgroundColor: ["#F7464A", "#46BFBD", "#FDB45C", "#949FB1", "#4D5360"]
    }
  ]
}

const dataPieLiabs = {
  labels: [
    "Loans", "Taxes", "Emergency Fund", "Other"
  ],
  datasets: [
    {
         data: [
        getLiabsCategoryTotal(this.props.input.dataInput,LIABILITIES.OUTSTANDING_LOANS.Key)+
        getLiabsCategoryTotal(this.props.input.dataInput,LIABILITIES.MORTGAGE_REDEMPTION.Key)+
        getLiabsCategoryTotal(this.props.input.dataInput,LIABILITIES.CREDIT_CARDS.Key)+
        getLiabsCategoryTotal(this.props.input.dataInput,LIABILITIES.CLIENT_TAX_LIABILITY.Key)
        , 
        getLiabsCategoryTotal(this.props.input.dataInput,LIABILITIES.INCOME_TAXES.Key), 
        getLiabsCategoryTotal(this.props.input.dataInput,LIABILITIES.EMERGENCY_FUND.Key),
        getLiabsCategoryTotal(this.props.input.dataInput,LIABILITIES.OTHER.Key)+
        getLiabsCategoryTotal(this.props.input.dataInput,LIABILITIES.CHILD_HOME_CARE.Key)
      ],
      backgroundColor: ["#F7464A", "#46BFBD", "#FDB45C", "#949FB1"]
    }
  ]
}
const dataPieLiabsAtDeath = {
  labels: [
    "Last Expenses", "Legal and Executor Fees", "Future Commitments"
  ],
  datasets: [
    {
         data: [
           getLiabsCategoryTotal(this.props.input.dataInput,LIABILITIES.LAST_EXPENSES.Key),
        getLiabsCategoryTotal(this.props.input.dataInput,LIABILITIES.LEGAL_AND_EXECUTOR_FEES.Key), 
        getLiabsCategoryTotal(this.props.input.dataInput,LIABILITIES.LEGACY_FOR_CHILDREN.Key)+
        getLiabsCategoryTotal(this.props.input.dataInput,LIABILITIES.CHARITABLE_GIFTS.Key)
      ],
      backgroundColor: ["#F7464A", "#46BFBD", "#FDB45C"]
    }
  ]
}




//options
  var optionsPie = {
    responsive: true,
    title: {
      display: true,
      position: "top",
      text: "Assets Breakdown Today",
      fontSize: 14,//8,
      fontColor: "#111"
    },
    legend: {
      display: true,
      position: "right",
      labels: {
        fontColor: "#333",
        fontSize: 12//16
      }
    }
  };
   
   
   let optionsPieTax = JSON.parse(JSON.stringify(optionsPie));
   optionsPieTax.title.text="Tax Treatment of Assets"

let optionsPieLiabsAtDeath = JSON.parse(JSON.stringify(optionsPie));
   optionsPieLiabsAtDeath.title.text="Liabilities At Death"

let optionsPieLiabs = JSON.parse(JSON.stringify(optionsPie));
   optionsPieLiabs.title.text="Liabilities Breakdown"




const dataPieEstateLiabNow = {
  labels: [
    "Liabilities", "Taxes: RRSP/RRIF", "Taxes: Capital Gains", "Taxes: As Income", "Taxes: Dividend"
  ],
  datasets: [
    {
         data: this.state.estateLiab,
      backgroundColor: ["#F7464A", "#46BFBD", "#FDB45C", "#949FB1", "#4D5360"]
    }
  ]
}
const dataPieEstateLiabLE = {
  labels: [
    "Liabilities", "Taxes: RRSP/RRIF", "Taxes: Capital Gains", "Taxes: As Income", "Taxes: Dividend"
  ],
  datasets: [
    {
         data: this.state.estateLiabLE,
      backgroundColor: ["#F7464A", "#46BFBD", "#FDB45C", "#949FB1", "#4D5360"]
    }
  ]
}
 let optionsPieEstateLiab= JSON.parse(JSON.stringify(optionsPie));
   optionsPieEstateLiab.title.text="Estate Liability Today"

let optionsPieEstateLiabLE= JSON.parse(JSON.stringify(optionsPie));
   optionsPieEstateLiabLE.title.text="Estate Liability at Life Expectancy +3"





    /* var ctx = document.getElementById('myChart3');

    var myChart3=new Chart(ctx, {
      type: "bar", // override the default type

      data: {
        labels: dtaAgesAll,
        datasets: [
          {
            label:
              this.props.language === "en"
                ? "Life Expectancy"
                : "Life Expectancy ^F", //Income Shortfall',
            data: dataTaxLiabLifeExp,
            borderColor: "#6AAd8b",
            backgroundColor: "rgb(106,173,139,.5)"
          },
          {
            type: "line", // set the default type
            label:
              this.props.language === "en"
                ? "Future insurance Needs"
                : "Future insurance Needs ^F", //Income Shortfall',
            //type: "line",
            data: this.props.dataEstateLiability,
            fill: true, // Don't fill area under the line
            borderColor: "darkGrey", // Line color
            backgroundColor: "#607d8b"
          }
        ]
      },
      options: {
        //Customize chart options
      }
    });
 */
    
    //this.taxLiabChartRef = this.chartRef.current.getContext("2d");
    /* new Chart(this.taxLiabChartRef, {
      type: "bar", // override the default type

      data: {
        labels: dtaAgesAll,
        datasets: [
          {
            label:
              this.props.language === "en"
                ? "Life Expectancy"
                : "Life Expectancy ^F", //Income Shortfall',
            data: dataTaxLiabLifeExp,
            borderColor: "#6AAd8b",
            backgroundColor: "rgb(106,173,139,.5)"
          },
          {
            type: "line", // set the default type
            label:
              this.props.language === "en"
                ? "Future insurance Needs"
                : "Future insurance Needs ^F", //Income Shortfall',
            //type: "line",
            data: this.props.dataEstateLiability,
            fill: true, // Don't fill area under the line
            borderColor: "darkGrey", // Line color
            backgroundColor: "#607d8b"
          }
        ]
      },
      options: {
        //Customize chart options
      }
    }); */

    // FV of prems
    let dataFVofPrems = this.getDataFVofPrems(dataFutureINA);

    // console.log(this.props.dataEstateLiability);

    const dataMCCpremFV = {
      labels: dtaAgesAll, // this.dataAges,
      datasets: [
        {
          label:
            this.props.language === "en"
              ? "Future Value of premiums paid      vs "
              : "EquiBuild quote ^F", //Income Shortfall',
          data: dataFVofPrems,
          fill: true,
          borderColor: "darkgreen", // Line color
          backgroundColor: "rgba(144, 244, 88, .2)"
        },
        {
          label:
            this.props.language === "en"
              ? "Raise cash to pay for shortfall "
              : "Future insurance needs ^F", //Income Shortfall',
          data:
            this.props.INAOption === DISPLAY_INCOME
              ? dataFutureINA
              : this.props.dataEstateLiability,
          //[10964, 13734, 14008, 14288, 14574, 14866, 15163, 15466, 15776, 16091, 16413, 16741, 17076, 17417, 17766, 18121, 18484, 18853, 19230, 19615, 20007, 20407, 20815, 21232, 21656, 22090, 27632, 28184, 28748, 29323, 29910, 30508, 31118, 31740, 32375, 33023, 33683, 34357, 35044, 35745, 36460, 37189, 37933, 38691, 39465, 40254],
          fill: true, // Don't fill area under the line
          borderColor:
            this.props.INAOption === DISPLAY_INCOME ? "darkred" : "darkGrey",
          backgroundColor:
            this.props.INAOption === DISPLAY_INCOME
              ? "rgba(244, 144, 128, 0.9)"
              : "#607D8B"
        }
      ]
    };

    let SumOfSquresDiff = 0;
    let i;
    for (i = 0; i < this.lifeExp; ++i) {
      let insVal = DISPLAY_INCOME
        ? dataFutureINA[i]
        : this.props.dataEstateLiability[i];
      //console.log(SumOfSquresDiff,dataFVofPrems,insVal)
      SumOfSquresDiff += Math.pow(dataFVofPrems[i] - insVal, 2);
    }
    SumOfSquresDiff = numFormat(
      Math.round(SumOfSquresDiff / (1000000 * this.lifeExp)),
      false,
      5,
      ","
    );

    const dataMCCQuoteDB = {
      labels: dtaAgesAll, // this.dataAges,
      datasets: [
        {
          label:
            this.props.language === "en"
              ? "EquiBuild quote"
              : "EquiBuild quote ^F", //Income Shortfall',
          data: this.dataDB,
          fill: true,
          borderColor: "darkblue", // Line color
          backgroundColor: "rgba(144, 144, 188, .3)"
        },
        {
          label:
            this.props.language === "en"
              ? "Future insurance needs"
              : "Future insurance needs ^F", //Income Shortfall',
          data:
            this.props.INAOption === DISPLAY_INCOME
              ? dataFutureINA
              : this.props.dataEstateLiability,
          //[10964, 13734, 14008, 14288, 14574, 14866, 15163, 15466, 15776, 16091, 16413, 16741, 17076, 17417, 17766, 18121, 18484, 18853, 19230, 19615, 20007, 20407, 20815, 21232, 21656, 22090, 27632, 28184, 28748, 29323, 29910, 30508, 31118, 31740, 32375, 33023, 33683, 34357, 35044, 35745, 36460, 37189, 37933, 38691, 39465, 40254],
          fill: true, // Don't fill area under the line
          borderColor:
            this.props.INAOption === DISPLAY_INCOME ? "darkred" : "darkGrey",
          backgroundColor:
            this.props.INAOption === DISPLAY_INCOME
              ? "rgba(244, 144, 128, 0.9)"
              : "#607D8B"
        }
      ]
    };

    const optionsFV = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        xAxes: [
          {
            stacked: true,
            ticks: {
              beginAtZero: true
            }
          }
        ],
        yAxes: [
          {
            stacked: false,
            ticks: {
              beginAtZero: true,
              steps: 10,
              stepValue: 5
            }
          }
        ]
      }
    };

    //let colHeaders=["Year", "Survivor's Age", "Insurance Need", "Propsed Plan Death Benefit", "Future Value of Premiums", "Net Advantage of Insurance" ];
    let colHeaders = [
      "Survivor's Age",
      "Insurance Need",
      "Premiums",
      "Propsed Plan Death Benefit",
      "Future Value of Premiums"
    ];
    let dataProjection = [];
    dataProjection.push(this.dataAges);
    dataProjection.push(
      this.props.INAOption === DISPLAY_INCOME
        ? dataFutureINA
        : this.props.dataEstateLiability
    );
    dataProjection.push(this.dataPremiums);
    dataProjection.push(this.dataDB);
    dataProjection.push(dataFVofPrems);

    let dataProjectionCV = [];
    dataProjectionCV.push(this.dataAges);
    dataProjectionCV.push(this.dataSVEquiBuild);
    dataProjectionCV.push(this.dataSVManulife);

    let needToE =
      "Insurance Needs Projections from today to life expectancy plus 3 years (" +
      lifeExp +
      " + 3)";
    let needToF =
      "Insurance Needs to life expectancy (" +
      lifeExp +
      " years) plus 3 years^F";
    let needTo = this.props.language === "en" ? needToE : needToF;
    // needTo += +this.props.projectEnd + ")";

    //console.log(this.state.loadingMCC);
    return (
      <div style={{ color: "darkBlue", marginTop: "15px" }}>
        {this.props.INAOption !== DISPLAY_INCOME && (
          <MultiButtons
            noButtons={2}
            buttonCaption={["Estate of Client", "Estate of Couple"]}
            selectMultiButton={this.selectMultiButtonINAorTax}
          />
        )}
        
        <div style={{ width: "90%" }}>
        <div style={{ width: "100%" }}> 
        
           <h3 className="ppi1">
          {this.props.INAOption === DISPLAY_INCOME
            ? "Your current financial situation is summerized below:" //this.props.insuranceNeed
            : <div><br/><br/>Estate Liability breakdown Today and at Life Expectancy plus 3 years: <br/></div>
            }
          {/*numFormat(this.props.dataTaxLiability[0], false, 2, ",")}*/}
        </h3>

 
          <div style={{ width: "100%" }}>
            {this.props.INAOption === DISPLAY_INCOME ? (
               <div><article className="canvas-container" style={{height: "450px" }}>
                <div style={{overflow:'hidden', float: 'left', width: '50%',height: "400px" }}><Pie data={dataPieAssets} options={optionsPie} /></div>
                <div style={{float: 'left',width: '50%',height: "400px"}}><Pie data={dataPieTax} options={optionsPieTax} /></div>
              </article>
              <article className="canvas-container" style={{height: "450px" }}>
                <div style={{overflow:'hidden', float: 'left', width: '50%',height: "400px" }}><Pie data={dataPieLiabs} options={optionsPieLiabs} /></div>
                <div style={{float: 'left',width: '50%',height: "400px"}}><Pie data={dataPieLiabsAtDeath} options={optionsPieLiabsAtDeath} /></div>
              </article></div>
         ) : (
           
            <article className="canvas-container" style={{height: "450px" }}>
                <div style={{overflow:'hidden', float: 'left', width: '50%',height: "400px" }}><Pie data={dataPieEstateLiabNow} options={optionsPieEstateLiab} /></div >
                <div style={{float: 'left',width: '50%',height: "400px"}}><Pie data={dataPieEstateLiabLE} options={optionsPieEstateLiabLE} /></div>
              </article>)}
          </div>

<br/>
           <h3 className="ppi1">
          {this.props.INAOption === DISPLAY_INCOME
            ? <div>"Net Worth Today:"<br/> "Assets:"<br/> "Liabilities:"</div> //this.props.insuranceNeed
            : <br/>
            }
          {/*numFormat(this.props.dataTaxLiability[0], false, 2, ",")}*/}
        </h3>



        <h3 className="ppi1">
          {needTo} {/*:{" "}*/}
          {this.props.INAOption === DISPLAY_INCOME
            ? "" //this.props.insuranceNeed
            : ""}
          {/*numFormat(this.props.dataTaxLiability[0], false, 2, ",")}*/}
        </h3>

             {this.props.INAOption === DISPLAY_INCOME ? (
              <article className="canvas-container" style={{ height: "200px" }}>
                <Line data={dataShortfallFV} options={optionsFV} />
              </article>
            ) : (
              <article className="canvas-container" style={{ height: "200px" }}>
                <Bar data={dataTaxLiability} options={optionsFV} />
              </article>
            )}

            {/*  {this.props.INAOption !== DISPLAY_INCOME &&
             <div>
              <canvas id="myChart" ref={this.chartRef} />
            </div>}
             */}
          
            <br /> <br /> <br /> <br />
            <hr />
            <h2>Insurance Quote:</h2>
            <div style={{ width: "100%", float: "left", clear: "left" }}>
              <MultiButtons
                noButtons={1}
                buttonCaption={["Optimize"]}
                selectMultiButton={this.solveForOptimumQuote}
              />
            </div>
            <div style={{ width: "100%", float: "left", clear: "left" }}>
              <MultiButtons
                noButtons={2}
                buttonCaption={["Best EquiBuild fit", "Manulife UL fit"]}
                selectMultiButton={this.solveForOptimumEquiBuild}
              />
            </div>
            <InputField
              inputName="Insurance Amtount"
              id={4}
              format={2}
              Count={1}
              language={this.props.language}
              inputValue={this.props.INAOption === DISPLAY_INCOME
        ? this.props.insuranceNeed
        : this.props.dataEstateLiability[0]}
              maxValue={1000}
              handleUpdateInput={this.selectMultiButton}
            />
            <InputField
              inputName="No. of deposits"
              id={1}
              format={1}
              Count={1}
              language={this.props.language}
              inputValue={this.premiumDur}
              handleUpdateInput={this.selectMultiButton}
            />
            <InputField
              inputName="Over min. deposit"
              id={2}
              format={3}
              Count={1}
              maxValue={300}
              language={this.props.language}
              inputValue={this.minMultiple}
              handleUpdateInput={this.selectMultiButton}
            />
            <h3 style={{ marginTop: "20px", marginLeft: "20px" }}>
              Minimize this measure of goodness of fit: {SumOfSquresDiff}{" "}
              <span style={{ leftPadding: "20px" }}>
                {" "}
                Premium duration: {this.bestPremiumDur}
              </span>{" "}
            </h3>
            <article className="canvas-container" style={{ height: "200px" }}>
              <Line data={dataMCCQuoteDB} options={optionsFV} />
            </article>
            <br /> <br /> <br /> <br />
            <br /> <br /> <br /> <br />
            <hr />
            <h2>Compare Options</h2>
            <article className="canvas-container" style={{ height: "200px" }}>
              <Line data={dataMCCpremFV} options={optionsFV} />
            </article>
            <p />
            <br />
            <p />
            <br />
            <hr />
           
            <div style={{ width: "60%" }}>
              <DataTable
                dataColTitles={colHeaders}
                dataProjection={dataProjection}
                gridTitle={"Compare Options"}
                language={this.props.language}
              />
            </div>
            <br />
            {this.dataSVManulife.length > 0 && this.dataSVEquiBuild.length > 0 && (
              <div style={{ width: "60%" }}>
                <DataTable
                  dataColTitles={[
                    "Age",
                    "EquiBuild Surrnder Value",
                    "ManuLife UL Surrnder Value"
                  ]}
                  dataProjection={dataProjectionCV}
                  gridTitle={"Compare Surrender Values: EquiBuild vs Manulife UL"}
                  language={this.props.language}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
