import React, { Component } from "react";
import "./Output.css";
import Spinner from "./Spinner";
import { PopupUserinputDialog } from "./PopupUserInput";
import OutputInfoGridEP from "./OutputInfoGridEP";
import OutputExportGridEP from "./OutputExportGridEP";
import { getEPPages } from "../utils/outputPresentationSections";

import {
  IMAGE_APPLET_EP,
  COVER_IMAGE_BASE64_EP,
} from "../definitions/generalDefinitions";
import { OUTPUTTEXTEP } from "../definitions/outputDefinitionsEP";
import { getLogoAndAppletImage, getBase64AppletImage } from "../utils/helper";
import CustomizeToolbar from "./CustomizeToolbar";

import { chartToBase64Image, extractPageCSS } from "../utils/helper";
import { getOutputValues } from "../data/dataExchange";
import { getAssetLiabProjections } from "../data/aggregateGridProjections";

import { handleFetchHtmlToPDF2, handleFetchEditPres } from "../utils/FetchAPIs";

import saveAs from "file-saver";

const ABOUTME_IMAGE = "aboutMeImage";
//const EP_LANDSCAPE_PAGE = 6;

export default class OutputPresentationEP extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      showGrids: false,
      stackedChartConvertedToBase64: null,
      pieEstateLeakageConvertedToBase64: null,
      pieEstateLeakage2ConvertedToBase64: null,
      aboutMeImageConvertedToBase64: null,
      appletImage: null,
      aboutMe: this.props.aboutMe,
      includeAboutMe: false,
      refreshAboutMe: false,
      pdfLoaded: true,
      customizeMsg: false,
    };
    this.AssetLiabProjs = null;
    this.pages = [];
    this.refPage = [];
    this.landScapePages=[]
  }

  doINA = async () => {
    await window.parent.postMessage(
      "INA_" +
        this.props.dataInput.Presentations[0].language +
        "_" +
        this.props.encryptedInputLife1AndSpouse,
      "*"
    );
  };

  doLIFO = async () => {
    await window.parent.postMessage(
      "LIFO_" +
        this.props.dataInput.Presentations[0].language +
        "_" +
        this.props.encryptedInputLife1AndSpouse,
      "*"
    );
  };

  componentWillReceiveProps(nextProps) {
    
    this.setState({ showGrids: false, 
      stackedChartConvertedToBase64:null,
    pieEstateLeakageConvertedToBase64: null,
    pieEstateLeakage2ConvertedToBase64: null,
    aboutMeImageConvertedToBase64: null});
  
  }

  graphStackedDone = async () => {
    const stackedChartConvertedToBase64 = await chartToBase64Image(
      "stackedChart"
    );
    this.setState({
      stackedChartConvertedToBase64: stackedChartConvertedToBase64,
    });
  };

  graphEstateLeakageDone = async () => {
    const pieEstateLeakageConvertedToBase64 = await chartToBase64Image(
      "pieEstateLeakage"
    );
    this.setState({
      pieEstateLeakageConvertedToBase64: pieEstateLeakageConvertedToBase64,
    });
  };

  graphEstateLeakageLEDone = async () => {
    const pieEstateLeakage2ConvertedToBase64 = await chartToBase64Image(
      "pieEstateLeakage2"
    );
    this.setState({
      pieEstateLeakage2ConvertedToBase64: pieEstateLeakage2ConvertedToBase64,
    });
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

  setUpPDF = async () => {
    let aboutMeImageConvertedToBase64 = null;
    if (this.state.includeAboutMe) {
      aboutMeImageConvertedToBase64 = await getBase64AppletImage(ABOUTME_IMAGE);
    }

    this.setState({
      aboutMeImageConvertedToBase64: aboutMeImageConvertedToBase64,
    });

    const cssInline = extractPageCSS();
    let pdfSections = [];
    let htmls = [];

    //let iLandscape = EP_LANDSCAPE_PAGE;
    //if (this.state.includeAboutMe) {
    //  iLandscape = EP_LANDSCAPE_PAGE + 1;
   // }

    const noPages = this.pages.length;
    for (let i = 0; i < noPages; i++) {
      htmls.push(this.refPage[i].innerHTML);
      pdfSections.push({
        html: htmls[i],

        orientation: this.landScapePages[i] === 1 ? "landscape" : "portrait",
      });
    }
    return {
      sections: pdfSections,
      css: cssInline,
    };
  };

  unShowGrids= async () => {
    this.setState({showGrids: false});

    }
    
    doPDF = async () => {
    if (this.state.pdfLoaded === false) {
      return;
    }
    this.setState({ pdfLoaded: false});

    if (this.state.showGrids) {
      await this.unShowGrids();
    }

    const PDF = await this.setUpPDF();

    let blobRes = await handleFetchHtmlToPDF2(PDF.sections, PDF.css);

    let blob = new Blob([blobRes], { type: "application/pdf" });
    saveAs(blob, `PYEPDF` + Date.now());
    this.setState({ pdfLoaded: true });
  };

  doEditPres = async () => {
    if (this.state.pdfLoaded === false) {
      return;
    }
    this.setState({ pdfLoaded: false });

    const PDF = await this.setUpPDF();

    for (let i = 0; i < this.pages.length; i++) {
      PDF.sections[i].css = PDF.css;
    }

    let blobRes = await handleFetchEditPres(
      PDF.sections,
      PDF.css,
      this.props.dataInput.Presentations[0].language,
      "EP"
    );

    this.setState({ customizeMsg: true });
    this.editPresBlob = new Blob([blobRes], { type: "text/html" });

    this.setState({ pdfLoaded: true });
  };

  
  restoreCover = () => {
    const img = COVER_IMAGE_BASE64_EP;
    //console.log(img);
    this.updateImageApplet(img);
  };

  updateImageApplet = (image) => {
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
    this.props.imageAdjust(img, IMAGE_APPLET_EP);
  };

  updateImageLogo = (image) => {
    this.setState({ logoImage: image });
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

  updateAboutMe = (aboutMe) => {
    //console.log(this.state.aboutMe);
    this.setState({ aboutMe: aboutMe }, console.log(this.state.aboutMe));
  };

  render() {
    this.AssetLiabProjs = getAssetLiabProjections(this.props);

    this.output = getOutputValues(this.props);
    const lang = this.props.dataInput.Presentations[0].language;
    const labelsBilingual = OUTPUTTEXTEP[lang];
console.log(labelsBilingual)
    if (this.AssetLiabProjs.projectionsGrids[0] === undefined) {
      return (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      );
    }

    
    const images = getLogoAndAppletImage(
      this.props.dataInput,
      this.props.imageRemove,
      this.props.imageAdjust,
      this.updateImageApplet,
      this.updateImageLogo
    );

    let outputPages = getEPPages(
      this.props,
      this.state.appletImage,
      this.state.aboutMe,
      this.state.includeAboutMe,
      this.state.aboutMeImageConvertedToBase64,
      this.state.stackedChartConvertedToBase64,
      this.state.pieEstateLeakageConvertedToBase64,
      this.state.pieEstateLeakage2ConvertedToBase64,
      this.firstPageLogoWidth,
      this.state.showGrids,
      this.graphEstateLeakageDone,
      this.graphEstateLeakageLEDone,
      this.graphStackedDone,
      this.clickMultiButton
    );
    this.pages = outputPages.allPages;
    this.refPage = outputPages.refPage;
    this.landScapePages = outputPages.landScapePages;  

    //console.log(this.props.dataInput.Presentations[0].appletImage.default)
    return (
      <div>
        {this.state.pdfLoaded === false && <Spinner />}

        <CustomizeToolbar
          lang={lang}
          info={false}
          doPDF={this.doPDF}
          images={images}
          aboutMe={this.state.aboutMe}
          toggleCheckbox={this.toggleCheckbox}
          updateImageLogo={this.updateImageLogo}
          defaltCover={
            this.props.dataInput.Presentations[0].appletImage.default
          }
          restoreCover={this.restoreCover}
          editPres={this.doEditPres}
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
          mainMessage={labelsBilingual.taxSavingToEP}
          severity={"error"}
          language={lang}
          respondToInput={this.respondToEPMsg}
        />

        {/* info grid */}
        <div style={{ width: "100%", paddingTop: "10px" }}>
          <div className="row">
            <div className="column">
              <OutputInfoGridEP
                taxLiability={this.props.taxLiability}
                lang={lang}
                dataEstateLiability={this.props.dataEstateLiability}
                LE={this.props.LE}
              />
            </div>
            <div
              className="column"
              style={{
                textAlign: "right",
                width: "300px",
                float: "right",
              }}
            >
              <OutputExportGridEP
                doEP={this.doINA}
                doLIFO={this.doLIFO}
                doCA={this.doCA}
                doEB={this.doEB}
                lang={lang}
              />
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
