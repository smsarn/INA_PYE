import React, { Component } from "react";
import "./Output.css";
import { Table } from "react-bootstrap";
import {
  CONTROLTITLE,
  DISPLAY_RETIREMENT,
  DISPLAY_LIFEEXP,
  DISPLAY_ENDAGE,
  MAX_ORPHAN_DUR_QC,
  MAX_ORPHAN_DUR_NON_QC,
  ORPHAN_AGE_QC,
  ORPHAN_AGE_NON_QC,
  PROVINCE,
  SEX,
  SMOKING,
  MEMBER,
  QUOTE_CLIENT,
  QUOTE_SPOUSE,
  OUTPUT_WIDTH_PCT,
  IMAGE_APPLET_INA,
  IMAGE_LOGO,
  IMAGE_LOGO_OTHERPAGES,
  APPLET_INA,
} from "../definitions/generalDefinitions";
import { MAX_LOGO_HEIGHT, PAGE_HEIGHT } from "./PDF";
import { getName, getLogoAndAppletImage,formatted,isMobileDevice, extractCSS, versionDetails } from "../utils/helper";
import { setUIDataToAPI } from "../data/dataExchange";
import { handleFetchQueryStringSave } from "../utils/FetchAPIs";
import { OUTPUTTEXT } from "../definitions/outputDefinitions";
import { Bar } from "react-chartjs-2";
import { doSavePdfAction } from "./OutputPDF";
//import { AdjustibleImage } from "./AdjustibleImage";
//import jsPDF from 'jspdf';
//import * as jsPDF from 'jspdf';
import {
  cleanFormat,
  formatMoney,
  getListItemKeyFromName,
  numFormat,
  familyProjectionYears,
  isSingleFamily,
  
} from "../utils/helper";
import { getOutputValues } from "../data/dataExchange";
import { getInfoINA, getInfoPDF  } from "../definitions/infoIconsDefinitions";
import { Info } from "./Info";

export default class OutputPresentation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: this.props.dataInput.Presentations[0].adviserLogo,
    };
    this.dateApplet = "";
    this.pdfRef = React.createRef();
  }

  doPDF = () => {
    doSavePdfAction(this.props);
  };

  doLIFO = async () => {
    //window.top.location.href = 'localhost:8086';
    //window.parent.changeLogo();

    await window.parent.postMessage(
      "LIFO_" +
        this.props.dataInput.Presentations[0].language +
        "_" +
        this.props.encryptedInputLife1,
      "*"
    );
  };
  doWL = async () => {
    //window.top.location.href = 'localhost:8086';
    //window.parent.changeLogo();
    await window.parent.postMessage(
      "WL_" +
        this.props.dataInput.Presentations[0].language +
        "_" +
        this.props.encryptedInputLife1,
      "*"
    );
  };
  doEP = async () => {
    
  

    await window.parent.postMessage(
      "EP_" +
        this.props.dataInput.Presentations[0].language +
        "_" +
        this.props.encryptedInputLife1AndSpouse,
      "*"
    );
    // send notif to remove spinner
    window.parent.postMessage("FRAME_LOADED",	"*");
  };

  doCompuLife = () => {
    const lang = this.props.dataInput.Presentations[0].language;
   // const formatFr = lang === "fr" ? true : false;
    const FA = parseFloat(cleanFormat(this.props.insuranceNeed, lang));
    const province = this.props.dataInput.Presentations[0].provinceKey;
    var today = new Date();
    const birthYr = today.getFullYear() - this.props.dataInput.Clients[0].Age;
    const birthMth = today.getMonth() + 1;
    const birthDay = today.getDate();
    let provinceCode = 2;
    let url = "http://quotes.ppi.ca/canmain.html?comp=so";

    //console.log(url);
    url =
      url +
      "&lang=" +
      lang +
      "&ID=" +
      "TKD" +
      "&ORIGIN=" +
      "TKD" +
      "&face=" +
      parseInt(FA) +
      "&prepby=" +
      this.props.dataInput.Presentations[0].designedBy +
      "&prov=";

    if (province === PROVINCE.AB) provinceCode = "1";
    else if (province === PROVINCE.BC) provinceCode = "2";
    else if (province === PROVINCE.MB) provinceCode = "3";
    else if (province === PROVINCE.NB) provinceCode = "4";
    else if (province === PROVINCE.NF) provinceCode = "5";
    else if (province === PROVINCE.NS) provinceCode = "6";
    else if (province === PROVINCE.NT) provinceCode = "7";
    else if (province === PROVINCE.NU) provinceCode = "8";
    else if (province === PROVINCE.ON) provinceCode = "9";
    else if (province === PROVINCE.PE) provinceCode = "10";
    else if (province === PROVINCE.QC) provinceCode = "11";
    else if (province === PROVINCE.SK) provinceCode = "12";
    else if (province === PROVINCE.YU) provinceCode = "13";

    url = url + provinceCode;
   
    {
      url =
        url + "&prepfor=" + this.props.dataInput.Presentations[0].designedFor;
      url =
        url + "&byear=" + birthYr + "&bmonth=" + birthMth + "&bday=" + birthDay;

      url =
        url +
        "&sex=" +
        (this.props.dataInput.Clients[0].sexKey === SEX.MALE.Key ? "M" : "F");
      url =
        url +
        "&smoker=" +
        (this.props.dataInput.Clients[0].smokerKey === SMOKING.NON_SMOKER.Key
          ? "N"
          : "Y");
    }
    //console.log(url);
    const height = Math.min(window.innerHeight - 130 - 20, 800);
    this.externalWindow = window.open(
      url,
      "_blank",
      "width=950,height=" + height + ",left=25,top=130"
    );
    this.containerEl = this.externalWindow.document.createElement("div");
    this.externalWindow.document.body.appendChild(this.containerEl);

    /* try {
      window.open(url, "_blank");
    } catch (e) {} */
  };


  render() {
    // presentation output shared with pdf
    
    let output = getOutputValues(this.props);
    const lang = this.props.dataInput.Presentations[0].language;
    const labelsBilingual = OUTPUTTEXT[lang];
    const decimalChar = lang === "en" ? "." : ",";
    const thousands = lang === "en" ? "," : " ";
    const formatFr = lang === "fr" ? true : false;
    const dollarEn= lang === "fr" ? "" : "$";
    const dollarFr= lang === "fr" ? "$" : "";

    const singlePerson = this.props.dataInput.Clients.length === 1 ? true : false;
    const thereAfterText = singlePerson?labelsBilingual.pgTabRowThereAfter_1:labelsBilingual.pgTabRowThereAfter
    const thereAfterTextSF = singlePerson?labelsBilingual.pg5TabRow7_1:labelsBilingual.pg5TabRow7

    const clients = this.props.dataInput.Clients;
    const projYears = familyProjectionYears(
      clients,
      this.props.dataInput.Presentations[0].periodOption,
      this.props.LE,
      this.props.LE
    );
    const projectEnd = projYears.projectionEnd;
    const protectionPeriod = projYears.noProjectionYrs;
    const minAge = projYears.survivorAge;
    const singleFamily = isSingleFamily(clients);
    const noSurvivor = singlePerson && versionDetails().versionNumeric<=10014

    
    

    //const insNeedLine= getInsNeedLine(this.props.dataInput.Presentations[0], this.props.projectEnd, lang,noSurvivor,singleFamily,protectionPeriod)

    /* const protectionPeriod=this.props.projectEnd-minAge  */

    const provinceKey = getListItemKeyFromName(PROVINCE, output.province);
    let maxDur =
      provinceKey === "QC" ? MAX_ORPHAN_DUR_QC : MAX_ORPHAN_DUR_NON_QC;
    let orphAge = provinceKey === "QC" ? ORPHAN_AGE_QC : ORPHAN_AGE_NON_QC;

    // graph details
    const options = {
      legend: {
        display: false,
      },
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        xAxes: [{ stacked: true }],
        yAxes: [
          {
            stacked: true,
            /* ticks: {
              beginAtZero: true,
              steps: 10,
              stepValue: 5,
            }, */
            ticks: {
              beginAtZero: true,
              callback: function (value, index, values) {
                let result =
                  value < 1000
                    ? value
                    : Intl.NumberFormat(lang).format(value / 1000) + "K"
                return result;
              },
            },


          },
        ],
      },
    };

    // //console.log(output)

    var dataLabels = singlePerson? ["A"]:["A", "B"];
    /* var dataValues = [
      output.insNeedLE + output.totalAsset - output.totalLiab,
      output.insNeedRet + output.totalAsset - output.totalLiab,
    ]; */
    var dColor = ["#7399c6", "#d9d3a4"];
    const under25 =
      output.ygChild < maxDur
        ? output.insNeedYgChild25 + output.totalAsset - output.totalLiab
        : 0;
    const under18 =
      output.ygChild < orphAge
        ? output.insNeedYgChild18 + output.totalAsset - output.totalLiab
        : 0;

    let youngestChildEndAge=maxDur 
    if (output.hasChild)
      {
        youngestChildEndAge=Math.min(maxDur , this.props.dataInput.Clients.filter((item)=> { return item.Age===output.ygChild})[0].retirementAge)
    
        
      }
    
    
    if (output.hasChild) {
      dataLabels = ["A", "B", "C", "D"];
      /* dataValues = [
        output.insNeedLE + output.totalAsset - output.totalLiab,
        output.insNeedRet + output.totalAsset - output.totalLiab,
        under25,
        under18,
      ]; */
      dColor = ["#7399c6", "#d9d3a4", "#949ca1", "#847a18"];
    }

    /* console.log(output.clients) */
    var dataValues2 = singlePerson? [output.insNeedLE]: [output.insNeedLE, output.insNeedRet];
    if (output.hasChild) {
      if(singleFamily)
      {
        dataLabels = ["A", "B", "C"];
        dataValues2 = [
          output.insNeedRet,
          output.insNeedYgChild25,
          output.insNeedYgChild18,
        ];
        dColor = ["#d9d3a4", "#949ca1", "#847a18"];
      }
      else{
      dataLabels = ["A", "B", "C", "D"];
      dataValues2 = [
        output.insNeedLE,
        output.insNeedRet,
        output.insNeedYgChild25,
        output.insNeedYgChild18,
      ];
      dColor = ["#7399c6", "#d9d3a4", "#949ca1", "#847a18"];
    }
    }
    else if(singleFamily && output.hasChild=== false)  // single family with dep adult
      {
        dataLabels = ["A"];
        dataValues2 = [
          output.insNeedRet,
        ];
        dColor = ["#d9d3a4"];
      }
     

    /* const dataInsurance = {
      labels: dataLabels,
      datasets: [
        {
          label: "", //Income Shortfall',
          data: dataValues,
          fill: false, // Don't fill area under the line
          borderColor: "#2B3856", // Line color
          backgroundColor: dColor,
        },
      ],
    };
 */
    const dataInsurance2 = {
      labels: dataLabels,
      datasets: [
        {
          label: "", //Income Shortfall',
          data: dataValues2,
          fill: false, // Don't fill area under the line
          borderColor: "#2B3856", // Line color
          backgroundColor: dColor,
        },
      ],
    };

    const needTo = this.props.insNeedLine;
    const images = getLogoAndAppletImage(
      this.props.dataInput,
      this.props.imageRemove,
      this.props.imageAdjust
    );

    const logoTop = images.logoTop;
    const logoBottom = images.logoBottom;

    const PDFTopMargin=singleFamily?0:-37  


    if (noSurvivor) {
      return (
        <div>
          <h3 className="ppi1">{needTo}</h3>
        </div>
      );
    } else {
      return (
        <div>
          <div className="exportArea"/*  style={{ width: "20%", float: "right", clear: "left" }} */>
          
          <div ref={this.pdfRef} style={{ width: "100%", float: "left", clear: "left" }}>
          
            <input
              className="roundedCornerCmd"
              style={{
             //   width: "80px",
                marginTop: PDFTopMargin-35 +"px",
                marginRight: "0px",
                paddingRight: "8px",
                float: "right",
              }}
              onClick={this.doPDF}
              type="button"
              value={CONTROLTITLE[lang].pdf}
            /> {<div style={{
              //   width: "80px",
                 marginTop: PDFTopMargin-26 +"px",
                 marginRight: lang==="en"? "122px":"180px",
                 paddingRight: "8px",
                 float: "right",
               }}><Info infoIcon={getInfoPDF(lang)}/></div>} 
           
          </div>
          <div style={{ width: "100%", float: "left", clear: "left" }}>
            {/* <input type="file" onChange={this.onImageChange} id="logo"/> */}

            <input
              className="roundedCornerCmd"
              style={{
               // width: "180px",
                marginTop: PDFTopMargin + "px",
                paddingRight: "8px",
                float: "right",
              }}
              onClick={this.doCompuLife}
              type="button"
              value={CONTROLTITLE[lang].compulife}
            />
          </div>
          <div style={{ width: "100%", float: "left", clear: "left" }}>
            <input
              className="roundedCornerCmd"
              style={{
           //     width: "180px",
                marginTop: "10px",
                marginRight: "0px",
                paddingRight: "8px",
                float: "right",
              }}
              onClick={this.doEP}
              type="button"
              value={CONTROLTITLE[lang].ep}
            />
          </div>
          <div style={{ width: "100%", float: "left", clear: "left" }}>
            <input
              className="roundedCornerCmd"
              style={{
            //    width: "80px",
                marginTop: "0px",
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
                marginTop: "0px",
                marginRight: "0px",
                paddingRight: "8px",
                float: "right",
              }}
              onClick={this.doWL}
              type="button"
              value={CONTROLTITLE[lang].wl}
            />
          </div>
          </div>
          <div className="contentPres">
            <h3 className="ppi1">
              {needTo}
              {/* : {dollarEn}
          {formatMoney(
            cleanFormat(this.props.insuranceNeed, formatFr),
            0,
            decimalChar,
            thousands
          ) */}
              <Info infoIcon={getInfoINA(lang)} />
            </h3>

             
              {/* add logo */}
              {images.logo1stPage}
              {/* add image */}
              {images.applet}

            
              <h1 className="ppi1">{labelsBilingual.pg1T}</h1>
              <h5 className="ppi2">
                {labelsBilingual.pg1P1} {output.designedFor}
                <br />
                {labelsBilingual.pg1P2} {output.designedBy}
                <br />
                {labelsBilingual.pg1P3} {output.dateApplet}
                <br />
                {labelsBilingual.pg1P4} {output.province}
                <br />
              </h5>
              {logoBottom}
              {/* PAGE 2 profile*/}
              <hr className="ppi1" />
              {logoTop}
              <h2 className="ppi1">{labelsBilingual.pg1T}</h2>
              <div
                style={{
                  overflowX: "auto",
                  overflowY: "hidden",
                  width: "100%",
                }}
              >
                <table className="blueTable">
                  <thead>
                    <tr>
                      <th style={{ width: "30%", marginLeft: "0px" }}>
                        {singlePerson?labelsBilingual.pg2TabT1_1:labelsBilingual.pg2TabT1}
                      </th>
                      <th style={{ width: "10%" }}>
                        {labelsBilingual.pg2TabT2}
                      </th>
                      <th style={{ width: "18%" }}>
                        {labelsBilingual.pg2TabT3}
                      </th>
                      <th style={{ width: "19%" }}>
                        {singleFamily
                          ? labelsBilingual.pg2TabT4Alt
                          : labelsBilingual.pg2TabT4}
                      </th>
                      <th style={{ width: "19%" }}>
                        {labelsBilingual.pg2TabT5}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {output.clients.map((item) => (
                      <tr key={item.id}>
                        <td>
                          {item.memberKey === MEMBER.CLIENT.Key
                            ? MEMBER.CLIENT.value[lang] + getName(item.name,lang)
                            : item.memberKey === MEMBER.SPOUSE.Key
                            ? MEMBER.SPOUSE.value[lang] + getName(item.name,lang)
                            : (item.memberKey === MEMBER.CHILD.Key? MEMBER.CHILD.value[lang] + getName(item.name,lang):MEMBER.DEPENDENT_ADULT.value[lang] + getName(item.name,lang))}
                        </td>
                        <td className="textalignright">{item.age}</td>
                        <td className="textalignright">
                        {formatted(item.income,lang)}
                        {/* {dollarFr}
                          {formatMoney(
                            item.income,
                            0,
                            decimalChar,
                            thousands
                          )} */}
                        </td>
                        <td className="textalignright">
                          {singleFamily
                            ? item.memberKey === MEMBER.CLIENT.Key
                              ? "-"
                              : item.ret-item.age //protectionPeriod
                            : item.ret}
                        </td>
                        <td className="textalignright">
                          {item.memberKey === MEMBER.CLIENT.Key
                            ? numFormat(
                                clients[QUOTE_CLIENT].avgTaxRate,
                                false,
                                3, thousands,
                                decimalChar
                              )
                            : item.memberKey === MEMBER.SPOUSE.Key
                            ? numFormat(
                                clients[QUOTE_SPOUSE].avgTaxRate,
                                false,
                                3,thousands,
                                decimalChar
                              )
                            : numFormat(
                                clients[item.id - 1].avgTaxRate,
                                false,
                                3,thousands,
                                decimalChar
                              )}
                        </td>
                      </tr>
                    ))}
                    {/*}			<tr>
							
							<td>Client</td><td className="textalignrightwidth110">{dollarEn}{formatMoney(Income, 0,decimalChar,thousands)}</td><td className="textalignright">{retAge}</td><td className="textalignright">{retAge}</td></tr>
								<tr>
							<td>Spouse</td><td className="textalignrightwidth110">{dollarEn}{formatMoney(Income2, 0,decimalChar,thousands)}</td><td className="textalignright">{retAge2}</td><td className="textalignright">{retAge}</td></tr>
						*/}
                  </tbody>
                </table>
              </div>
              {/* financial summary
               */}
              <h4 className="ppi1"></h4>
              <div className="tableTitle">{labelsBilingual.pg2T3}</div>
              <table className="incomePosition">
                <tbody>
                  <tr>
                    <td className="paddingleft25">{labelsBilingual.pg2P5}</td>
                    <td className="textalignright">
                      {formatted(output.totalAssetExcludeInsurance,lang)}
                      {/* {dollarEn}
                      {formatMoney(
                        output.totalAssetExcludeInsurance,
                        0,
                        decimalChar,
                        thousands
                      )} */}
                    </td>
                  </tr>
                  <tr>
                    <td className="paddingleft25">{labelsBilingual.pg2P6}</td>
                    <td className="textalignright">
                    {formatted(output.totalLiabExcludeDeathRelated,lang)}
                      {/* {dollarEn}
                      {formatMoney(
                        output.totalLiabExcludeDeathRelated,
                        0,
                        decimalChar,
                        thousands
                      )} */}
                    </td>
                  </tr>
                  <tr>
                    <td
                      className="paddingleft25"
                      style={{ textAlign: "right" }}
                    >
                      {labelsBilingual.pg2P7}
                    </td>
                    <td className="textalignright">
                    {formatted(output.totalAssetExcludeInsurance -
                          output.totalLiabExcludeDeathRelated,lang)}
                    
                    {/*   {dollarEn}
                      {formatMoney(
                        output.totalAssetExcludeInsurance -
                          output.totalLiabExcludeDeathRelated,
                        0,
                        decimalChar,
                        thousands
                      )} */}
                    </td>
                  </tr>
                  <tr>
                    <td className="paddingleft25">{labelsBilingual.pg2P8.replace("yyy",formatted(output.govDB,lang))}</td>
                    <td className="textalignright">
                    {formatted(output.totalAssetInsurance + output.govDB,lang)}
                    
                    {/*   {dollarEn}
                      {formatMoney(
                        output.totalAssetInsurance + output.govDB,
                        0,
                        decimalChar,
                        thousands
                      )} */}
                    </td>
                  </tr>
                  <tr>
                    <td className="paddingleft25">{labelsBilingual.pg2P9}</td>
                    <td className="textalignright">
                    {formatted(output.totalLiab - output.totalLiabExcludeDeathRelated,lang)}
                    {/* 
                      {dollarEn}
                      {formatMoney(
                        output.totalLiab - output.totalLiabExcludeDeathRelated,
                        0,
                        decimalChar,
                        thousands
                      )} */}
                    </td>
                  </tr>
                </tbody>
              </table>
              {/* assumptions <h2 className="ppi1">{labelsBilingual.pg2T2}</h2> */}
              <h4 className="ppi1"></h4>
              <div className="tableTitle">{labelsBilingual.pg2T2}</div>
              <table className="incomePosition">
                <tbody>
                  <tr>
                    <td className="paddingleft25">
                      {labelsBilingual.pg7TabRow4}
                    </td>
                    <td className="textalignright">
                      {numFormat(output.infRate, false, 3,thousands, decimalChar)}
                    </td>
                  </tr>
                  <tr>
                    <td className="paddingleft25">
                      {singlePerson? labelsBilingual.pg7TabRow5_1: labelsBilingual.pg7TabRow5}
                    </td>
                    <td className="textalignright">
                      {numFormat(output.invRate, false, 3,thousands, decimalChar)}
                    </td>
                  </tr>
                  <tr>
                    <td className="paddingleft25">
                      {labelsBilingual.pg2TabT6}
                    </td>
                    <td className="textalignright">
                      {numFormat(
                        this.props.dataInput.Presentations[0].taxRate,
                        false,
                        3,thousands,
                        decimalChar
                      )}
                    </td>
                  </tr>
                  <tr></tr>
                  <tr></tr>
                  <tr></tr>
                  {/* <tr >
                  <td className="backgroundcolorFFFFFF" colSpan="2" >
                    {labelsBilingual.pg2Tab3}
                  </td> 
                </tr>*/}
                </tbody>
              </table>
              <p className="ppi1" style={{ width: "90%" }}>
                {singlePerson?labelsBilingual.pg2Tab2_1:labelsBilingual.pg2Tab2}
              </p>
              <p className="ppi1" style={{ width: "90%" }}>
                {labelsBilingual.pg2Tab3}
              </p>
              {/* Notes */}
              {/* <h4 className="ppi1"></h4>
              <div className="tableTitle">{labelsBilingual.pg9T}</div>
              <p className="ppi1">{labelsBilingual.pg9P1}</p>
              <p />
 */}              {logoBottom}
              {/* PAGE 3 Family Cash Needs at Death Combine with Income needs*/}
              <hr className="ppi1" />
              {logoTop}
              <br />
              <h2 className="ppi1">{singlePerson?labelsBilingual.pg3T_1: labelsBilingual.pg3T}</h2>
              <p className="ppi1">{singlePerson?labelsBilingual.pg3P1_1:labelsBilingual.pg3P1}</p>
              <div
                style={{
                  overflowX: "auto",
                  overflowY: "hidden",
                  width: "100%",
                }}
              >
                <div className="tableTitle">{labelsBilingual.pg3TabT}</div>
                <table className="cashNeeds">
                  <thead></thead>
                  <tbody>
                    {output.liabilities.map((item) => (
                      <tr key={item.name}>
                        <td style={{ width: "50%" }}>{item.name}</td>
                        <td className="textalignright">
                        {formatted(item.value,lang)}
                    
                    {/*       {dollarEn}{formatMoney(item.value, 0, decimalChar, thousands)} */}
                        </td>
                      </tr>
                    ))}
                    <tr className="backgroundcolorDCE5F0">
                      <td>
                        <strong>{labelsBilingual.pg3TabRTot}</strong>
                      </td>
                      <td className="textalignrightpaddingright20">
                        <strong>
                        {formatted(output.totalLiab,lang)}
                    
                    {/*       {dollarEn}
                          {formatMoney(
                            output.totalLiab,
                            0,
                            decimalChar,
                            thousands
                          )} */}
                        </strong>
                      </td>
                    </tr>
                    {/*	<tr className="backgroundcolorDCE5F0">
								<td><strong>Permanent Cash Needs <sup>p</sup></strong></td>
										<td className="textalignright"><strong>{dollarEn}200 <sup>p</sup></strong></td>
									</tr>*/}
                  </tbody>
                </table>
              </div>
              {/* combined with pg 3 PAGE 4 Family Income Needs at Death*/}
              {/* <br />
          <hr className="ppi1" />
          <h2 className="ppi1">{labelsBilingual.pg4T}</h2>
          <p className="ppi1">{labelsBilingual.pg4P1}</p>*/}
              <h4 className="ppi1"></h4>
              <div
                style={{
                  overflowX: "auto",
                  overflowY: "hidden",
                  width: "100%",
                }}
              >
                <div className="tableTitle">{labelsBilingual.pg4TabT}</div>
                <table className="incomeNeeds">
                  <thead></thead>
                  <tbody>
                    <tr>
                      <td className="paddingleft25" style={{ width: "70%" }}>
                        {singlePerson?labelsBilingual.pg4TabRow1_1: labelsBilingual.pg4TabRow1}
                      </td>
                      <td className="textalignright">
                      {formatted( output.Income + output.Income2,lang)}
                    
                    {/*     {dollarEn}
                        {formatMoney(
                          output.Income + output.Income2,
                          0,
                          decimalChar,
                          thousands
                        )} */}
                      </td>
                    </tr>
                    <tr className="backgroundcolorFFFFFF">
                      <td>
                        <br />
                        {singlePerson?labelsBilingual.pg4TabRow2_1: labelsBilingual.pg4TabRow2}
                      </td>
                      <td></td>
                    </tr>

                    {output.percent2.length > 0 && (
                      <tr>
                        <td className="paddingleft25">
                          {labelsBilingual.pg4TabRow3}
                        </td>
                        <td className="textalignright">{output.percent1}%</td>
                      </tr>
                    )}
                    {output.percent2.length > 0 && (
                      <tr>
                        <td className="paddingleft25">
                          {labelsBilingual.pg4TabRow4}
                        </td>
                        <td className="textalignright">{output.percent2.map((item) => <span>{item}% </span>)}</td>
                      </tr>
                    )}
                    {output.percent2.length === 0 && (
                      <tr>
                        <td className="paddingleft25">
                          {labelsBilingual.pg4TabRow4}
                        </td>
                        <td className="textalignright">{output.percent1}%</td>
                      </tr>
                    )}

                    <tr className="backgroundcolorFFFFFF">
                      <td></td>
                      <td></td>
                    </tr>
                    <tr className="backgroundcolorFFFFFF">
                      <td>{labelsBilingual.pg4TabRow5}</td>
                      <td></td>
                    </tr>
                    {output.percent2.length > 0 && (
                      <tr>
                        <td className="paddingleft25">
                          {labelsBilingual.pgTabRowMoreIncome}
                        </td>
                        <td className="textalignright">
                        {formatted(output.percentNeed1,lang)}
                    
                    {/*       {dollarEn}
                          {formatMoney(
                            output.percentNeed1,
                            0,
                            decimalChar,
                            thousands
                          )} */}
                        </td>
                      </tr>
                    )}
                    {output.percent2.length > 0 && (
                      <tr>
                        <td className="paddingleft25">
                          {thereAfterText}
                        </td>
                        <td className="textalignright">
                        {formatted(output.percentNeed2.reduce((a, b) => a + b, 0),lang)}
                    
                    {/*       {dollarEn}
                          {formatMoney(
                            output.percentNeed2.reduce((a, b) => a + b, 0),
                            0,
                            decimalChar,
                            thousands
                          )} */}
                        </td>
                      </tr>
                    )}
                    {output.percent2.length === 0 && (
                      <tr>
                        <td className="paddingleft25">
                        {thereAfterText}
                        </td>
                        <td className="textalignright">
                        {formatted(output.percentNeed1,lang)}
                    
                          {/* {dollarEn}
                          {formatMoney(
                            output.percentNeed1,
                            0,
                            decimalChar,
                            thousands
                          )} */}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <br />
              <hr className="ppi1" />
              {logoBottom}
              {/* PAGE 5 Family Cash Sourcess at Death*/}
              {logoTop}
              <h2 className="ppi1">{singlePerson?labelsBilingual.pg5T_1:labelsBilingual.pg5T}</h2>
              <div
                style={{
                  overflowX: "auto",
                  overflowY: "hidden",
                  width: "100%",
                }}
              >
                <table className="tableTitle" style={{ width: "90%"}}>
                <tr ><td  style={{ width: "50%",border:"none" }}>{labelsBilingual.pg5TabT}</td>
                  <td style={{ width: "25%",border:"none" }}>
                    {labelsBilingual.pg5TabT2}
                  </td>
                  <td style={{ width: "25%",border:"none" }}>
                    {labelsBilingual.pg5TabT3}
                  </td></tr>
                 </table>
                
               <table className="cashSources">
                  <tbody>
                    {/* add gov db*/}
                    <tr>
                      <td style={{ height: "1px", width: "50%" }}>
                        {labelsBilingual.pg5TabRow1}
                      </td>
                      <td
                        className="textalignright"
                        style={{ height: "1px", width: "25%" }}
                      >
                        {formatted(output.govDB,lang)}
                    
                    {/*     {dollarEn}{formatMoney(output.govDB, 0, decimalChar, thousands)} */}
                      </td>
                      <td
                        className="textalignright"
                        style={{ height: "1px", width: "25%" }}
                      >
                        {formatted(output.govDB,lang)}
                    
                    {/*     {dollarEn}{formatMoney(output.govDB, 0, decimalChar, thousands)} */}
                      </td>
                    </tr>
                    {output.assets.map((item) => (
                      <tr key={item.name}>
                        <td style={{ height: "1px", width: "50%" }}>
                          {item.name}
                        </td>
                        <td
                          className="textalignright"
                          style={{ height: "1px", width: "25%" }}
                        >
                          {formatted(item.value,lang)}
                    
                    {/*       {dollarEn}{formatMoney(item.value, 0, decimalChar, thousands)} */}
                        </td>
                        <td
                          className="textalignright"
                          style={{ height: "1px", width: "25%" }}
                        >
                          {item.disposeValue > 0
                            ? 
                            formatted(item.disposeValue,lang)
                              /* {dollarEn} +
                              formatMoney(
                                item.disposeValue,
                                0,
                                decimalChar,
                                thousands
                              ) */
                            : ""}
                        </td>
                      </tr>
                    ))}
                    <tr className="backgroundcolorDCE5F0">
                      <td>{labelsBilingual.pg5TabRow3}</td>
                      {/* <td className="textalignright">
                    {dollarEn}{formatMoney(output.totalAsset, 0, decimalChar, thousands)}
                  </td> */}
                      <td className="textalignright">
                      {formatted(output.totalAsset,lang)}
                    {/* 
                        {dollarEn}
                        {formatMoney(
                          output.totalAsset,
                          0,
                          decimalChar,
                          thousands
                        )} */}
                      </td>
                      <td className="textalignright">
                      {formatted(output.totalDisposeAsset,lang)}
                    
                    {/*     {dollarEn}
                        {formatMoney(
                          output.totalDisposeAsset,
                          0,
                          decimalChar,
                          thousands
                        )} */}
                      </td>
                    </tr>
                    <tr className="backgroundcolorDCE5F0">
                      <td>{singlePerson?labelsBilingual.pg5TabRow4_1: labelsBilingual.pg5TabRow4}</td>
                      <td></td>
                      <td
                        className="textalignright"
                        style={{ height: "1px", width: "25%" }}
                      >
                        {formatted(output.totalLiab,lang)}
                    {/* 
                        {dollarEn}
                        {formatMoney(
                          output.totalLiab,
                          0,
                          decimalChar,
                          thousands
                        )} */}
                      </td>
                    </tr>
                    <tr>
                      <td>{singlePerson?labelsBilingual.pg5TabRow5_1: labelsBilingual.pg5TabRow5}</td>
                      <td> </td>
                      <td className="textalignright">
                      {formatted(output.totalDisposeAsset - output.totalLiab,lang)}
                    
                    {/*     {dollarEn}
                        {formatMoney(
                          output.totalDisposeAsset - output.totalLiab,
                          0,
                          decimalChar,
                          thousands
                        )} */}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <hr className="ppi1" />
              {logoBottom}
              {/* PAGE 6 Family Income Sources at Death*/}
              {logoTop}
              <br />
              <h2 className="ppi1">{singlePerson?labelsBilingual.pg6T_1: labelsBilingual.pg6T}</h2>
              <div
                style={{
                  overflowX: "auto",
                  overflowY: "hidden",
                  width: "100%",
                }}
              >
                {/* <div className="tableTitle">{labelsBilingual.pg6TabT}</div> */}
                <table className="tableTitle" style={{ width: "90%"}}>
                <tr ><td  style={{ width: "51%",border:"none" }}>{labelsBilingual.pg6TabT}</td>
                  <td style={{ width: "14%",border:"none" }}>
                    {labelsBilingual.pg5TabT2}
                  </td>
                  <td style={{ width: "25%",border:"none" }}>
                    {labelsBilingual.pg5TabT3}
                  </td></tr>
                 </table>
                
           


                <table className="incomeSources">
                  <tbody>
                    {output.sources.map((item) => (
                      <tr key={item.name}>
                        <td style={{ width: "51%" }}>{item.name}</td>
                        <td className="textalignright"  style={{ width: "14%" }}>
                        {formatted(item.value,lang)}
                          </td>
                        <td className="textalignright"  style={{ width: "25%" }}>
                        {formatted(item.valueAtDeath,lang)}
                          </td>
                      </tr>
                    ))}
                    <tr className="backgroundcolorFFFFFF">
                      <td colSpan ="2"></td>
                      <td colSpan ="2"></td>
                    </tr>
                    <tr className="backgroundcolorFFFFFF">
                    <td colSpan ="2">{labelsBilingual.pg6TabRow1}</td>
                    <td colSpan ="2"></td>
                    </tr>
                    {output.percent2.length > 0 && (
                      <tr>
                        <td colSpan ="2" className="paddingleft25">
                          {labelsBilingual.pg6TabRow2}
                        </td>
                        <td colSpan ="2" className="textalignright">
                          <span
                            style={{ fontSize: "10px", marginRight: "30px" }}
                          >
                            ({labelsBilingual.pg6Net + " "}
                            {formatMoney(
                              //output.totalSourceATax,
                              output.totalSourceATaxAtDeath,
                              0,
                              decimalChar,
                              thousands
                            )}
                            )
                          </span>
                          {/* {formatted(output.totalSource,lang)} */}
                          {formatted(output.totalSourceAtDeath,lang)}
                    
                    {/*       {dollarEn}
                          {formatMoney(
                            output.totalSource,
                            0,
                            decimalChar,
                            thousands
                          )} */}
                        </td>
                      </tr>
                    )}
                    {output.percent2.length > 0 && (
                      <tr>
                        <td colSpan ="2" className="paddingleft25">
                          {!singleFamily? (thereAfterText): (thereAfterTextSF)}
                        </td>
                        <td colSpan ="2" className="textalignright">
                          <span
                            style={{ fontSize: "10px", marginRight: "30px" }}
                          >
                            ({labelsBilingual.pg6Net + " "}
                            {formatMoney(
                              //output.totalSource2ATax,
                              output.totalSource2ATaxAtDeath,
                              0,
                              decimalChar,
                              thousands
                            )}
                            )
                          </span>
                          {/* {formatted(output.totalSource2,lang)} */}
                          {formatted(output.totalSource2AtDeath,lang)}
                    
                    {/*       {dollarEn}
                          {formatMoney(
                            output.totalSource2,
                            0,
                            decimalChar,
                            thousands
                          )} */}
                        </td>
                      </tr>
                    )}
                    {output.percent2.length === 0 && (
                      <tr>
                        <td colSpan ="2" className="paddingleft25">
                          {!singleFamily?(thereAfterText): (thereAfterTextSF)}
                        </td>
                        <td colSpan ="2" className="textalignright">
                        {/* {formatted(output.totalSource,lang)} */}
                        {formatted(output.totalSourceAtDeath,lang)}
                    
                    {/*       {dollarEn}
                          {formatMoney(
                            output.totalSource,
                            0,
                            decimalChar,
                            thousands
                          )} */}
                        </td>
                      </tr>
                    )}
                    <tr className="backgroundcolorFFFFFF">
                    <td colSpan ="2"></td>
                    <td colSpan ="2"></td>
                    </tr>
                    <tr className="backgroundcolorFFFFFF">
                    <td colSpan ="2">{labelsBilingual.pg6TabRow4}</td>
                    <td colSpan ="2"></td>
                    </tr>
                    {output.percent2.length > 0 && (
                      <tr>
                        <td colSpan ="2" className="paddingleft25">
                          {labelsBilingual.pgTabRowMoreIncome}
                        </td>


                        <td colSpan ="2" className="textalignright">
                          <span
                            style={{ fontSize: "10px", marginRight: "20px" }}
                          >
              

                            ({
                              formatMoney(output.percentNeed1, 0, decimalChar, thousands)
                              } 
                              - 
                              {             
                                formatMoney(output.totalSourceATaxAtDeath, 0, decimalChar, thousands)
                              })
                          </span>
                          <strong>
                          {formatted(Math.max(0, output.percentNeed1 - output.totalSourceATaxAtDeath),lang)}
                          </strong>
                        </td>
                      </tr>
                    )}
                    {output.percent2.length > 0 && (
                      <tr>
                        <td colSpan ="2" className="paddingleft25">
                        {!singleFamily?(thereAfterText): (thereAfterTextSF)}
                        </td>
                        <td colSpan ="2" className="textalignrightbackgroundcolorDCE5F0">
  <span
                            style={{ fontSize: "10px", marginRight: "30px" }}
                          >
              

                            ({
              formatMoney(output.percentNeed2.reduce((a, b) => a + b, 0), 0, decimalChar, thousands)
            } 
            - 
            {             
              /* formatMoney(output.totalSource2ATax, 0, decimalChar, thousands) */
              formatMoney(output.totalSource2ATaxAtDeath, 0, decimalChar, thousands)
            })

</span>
                          <strong>
                          {/* {formatted(Math.max(0, output.percentNeed2.reduce((a, b) => a + b, 0) - output.totalSource2ATax),lang)} */}
                          {formatted(Math.max(0, output.percentNeed2.reduce((a, b) => a + b, 0) - output.totalSource2ATaxAtDeath),lang)}
                    
                    {/*         {dollarEn}
                            {formatMoney(
                              Math.max(
                                0,
                                //output.percentNeed2.reduce((a, b) => a + b, 0) - output.totalSource2ATax
                                output.totalDesiredGrossIncome2- output.totalSource2
                              ),
                              0,
                              decimalChar,
                              thousands
                            )} */}
                          </strong>
                        </td>
                      </tr>
                    )}
                    {output.percent2.length === 0 && (
                      <tr>
                        <td colSpan ="2" className="paddingleft25">
                          {!singleFamily?(thereAfterText): (thereAfterTextSF)}
                        </td>
                        <td colSpan ="2" className="textalignrightbackgroundcolorDCE5F0">


                       {/*  <td className="textalignright"> */}
                          <span
                            style={{ fontSize: "10px", marginRight: "30px" }}
                          >
              

                            ({
                                formatMoney(output.percentNeed1, 0, decimalChar, thousands)
                              } 
                              - 
                              {             
                                /* formatMoney(output.totalSourceATax, 0, decimalChar, thousands) */
                                formatMoney(output.totalSourceATaxAtDeath, 0, decimalChar, thousands)
                              })
                          </span>
                          <strong>
                          
                          {formatted(Math.max(0, output.percentNeed1 - output.totalSourceATaxAtDeath),lang)}{/* output.totalDesiredGrossIncome - output.totalSource,lang)} */}
                    
                   
                          </strong>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {/* PAGE 7 life i anal*/}
              {/* <br />
          <hr className="ppi1" />
          <h2 className="ppi1">{labelsBilingual.pg7T}</h2>
          <div
            style={{ overflowX: "auto", overflowY: "hidden", width: "100%" }}
          >
            <div className="tableTitle">{labelsBilingual.pg7TabT}</div>

            <table className="incomePosition">
              <tbody>
                <tr className="backgroundcolorFFFFFF">
                  <td style={{ width: "70%" }}> </td>
                  <td> </td>
                </tr>
                <tr>
                  <td className="backgroundcolorFFFFFF">
                    {labelsBilingual.pg7TabRow1}
                  </td>
                  <td className="backgroundcolorFFFFFF"></td>
                </tr>
                {output.percent2 > 0 && (
                  <tr>
                    <td className="paddingleft25">
                      {labelsBilingual.pg7TabRow2}
                    </td>
                    <td className="textalignright">
                      {dollarEn}
                      {formatMoney(
                        Math.max(0, output.percentNeed1 - output.totalSource),
                        0,
                        decimalChar,
                        thousands
                      )}
                    </td>
                  </tr>
                )}
                {output.percent2 > 0 && (
                  <tr>
                    <td className="paddingleft25">
                      {labelsBilingual.pgTabRowThereAfter}
                    </td>
                    <td className="textalignright">
                      {dollarEn}
                      {formatMoney(
                        Math.max(0, output.percentNeed2 - output.totalSource2),
                        0,
                        decimalChar,
                        thousands
                      )}
                    </td>
                  </tr>
                )}
                {output.percent2 === 0 && (
                  <tr>
                    <td className="paddingleft25">
                      {labelsBilingual.pgTabRowThereAfter}
                    </td>
                    <td className="textalignright">
                      {dollarEn}
                      {formatMoney(
                        Math.max(0, output.percentNeed1 - output.totalSource),
                        0,
                        decimalChar,
                        thousands
                      )}
                    </td>
                  </tr>
                )}

                <tr>
                  <td className="paddingleft25">
                    {labelsBilingual.pg7TabRow4}
                  </td>
                  <td className="textalignright">{output.infRate}%</td>
                </tr>
                <tr>
                  <td className="paddingleft25">
                    {labelsBilingual.pg7TabRow5}
                  </td>
                  <td className="textalignright">{output.invRate}%</td>
                </tr>
                <tr className="backgroundcolorFFFFFF">
                  <td> </td>
                  <td> </td>
                </tr>
                <tr>
                  <td className="backgroundcolorFFFFFF">
                    {labelsBilingual.pg7TabRow6}
                  </td>
                  <td className="backgroundcolorFFFFFF"> </td>
                </tr>
                <tr>
                  <td>
                    <strong></strong>
                    {labelsBilingual.pg7TabRow7} {this.props.LE})
                  </td>
                  <td className="textalignright">
                    {dollarEn}
                    {formatMoney(
                      Math.max(
                        0,
                        output.insNeedLE + output.totalAsset - output.totalLiab
                      ),
                      0,
                      decimalChar,
                      thousands
                    )}
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong></strong>
                    {labelsBilingual.pg7TabRow8}
                  </td>
                  <td className="textalignright">
                    {dollarEn}
                    {formatMoney(
                      Math.max(
                        0,
                        output.insNeedRet + output.totalAsset - output.totalLiab
                      ),
                      0,
                      decimalChar,
                      thousands
                    )}
                  </td>
                </tr>
                {output.hasChild && output.ygChild < maxDur && (
                  <tr>
                    <td>
                      <strong></strong>
                      {labelsBilingual.pg7TabRow9}
                    </td>
                    <td className="textalignright">
                      {dollarEn}
                      {formatMoney(
                        Math.max(
                          0,
                          output.insNeedYgChild25 +
                            output.totalAsset -
                            output.totalLiab
                        ),
                        0,
                        decimalChar,
                        thousands
                      )}
                    </td>
                  </tr>
                )}
                {output.hasChild && output.ygChild < orphAge && (
                  <tr>
                    <td>
                      <strong></strong>
                      {labelsBilingual.pg7TabRow10}
                    </td>
                    <td className="textalignright">
                      {dollarEn}
                      {formatMoney(
                        Math.max(
                          0,
                          output.insNeedYgChild18 +
                            output.totalAsset -
                            output.totalLiab
                        ),
                        0,
                        decimalChar,
                        thousands
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div> */}
              {/* PAGE 7 chart*/}
              {/* <div style={{ color: "darkBlue", marginTop: "55px" }}>
            <br />
            <div style={{ marginLeft: "20px", width: "90%" }}>
              <div style={{ width: "75%" }}>
                <article
                  id="bar1"
                  className="canvas-container"
                  style={{ height: "200px" }}
                >
                  <Bar data={dataInsurance} options={options} />
                </article>
              </div>
            </div>
          </div>
          <br />
          <br /> */}
              <hr className="ppi1" />
              {logoBottom}
              {/* PAGE 8 life i anal 2*/}
              {logoTop}
              <br />
              <h2 className="ppi1"> {labelsBilingual.pg8T}</h2>
              <div className="tableTitle">{singlePerson?  labelsBilingual.pg8TabT_1:labelsBilingual.pg8TabT}</div>
              <div
                style={{
                  overflowX: "auto",
                  overflowY: "hidden",
                  width: "100%",
                }}
              >
                <table className="incomePosition">
                  <tbody>
                    <tr>
                      <td width="70%">{labelsBilingual.pg8TabRow1}</td>
                      <td className="textalignright" width="30%">
                      {formatted(output.totalDisposeAsset - output.totalLiab,lang)}
                    
                    {/*     {dollarEn}
                        {formatMoney(
                          output.totalDisposeAsset - output.totalLiab,
                          0,
                          decimalChar,
                          thousands
                        )} */}
                      </td>
                    </tr>
                    <tr>
                      <td className="backgroundcolorFFFFFF">
                        <br />
                        {labelsBilingual.pg8TabRow2}
                      </td>
                      <td className="backgroundcolorFFFFFF"></td>
                    </tr>
                    {!singleFamily &&
      
                      <tr>
                      <td>
                        <strong></strong>
                        {labelsBilingual.pg8TabRow3}
                        {this.props.LE})
                      </td>
                      <td className="textalignright">
                        {/* {dollarEn+this.props.insuranceNeedLE+dollarFr} */}
                        {formatted(this.props.insuranceNeedLE,lang)}
                      </td>
                    </tr>}
                    <tr>
                      <td>
                        <strong></strong>
                        {singleFamily || singlePerson? labelsBilingual.pg8TabRow4Alt.replace("B.","A."): labelsBilingual.pg8TabRow4}
                      </td>
                      <td className="textalignright">
                        {/* {dollarEn+this.props.insuranceNeedRet+dollarFr} */}
                        {formatted(this.props.insuranceNeedRet,lang)}
                      </td>
                    </tr>
                    {output.hasChild && output.ygChild < maxDur && (
                      <tr>
                        <td>
                          <strong></strong>
                          {singleFamily? labelsBilingual.pg8TabRow5.replace("C.","B.").replace("25",output.youngestChildEndAge):labelsBilingual.pg8TabRow5.replace("25",output.youngestChildEndAge)}
                        </td>
                        <td className="textalignright">
                        {formatted(output.insNeedYgChild25,lang)}
                    
                    {/*       {dollarEn}
                          {formatMoney(
                            output.insNeedYgChild25,
                            0,
                            decimalChar,
                            thousands
                          )} */}
                        </td>
                      </tr>
                    )}
                    {output.hasChild && output.ygChild < orphAge && (
                      <tr>
                        <td>
                          <strong></strong>
                          {singleFamily? labelsBilingual.pg8TabRow6.replace("D.","C."):labelsBilingual.pg8TabRow6}
                        </td>
                        <td className="textalignright">
                        {formatted(output.insNeedYgChild18,lang)}
                    
                    {/*       {dollarEn}
                          {formatMoney(
                            output.insNeedYgChild18,
                            0,
                            decimalChar,
                            thousands
                          )} */}
                        </td>
                      </tr>
                    )}
                    <tr></tr>
                  </tbody>
                </table>
              </div>
              {/* PAGE 8 chart*/}
              <div style={{ color: "darkBlue", marginTop: "55px" }}>
                <br />
                <div style={{ marginLeft: "20px", width: "90%" }}>
                  <div style={{ width: "75%" }}>
                    <article
                      id="bar2"
                      className="canvas-container"
                      style={{ height: "200px" }}
                    >
                      <Bar data={dataInsurance2} options={options} />
                    </article>
                  </div>
                </div>
              </div>
              <br />
              <br />
              {/* PAGE 9 notes*/}
              {/*  <hr className="ppi1" />
             {allPages && (
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
            <br />
            <img className="ppi2" src="img/desktop/picture1.png" width="400" alt="Capital Requirements Chart" />
            <br /> <br /> 
            {logoTop}
              <br />
              <br /> <br />
            <h2 className="ppi1">{labelsBilingual.pg9T}</h2>
            <p className="ppi1">{labelsBilingual.pg9P1}</p>
            <br /> */}


              {logoBottom}
              {/* PAGE 9 Notes*/}
              {logoTop}
              <br />
              <br /> <br />
              <h2 className="ppi1">{labelsBilingual.pg9T}</h2>
              <p className="ppi1">{labelsBilingual.pg9P1}</p>
              <br /> <br />
              <br />
              <br />
              <br />


              {logoBottom}
              {/* PAGE 10 ackno*/}
              {logoTop}
              <br />
              <br /> <br />
              <h2 className="ppi1">{labelsBilingual.pg10T}</h2>
              <p className="ppi1">{labelsBilingual.pg10P1}</p>
              <br /> <br />
              <br />
              <br />
              <br />
              <p className="ppi1">
                {labelsBilingual.pg10TabRow1}
                <br />
                <span style={{ paddingLeft: "118px" }}>
                  {labelsBilingual.pg10TabRow11}
                </span>
              </p>
              <br />
              <br />
              <p className="ppi1">
                {labelsBilingual.pg10TabRow2}
                <br />
                <span style={{ paddingLeft: "118px" }}>
                  {labelsBilingual.pg10TabRow11}
                </span>
              </p>
              <br />
              <br />
              <p className="ppi1">
                {labelsBilingual.pg10TabRow3}
                <br />
                <span style={{ paddingLeft: "110px" }}>
                  {labelsBilingual.pg10TabRow11}
                </span>
              </p>
              <br />
              <hr className="ppi1" />
              {logoBottom}
            </div>
        </div>
      );
    }
  }
}
