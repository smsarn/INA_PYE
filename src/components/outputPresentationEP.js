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
import {getLogoAndAppletImage,getAgesEP} from "../utils/helper";
import { getInfoExportINA  } from "../definitions/infoIconsDefinitions";
import { Info } from "./Info";

//import { AdjustibleImage } from "./AdjustibleImage";
//import jsPDF from 'jspdf';
//import * as jsPDF from 'jspdf';
import {
  formatMoney,
  formatMoney2,
  getListItemNameFromKey,
  getProjectedLiabilities,
} from "../utils/helper";
import { getOutputValues, setUIDataToAPI } from "../data/dataExchange";
import { getAssetLiabProjections } from "../data/aggregateGridProjections";
import { OutputGraphStacked } from "./OutputGraphStacked";
import {
  fetchAssetProjectionAPI,
  fetchAssetProjection,
  fetchAssetFMVandTaxLiab,
} from "../utils/FetchAPIs";

import { getAssetGridValues } from "../data/assetGridProjections";
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

export default class OutputPresentationEP extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      showGrids: false,
      image: this.props.dataInput.Presentations[0].adviserLogo.image,
      imageSize: 90,
      imageAlign: 2,
    };
    this.AssetLiabProjs = null;
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

  componentWillReceiveProps(nextProps) {
    this.setState({ showGrids: false });
  }

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
    const styleWithLogo = { overflow: "hidden", width: "100%", overflowX: "auto" };
    const styleWithLogoGrids = {width: "100%" };
    
    const lang = this.props.dataInput.Presentations[0].language;
    const LE = this.props.LE;
    const clients = this.props.dataInput.Clients;

    let loaded =
      this.AssetLiabProjs.AssetnEstateLiabs.length > 0 ? true : false;

    
  
    //let dataAges = [];

    const startAge =
      clients.length > 1
        ? Math.min(clients[QUOTE_SPOUSE].Age, clients[QUOTE_CLIENT].Age)
        : clients[QUOTE_CLIENT].Age;
    // do to LE+3


    let dataAges=getAgesEP (clients, LE)
    

    let p2 = 1;
    let p5 = 1;
    let p6 = 1;
   
    //const { grids, loading } = this.state;
    let totalAssets = 0;
    let totalLiabs = 0;
    if (this.AssetLiabProjs.projectionsGrids[0] === undefined) {
      return <div class="loader-container"><div class="loader"></div></div> //<div><Loader type="TailSpin" color="black" height={30} width={30} /></div>
    }


    const allPages =
      this.props.dataInput.Presentations[0].adviserLogo.image !== null &&
      this.props.dataInput.Presentations[0].adviserLogo.allPages;

    let j = 0;

    const images=getLogoAndAppletImage(this.props.dataInput, this.props.imageRemove,this.props.imageAdjust)
    const logoTop=images.logoTop
    const logoBottom=images.logoBottom
   

    return (
      <div id="presentation">
        <input
          className="roundedCornerCmd"
          style={{
            //width: "90px",
            marginTop: "-32px",
                marginRight: "0px",
                paddingRight: "8px",
                float: "right",
          }}
          onClick={this.doPDF}
          type="button"
          value={CONTROLTITLE[lang].pdf}
        />
        <div style={{ width: "100%", float: "left", clear: "left" }}>

      

            <input
              className="roundedCornerCmd"
              style={{
           //     width: "180px",
                marginTop: "25px",
                marginRight: "0px",
                paddingRight: "8px",
                float: "right",
              }}
              onClick={this.doINA}
              type="button"
              value={TITLES[lang].appletINA}
            />{<div style={{
                 paddingTop: "10px",
                 float: "right",
               }}><Info infoIcon={getInfoExportINA(lang)}/></div>} 
          </div>
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
        {/* <h3 className="ppi1">
          {needTo}: {this.props.insuranceNeed}
        </h3>
 */}

        <div className="contentPres">
          {/* PAGE 1 */}

          <p />
        {/* add logo */}
          {images.logo1stPage}
            {/* add image */}
            {images.applet}

{/*           {this.props.dataInput.Presentations[0].adviserLogo.image !== null && (
            <AdjustibleImage
              image={this.props.dataInput.Presentations[0].adviserLogo.image}
              showDetails={
                this.props.dataInput.Presentations[0].adviserLogo.showDetails
              }
              size={this.props.dataInput.Presentations[0].adviserLogo.size}
              imageLeft={this.props.dataInput.Presentations[0].adviserLogo.left}
              allPages={
                this.props.dataInput.Presentations[0].adviserLogo.allPages
              }
              imageRemove={this.props.imageRemove}
              imageAdjust={this.props.imageAdjust}
              ID={"AdvisorLogo"}
            />
          )}
          <AdjustibleImage
            image={require("../images/estate.protection.applet.cover.graphic.png")}
            showDetails={false}
            size={OUTPUT_WIDTH_PCT}
            imageLeft={0}
            ID={"EPPage1"}
          />
 */}          {/*            <img
            className="ppi1"
            id="EPPage1"
            src={require("../images/estate.protection.applet.cover.graphic.png")}
            width="90%"
          />  */}
          <h1 className="ppi1">{OUTPUTTEXTEP[lang].pg1T}</h1>
          <h5 className="ppi2">
            {OUTPUTTEXTEP[lang].pg1P1} {this.output.designedFor}
            <br />
            {OUTPUTTEXTEP[lang].pg1P2} {this.output.designedBy}
            <br />
            {OUTPUTTEXTEP[lang].pg1P3} {this.output.dateApplet}
            <br />
            {OUTPUTTEXTEP[lang].pg1P4} {this.output.province}
            <br />
          </h5>
          <hr className="ppi1" />
          
          {logoBottom}
          {/* PAGE 2 Intro*/}

          <div style={styleWithLogo}>
          {logoTop}
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
            <br />
            <h2 className="ppi1">{OUTPUTTEXTEP[lang].pg2T}</h2>
            {/* number changed to bullets feek */}
            {OUTPUTTEXTEP[lang].pg2Paragraphs.map((item) => (
              <p className="ppi1" key={p2++}>
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

          {/* PAGE 3 fin situation*/}
          {logoBottom}
          
          <div style={styleWithLogo}>
          {logoTop}
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
            <br />
            <h2 className="ppi1">{OUTPUTTEXTEP[lang].pg3T}</h2>
            <p className="ppi1">{OUTPUTTEXTEP[lang].pg3P1}</p>

            <div style={{ fontSize: "14px" }}>
              <div style={{ paddingLeft: "20px", width: "35%", float: "left" }}>
                <div>
                  <table
                    className="tableEP"
                    style={{ paddingLeft: "10px", width: "100%" }}
                  >
                    <tbody>
                      <tr>
                        <th className="tableTitleEP" colSpan="2">
                          {OUTPUTTEXTEP[lang].pg3TabT}
                        </th>
                      </tr>
                      {/* add assets*/}
                      {this.output.assets.map((item) => {
                        totalAssets += item.value;
                        return (
                          <tr key={item.name}>
                            <td style={{ height: "1px", width: "65%" }}>
                              {item.name}
                              {item.name === ASSETS.OTHER_ASSETS.value[lang] &&
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
                        <td>{OUTPUTTEXTEP[lang].pg3Tab2RTot}</td>
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
                      className="ppi1"
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
              <div style={{ paddingLeft: "23px", width: "38%", float: "left" }}>
                <div>
                  <table
                    className="tableEP"
                    style={{ paddingLeft: "10px", width: "100%" }}
                  >
                    <tbody>
                      <tr>
                        <th className="tableTitleEP" colSpan="2">
                          {OUTPUTTEXTEP[lang].pg3Tab2T}
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
                        <td>{OUTPUTTEXTEP[lang].pg3Tab2RTot}</td>
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
                        <td>{OUTPUTTEXTEP[lang].pg3Tab2NW}</td>
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
          <h2 className="ppi1">{OUTPUTTEXTEP[lang].pg3T2}</h2>
          <p className="ppi1">{OUTPUTTEXTEP[lang].pg3P2}</p>
          <p className="ppi1">{OUTPUTTEXTEP[lang].pg3P3}</p>

          <div
            style={{
              fontFamily: "Georgia, 'Times New Roman', imes, serif",
              fontSize: "14px",
            }}
          >
            <div style={{ paddingLeft: "20px", width: "70%", float: "left" }}>
              <div>
                <table
                  className="tableEP"
                  style={{ paddingLeft: "10px", width: "100%" }}
                >
                  <tbody>
                    <tr>
                      <th className="tableTitleEP" style={{ width: "30%" }}>
                        {OUTPUTTEXTEP[lang].pg3Tab3R1C1}
                      </th>
                      <th className="tableTitleEP" style={{ width: "20%" }}>
                        {OUTPUTTEXTEP[lang].pg3Tab3R1C2}
                      </th>
                      <th className="tableTitleEP" style={{ width: "20%" }}>
                        {OUTPUTTEXTEP[lang].pg3Tab3R1C3}
                      </th>
                      <th className="tableTitleEP" style={{ width: "20%" }}>
                        {OUTPUTTEXTEP[lang].pg3Tab3R1C4}
                      </th>
                    </tr>
                    <tr>
                      <td>{OUTPUTTEXTEP[lang].pg3Tab3R2C1}</td>
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
                      <td>{OUTPUTTEXTEP[lang].pg3Tab3R3C1}</td>
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
                      <td>{OUTPUTTEXTEP[lang].pg3Tab3R4C1}</td>
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
                      <td>{OUTPUTTEXTEP[lang].pg3Tab3R5C1}</td>
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
                      <td>{OUTPUTTEXTEP[lang].pg3Tab3R6C1}</td>
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
                      <td>{OUTPUTTEXTEP[lang].pg3Tab3R7C1}</td>
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
                      style={{ backgroundColor: "#f0f0f5", textAlign: "right" }}
                    >
                      <td colSpan="2">{OUTPUTTEXTEP[lang].pg3Tab3R8C1}</td>
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
              className="ppi1"
              style={{
                color: "darkgrey",
                marginTop: "3px",
                fontSize: "12px",
                float: "left",
              }}
            >
              {OUTPUTTEXTEP[lang].pg3P4}
              <br />
              {OUTPUTTEXTEP[lang].pg3P5}
            </p>
          </div>

          {logoBottom}
          
          {/* PAGE 4 fin situation*/}
          <div style={styleWithLogo}>
          {logoTop}
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
            <br />
            <h2 className="ppi1">{OUTPUTTEXTEP[lang].pg4T}</h2>
            <p className="ppi1">{OUTPUTTEXTEP[lang].pg4P1}</p>
          </div>

          {
            (loaded === true && (
              <OutputGraphStacked
                language={lang}
                dataAges={dataAges}
                dataAssetnEstateLiabProj={this.AssetLiabProjs.AssetnEstateLiabs}
                LE={LE} //
              />
            ))
          }

          <p
            className="ppi1"
            style={{
              color: "darkgrey",
              marginTop: "-30px",
              fontSize: "12px",
              float: "left",
            }}
          >
            {OUTPUTTEXTEP[lang].pg4P2 + LE + ")"}
          </p>

          <p
            className="ppi1"
            style={{
              backgroundColor: "lightgrey",
              width: "84%",
              marginTop: "30px",
              paddingTop: "10px",
              paddingBottom: "12px",
              marginLeft: "30px",
            }}
          >
            {OUTPUTTEXTEP[lang].pg4P3
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
              dataEstateLiability={this.props.dataEstateLiability}
              dataInput={this.props.dataInput}
              dataNAAges={dataAges}
              probate={this.props.probate}
              lifeExp={LE}
              lifeExpJLTD={LE}
              lifeExpClient={LE}
              INAOption={this.INAOption}
              //dataShortfall={dataShort}
              //dataAPISite={appSiteAPI}
              LE={this.props.LE}
              assetProjections={this.props.assetProjections}
              showLeakageOnly={true}
              //language={lang}
              //projectTo={this.toRetirement ? 0 : 1}
              //periodOption={DISPLAY_LIFEEXP_PLUS_3}
            />
          </div>

          {logoBottom}
          
          {/* PAGE 5 Estate Protection Alternatives*/}

          <div style={styleWithLogo}>
          {logoTop}
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
            <br />
            <h2 className="ppi1">{OUTPUTTEXTEP[lang].pg5T}</h2>

            {OUTPUTTEXTEP[lang].pg5Paragraphs.map((item) => (
              <p className="ppi1" key={p5++}>
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
              className="ppi1"
              style={{
                backgroundColor: "lightgrey",
                width: "84%",
                marginTop: "30px",
                paddingTop: "10px",
                paddingBottom: "12px",
                marginLeft: "30px",
              }}
            >
              {OUTPUTTEXTEP[lang].pg5Plast}
            </p>
          </div>

          {logoBottom}
          
          {/* PAGE 6 Using Life Insurance to Preserve Your Estate*/}

          <div
            style={{ overflowX: "hidden", overflowY: "hidden", width: "100%" }}
          >
            {logoTop}
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
            <br />
            <h2 className="ppi1">{OUTPUTTEXTEP[lang].pg6T}</h2>
            {OUTPUTTEXTEP[lang].pg6Paragraphs1.map((item) => (
              <p className="ppi1" key={p6++}>
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
            {/* {OUTPUTTEXTEP[lang].pg6Paragraphs2.map(item =>
              (<p className="ppi1" key={p6++}>{p6 > 12 && <span style={{ paddingLeft: '15px', color: '#759AC7' }}>&#8226;  </span>} {item}<br /></p>)
            )} */}
          </div>

          {logoBottom}
          
          {/* PAGE 7 Summary*/}

          <div style={styleWithLogo}>
          {logoTop}
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
            <br />
            <h2 className="ppi1">{OUTPUTTEXTEP[lang].pg7T}</h2>
            <p className="ppi1">{OUTPUTTEXTEP[lang].pg7P1}</p>
          </div>

          {/* PAGE 8 appendix ledgers*/}

          <div style={styleWithLogoGrids}>
            <br />
            <h2 className="ppi1">{OUTPUTTEXTEP[lang].pg8T}</h2>

            <p className="ppi1">{OUTPUTTEXTEP[lang].pg8P2}</p>

            <div style={{ marginLeft: "24px" }}>
              <MultiButtons
                noButtons={2}
                buttonCaption={[
                  OUTPUTTEXTEP[lang].pg8O1,
                  OUTPUTTEXTEP[lang].pg8O2,
                ]}
                selected={this.state.showGrids ? 2 : 1}
                selectMultiButton={this.clickMultiButton}
              />
            </div>
            <div
              id="assetGrid"
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

          {logoBottom}
          
          {/* PAGE 9 notes*/}

          <div style={styleWithLogo}>
          {logoTop}
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
            <br />
            <h2 className="ppi1">{OUTPUTTEXTEP[lang].pg9T}</h2>

            <p className="ppi1">{OUTPUTTEXTEP[lang].pg9P1}</p>
            <p className="ppi1">{OUTPUTTEXTEP[lang].pg9P2}</p>

            {logoBottom}
          
          </div>
        </div>
      </div>
    );
  }
}
