import React from "react";
import ReactExport from "react-data-export";
import { cleanFormat } from "../../utils/helper";
import { APPLET_INA,
  APPLET_EP
} from "../../definitions/generalDefinitions";


const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

export default class DownloadExcel extends React.Component {
  render() {
    // see https://github.com/securedeveloper/react-data-export for formatting
    const styleCell = { alignment: { horizontal: "right" } ,font: {name: "Trebuchet MS"} , numFmt: "##,##0" };
    const styleCellCol1 = { alignment: { horizontal: "right" } ,font: {name: "Trebuchet MS"} , numFmt: "0" };
    const styleCellAlt = { alignment: { horizontal: "right" } ,font: {name: "Trebuchet MS"}, fill: { patternType: "solid", fgColor: { rgb: "E9EAEB" }}, numFmt: "##,##0" };
    const styleCellAltCol1 = { alignment: { horizontal: "right" } ,font: {name: "Trebuchet MS"}, fill: { patternType: "solid", fgColor: { rgb: "E9EAEB" }}, numFmt: "0" };
    const styleTitleRowInfo = {
      font: {name: "Trebuchet MS", color: { rgb: "FFFFFF" }, bold: true},
      alignment: { wrapText: true,horizontal: "center" },
      border: {
        top: { style: "thin", color: { rgb: "C0C0C0" } },
        bottom: { style: "thin", color: { rgb: "C0C0C0" } },
        right: { style: "thin", color: { rgb: "C0C0C0" } },
        left: { style: "thin", color: { rgb: "C0C0C0" } }
      },
      fill: { patternType: "solid", fgColor: { rgb: "7399c6" } }
    };
    const styleCellLeftAllign = { alignment: { horizontal: "left" },font: {name: "Trebuchet MS"}};
    const styleTitleRow = {
      font: {name: "Trebuchet MS", color: { rgb: "FFFFFF" }, bold: true},
      alignment: {wrapText: true , horizontal: "center" },
      border: {
        top: { style: "thin", color: { rgb: "C0C0C0" } },
        bottom: { style: "thin", color: { rgb: "C0C0C0" } },
        right: { style: "thin", color: { rgb: "C0C0C0" } },
        left: { style: "thin", color: { rgb: "C0C0C0" } }
      },
      fill: { patternType: "solid", fgColor: { rgb: "334D7C" } }
     
    };

    let excelColumnsDataInfoSection = [];
    let title = [];
    let dataBodyTitles = []
    let dataBody = [];
    let dataRow = [];
    let j;
    let i;
    let dataCell;

    // console.log(this.props.excelColumnsDataInfoSection);

    // section 1 title and header data
    dataRow = [];
    const lang = this.props.language;
    
    // always name and its value: length 2

    if (this.props.excelColumnsDataInfoSection !== undefined) {
      for (j = 0; j < this.props.excelColumnsDataInfoSection.length; ++j) {
        for (i = 0; i < this.props.excelColumnsDataInfoSection[0].length; ++i) {
           dataCell =
            this.props.excelColumnsDataInfoSection[j][i] === undefined
              ? ""
              : (this.props.excelColumnsDataInfoSection[j][i].toString().indexOf("%")>=0 || isNaN(this.props.excelColumnsDataInfoSection[j][i].toString())===true  || this.props.excelColumnsDataInfoSection[j][i].toString()==="" ?
              this.props.excelColumnsDataInfoSection[j][i].toString():
                parseFloat(cleanFormat(this.props.excelColumnsDataInfoSection[j][i]),lang));
          dataRow.push({
            value: dataCell,
            style: j === 0 ? styleTitleRowInfo : styleCell
          });
        }
        excelColumnsDataInfoSection.push(dataRow);
        dataRow = [];
      }
    }

    // section 2 column headers and data
    // add column titles as first data row to be able to style with another stupid libaray
    // empty titles

    if (this.props.excelColumnsHeaders !== undefined) {

      title.push([{ value: this.props.title, style: {font: {sz: "14", name: "Trebuchet MS", bold: true}}}]);
      
      for (j = 0; j < this.props.excelColumnsHeaders.length; ++j) {
        dataBodyTitles.push({ title: "", width: { wpx: this.props.width }, font: {name: "Trebuchet MS", bold: true}} );
      }

      for (j = 0; j < this.props.excelColumnsHeaders.length; ++j) {
        
        dataRow.push({ value: this.props.excelColumnsHeaders[j], style: styleTitleRow });
      }
      dataBody.push(dataRow);
    }

    dataRow = [];
    if (this.props.excelColumnsDataMain !== undefined) {
      for (i = 0; i < this.props.excelColumnsDataMain[0].length; ++i) {
        for (j = 0; j < this.props.excelColumnsHeaders.length; ++j) {
          dataCell =
            this.props.excelColumnsDataMain[j][i] === undefined
              ? ""
              :(this.props.excelColumnsDataMain[j][i].toString().indexOf("%")>=0 || isNaN(this.props.excelColumnsDataMain[j][i].toString())===true  || this.props.excelColumnsDataMain[j][i].toString()==="" ?
              this.props.excelColumnsDataMain[j][i].toString():
                parseFloat(cleanFormat(this.props.excelColumnsDataMain[j][i]),lang));

          dataRow.push({
            value: dataCell,
            style: isNaN(parseFloat(cleanFormat(dataCell,lang)))
              ? styleCellLeftAllign
              : (i%2?(j===0?styleCellAltCol1:styleCellAlt):(j===0?styleCellCol1:styleCell))
          });
        }
        dataBody.push(dataRow);
        dataRow = [];
      }
    }
    const multiDataSet = [
      // section 1 title
      {
        columns: [],
        data: title
      },
      // section 1 key values
      {
        columns: [],
        data: excelColumnsDataInfoSection
      },

      // section 2
      {
        xSteps: 0,
        ySteps: 1,
        columns: dataBodyTitles,
        data: dataBody
      }
    ];
    var tempDate = new Date();
    var date = tempDate.getDate()+ tempDate.toLocaleString('en-us', { month: 'short' })  + tempDate.getFullYear()

    if (this.props.downloadNow === 0) return "";
    else
      return (
        <ExcelFile hideElement={true} filename= {(APPLET_INA?"INA":"PYE") + "_Data_" + date}>
          <ExcelSheet dataSet={multiDataSet} name={APPLET_INA?"INAd":"PYE" }/>
        </ExcelFile>
      );
  }
}
