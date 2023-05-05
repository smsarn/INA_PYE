import React, { Component } from "react";
import "./Output.css";
//import { MultiButtons } from "./MultiButtons";
import Spinner from "./Spinner";
import { PopupUserinputDialog } from "./PopupUserInput";

import {
  IMAGE_APPLET_INA,
  COVER_IMAGE_BASE64_INA,
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
  getLogoAndAppletImage,
  versionDetails,
  extractPageCSS,
  cleanFormat,
  familyProjectionYears,
  isSingleFamily,
  chartToBase64Image,
  getBase64AppletImage,
  //getDefaultImages,
} from "../utils/helper";

import {getINAPages
} from "../utils/outputPresentationSections";

import {
  getOutputInfoGrid
} from "../utils/outputPresentationSections";

import { getInfoINA, getInfoPDF } from "../definitions/infoIconsDefinitions";
import { Info } from "./Info";
import saveAs from "file-saver";
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
      console.log(this.refPage[i].innerHTML)
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
    saveAs(blob, `INAPDF`+Date.now());
    
    this.setState({ pdfLoaded: true });
  };

  doEditPres = async () => {
    if (this.state.pdfLoaded === false) {
      return;
    }
    this.setState({ pdfLoaded: false });
    
    const PDF= await this.setUpPDF();

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
    console.log(img);
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
    console.log(image, size);
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
    console.log(this.state.aboutMe);
    this.setState({aboutMe: aboutMe}, console.log(this.state.aboutMe))

  }

  render() {
    // presentation output shared with pdf

   // let output = getOutputValues(this.props);

    const lang = this.props.dataInput.Presentations[0].language;
    const labelsBilingual = OUTPUTTEXT[lang];

    const singlePerson =
      this.props.dataInput.Clients.length === 1 ? true : false;

    const clients = this.props.dataInput.Clients;
    const projYears = familyProjectionYears(
      clients,
      this.props.dataInput.Presentations[0].periodOption,
      this.props.LE,
      this.props.LE
    );
    const singleFamily = isSingleFamily(clients);
    const noSurvivor = singlePerson && versionDetails().versionNumeric <= 10014;

    const TC=this.props.dataInput.Sources.filter(
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


    const needTo = this.props.insNeedLine;
    const images = getLogoAndAppletImage(
      this.props.dataInput,
      this.props.imageRemove,
      this.props.imageAdjust,
      this.updateImageApplet,
      this.updateImageLogo
    );


    const posGrid = singleFamily || singlePerson ? "-80px" : "-30px";


  let outputPages=getINAPages(this.props, this.state.spouseSwitched,this.state.appletImage,this.state.aboutMe,this.state.includeAboutMe,this.state.barConvertedToBase64, this.state.aboutMeImageConvertedToBase64,this.firstPageLogoWidth )
  this.pages = outputPages.allPages;
  this.refPage=outputPages.refPage

  console.log(this.refPage, outputPages.refPage)
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
            token={this.props.token}
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
              </div>
            </div>
          </div>

          {/* presentation */}
          <div id="presentation" className="presentation">
            {this.pages}
          </div>
        </div>
      );
    }
  }
}
