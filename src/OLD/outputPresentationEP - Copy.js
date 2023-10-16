import React, { Component } from "react";
import "./Output.css";
import { Table } from "react-bootstrap";
import {
  ASSETS,
  ASSET_TAX,
  CONTROLTITLE,
  TOTALS,
  TITLES,
  QUOTE_SPOUSE,
  QUOTE_CLIENT,
  OUTPUT_WIDTH_PCT,
} from "../definitions/generalDefinitions";
import { OUTPUTTEXTEP } from "../definitions/outputDefinitionsEP";
//import { Bar } from "react-chartjs-2";
import { doSavePdfActionEP } from "./OutputPDFEP";
import { MultiButtons } from "./MultiButtons";
import { OutputGraphsEPLeakage } from "./OutputGraphsEPLeakage";
import { getLogoAndAppletImage, getAgesEP } from "../utils/helper";
import { getInfoExportINA } from "../definitions/infoIconsDefinitions";
import { Info } from "./Info";
import PdfPYE_LIFO from "./PYE_LIFO.pdf";
import AggregateGrid from "./AggregateGrid";

//import { AdjustibleImage } from "./AdjustibleImage";
//import jsPDF from 'jspdf';
//import * as jsPDF from 'jspdf';
import {
  formatMoney,
  formatMoney2,
  getListItemNameFromKey,
  getProjectedLiabilities,
  doCompuLife,
  getInsNeedLineEP,
  chartToBase64Image,
  extractPageCSS,
} from "../utils/helper";
import { getOutputValues, setUIDataToAPI } from "../data/dataExchange";
import { getAssetLiabProjections } from "../data/aggregateGridProjections";
import { OutputGraphStacked } from "./OutputGraphStacked";

import { handleFetchHtmlToPDF } from "../utils/FetchAPIs";

import DataTable from "./GridExcelComponent/DataTable";
//import { isEqual } from "lodash";
import Loader from "react-loader-spinner";
import { AddToHomeScreenOutlined } from "@material-ui/icons";

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
import saveAs from "file-saver";
import { OUTPUTTEXT } from "../definitions/outputDefinitions";

export default class OutputPresentationEP extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      showGrids: false,
      image: this.props.dataInput.Presentations[0].adviserLogo.image,
      imageSize: 90,
      imageAlign: 2,
      chartConvertedToBase64: null,
      pieEstateLeakageConvertedToBase64: null,
      pieEstateLeakage2ConvertedToBase64: null,
    };
    this.AssetLiabProjs = null;
    this.useNewPDFMethod = false;//true;
  }

  doINA = async () => {
    //window.top.location.href = 'localhost:8086';
    //window.parent.changeLogo();
    // console.log(this.props);
    /* console.log("INA_" +
    this.props.dataInput.Presentations[0].language +
    "_" +
    this.props.encryptedInput,
  "*") */
    await window.parent.postMessage(
      "INA_" +
        this.props.dataInput.Presentations[0].language +
        "_" +
        this.props.encryptedInputLife1AndSpouse,
      "*"
    );
  };

  doLIFO = async () => {
    //window.top.location.href = 'localhost:8086';
    //window.parent.changeLogo();

    await window.parent.postMessage(
      "LIFO_" +
        this.props.dataInput.Presentations[0].language +
        "_" +
        this.props.encryptedInputLife1AndSpouse,
      "*"
    );
  };
  componentWillReceiveProps(nextProps) {
    this.setState({ showGrids: false });
  }
/* 
  componentDidMount = async () => {
    this.doPDF2(this.props.dataInput.Presentations[0].language, false, null);
    
  }; */

  graphStackedDone = async () => {
    const stackedChartConvertedToBase64 = await chartToBase64Image(
      "stackedChart"
    );
    this.setState({
      stackedChartConvertedToBase64: stackedChartConvertedToBase64,
    });
  }

  graphEstateLeakageDone = async () => {
    const pieEstateLeakageConvertedToBase64 = await chartToBase64Image(
      "pieEstateLeakage"
    );
    this.setState({
      pieEstateLeakageConvertedToBase64: pieEstateLeakageConvertedToBase64,
    });
  }

  graphEstateLeakageLEDone = async () => {
    const pieEstateLeakage2ConvertedToBase64 = await chartToBase64Image(
      "pieEstateLeakage2"
    );
    this.setState({
      pieEstateLeakage2ConvertedToBase64: pieEstateLeakage2ConvertedToBase64,
    });
  }




  doCA = async () => {
    //window.top.location.href = 'localhost:8086';
    //window.parent.changeLogo();

    await window.parent.postMessage(
      "CA_" +
        this.props.dataInput.Presentations[0].language +
        "_" +
        this.props.encryptedInputLife1AndSpouse,
      "*"
    );
  };

  doEB = async () => {
    await window.parent.postMessage(
      "EB_" +
        this.props.dataInput.Presentations[0].language +
        "_" +
        this.props.encryptedInputLife1AndSpouse,
      "*"
    );
  };

  clickMultiButton = (e) => {
    let showGrids = true;
    if (e === 1) showGrids = false;

    this.setState({ showGrids: showGrids });
  };

  doPDF = () => {
    var data = doSavePdfActionEP(this.props, this.AssetLiabProjs); //, this.dateApplet);

    // option to embed the pdf
    /* {
      setTimeout(function () {
        document.getElementById("obj").setAttribute("data", data);
        document.getElementById("obj").setAttribute("height", "0px");
      }, 1000);
    } */
  };

  doPDF2 = async (lang, hasHeaderLogo, footerLogo) => {
    let pdfSections=[]
    

    const cssInline = extractPageCSS();
    const html = this.refSection1.innerHTML;
    let footerText =
      "<div style='margin-bottom: 10px'>" +
      OUTPUTTEXT[lang].pgFooter +
      "</div>";
    if (footerLogo !== false)
      footerText += "<div><img id=1 src=" + footerLogo + " height=50px/></div>";

    let pdfSection={html:html,css:cssInline, footer:footerText, hasHeader:hasHeaderLogo,width:525, orientation:"portrait"}
      pdfSections.push(pdfSection)
     
      

/*     let blobRes = await handleFetchHtmlToPDF(
      html,
      cssInline,
      footerText,
      hasHeaderLogo,
      525,
      "portrait"
    );
 */
    //pdfSection={html:this.ref2.innerHTML,css:cssInline, footer:footerText, hasHeader:hasHeaderLogo,width:525, orientation:"landscape"}
    pdfSections.push({html:this.refSection2.innerHTML,css:cssInline, footer:footerText, hasHeader:false,width:700, orientation:"landscape"})

    pdfSections.push({html:this.refSection3.innerHTML,css:cssInline, footer:footerText, hasHeader:false,width:525, orientation:"portrait"})
  
    let blobRes = await handleFetchHtmlToPDF(pdfSections)
      
    let blob = new Blob([blobRes], { type: "application/pdf" });
    saveAs(blob, `testPDF`);
  };

  doPrint = () => {
    var mywindow = window.open("", "PRINT");

    mywindow.document.write(
      "<html><head><title>" + document.title + "</title>"
    );
    mywindow.document.write("</head><body >");
    mywindow.document.write("<h1>" + "Protecting Your Estate" + "</h1>");
    mywindow.document.write(document.getElementById("presentation").innerHTML);
    mywindow.document.write("</body></html>");

    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/

    mywindow.print();
    mywindow.close();

    return true;
  };

  /*  onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      this.setState({
        image: URL.createObjectURL(event.target.files[0])
      });
    }
   } */

  render() {
    this.AssetLiabProjs = getAssetLiabProjections(this.props);

    this.output = getOutputValues(this.props);
    const styleWithLogo = {
      overflow: "hidden",
      width: "100%",
      overflowX: "auto",
    };
    const styleWithLogoGrids = { width: "100%" };

    const lang = this.props.dataInput.Presentations[0].language;
    const LE = this.props.LE;
    const clients = this.props.dataInput.Clients;
    const labelsBilingual = OUTPUTTEXTEP[lang];

    let loaded =
      this.AssetLiabProjs.AssetnEstateLiabs.length > 0 ? true : false;

    //let dataAges = [];

    const startAge =
      clients.length > 1
        ? Math.min(clients[QUOTE_SPOUSE].Age, clients[QUOTE_CLIENT].Age)
        : clients[QUOTE_CLIENT].Age;
    // do to LE+3

    let dataAges = getAgesEP(clients, LE);

    let p2 = 1;
    let p5 = 1;
    let p6 = 1;

    //const { grids, loading } = this.state;
    let totalAssets = 0;
    let totalLiabs = 0;
    if (this.AssetLiabProjs.projectionsGrids[0] === undefined) {
      return (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      ); //<div><Loader type="TailSpin" color="black" height={30} width={30} /></div>
    }

    const allPages =
      this.props.dataInput.Presentations[0].adviserLogo.image !== null &&
      this.props.dataInput.Presentations[0].adviserLogo.allPages;

    let j = 0;

    const images = getLogoAndAppletImage(
      this.props.dataInput,
      this.props.imageRemove,
      this.props.imageAdjust
    );
    const logoTop = images.logoTop;
    const logoBottom = images.logoBottom;
    const headerTitle = TITLES[lang].appletEP;

    return (
      <div>
        <input
          className="roundedCornerCmd"
          style={{
            //width: "90px",
            marginTop: "-32px",
            marginRight: "0px",
            paddingRight: "8px",
            float: "right",
          }}
          onClick={() => {
            if (this.useNewPDFMethod) {
              this.doPDF2(
                lang,
                this.props.dataInput.Presentations[0].adviserLogo,
                logoBottom !== null &&
                  logoBottom !== "" &&
                  logoBottom !== undefined &&
                  this.props.dataInput.Presentations[0].adviserLogo.image
              );
            } else {
              this.doPDF();
            }
          }}
          type="button"
          value={CONTROLTITLE[lang].pdf}
        />

        {/* <div style={{ float: "right" }}>
          Export data to:
          {
            <div
              style={{
                paddingTop: "0px",
                float: "right",
                marginTop: "-3px",
              }}
            >
              <Info infoIcon={getInfoExportINA(lang)} />
            </div>
          }
        </div>
        <div style={{ width: "100%", float: "left", clear: "left" }}> */}
        {/* PYE dodesn't fit into Compulife term policies  remove */}
        {/* <div style={{ width: "100%", float: "left", clear: "left" }}>
            
            <input
              className="roundedCornerCmd"
              style={{
                // width: "180px",
                marginTop: "-2px",
                paddingRight: "8px",
                float: "right",
              }}
              onClick={() =>
                doCompuLife(
                  this.props.dataInput.Presentations[0].language,
                  this.props.insuranceNeed,
                  this.props.dataInput.Presentations[0].provinceKey,
                  this.props.dataInput.Clients[0].Age,
                  this.props.dataInput.Clients[0].sexKey,
                  this.props.dataInput.Clients[0].smokerKey,
                  this.props.dataInput.Presentations[0].designedBy,
                  this.props.dataInput.Presentations[0].designedFor
                )
              }
              type="button"
              value={CONTROLTITLE[lang].compulife}
            />
          </div>
 */}

        {/*    <input
            className="roundedCornerCmd"
            style={{
              //     width: "180px",
              marginTop: "10px",
              marginRight: "0px",
              paddingRight: "8px",
              float: "right",
            }}
            onClick={this.doINA}
            type="button"
            value={TITLES[lang].appletINA}
          />
        </div>
        <div style={{ width: "100%", float: "left", clear: "left" }}>
          <input
            className="roundedCornerCmd"
            style={{
              //    width: "80px",
              marginTop: "-1px",
              marginRight: "0px",
              paddingRight: "8px",
              float: "right",
            }}
            onClick={this.doLIFO}
            type="button"
            value={CONTROLTITLE[lang].lifo}
          />
        </div>
        <div style={{ width: "100%", float: "left", clear: "left" }}>
          <input
            className="roundedCornerCmd"
            style={{
              //    width: "80px",
              marginTop: "-1px",
              marginRight: "0px",
              paddingRight: "8px",
              float: "right",
            }}
            onClick={this.doCA}
            type="button"
            value={CONTROLTITLE[lang].ca}
          />
        </div> */}
        {/* <object id="obj" type="application/pdf" width="50%" height="0px">
          <p>
            It appears you don't have a PDF plugin for this browser. Please
            download the PDF file.
          </p>
        </object> */}

        {/* 
<iframe id='iframe' type="application/pdf" style={{width:"100%", height:"auto", float:"left"}}></iframe>
        <input
          className="multiButtons multiButtonsAct"
          style={{
            width: "90px",
            marginTop: "0px",
            paddingRight: "8px",
            float: "right",
          }}
          onClick={this.doPDF2}
          type="button"
          value={CONTROLTITLE[lang].pdf}
        />
 */}
        {/*  <input
          className="multiButtons multiButtonsAct"
          style={{
            width: "130px",
            marginTop: "0px",
            paddingRight: "8px",
            float: "right",
          }}
          onClick={this.doPrint}
          type="button"
          value={CONTROLTITLE[lang].print}
        />
 */}
        {/* <h3 className="ppi2">
          {needTo}: {this.props.insuranceNeed}
        </h3>
 */}
        {/*  <div className="presentation" style={{ marginTop:"-15px" }}>
          <table className="EP">
            <tr>
              <td
                style={{
                  border: "none",
                  borderBottom: "1px solid",
                  borderRight: "1px solid",
                  width: "10%",
                }}
              >
                Insurance Needs
              </td>
              <td style={{ border: "none", textAlign: "center"}}>
                Today
              </td>
              <td style={{ border: "none", textAlign: "center"}}>
                Life Expectancy
              </td>
                         </tr>
            <tr>
              <td style={{ border: "none"}}>
                Tax Liabilities:{" "}
              </td>
              <td>$2000,000</td>
              <td>$20</td>

              
            </tr>
            <tr>
              <td style={{ border: "none"}}>
                All Liabilities:{" "}
              </td>
              <td>$2000,000</td>
              <td>$2000</td>
              
            </tr>

            
          </table>
        </div> */}

        {/* 
<div style={{ paddingLeft: "20px", width: "70%"}}>
                <div>
                  <table
                    className="tableEP"
                    style={{ paddingLeft: "10px", width: "100%" }}
                  >
                    <tbody style={{fontSize:"14px"}}>
                      <tr>
                        <th className="tableNeedsEP">
                          Insurance Needs
                        </th>
                        <th className="tableNeedsEP">
                          Today
                        </th>
                        <th className="tableNeedsEP">
                          at Life Expectancy
                        </th>

                        <th className="tableNeedsEP">
                          Smart Choice:
                          </th>
               


                      </tr>
                          <tr>
                            <td style={{ height: "1px", textAlign:"right"  }}>
                            to cover Tax Liabilities:      
                            </td>
                            <td
                              className="textalignright"
                              style={{ height: "1px" }}
                            >
                              {formatMoney2(this.props.taxLiability!==undefined && this.props.taxLiability[0] , 0, lang)}
                            </td>
                            <td
                              className="textalignright"
                              style={{ height: "1px" }}
                            >
                              {formatMoney2(this.props.taxLiability!==undefined && this.props.taxLiability[LE] , 0, lang)}
                            </td>

                            <td
                              rowspan="2">
                          You may wish to purchase a permanent life insurance policy with a Face + Fund option and a short premium payment period so that death benefit grows over time and matches your needs at Life Expectancy. See a quick way of exploring such options
                          <a href = {PdfPYE_LIFO} target='_blank'> here </a> using <ital>Life Insurance Funding Options</ital>
                </td>

                          </tr>

                          <tr >
                            <td style={{ height: "1px", textAlign:"right" }}>
                            to cover All Liabilities: 
                            </td>
                            <td
                              className="textalignright"
                              style={{ height: "1px" }}
                            >
                              {formatMoney2(this.props.dataEstateLiability[0] , 0, lang)}
                            </td>
                            <td
                              className="textalignright"
                              style={{ height: "1px" }}
                            >
                              {formatMoney2(this.props.dataEstateLiability[LE] , 0, lang)}
                            </td>
                          </tr>
                          
                    </tbody>
                  </table>
                  
                </div>
                
              </div>
           */}

        <div style={{ width: "100%", paddingTop: "10px" }}>
          <div className="row">
            <div className="column">
              <table
                className="EP"
                style={{
                  paddingLeft: "10px",
                  width: "100%",
                  minWidth: "600px",
                }}
              >
                <tbody style={{ fontSize: "14px", verticalAlign: "top" }}>
                  <tr>
                    <th className="noBorder" width="14%"></th>
                    <th className="noBorder" width="8%"></th>
                    <th className="noBorder" width="8%"></th>
                    <th className="noBorder" width="70%"></th>
                  </tr>
                  <tr>
                    <th className="tableNeedsEP">
                      {labelsBilingual.EPSummaryTableC11}
                    </th>
                    <th className="tableNeedsEP">
                      {labelsBilingual.EPSummaryTableC12}
                    </th>
                    <th className="tableNeedsEP">
                      {labelsBilingual.EPSummaryTableC13}
                    </th>

                    <th className="tableNeedsEP">
                      {labelsBilingual.EPSummaryTableC14}
                    </th>
                  </tr>
                  <tr>
                    <td style={{ height: "1px", textAlign: "right" }}>
                      {labelsBilingual.EPSummaryTableC21}
                    </td>
                    <td
                      className="textalignright"
                      style={{ height: "1px", whiteSpace: "nowrap" }}
                    >
                      {formatMoney2(
                        this.props.taxLiability !== undefined &&
                          this.props.taxLiability[0],
                        0,
                        lang
                      )}
                    </td>
                    <td
                      className="textalignright"
                      style={{ height: "1px", whiteSpace: "nowrap" }}
                    >
                      {formatMoney2(
                        this.props.taxLiability !== undefined &&
                          this.props.taxLiability[LE],
                        0,
                        lang
                      )}
                    </td>

                    <td rowSpan="2">
                      {labelsBilingual.EPSummaryTableC24}{" "}
                      <span
                        onClick={this.doLIFO}
                        style={{ color: "#0070c0", cursor: "pointer" }}
                      >
                        <u>
                          <b>
                            <i>{CONTROLTITLE[lang].lifo}</i>
                          </b>
                        </u>
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ height: "1px", textAlign: "right" }}>
                      {labelsBilingual.EPSummaryTableC31}
                    </td>
                    <td
                      className="textalignright"
                      style={{ height: "1px", whiteSpace: "nowrap" }}
                    >
                      {formatMoney2(this.props.dataEstateLiability[0], 0, lang)}
                    </td>
                    <td
                      className="textalignright"
                      style={{ height: "1px", whiteSpace: "nowrap" }}
                    >
                      {formatMoney2(
                        this.props.dataEstateLiability[LE],
                        0,
                        lang
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div
              className="column"
              style={{
                textAlign: "right",
                width: "300px",
                float: "right",
              }}
            >
              <table
                className="EP"
                style={{ paddingLeft: "10px", width: "100%" }}
              >
                <tbody style={{ fontSize: "14px" }}>
                  <tr>
                    <th
                      className="tableNeedsEP"
                      style={{
                        borderStyle: "hidden",
                        background: "transparent",
                        verticalAlign: "bottom",
                      }}
                    >
                      {labelsBilingual.exportData}
                      {
                        <div
                          style={{
                            paddingTop: "0px",
                            marginTop: "-3px",
                            marginLeft: "150px",
                          }}
                        >
                          <Info infoIcon={getInfoExportINA(lang)} />
                        </div>
                      }
                    </th>
                  </tr>
                  <tr>
                    <td
                      style={{
                        borderStyle: "hidden",
                        padding: "5px",
                      }}
                    >
                      <div
                        style={{ width: "100%", float: "left", clear: "left" }}
                      >
                        <input
                          className="roundedCornerCmd"
                          style={{
                            //     width: "180px",
                            marginTop: "10px",
                            marginRight: "0px",
                            paddingRight: "8px",
                            float: "right",
                          }}
                          onClick={this.doINA}
                          type="button"
                          value={TITLES[lang].appletINA}
                        />
                      </div>
                      <div
                        style={{ width: "100%", float: "left", clear: "left" }}
                      >
                        <input
                          className="roundedCornerCmd"
                          style={{
                            //    width: "80px",
                            marginTop: "-1px",
                            marginRight: "0px",
                            paddingRight: "8px",
                            float: "right",
                          }}
                          onClick={this.doLIFO}
                          type="button"
                          value={CONTROLTITLE[lang].lifo}
                        />
                      </div>
                      <div
                        style={{ width: "100%", float: "left", clear: "left" }}
                      >
                        <input
                          className="roundedCornerCmd"
                          style={{
                            //    width: "80px",
                            marginTop: "-1px",
                            marginRight: "0px",
                            paddingRight: "8px",
                            float: "right",
                          }}
                          onClick={this.doCA}
                          type="button"
                          value={CONTROLTITLE[lang].ca}
                        />
                      </div>
                      <div
                        style={{ width: "100%", float: "left", clear: "left" }}
                      >
                        <input
                          className="roundedCornerCmd"
                          style={{
                            //    width: "80px",
                            marginTop: "-1px",
                            marginRight: "0px",
                            paddingRight: "8px",
                            float: "right",
                          }}
                          onClick={this.doEB}
                          type="button"
                          value={CONTROLTITLE[lang].eb}
                        />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div
          id="presentation"
          className="presentation"
          /*  style={{ marginTop: "80px" }} */
        >
          <div ref={(r) => (this.refSection1 = r)}>
          <div className="newPage" id="Page1">
            <div style={{ maxHeight: "300px" }}>{images.logo1stPage}</div>

            {this.useNewPDFMethod && (
              <div
                className="printOnly"
                style={{
                  height:
                    this.props.dataInput.Presentations[0].adviserLogo.image ===
                    null
                      ? "350px"
                      : "100px",
                }}
              >
                {" "}
              </div>
            )}
            <div style={{ maxHeight: "400px" }}>{images.applet}</div>

            <h1 className="ppi2">{labelsBilingual.pg1T}</h1>
            <h5 className="ppi2">
              {labelsBilingual.pg1P1} {this.output.designedFor}
              <br />
              {labelsBilingual.pg1P2} {this.output.designedBy}
              <br />
              {labelsBilingual.pg1P3} {this.output.dateApplet}
              <br />
              {labelsBilingual.pg1P4} {this.output.province}
              <br />
            </h5>
            <pagebreak />
          </div>

          {/* PAGE 2 Intro*/}

          <div className="newPage" id="Page2">
            {logoTop}
            <hr className="ppi2 no-print" />
            <div className="pdfHeader">{headerTitle}</div>

            <div style={styleWithLogo}>
              {/* {allPages && (
              <AdjustibleImage
                image={this.props.dataInput.Presentations[0].adviserLogo.image}
                showDetails={false}
                size={this.props.dataInput.Presentations[0].adviserLogo.size}
                imageLeft={
                  this.props.dataInput.Presentations[0].adviserLogo.left
                }
                allPages={
                  this.props.dataInput.Presentations[0].adviserLogo.allPages
                }
                imageRemove={this.props.imageRemove}
                imageAdjust={this.props.imageAdjust}
                ID={"EPOtherPagesLogo"}
              />
            )} */}
              
              <h2 className="ppi2">{labelsBilingual.pg2T}</h2>
              {/* number changed to bullets feek */}
              {labelsBilingual.pg2Paragraphs.map((item) => (
                <p className="ppi2" key={p2++}>
                  {p2 >= 4 && p2 !== 6 && p2 !== 9 && p2 <= 12 && (
                    <span
                      style={{
                        paddingLeft: "15px",
                        paddingRight: "5px",
                        color: "#759AC7",
                        fontSize: "18px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {/*{p2 < 6 ? p2 - 3 : p2 < 9 ? p2 - 4 : p2 - 5}.{" "}*/}
                      &#8226;
                    </span>
                  )}{" "}
                  {item}
                  <br />
                </p>
              ))}
            </div>
            <pagebreak />
          </div>

          {/* PAGE 3 fin situation*/}
          <div className="newPage" id="Page3">
            {logoTop}
            <hr className="ppi2 no-print" />
            <div className="pdfHeader">{headerTitle}</div>

            <div style={styleWithLogo}>
              {/* {allPages && (
              <AdjustibleImage
                image={this.props.dataInput.Presentations[0].adviserLogo.image}
                showDetails={false}
                size={this.props.dataInput.Presentations[0].adviserLogo.size}
                imageLeft={
                  this.props.dataInput.Presentations[0].adviserLogo.left
                }
                allPages={
                  this.props.dataInput.Presentations[0].adviserLogo.allPages
                }
                imageRemove={this.props.imageRemove}
                imageAdjust={this.props.imageAdjust}
              />
            )} */}
              
              <h2 className="ppi2">{labelsBilingual.pg3T}</h2>
              <p className="ppi2">{labelsBilingual.pg3P1}</p>

              <div style={{ fontSize: "14px" }}>
                <div
                  style={{ paddingLeft: "20px", width: "35%", float: "left" }}
                >
                  <div>
                    <table
                      className="EP"
                      style={{ paddingLeft: "10px", width: "100%" }}
                    >
                      <tbody>
                        <tr>
                          <th colSpan="2">
                            {labelsBilingual.pg3TabT}
                          </th>
                        </tr>
                        {/* add assets*/}
                        {this.output.assets.map((item) => {
                          totalAssets += item.value;
                          return (
                            <tr key={item.name}>
                              <td style={{ height: "1px", width: "65%" }}>
                                {item.name}
                                {item.name ===
                                  ASSETS.OTHER_ASSETS.value[lang] &&
                                item.value > 0
                                  ? " *"
                                  : ""}
                              </td>
                              <td
                                className="textalignright"
                                style={{ height: "1px" }}
                              >
                                {/* ${formatMoney(item.value, 0, ",", ",")} */}
                                {formatMoney2(item.value, 0, lang)}
                              </td>
                            </tr>
                          );
                        })}
                        <tr
                          key={"totalAssets"}
                          style={{
                            height: "1px",
                            width: "65%",
                            backgroundColor: "#f0f0f5",
                            textAlign: "right",
                          }}
                        >
                          <td>{labelsBilingual.pg3Tab2RTot}</td>
                          <td
                            className="textalignright"
                            style={{ height: "1px" }}
                          >
                            {/* ${formatMoney(totalAssets, 0, ",", ",")} */}
                            {formatMoney2(totalAssets, 0, lang)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    {this.output.otherAssetsList !== "" && (
                      <p
                        className="ppi2"
                        style={{
                          color: "darkgrey",
                          marginTop: "3px",
                          marginLeft: "-10px",
                          fontSize: "12px",
                          float: "left",
                        }}
                      >
                        {this.output.otherAssetsList}
                      </p>
                    )}
                  </div>
                </div>
                <div
                  style={{ paddingLeft: "23px", width: "38%", float: "left" }}
                >
                  <div>
                    <table
                      className="EP"
                      style={{ paddingLeft: "10px", width: "100%" }}
                    >
                      <tbody>
                        <tr>
                          <th colSpan="2">
                            {labelsBilingual.pg3Tab2T}
                          </th>
                        </tr>
                        {/* liabs*/}
                        {this.output.liabilities.map((item) => {
                          totalLiabs += item.value;
                          return (
                            <tr key={item.name}>
                              <td style={{ width: "60%" }}>{item.name}</td>
                              <td className="textalignright">
                                {/* ${formatMoney(item.value, 0, ",", ",")} */}
                                {formatMoney2(item.value, 0, lang)}
                              </td>
                            </tr>
                          );
                        })}
                        <tr
                          key={"totalLiabs"}
                          style={{
                            height: "1px",
                            width: "65%",
                            backgroundColor: "#f0f0f5",
                            textAlign: "right",
                          }}
                        >
                          <td>{labelsBilingual.pg3Tab2RTot}</td>
                          <td
                            className="textalignright"
                            style={{ height: "1px" }}
                          >
                            {/* ${formatMoney(totalLiabs, 0, ",", ",")} */}
                            {formatMoney2(totalLiabs, 0, lang)}
                          </td>
                        </tr>
                        <tr
                          key={"netWorth"}
                          style={{
                            height: "1px",
                            width: "65%",
                            backgroundColor: "#d1d1e0",
                            textAlign: "right",
                          }}
                        >
                          <td>{labelsBilingual.pg3Tab2NW}</td>
                          <td
                            className="textalignright"
                            style={{ height: "1px" }}
                          >
                            {/* ${formatMoney(totalAssets-totalLiabs, 0, ",", ",")} */}
                            {formatMoney2(totalAssets - totalLiabs, 0, lang)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ float: "left" }}>
              <h2 className="ppi2">{labelsBilingual.pg3T2}</h2>
              <p className="ppi2">{labelsBilingual.pg3P2}</p>
              <p className="ppi2">{labelsBilingual.pg3P3}</p>
            </div>
            <div
              style={{
                fontFamily: "Georgia, 'Times New Roman', imes, serif",
                fontSize: "14px",
              }}
            >
              <div style={{ paddingLeft: "20px", width: "70%", float: "left" }}>
                <div>
                  <table
                    className="EP"
                    style={{ paddingLeft: "10px", width: "100%" }}
                  >
                    <tbody>
                      <tr>
                        <th style={{ width: "30%" }}>
                          {labelsBilingual.pg3Tab3R1C1}
                        </th>
                        <th style={{ width: "20%" }}>
                          {labelsBilingual.pg3Tab3R1C2}
                        </th>
                        <th style={{ width: "20%" }}>
                          {labelsBilingual.pg3Tab3R1C3}
                        </th>
                        <th style={{ width: "20%" }}>
                          {labelsBilingual.pg3Tab3R1C4}
                        </th>
                      </tr>
                      <tr>
                        <td>{labelsBilingual.pg3Tab3R2C1}</td>
                        <td className="textalignright">
                          {
                            this.AssetLiabProjs.EstateLiabsByTypeGrowth[
                              ASSET_TAX_TYPE_REAL_ESTATE
                            ]
                          }
                        </td>
                        <td className="textalignright">
                          {/* $
                        {formatMoney(
                          this.AssetLiabProjs.EstateLiabsByType[ASSET_TAX_TYPE_REAL_ESTATE],
                          0,
                          ",",
                          ","
                        )} */}
                          {formatMoney2(
                            this.AssetLiabProjs.EstateLiabsByType[
                              ASSET_TAX_TYPE_REAL_ESTATE
                            ],
                            0,
                            lang
                          )}
                        </td>
                        <td className="textalignright">
                          {/* $
                        {formatMoney(
                          this.AssetLiabProjs.EstateLiabsByTypeLE3[
                            ASSET_TAX_TYPE_REAL_ESTATE
                          ],
                          0,
                          ",",
                          ","
                        )} */}
                          {formatMoney2(
                            this.AssetLiabProjs.EstateLiabsByTypeLE3[
                              ASSET_TAX_TYPE_REAL_ESTATE
                            ],
                            0,
                            lang
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td>{labelsBilingual.pg3Tab3R3C1}</td>
                        <td className="textalignright">
                          {
                            this.AssetLiabProjs.EstateLiabsByTypeGrowth[
                              ASSET_TAX_TYPE_STOCKS
                            ]
                          }
                        </td>
                        <td className="textalignright">
                          {/* $
                        {formatMoney(
                          this.AssetLiabProjs.EstateLiabsByType[ASSET_TAX_TYPE_STOCKS],
                          0,
                          ",",
                          ","
                        )} */}
                          {formatMoney2(
                            this.AssetLiabProjs.EstateLiabsByType[
                              ASSET_TAX_TYPE_STOCKS
                            ],
                            0,
                            lang
                          )}
                        </td>
                        <td className="textalignright">
                          {/* $
                        {formatMoney(
                          this.AssetLiabProjs.EstateLiabsByTypeLE3[ASSET_TAX_TYPE_STOCKS],
                          0,
                          ",",
                          ","
                        )} */}
                          {formatMoney2(
                            this.AssetLiabProjs.EstateLiabsByTypeLE3[
                              ASSET_TAX_TYPE_STOCKS
                            ],
                            0,
                            lang
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td>{labelsBilingual.pg3Tab3R4C1}</td>
                        <td className="textalignright">
                          {
                            this.AssetLiabProjs.EstateLiabsByTypeGrowth[
                              ASSET_TAX_TYPE_SMALL_BUS
                            ]
                          }
                        </td>
                        <td className="textalignright">
                          {/* $
                        {formatMoney(
                          this.AssetLiabProjs.EstateLiabsByType[ASSET_TAX_TYPE_SMALL_BUS],
                          0,
                          ",",
                          ","
                        )} */}
                          {formatMoney2(
                            this.AssetLiabProjs.EstateLiabsByType[
                              ASSET_TAX_TYPE_SMALL_BUS
                            ],
                            0,
                            lang
                          )}
                        </td>
                        <td className="textalignright">
                          {/* $
                        {formatMoney(
                          this.AssetLiabProjs.EstateLiabsByTypeLE3[ASSET_TAX_TYPE_SMALL_BUS],
                          0,
                          ",",
                          ","
                        )} */}
                          {formatMoney2(
                            this.AssetLiabProjs.EstateLiabsByTypeLE3[
                              ASSET_TAX_TYPE_SMALL_BUS
                            ],
                            0,
                            lang
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td>{labelsBilingual.pg3Tab3R5C1}</td>
                        <td className="textalignright">
                          {
                            this.AssetLiabProjs.EstateLiabsByTypeGrowth[
                              ASSET_TAX_TYPE_RRSP
                            ]
                          }
                        </td>
                        <td className="textalignright">
                          {/* $
                        {formatMoney(
                          this.AssetLiabProjs.EstateLiabsByType[ASSET_TAX_TYPE_RRSP],
                          0,
                          ",",
                          ","
                        )} */}
                          {formatMoney2(
                            this.AssetLiabProjs.EstateLiabsByType[
                              ASSET_TAX_TYPE_RRSP
                            ],
                            0,
                            lang
                          )}
                        </td>
                        <td className="textalignright">
                          {/* $
                        {formatMoney(
                          this.AssetLiabProjs.EstateLiabsByTypeLE3[ASSET_TAX_TYPE_RRSP],
                          0,
                          ",",
                          ","
                        )} */}
                          {formatMoney2(
                            this.AssetLiabProjs.EstateLiabsByTypeLE3[
                              ASSET_TAX_TYPE_RRSP
                            ],
                            0,
                            lang
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td>{labelsBilingual.pg3Tab3R6C1}</td>
                        <td className="textalignright">
                          {
                            this.AssetLiabProjs.EstateLiabsByTypeGrowth[
                              ASSET_TAX_TYPE_INTEREST
                            ]
                          }
                        </td>
                        <td className="textalignright">
                          {/* $
                        {formatMoney(
                          this.AssetLiabProjs.EstateLiabsByType[ASSET_TAX_TYPE_INTEREST],
                          0,
                          ",",
                          ","
                        )} */}
                          {formatMoney2(
                            this.AssetLiabProjs.EstateLiabsByType[
                              ASSET_TAX_TYPE_INTEREST
                            ],
                            0,
                            lang
                          )}
                        </td>
                        <td className="textalignright">
                          {/* $
                        {formatMoney(
                          this.AssetLiabProjs.EstateLiabsByTypeLE3[ASSET_TAX_TYPE_INTEREST],
                          0,
                          ",",
                          ","
                        )} */}
                          {formatMoney2(
                            this.AssetLiabProjs.EstateLiabsByTypeLE3[
                              ASSET_TAX_TYPE_INTEREST
                            ],
                            0,
                            lang
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td>{labelsBilingual.pg3Tab3R7C1}</td>
                        <td className="textalignright">
                          {
                            this.AssetLiabProjs.EstateLiabsByTypeGrowth[
                              ASSET_TAX_TYPE_OTHER
                            ]
                          }
                        </td>
                        <td className="textalignright">
                          {/* $
                        {formatMoney(
                          this.AssetLiabProjs.EstateLiabsByType[ASSET_TAX_TYPE_INTEREST],
                          0,
                          ",",
                          ","
                        )} */}
                          {formatMoney2(
                            this.AssetLiabProjs.EstateLiabsByType[
                              ASSET_TAX_TYPE_OTHER
                            ],
                            0,
                            lang
                          )}
                        </td>
                        <td className="textalignright">
                          {/* $
                        {formatMoney(
                          this.AssetLiabProjs.EstateLiabsByTypeLE3[ASSET_TAX_TYPE_INTEREST],
                          0,
                          ",",
                          ","
                        )} */}
                          {formatMoney2(
                            this.AssetLiabProjs.EstateLiabsByTypeLE3[
                              ASSET_TAX_TYPE_OTHER
                            ],
                            0,
                            lang
                          )}
                        </td>
                      </tr>
                      <tr
                        style={{
                          backgroundColor: "#f0f0f5",
                          textAlign: "right",
                        }}
                      >
                        <td colSpan="2">{labelsBilingual.pg3Tab3R8C1}</td>
                        <td className="textalignright">
                          {/* ${formatMoney(this.AssetLiabProjs.EstateLiabsByTypeTotal, 0, ",", ",")} */}
                          {formatMoney2(
                            this.AssetLiabProjs.EstateLiabsByTypeTotal,
                            0,
                            lang
                          )}
                        </td>
                        <td className="textalignright">
                          {/* ${formatMoney(this.AssetLiabProjs.EstateLiabsByTypeLE3Total, 0, ",", ",")} */}
                          {formatMoney2(
                            this.AssetLiabProjs.EstateLiabsByTypeLE3Total,
                            0,
                            lang
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <p
                className="ppi2"
                style={{
                  color: "darkgrey",
                  marginTop: "3px",
                  fontSize: "12px",
                  float: "left",
                }}
              >
                {labelsBilingual.pg3P4}
                <br />
                {labelsBilingual.pg3P5}
              </p>
            </div>
            <pagebreak />
          </div>

          {/* PAGE 4 fin situation*/}

          <div className="newPage" id="Page4">
            {logoTop}
            <hr className="ppi2 no-print" />
            <div className="pdfHeader">{headerTitle}</div>
            <div style={styleWithLogo}>
              {/* {allPages && (
              <AdjustibleImage
                image={this.props.dataInput.Presentations[0].adviserLogo.image}
                showDetails={false}
                size={this.props.dataInput.Presentations[0].adviserLogo.size}
                imageLeft={
                  this.props.dataInput.Presentations[0].adviserLogo.left
                }
                allPages={
                  this.props.dataInput.Presentations[0].adviserLogo.allPages
                }
                imageRemove={this.props.imageRemove}
                imageAdjust={this.props.imageAdjust}
              />
            )} */}
              
              <h2 className="ppi2">{labelsBilingual.pg4T}</h2>
              <p className="ppi2">{labelsBilingual.pg4P1}</p>
            </div>
            <div /* style={{height:"400px"}} */>
              {loaded === true && (
                <OutputGraphStacked
                  language={lang}
                  dataAges={dataAges}
                  dataAssetnEstateLiabProj={
                    this.AssetLiabProjs.AssetnEstateLiabs
                  }
                  LE={LE}
                  useNewPDFMethod={this.useNewPDFMethod}
                  stackedChartConvertedToBase64={
                    this.state.stackedChartConvertedToBase64
                  }
                  graphStackedDone={this.graphStackedDone}
                />
              )}
            </div>
            <div
              className="ppi2"
              style={{
                color: "darkgrey",
                marginTop: "30px",
                fontSize: "12px",
                float: "left",
                clear: "both",
              }}
            >
              {labelsBilingual.pg4P2 + LE + ")"}
            </div>
            <p
              className="ppi2"
              style={{
                backgroundColor: "lightgrey",
                width: "84%",
                marginTop: "30px",
                paddingTop: "10px",
                paddingBottom: "12px",
                marginLeft: "30px",
                float: "left",
              }}
            >
              {labelsBilingual.pg4P3
                .replace(
                  "X1",
                  formatMoney2(
                    this.AssetLiabProjs.EstateLiabsByTypeTotal,
                    0,
                    lang
                  )
                )
                .replace(
                  "X2",
                  formatMoney2(
                    this.AssetLiabProjs.EstateLiabsByTypeLE3Total,
                    0,
                    lang
                  )
                )}
            </p>
            <div>
              <OutputGraphsEPLeakage
                insuranceNeed={this.props.insuranceNeed}
                projectEnd={startAge + LE + 3}
                dataInput={this.props.dataInput}
                dataNAAges={dataAges}
                probate={this.props.probate}
                lifeExp={LE}
                lifeExpJLTD={LE}
                lifeExpClient={LE}
                INAOption={this.INAOption}
                LE={this.props.LE}
                assetProjections={this.props.assetProjections}
                showLeakageOnly={true}
                useNewPDFMethod={this.useNewPDFMethod}
                pieEstateLeakageConvertedToBase64={
                  this.state.pieEstateLeakageConvertedToBase64
                }
                pieEstateLeakage2ConvertedToBase64={
                  this.state.pieEstateLeakage2ConvertedToBase64
                }
                graphEstateLeakageDone={this.graphEstateLeakageDone}
                graphEstateLeakageLEDone={this.graphEstateLeakageLEDone}

              />
            </div>{" "}
            <pagebreak />
          </div>

          {/* PAGE 5 Estate Protection Alternatives*/}
          <div className="newPage" id="Page5">
            {logoTop}
            <hr className="ppi2 no-print" />
            <div className="pdfHeader">{headerTitle}</div>

            <div style={styleWithLogo}>
              {/* {allPages && (
              <AdjustibleImage
                image={this.props.dataInput.Presentations[0].adviserLogo.image}
                showDetails={false}
                size={this.props.dataInput.Presentations[0].adviserLogo.size}
                imageLeft={
                  this.props.dataInput.Presentations[0].adviserLogo.left
                }
                allPages={
                  this.props.dataInput.Presentations[0].adviserLogo.allPages
                }
                imageRemove={this.props.imageRemove}
                imageAdjust={this.props.imageAdjust}
              />
            )} */}
              
              <h2 className="ppi2">{labelsBilingual.pg5T}</h2>

              {labelsBilingual.pg5Paragraphs.map((item) => (
                <p className="ppi2" key={p5++}>
                  {p5 >= 4 && p5 !== 8 && p5 <= 12 && (
                    <span style={{ paddingLeft: "15px", color: "#759AC7" }}>
                      {p5 < 8 ? p5 - 3 : p5 - 8}.{" "}
                    </span>
                  )}{" "}
                  {item}
                  <br />
                </p>
              ))}

              <p
                className="ppi2"
                style={{
                  backgroundColor: "lightgrey",
                  width: "84%",
                  marginTop: "30px",
                  paddingTop: "10px",
                  paddingBottom: "12px",
                  marginLeft: "30px",
                }}
              >
                {labelsBilingual.pg5Plast}
              </p>
            </div>
            <pagebreak />
          </div>

          {/* PAGE 6 Using Life Insurance to Preserve Your Estate*/}
          <div className="newPage" id="Page6">
            {logoTop}
            <hr className="ppi2 no-print" />
            <div className="pdfHeader">{headerTitle}</div>

            <div style={styleWithLogo}>
              {/* {allPages && (
              <AdjustibleImage
                image={this.props.dataInput.Presentations[0].adviserLogo.image}
                showDetails={false}
                size={this.props.dataInput.Presentations[0].adviserLogo.size}
                imageLeft={
                  this.props.dataInput.Presentations[0].adviserLogo.left
                }
                allPages={
                  this.props.dataInput.Presentations[0].adviserLogo.allPages
                }
                imageRemove={this.props.imageRemove}
                imageAdjust={this.props.imageAdjust}
              />
            )}
 */}
              
              <h2 className="ppi2">{labelsBilingual.pg6T}</h2>
              {labelsBilingual.pg6Paragraphs1.map((item) => (
                <p className="ppi2" key={p6++}>
                  {p6 >= 4 && p6 <= 6 && (
                    <span style={{ paddingLeft: "15px", color: "#759AC7" }}>
                      {p6 < 8 ? p6 - 3 : p6 - 8}.{" "}
                    </span>
                  )}{" "}
                  {item}
                  <br />
                </p>
              ))}
              {/*} don't show for now*/}
              {/* {labelsBilingual.pg6Paragraphs2.map(item =>
              (<p className="ppi2" key={p6++}>{p6 > 12 && <span style={{ paddingLeft: '15px', color: '#759AC7' }}>&#8226;  </span>} {item}<br /></p>)
            )} */}
            </div>

            {/*  <pagebreak />
          </div> */}

            {/* PAGE 7 Summary*/}
            {/* <div className="newPage" id="Page7">
            {logoTop}
            <hr className="ppi2 no-print" />
            <div className="pdfHeader">{headerTitle}</div> */}

            <div style={styleWithLogo}>
              
              <h2 className="ppi2">{labelsBilingual.pg7T}</h2>
              <p className="ppi2">{labelsBilingual.pg7P1}</p>
            </div>

            <pagebreak />
          </div>
          </div> {/* end section1   */}
          {/* PAGE 8 appendix ledgers*/}
          <div className="newPage" id="Page8">
          <div ref={(r) => (this.refSection2 = r)}>
            {logoTop}
            <hr className="ppi2 no-print" />
            <div className="pdfHeader">{headerTitle}</div>

            <div style={styleWithLogoGrids}>
              
              <h2 className="ppi2">{labelsBilingual.pg8T}</h2>

              <p className="ppi2">{labelsBilingual.pg8P2}</p>

              <div className="ppi2 no-print" style={{ marginLeft: "24px" }}>
                <MultiButtons
                  noButtons={2}
                  buttonCaption={[labelsBilingual.pg8O1, labelsBilingual.pg8O2]}
                  selected={this.state.showGrids ? 2 : 1}
                  selectMultiButton={this.clickMultiButton}
                />
              </div>
              
              <div>
              {this.useNewPDFMethod && (
                <div className="printOnly" style={{ width: "90%", fontSize:".8em" }}>
                  <AggregateGrid
                    aggregateGrid={this.props.aggregateGrid}
                    LE={this.props.LE}
                    lang={lang}
                    insNeedLine={""}
                    GridForPDF={true}
                  />
                   <pagebreak />
                   {this.AssetLiabProjs.projectionsGrids.map((grid) => {
                    //console.log(grid.dataColTitles)

                    let rows = [];
                    let title=[];
                    for (var idx = 0; idx < grid.dataColTitles.length; idx++){
                      let tID = `cell${i}-${idx}`
                      title.push(<td key={tID} id={tID}>{grid.dataColTitles[idx]}</td>)
                    }
                    
                    for (var i = 0; i < grid.dataProjection[0].length; i++){
                      let rowID = `row${i}`
                      let cell = []
let upTo=25
                      if (i>upTo)
                      {
                        if(i%5===0)
                        {
                        for (var idx = 0; idx < grid.dataColTitles.length; idx++){
                          let cellID = `cell${i}-${idx}`
                          cell.push(<td key={cellID} id={cellID}>{grid.dataProjection[idx][i]}</td>)
                        }  
                      }
                    }
                      else{
                        for (var idx = 0; idx < grid.dataColTitles.length; idx++){
                          let cellID = `cell${i}-${idx}`
                          cell.push(<td key={cellID} id={cellID}>{grid.dataProjection[idx][i]}</td>)
                        }
                      }


                      rows.push(<tr key={i} id={rowID}>{cell}</tr>)
                    }
                  
//                    console.log(grid.dataProjection,rows)

                    return (
                      <div className="newPage" id={"assets Page".concat(j)}>
                      <h4 className="ppi2">{grid.gridTitle}</h4>
                      <div className="container">
                        <div className="row">
                          <div className="col s12 board">
                            <table className="INA" id="simple-board">
                              <thead>
                                {title}
                              </thead>
                              <tbody>
                                {rows}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                      

                      {/* <DataTable
                        key={j++}
                        dataColTitles={grid.dataColTitles}
                        dataProjection={grid.dataProjection}
                        gridTitle={grid.gridTitle}
                        gridIcons={[]}
                        specialRow={LE - startAge}
                        language={lang}
                        GridForPDF={true}
                      /> */}
                       <pagebreak /></div>
                    );
                  })}
                </div>)}
              </div>
              <div
                id="assetGrid"
                className="no-print"
                style={{
                  clear: "both",
                  float: "left",
                  marginLeft: "25px",
                }} /*    onClick={this.clone2}  */
              >
                {this.state.showGrids && 
                  this.AssetLiabProjs.projectionsGrids.map((grid) => {
                    //console.log(grid.dataColTitles)
                    return (
                      <DataTable
                        key={j++}
                        dataColTitles={grid.dataColTitles}
                        dataProjection={grid.dataProjection}
                        gridTitle={grid.gridTitle}
                        gridIcons={[]}
                        specialRow={LE - startAge}
                        language={lang}
                      />
                    );
                  })}
              </div>
            </div>

            <pagebreak />
          </div>
          </div>        
          {/* PAGE 9 notes*/}
          <div className="newPage" id="Page9">
          <div ref={(r) => (this.refSection3 = r)}>
          
            {logoTop}
            <hr className="ppi2 no-print" />
            <div className="pdfHeader">{headerTitle}</div>
            <div style={styleWithLogo}>
              {/* {allPages && (
              <AdjustibleImage
                image={this.props.dataInput.Presentations[0].adviserLogo.image}
                showDetails={false}
                size={this.props.dataInput.Presentations[0].adviserLogo.size}
                imageLeft={
                  this.props.dataInput.Presentations[0].adviserLogo.left
                }
                allPages={
                  this.props.dataInput.Presentations[0].adviserLogo.allPages
                }
                imageRemove={this.props.imageRemove}
                imageAdjust={this.props.imageAdjust}
              />
            )} */}
              
              <h2 className="ppi2">{labelsBilingual.pg9T}</h2>

              <p className="ppi2">{labelsBilingual.pg9P1}</p>
              <p className="ppi2">{labelsBilingual.pg9P2}</p>

              <pagebreak />
            </div>{" "}
          </div>
        </div>
        </div>
      </div>
    );
  }
}
