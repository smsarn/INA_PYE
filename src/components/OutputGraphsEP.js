import React from "react";
import { Chart, Bar, Pie } from "react-chartjs-2";
//import ChartDataLabels from 'chartjs-plugin-datalabels';
//import "./Output.css";
import "./Output.css";
import { setUIDataToAPI } from "../data/dataExchange";
import { getAssetLiabProjections } from "../data/aggregateGridProjections";
import {
  getProjectedLiabilities,
  getTaxLiabCategoryTotal,
  getLeakageGraphs,
  getAgesEP
} from "../utils/helper";
import {
  QUOTE_CLIENT,
  QUOTE_SPOUSE,
  ASSET_TAX,
  ASSETS,
  LIABILITIES,
} from "../definitions/generalDefinitions";
import { OUTPUTTEXTEP } from "../definitions/outputDefinitionsEP";
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

// props option
const DISPLAY_INCOME = 1;

// for Estate
const DISPLAY_TAXLIAB_CLIENT = 1;
const DISPLAY_TAXLIAB_JLTD = 2;

export default class OutputGraphsEP extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingMCC: true,
      estateLiab: [],
      estateLiabLE: [],
      taxL: 0,
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

    this.chartRef = React.createRef();
    this.taxLiabChartRef = React.createRef();
    //   Chart.plugins.unregister(ChartDataLabels)

  }


  render() {
    // get data similar to presentation
    const AssetLiabProjs = getAssetLiabProjections(this.props);
    const lang = this.props.dataInput.Presentations[0].language;
    const totalLiabProjections =this.props.nonTaxLiabilities/*  getProjectedLiabilities(
      this.props.dataInput,
      this.props.projectEnd,
      this.props.probate
    ); */

//console.log(this.props,totalLiabProjections)

    let dtaAgesAll = [];
    let k;
    let lifeExp = this.props.lifeExp;
    const clients = this.props.dataInput.Clients;
    let age =
      clients.length > 1
        ? Math.min(clients[QUOTE_SPOUSE].Age, clients[QUOTE_CLIENT].Age)
        : clients[QUOTE_CLIENT].Age;

    //let age = this.props.dataInput.Clients[1].Age;

    if (this.INAEstateOption === DISPLAY_TAXLIAB_CLIENT) {
      lifeExp = this.props.lifeExp;//Client;
      age = this.props.dataInput.Clients[QUOTE_CLIENT].Age;
    } else if (this.INAEstateOption === DISPLAY_TAXLIAB_JLTD) {
      lifeExp = this.props.lifeExp;//JLTD;
      age =
        clients.length > 1
          ? Math.min(clients[QUOTE_SPOUSE].Age, clients[QUOTE_CLIENT].Age)
          : clients[QUOTE_CLIENT].Age;
    }

    /* for (k = 0; k <= lifeExp + 3; ++k) {
      dtaAgesAll.push(age + k);
    } */

    dtaAgesAll=getAgesEP(clients, lifeExp)

    

    //options

    const leakageGraps = getLeakageGraphs(
      this.props.dataInput.Assets,
      this.props.assetProjections,
      AssetLiabProjs,
      totalLiabProjections,
      lang,
      lifeExp
    );

    const optionsPie = {
      responsive: true,
      maintainAspectRatio: false,
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
      /*   plugins: {
    // Change options for ALL labels of THIS CHART
    display: false,
    datalabels: {
        color: 'white'
    }
} */
    };

    let optionsPieEstateLiab = JSON.parse(JSON.stringify(optionsPie));
    optionsPieEstateLiab.title.text = OUTPUTTEXTEP[lang].graphsT2;

    let optionsPieEstateLiabLE = JSON.parse(JSON.stringify(optionsPie));
    optionsPieEstateLiabLE.title.text =
      OUTPUTTEXTEP[
        lang
      ].graphsT3; 
    const taxLiabTotal_Index =
      AssetLiabProjs.AssetnEstateLiabs.length - 1; //last row
    let dataTaxLiabLifeExp = [];
    let dataTaxLiab = [];
    let dataLiabAtDeath=[];
    let taxLiabs = AssetLiabProjs.AssetnEstateLiabs[taxLiabTotal_Index].values;
    for (k = 0; k <= lifeExp + 3; ++k) {
      dataTaxLiabLifeExp.push(0);
      dataTaxLiab.push(taxLiabs[k]);
      dataLiabAtDeath.push(totalLiabProjections[k]);
    }
    dataTaxLiabLifeExp[lifeExp] = taxLiabs[lifeExp];
    dataTaxLiab[lifeExp]=0;
    // bar chart
    const dataTaxLiability = {
      labels: dtaAgesAll,
      datasets: [
        {
          label: OUTPUTTEXTEP[lang].graphs2L2,
          //type: "line",
          data: dataTaxLiabLifeExp,
          fill: true, // Don't fill area under the line
          borderColor: "#6AAd8b",
          backgroundColor: "rgb(106,173,139,.5)", // "rgba(96, 125, 139, .7)"
        },
        {
          label: OUTPUTTEXTEP[lang].graphsLeakage2,
          //type: "line",
          data: dataTaxLiab,

          fill: true, // Don't fill area under the line
          borderColor: "darkGrey", // Line color
          backgroundColor: "#607d8b",
        },
        {
          label:  OUTPUTTEXTEP[lang].graphsLeakage3,
          //type: "line",
          data: dataLiabAtDeath,

          fill: true, // Don't fill area under the line
          borderColor: "white", // Line color
          backgroundColor: "#910d48",
        },
      ],
    };
    // bar chart
    const optionsTaxLiab = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        xAxes: [
          {
            stacked: true,
            ticks: {
              beginAtZero: true,
            },
          },
        ],
        yAxes: [
          {
            stacked: true,
            ticks: {
              beginAtZero: true,
              callback: function (value, index, values) {
                let result =
                  value < 1000
                    ? value
                    : lang === "en"
                    ? Intl.NumberFormat().format(value / 1000) + "K"
                    : (Intl.NumberFormat().format(value / 1000) + "K").replace(
                        ",",
                        " "
                      );
                return result;
              },

              steps: 10,
              stepValue: 5,
            },
          },
        ],
      },
    };

    /*   let optionsPieTax = JSON.parse(JSON.stringify(optionsPie));
    optionsPieTax.title.text = "Tax Treatment of Assets";

    let optionsPieLiabsAtDeath = JSON.parse(JSON.stringify(optionsPie));
    optionsPieLiabsAtDeath.title.text = "Liabilities At Death";

    let optionsPieLiabs = JSON.parse(JSON.stringify(optionsPie));
    optionsPieLiabs.title.text = "Liabilities Breakdown";
 */
    let estateLiab = [];
    const totalLiabProjectionsNow = parseInt(totalLiabProjections[0]);
    const totalLiabProjectionsLE3 = parseInt(totalLiabProjections[lifeExp + 3]);
    estateLiab.push(totalLiabProjectionsNow);
    estateLiab.push(
      AssetLiabProjs.EstateLiabsByType[ASSET_TAX_TYPE_REAL_ESTATE]
    );
    estateLiab.push(AssetLiabProjs.EstateLiabsByType[ASSET_TAX_TYPE_STOCKS]);
    estateLiab.push(AssetLiabProjs.EstateLiabsByType[ASSET_TAX_TYPE_SMALL_BUS]);
    estateLiab.push(AssetLiabProjs.EstateLiabsByType[ASSET_TAX_TYPE_RRSP]);
    estateLiab.push(AssetLiabProjs.EstateLiabsByType[ASSET_TAX_TYPE_INTEREST]);
    estateLiab.push(AssetLiabProjs.EstateLiabsByType[ASSET_TAX_TYPE_OTHER]);

    const dataPieEstateLiabNow = {
      labels: [
        //OUTPUTTEXTEP[lang].graphsL1,OUTPUTTEXTEP[lang].graphsL2,OUTPUTTEXTEP[lang].graphsL3,OUTPUTTEXTEP[lang].graphsL4,OUTPUTTEXTEP[lang].graphsL5,
        OUTPUTTEXTEP[lang].graphsL1,
        OUTPUTTEXTEP[lang].graphsTaxes + OUTPUTTEXTEP[lang].pg3Tab3R2C1,
        OUTPUTTEXTEP[lang].graphsTaxes + OUTPUTTEXTEP[lang].pg3Tab3R3C1,
        OUTPUTTEXTEP[lang].graphsTaxes + OUTPUTTEXTEP[lang].pg3Tab3R4C1,
        OUTPUTTEXTEP[lang].graphsTaxes + OUTPUTTEXTEP[lang].pg3Tab3R5C1,
        OUTPUTTEXTEP[lang].graphsTaxes + OUTPUTTEXTEP[lang].pg3Tab3R6C1,
        OUTPUTTEXTEP[lang].graphsTaxes + OUTPUTTEXTEP[lang].pg3Tab3R7C1,
      ],
      datasets: [
        {
          //data: this.state.estateLiab,
          data: estateLiab,
          //backgroundColor: ["#F7464A", "#46BFBD", "#FDB45C", "#949FB1", "#4D5360"]
          backgroundColor: [
            "#872651",
            ASSETS.REAL_ESTATE.colour,
            ASSETS.STOCKS_BONDS.colour,
            ASSETS.SMALL_BUSINESS_SHARES.colour,
            ASSETS.RRSP_RRIF.colour,
            ASSETS.INTEREST_BEARING.colour,
            ASSETS.OTHER_ASSETS.colour,
          ],
        },
      ],
    };

    let estateLiabLE3 = [];
    estateLiabLE3.push(totalLiabProjectionsNow);
    estateLiabLE3.push(
      AssetLiabProjs.EstateLiabsByTypeLE3[ASSET_TAX_TYPE_REAL_ESTATE]
    );
    estateLiabLE3.push(
      AssetLiabProjs.EstateLiabsByTypeLE3[ASSET_TAX_TYPE_STOCKS]
    );
    estateLiabLE3.push(
      AssetLiabProjs.EstateLiabsByTypeLE3[ASSET_TAX_TYPE_SMALL_BUS]
    );
    estateLiabLE3.push(
      AssetLiabProjs.EstateLiabsByTypeLE3[ASSET_TAX_TYPE_RRSP]
    );
    estateLiabLE3.push(
      AssetLiabProjs.EstateLiabsByTypeLE3[ASSET_TAX_TYPE_INTEREST]
    );
    estateLiabLE3.push(
      AssetLiabProjs.EstateLiabsByTypeLE3[ASSET_TAX_TYPE_OTHER]
    );

    const dataPieEstateLiabLE = {
      labels: [
        // OUTPUTTEXTEP[lang].graphsL1,OUTPUTTEXTEP[lang].graphsL2,OUTPUTTEXTEP[lang].graphsL3,OUTPUTTEXTEP[lang].graphsL4,OUTPUTTEXTEP[lang].graphsL5,
        OUTPUTTEXTEP[lang].graphsL1,
        OUTPUTTEXTEP[lang].graphsTaxes + OUTPUTTEXTEP[lang].pg3Tab3R2C1,
        OUTPUTTEXTEP[lang].graphsTaxes + OUTPUTTEXTEP[lang].pg3Tab3R3C1,
        OUTPUTTEXTEP[lang].graphsTaxes + OUTPUTTEXTEP[lang].pg3Tab3R4C1,
        OUTPUTTEXTEP[lang].graphsTaxes + OUTPUTTEXTEP[lang].pg3Tab3R5C1,
        OUTPUTTEXTEP[lang].graphsTaxes + OUTPUTTEXTEP[lang].pg3Tab3R6C1,
        OUTPUTTEXTEP[lang].graphsTaxes + OUTPUTTEXTEP[lang].pg3Tab3R7C1,
      ],
      datasets: [
        {
          //data: this.state.estateLiabLE,
          data: estateLiabLE3,
          //backgroundColor: ["#F7464A", "#46BFBD", "#FDB45C", "#949FB1", "#4D5360"]
          backgroundColor: [
            "#872651",
            ASSETS.REAL_ESTATE.colour,
            ASSETS.STOCKS_BONDS.colour,
            ASSETS.SMALL_BUSINESS_SHARES.colour,
            ASSETS.RRSP_RRIF.colour,
            ASSETS.INTEREST_BEARING.colour,
            ASSETS.OTHER_ASSETS.colour,
          ],
        },
      ],
    };

    
    let optionsLiab= JSON.parse(JSON.stringify(leakageGraps.optionsPieEstateLeakage));
    let optionsLiabLE= JSON.parse(JSON.stringify(leakageGraps.optionsPieEstateLeakageLE));
    
    optionsLiab.title.text=OUTPUTTEXTEP[lang].graphsT2;
    optionsLiabLE.title.text=OUTPUTTEXTEP[lang].graphsT3;

    return (
      <div style={{ width: "90%" }}>
        <div style={{ width: "50%" }}>
        <br />
          <h3 className="ppi1">
            <div>
              {OUTPUTTEXTEP[lang].graphsT1} <br />
            </div>
          </h3>

         {/* </div> <div style={{ width: "100%" }}> */}
          {/* <div style={{ width: "100%", marginLeft: "31px" }}>
            <article
               className="canvas-containerLeakage"
                style={{ position: "relative"}}  
            >
              <div className="EPGraphDiv">
                <Pie
                  data={dataPieEstateLiabNow}
                  options={leakageGraps.dataPieEstateLeakage}
                />
              </div>
              <div className="EPGraphDiv">
                <Pie
                  data={dataPieEstateLiabLE}
                  options={leakageGraps.dataPieEstateLeakage}
                />
              </div>
            </article>
          </div>
 */}

          <div style={{ width: "100%", marginLeft: "31px" }}>
            <article
              className="canvas-containerLiab"
              /* style={{ position: "relative", height: "35vh", width: "80vw" }} */
            >
              <div className="EPGraphDiv">
                <Pie
                  data={dataPieEstateLiabNow}
                  options={optionsLiab}
                />
              </div>
              <div className="EPGraphDiv">
                <Pie
                  data={dataPieEstateLiabLE}
                  options={optionsLiabLE}
                />
              </div>
            </article>
          </div>

          <br/>
          <br />
          <h3 className="ppi1">
            <div>
              {OUTPUTTEXTEP[lang].graphsLeakageT1} <br />
            </div>
          </h3>
          <div style={{ width: "100%", marginLeft: "31px" }}>
            <article
              className="canvas-containerLeakage"
              /* style={{ position: "relative", height: "35vh", width: "80vw" }} */
            >
              <div className="EPGraphDiv">
                <Pie
                  data={leakageGraps.dataPieEstateLeakage}
                  options={leakageGraps.optionsPieEstateLeakage}
                />
              </div>
              <div className="EPGraphDiv">
                <Pie
                  data={leakageGraps.dataPieEstateLeakageLE}
                  options={leakageGraps.optionsPieEstateLeakageLE}
                />
              </div>
            </article>
          </div>
          <h3 className="ppi1">
            <div>
              {OUTPUTTEXTEP[lang].graphs2L1} <br />
            </div>
          </h3>
          </div>
          <div style={{ width: "100%" }}>
            <article className="canvas-container" style={{ height: "200px" }}>
              <Bar data={dataTaxLiability} options={optionsTaxLiab} />
            </article>
          </div>

          <br />
          <hr />
      </div>
    );
  }
}
