import React from "react";
import { Chart, Bar, Pie } from "react-chartjs-2";
//import ChartDataLabels from 'chartjs-plugin-datalabels';
//import "./Output.css";
import "./Output.css";
import { setUIDataToAPI } from "../data/dataExchange";
import { getAssetLiabProjections } from "../data/aggregateGridProjections";
import { getProjectedLiabilities, getLeakageGraphs } from "../utils/helper";
import { QUOTE_CLIENT, QUOTE_SPOUSE } from "../definitions/generalDefinitions";
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
    const lang = this.props.dataInput.Presentations[0].language;
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

    const leakageGraps = getLeakageGraphs(
      this.props.dataInput.Assets,
      this.props.assetProjections,
      AssetLiabProjs,
      totalLiabProjections,
      lang,
      lifeExp
    );

    // leakageGraps.dataPieEstateLeakage.plugins=[ChartDataLabels]
    // leakageGraps.dataPieEstateLeakageLE.plugins=[ChartDataLabels]

    leakageGraps.optionsPieEstateLeakage.legend.labels.boxWidth = 10;
    
    leakageGraps.optionsPieEstateLeakageLE.legend.labels.boxWidth = 10;
    

    leakageGraps.optionsPieEstateLeakage.animation = {
      onComplete: async () => {
        this.props.graphEstateLeakageDone();
      },
    };
    leakageGraps.optionsPieEstateLeakageLE.animation = {
      onComplete: async () => {
        this.props.graphEstateLeakageLEDone();
      },
    };

    //optionsPieEstateLeakageLE.legend.labels.position = "left";
    leakageGraps.dataPieEstateLeakage.responsive=true
    leakageGraps.dataPieEstateLeakage.maintainAspectRatio=false
    leakageGraps.dataPieEstateLeakageLE.responsive=true
    leakageGraps.dataPieEstateLeakageLE.maintainAspectRatio=false
    //leakageGraps.optionsPieEstateLeakage.legend.position= "bottom"
    //leakageGraps.optionsPieEstateLeakageLE.legend.position= "bottom"
    leakageGraps.optionsPieEstateLeakage.title.fontSize= 12
    leakageGraps.optionsPieEstateLeakageLE.title.fontSize= 12
    leakageGraps.optionsPieEstateLeakage.title.fontColor= "#455560"
    leakageGraps.optionsPieEstateLeakageLE.title.fontColor= "#455560"

    leakageGraps.optionsPieEstateLeakage.legend.labels.fontSize= 8 //16
    leakageGraps.optionsPieEstateLeakageLE.legend.labels.fontSize= 8 //16


    const maxGraphWidth=window.screen.width/window.devicePixelRatio +"px";//window.screen.width*.6/window.devicePixelRatio +"px";
    

    
    return (
      <div style={{ width: "100%" }}>
        <div style={{ width: "100%" }}>
         
         {/* 
          <div className="row">
              {(this.props.pieEstateLeakageConvertedToBase64 === undefined ||
                this.props.pieEstateLeakageConvertedToBase64 === null) && (
                <article
                  id="pieEstateLeakage"
                  className="canvas-containerLeakage"
                >
                  <div
                    style={{
                      visibility: this.props.useNewPDFMethod && "hidden", width:"29%", maxWidth:maxGraphWidth
                    }}
                  >
                    <Pie
                      data={leakageGraps.dataPieEstateLeakage}
                      options={leakageGraps.optionsPieEstateLeakage}
                    />
                  </div>
                </article>
              )}

             <div className="column">
              {this.props.pieEstateLeakageConvertedToBase64 !== null && (
                <img src={this.props.pieEstateLeakageConvertedToBase64} />
              )}
            </div> 
              {(this.props.pieEstateLeakage2ConvertedToBase64 === undefined ||
                this.props.pieEstateLeakage2ConvertedToBase64 === null) && (
                <article
                  id="pieEstateLeakage2"
                  className="canvas-containerLeakage"
                >
                  <div
                    style={{
                      visibility: this.props.useNewPDFMethod && "hidden", width:"29%", maxWidth:maxGraphWidth
                    }}
                  >
                    <Pie
                      data={leakageGraps.dataPieEstateLeakageLE}
                      options={leakageGraps.optionsPieEstateLeakageLE}
                    />
                  </div>
                </article>
              )}

            <div className="column">
              {this.props.pieEstateLeakage2ConvertedToBase64 !== null && (
                <img src={this.props.pieEstateLeakage2ConvertedToBase64} />
              )}
            </div> 

          </div>


 */}
          <table   style={{
                      visibility: this.props.useNewPDFMethod && "hidden", width:"54%"
          }}>
          <tr>
            <td width="50%">
            {(this.props.pieEstateLeakageConvertedToBase64 === undefined ||
                this.props.pieEstateLeakageConvertedToBase64 === null) && (
                <article
                  id="pieEstateLeakage"
                  className="canvas-containerLeakage"
                >
                    <Pie
                      data={leakageGraps.dataPieEstateLeakage}
                      options={leakageGraps.optionsPieEstateLeakage}
                    />
                </article>
              )}
            </td>
            
            <td width="50%">
            {(this.props.pieEstateLeakage2ConvertedToBase64 === undefined ||
                this.props.pieEstateLeakage2ConvertedToBase64 === null) && (
                 <article
                  id="pieEstateLeakage2"
                  className="canvas-containerLeakage"
                >
                    <Pie
                      data={leakageGraps.dataPieEstateLeakageLE}
                      options={leakageGraps.optionsPieEstateLeakageLE}
                    />
                </article>
              )}
            </td>
            
            </tr>  
          </table>      



          <table className="printOnly">
          <tr style={{border:"none"}}>
            <td width="50%" style={{border:"none"}}>
            {this.props.pieEstateLeakageConvertedToBase64 !== null && (
                <img style={{marginLeft:"-8px", width:"400px"}} src={this.props.pieEstateLeakageConvertedToBase64} />
              )}
            </td>
            <td width="50%" style={{border:"none"}}>
            {this.props.pieEstateLeakage2ConvertedToBase64 !== null && (
                <img style={{marginLeft:"-100px", width:"400px"}} src={this.props.pieEstateLeakage2ConvertedToBase64} />
              )}
            </td>
            </tr>  
          </table>      

          <table className="no-print">
          <tr style={{border:"none"}}>
            <td style={{border:"none"}}>
            {this.props.pieEstateLeakageConvertedToBase64 !== null && (
                <img style={{ width:"500px" }} src={this.props.pieEstateLeakageConvertedToBase64} />
              )}
            </td>
            <td style={{border:"none"}}>
            {this.props.pieEstateLeakage2ConvertedToBase64 !== null && (
                <img style={{width:"500px"}} src={this.props.pieEstateLeakage2ConvertedToBase64} />
              )}
            </td>
            </tr>  
          </table>      

          <br />
          <hr />
        </div>
      </div>
    );
  }
}
