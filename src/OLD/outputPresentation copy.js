import React, { Component } from "react";
import "./Output.css";
//import { MultiButtons } from "./MultiButtons";
import Spinner from "./Spinner";
import { PopupMessage } from "./PopupMessage";
import { PopupUserinputDialog } from "./PopupUserInput";

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
  MEMBER,
  QUOTE_CLIENT,
  QUOTE_SPOUSE,
  TITLES,
  IMAGE_APPLET_INA,
  IMAGE_APPLET_EP,
  COVER_IMAGE_BASE64_INA,
  COVER_IMAGE_BASE64_EP,
  INCOMESOURCES
} from "../definitions/generalDefinitions";

import {
  handleFetchHtmlToPDF2,
  handleFetchEditPres,
 
} from "../utils/FetchAPIs";
import { OUTPUTTEXT } from "../definitions/outputDefinitions";
import { Bar} from "react-chartjs-2";
import { doSavePdfAction } from "./OutputPDF";
import {
  getName,
  getLogoAndAppletImage,
  formatted,
  versionDetails,
  extractPageCSS,
  cleanFormat,
  formatMoney,
  getListItemKeyFromName,
  numFormat,
  familyProjectionYears,
  isSingleFamily,
  doCompuLife,
  chartToBase64Image,
  getBase64AppletImage,
  //getDefaultImages,
} from "../utils/helper";

import {getINAPages
} from "../utils/outputPresentationSections";

import {
  getOutputInfoGrid
} from "../utils/outputPresentationSections";

import { getOutputValues } from "../data/dataExchange";
import { getInfoINA, getInfoPDF } from "../definitions/infoIconsDefinitions";
import { Info } from "./Info";
import saveAs from "file-saver";
import OutputPage from "./outputPage.js";
import AgentPortfolio from "./AgentPortfolio.js";
import CustomizeToolbar from "./CustomizeToolbar";
import OutputInfoGrid from "./OutputInfoGrid";
import OutputExportGrid from "./OutputExportGrid"

const ABOUTME_IMAGE = "aboutMeImage";

export default class OutputPresentation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: this.props.dataInput.Presentations[0].adviserLogo,
      /* showShortfallHint: false,
      showHowLongHint: false, */
      barConvertedToBase64: null,
      aboutMeImageConvertedToBase64: null,
      //converToBase64: null,
      spouseSwitched: null,
      appletImage: null,
      logoImage: null,
      aboutMe: this.props.aboutMe,
      includeAboutMe: this.props.aboutMe!==undefined && this.props.aboutMe.lastname!==undefined,
      refreshAboutMe: false,
      pdfLoaded: true,
      customizeMsg:false,
      showToEPMsg:false
    };

    
    this.dateApplet = "";
    this.useNewPDFMethod = true;
    this.pages = [];
    this.showLogo = "none";
    this.showAppletImage = "none";
    this.refPage = [];
    this.editPresBlob=null
  }

  doPDF = () => {
    doSavePdfAction(this.props);
  };


  setUpPDF=async ()=>{
    let barConvertedToBase64 = await chartToBase64Image("bar2");
    let aboutMeImageConvertedToBase64 = null;

    if (this.state.includeAboutMe) {
      aboutMeImageConvertedToBase64 = await getBase64AppletImage(ABOUTME_IMAGE);
    }

    
//    console.log(aboutMeImageConvertedToBase64);

    let spouseSwitched=null;
    if(this.props.dataInput.Clients.length>1)
      spouseSwitched = await this.getSpouseINA(this.props);
    this.setState({
      barConvertedToBase64: barConvertedToBase64,
      aboutMeImageConvertedToBase64: aboutMeImageConvertedToBase64,
      spouseSwitched: spouseSwitched,
    },
    
    
    );

    const cssInline = extractPageCSS();
    let pdfSections = [];
    let htmls = [];

    const noPages = this.pages.length;
    for (let i = 0; i < noPages; i++) {
      htmls.push(this.refPage[i].innerHTML);
      pdfSections.push({
        html: htmls[i],
        orientation: "portrait",
      });
    }

    return({
      sections:pdfSections,
      css:cssInline
    })

  }

  doPDF3 = async () => {
    if (this.state.pdfLoaded === false) {
      return;
    }
    this.setState({ pdfLoaded: false });
    
    const PDF= await this.setUpPDF();
    
    let blobRes = await handleFetchHtmlToPDF2(PDF.sections, PDF.css);
    let blob = new Blob([blobRes], { type: "application/pdf" });
    saveAs(blob, `testPDF`);
    
    this.setState({ pdfLoaded: true });
  };

  doEditPres = async () => {
    if (this.state.pdfLoaded === false) {
      return;
    }
    this.setState({ pdfLoaded: false });
    
    const PDF= await this.setUpPDF();

    /* if (this.state.pdfLoaded === false) {
      return;
    }
    this.setState({ pdfLoaded: false });
    let barConvertedToBase64 = await chartToBase64Image("bar2");
    let aboutMeImageConvertedToBase64 = null;

    if (this.state.includeAboutMe) {
      aboutMeImageConvertedToBase64 = await getBase64AppletImage(ABOUTME_IMAGE);
    }

//    console.log(aboutMeImageConvertedToBase64);
    const spouseSwitched = await this.getSpouseINA(this.props);
    this.setState({
      barConvertedToBase64: barConvertedToBase64,
      aboutMeImageConvertedToBase64: aboutMeImageConvertedToBase64,
      spouseSwitched: spouseSwitched,
    });

     const cssInline = extractPageCSS();
    let pdfSections = [];
    let htmls = [];

    for (let i = 0; i < this.pages.length; i++) {
      htmls.push(this.refPage[i].innerHTML);
      pdfSections.push({
        html: htmls[i],
        css: cssInline,
        footer: "",
        hasHeader: false,
        width: 0,
        orientation: "portrait",
      });
    } 
 */

     for (let i = 0; i < this.pages.length; i++) {
      PDF.sections[i].css= PDF.css
    }
    
    let blobRes = await handleFetchEditPres(
      PDF.sections, PDF.css,
      this.props.dataInput.Presentations[0].language
    );
 //   await async function () {
  this.setState({ customizeMsg: true });
      this.editPresBlob=new Blob([blobRes], { type: "text/html" });
      /* var a = document.createElement("a");
      a.href = window.URL.createObjectURL(blob);
      a.target = "_blank";
      this.setState({customizeMsg:true });
      
      a.click();
       */
      
      /* blob = new Blob([blobRes], { type: "text/html" });
      var a = document.createElement("a");
      a.href = window.URL.createObjectURL(blob);
      a.target = "_blank";
      this.setState({customizeMsg:true });
      
      a.click(); */
 //   };
  
 this.setState({ pdfLoaded: true });

  };

  doLIFO = async () => {
    await window.parent.postMessage(
      "LIFO_" +
        this.props.dataInput.Presentations[0].language +
        "_" +
        this.props.encryptedInputLife1,
      "*"
    );
  };

  doWL = async () => {
    await window.parent.postMessage(
      "WL_" +
        this.props.dataInput.Presentations[0].language +
        "_" +
        this.props.encryptedInputLife1,
      "*"
    );
  };

  doCA = async () => {
    await window.parent.postMessage(
      "CA_" +
        this.props.dataInput.Presentations[0].language +
        "_" +
        this.props.encryptedInputLife1AndSpouse,
      "*"
    );
  };

  respondToEPMsg=()=>{
    {  this.setState({showToEPMsg:false})

  }}

  doEP = async (hasTaxSavings) => {
    
    if(hasTaxSavings)
    {  this.setState({showToEPMsg:true})
      
  }
  else{
    await window.parent.postMessage(
      "EP_" +
        this.props.dataInput.Presentations[0].language +
        "_" +
        this.props.encryptedInputLife1AndSpouse,
      "*"
    );
    // send notif to remove spinner
    window.parent.postMessage("FRAME_LOADED", "*");
    }
  };

  /* toggleHint = () => {
    this.setState({ showShortfallHint: !this.state.showShortfallHint });
  };

  toggleHintHL = () => {
    this.setState({ showHowLongHint: !this.state.showHowLongHint });
  }; */

  getSpouseINA = async (props) => {
    let data;
    data = await props.getSpouseINA();
    const spouseInsRet = data.dataOutput.dataInsuranceNeeds[0].Value;
    const spouseInsLE = data.dataOutput.dataInsuranceNeeds[1].Value;
    // roles reversed so index 1 is now Client ie spouse means client!!
    const LESpouse =
      data.dataOutput.lifeExpectancy.spouse + data.dataInput.Clients[1].Age;

    return {
      spouseInsRet: spouseInsRet,
      spouseInsLE: spouseInsLE,
      LEIfClientisSurvivor: LESpouse,
    };
  };

  restoreCover = () => {
    const img = COVER_IMAGE_BASE64_INA// getDefaultImages().appletImage.image;
    
    this.updateImageApplet(img)
    
  }



  updateImageApplet =(image) => {
    this.setState({ appletImage: image });
    const img = {
      image: image,
      left: 0,
      size: 0,
      allPages: false,
      top: 0,
      showDetails: false,
      default: true,
    };
    this.props.imageAdjust(img, IMAGE_APPLET_INA);
    
  };

  updateImageLogo = (image, size) => {
    this.setState({ logoImage: image });

    this.firstPageLogoWidth = size;
    //console.log(image, size);
  };

  toggleCheckbox = (include) => {
    this.setState({ includeAboutMe: include });
  };

  respondToCustomizeMsg = (OK) => {
    this.setState({ customizeMsg: false });
    if (OK) {
      var a = document.createElement("a");
      a.href = window.URL.createObjectURL(this.editPresBlob);
      a.target = "_blank";
      
      
      a.click();
    }
  };

  updateAboutMe=(aboutMe)=>{
   
    this.setState({aboutMe: aboutMe}, console.log(this.state.aboutMe))

  }

  render() {
    // presentation output shared with pdf

    let output = getOutputValues(this.props);
    const lang = this.props.dataInput.Presentations[0].language;
    const labelsBilingual = OUTPUTTEXT[lang];
    const decimalChar = lang === "en" ? "." : ",";
    const thousands = lang === "en" ? "," : " ";

    const singlePerson =
      this.props.dataInput.Clients.length === 1 ? true : false;
    const thereAfterText = singlePerson
      ? labelsBilingual.pgTabRowThereAfter_1
      : labelsBilingual.pgTabRowThereAfter;
    const thereAfterTextSF = singlePerson
      ? labelsBilingual.pg5TabRow7_1
      : labelsBilingual.pg5TabRow7;

    const clients = this.props.dataInput.Clients;
    const projYears = familyProjectionYears(
      clients,
      this.props.dataInput.Presentations[0].periodOption,
      this.props.LE,
      this.props.LE
    );
    const singleFamily = isSingleFamily(clients);
    const noSurvivor = singlePerson && versionDetails().versionNumeric <= 10014;

    const LEIfSpouseisSurvivor = singleFamily
      ? 0
      : this.props.LE.spouse + this.props.dataInput.Clients[1].Age;
    const toRetYears = singleFamily
      ? 0
      : this.props.dataInput.Clients[1].retirementAge -
        this.props.dataInput.Clients[1].Age;

        const TC=output.sources.filter(
          (item) => (item.name===INCOMESOURCES.TAX_CREDIT.value.en||item.name===INCOMESOURCES.TAX_CREDIT.value.fr) && item.value>0
        );
     
    // spouse ins
    let spouseInsRet;
    let spouseInsLE;
    let LEIfClientisSurvivor;

    if (!singleFamily && this.state.spouseSwitched !== null) {
      spouseInsRet = cleanFormat(this.state.spouseSwitched.spouseInsRet, lang);
      spouseInsLE = cleanFormat(this.state.spouseSwitched.spouseInsLE, lang);
      LEIfClientisSurvivor = this.state.spouseSwitched.LEIfClientisSurvivor;
    }

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
                    : Intl.NumberFormat(lang).format(value / 1000) + "K";
                return result;
              },
            },
          },
        ],
      },
    };

    // //console.log(output)

    var dataLabels = singlePerson ? ["A"] : ["A", "B"];
    var dColor = ["#7399c6", "#d9d3a4"];
    const under25 =
      output.ygChild < maxDur
        ? output.insNeedYgChild25 + output.totalAsset - output.totalLiab
        : 0;
    const under18 =
      output.ygChild < orphAge
        ? output.insNeedYgChild18 + output.totalAsset - output.totalLiab
        : 0;

    let youngestChildEndAge = maxDur;
    if (output.hasChild) {
      youngestChildEndAge = Math.min(
        maxDur,
        this.props.dataInput.Clients.filter((item) => {
          return item.Age === output.ygChild;
        })[0].retirementAge
      );
    }

    if (output.hasChild) {
      dataLabels = ["A", "B", "C", "D"];
      dColor = ["#7399c6", "#d9d3a4", "#949ca1", "#847a18"];
    }

    /* console.log(output.clients) */
    var dataValues2 = singlePerson
      ? [output.insNeedLE]
      : [output.insNeedLE, output.insNeedRet];
    if (output.hasChild) {
      if (singleFamily) {
        dataLabels = ["A", "B", "C"];
        dataValues2 = [
          output.insNeedRet,
          output.insNeedYgChild25,
          output.insNeedYgChild18,
        ];
        dColor = ["#d9d3a4", "#949ca1", "#847a18"];
      } else {
        dataLabels = ["A", "B", "C", "D"];
        dataValues2 = [
          output.insNeedLE,
          output.insNeedRet,
          output.insNeedYgChild25,
          output.insNeedYgChild18,
        ];
        dColor = ["#7399c6", "#d9d3a4", "#949ca1", "#847a18"];
      }
    } else if (singleFamily && output.hasChild === false) {
      // single family with dep adult
      dataLabels = ["A"];
      dataValues2 = [output.insNeedRet];
      dColor = ["#d9d3a4"];
    }

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
      this.props.imageAdjust,
      this.updateImageApplet,
      this.updateImageLogo
    );

    const logoOnTop = images.logoOnTop;
    const logoAllPages = images.logoAllPages;
    const logoOnly = images.logoOnly; // <div style={{float:"left",marginLeft:parseFloat(100*smallLogoAdj+this.props.dataInput.Presentations[0].adviserLogo.left)  + "%"}}><img className="logo" src={this.props.dataInput.Presentations[0].adviserLogo.image} /></div>;
    const logoFirstPg = images.logo1stPage1; //<div style={{marginLeft:marginLeft1stPg + "%"}}><img className="logo1st" src={this.props.dataInput.Presentations[0].adviserLogo.image} /></div>;
    const hasLogo = this.props.dataInput.Presentations[0].adviserLogo !== null;

    const posGrid = singleFamily || singlePerson ? "-80px" : "-30px";

    const aboutMeSpecs = this.state.aboutMe;

    //console.log(images, this.props.dataInput.Presentations[0].appletImage)
/* 
    let styleSelCell = [];
    styleSelCell.push(
      this.props.dataInput.Presentations[0].periodOption === DISPLAY_RETIREMENT
        ? { color: "#ffffff", background: "#334754" }
        : {}
    );
    styleSelCell.push(
      this.props.dataInput.Presentations[0].periodOption === DISPLAY_LIFEEXP
        ? { color: "#ffffff", background: "#334754" }
        : {}
    );
    styleSelCell.push(
      this.props.dataInput.Presentations[0].periodOption === DISPLAY_ENDAGE
        ? { color: "#ffffff", background: "#334754" }
        : {}
    );

    const styleAmtCell = { textAlign: "right", height: "1px" }; */


    //const pagesNew=getINAPages(this.props, this.state.spouseSwitched,this.state.appletImage,this.state.aboutMe,this.state.includeAboutMe,this.state.barConvertedToBase64)

    //console.log(pagesNew)

   if(false)
   { 
    const pageCover = (
      <div className="newPage" id="PageCover">
        <div
          className="printOnly"
          style={{
            height:
              this.props.dataInput.Presentations[0].adviserLogo.image === null
                ? "350px"
                : logoOnTop
                ? "150px"
                : "350px",
          }}
        >
          {" "}
        </div>

        <div style={{ paddingTop: "40px" }}>
          <hr className="ppi1 no-print" />

          <h1 className="ppi1" data-ppi-noneditable >{TITLES[lang].appletINA}</h1>

          {this.state.appletImage === null ? (
            images.appletImageOnly
          ) : (
            <img ID={IMAGE_APPLET_INA} style={{ maxWidth: "100%" }} src={this.state.appletImage} />
          )}
        </div>

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
      </div>
    );

    let pageAboutMe;
    if(this.state.includeAboutMe)
    {  pageAboutMe = (
      <div className="newPage" id="PageAboutMe">
        <hr className="ppi1 no-print" />
        <br />
        <AgentPortfolio
          agentPortfolio={this.state.aboutMe}
          mode={"html"}
          imageID={ABOUTME_IMAGE}
          aboutMeImageConvertedToBase64={
            this.state.aboutMeImageConvertedToBase64
          }
          lang={lang}
        />
        <br />
      </div>
    );}

    const pageSummarywoAssumptions = (
      <div>
        <hr className="ppi1 no-print" />
        {/*<div className="pdfHeader">{headerTitle}</div>*/}
        {/* <h2 className="ppi2">{headerTitle}</h2> */}
        <div className="outputSectionTitle">{labelsBilingual.pg1T_1}</div>
        <div
          style={{
            overflowX: "auto",
            overflowY: "hidden",
            width: "100%",
          }}
        >
          <table className="INA">
            <thead>
              <tr>
                <th style={{ width: "30%", marginLeft: "0em" }}>
                  {singlePerson
                    ? labelsBilingual.pg2TabT1_1
                    : labelsBilingual.pg2TabT1}
                </th>
                <th style={{ width: "10%" }}>{labelsBilingual.pg2TabT2}</th>
                <th style={{ width: "18%" }}>{labelsBilingual.pg2TabT3}</th>
                <th style={{ width: "19%" }}>
                  {singleFamily
                    ? labelsBilingual.pg2TabT4Alt
                    : labelsBilingual.pg2TabT4}
                </th>
                <th style={{ width: "19%" }}>{labelsBilingual.pg2TabT5}</th>
              </tr>
            </thead>
            <tbody>
              {output.clients.map((item) => (
                <tr key={item.id} data-ppi-noneditable>
                  <td>
                    {item.memberKey === MEMBER.CLIENT.Key
                      ? MEMBER.CLIENT.value[lang] + getName(item.name, lang)
                      : item.memberKey === MEMBER.SPOUSE.Key
                      ? MEMBER.SPOUSE.value[lang] + getName(item.name, lang)
                      : item.memberKey === MEMBER.CHILD.Key
                      ? MEMBER.CHILD.value[lang] + getName(item.name, lang)
                      : MEMBER.DEPENDENT_ADULT.value[lang] +
                        getName(item.name, lang)}

                  </td>
                  <td className="textalignright"><span  data-ppi-noneditable>{item.age}</span></td>
                  <td className="textalignright">
                  <span  data-ppi-noneditable>{formatted
(item.income, lang)}</span>

                  </td>
                  <td className="textalignright">
                  <span  data-ppi-noneditable>{singleFamily
                      ? item.memberKey === MEMBER.CLIENT.Key
                        ? "-"
                        : item.ret - item.age //protectionPeriod
                      : item.ret}</span>
                  </td>
                  <td className="textalignright">
                  <span  data-ppi-noneditable>{item.memberKey === MEMBER.CLIENT.Key
                      ? numFormat(
                          clients[QUOTE_CLIENT].avgTaxRate,
                          false,
                          3,
                          thousands,
                          decimalChar
                        )
                      : item.memberKey === MEMBER.SPOUSE.Key
                      ? numFormat(
                          clients[QUOTE_SPOUSE].avgTaxRate,
                          false,
                          3,
                          thousands,
                          decimalChar
                        )
                      : numFormat(
                          clients[item.id - 1].avgTaxRate,
                          false,
                          3,
                          thousands,
                          decimalChar
                        )}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* financial summary
         */}
        <h4 className="ppi2"></h4>
        <table className="INA">
          <thead>
            <tr>
              <th colSpan="2" style={{ width: "100%" }}>
                {labelsBilingual.pg2T3}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="paddingleft25">{labelsBilingual.pg2P5}</td>
              <td className="textalignright">
                <span  data-ppi-noneditable>{formatted
(output.totalAssetExcludeInsurance, lang)}</span>

              </td>
            </tr>
            <tr>
              <td className="paddingleft25">{labelsBilingual.pg2P6}</td>
              <td className="textalignright">
                <span  data-ppi-noneditable>{formatted
(output.totalLiabExcludeDeathRelated, lang)}</span>

              </td>
            </tr>
            <tr>
              <td className="paddingleft25" style={{ textAlign: "right" }}>
                {labelsBilingual.pg2P7}
              </td>
              <td className="textalignright">
                <span  data-ppi-noneditable>{formatted
(
                  output.totalAssetExcludeInsurance -
                    output.totalLiabExcludeDeathRelated,
                  lang
                )}</span>
              </td>
            </tr>
            <tr>
              <td className="paddingleft25">
              <span  data-ppi-noneditable>{labelsBilingual.pg2P8.replace(
                  "yyy",
                  formatted(output.govDB, lang)
                )}</span>
              </td>
              <td className="textalignright">
                <span  data-ppi-noneditable>{formatted
(output.totalAssetInsurance + output.govDB, lang)}</span>

              </td>
            </tr>
            <tr>
              <td className="paddingleft25">{labelsBilingual.pg2P9}</td>
              <td className="textalignright">
                <span  data-ppi-noneditable>{formatted
(
                  output.totalLiab - output.totalLiabExcludeDeathRelated,
                  lang
                )}</span>
              </td>
            </tr>
          </tbody>
        </table>
        {/* insuranse anal */}
        <h4 className="ppi2"></h4>
        <table className="INA">
          <thead>
            <tr>
              <th colSpan="3" style={{ width: "100%" }}>
                {labelsBilingual.pg2T4}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="paddingleft25" colSpan="3">
              <span  data-ppi-noneditable>{labelsBilingual.pg2P104 +
                  ": " +
                  formatted(output.totalAssetInsurance + output.govDB, lang)}</span>

              </td>
            </tr>
            <tr>
              <td className="paddingleft25">{labelsBilingual.pg2P10 + ":"}</td>
              <td className="textalignright" style={{ paddingTop: ".3em" }}>
                {labelsBilingual.pg2P101 + ":"}
              </td>
              <td className="textalignright" style={{ paddingTop: ".3em" }}>
                {labelsBilingual.pg2P102 + ":"}
              </td>
            </tr>
            {singleFamily === false && (
              <tr>
                <td className="paddingleft25" >
                <span  data-ppi-noneditable>{OUTPUTTEXT[lang].pg8TabRow3 + LEIfSpouseisSurvivor + ")"}</span>
                </td>
                <td className="textalignright"><span  data-ppi-noneditable>{this.props.LE.spouse}</span></td>
                <td className="textalignright">
                  <span  data-ppi-noneditable>{formatted
(output.insNeedLE, lang)}</span>

                </td>
              </tr>
            )}
            <tr>
              <td className="paddingleft25">
                {singleFamily
                  ? OUTPUTTEXT[lang].pg8TabRow4Alt.replace("A. ", "")
                  : OUTPUTTEXT[lang].pg8TabRow4}
              </td>
              <td className="textalignright"><span  data-ppi-noneditable>{toRetYears}</span></td>
              <td className="textalignright">
                <span  data-ppi-noneditable>{formatted
(output.insNeedRet, lang)}</span>

              </td>
            </tr>
            <tr>
              <td className="paddingleft25">{OUTPUTTEXT[lang].pg2P103}</td>
              <td className="textalignright">
              <span  data-ppi-noneditable>{this.props.yrsCoverageIfCashAll}</span>
              </td>
              <td className="textalignright"><span  data-ppi-noneditable>{formatted
(0, lang)}</span>
</td>
            </tr>
          </tbody>
        </table>
        {/* insuranse anal spouse */}
        <h4 className="ppi2"></h4>
        {!singleFamily && this.state.spouseSwitched !== null && (
          <table className="INA">
            <thead>
              <tr>
                <th colSpan="2" style={{ width: "100%" }}>
                  {labelsBilingual.pg2T5}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="paddingleft25" colSpan="2">
                  {labelsBilingual.pg2P12}
                </td>
              </tr>
              <tr data-ppi-noneditable>
                <td className="paddingleft25" colSpan="2" >
                <span  data-ppi-noneditable> {labelsBilingual.pg2P104 +
                    ": " +
                    formatted(
                      output.totalAssetInsuranceIfSpouse + output.govDB,
                      lang
                    )}</span>
                </td>
              </tr>
              <tr>
                <td className="paddingleft25" colSpan="2">
                  {OUTPUTTEXT[lang].pg2P11.replace(
                    lang === "en" ? " NAME" : " NOM",
                    getName(clients[1].Name, lang)
                  )}
                </td>
              </tr>
              <tr>
                <td className="paddingleft25" data-ppi-noneditable>
                <span  data-ppi-noneditable>{OUTPUTTEXT[lang].pg8TabRow3 + LEIfClientisSurvivor + ")"}</span>
                </td>
                <td className="textalignright">
                  <span  data-ppi-noneditable>{formatted
(spouseInsLE, lang)}</span>

                </td>
              </tr>
              <tr>
                <td className="paddingleft25">{OUTPUTTEXT[lang].pg8TabRow4}</td>
                <td className="textalignright">
                  <span  data-ppi-noneditable>{formatted
(spouseInsRet, lang)}</span>

                </td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    );

    const assumptions = (
      <div>
        {/* assumptions <h2 className="ppi2">{labelsBilingual.pg2T2}</h2> */}
        <h4 className="ppi2"></h4>
        {/* <div>{labelsBilingual.pg2T2}</div> */}
        <table className="INA">
          <thead>
            <tr>
              <th colSpan="2" style={{ width: "100%" }}>
                {labelsBilingual.pg2T2}
              </th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td className="paddingleft25">{labelsBilingual.pg7TabRow4}</td>
              <td className="textalignright">
              <span  data-ppi-noneditable> {numFormat(output.infRate, false, 3, thousands, decimalChar)}</span>
              </td>
            </tr>
            <tr>
              <td className="paddingleft25">
                {singlePerson
                  ? labelsBilingual.pg7TabRow5_1
                  : labelsBilingual.pg7TabRow5}
              </td>
              <td className="textalignright">
              <span  data-ppi-noneditable>{numFormat(output.invRate, false, 3, thousands, decimalChar)}</span>
              </td>
            </tr>
            <tr>
              <td className="paddingleft25">{labelsBilingual.pg2TabT6}</td>
              <td className="textalignright">
              <span  data-ppi-noneditable>{numFormat(
                  this.props.dataInput.Presentations[0].taxRate,
                  false,
                  3,
                  thousands,
                  decimalChar
                )}</span>
              </td>
            </tr>
            <tr></tr>
            <tr></tr>
            <tr></tr>
          </tbody>
        </table>
        <p className="ppi2">
          {singlePerson ? labelsBilingual.pg2Tab2_1 : labelsBilingual.pg2Tab2}
        </p>
        <p className="ppi2">{labelsBilingual.pg2Tab3}</p>{" "}
      </div>
    );

    let pageSummary;
    let pageAssumptions;

    if (output.clients.length <= 5) {
      pageSummary = (
        <div className="newPage" id="PageSummary">
          {pageSummarywoAssumptions}
          {assumptions}
        </div>
      );
    } else {
      pageSummary = (
        <div className="newPage" id="PageSummary">
          {pageSummarywoAssumptions}
          <hr className="ppi1 no-print" />
        </div>
      );
      pageAssumptions = (
        <div className="newPage" id="PageAssumptions">
          {assumptions}
        </div>
      );
    }

    /* PAGE 3 Family Cash and income Sourcess at Death*/
    const pageCashIncomeSources = (
      <div className="newPage" id="PageCashIncomeSources">
        <hr className="ppi1 no-print" />
        {/*<div className="pdfHeader">{headerTitle}</div>*/}
        <div className="outputSectionTitle">
          {/* {singlePerson ? labelsBilingual.pg5T_1 : labelsBilingual.pg5T} */}
          {/* combine two pages 4 and 5 */}
          {singlePerson ? labelsBilingual.pg5T_1_2 : labelsBilingual.pg5T_2}
        </div>
        <div
          style={{
            overflowX: "auto",
            overflowY: "hidden",
            width: "100%",
          }}
        >
          <table className="INA">
            <thead>
              <tr>
                <th style={{ width: "34%" }}>{labelsBilingual.pg5TabT}</th>
                <th style={{ width: "28%" }}>
                  {labelsBilingual.pg3TabT2}
                </th>{" "}
                {/* desc */}
                <th style={{ width: "18%" }}>{labelsBilingual.pg5TabT2}</th>
                <th style={{ width: "20%" }}>{labelsBilingual.pg5TabT3}</th>
              </tr>
            </thead>

            <tbody>
              {/* add gov db*/}
              <tr>
                <td>{labelsBilingual.pg5TabRow1}</td>
                <td />
                <td className="textalignright">
                  <span  data-ppi-noneditable>{formatted
(output.govDB, lang)}</span>

                </td>
                <td className="textalignright">
                  <span  data-ppi-noneditable>{formatted
(output.govDB, lang)}</span>

                </td>
              </tr>
              {output.assets.map((item) => {
                if (true)
                  // include all so they see the list instead of item.value>0)
                  return (
                    <tr key={item.name}>
                      <td>{item.name}</td>
                      <td>{item.desc}</td>
                      <td className="textalignright">
                        <span  data-ppi-noneditable>{formatted
(item.value, lang)}</span>

                      </td>
                      <td className="textalignright">
                        {item.disposeValue > 0
                          ? formatted(item.disposeValue, lang)
                          : ""}
                      </td>
                    </tr>
                  );
              })}
              <tr
                className="backgroundcolorDCE5F0"
                style={{ height: "2.25em", verticalAlign: "bottom" }}
              >
                <td colSpan="2">{labelsBilingual.pg5TabRow3}</td>

                <td className="textalignright">
                  <span  data-ppi-noneditable>{formatted
(output.totalAsset, lang)}</span>

                </td>
                <td className="textalignright">
                  <span  data-ppi-noneditable>{formatted
(output.totalDisposeAsset, lang)}</span>

                </td>
              </tr>
              <tr className="backgroundcolorDCE5F0">
                <td colSpan="3">
                  {singlePerson
                    ? labelsBilingual.pg5TabRow4_1
                    : labelsBilingual.pg5TabRow4}
                </td>
                <td className="textalignright">
                  <span  data-ppi-noneditable>{formatted
(output.totalLiab, lang)}</span>

                </td>
              </tr>
              <tr>
                <td colSpan="3">
                  {singlePerson
                    ? labelsBilingual.pg5TabRow5_1
                    : labelsBilingual.pg5TabRow5}
                </td>
                <td className="textalignright">
                  <span  data-ppi-noneditable>{formatted
(output.totalDisposeAsset - output.totalLiab, lang)}</span>

                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* PAGE 5 Family Income Sources at Death*/}

        {/*             <div className="newPage" id="Page5">
          <hr className="ppi2 no-print" />
          {/*<div className="pdfHeader">{headerTitle}</div>*/}
        {/* <div className="outputSectionTitle">
      {singlePerson ? labelsBilingual.pg6T_1 : labelsBilingual.pg6T}
              </div> */}
        <br />
        <div
          style={{
            overflowX: "auto",
            overflowY: "hidden",
            width: "100%",
          }}
        >
          <table className="INA">
            <thead>
              <tr>
                <th style={{ width: "50%" }}>{labelsBilingual.pg6TabT}</th>
                <th style={{ width: "18%" }}>{labelsBilingual.pg5TabT2}</th>
                <th style={{ width: "24%" }} colSpan="2">
                  {labelsBilingual.pg5TabT3}
                </th>
              </tr>
            </thead>

            <tbody>
              {output.sources.map((item) => {
                if (true)
                  // include all so they see the list instead of item.value>0)
                  return (
                    <tr key={item.name}>
                      <td style={{ width: "51%" }}>{item.name}</td>
                      <td className="textalignright" style={{ width: "14%" }}>
                        <span  data-ppi-noneditable>{formatted
(item.value, lang)}</span>

                      </td>
                      <td
                        className="textalignright"
                        style={{ width: "25%" }}
                        colSpan="2"
                      >
                        <span  data-ppi-noneditable>{formatted
(item.valueAtDeath, lang)}</span>

                      </td>
                    </tr>
                  );
              })}
              <tr className="backgroundcolorFFFFFF">
                <td colSpan="2"></td>
                <td colSpan="2"></td>
              </tr>
              <tr className="backgroundcolorFFFFFF">
                <td colSpan="4">{labelsBilingual.pg6TabRow1}</td>
                {/* <td colSpan="2"></td> */}
              </tr>
              {output.percent2.length > 0 && (
                <tr>
                  <td colSpan="2" className="paddingleft25">
                    {labelsBilingual.pg6TabRow2}
                  </td>
                  <td className="textalignright">
                    <span style={{ fontSize: ".8em" }} data-ppi-noneditable>
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
                  </td>
                  <td className="textalignright">
                    <span  data-ppi-noneditable>{formatted
(output.totalSourceAtDeath, lang)}</span>

                  </td>
                </tr>
              )}
              {output.percent2.length > 0 && (
                <tr>
                  <td colSpan="2" className="paddingleft25">
                    {!singleFamily ? thereAfterText : thereAfterTextSF}
                  </td>
                  <td className="textalignright">
                    <span style={{ fontSize: ".8em" }} data-ppi-noneditable>
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
                  </td>
                  <td className="textalignright">
                    <span  data-ppi-noneditable>{formatted
(output.totalSource2AtDeath, lang)}</span>

                  </td>
                </tr>
              )}
              {output.percent2.length === 0 && (
                <tr>
                  <td colSpan="2" className="paddingleft25">
                    {!singleFamily ? thereAfterText : thereAfterTextSF}
                  </td>
                  <td colSpan="2" className="textalignright">
                    {/* <span  data-ppi-noneditable>{formatted
(output.totalSource,lang)}</span>
 */}
                    <span  data-ppi-noneditable>{formatted
(output.totalSourceAtDeath, lang)}</span>

                  </td>
                </tr>
              )}
              <tr className="backgroundcolorFFFFFF">
                <td colSpan="2"></td>
                <td colSpan="2"></td>
              </tr>
              <tr className="backgroundcolorFFFFFF">
                <td colSpan="4">{labelsBilingual.pg6TabRow4}</td>
                {/* <td colSpan="2"></td> */}
              </tr>
              {output.percent2.length > 0 && (
                <tr>
                  <td colSpan="2" className="paddingleft25">
                    {labelsBilingual.pgTabRowMoreIncome}
                  </td>

                  <td className="textalignright">
                    <span style={{ fontSize: ".8em" }} data-ppi-noneditable>
                      (
                      {formatMoney(
                        output.percentNeed1,
                        0,
                        decimalChar,
                        thousands
                      )}
                      -
                      {formatMoney(
                        output.totalSourceATaxAtDeath,
                        0,
                        decimalChar,
                        thousands
                      )}
                      )
                    </span>
                  </td>

                  <td className="textalignright">
                    <strong>
                      <span  data-ppi-noneditable>{formatted
(
                        Math.max(
                          0,
                          output.percentNeed1 - output.totalSourceATaxAtDeath
                        ),
                        lang
                      )}</span>
                    </strong>
                  </td>
                </tr>
              )}
              {output.percent2.length > 0 && (
                <tr>
                  <td colSpan="2" className="paddingleft25">
                    {!singleFamily ? thereAfterText : thereAfterTextSF}
                  </td>
                  <td className="textalignrightbackgroundcolorDCE5F0">
                    <span style={{ fontSize: ".8em" }} data-ppi-noneditable>
                      (
                      {formatMoney(
                        output.percentNeed2.reduce((a, b) => a + b, 0),
                        0,
                        decimalChar,
                        thousands
                      )}
                      -
                      {
                        /* formatMoney(output.totalSource2ATax, 0, decimalChar, thousands) */
                        formatMoney(
                          output.totalSource2ATaxAtDeath,
                          0,
                          decimalChar,
                          thousands
                        )
                      }
                      )
                    </span>
                  </td>
                  <td className="textalignrightbackgroundcolorDCE5F0">
                    <strong>
                      {/* {formatted(Math.max(0, output.percentNeed2.reduce((a, b) => a + b, 0) - output.totalSource2ATax),lang)}</span>
 */}
                      <span  data-ppi-noneditable>{formatted
(
                        Math.max(
                          0,
                          output.percentNeed2.reduce((a, b) => a + b, 0) -
                            output.totalSource2ATaxAtDeath
                        ),
                        lang
                      )}</span>
                    </strong>
                  </td>
                </tr>
              )}
              {output.percent2.length === 0 && (
                <tr>
                  <td colSpan="2" className="paddingleft25">
                    {!singleFamily ? thereAfterText : thereAfterTextSF}
                  </td>
                  <td className="textalignrightbackgroundcolorDCE5F0">
                    <span style={{ fontSize: ".8em" }} data-ppi-noneditable>
                      (
                      {formatMoney(
                        output.percentNeed1,
                        0,
                        decimalChar,
                        thousands
                      )}
                      -
                      {
                        /* formatMoney(output.totalSourceATax, 0, decimalChar, thousands) */
                        formatMoney(
                          output.totalSourceATaxAtDeath,
                          0,
                          decimalChar,
                          thousands
                        )
                      }
                      )
                    </span>
                  </td>
                  <td className="textalignrightbackgroundcolorDCE5F0">
                    <strong>
                      <span  data-ppi-noneditable>{formatted
(
                        Math.max(
                          0,
                          output.percentNeed1 - output.totalSourceATaxAtDeath
                        ),
                        lang
                      )}</span>
                    </strong>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );

    /* page analysis and graph */
    const pageAnalandGraph = (
      <div className="newPage" id="PageAnalandGraph">
        <hr className="ppi1 no-print" />

        <div className="outputSectionTitle">{labelsBilingual.pg8T}</div>

        <div
          style={{
            overflowX: "auto",
            overflowY: "hidden",
            width: "100%",
          }}
        >
          <table className="INA">
            <thead>
              <tr>
                <th colSpan="2" style={{ width: "100%", marginLeft: "0em" }}>
                  {singlePerson
                    ? labelsBilingual.pg8TabT_1
                    : labelsBilingual.pg8TabT}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td width="70%">{labelsBilingual.pg8TabRow1}</td>
                <td className="textalignright" width="30%">
                  <span  data-ppi-noneditable>{formatted
(output.totalDisposeAsset - output.totalLiab, lang)}</span>

                </td>
              </tr>
              <tr>
                <td className="backgroundcolorFFFFFF">
                  <br />
                  {labelsBilingual.pg8TabRow2}
                </td>
                <td className="backgroundcolorFFFFFF"></td>
              </tr>
              {!singleFamily && (
                <tr>
                  <td>
                  <span  data-ppi-noneditable>{labelsBilingual.pg8TabRow3}
                    {this.props.LE.spouse + projYears.survivorAge}</span>)
                  </td>
                  <td className="textalignright">
                    <span  data-ppi-noneditable>{formatted
(this.props.insuranceNeedLE, lang)}</span>

                  </td>
                </tr>
              )}
              <tr>
                <td>
                  <strong></strong>
                  {singleFamily || singlePerson
                    ? labelsBilingual.pg8TabRow4Alt.replace("B.", "A.")
                    : labelsBilingual.pg8TabRow4}
                </td>
                <td className="textalignright">
                  <span  data-ppi-noneditable>{formatted
(this.props.insuranceNeedRet, lang)}</span>

                </td>
              </tr>
              {output.hasChild && output.ygChild < maxDur && (
                <tr>
                  <td>
                    <strong></strong>
                    <span  data-ppi-noneditable>{singleFamily
                      ? labelsBilingual.pg8TabRow5
                          .replace("C.", "B.")
                          .replace("25", output.youngestChildEndAge)
                      : labelsBilingual.pg8TabRow5.replace(
                          "25",
                          output.youngestChildEndAge
                        )}</span>
                  </td>
                  <td className="textalignright">
                    <span  data-ppi-noneditable>{formatted
(output.insNeedYgChild25, lang)}</span>

                  </td>
                </tr>
              )}
              {output.hasChild && output.ygChild < orphAge && (
                <tr>
                  <td>
                    <strong></strong>
                    <span  data-ppi-noneditable>{singleFamily
                      ? labelsBilingual.pg8TabRow6.replace("D.", "C.")
                      : labelsBilingual.pg8TabRow6}</span>
                  </td>
                  <td className="textalignright">
                    <span  data-ppi-noneditable>{formatted
(output.insNeedYgChild18, lang)}</span>

                  </td>
                </tr>
              )}
              <tr></tr>
            </tbody>
          </table>

          <div
            style={{
              color: "darkBlue",
              marginTop: "3.5em",
              contain: "content",
            }}
          >
            <br />
            <div style={{ marginLeft: "1.25em", width: "90%" }}>
              <div style={{ maxWidth: "350px", maxHeight: "300px" }} data-ppi-noneditable>
                {this.useNewPDFMethod && (
                  <div className="printOnly">
                    {this.state.barConvertedToBase64 !== null && (
                      <img src={this.state.barConvertedToBase64} />
                    )}
                  </div>
                )}
                <article
                  id="bar2"
                  className="canvas-container no-print"
                  style={{ height: "350px" }}
                >
                  <Bar data={dataInsurance2} options={options} />
                </article>
              </div>
            </div>
          </div>
          <br />
          <br />
        </div>
      </div>
    );

    /* PAGE Notes */
    const pageNotes = (
      <div className="newPage" id="PageNotes" data-ppi-noneditable
      data-ppi-pagelocked
>
        <hr className="ppi1 no-print" />
        {/*<div className="pdfHeader">{headerTitle}</div>*/}
        <div className="outputSectionTitle">{labelsBilingual.pg9T}</div>
        <div
          style={{
            overflowX: "auto",
            overflowY: "hidden",
            width: "100%",
          }}
        ></div>
        <p className="ppi2">{labelsBilingual.pg9P1}</p>
        <br /> <br />
        <br />
        <br />
        <br />
        {/* PAGE 8 ackno*/}
        {/*             <div className="newPage" id="Page8">
            <hr className="ppi2 no-print" />
            {/*<div className="pdfHeader">{headerTitle}</div>*/}
        <br />
        <br /> <br />
        <div className="outputSectionTitle">{labelsBilingual.pg10T}</div>
        <p className="ppi2">{labelsBilingual.pg10P1}</p>
        <br /> <br />
        <br />
        <br />
        <br />
        <p className="ppi2">
          {labelsBilingual.pg10TabRow1}
          <br />
          <span style={{ paddingLeft: "7em" }}>
            {labelsBilingual.pg10TabRow11}
          </span>
        </p>
        <br />
        <br />
        <p className="ppi2">
          {labelsBilingual.pg10TabRow2}
          <br />
          <span style={{ paddingLeft: "7em" }}>
            {labelsBilingual.pg10TabRow11}
          </span>
        </p>
        <br />
        <br />
        <p className="ppi2">
          {labelsBilingual.pg10TabRow3}
          <br />
          <span style={{ paddingLeft: "7em" }}>
            {labelsBilingual.pg10TabRow11}
          </span>
        </p>
        <br />
      </div>
    );












    /* add all pages  */
    this.pages = [];
    /* cover page */

    this.pages.push(pageCover);
    /* AboutMe page if requested */
    {
      aboutMeSpecs !== null &&
        this.state.includeAboutMe &&
        this.pages.push(pageAboutMe);
    }
    {
      /* PAGE 2 profile*/
    }
    if (output.clients.length <= 5) this.pages.push(pageSummary);
    else {
      this.pages.push(pageSummary);
      this.pages.push(pageAssumptions);
    }
    this.pages.push(pageCashIncomeSources);
    this.pages.push(pageAnalandGraph);
    this.pages.push(pageNotes);

  }

  this.pages=getINAPages(this.props, this.state.spouseSwitched,this.state.appletImage,this.state.aboutMe,this.state.includeAboutMe,this.state.barConvertedToBase64)
    
    let allPages = [];
    let iAboutMe = -1;
    if (aboutMeSpecs !== null && this.state.includeAboutMe) iAboutMe = 1;

    for (let i = 0; i < this.pages.length; i++)
      allPages.push(
        <div
          className="presentationItem page"
          ref={(r) => {
            this.refPage[i] = r;
          }}
        >
          <OutputPage
            content={this.pages[i]}
            header={
              i > 0 &&
              !(this.state.includeAboutMe && i === 1) &&
              TITLES[lang].appletINA
            }
            footer={
              i === 0 || i === this.pages.length - 1 || i === iAboutMe
                ? ""
                : OUTPUTTEXT[lang].pgFooter
            }
            logoTop={
              hasLogo && logoOnTop
                ? i === 0
                  ? logoFirstPg
                  : logoAllPages
                  ? logoOnly
                  : null
                : null
            }
            logoBottom={
              hasLogo && !logoOnTop
                ? i === 0
                  ? logoOnly
                  : logoAllPages
                  ? logoOnly
                  : null
                : null
            }
            firstPageLogoWidth={this.firstPageLogoWidth}
          />
        </div>
      );
 
    const gridData={insuranceNeedRet:this.props.insuranceNeedRet,insuranceNeedLE:this.props.insuranceNeedLE,insuranceNeedEAge:this.props.insuranceNeedEAge,projYears:projYears,yrsCoverageIfCashAll:this.props.yrsCoverageIfCashAll}  

    if (noSurvivor) {
      return (
        <div>
          <h3 className="ppi1">{needTo}</h3>
        </div>
      );
    } else {
      return (
        <div style={{ float: "none" }}>
          {this.state.pdfLoaded === false && <Spinner />}
          <CustomizeToolbar
            lang={lang}
            info={true}
            doPDF={this.doPDF3}
            images={images}
            aboutMe={this.state.aboutMe}
            toggleCheckbox={this.toggleCheckbox}
            updateImageLogo={this.updateImageLogo}
            defaltCover={this.props.dataInput.Presentations[0].appletImage.default}
            restoreCover={this.restoreCover}
            editPres = {this.doEditPres}
            email={this.props.email}
            updateAboutMe={this.updateAboutMe}
          />
          <div style={{ height: "0px" }}>
              <PopupUserinputDialog
                openDialog={this.state.customizeMsg}
                title={labelsBilingual.customizeAlertTitle}
                mainMessage={labelsBilingual.customizeAlert}
                severity={"warning"}
                language={lang}
                respondToInput={this.respondToCustomizeMsg}
              />
            </div>
            <PopupUserinputDialog
            openDialog={this.state.showToEPMsg}
            //title={labelsBilingual.customizeAlertTitle}
            mainMessage={labelsBilingual.taxSavingToEP}
            severity={"error"}
            language={lang}
            respondToInput={this.respondToEPMsg}
          />
          <div
            style={{
              width: "100%",
              paddingTop: "0px",
              color: "#334754",
              clear: "both",
            }}
          >
            <h3 className="ppi1" style={{ paddingLeft: "5px" }}>
              {needTo}
              <Info infoIcon={getInfoINA(lang)}
 />
            </h3>

            <div className="row" style={{ marginTop: posGrid }}>
              {singleFamily === false && singlePerson === false && (
                <div className="column">
                 <OutputInfoGrid gridData={gridData} lang={lang} periodOption={this.props.dataInput.Presentations[0].periodOption}/>
                 
                   {/*  <table className="NeedsTable">
                  <tbody style={{ fontSize: "1.2em", verticalAlign: "top" }}>
                      <tr>
                        <th className="noBorder" width="13%"></th>
                        <th className="noBorder" width="12%"></th>
                        <th className="noBorder" width="12%"></th>
                        <th className="noBorder" width="12%"></th>
                        <th className="noBorder" width="12%"></th>
                        <th className="noBorder" width="39%"></th>
                      </tr>
                      <tr>
                        <th className="tableNeedsEP">
                          {labelsBilingual.INASummaryTableC11}
                        </th>
                        <th className="tableNeedsEP" style={styleSelCell[0]}>
                          {labelsBilingual.INASummaryTableC12}
                        </th>
                        <th className="tableNeedsEP" style={styleSelCell[1]}>
                          {labelsBilingual.INASummaryTableC13}{" "}
                        </th>
                        <th className="tableNeedsEP" style={styleSelCell[2]}>
                          {labelsBilingual.INASummaryTableC14}
                        </th>
                        <th
                          className="tableNeedsEP"
                          style={{ color: "white", backgroundColor: "#612C51" }}
                        >
                          {labelsBilingual.INASummaryTableC15}
                        </th>

                        <th className="tableNeedsEP">
                          {labelsBilingual.INASummaryTableC16}
                        </th>
                      </tr>
                      <tr>
                        <td style={{ height: "1px", textAlign: "right" }}>
                          {labelsBilingual.INASummaryTableC21}
                        </td>
                        <td className="textalignright" style={styleAmtCell}>
                         {formatted(this.props.insuranceNeedRet, lang)}

                        </td>
                        <td className="textalignright" style={styleAmtCell}>
                          {formatted(this.props.insuranceNeedLE, lang)}

                        </td>
                        <td className="textalignright" style={styleAmtCell}>
                          {formatted(this.props.insuranceNeedEAge, lang)}

                        </td>

                        <td
                          className="textalignright"
                          style={{ color: "#612C51" }}
                        >
                          _
                        </td>

                        <td>
                          {this.state.showShortfallHint ? (
                            <span
                              style={{
                                color: "#612C51",
                                cursor: "pointer",
                              }}
                              onClick={this.toggleHint}
                            >
                              &#9650;
                            </span>
                          ) : (
                            <span
                              style={{
                                color: "#612C51",
                                cursor: "pointer",
                              }}
                              onClick={this.toggleHint}
                            >
                              &#9660;
                            </span>
                          )}
                          {this.state.showShortfallHint ? (
                            <span
                              style={{ display: "block", marginLeft: "15px" }}
                            >
                              {labelsBilingual.INASummaryTableC26Open}
                            </span>
                          ) : (
                            labelsBilingual.INASummaryTableC26Closed
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td
                          rowSpan="2"
                          style={{ height: "1px", textAlign: "right" }}
                        >
                          {labelsBilingual.INASummaryTableC31}
                        </td>
                        <td rowSpan="2" style={styleAmtCell}>
                          {projYears.noProjectYrsRet}
                        </td>
                        <td rowSpan="2" style={styleAmtCell}>
                          {projYears.noProjectYrsLE}
                        </td>
                        <td rowSpan="2" style={styleAmtCell}>
                          {projYears.noProjectYrs100}
                        </td>
                        <td
                          rowSpan="2"
                          style={{ color: "#612C51", textAlign: "right" }}
                        >
                          {this.props.yrsCoverageIfCashAll}
                        </td>
                      </tr>

                      <tr>
                        <td>
                          {this.state.showHowLongHint ? (
                            <span
                              style={{
                                color: "#612C51",
                                
                                cursor: "pointer",
                              }}
                              onClick={this.toggleHintHL}
                            >
                              &#9650;
                            </span>
                          ) : (
                            <span
                              style={{
                                color: "#612C51",
                                cursor: "pointer",
                              }}
                              onClick={this.toggleHintHL}
                            >
                              &#9660;
                            </span>
                          )}
                          {this.state.showHowLongHint
                            ? labelsBilingual.INASummaryTableC36Open
                            : labelsBilingual.INASummaryTableC36Closed}
                        </td>
                      </tr>
                    </tbody> 
                  </table>*/}
                </div>
              )}

              <div
                className="column"
                style={{
                  textAlign: "right",
                  width: "300px",
                  float: "right",
                }}
              >
                
                <OutputExportGrid doEP={this.doEP} doLIFO={this.doLIFO} doWL={this.doWL} doCA={this.doCA} lang={lang} insuranceNeed={this.props.insuranceNeed}
                    pres={this.props.dataInput.Presentations[0]} client={this.props.dataInput.Clients[0]} TC={TC.length}/>

               {/*  <table style={{ paddingLeft: "10px", width: "100%" }}>
                  <tbody style={{ fontSize: "1.2em" }}>
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
                          style={{
                            width: "100%",
                            float: "left",
                            clear: "left",
                          }}
                        >
                          <input
                            className="roundedCornerCmd"
                            style={{
                              // width: "180px",
                              marginTop: "0px",
                              paddingRight: "8px",
                              float: "right",
                            }}
                            onClick={() =>
                              doCompuLife(
                                this.props.dataInput.Presentations[0].language,
                                this.props.insuranceNeed,
                                this.props.dataInput.Presentations[0]
                                  .provinceKey,
                                this.props.dataInput.Clients[0].Age,
                                this.props.dataInput.Clients[0].sexKey,
                                this.props.dataInput.Clients[0].smokerKey,
                                this.props.dataInput.Presentations[0]
                                  .designedBy,
                                this.props.dataInput.Presentations[0]
                                  .designedFor
                              )
                            }
                            type="button"
                            value={CONTROLTITLE[lang].compulife}
                          />
                        </div>
                        <div
                          style={{
                            width: "100%",
                            float: "left",
                            clear: "left",
                          }}
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
                            onClick={()=>{this.doEP(TC.length)}}
                            type="button"
                            value={CONTROLTITLE[lang].ep}
                          />
                        </div>
                        <div
                          style={{
                            width: "100%",
                            float: "left",
                            clear: "left",
                          }}
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
                          style={{
                            width: "100%",
                            float: "left",
                            clear: "left",
                          }}
                        >
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
                        <div
                          style={{
                            width: "100%",
                            float: "left",
                            clear: "left",
                          }}
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
                      </td>
                    </tr>
                  </tbody>
                </table> */}
              </div>
            </div>
          </div>

          {/* presentation */}
          <div id="presentation" className="presentation">
            {allPages}
          </div>
        </div>
      );
    }
  }
}
