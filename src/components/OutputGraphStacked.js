import React, { Component } from "react";
import { Pie, Bar, Line, Chart } from "react-chartjs-2";
import "./Output.css";
import { OUTPUTTEXTEP } from "../definitions/outputDefinitionsEP";

import { TOTALS } from "../definitions/generalDefinitions";
export class OutputGraphStacked extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const lang = this.props.language;
    var optionsEstate = {
      /*  "hover": {
        "animationDuration": 0
      },
      "animation": {
        "duration": 1,
        "onComplete": function() {
          var chartInstance = this.chart,
            ctx = chartInstance.ctx;
  
          ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
  
          this.data.datasets.forEach(function(dataset, i) {
            var meta = chartInstance.controller.getDatasetMeta(i);
            meta.data.forEach(function(bar, index) {
              var data = dataset.data[index];
              ctx.fillText(data, bar._model.x, bar._model.y - 5);
            });
          });
        }
      }, */
      elements: { point: { radius: 0 } },
      responsive:true,
      maintainAspectRatio: false,
      devicePixelRatio: 4,
      animation: {
        onComplete: async ()=> {
           this.props.graphStackedDone()
        }
     },
      title: {
        display: true,
        position: "top",
        text: OUTPUTTEXTEP[lang].pg4GT,
        fontSize: 12, //8,
        fontColor:"#455560",
      },
      legend: {
        display: true,
        position: "bottom",
        labels: {
          fontColor: "#333",
          fontSize: 8, //16
        },
      },
      scales: {
        yAxes: [
          {
            stacked: true,
            ticks: {
              fontSize: 8,
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
            },
          },
        ],
        xAxes: [
          {
            stacked: true,
            ticks: {
              fontSize: 8,
              beginAtZero: true,
            },
          },
        ],
      },
    };

    let dataAssetnEstateLiabProj = [];

    let type = ["line", "bar"];

    let col = [];

    // Estate Liability has to be first to stay on top!
    let data = [];
    const taxLiab = TOTALS.TAX_LIAB.value[this.props.language];
    for (let i = 0; i < this.props.dataAssetnEstateLiabProj.length; ++i) {
      if (this.props.dataAssetnEstateLiabProj[i].name === taxLiab)
        data.push(this.props.dataAssetnEstateLiabProj[i]);
    }
    for (let i = 0; i < this.props.dataAssetnEstateLiabProj.length; ++i) {
      if (this.props.dataAssetnEstateLiabProj[i].name !== taxLiab)
        data.push(this.props.dataAssetnEstateLiabProj[i]);
    }

    for (let i = 0; i < data.length; ++i) {
      col = [];
      let taxLiabLine = data[i].name === taxLiab ? true : false;
      for (let k = 0; k < this.props.dataAges.length; ++k) {
        col.push(data[i].colour);
      }
      col[this.props.LE] = shadeColor(data[i].colour, -20);
      dataAssetnEstateLiabProj.push({
        type: type[taxLiabLine ? 0 : 1],
        label: data[i].name,
        data: data[i].values, //!== undefined?this.props.dataRE:[],
        fill: taxLiabLine ? false : true,
        borderColor: data[i].colour,
        backgroundColor: col, //this.props.dataAssetnEstateLiabProj[i].colour
      });
    }

    function shadeColor(color, percent) {
      var R = parseInt(color.substring(1, 3), 16);
      var G = parseInt(color.substring(3, 5), 16);
      var B = parseInt(color.substring(5, 7), 16);

      R = parseInt((R * (100 + percent)) / 100);
      G = parseInt((G * (100 + percent)) / 100);
      B = parseInt((B * (100 + percent)) / 100);

      R = R < 255 ? R : 255;
      G = G < 255 ? G : 255;
      B = B < 255 ? B : 255;

      var RR =
        R.toString(16).length == 1 ? "0" + R.toString(16) : R.toString(16);
      var GG =
        G.toString(16).length == 1 ? "0" + G.toString(16) : G.toString(16);
      var BB =
        B.toString(16).length == 1 ? "0" + B.toString(16) : B.toString(16);

      return "#" + RR + GG + BB;
    }

    const dataEstate = {
      labels: this.props.dataAges, // this.dataAges,
      datasets: dataAssetnEstateLiabProj,
    };

    
    
    return (
      <div style={{ width: "100%" }}>
        <div>
          {this.props.useNewPDFMethod && (
            <div >
              {this.props.stackedChartConvertedToBase64 !== null && (
              <>  <img className="no-print" style={{width:"800px"}}src={this.props.stackedChartConvertedToBase64} />
                <img className="printOnly" style={{width:"600px"}}src={this.props.stackedChartConvertedToBase64} /></>
              )}
            </div>
          )}
          {(this.props.stackedChartConvertedToBase64===undefined || this.props.stackedChartConvertedToBase64 === null) && 
          <div
          style={{
            width: "90%",
            visibility:this.props.useNewPDFMethod && "hidden",
          }}
        >
          <article
            id="stackedChart"
            className="canvas-containerWeb"
            style={{ marginLeft: "25px", height: "260px"}} 
          >
              <Bar data={dataEstate} options={optionsEstate} />
           
          </article>
          
          </div>}
        </div>
      </div>
    );
  }
}
