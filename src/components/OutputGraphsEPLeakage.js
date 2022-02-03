import React from "react";
import { Chart,Bar, Pie } from "react-chartjs-2";
//import ChartDataLabels from 'chartjs-plugin-datalabels';
//import "./Output.css";
import "./Output.css";
import { setUIDataToAPI } from "../data/dataExchange";
import { getAssetLiabProjections } from "../data/aggregateGridProjections";
import {
  getProjectedLiabilities,
  getLeakageGraphs
} from "../utils/helper";
import {
  QUOTE_CLIENT,
  QUOTE_SPOUSE,
} from "../definitions/generalDefinitions";
import { OUTPUTTEXTEP } from "../definitions/outputDefinitionsEP";

// for Estate
const DISPLAY_TAXLIAB_CLIENT = 1;
const DISPLAY_TAXLIAB_JLTD = 2;

export class OutputGraphsEPLeakage extends React.Component {
  constructor(props) {
    super(props);
   // Chart.plugins.unregister(ChartDataLabels)
  }
  
  render() {
    // get data similar to presentation
  
    const AssetLiabProjs = getAssetLiabProjections(this.props);
    const lang =this.props.dataInput.Presentations[0].language;
    const totalLiabProjections = getProjectedLiabilities(
      this.props.dataInput,
      this.props.projectEnd,
      this.props.probate
    );

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
      lifeExp = this.props.lifeExpClient;
      age = this.props.dataInput.Clients[QUOTE_CLIENT].Age;
    } else if (this.INAEstateOption === DISPLAY_TAXLIAB_JLTD) {
      lifeExp = this.props.lifeExpJLTD;
      age =
        clients.length > 1
          ? Math.min(clients[QUOTE_SPOUSE].Age, clients[QUOTE_CLIENT].Age)
          : clients[QUOTE_CLIENT].Age;
    }

    for (k = 0; k <= lifeExp + 3; ++k) {
      dtaAgesAll.push(age + k);
    }

  const leakageGraps=getLeakageGraphs(this.props.dataInput.Assets,this.props.assetProjections,AssetLiabProjs,totalLiabProjections,
  lang,
  lifeExp)



 // leakageGraps.dataPieEstateLeakage.plugins=[ChartDataLabels]
 // leakageGraps.dataPieEstateLeakageLE.plugins=[ChartDataLabels]

 leakageGraps.optionsPieEstateLeakage.legend.labels.boxWidth = 20;
 leakageGraps.optionsPieEstateLeakageLE.legend.labels.boxWidth = 20;
 //optionsPieEstateLeakageLE.legend.labels.position = "left";
 //leakageGraps.dataPieEstateLeakage.responsive=false
 //leakageGraps.dataPieEstateLeakage.maintainAspectRatio=false
  //leakageGraps.optionsPieEstateLeakage.legend.position= "bottom"
  //leakageGraps.optionsPieEstateLeakageLE.legend.position= "bottom"
 
return (
  <div style={{ width: "90%" }}>
    <div style={{ width: "100%" }}>

        <h3 className="ppi1">
        <div>
          {OUTPUTTEXTEP[lang].graphsLeakageT1} <br />
        </div>
      </h3>
        
        <div style={{ width: "90%" }}>
        <article  id="pieEstateLeakage"
            className="canvas-containerLeakage">
            <div className="EPGraphDiv">
            <Pie
              data={leakageGraps.dataPieEstateLeakage}
              options={leakageGraps.optionsPieEstateLeakage}
            />
          </div >
          </article>
        <article  id="pieEstateLeakage2"
            className="canvas-containerLeakage" >
            <div className="EPGraphDiv">
            <Pie
              data={leakageGraps.dataPieEstateLeakageLE}
              options={leakageGraps.optionsPieEstateLeakageLE}
            />
          </div>
        </article>
        </div>
        

      <br />
      <hr />
    </div>
  </div>
);

}

}
