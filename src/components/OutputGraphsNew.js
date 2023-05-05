import React from "react";
import { Pie, Bar } from "react-chartjs-2";
//import "./Output.css";
import "./Output.css";
import {
  getAssetsCategoryTotal,
  getLiabsCategoryTotal,
  cleanFormat,
  formatMoney,
  familyProjectionYears,
  getInsNeedLine,
  isSingleFamily,
  extractPageCSS,
} from "../utils/helper";
import {
  ASSETS,
  LIABILITIES,
  CONTROLTITLE,
  DISPLAY_RETIREMENT,
  DISPLAY_LIFEEXP,
  DISPLAY_ENDAGE,
  DISPLAY_LIFEEXP_PLUS_3,
} from "../definitions/generalDefinitions";
import { GRAPHS_LABLES } from "../definitions/outputDefinitions";
import { getInfoINA } from "../definitions/infoIconsDefinitions";
import { Info } from "./Info";
import { doSavePdfINAAppendixAction } from "./OutputPDFINAAppendix";
import { versionDetails, chartToBase64Image } from "../utils/helper";
import { handleFetchHtmlToPDF } from "../utils/FetchAPIs";
import { OUTPUTTEXT } from "../definitions/outputDefinitions";
import saveAs from "file-saver";
import AggregateGrid from "./AggregateGrid";

export default class OutputGraphs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chartConvertedToBase64: [],
    };
    this.useNewPDFMethod = true;
  }

  doPDF = () => {
    doSavePdfINAAppendixAction(this.props);
  };

  doPDF2 = async (lang) => {
    // graphs base 64 rendering
    let charts = [];
    let chart = await chartToBase64Image("barNeeds");
    charts.push(chart);
    chart = await chartToBase64Image("barShortfall");
    charts.push(chart);
    chart = await chartToBase64Image("pieAssets");
    charts.push(chart);
    chart = await chartToBase64Image("pieLiabs");
    charts.push(chart);

    this.setState({ chartConvertedToBase64: charts });

    const cssInline = extractPageCSS();
    const html = this.ref.innerHTML;

    /* let footerText =
      "<div style='margin-bottom: 10px'>" +
      OUTPUTTEXT[lang].pgFooter +
      "</div>"; */

      let pdfSections=[]
      let pdfSection={html:html,css:cssInline, footer:"", hasHeader:false,width:700, orientation:"landscape"}
      pdfSections.push(pdfSection)
      let blobRes = await handleFetchHtmlToPDF(pdfSections)
    
    //let blobRes = await handleFetchHtmlToPDF(html, cssInline, footerText);
    /* let blobRes = await handleFetchHtmlToPDF(
      html,
      cssInline,
      "",
      false,
      700,
      "landscape"
    );
 */
    let blob = new Blob([blobRes], { type: "application/pdf" });
    saveAs(blob, `testPDF`);
  };

  render() {
    //if (this.props.dataCashFlowGov !== undefined)
    const lang = this.props.dataInput.Presentations[0].language;
    const negNeed = this.props.dataCashFlowNeeds.map((x) => -x);

    const mobile = window.innerWidth <= 840 && window.innerHeight <= 840;
    // console.log(window.innerWidth, window.innerHeight)
    const maxYScale =
      10000 *
      Math.ceil(
        1 +
          Math.max(
            Math.max(...this.props.dataCashFlowGov),
            Math.max(...this.props.dataCashFlowNeeds),
            Math.max(...this.props.dataShortfall),
            Math.max(...this.props.dataCashFlowPersonal)
          ) /
            10000
      );
    //	const negNeedMax = negNeed.map(x => -maxYScale*1.05);
    //	negNeedMax.push(- maxYScale * 1.05);
    //	negNeedMax.push(- maxYScale * 1.05)

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        display: true,
        labels: {
          fontColor: "#333",
          fontSize: mobile ? 10 : 14, //16
        },
      },
      scales: {
        xAxes: [
          {
            stacked: true,
            ticks: {
              fontSize: mobile ? 10 : 14,
              beginAtZero: true,
            },
          },
        ],
        yAxes: [
          {
            stacked: true,
            ticks: {
              fontSize: mobile ? 10 : 14,
              beginAtZero: true,
              beginAtZero: true,
              steps: 10,
              stepValue: 5,
              max: maxYScale,
              callback: function (value, index, values) {
                let result =
                  value < 1000 && value > -1000
                    ? value
                    : lang === "en"
                    ? Intl.NumberFormat().format(value / 1000) + "K"
                    : (Intl.NumberFormat().format(value / 1000) + "K").replace(
                        ",",
                        " "
                      );
                return result;
              },
            },
          },
        ],
      },
    };
    const labelsBilingual = GRAPHS_LABLES[lang];
    const decimalChar = lang === "en" ? "." : ",";
    const thousands = lang === "en" ? "," : " ";
    const formatFr = lang === "fr" ? true : false;

    const clients = this.props.dataInput.Clients;
    const singleFamily = isSingleFamily(clients);
    const PDFTopMargin = singleFamily ? 0 : -37;

    const data = {
      labels: this.props.dataNAAges,
      datasets: [
        {
          label: labelsBilingual.persCF,
          data: this.props.dataCashFlowPersonal,
          fill: false,
          borderColor: "LightSteelBlue", // Line color
          backgroundColor: "LightSteelBlue",
        },
        {
          label: labelsBilingual.govCF,
          data: this.props.dataCashFlowGov,
          fill: false, // Don't fill area under the line
          borderColor: "#FAD7A0", // Line color
          backgroundColor: "#FAD7A0",
        },
        {
          label: labelsBilingual.incomeNeeds,
          data: negNeed,
          fill: false, // Don't fill area under the line
          borderColor: "#2B3856", // Line color
          backgroundColor: "#2B3856",
        },
      ],
    };

    var dataFutureINA = [];
    let i;
    let j;
    var pv;
    var totalLiab = 0;
    for (i = 0; i < this.props.dataInput.Liabilitys.length; i++) {
      totalLiab += this.props.dataInput.Liabilitys[i].currValue;
    }

    let shortfallNeg = [];

    for (i = 0; i < this.props.dataShortfall.length; ++i) {
      shortfallNeg.push(-this.props.dataShortfall[i]);
      pv = 0;
      for (j = i; j < this.props.dataShortfall.length; ++j)
        pv += this.props.dataShortfall[j] / Math.pow(1.03, j - i);

      if (i > 0 && i < 20) pv += totalLiab * Math.pow(1.02, i);
      dataFutureINA.push(pv);
    }
    // console.log(totalLiab, dataFutureINA);

    /*     let dataPositiveShortfall = [];
    for (j = 0; j < this.props.dataShortfall.length; ++j)
        dataPositiveShortfall[j]= this.props.dataShortfall[j]>0?this.props.dataShortfall[j]:0;
     



 */

    const dataShortfall = {
      labels: this.props.dataNAAges, // [39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84],
      datasets: [
        {
          label: labelsBilingual.shortfall,
          data: shortfallNeg, //this.props.dataShortfall,
          //[10964, 13734, 14008, 14288, 14574, 14866, 15163, 15466, 15776, 16091, 16413, 16741, 17076, 17417, 17766, 18121, 18484, 18853, 19230, 19615, 20007, 20407, 20815, 21232, 21656, 22090, 27632, 28184, 28748, 29323, 29910, 30508, 31118, 31740, 32375, 33023, 33683, 34357, 35044, 35745, 36460, 37189, 37933, 38691, 39465, 40254],
          fill: false, // Don't fill area under the line
          borderColor: "darkred", // Line color
          backgroundColor: "darkred",
        },
      ],
    };

    var optionsPie = {
      responsive: true,
      title: {
        display: true,
        position: "top",
        text: labelsBilingual.assetsBrk, //"Assets Breakdown Today",
        fontSize: mobile ? 10 : 14, //8,
        fontColor: "#111",
      },
      legend: {
        display: true,
        position: "right",
        labels: {
          fontColor: "#333",
          fontSize: mobile ? 10 : 12, //16
        },
      },
    };

    let optionsPieLiabs = JSON.parse(JSON.stringify(optionsPie));

    optionsPieLiabs.title.text = labelsBilingual.liabsBrk; //"Liabilities Breakdown"

    const dataPieAssets = {
      labels: [
        labelsBilingual.cashLike,
        labelsBilingual.RRSP,
        labelsBilingual.shares,
        labelsBilingual.realEstate,
        labelsBilingual.otherAssets,
      ],
      datasets: [
        {
          data: [
            getAssetsCategoryTotal(this.props.dataInput, ASSETS.CASH.Key) +
              getAssetsCategoryTotal(
                this.props.dataInput,
                ASSETS.LIFE_INSURANCE.Key
              ) +
              getAssetsCategoryTotal(
                this.props.dataInput,
                ASSETS.CHARITABLE_GIFTS_TAX_CREDIT.Key
              ) +
              getAssetsCategoryTotal(this.props.dataInput, ASSETS.TFSA.Key),
            getAssetsCategoryTotal(this.props.dataInput, ASSETS.RRSP_RRIF.Key),
            getAssetsCategoryTotal(
              this.props.dataInput,
              ASSETS.SMALL_BUSINESS_SHARES.Key
            ) +
              getAssetsCategoryTotal(
                this.props.dataInput,
                ASSETS.STOCKS_BONDS.Key
              ),
            getAssetsCategoryTotal(
              this.props.dataInput,
              ASSETS.REAL_ESTATE.Key
            ) +
              getAssetsCategoryTotal(
                this.props.dataInput,
                ASSETS.PERSONAL_RESIDENCE.Key
              ),
            getAssetsCategoryTotal(
              this.props.dataInput,
              ASSETS.OTHER_ASSETS.Key
            ),
          ],
          backgroundColor: [
            "#F7464A",
            "#46BFBD",
            "#FDB45C",
            "#949FB1",
            "#4D5360",
          ],
        },
      ],
    };

    const dataPieLiabs = {
      labels: [
        labelsBilingual.loans,
        labelsBilingual.taxes,
        labelsBilingual.emergency,
        labelsBilingual.otherLiabs,
        labelsBilingual.atDeath,
      ],
      datasets: [
        {
          data: [
            getLiabsCategoryTotal(
              this.props.dataInput,
              LIABILITIES.OUTSTANDING_LOANS.Key
            ) +
              getLiabsCategoryTotal(
                this.props.dataInput,
                LIABILITIES.MORTGAGE_REDEMPTION.Key
              ) +
              getLiabsCategoryTotal(
                this.props.dataInput,
                LIABILITIES.CREDIT_CARDS.Key
              ) +
              getLiabsCategoryTotal(
                this.props.dataInput,
                LIABILITIES.CLIENT_TAX_LIABILITY.Key
              ),
            getLiabsCategoryTotal(
              this.props.dataInput,
              LIABILITIES.INCOME_TAXES.Key
            ),
            getLiabsCategoryTotal(
              this.props.dataInput,
              LIABILITIES.EMERGENCY_FUND.Key
            ),
            getLiabsCategoryTotal(this.props.dataInput, LIABILITIES.OTHER.Key) +
              getLiabsCategoryTotal(
                this.props.dataInput,
                LIABILITIES.CHILD_HOME_CARE.Key
              ),
            getLiabsCategoryTotal(
              this.props.dataInput,
              LIABILITIES.LAST_EXPENSES.Key
            ) +
              getLiabsCategoryTotal(
                this.props.dataInput,
                LIABILITIES.LEGAL_AND_EXECUTOR_FEES.Key
              ) +
              getLiabsCategoryTotal(
                this.props.dataInput,
                LIABILITIES.LEGACY_FOR_CHILDREN.Key
              ) +
              getLiabsCategoryTotal(
                this.props.dataInput,
                LIABILITIES.CHARITABLE_GIFTS.Key
              ) +
              getLiabsCategoryTotal(
                this.props.dataInput,
                LIABILITIES.PROBATE.Key
              ),
          ],
          backgroundColor: [
            "#F7464A",
            "#46BFBD",
            "#FDB45C",
            "#949FB1",
            "#4D5360",
          ],
        },
      ],
    };

    const needTo = this.props.insNeedLine;
    const assetsPie = this.props.dataInput.Assets.length > 0 && (
      <div>
        {this.useNewPDFMethod && (
          <div className="INAPie printOnly">
            {this.state.chartConvertedToBase64[2] !== null && (
              <img src={this.state.chartConvertedToBase64[2]} />
            )}
          </div>
        )}

        <article id="pieAssets" className="INAPie  no-print">
          <div>
            <Pie data={dataPieAssets} options={optionsPie} />
          </div>
        </article>
      </div>
    );

    const liabsPie = this.props.dataInput.Liabilitys.length > 0 && (
      <div>
        {this.useNewPDFMethod && (
          <div className="INAPie printOnly">
            {this.state.chartConvertedToBase64[3] !== null && (
              <img src={this.state.chartConvertedToBase64[3]} />
            )}
          </div>
        )}

        <article id="pieLiabs" className="INAPie  no-print">
          <div>
            <Pie data={dataPieLiabs} options={optionsPieLiabs} />
          </div>
        </article>
      </div>
    );

    const singlePerson =
      this.props.dataInput.Clients.length === 1 ? true : false;
    const noSurvivor = singlePerson && versionDetails().versionNumeric <= 10014;

    if (noSurvivor) {
      return (
        <div>
          <h3 className="ppi1">{needTo}</h3>
        </div>
      );
    } else {
      return (
        <div>
          <div style={{ width: "100%", float: "left", clear: "left" }}>
            <input
              className="roundedCornerCmd"
              style={{
                //   width: "80px",
                marginTop: PDFTopMargin + "px",
                marginRight: "0px",
                paddingRight: "8px",
                float: "right",
              }}
              onClick={() => {
                if (this.useNewPDFMethod) this.doPDF2(lang);
                else this.doPDF();
              }}
              /* onClick={()=>this.doPDF()} */
              type="button"
              value={CONTROLTITLE[lang].pdfINAAppendix}
            />
          </div>
          <h3 className="ppi">
            {needTo}
            {/* : ${formatMoney(cleanFormat(this.props.insuranceNeed,formatFr), 0, decimalChar, thousands)} */}
            <Info infoIcon={getInfoINA(lang)} />
          </h3>

          <br />

          <div
            id="presentation"
            className="presentationG"
            ref={(r) => (this.ref = r)}
          >
            {/* PAGE 1 cover*/}
            <div className="newPage" id="Page1">
              <div style={{ width: "90%" }}>
                <h2 className="ppi2 print-only">
                  {OUTPUTTEXT[lang].pgAppendix +
                    ": " +
                    OUTPUTTEXT[lang].pgAppendixT}
                </h2>

                <article
                  id="barNeeds"
                  className="canvas-containerINAGraphs  no-print"
                >
                  <Bar data={data} options={options} />
                </article>
                <article
                  id="barShortfall"
                  className="canvas-containerINAGraphs  no-print"
                >
                  <Bar data={dataShortfall} options={options} />
                </article>

                
              </div>
             
<div className="row">
            <div className="column">
              {(this.state.chartConvertedToBase64[2] === undefined ||
                this.state.chartConvertedToBase64[2] === null) && (
                <article
                  id="pieAssets"
                  
                >
                  <div
                    style={{
                      visibility: this.props.useNewPDFMethod && "hidden",
                    }}
                  >
                      <Pie data={dataPieAssets} options={optionsPie} />
                  </div>
                </article>
              )}
               {this.state.chartConvertedToBase64[2] !== null && (
                <img src={this.state.chartConvertedToBase64[2]} />
              )}
            </div>

            {(this.state.chartConvertedToBase64[3] === undefined ||
                this.state.chartConvertedToBase64[3] === null) && (
                <article
                  id="pieLiabs"
                  
                >
                  <div
                    style={{
                      visibility: this.props.useNewPDFMethod && "hidden",
                    }}
                  >
                      <Pie data={dataPieLiabs} options={optionsPie} />
                  </div>
                </article>
              )}

                  {this.state.chartConvertedToBase64[3] !== null && (
                <img src={this.state.chartConvertedToBase64[3]} />
              )}
            </div>


              <pagebreak />
            </div>
            {/* PAGE 2*/}
            <div className="print-only newPage" id="Page2">
              {this.useNewPDFMethod && (
                <div className="printOnly" style={{ width: "90%" }}>
                  <AggregateGrid
                    aggregateGrid={this.props.aggregateGrid}
                    LE={this.props.LE}
                    lang={lang}
                    insNeedLine={needTo}
                    GridForPDF={true}
                  />
                </div>
              )}

            </div>
          </div>
        </div>
      );
    }
  }
}
