import React, { Component, Suspense } from "react";
import { Client } from "./Client";
//import { defaults } from "react-chartjs-2";
//import { Asset } from "./Asset";
//import  Liability  from "./Liability";
//import { Source } from "./Source";
//import { Need } from "./Need";
//import Presentation  from "./Presentation";
import { Header, hideRecover } from "./Header";
import { PopupUserinputDialog } from "./PopupUserInput";
import { PopupMessage } from "./PopupMessage";
import { Collapsible } from "./Collapsible";
import PasteClients from "./PasteClients";
import Spinner from "./Spinner";

import {
  getEPGridData,
  getINAGridData,
} from "../data/aggregateGridProjections";
//import { AggregateGrid } from "./AggregateGrid";
//import _ from "lodash";
import {
  fetchTimerAPICheck,
  getTaxRate,
  handleFetchInsuranceNeedsNew,
  handleFetchINADataFromQueryString,
  handleFetchQueryString,
  fetchValidateTokenGetAgentEmailRecordAppletLogin,
  handleFetchAdvisorPortfolio,
} from "../utils/FetchAPIs";
import debounce from "lodash.debounce";
import cloneDeep from "lodash.clonedeep";
import queryString from "query-string";
import { MultiButtons } from "./MultiButtons";
import { saveAs } from "file-saver";
//import { OutputPresentation } from "./outputPresentation";

//import { OutputPresentationEP } from "./outputPresentationEP";
/* import { OutputGraphs } from "./OutputGraphs";
import { OutputGraphsEP } from "./OutputGraphsEP";
import { AnalysisGraphs } from "./AnalysisGraph"; */
import { AddRemove } from "./AddRemove";
import { Info } from "./Info";
import { TKDFeedback } from "./Feedback";
import {
  isMobileDevice,
  //isVersion2019,
  versionDetails,
  getDataFutureEstateLiability,
  getProjectedLiabilities,
  getListItemKeyFromName,
  familyProjectionYears,
  singleFamilyProjectionYears,
  isSingleFamily,
  getInsNeedLine,
} from "../utils/helper";
import {
  QUOTE_CLIENT,
  QUOTE_SPOUSE,
  appSiteAPI,
  DISPLAY_RETIREMENT,
  DISPLAY_LIFEEXP,
  DISPLAY_ENDAGE,
  DISPLAY_LIFEEXP_PLUS_3,
  ORPHAN_AGE_QC,
  ORPHAN_AGE_NON_QC,
  MAX_ORPHAN_DUR_QC,
  MAX_ORPHAN_DUR_NON_QC,
  UNIVERSITY_START_AGE,
  UNIVERSITY_END_AGE,
  DISPLAY_PRESENTATION,
  DISPLAY_GRAPHS,
  DISPLAY_SPREADSHEET,
  DISPLAY_ANALYSIS,
  MESSAGES,
  ASSETS,
  PROVINCE,
  ASSET_TAX,
  INCOMESOURCES,
  OWNERSHIP,
  SEX,
  SMOKING,
  MEMBER,
  LIABILITIES,
  TITLES,
  INCOMENEEDS,
  GROWTHDIR,
  EMAIL,
  ASSET_OWNERSHIP_ACTION,
  APPLET_INA,
  APPLET_EP,
  DISPLAY_NAME,
  IMAGE_LOGO,
  DEFAULT_QUOTE,
  DEFAULT_RRIF_AGE,
  DISPLAY_ANALYSIS_ON,
} from "../definitions/generalDefinitions";

import "isomorphic-fetch";
import shortid from "shortid";
import { buildMode } from "../../package.json";
import {
  setUIDataToAPI,
  loadSavedDataToUI,
  sendToReloadINA,
} from "../data/dataExchange";
import {
  createDefaultAsset,
  createDefaultClient,
  createDefaultSource,
  createDefaultNeed,
  getDefaultData,
} from "../data/createDefaults";
import {
  getInfoNoInternetAccess,
  getInfoIconSourcesGov,
  getGenericMessage,
  getInfoIconInflationGrowth,
  getInfoIconPYE_JLTD,
  getInfoIconNeedGrowth,
  getInfoSave,
} from "../definitions/infoIconsDefinitions";

import { getAssetGridValues } from "../data/assetGridProjections";
import { Feedback, TrendingUpOutlined } from "@material-ui/icons";

const COLLAPSIBLE_CLIENTS = 0;
const COLLAPSIBLE_ASSETS = 1;
const COLLAPSIBLE_LIABS = 2;
const COLLAPSIBLE_SOURCES = 3;
const COLLAPSIBLE_NEEDS = 4;
const COLLAPSIBLE_PRESENTATION = 5;
const COLLAPSIBLE_RESULTS = 6;
const COLLAPSIBLE_UPDATE_ALL = 7;

const COLLAPSIBLES_COUNT = 7;
const COLLAPSIBLES_CLOSED = false;
const COLLAPSIBLES_OPEN = true;

const DISPLAY_INCOME = 1;
const DISPLAY_TAXLIAB = 2;
const INA_FILE_TYPE = ".ppi_INA_TKD";
const EP_FILE_TYPE = ".ppi_EP_TKD";
const waitTime = 1800;
//const RRIF_LAST_START_AGE = 71;

const SITE_TEST = "https://test-tkdirect";

const SAVETO_FILE = 0;
const LOAD_FILE = 1;
const LOAD_STORAGE = 2;
const EMAIL_FILE = 3;
const CHANGE_LANG = 4;
const DEFAULT = 5;

// to send it to Proxy make API site ""
//const API_SITE="https://ppitoolkitapi.azurewebsites.net"
//const API_SITE_LOCAL="http://www.toolkitdirectapi.com";
//const API_SITE="";

const PARENT_SITE_LOCAL = "http://localhost:8083";
const PARENT_SITE_TEST = "https://test-tkdirect.ppi.ca/";
const PARENT_SITE_PROD = "https://toolkitdirect.ppi.ca/";
const MODE_SAVE = 0;
const MODE_EMAIL = 1;
const MODE_ONLY_GET_ENCRYPTED_QS = 2;

//"local"=0 "test-tkdirect"=1 "toolkitdirect" =2}
/* let appSiteAPI =
  buildMode === 0
    ? API_SITE_LOCAL
    : buildMode === 1
    ? API_SITE_TEST
    : API_SITE_PROD; */
let appSiteParent =
  buildMode === 0
    ? PARENT_SITE_LOCAL
    : buildMode === 1
    ? PARENT_SITE_TEST
    : PARENT_SITE_PROD;

//defaults.global.maintainAspectRatio = false;

let OutputPresentation;
if (APPLET_INA)
  OutputPresentation = React.lazy(() => import("./outputPresentation"));

let OutputPresentationEP;
if (APPLET_EP)
  OutputPresentationEP = React.lazy(() => import("./outputPresentationEP"));

let OutputGraphs;
if (APPLET_INA) OutputGraphs = React.lazy(() => import("./OutputGraphs"));

let OutputGraphsEP;
if (APPLET_EP) OutputGraphsEP = React.lazy(() => import("./OutputGraphsEP"));

let AnalysisGraphs;
if (DISPLAY_ANALYSIS_ON)
  AnalysisGraphs = React.lazy(() => import("./AnalysisGraph"));

const AggregateGrid = React.lazy(() => import("./AggregateGrid"));

const Asset = React.lazy(() => import("./Asset"));
const Liability = React.lazy(() => import("./Liability"));

const Source = React.lazy(() => import("./Source"));
const Need = React.lazy(() => import("./Need"));
const Presentation = React.lazy(() => import("./Presentation"));

export class NA extends Component {
  displayName = DISPLAY_NAME;
  constructor(props) {
    super(props);

    // define default starting clients assets .etc. rows
    let defaultClients = [];
    defaultClients.push(createDefaultClient(1));
    if (APPLET_INA) defaultClients.push(createDefaultClient(2));
    let defaultAssets = [];
    defaultAssets.push(createDefaultAsset(1));
    //  const defaultSources = [createDefaultSource(1)];
    //  const defaultLiab = [createDefaultLiab(1)];
    let defaultNeeds = [];
    defaultNeeds.push(createDefaultNeed(1));
    defaultNeeds.push(createDefaultNeed(2));

    // build state with defaults
    this.state = {
      dataInput: getDefaultData(),
      loading: true,
      initialLoading: true,
      initialQSParsing: 1,
      failedAPI: false,
      promptForSave: false,
      showLogout: false,
      promptShowCases: false,
      promptShowClients: false,
      showPopupMessage: "",
      promptShowFeedback: 0,
      failedRemove: false,
      SnapImport: false,

      dataOutput: {
        dataInsuranceNeeds: [],
        dataCashFlowPersonal: [],
        dataTaxLiability: [],
        dataNonTaxLiability: [],
        dataCashFlowGov: [],
        dataCashFlowNeeds: [],
        dataNAAges: [],
        dataShortfall: [],
        yrsCoverageIfCashAll: 0,
        govBenefits: { cppSurvivor: null, cppDB: null, cppOrphan: null },
        lifeExpectancy: { client: 0, spouse: 0, joint: 0 },
        assetProjections: [],
        aggregateGrid: null,
        encryptedInputLife1AndSpouse: "",
        encryptedInputLife1: "",
      },
    };
    this.openCollapsible = [];
    let i;
    for (i = 0; i < COLLAPSIBLES_COUNT; ++i) {
      this.openCollapsible.push({
        open: COLLAPSIBLES_CLOSED,
        id: i,
      });
    }
    // open first bar
    this.openCollapsible[COLLAPSIBLE_CLIENTS].open = COLLAPSIBLES_OPEN;

    this.tag = { t: 0, y: 0 };
    this.showRecover = 1;
    this.survIdx = APPLET_INA ? QUOTE_SPOUSE : QUOTE_CLIENT;
    this.graphs = false;
    this.caseFromFile = false;
    this.OKToRemove = true;
    this.validToken = true;
    this.openParent = true;
    this.openForce = true;
    this.resultIsOpen = false;
    this.langText = "Français";
    this.provinceMargTax = 0;
    this.visibleOutputSection = 0;
    this.dataQS = "";
    this.intervalID = 0;
    this.INAOption = APPLET_INA ? DISPLAY_INCOME : DISPLAY_TAXLIAB;
    this.agentAccessQuery = false;
    this.aboutMe = null;
    this.token="";
    //this.OutputPresentation = null;
    //this.OutputPresentationEP = null;
  }

  probateSync = async (dataInput, dataOutput) => {
    // if not there add
    let qbProbate = new Array(dataOutput.probate.numericValues.length).fill(0);
    if (dataInput.Presentations[0].provinceKey === "QC")
      dataOutput.probate.numericValues = qbProbate;

    //  console.log(dataOutput.probate.numericValues)
    let probate = LIABILITIES.PROBATE.Key;
    let hasProbate = dataInput.Liabilitys.find(
      (x) => x.liabTypeKey === probate
    );
    if (hasProbate !== undefined) {
      hasProbate.currValue = dataOutput.probate.numericValues[0];
    }
    //console.log(hasProbate,dataInput)

    return dataInput;
  };

  govBenefitsSync = async (dataInput, dataOutput) => {
    // if not there add

    if (APPLET_INA) {
      //this.failedRemove=false
      let gov1 = INCOMESOURCES.GOV_SURVIVORS_PENSION.Key; //value[this.state.dataInput.Presentations[0].language];
      let gov = dataInput.Sources.find((x) => x.sourceTypeKey === gov1);

      let gov2 = INCOMESOURCES.GOV_DEATH_BENEFIT.Key; //value[this.state.dataInput.Presentations[0].language];
      let govDB = dataInput.Sources.find((x) => x.sourceTypeKey === gov2);

      let hasSpouseArray = dataInput.Clients.find(
        (x) => x.memberKey === MEMBER.SPOUSE.Key
      );
      const hasSpouse =
        hasSpouseArray === undefined || hasSpouseArray.length === 0
          ? false
          : true;

      const ownerID = dataInput.Clients.length > 1 ? 2 : 1;

      if (gov === undefined) {
        const sourceGovSurv = {
          id: dataInput.Sources.length + 1, //sourcesNo + 1,
          sourceTypeKey: INCOMESOURCES.GOV_SURVIVORS_PENSION.Key,
          amount: hasSpouse ? parseInt(dataOutput.govBenefits.cppSurvivor) : 0, // * this.state.dataInput.Clients[QUOTE_CLIENT].Eligibility) / 100,
          startYear: 0,
          duration: 100,
          ownerID: ownerID,
        };
        if (hasSpouse) dataInput.Sources.push(sourceGovSurv); // add at begi
      } else {
        gov.amount = hasSpouse
          ? parseInt(dataOutput.govBenefits.cppSurvivor)
          : 0;
      }

      if (govDB === undefined) {
        const sourceGovDB = {
          id: dataInput.Sources.length + 2,
          sourceTypeKey: INCOMESOURCES.GOV_DEATH_BENEFIT.Key,
          amount: parseInt(dataOutput.govBenefits.cppDB),
          startYear: 0,
          duration: 100,
          ownerID: ownerID,
        };
        dataInput.Sources.push(sourceGovDB);
      } else {
        govDB.amount = parseInt(dataOutput.govBenefits.cppDB);
      }

      dataInput = await this.manageOrphanSync(dataInput, dataOutput); //}
    }
    return dataInput;
  };

  parseQSs = async (query) => {
    let caseID = "";
    this.agentAccessQuery = false;
    if (query.caseGUID !== undefined) caseID = query.caseGUID;
    if (query.clientGUID !== undefined)
      this.clientIDToShowCasesFor = query.clientGUID;
    // Database
    else if (query.DBAction !== undefined) {
      this.DBApplet = "";
      if (query.DBAction.toLowerCase() === "clients")
        this.setState({ promptShowClients: true });
      else {
        this.setState({ promptShowCases: true });
        if (query.DBAction !== "" && query.DBAction.toLowerCase() !== "cases")
          this.DBApplet = query.DBAction;
      }
    }
    // Feedback
    else if (query.FBAction === "1") {
      const FB = query.lang === "fr" ? 2 : 1;
      this.setState({ promptShowFeedback: FB });
    }
    // INA or PYE
    else {
      if (query.QS === undefined && caseID === "") {
        await this.handleIntitalFetch1(
          // this.handleIntitalFetch(
          query.lang === "fr" || global.langFr ? "fr" : "en"
        );
      } else {
        if (query.QS !== undefined || query.qs !== undefined)
          await this.handleInitilizeQuoteFromQueryString(query.QS);
        else {
          this.caseForEditID = caseID; // if same applet keep it
          await this.handleInitilizeQuoteFromCaseID(caseID);
        }
      }
    }
    if (query.recover !== undefined) {
      if (query.recover === "true") {
        let d = new Date();
        d = d.setHours(d.getHours(), d.getMinutes() - 5, 0, 0);
        const objJSONData = JSON.parse(
          localStorage.getItem(APPLET_INA ? "INAData" : "EP")
        );

        var dRecover = new Date(
          objJSONData.dataPresentations.Presentations[0].valuationDate
        );
        dRecover = new Date(
          objJSONData.dataPresentations.Presentations[0].presentationDate
        );
        if (dRecover > d) {
          await this.loadStorage();
          hideRecover();
        }
      }
    }
    // console.log(query)
    if (query.snapimport !== undefined) {
      if (query.snapimport === "1") {
        this.setState({ SnapImport: true });
      }
    }
    if (this.state.initialLoading === false) {
      window.parent.postMessage("FRAME_LOADED", "*");
    }

    // now UI is loaded call initiaal API calls async but dont await
    if (query.QS === undefined) {
      this.handleIntitalFetch(
        // this.handleIntitalFetch(
        query.lang === "fr" || global.langFr ? "fr" : "en"
      );
    }
  };

  componentDidMount = async () => {
    const el = document.querySelector(".loader-container");
    if (el) {
      this.setState({ initialLoading: false });
      el.remove();
    }
    document.title = APPLET_INA ? "INA" : "EP";
    this.intervalID = setInterval(this.loadData, 100000);
    localStorage.setItem("INAAPIFails", parseInt(0));
    this.OKToRemove = true;

    const query = queryString.parse(window.location.search);

    this.setState({ initialQSParsing: 1 });

    //await this.setToken(query.TKTOK, query.authToken);

    let validToken = false;
    ;
    if (query.authToken !== undefined)
    {
      validToken = await this.setToken(query.authToken);
      this.token=query.authToken
    }
    else if (query.TKTOK !== undefined)
    {
      validToken = await this.setToken(query.TKTOK);
      this.token=query.TKTOK
    }

    if(validToken===false)this.setState({ showLogout: true });

    this.aboutMe = await handleFetchAdvisorPortfolio(this.token);

    



    console.log(this.aboutMe, this.userEmail);

    // agent access re colour or else
    if (query.AgentAccessQuery === "1") {
      this.agentAccessQuery = true;
      if (query.authToken !== undefined || query.TKTOK !== undefined) {
        let data = await fetchValidateTokenGetAgentEmailRecordAppletLogin(
          query.authToken !== undefined ? query.authToken : query.TKTOK,
          "INA"
        );
        await window.parent.postMessage(
          "AGENT_ACCESS_" + data.accessLevel,
          "*"
        );
      }

      setTimeout(() => {}, 1000);
      return;
      // else
      //  await window.parent.postMessage("AGENT_ACCESS_NONE", "*")
    }

    

    await this.parseQSs(query);

    await this.setState({ initialQSParsing: validToken ? 0 : -1 });
    this.setState({ initialQSParsing: 0 });

    /* if (validToken === false) {
      localStorage.removeItem("TKTOK");
      console.log("send To Reload INA");
      await sendToReloadINA();
    }
     
    if (this.state.initialLoading === false) {
      window.parent.postMessage("FRAME_LOADED", "*");
    }*/
  };

  /* if (query.QS !== undefined) {
      await this.handleInitilizeQuoteFromQueryString(query.QS);
      //this.handleInitilizeQuoteFromQueryString(query.QS);
    } else {
      await this.handleIntitalFetch1(
        // this.handleIntitalFetch(
        query.lang === "fr" || global.langFr ? "fr" : "en"
      );
    }

    if (query.recover !== undefined) {
      if (query.recover === "true") {
        let d = new Date();
        d = d.setHours(d.getHours(), d.getMinutes() - 5, 0, 0);
        const objJSONData = JSON.parse(
          localStorage.getItem(APPLET_INA ? "INAData" : "EP")
        );

        var dRecover = new Date(
          objJSONData.dataPresentations.Presentations[0].valuationDate
        );
        dRecover = new Date(
          objJSONData.dataPresentations.Presentations[0].presentationDate
        );
        if (dRecover > d) {
          await this.loadStorage();
          hideRecover();
        }
      }
    }
    if (query.snapimport !== undefined) {
      if (query.snapimport === "1") {
        this.setState({ SnapImport: true });
      }
    }
    if (this.state.initialLoading === false) {
      window.parent.postMessage("FRAME_LOADED", "*");
    }
    // now UI is loaded call initiaal API calls async but dont await
    if (query.QS === undefined) {
      this.handleIntitalFetch(
        // this.handleIntitalFetch(
        query.lang === "fr" || global.langFr ? "fr" : "en"
      );
    }
  };
  */
  setToken = async (authToken) => {
    let validToken = false;
    let token = authToken;
    if (token !== undefined && token !== "" && token !== null) {
      //const decoded = jwt_decode(authToken);

      //this.userEmail = decoded.upn;
      const email =null; //sessionStorage.getItem("userEmail");
      //console.log(email, this.userEmail, this.agentID);
      if (email === null || email === undefined || email === "") {
        const agentSpecs =
          await fetchValidateTokenGetAgentEmailRecordAppletLogin(
            token,
            APPLET_INA ? "INA" : "EP"
          );
        // await console.log("agentSpecs:" +agentSpecs);
        validToken = agentSpecs.validToken;
        if (validToken === true) {
          this.userEmail = agentSpecs.email;
          this.agentID = agentSpecs.guid;
          sessionStorage.setItem("userEmail", this.userEmail);
          sessionStorage.setItem("userGUID", this.agentID);
        }
      } else {
        // save applet login
        fetchValidateTokenGetAgentEmailRecordAppletLogin(
          token,
          APPLET_INA ? "INA" : "EP"
        );

        this.userEmail = email;
        this.agentID = sessionStorage.getItem("userGUID");
        validToken = true;
      }
    }
    //console.log("this.userEmail:" + this.userEmail);
    return validToken;

    //   let result= await fetchGetAgentGUIDFromDB(this.userEmail)
    //   this.agentID=String(result.caseGUID);
    //   await console.log(this.userEmail,this.agentID);

    //await this.setState({userEmail:userEmail, userGUID: result.caseGUID});
  };

  /* checkAndCallInitialFetch = async () => {
    if (this.state.initialLazyLoaded === false) {
      await this.handleIntitalFetch(
        this.state.dataInput.Presentations[0].language
      );
      this.setState({initialLazyLoaded: true});
    }
  }
 */
  handleIntitalFetch = async (lang) => {
    //let presentation = this.state.dataInput.Presentations[0];
    /* await this.handleUpdatePresentation(presentation, true);

    await this.govBenefits(); */

    this.setState({ loading: true });
    let { dataInput, dataOutput } = this.state;
    const newDataInput = cloneDeep(dataInput);
    const newDataOutput = cloneDeep(dataOutput);

    let presentation = newDataInput.Presentations[0];

    {
      const tr = await getTaxRate(
        "PERSONAL_INCOME",
        presentation.provinceKey
        //convertProvince(presentation.provinceKey, this.state.dataInput.Presentations[0].language)
      );
      presentation.taxRate = (Math.round(tr * 10000) / 100).toFixed(4);
    }

    // set new lang if coming from lang change in landing page
    presentation.language = lang;
    newDataInput.Presentations[0] = presentation;

    //this.AddInitialGovBenefits(newDataInput);

    const newState = await this.reSync_reCalculate_reRender(
      newDataInput,
      newDataOutput,
      //COLLAPSIBLE_ASSETS,
      COLLAPSIBLE_UPDATE_ALL, // make sure initial from file, new default updates all
      1,
      0,
      false // initial case is on set to 1, any change after this removes recover
    );

    // first asset needs to be updated with grid etc
    this.openCollapsible[COLLAPSIBLE_CLIENTS].open =
      newDataInput.Presentations[0].language === "en"
        ? COLLAPSIBLES_OPEN
        : COLLAPSIBLES_CLOSED;

    // before eupdating state, resync, recalcuate, update state to re_render
    this.setState({ ...newState, loading: false, initialLoading: false });
  };

  handleIntitalFetch1 = (lang) => {
    this.setState({ loading: true });
    let { dataInput, dataOutput } = this.state;
    const newDataInput = cloneDeep(dataInput);
    const newDataOutput = cloneDeep(dataOutput);

    let presentation = newDataInput.Presentations[0];

    // set new lang if coming from lang change in landing page
    presentation.language = lang;
    newDataInput.Presentations[0] = presentation;

    //this.AddInitialGovBenefits(newDataInput);

    // first asset needs to be updated with grid etc
    this.openCollapsible[COLLAPSIBLE_CLIENTS].open =
      newDataInput.Presentations[0].language === "en"
        ? COLLAPSIBLES_OPEN
        : COLLAPSIBLES_CLOSED;

    // before eupdating state, resync, recalcuate, update state to re_render
    this.setState({
      dataInput: newDataInput,
      dataOutput: newDataOutput,
      loading: false,
      initialLoading: false,
    });
  };

  handleUpdateOutput = async (
    newStateCandidateInput,
    dataOutput,
    itemToUpdateGroup,
    itemToUpdateID
  ) => {
    try {
      //await this.handleFetchInsuranceNeeds();
      const dataNA = await setUIDataToAPI(newStateCandidateInput);

      // close results tab to avoid numerous recalcs
      // this.openCollapsible[COLLAPSIBLE_RESULTS].open = false;

      // main output data
      const data = await handleFetchInsuranceNeedsNew(
        dataNA,
        newStateCandidateInput
      );
      let newStateCandidateOutput = this.populateOutput2(data, dataOutput);
      // assets projs , do all assets if it is from a saved file we need all for RESULTS
      if (
        newStateCandidateOutput.assetProjections !== null &&
        (itemToUpdateGroup === COLLAPSIBLE_ASSETS ||
          itemToUpdateGroup === COLLAPSIBLE_RESULTS ||
          itemToUpdateGroup === COLLAPSIBLE_UPDATE_ALL ||
          newStateCandidateOutput.assetProjections.length <
            newStateCandidateInput.Assets.length)
      )
        newStateCandidateOutput.assetProjections =
          await this.updateAssetProjectionOutput(
            dataNA,
            newStateCandidateInput,
            newStateCandidateOutput,
            itemToUpdateGroup,
            itemToUpdateID
          );

      // set new encrpt file that now has calculated ins. Amt
      // need to only pass client & spouse to EP and Client only to others
      let newDataInputClient12 = cloneDeep(newStateCandidateInput);
      // remove sources based on child
      newDataInputClient12.Clients.forEach((element) => {
        if (
          element.memberKey === MEMBER.CHILD.Key ||
          element.memberKey === MEMBER.DEPENDENT_ADULT.Key
        )
          newDataInputClient12.Sources = newDataInputClient12.Sources.filter(
            (item) => {
              return item.ownerID !== element.id;
            }
          );
      });
      newDataInputClient12.Clients = newDataInputClient12.Clients.filter(
        (item) => {
          return (
            item.memberKey === MEMBER.CLIENT.Key ||
            item.memberKey === MEMBER.SPOUSE.Key
          );
        }
      );

      newStateCandidateOutput.encryptedInputLife1AndSpouse =
        await this.handleEncryptedDataModes(
          MODE_ONLY_GET_ENCRYPTED_QS,
          newDataInputClient12,
          newStateCandidateOutput
        );

      // need to only pass client who is to be insured and not JLTD
      let newDataInputClient1 = cloneDeep(newStateCandidateInput);
      newDataInputClient1.Clients = newDataInputClient1.Clients.filter(
        (item) => {
          return item.memberKey === MEMBER.CLIENT.Key;
        }
      );

      newStateCandidateOutput.encryptedInputLife1 =
        await this.handleEncryptedDataModes(
          MODE_ONLY_GET_ENCRYPTED_QS,
          newDataInputClient1,
          newStateCandidateOutput
        ); // set this.dataQS
      //newStateCandidateOutput.encryptedInput = this.dataQS;
      // liabs projs
      // aggregate grid proj
      newStateCandidateOutput.aggregateGrid = await this.updateOutputData(
        newStateCandidateInput,
        newStateCandidateOutput
      );
      return newStateCandidateOutput;
    } catch (error) {
      return null;
    }
  };
  /* end Region */

  updateAssetProjectionOutput = async (
    dataNA,
    newStateCandidateInput,
    newStateCandidateOutput,
    itemToUpdateGroup,
    itemToUpdateID
  ) => {
    for (let i = 0; i < newStateCandidateInput.Assets.length; i++) {
      const element = newStateCandidateInput.Assets[i];
      if (
        element.id === itemToUpdateID ||
        itemToUpdateGroup === COLLAPSIBLE_RESULTS ||
        itemToUpdateGroup === COLLAPSIBLE_UPDATE_ALL
      ) {
        let projection = await getAssetGridValues(
          dataNA,
          element,
          newStateCandidateInput.Presentations[0].language,
          false
        ); //    this.updateProjection2(element,dataNA)
        let a = newStateCandidateOutput.assetProjections.find(
          (e) => e.id === element.id
        );
        if (a !== undefined) {
          a.grid = projection;
        } else
          newStateCandidateOutput.assetProjections.push({
            id: element.id,
            grid: projection,
          });
      }
    }

    return newStateCandidateOutput.assetProjections;
  };

  populateOutput2 = (dataOutputCandidate, dataOutput) => {
    try {
      // console.log( dataOutput)
      dataOutput.dataInsuranceNeeds = dataOutputCandidate.dataInsuranceNeeds;
      dataOutput.dataCashFlowPersonal =
        dataOutputCandidate.dataCashFlowPersonal.numericValues;
      dataOutput.dataTaxLiability =
        dataOutputCandidate.dataTaxLiability.numericValues;
      dataOutput.dataNonTaxLiability =
        dataOutputCandidate.dataNonTaxLiability.numericValues;
      dataOutput.dataCashFlowGov =
        dataOutputCandidate.dataCashFlowGov.numericValues;
      dataOutput.dataCashFlowNeeds =
        dataOutputCandidate.dataCashFlowNeeds.numericValues;
      dataOutput.dataNAAges = dataOutputCandidate.dataNAAges.numericValues;
      dataOutput.dataShortfall =
        dataOutputCandidate.dataShortfall.numericValues;
      dataOutput.govBenefits.cppSurvivor = dataOutputCandidate.cpp;
      dataOutput.govBenefits.cppDB = dataOutputCandidate.cppDB;
      dataOutput.govBenefits.cppOrphan = dataOutputCandidate.orphan;
      dataOutput.probate = dataOutputCandidate.probate;
      dataOutput.yrsCoverageIfCashAll =
        dataOutputCandidate.yrsCoverageIfCashAll;
      dataOutput.lifeExpectancy.client = dataOutputCandidate.lifeExpClient;
      dataOutput.lifeExpectancy.spouse = dataOutputCandidate.lifeExp;
      dataOutput.lifeExpectancy.joint = dataOutputCandidate.lifeExpJLTD;
      dataOutput.encryptedInputLife1AndSpouse =
        dataOutputCandidate.encryptedInputLife1AndSpouse;
      dataOutput.encryptedInputLife1 = dataOutputCandidate.encryptedInputLife1;
      return dataOutput;
    } catch (error) {
      alert("Could not connect to the calculation engine API");
      return dataOutput;
    }
  };

  populateOutput = async (data) => {
    let dataOutput = this.state.dataOutput;

    dataOutput.dataInsuranceNeeds = data.dataInsuranceNeeds;
    dataOutput.dataCashFlowPersonal = data.dataCashFlowPersonal.numericValues;
    dataOutput.dataTaxLiability = data.dataTaxLiability.numericValues;
    dataOutput.dataNonTaxLiability = data.dataNonTaxLiability.numericValues;
    dataOutput.dataCashFlowGov = data.dataCashFlowGov.numericValues;
    dataOutput.dataCashFlowNeeds = data.dataCashFlowNeeds.numericValues;
    dataOutput.dataNAAges = data.dataNAAges.numericValues;
    dataOutput.dataShortfall = data.dataShortfall.numericValues;
    dataOutput.govBenefits.cppSurvivor = data.cpp;
    dataOutput.govBenefits.cppDB = data.cppDB;
    dataOutput.govBenefits.cppOrphan = data.orphan;
    dataOutput.lifeExpectancy.client = data.lifeExpClient;
    dataOutput.lifeExpectancy.spouse = data.lifeExp;
    dataOutput.lifeExpectancy.joint = data.lifeExpJLTD;

    this.setState({ dataOutput: dataOutput, SnapImport: false });
  };

  handleEncryptedDataModes = async (mode, dataInput, dataOutput) => {
    const lang = dataInput.Presentations[0].language;
    const insuranceNeed =
      dataOutput.dataInsuranceNeeds[dataInput.Presentations[0].periodOption]
        .Value;
    let dataNA = await setUIDataToAPI(dataInput, insuranceNeed);
    let data = await handleFetchQueryString(dataNA);
    if (data !== undefined) {
      this.dataQS = data;
      if (mode === MODE_ONLY_GET_ENCRYPTED_QS) return data;
      else if (mode === MODE_SAVE) this.setState({ promptForSave: true });
      else if (mode === MODE_EMAIL) {
        let url =
          "mailto: ?subject= " +
          (APPLET_INA ? TITLES[lang].appletINA : TITLES[lang].appletEP) +
          " &body= " +
          (EMAIL[lang].body +
            ".%0D%0A" +
            appSiteParent +
            "?applet=EP&QS=" +
            this.dataQS);

        const ft =
          appSiteParent +
          "/?" +
          ["applet=" + DISPLAY_NAME, "QS=" + this.dataQS].join("&");
        url =
          "mailto: ?subject= " +
          (APPLET_INA ? TITLES[lang].appletINA : TITLES[lang].appletEP) +
          " &body= " +
          EMAIL[lang].body +
          ".%0D%0A" +
          encodeURIComponent(ft);

        window.location.href = url;
      }
    }
  };

  handleInitilizeQuoteFromQueryString = async (savedINA_QS) => {
    //log(savedINA_QS)
    const data = await handleFetchINADataFromQueryString(savedINA_QS);
    //  console.log(data)

    let objJSONData = await loadSavedDataToUI(data, this.state.dataInput);

    // put loaded data to quote and show
    await this.updateStateFromJSon(objJSONData);
  };

  handleUpdateClient = async (client) => {
    // keep render to just once until or if needed. this also avoids flshing page before final render

    {
      this.setState({ loading: true });

      const { dataOutput, dataInput } = this.state;
      let newDataInput = cloneDeep(dataInput);
      const newDataOutput = cloneDeep(dataOutput);

      if (client.Age > client.retirementAge)
        client.retirementAge = client.Age + 1;
      const redoAll =
        client.memberKey !== newDataInput.Clients[QUOTE_CLIENT].memberKey ||
        client.Age !== newDataInput.Clients[QUOTE_CLIENT].Age ||
        client.Eligibility !== newDataInput.Clients[QUOTE_CLIENT].Eligibility ||
        client.avgTaxRate !== newDataInput.Clients[QUOTE_CLIENT].avgTaxRate ||
        (newDataInput.Clients.count > 1 &&
          (client.Age !== newDataInput.Clients[QUOTE_SPOUSE].Age ||
            client.avgTaxRate !==
              newDataInput.Clients[QUOTE_SPOUSE].avgTaxRate));
      newDataInput.Clients[client.id - 1] = client;

      const newState = await this.reSync_reCalculate_reRender(
        newDataInput,
        newDataOutput,
        redoAll ? COLLAPSIBLE_UPDATE_ALL : COLLAPSIBLE_CLIENTS, // need to redo a
        client.id
      );
      this.setState({ ...newState, loading: false });
    }
  };

  reSync_reCalculate_reRender = async (
    newStateCandidateInput,
    dataOutput,
    itemToUpdateGroup,
    itemToUpdateID,
    debounce,
    saveToStorage,
    doAlert
  ) => {
    try {
      // reSync
      newStateCandidateInput = await this.syncPanelsValues2(
        newStateCandidateInput,
        itemToUpdateGroup,
        doAlert
      );

      let newStateCandidateOutput;

      // reCalculate
      if (debounce)
        newStateCandidateOutput = await this.debounceHandleUpdateOutput(
          newStateCandidateInput,
          dataOutput,
          itemToUpdateGroup,
          itemToUpdateID
        );
      else
        newStateCandidateOutput = await this.handleUpdateOutput(
          newStateCandidateInput,
          dataOutput,
          itemToUpdateGroup,
          itemToUpdateID
        );

      newStateCandidateInput = await this.govBenefitsSync(
        newStateCandidateInput,
        newStateCandidateOutput
      );

      if (
        newStateCandidateInput.Presentations[0].overwriteProbate === false ||
        APPLET_EP
      ) {
        newStateCandidateInput = await this.probateSync(
          newStateCandidateInput,
          newStateCandidateOutput
        );
      }

      // if (this.state.SnapImport) this.setState({ SnapImport: false });

      if (saveToStorage !== false) this.debounceSaveToStorage();
      return {
        dataInput: newStateCandidateInput,
        dataOutput: newStateCandidateOutput,
      };
    } catch (error) {}
  };

  updateOutputData = async (
    newStateCandidateInput,
    newStateCandidateOutput
  ) => {
    if (true) {
      let dataGov;
      let dataPCV;
      let dataNeed;
      let dataShort;

      //    let hasSurivor = false;
      let aggregateGrid;

      /*       const spKey = APPLET_INA ? MEMBER.SPOUSE.Key : MEMBER.CLIENT.Key;
            let Survivor = this.state.dataInput.Clients.find(x => x.memberKey === spKey);
      
            if (Survivor !== undefined) {
              hasSurivor = true;
            }
       */
      const Survivor = newStateCandidateInput.Clients[this.survIdx]; //.find(x => x.memberKey === spKey);
      const Survivors = newStateCandidateInput.Clients.filter((item) => {
        return item.id > 1;
      });

      /* if (Survivor !== undefined) {
        hasSurivor = true;
      }
 */
      const insuranceNeeds = newStateCandidateOutput.dataInsuranceNeeds;
      const periodOption = newStateCandidateInput.Presentations[0].periodOption;

      const inputOutputIsValid =
        insuranceNeeds.length > 0 &&
        newStateCandidateOutput.dataNAAges !== undefined &&
        Survivor !== undefined;

      if (inputOutputIsValid) {
        const projYears = familyProjectionYears(
          newStateCandidateInput.Clients,
          periodOption,
          newStateCandidateOutput.lifeExpectancy,
          insuranceNeeds,
          newStateCandidateOutput.dataShortfall,
          newStateCandidateInput.Presentations[0]
        );
        const insNeed = projYears.insuranceNeed;
        const insNeedRet = projYears.insuranceNeedToRet;
        const insNeedLE = projYears.insuranceNeedToLE;
        const singleFamily = isSingleFamily(newStateCandidateInput.Clients);
        const noProjectYrs = projYears.noProjectionYrs;
        if (singleFamily) {
          // use years
          newStateCandidateOutput.dataNAAges = [];
          for (let i = 0; i < noProjectYrs; i++)
            newStateCandidateOutput.dataNAAges.push(i + 1);
        }

        dataGov = newStateCandidateOutput.dataCashFlowGov.slice(
          0,
          noProjectYrs
        );
        dataPCV = newStateCandidateOutput.dataCashFlowPersonal.slice(
          0,
          noProjectYrs
        );
        dataNeed = newStateCandidateOutput.dataCashFlowNeeds.slice(
          0,
          noProjectYrs
        );
        dataShort = newStateCandidateOutput.dataShortfall.slice(
          0,
          noProjectYrs
        );


        if (APPLET_INA) {
          aggregateGrid = await getINAGridData(
            insNeed,
            insNeedRet,
            insNeedLE,
            dataPCV,
            //  Survivor,
            Survivors,
            dataNeed,
            dataGov,
            dataShort,
            newStateCandidateInput.Presentations[0].inflation,
            newStateCandidateInput.Presentations[0].contribsGrowByInflation,
            newStateCandidateInput.Presentations[0].language,
            newStateCandidateInput.Presentations[0].invRate,
            newStateCandidateInput.Sources,
            newStateCandidateOutput.govBenefits.cppDB *
              (1 -
                newStateCandidateInput.Clients[QUOTE_CLIENT].avgTaxRate / 100)
          );
        } else if (APPLET_EP) {
          aggregateGrid = await getEPGridData(
            noProjectYrs,
            newStateCandidateInput,
            newStateCandidateOutput.dataNonTaxLiability
          );
        }
      }
      return aggregateGrid;
    }
  };

  switchClients = async () => {
    console.log(
      this.state.dataInput.Clients.find(
        (x) => x.memberKey === MEMBER.SPOUSE.Key
      )
    );
    if (
      this.state.dataInput.Clients.find(
        (x) => x.memberKey === MEMBER.SPOUSE.Key
      ) !== undefined
    ) {
      this.setState({ loading: true });

      const newState = await this.getSwitchClientsState();

      this.setState({ ...newState, loading: false });
    }
  };

  getSwitchClientsState = async () => {
    const { dataOutput, dataInput } = this.state;
    const newDataInput = cloneDeep(dataInput);
    const newDataOutput = cloneDeep(dataOutput);
    let client1 = newDataInput.Clients[QUOTE_CLIENT];
    newDataInput.Clients[QUOTE_CLIENT] = newDataInput.Clients[QUOTE_SPOUSE];
    newDataInput.Clients[QUOTE_SPOUSE] = client1;
    newDataInput.Assets.forEach((element) => {
      if (
        element.ownerKey === ASSET_OWNERSHIP_ACTION.CLIENT_LIQUIDATE.Key ||
        element.ownerKey === ASSET_OWNERSHIP_ACTION.CLIENT_ROLLOVER.Key
      ) {
        element.ownerKey = ASSET_OWNERSHIP_ACTION.SPOUSE.Key;
      } else if (element.ownerKey === ASSET_OWNERSHIP_ACTION.SPOUSE.Key) {
        element.ownerKey =
          element.assetTypeKey === ASSETS.LIFE_INSURANCE.Key
            ? ASSET_OWNERSHIP_ACTION.CLIENT_LIQUIDATE.Key
            : ASSET_OWNERSHIP_ACTION.CLIENT_ROLLOVER.Key;
      }
    });
    newDataInput.Liabilitys.forEach((element) => {
      if (element.ownerID === 0) {
        element.ownerID = QUOTE_SPOUSE + 1;
      }
    });

    newDataInput.Liabilitys.forEach((element) => {
      if (element.ownerID === QUOTE_CLIENT + 1) {
        element.ownerID = 0;
      }
      if (element.ownerID === QUOTE_SPOUSE + 1) {
        element.ownerID = QUOTE_CLIENT + 1;
      }
    });
    newDataInput.Liabilitys.forEach((element) => {
      if (element.ownerID === 0) {
        element.ownerID = QUOTE_SPOUSE + 1;
      }
    });

    // keep member
    newDataInput.Clients[QUOTE_CLIENT].memberKey = MEMBER.CLIENT.Key;
    if (newDataInput.Clients.length > 1)
      newDataInput.Clients[QUOTE_SPOUSE].memberKey = MEMBER.SPOUSE.Key;

    newDataInput.Clients[QUOTE_CLIENT].id = QUOTE_CLIENT + 1;
    if (newDataInput.Clients.length > 1)
      newDataInput.Clients[QUOTE_SPOUSE].id = QUOTE_SPOUSE + 1;

    const newState = await this.reSync_reCalculate_reRender(
      newDataInput,
      newDataOutput,
      COLLAPSIBLE_UPDATE_ALL, // to updateAll
      0,
      undefined,
      undefined,
      false
    );

    return newState;
  };

  handleUpdateAsset = async (asset) => {
    this.setState({ loading: true });
    const { dataInput, dataOutput } = this.state;
    let newDataInput = cloneDeep(dataInput);
    const newDataOutput = cloneDeep(dataOutput);
    if (asset.assetTypeKey === ASSETS.RRSP_RRIF.Key) {
      if (APPLET_EP) {
        if (
          asset.ownerKey === ASSET_OWNERSHIP_ACTION.SPOUSE.Key &&
          newDataInput.Clients.length === 1
        )
          asset.ownerKey = ASSET_OWNERSHIP_ACTION.CLIENT.Key; // if no spouse
        if (asset.assetTypeKey === ASSETS.RRSP_RRIF.Key) {
          if (asset.ownerKey !== ASSET_OWNERSHIP_ACTION.SPOUSE.Key)
            asset.ownerKey = ASSET_OWNERSHIP_ACTION.CLIENT.Key;
        }
      }
      asset = this.manageRRIFBounds(asset, newDataInput.Clients);
      newDataInput = this.addRRIFSource2(newDataInput, asset);
    }
    newDataInput.Assets[asset.id - 1] = asset;

    const newState = await this.reSync_reCalculate_reRender(
      newDataInput,
      newDataOutput,
      COLLAPSIBLE_ASSETS,
      asset.id
    );
    this.setState({ ...newState, loading: false });
  };

  manageRRIFBounds = (asset, clients) => {
    const age =
      asset.ownerKey === ASSET_OWNERSHIP_ACTION.SPOUSE.Key
        ? clients[QUOTE_SPOUSE].Age
        : clients[QUOTE_CLIENT].Age;
    if (asset.RRIFStartAge < age) asset.RRIFStartAge = age;
    else if (asset.RRIFStartAge > DEFAULT_RRIF_AGE)
      asset.RRIFStartAge = DEFAULT_RRIF_AGE;
    return asset;
  };

  handleUpdateLiability = async (liability, overwriteProbate) => {
    this.setState({ loading: true });
    let { dataInput, dataOutput } = this.state;
    const newDataInput = cloneDeep(dataInput);
    const newDataOutput = cloneDeep(dataOutput);
    newDataInput.Liabilitys[liability.id - 1] = liability;
    // alert(" NA" + "   " + overwriteProbate)
    if (overwriteProbate !== undefined && APPLET_INA) {
      newDataInput.Presentations[0].overwriteProbate = overwriteProbate;
    }

    const redoAll =
      liability.liabTypeKey === LIABILITIES.CHARITABLE_GIFTS.Key ||
      liability.liabTypeKey === LIABILITIES.PROBATE.Key
        ? true
        : false;

    // before updating state, resync, recalcuate, then update state to re_render
    let newState = await this.reSync_reCalculate_reRender(
      newDataInput,
      newDataOutput,
      redoAll ? COLLAPSIBLE_UPDATE_ALL : COLLAPSIBLE_LIABS, //updateAll if liab is charitable
      liability.id
    );

    this.setState({ ...newState, loading: false });
  };

  handleUpdateSource = async (source) => {
    this.setState({ loading: true });
    let { dataInput, dataOutput } = this.state;
    const newDataInput = cloneDeep(dataInput);
    const newDataOutput = cloneDeep(dataOutput);

    if (source.sourceTypeKey!==INCOMESOURCES.TAX_CREDIT.Key)
        source.growthRate=newDataInput.Presentations[0].inflation;
        
    console.log(source);

    newDataInput.Sources[source.id - 1] = source;

    // before updating state, resync, recalcuate, then update state to re_render
    const newState = await this.reSync_reCalculate_reRender(
      newDataInput,
      newDataOutput,
      COLLAPSIBLE_SOURCES,
      source.id
    );
    this.setState({ ...newState, loading: false, failedRemove: false });
  };

  handleUpdateNeed = async (need) => {
    this.setState({ loading: true });
    let { dataInput, dataOutput } = this.state;
    const newDataInput = cloneDeep(dataInput);
    const newDataOutput = cloneDeep(dataOutput);
    newDataInput.Needs[need.id - 1] = need;

    // before updating state, resync, recalcuate, then update state to re_render
    const newState = await this.reSync_reCalculate_reRender(
      newDataInput,
      newDataOutput,
      COLLAPSIBLE_NEEDS,
      need.id
    );
    this.setState({ ...newState, loading: false });

    //this.setState({ dataInput: data2 }, () => this.waitForSetStateCallback(0));
  };

  handleUpdatePresentation = async (presentation) => {
    this.setState({ loading: true });
    let { dataInput, dataOutput } = this.state;
    let newDataInput = cloneDeep(dataInput);
    const newDataOutput = cloneDeep(dataOutput);

    // update tax rate
    if (
      //init === true ||
      newDataInput.Presentations[0].provinceKey !== presentation.provinceKey
    ) {
      const tr = await getTaxRate(
        "PERSONAL_INCOME",
        presentation.provinceKey
        //convertProvince(presentation.provinceKey, this.state.dataInput.Presentations[0].language)
      );
      presentation.taxRate = (Math.round(tr * 10000) / 100).toFixed(4);
    }

    const redoAll = true; //presentation.taxRate !== newDataInput.Presentations[0].taxRate || presentation.inflation !== newDataInput.Presentations[0].inflation

    let debounce = false;
    if (
      newDataInput.Presentations[0].designedBy !== presentation.designedBy ||
      newDataInput.Presentations[0].designedFor !== presentation.designedFor ||
      newDataInput.Presentations[0].notes !== presentation.notes
    )
      debounce = true;

    newDataInput.Presentations[presentation.id - 1] = presentation;
    const newState = await this.reSync_reCalculate_reRender(
      newDataInput,
      newDataOutput,
      redoAll ? COLLAPSIBLE_UPDATE_ALL : COLLAPSIBLE_PRESENTATION, //updateAll if tax rate or inf rate change
      presentation.id
    );

    // before eupdating state, resync, recalcuate, update state to re_render
    this.setState({ ...newState, loading: false });
  };

  saveAsDefaultCase = (clear) => {
    //await this.checkAndCallInitialFetch();

    // save as default if needed

    const storageName = DEFAULT_QUOTE;
    if (clear) {
      localStorage.removeItem(storageName);
    } else {
      localStorage.setItem(storageName, JSON.stringify(this.state.dataInput));
    }
  };

  // this updates all and changes languge for all grids
  handleUpdatePresentationChange = async (presentation, noRecalc) => {
    if (noRecalc) {
      this.setState((prevState) => ({
        dataInput: {
          ...prevState.dataInput,
          Presentations: [
            {
              ...prevState.dataInput.Presentations[0],
              resultsOption: presentation.resultsOption,
              periodOption: presentation.periodOption,
            },
          ],
        },
      }));
    } else {
      this.setState({ loading: true });
      let { dataInput, dataOutput } = this.state;
      const newDataInput = cloneDeep(dataInput);
      const newDataOutput = cloneDeep(dataOutput);

      newDataInput.Presentations[0] = presentation;

      const newState = await this.reSync_reCalculate_reRender(
        newDataInput,
        newDataOutput,
        COLLAPSIBLE_RESULTS,
        0,
        false,
        false
      );

      // before eupdating state, resync, recalcuate, update state to re_render
      this.setState({ ...newState, loading: false });
    }
  };

  handleAddClient = async (client) => {
    this.setState({ loading: true });
    const { dataInput, dataOutput } = this.state;
    let newDataInput = cloneDeep(dataInput);
    const newDataOutput = cloneDeep(dataOutput);
    newDataInput.Clients.push(client);
    //if (client.memberKey === MEMBER.CHILD.Key)
    //newDataInput = this.manageAddingChild(newDataInput);
    // resync, recalcuate, then update state to re_render
    // if has salary, add source

    newDataInput = await this.manageAddingClientWithIncome(
      newDataInput,
      client
    );

    // adding a client to EP changes to JLTD and existing assets are affected

    const newState = await this.reSync_reCalculate_reRender(
      newDataInput,
      newDataOutput,
      APPLET_EP ? COLLAPSIBLE_UPDATE_ALL : COLLAPSIBLE_CLIENTS,
      APPLET_EP ? 0 : client.id
    );
    this.setState({ ...newState, loading: false });
    //this.setState({ dataInput: data2 }, () => this.manageAddingChild());
  };

  manageAddingChild = (input) => {
    input = this.manageEducation2(input);
    input = this.manageOrphan2(input);
    return input;
  };

  manageAddingClientWithIncome = async (newDataInput, client) => {
    let source = createDefaultSource(newDataInput.Sources.length + 1);
    source.amount = client.Income;
    source.duration = client.retirementAge - client.Age;
    source.ownerID = client.id;
    source.taxRate = client.avgTaxRate;
    newDataInput.Sources.push(source);

    return newDataInput;
  };

  manageRemovingClientWithIncome = async (dataInput) => {
    // remove all salaryPct sources and re-add
    dataInput.Sources = dataInput.Sources.filter(
      (item) => item.sourceTypeKey !== INCOMESOURCES.SURVIVORS_INCOME.Key
    );
    dataInput.Clients.forEach(async (element) => {
      if (element.memberKey !== MEMBER.CLIENT.Key) {
        dataInput = await this.manageAddingClientWithIncome(dataInput, element);
      }
    });

    return dataInput;
  };

  handleAddAsset = async (asset) => {
    this.setState({ loading: true });

    const { dataInput, dataOutput } = this.state;
    let newDataInput = cloneDeep(dataInput);
    let newDataOutput = cloneDeep(dataOutput);
    if (asset === undefined) {
      asset = createDefaultAsset(1);
      // single person
      if (newDataInput.Clients.length === 1)
        asset.ownerKey = ASSET_OWNERSHIP_ACTION.CLIENT_LIQUIDATE.Key;
    }

    //  dataInput.assetsNo++;
    newDataInput.Assets.push(asset);

    // resync, recalcuate, then update state to re_render
    const newState = await this.reSync_reCalculate_reRender(
      newDataInput,
      newDataOutput,
      COLLAPSIBLE_ASSETS,
      asset.id
    );
    this.setState({ ...newState, loading: false });

    /*     this.setState({ dataInput: dataInput, loading: true }, () =>
      this.waitForSetStateCallback(0) // no need to save to storage when default is added
    );
 */ //await this.updateProjection(asset)
  };

  updateProjection = async (asset) => {
    let dataInput = this.state.dataInput;

    const insuranceNeed =
      this.state.dataOutput.dataInsuranceNeeds[
        dataInput.Presentations[0].periodOption
      ].Value;
    let dataNA = await setUIDataToAPI(this.state.dataInput, insuranceNeed);
    dataInput.Assets[asset.id - 1].projection = await getAssetGridValues(
      dataNA,
      asset,
      this.state.dataInput.Presentations[0].language,
      false
    );

    this.setState({ dataInput: dataInput, loading: false });
  };

  handleAddLiability = async (Liab) => {
    this.setState({ loading: true });
    const { dataInput, dataOutput } = this.state;
    const newDataInput = cloneDeep(dataInput);
    const newDataOutput = cloneDeep(dataOutput);
    if (Liab === undefined) {
      Liab = {
        id: 1,
        //Type: LIABILITIES.LAST_EXPENSES.value["en"],
        liabTypeKey: LIABILITIES.LAST_EXPENSES.Key,
        ownerKey: OWNERSHIP.CLIENT.Key,
        currValue: 0,
        //growthDir: GROWTHDIR["en"].Values[0], //increases
        growthDirKey: GROWTHDIR.GROWS.Key, //increases
        growth: 0,
        repay: 0,
        exposureDur: 99,
        assetTaxLiabID: 0,
        assetTaxLiabProj: [],
      };
    }

    newDataInput.Liabilitys.push(Liab);

    // resync, recalcuate, then update state to re_render

    const newState = await this.reSync_reCalculate_reRender(
      newDataInput,
      newDataOutput,
      COLLAPSIBLE_LIABS,
      Liab.id
    );
    this.setState({ ...newState, loading: false });

    /*     this.setState({ dataInput: data2 }, () =>
      this.waitForSetStateCallback(0) // no need to save to storage when default is added
    ); */
  };

  handleAddAssetTaxCredit = (type) => {
    let data2 = this.state.dataInput;
    // check if already there
    let taxCredit = 0;
    this.state.dataInput.Liabilitys.forEach((element) => {
      if (element.liabTypeKey === LIABILITIES.CHARITABLE_GIFTS.Key) {
        taxCredit += element.currValue;
      }
    });

    taxCredit *= this.state.dataInput.Presentations[0].taxRate / 100;
    let exists = false;
    data2.Assets.forEach((element) => {
      if (element.assetTypeKey === type) {
        exists = true;
        if (Math.abs(element.currValue - taxCredit) > 1) {
          element.currValue = taxCredit;
          this.handleUpdateAsset(element);
        }
      }
    });
    if (taxCredit > 0 && exists === false) {
      const asset = createDefaultAsset(this.state.dataInput.Assets.length + 1); //assetsNo + 1)
      asset.assetTypeKey = ASSETS.CHARITABLE_GIFTS_TAX_CREDIT.Key;
      asset.ownerKey = ASSET_OWNERSHIP_ACTION.CLIENT_LIQUIDATE.Key;
      asset.assetTaxTypeKey = ASSET_TAX.NON_TAXABLE.Key;
      asset.currValue = taxCredit;
      asset.DisposeYr = 0;

      this.handleAddAsset(asset);
      this.openCollapsible[COLLAPSIBLE_ASSETS].open = COLLAPSIBLES_OPEN;
    }
  };

  handleAddAssetTaxCredit2 = (dataInput) => {
    // check if already there
    let taxCredit = 0;
    dataInput.Liabilitys.forEach((element) => {
      if (element.liabTypeKey === LIABILITIES.CHARITABLE_GIFTS.Key) {
        taxCredit += element.currValue;
      }
    });

    taxCredit *= dataInput.Presentations[0].taxRate / 100;
    let exists = false;
    dataInput.Assets.forEach((element) => {
      if (element.assetTypeKey === ASSETS.CHARITABLE_GIFTS_TAX_CREDIT.Key) {
        exists = true;
        if (Math.abs(element.currValue - taxCredit) > 1) {
          element.currValue = taxCredit;
          // this.handleUpdateAsset(element);
        }
      }
    });
    if (taxCredit > 0 && exists === false) {
      const asset = createDefaultAsset(dataInput.Assets.length + 1); //assetsNo + 1)
      asset.assetTypeKey = ASSETS.CHARITABLE_GIFTS_TAX_CREDIT.Key;
      asset.ownerKey = ASSET_OWNERSHIP_ACTION.CLIENT_LIQUIDATE.Key;
      asset.assetTaxTypeKey = ASSET_TAX.NON_TAXABLE.Key;
      asset.currValue = taxCredit;
      asset.DisposeYr = 0;

      dataInput.Assets.push(asset);
      this.openCollapsible[COLLAPSIBLE_ASSETS].open = COLLAPSIBLES_OPEN;
    }
    return dataInput;
  };

  handleAddSource = async (source) => {
    this.setState({ loading: true });
    const { dataInput, dataOutput } = this.state;
    let newDataInput = cloneDeep(dataInput);
    let newDataOutput = cloneDeep(dataOutput);
    if (source === undefined) {
      source = createDefaultSource();
    }

    // duration, growthRate,ownerID,taxRate depends on clients
    source.ownerID = 2; // spouse or 1st child if single family57
    source.duration = newDataInput.Sources[0].duration;
    source.growthRate = newDataInput.Presentations[0].inflation;
    source.taxRate =
      newDataInput.Clients.length > 1
        ? source.sourceTypeKey ===
          (INCOMESOURCES.TAX_CREDIT.Key || INCOMESOURCES.DIVIDEND_INCOME.Key)
          ? source.taxRate
          : newDataInput.Clients[1].avgTaxRate
        : newDataInput.Clients[0].avgTaxRate; // first survivor

    newDataInput.Sources.push(source);
    // resync, recalcuate, then update state to re_render
    const newState = await this.reSync_reCalculate_reRender(
      newDataInput,
      newDataOutput,
      COLLAPSIBLE_SOURCES,
      source.id
    );

    this.setState({ ...newState, loading: false, failedRemove: false });
  };

  handleAddNeed = async (nextKey, startYear, duration) => {
    if (nextKey === undefined) {
      nextKey = INCOMENEEDS.TEMPORARY_INCOME.Key;
      startYear = 0;
      duration = 10;
    }
    this.setState({ loading: true });
    const { dataInput, dataOutput } = this.state;
    const newDataInput = cloneDeep(dataInput);
    const newDataOutput = cloneDeep(dataOutput);

    const need = {
      id: newDataInput.Needs.length + 1, //needsNo,
      needTypeKey: nextKey,
      amount: 0,
      Percent: 0,
      startYear: startYear,
      duration: duration,
    };
    newDataInput.Needs.push(need);

    // resync, recalcuate, then update state to re_render
    const newState = await this.reSync_reCalculate_reRender(
      newDataInput,
      newDataOutput,
      COLLAPSIBLE_NEEDS,
      need.id
    );
    this.setState({ ...newState, loading: false });

    //    this.setState({ dataInput: data2 }, () => this.waitForSetStateCallback());
  };

  handleRemoveClient = async (id) => {
    if (this.OKToRemove) {
      this.setState({ loading: true });
      const { dataInput, dataOutput } = this.state;
      let newDataInput = cloneDeep(dataInput);
      const newDataOutput = cloneDeep(dataOutput);
      //   this.OKToRemove = false;

      // first remove source if child
      let cl = newDataInput.Clients.find((x) => x.id === id);

      if (cl !== undefined && cl.memberKey === MEMBER.CHILD.Key)
        newDataInput = await this.manageRemoveOrphan(newDataInput, cl.ownerID);

      newDataInput.Clients.splice(id - 1, 1);
      let i;
      newDataInput.Sources = newDataInput.Sources.filter((item) => {
        if (item.ownerID >= id) item.ownerID -= 1;
      });

      for (i = 1; i <= newDataInput.Clients.length; ++i) {
        newDataInput.Clients[i - 1].id = i;
      }
      newDataInput = await this.manageRemovingClientWithIncome(newDataInput);
      //data2.clientsNo = data2.Clients.length;
      let redoAll = false;

      if (newDataInput.Clients.length === 1) {
        // single person
        newDataInput = await this.setAssetActionToLiquidate(newDataInput);
        newDataInput = await this.setNeedsSinglePerson(newDataInput);
        redoAll = true;
      }
      // resync, recalcuate, then update state to re_render
      const newState = await this.reSync_reCalculate_reRender(
        newDataInput,
        newDataOutput,
        redoAll ? COLLAPSIBLE_UPDATE_ALL : COLLAPSIBLE_CLIENTS,
        id
      );
      this.setState({ ...newState, loading: false });
    }
  };

  handleRemoveAsset = async (id) => {
    if (this.OKToRemove) {
      //  this.OKToRemove = false;

      this.setState({ loading: true });
      const { dataInput, dataOutput } = this.state;
      let newDataInput = cloneDeep(dataInput);
      const newDataOutput = cloneDeep(dataOutput);

      // remove RRIF
      if (newDataInput.Assets[id - 1].assetTypeKey === ASSETS.RRSP_RRIF.Key)
        newDataInput = this.removeRRIFSource(newDataInput);

      newDataInput.Assets.splice(id - 1, 1);
      newDataOutput.assetProjections.splice(id - 1, 1);
      let i;
      for (i = 1; i <= newDataInput.Assets.length; ++i) {
        newDataInput.Assets[i - 1].id = i;
        newDataOutput.assetProjections[i - 1].id = i;
      }

      // resync, recalcuate, then update state to re_render
      // removing asset redoes ids need to do all grids
      const newState = await this.reSync_reCalculate_reRender(
        newDataInput,
        newDataOutput,
        COLLAPSIBLE_UPDATE_ALL,
        0
        //COLLAPSIBLE_ASSETS,
        //id
      );
      this.setState({ ...newState, loading: false });
    }
  };

  handleRemoveLiability = async (id) => {
    if (this.OKToRemove) {
      // this.OKToRemove = false;

      this.setState({ loading: true });
      const { dataInput, dataOutput } = this.state;
      const newDataInput = cloneDeep(dataInput);
      const newDataOutput = cloneDeep(dataOutput);
      // if charit remove corresp asset
      const charit = newDataInput.Liabilitys.filter(
        (liab) =>
          liab.liabTypeKey === LIABILITIES.CHARITABLE_GIFTS.Key &&
          liab.id === id
      );
      if (charit !== undefined && charit.length > 0) {
        const charitAsset = newDataInput.Assets.filter(
          (asset) =>
            asset.assetTypeKey === ASSETS.CHARITABLE_GIFTS_TAX_CREDIT.Key
        );
        if (charitAsset !== undefined && charitAsset.length > 0) {
          newDataInput.Assets = newDataInput.Assets.filter(
            (asset) =>
              asset.assetTypeKey !== ASSETS.CHARITABLE_GIFTS_TAX_CREDIT.Key
          );
          let i;
          for (i = 1; i <= newDataInput.Assets.length; ++i) {
            newDataInput.Assets[i - 1].id = i;
            newDataOutput.assetProjections[i - 1].id = i;
          }
        }
      }

      newDataInput.Liabilitys.splice(id - 1, 1);
      let i;
      for (i = 1; i <= newDataInput.Liabilitys.length; ++i) {
        newDataInput.Liabilitys[i - 1].id = i;
      }

      // resync, recalcuate, then update state to re_render
      const newState = await this.reSync_reCalculate_reRender(
        newDataInput,
        newDataOutput,
        COLLAPSIBLE_LIABS,
        id
      );
      this.setState({ ...newState, loading: false });
    }
  };

  handleRemoveSource = async (id) => {
    if (this.OKToRemove) {
      //  this.OKToRemove = false;

      let failedRemove = false;
      this.setState({ loading: true });
      const { dataInput, dataOutput } = this.state;
      const newDataInput = cloneDeep(dataInput);
      const newDataOutput = cloneDeep(dataOutput);
      let i;
      //this.failedRemove=false
      for (i = 0; i < newDataInput.Sources.length; ++i) {
        if (
          newDataInput.Sources[i].id === id &&
          (newDataInput.Sources[i].sourceTypeKey ===
            INCOMESOURCES.GOV_SURVIVORS_PENSION.Key ||
            newDataInput.Sources[i].sourceTypeKey ===
              INCOMESOURCES.GOV_DEATH_BENEFIT.Key ||
            newDataInput.Sources[i].sourceTypeKey ===
              INCOMESOURCES.GOV_ORPHANS_BENEFIT.Key)
        )
          failedRemove = true;
      }
      //this.setState({ failedRemove: failedRemove})

      this.setState((prevState) => ({
        failedRemove: prevState.failedRemove === true ? false : failedRemove,
      }));

      if (failedRemove === false) {
        newDataInput.Sources.splice(id - 1, 1);
        for (i = 1; i <= newDataInput.Sources.length; ++i) {
          newDataInput.Sources[i - 1].id = i;
        }
        //dataInput.sourcesNo = dataInput.Sources.length;

        // resync, recalcuate, then update state to re_render
        const newState = await this.reSync_reCalculate_reRender(
          newDataInput,
          newDataOutput,
          COLLAPSIBLE_SOURCES,
          id
        );
        this.setState({ ...newState, loading: false });
      }
    }
  };

  handleRemoveNeed = async (id) => {
    if (this.OKToRemove) {
      // this.OKToRemove = false;

      this.setState({ loading: true });
      const { dataInput, dataOutput } = this.state;
      const newDataInput = cloneDeep(dataInput);
      const newDataOutput = cloneDeep(dataOutput);
      newDataInput.Needs.splice(id - 1, 1);
      let i;
      for (i = 1; i <= newDataInput.Needs.length; ++i) {
        newDataInput.Needs[i - 1].id = i;
      }

      // resync, recalcuate, then update state to re_render
      const newState = await this.reSync_reCalculate_reRender(
        newDataInput,
        newDataOutput,
        COLLAPSIBLE_NEEDS,
        id
      );
      this.setState({ ...newState, loading: false });
    }
  };

  addRRIFSource = (asset) => {
    const existingRRIF = this.state.dataInput.Sources.find(
      (x) => x.sourceTypeKey === INCOMESOURCES.RRIF.Key
    );
    // this is done based on asset in API. this display only

    if (existingRRIF === undefined) {
      const sourceRRIF = {
        id: this.state.dataInput.Sources.length + 1,
        sourceTypeKey: INCOMESOURCES.RRIF.Key,
        amount: 0,
        startYear: asset.RRIFStartAge,
        duration: 99,
        ownerID: 2,
        taxRate: 0,
        growthRate: 0,
      };

      this.handleAddSource(sourceRRIF);
    } else {
      existingRRIF.startYear = asset.RRIFStartAge;
      this.handleUpdateSource(existingRRIF);
    }
  };

  addRRIFSource2 = (dataInput, asset) => {
    const existingRRIF = dataInput.Sources.find(
      (x) => x.sourceTypeKey === INCOMESOURCES.RRIF.Key
    );
    // this is done based on asset in API. this display only

    if (existingRRIF === undefined) {
      const sourceRRIF = {
        id: this.state.dataInput.Sources.length + 1,
        sourceTypeKey: INCOMESOURCES.RRIF.Key,
        amount: 0,
        startYear: asset.RRIFStartAge,
        duration: 99,
        ownerID: 2,
        taxRate: 0,
        growthRate: 0,
      };

      // do it right here
      dataInput.Sources.push(sourceRRIF);

      //dataInput = this.handleAddSource(sourceRRIF);
    } else {
      existingRRIF.startYear = asset.RRIFStartAge;
      // do it right here
      dataInput.Sources[existingRRIF.id - 1] = existingRRIF;
    }

    return dataInput;
  };

  removeRRIFSource = (dataInput) => {
    const existingRRIF = dataInput.Sources.find(
      (x) => x.sourceTypeKey === INCOMESOURCES.RRIF.Key
    );
    // this is done based on asset in API. this display only

    if (existingRRIF !== undefined) {
      const id = existingRRIF.id;
      dataInput.Sources.splice(id - 1, 1);
    }

    return dataInput;
  };

  copyPresentation = () => {
    return JSON.parse(JSON.stringify(this.state.dataInput.Presentations[0]));
  };

  changeLang = () => {
    //await this.checkAndCallInitialFetch();

    let pres = this.copyPresentation();
    pres.language = pres.language === "en" ? "fr" : "en";
    const noRecalc = false;

    this.handleUpdatePresentationChange(pres, noRecalc);
    // close all
    let i;
    for (i = 0; i < COLLAPSIBLES_COUNT; ++i) {
      this.openCollapsible[i].open = COLLAPSIBLES_CLOSED;
    }
  };

  debounceSaveToStorage = debounce(
    () => {
      return this.saveToStorage();
    },
    waitTime,
    { leading: false, trailing: true }
  );

  areThereChildren = () => {
    let Children = this.state.dataInput.Clients.find(
      (x) => x.memberKey === MEMBER.CHILD.Key
    );
    if (Children !== undefined) return true;
    else return false;
  };

  manageEducation = () => {
    let Children = this.state.dataInput.Clients.find(
      (x) => x.memberKey === MEMBER.CHILD.Key
    );
    if (Children !== undefined) {
      let eduFunds = this.state.dataInput.Needs.find(
        (x) => x.needTypeKey === INCOMENEEDS.EDUCATION_FUND.Key
      );
      if (eduFunds === undefined)
        this.handleAddNeed(
          INCOMENEEDS.EDUCATION_FUND.Key,
          Math.max(0, UNIVERSITY_START_AGE - Children.Age),
          Math.min(4, Math.max(0, UNIVERSITY_END_AGE - Children.Age))
        );
    }
  };

  manageEducation2 = (input) => {
    let Children = input.Clients.find((x) => x.memberKey === MEMBER.CHILD.Key);
    if (Children !== undefined) {
      let eduFunds = input.Needs.find(
        (x) => x.needTypeKey === INCOMENEEDS.EDUCATION_FUND.Key
      );
      if (eduFunds === undefined)
        input.Needs.push({
          id: input.Needs.length + 1, //needsNo,
          needTypeKey: INCOMENEEDS.EDUCATION_FUND.Key,
          amount: 0,
          Percent: 0,
          startYear: Math.max(0, UNIVERSITY_START_AGE - Children.Age),
          duration: Math.min(4, Math.max(0, UNIVERSITY_END_AGE - Children.Age)),
        });
    }
    return input;
  };

  manageOrphan2 = (input) => {
    const childMember = MEMBER.CHILD.Key;
    //const orphanBen = INCOMESOURCES.GOV_ORPHANS_BENEFIT.value[this.state.dataInput.Presentations[0].language];
    const orphanBen = INCOMESOURCES.GOV_ORPHANS_BENEFIT.Key;
    let Children = input.Clients.filter(function (item) {
      return item.memberKey === childMember;
    });
    let orphSources = input.Sources.filter(function (item) {
      return item.sourceTypeKey === orphanBen;
    });

    let maxDur =
      input.Presentations[0].provinceKey === "QC"
        ? MAX_ORPHAN_DUR_QC
        : MAX_ORPHAN_DUR_NON_QC;
    let orphAge =
      input.Presentations[0].provinceKey === "QC"
        ? ORPHAN_AGE_QC
        : ORPHAN_AGE_NON_QC;

    if (Children.length > 0) {
      Children.forEach((element) => {
        if (
          element.Age <= orphAge &&
          orphSources.filter((item) => {
            return item.ownerID === element.id;
          }).length === 0
        ) {
          const source = {
            id: input.Sources.length + 1, //sourcesNo + 1,
            sourceTypeKey: orphanBen,
            amount: this.state.dataOutput.govBenefits.cppOrphan,
            startYear: 0,
            duration: maxDur - element.Age,
            ownerID: element.id,
          };
          // no elig jan 2019 this.handleAddSource(orphanBen,this.orphan * this.state.dataInput.Clients[QUOTE_CLIENT].Eligibility / 100,25-element.Age,element.id, 1);
          input.Sources.push(source);

          //this.handleAddSource(source);
        }
      });
    } else orphSources = [];

    return input;
  };

  setAssetActionToLiquidate = async (dataInput) => {
    dataInput.Assets.forEach((element) => {
      element.ownerKey = ASSET_OWNERSHIP_ACTION.CLIENT_LIQUIDATE.Key;
      element.DisposeYr = 0;
    });
    return dataInput;
  };

  setNeedsSinglePerson = async (dataInput) => {
    dataInput.Needs.pop();
    return dataInput;
  };

  manageOrphanSync = async (dataInput, dataOutput) => {
    const childMember = MEMBER.CHILD.Key;
    //const orphanBen = INCOMESOURCES.GOV_ORPHANS_BENEFIT.value[this.state.dataInput.Presentations[0].language];
    const orphanBen = INCOMESOURCES.GOV_ORPHANS_BENEFIT.Key;

    let sources = dataInput.Sources;

    let orphSources = sources.filter(function (item) {
      return item.sourceTypeKey === orphanBen;
    });

    let Children = dataInput.Clients.filter(function (item) {
      return item.memberKey === childMember;
    });

    let sourcesNo = sources.length;
    let maxDur =
      dataInput.Presentations[0].provinceKey === "QC"
        ? MAX_ORPHAN_DUR_QC
        : MAX_ORPHAN_DUR_NON_QC;
    let orphAge =
      dataInput.Presentations[0].provinceKey === "QC"
        ? ORPHAN_AGE_QC
        : ORPHAN_AGE_NON_QC;

    let setChildIDs = new Set();
    if (Children.length > 0) {
      Children.forEach((element) => {
        setChildIDs.add(element.id);
        sourcesNo = sources.length;
        if (
          element.Age <= orphAge &&
          orphSources.filter((item) => {
            return (
              item.ownerID === element.id && item.sourceTypeKey === orphanBen
            );
          }).length === 0
        ) {
          /* let childID=orphSourcesIDs.length>0?orphSourcesIDs[0]:sources.length + 1
          if(orphSourcesIDs.length>0)orphSourcesIDs=orphSourcesIDs.shift(); */
          const source = {
            id: sourcesNo + 1,
            sourceTypeKey: orphanBen,
            amount: dataOutput.govBenefits.cppOrphan,
            startYear: 0,
            duration: maxDur - element.Age,
            ownerID: element.id,
          };
          // no elig jan 2019 this.handleAddSource(orphanBen,this.orphan * this.state.dataInput.Clients[QUOTE_CLIENT].Eligibility / 100,25-element.Age,element.id, 1);
          sources.push(source);
        } // exists but needs adj
        else {
          sources.forEach((source) => {
            if (
              source.sourceTypeKey === orphanBen &&
              source.ownerID === element.id
            )
              source.amount = dataOutput.govBenefits.cppOrphan;
          });
        }
      });
      /*  for (let i = 1; i <= sources.length; ++i) {
        sources[i - 1].id = i; 
      }*/
    } else dataInput = await this.manageRemoveOrphan(dataInput);

    sources = sources.filter((item) => {
      return (
        item.sourceTypeKey !== orphanBen ||
        (setChildIDs.has(item.ownerID) && item.sourceTypeKey === orphanBen)
      );
    });

    dataInput.Sources = sources;
    return dataInput;
  };

  manageRemoveOrphan = async (input, childID) => {
    //const orphanBen = INCOMESOURCES.GOV_ORPHANS_BENEFIT.value[this.state.dataInput.Presentations[0].language];
    const orphanBen = INCOMESOURCES.GOV_ORPHANS_BENEFIT.Key;
    input.Sources = input.Sources.filter(function (item) {
      if (childID === undefined)
        // remove all
        return !(item.sourceTypeKey === orphanBen);
      else
        return !(item.ownerID === childID && item.sourceTypeKey === orphanBen);
    });
    let i;

    //input.Sources.splice(orphSource.id - 1, 1);
    for (i = 1; i <= input.Sources.length; ++i) {
      input.Sources[i - 1].id = i;
    }

    return input;
  };

  updateDataLang = () => {
    this.openParent = false;
    this.openForce = false;
  };

  getAfterTaxTotalIncome = (newStateCandidateInput) => {
    let totalATaxIncome = 0;
    for (let i = 0; i < newStateCandidateInput.Clients.length; i++)
      totalATaxIncome +=
        newStateCandidateInput.Clients[i].Income *
        (1 - newStateCandidateInput.Clients[i].avgTaxRate / 100);

    return totalATaxIncome;
  };

  setSurivorIndex = () => {
    const spKey = APPLET_INA ? MEMBER.SPOUSE.Key : MEMBER.CLIENT.Key;
    let Survivor = this.state.dataInput.Clients.find(
      (x) => x.memberKey === spKey
    );

    if (Survivor === undefined && APPLET_INA) {
      if (this.state.dataInput.Clients.length === 1)
        Survivor = this.state.dataInput.Clients.find(
          (x) => x.memberKey === MEMBER.CLIENT.Key
        );
      else {
        Survivor = this.state.dataInput.Clients.find(
          (x) => x.memberKey === MEMBER.DEPENDENT_ADULT.Key
        );
        if (Survivor === undefined)
          Survivor = this.state.dataInput.Clients.find(
            (x) => x.memberKey === MEMBER.CHILD.Key
          );
      }
    }

    return Survivor.id - 1; // id is 1-based
  };

  setSurivorIndex2 = (newStateCandidateInput) => {
    const spKey = APPLET_INA ? MEMBER.SPOUSE.Key : MEMBER.CLIENT.Key;
    let Survivor = newStateCandidateInput.Clients.find(
      (x) => x.memberKey === spKey
    );

    if (Survivor === undefined && APPLET_INA) {
      if (newStateCandidateInput.Clients.length === 1)
        Survivor = newStateCandidateInput.Clients.find(
          (x) => x.memberKey === MEMBER.CLIENT.Key
        );
      else {
        Survivor = newStateCandidateInput.Clients.find(
          (x) => x.memberKey === MEMBER.DEPENDENT_ADULT.Key
        );
        if (Survivor === undefined)
          Survivor = newStateCandidateInput.Clients.find(
            (x) => x.memberKey === MEMBER.CHILD.Key
          );
      }
    }

    return Survivor.id - 1; // id is 1-based
  };

  syncPanelsValues2 = (newStateCandidateInput, itemToUpdateGroup, doAlert) => {
    // EP dosent have needs and sources to sync

    
    let needsDur = false;
    let sourcesDur = false;
    let needsAmt = false;
    let sourcesAmt = false;

    this.survIdx = this.setSurivorIndex2(newStateCandidateInput);
    let protectionPeriod =
      newStateCandidateInput.Clients[this.survIdx].retirementAge -
      newStateCandidateInput.Clients[this.survIdx].Age;
    const singleFamily = isSingleFamily(newStateCandidateInput.Clients);
    if (singleFamily) {
      const yrs = singleFamilyProjectionYears(newStateCandidateInput.Clients);
      protectionPeriod = yrs.noProjectionYrs;
    }

    // NOTE: not written to state yet so check potential changes
    let curDurBeforeUpdate=0;
    try {
      if (singleFamily) {
        curDurBeforeUpdate= singleFamilyProjectionYears(this.state.dataInput.Clients).noProjectionYrs;
      } 
      else
          curDurBeforeUpdate=this.state.dataInput.Clients[this.survIdx].retirementAge-this.state.dataInput.Clients[this.survIdx].Age
        
    } catch (error) {
      
    }
    

    newStateCandidateInput = this.handleAddAssetTaxCredit2(
      newStateCandidateInput
    );

    if (APPLET_INA) {
      if (this.survIdx !== -1) {
        let i;
        for (i = 0; i < newStateCandidateInput.Needs.length; i++) {
          const needPercent = parseInt(
            (newStateCandidateInput.Needs[i].Percent / 100) *
              this.getAfterTaxTotalIncome(newStateCandidateInput)
          );

          const dur = protectionPeriod;

          console.log(
            newStateCandidateInput.Needs[i].duration,
            newStateCandidateInput.Needs,
            this.state.dataInput.Needs
          );
          //const dur = 100 - newStateCandidateInput.Clients[this.survIdx].Age;
          if (
            this.caseFromFile === false &&
            itemToUpdateGroup !== COLLAPSIBLE_RESULTS && // dont change if clicking on results
            newStateCandidateInput.Needs[i].needTypeKey ===
              INCOMENEEDS.PERCET_OF_INCOME.Key /* &&
            newStateCandidateInput.Clients.length !== 1 */ // not for single person
          ) {
            if (
              needPercent !== newStateCandidateInput.Needs[i].amount &&
              newStateCandidateInput.Needs[i].Percent >= 0
            ) {
              newStateCandidateInput.Needs[i].amount = needPercent;
              needsAmt = true;
            }

            if (
              itemToUpdateGroup !== COLLAPSIBLE_NEEDS &&
              newStateCandidateInput.Clients.length !== 1
            ) {
              // change duration of % of income
              // adjust it if it is the default based on old age and retAge, ie it is not a delibrate input duration
      
              if (
                (newStateCandidateInput.Needs[i].duration===curDurBeforeUpdate && dur !==curDurBeforeUpdate && curDurBeforeUpdate>0 &&
                  dur > 0)
              ) {
                newStateCandidateInput.Needs[i].duration = dur;
                needsDur = true;
              }
              if (
                newStateCandidateInput.Needs[i].duration === 100 &&
                dur > 0 &&
                newStateCandidateInput.Needs[i].startYear !== dur
              ) {
                newStateCandidateInput.Needs[i].startYear = dur;
              }
            }
          }

          if (
            this.caseFromFile === false &&
            newStateCandidateInput.Needs[i].needTypeKey ===
              INCOMENEEDS.EDUCATION_FUND.Key
          ) {
            let children = newStateCandidateInput.Clients.find(
              (x) => x.memberKey === MEMBER.CHILD.Key
            );
            if (children !== undefined) {
              if (
                newStateCandidateInput.Needs[i].startYear !==
                  Math.max(0, UNIVERSITY_START_AGE - children.Age) &&
                children.length > 0
              ) {
                newStateCandidateInput.Needs[i].startYear = Math.max(
                  0,
                  UNIVERSITY_START_AGE - children.Age
                );
                newStateCandidateInput.Needs[i].duration = Math.max(
                  0,
                  Math.min(4, UNIVERSITY_END_AGE - children.Age)
                );
                needsDur = true;
              }
            }
          }
        }

        for (i = 0; i < newStateCandidateInput.Sources.length; i++) {
          // all at income tax except divdend & tax cred
          if (
            newStateCandidateInput.Sources[i].sourceTypeKey !==
              INCOMESOURCES.DIVIDEND_INCOME.Key &&
            newStateCandidateInput.Sources[i].sourceTypeKey !==
              INCOMESOURCES.TAX_CREDIT.Key
          )
            newStateCandidateInput.Sources[i].taxRate =
              newStateCandidateInput.Clients[this.survIdx].avgTaxRate; // spouse

          // adjust deductible tax rate if marg tax rate changes. Amount*(1-1-txrate)=refund, so as if tax rate is 1-margTaxrate
          if (
            newStateCandidateInput.Sources[i].sourceTypeKey ===
            INCOMESOURCES.TAX_CREDIT.Key
          )
            newStateCandidateInput.Sources[i].taxRate =0;
              /* 100 - newStateCandidateInput.Presentations[0].taxRate; */

          // allow a different surv income dur if they input directly
          if (
            this.caseFromFile === false &&
            itemToUpdateGroup !== COLLAPSIBLE_SOURCES &&
            itemToUpdateGroup !== COLLAPSIBLE_RESULTS
          ) {
            const dur = protectionPeriod;
            if (
              newStateCandidateInput.Sources[i].sourceTypeKey ===
                INCOMESOURCES.SURVIVORS_INCOME.Key &&
              newStateCandidateInput.Sources[i].startYear === 0 &&              
              newStateCandidateInput.Sources[i].duration===curDurBeforeUpdate && dur !==curDurBeforeUpdate && curDurBeforeUpdate>0 &&
              
              dur > 0
            ) {
              newStateCandidateInput.Sources[i].duration = dur;
              sourcesDur = true;
            }
          }

          if (newStateCandidateInput.Sources[i].ownerID === undefined)
            newStateCandidateInput.Sources[i].ownerID =
              newStateCandidateInput.Clients.length === 1 ? 1 : 2; // first surv
          // allow a different surv income if they input directly
          if (newStateCandidateInput.Clients.length > 1) {
            //!singleFamily){
            if (
              this.caseFromFile === false &&
              itemToUpdateGroup !== COLLAPSIBLE_SOURCES &&
              itemToUpdateGroup !== COLLAPSIBLE_RESULTS &&
              newStateCandidateInput.Sources[i].ownerID - 1 > 0
            ) {
              if (
                newStateCandidateInput.Sources[i].sourceTypeKey ===
                  INCOMESOURCES.SURVIVORS_INCOME.Key &&
                newStateCandidateInput.Sources[i].amount !==
                  parseInt(
                    newStateCandidateInput.Clients[
                      newStateCandidateInput.Sources[i].ownerID - 1
                    ].Income
                  )
              ) {
                newStateCandidateInput.Sources[i].amount = parseInt(
                  newStateCandidateInput.Clients[
                    newStateCandidateInput.Sources[i].ownerID - 1
                  ].Income
                );
                sourcesAmt = true;
              }
            }
          }
        }
      } else {
        let i;
        for (i = 0; i < newStateCandidateInput.Needs.length; i++) {
          if (
            newStateCandidateInput.Needs[i].needTypeKey ===
            INCOMENEEDS.PERCET_OF_INCOME.Key
          )
            newStateCandidateInput.Needs[i].amount = 0;
        }
        //let newStateCandidateInput = newStateCandidateInput;
        for (i = 0; i < newStateCandidateInput.Sources.length; i++) {
          if (
            newStateCandidateInput.Sources[i].sourceTypeKey ===
            INCOMESOURCES.GOV_SURVIVORS_PENSION.Key
          )
            newStateCandidateInput.Sources[i].amount = 0;
          else if (
            newStateCandidateInput.Sources[i].sourceTypeKey ===
            INCOMESOURCES.GOV_DEATH_BENEFIT.Key
          )
            newStateCandidateInput.Sources[i].amount = 0;
          else if (
            newStateCandidateInput.Sources[i].sourceTypeKey ===
            INCOMESOURCES.GOV_ORPHANS_BENEFIT.Key
          )
            newStateCandidateInput.Sources[i].amount = 0;
          else if (
            newStateCandidateInput.Sources[i].sourceTypeKey ===
            INCOMESOURCES.SURVIVORS_INCOME.Key
          )
            newStateCandidateInput.Sources[i].amount = 0;
        }
        this.OKToRemove = true;
      }
    }

    let msg = "";
    const lang = newStateCandidateInput.Presentations[0].language;
    if (lang === "en") {
      if (sourcesAmt || sourcesDur) msg = "'Sources of Income'";
      if (sourcesAmt && sourcesDur) msg += " amounts and durations";
      else if (sourcesAmt && needsAmt === false) msg += " amounts";
      else if (sourcesDur && needsDur === false) msg += " durations";
      if (msg !== "" && (needsAmt || needsDur)) msg += ", and ";

      if (needsAmt || needsDur) msg += "'Income Needs' ";
      if (needsAmt && needsDur) msg += " amounts and durations";
      else if (needsAmt) msg += " amounts ";
      else if (needsDur) msg += " durations ";

      if (msg !== "") msg += " were adjusted";
    } else {
      if (sourcesDur || needsDur) msg = "les durées de ";
      else if (sourcesAmt || needsAmt) msg = "les montants de ";
      if (sourcesAmt || sourcesDur) msg += "'Sources de revenus'";

      if ((sourcesAmt && needsAmt) || (needsDur && sourcesDur)) msg += " et ";
      if (needsAmt || needsDur) msg += "'Besoins de revenu'";
      if (msg !== "") msg += " étaient ajusté";
    }
    if (doAlert === false) msg = ""; // in case of Switch after PDF

    this.setState({ showPopupMessage: msg });

    return newStateCandidateInput;
  };

  setRates = () => {
    let dataE = {
      investmentRate: this.state.dataInput.Presentations[0].invRate / 100,
      taxRate: this.state.dataInput.Presentations[0].taxRate / 100,
      dividendTaxRate: 0.33,
      capitalGainsInclusion: 0.5,
      inflationRate: this.state.dataInput.Presentations[0].inflation / 100,
    };

    return dataE;
  };

  loadStorage = () => {
    //await this.checkAndCallInitialFetch();

    let storageKey = APPLET_INA ? "INAData" : "EPData";

    const objJSONData = JSON.parse(localStorage.getItem(storageKey));
    this.updateStateFromJSon(objJSONData);
  };

  updateStateFromJSon = async (objJSONData) => {
    if (objJSONData !== null && objJSONData !== undefined) {
      // put loaded data to quote and show

      this.setState({ loading: true });
      //  console.log(objJSONData)
      this.caseFromFile = true;
      const { dataOutput } = this.state;
      const newDataOutput = cloneDeep(dataOutput);
      const newState = await this.reSync_reCalculate_reRender(
        objJSONData,
        newDataOutput,
        COLLAPSIBLE_UPDATE_ALL, // to updateAll
        0
      );
      this.setState({ ...newState, loading: false, initialLoading: false });
    } //this.updateStateInput(objJSONData, () => this.waitForSetStateCallback());
    this.caseFromFile = false;
  };

  saveToStorage = () => {
    // in case we need to clear all
    // localStorage.clear();
    localStorage.setItem(
      APPLET_INA ? "INAData" : "EPData",
      JSON.stringify(this.state.dataInput)
    );

    // no recovery anymore
    this.showRecover = 0;
    hideRecover();
  };

  loadFromFile = (e) => {
    // await this.checkAndCallInitialFetch();

    const fileTarget = e.target.files[0];
    if (!fileTarget) {
      return;
    }
    this.setState({ loading: true });

    // close all
    let i;
    for (i = 0; i < COLLAPSIBLES_COUNT; ++i) {
      this.openCollapsible[i].open = COLLAPSIBLES_CLOSED;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      let contentsFile = e.target.result;
      var objJSONData;
      // is this a non-encrypted file
      const encrptedSave =
        contentsFile.search("dataInput") > 0 ||
        versionDetails().saveEncrypt === false
          ? false
          : true;

      if (encrptedSave === true) {
        // file is saved a s querystring
        this.handleInitilizeQuoteFromQueryString(contentsFile);
      } else {
        // name changes
        contentsFile = contentsFile.split("Amount").join("amount");
        contentsFile = contentsFile.split("StartYr").join("startYear");
        contentsFile = contentsFile.split("Duration").join("duration");
        contentsFile = contentsFile
          .split("" + "Tax" + "")
          .join("" + "avgTaxRate" + "");
        contentsFile = contentsFile.split("retireAge").join("retirementAge");

        objJSONData = JSON.parse(contentsFile);
        objJSONData.dataPresentations.Presentations[0].presentationDate =
          new Date();

        // old files
        objJSONData.dataInput.Clients.forEach(function (element) {
          if (element.sexKey == undefined) {
            element.sexKey = getListItemKeyFromName(SEX, element.Sex);
            delete element.Sex;
          }
        });
        // old files
        objJSONData.dataInput.Clients.forEach(function (element) {
          if (element.smokerKey == undefined) {
            element.smokerKey = getListItemKeyFromName(SMOKING, element.Smoker);
            delete element.Smoker;
          }
        });
        // old files
        objJSONData.dataInput.Clients.forEach(function (element) {
          if (element.memberKey == undefined) {
            element.memberKey = getListItemKeyFromName(MEMBER, element.member);
            delete element.member;
          }
        });

        // old files
        objJSONData.dataInput.Assets.forEach(function (element) {
          if (element.assetTypeKey == undefined) {
            element.assetTypeKey = getListItemKeyFromName(ASSETS, element.Type);
            delete element.Type;
          }
        });
        // old files
        objJSONData.dataInput.Assets.forEach(function (element) {
          if (element.assetTaxTypeKey == undefined) {
            element.assetTaxTypeKey = getListItemKeyFromName(
              ASSET_TAX,
              element.Tax
            );
            delete element.Tax;
          }
        });

        // old files
        objJSONData.dataInput.Assets.forEach(function (element) {
          if (element.ownerKey == undefined) {
            element.ownerKey = ASSET_OWNERSHIP_ACTION.CLIENT_LIQUIDATE.Key;
          }
        });

        // old files note change in spelling
        objJSONData.dataInput.Liabilitys.forEach(function (element) {
          if (element.liabTypeKey == undefined) {
            element.liabTypeKey = getListItemKeyFromName(
              LIABILITIES,
              element.Type
            );
            delete element.Type;
          }
        });

        // old files
        objJSONData.dataInput.Sources.forEach(function (element) {
          if (element.sourceTypeKey == undefined) {
            element.sourceTypeKey = getListItemKeyFromName(
              INCOMESOURCES,
              element.Type
            );
            delete element.Type;
          }
        });

        // old files
        objJSONData.dataInput.Needs.forEach(function (element) {
          if (element.needTypeKey == undefined) {
            element.needTypeKey = getListItemKeyFromName(
              INCOMENEEDS,
              element.Type
            );
            delete element.Type;
          }
        });

        // old files
        objJSONData.dataInput.Presentations.forEach(function (element) {
          if (element.provinceKey == undefined) {
            element.provinceKey = getListItemKeyFromName(
              PROVINCE,
              element.Province
            );
            delete element.Province;
          }
        });
        this.updateStateFromJSon(objJSONData);
      }
    };
    reader.readAsText(fileTarget);
    this.setState({ loading: false });
  };

  respondToLogoutRequest = (OK) => {
    this.setState({ showLogout: false });
    window.parent.postMessage("TOKEN_FAILED_" +
    this.state.dataInput.Presentations[0].language +
    "_" +
    this.state.encryptedInputLife1AndSpouse,
  "*");
  } 
  

  respondToSaveRequest = (OK, fileName) => {
    this.setState({ promptForSave: false });
    let blob;
    if (versionDetails().saveEncrypt === false)
      // regular text file
      blob = new Blob([JSON.stringify(this.state.dataInput)], {
        type: "text/plain;charset=utf-8",
      });
    else blob = new Blob([this.dataQS], { type: "text/plain;charset=utf-8" });

    // iphone
    var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (OK && fileName !== "") {
      if (iOS === false) {
        // works on IE and Edge to save file, would also work on Chrome, Firedox for desktop
        saveAs(
          blob,
          fileName === undefined
            ? "INASavedData.json"
            : fileName + (APPLET_INA ? INA_FILE_TYPE : EP_FILE_TYPE) //".json"
        );
        //saveAs(blob, fileName===undefined?"INASavedData.json":prompt('Please enter file name:'))
      } else {
        blob = new Blob([JSON.stringify(this.state.dataInput)]);
        saveAs(
          blob,
          fileName === undefined
            ? "INASavedData.json"
            : "SignInINASavedData.json"
        );
      }
    }
  };

  respondToMessage = () => {
    this.setState({ showPopupMessage: "" });
  };

  saveToFile_OLD = () => {
    const blob = new Blob([JSON.stringify(this.state.dataInput)], {
      type: "text/plain;charset=utf-8",
    });
    saveAs(blob, "INASavedData.json");
  };

  headerCommand = async (command) => {
    await this.checkAndCallInitialFetch();
    if (command === SAVETO_FILE) this.saveToFile();
    else if (command === LOAD_FILE) this.loadFromFile();
    else if (command === LOAD_STORAGE) this.loadStorage();
    else if (command === EMAIL_FILE) this.EmailINA();
    else if (command === CHANGE_LANG) this.changeLang();
    else if (command === DEFAULT) this.saveAsDefaultCase();
  };

  saveToFile = () => {
    //await this.checkAndCallInitialFetch();

    if (versionDetails().saveEncrypt === false)
      // regular text file
      this.respondToSaveRequest("fileINA");
    else {
      //console.log(this.state.dataInput, this.state.loading);

      this.handleEncryptedDataModes(
        MODE_SAVE,
        this.state.dataInput,
        this.state.dataOutput
      );
    }
  };

  loadData = () => {
    let fails = fetchTimerAPICheck();
    if (fails > 1) this.setState({ failedAPI: true });
  };

  respondToPopUp = () => {
    this.saveToStorage();

    let urlReload = PARENT_SITE_PROD + "?ina=" + shortid.generate();
    const url2 = window.location.href;

    if (url2.indexOf(SITE_TEST) !== -1)
      urlReload = PARENT_SITE_TEST + "?ina=" + shortid.generate();

    const urlLogoff = "https://adfs.ppi.ca/adfs/ls/?wa=wsignout1.0";
    //	if(fails>1){
    //localStorage.setItem('INAAPIFails', parseInt(0));
    window.parent.location.href = urlLogoff;
    //	}
    //	else
    {
      window.parent.location.href = urlReload;
    }
  };

  EmailINA = () => {
    // test
    //await this.checkAndCallInitialFetch();

    this.handleEncryptedDataModes(
      MODE_EMAIL,
      this.state.dataInput,
      this.state.dataOutput
    );
    //window.location.href ='mailto: msamiei@ppi.ca ?subject= Needs Analysis Quote &body=' + this.dataQS;
  };

  callCalculateResultsAPI = (e) => {
    if (!this.resultIsOpen)
      //this.handleUpdataData();
      this.resultIsOpen = !e;
  };

  adjustVisibleOutputSection = (unit) => {
    this.visibleOutputSection = this.visibleOutputSection + unit;
  };

  hasPersonalResidenceAlready = () => {
    let PR = this.state.dataInput.Assets.find(
      (x) => x.assetTypeKey === ASSETS.PERSONAL_RESIDENCE.Key
    );

    return PR !== undefined;
  };

  handleCollapsibleClick = async (collapsible) => {
    //await this.checkAndCallInitialFetch();

    if (collapsible.id === COLLAPSIBLE_RESULTS) {
      /* if (this.state.outputInitilized === false)
      {
          this.setState({ outputInitilized:true});
      } */
      this.adjustVisibleOutputSection(
        this.openCollapsible[COLLAPSIBLE_RESULTS].open ? -1 : 1
      );

      this.callCalculateResultsAPI(collapsible.open);
    }
    if (collapsible.id === COLLAPSIBLE_SOURCES) {
      // recheck gov
      // await this.govBenefits();
    }
    // this.setState({failedRemove : false});
    if (this.state.SnapImport) this.setState({ SnapImport: false });
    this.openCollapsible[collapsible.id].open = !collapsible.open;
  };

  setOutput = (e) => {
    // Internet Explorer 6-11
    let isIE = /*@cc_on!@*/ false || !!document.documentMode;

    if (isIE)
      alert(MESSAGES[this.state.dataInput.Presentations[0].language].ie);
    else this.graphs = e === 2 ? true : false;
    this.setState({ loading: false });
  };

  selectMultiButtonPeriod = (e) => {
    // selection is 1-based
    let pres = this.copyPresentation();
    if (e === DISPLAY_RETIREMENT + 1) {
      pres.periodOption = DISPLAY_RETIREMENT;
    } else if (e === DISPLAY_LIFEEXP + 1) {
      pres.periodOption = DISPLAY_LIFEEXP;
    } else if (e === DISPLAY_ENDAGE + 1) {
      pres.periodOption = DISPLAY_ENDAGE;
    } else if (e === DISPLAY_LIFEEXP_PLUS_3 + 1) {
      pres.periodOption = DISPLAY_LIFEEXP_PLUS_3;
    }
    const noRecalc = false;
    this.handleUpdatePresentationChange(pres, noRecalc);
  };

  selectMultiButton = (e) => {
    //let pres = this.state.dataInput.Presentations;
    let pres = this.copyPresentation();

    if (e === DISPLAY_SPREADSHEET) {
      pres.resultsOption = DISPLAY_SPREADSHEET;
    } else if (e === DISPLAY_GRAPHS) {
      pres.resultsOption = DISPLAY_GRAPHS;
    } else if (e === DISPLAY_ANALYSIS) {
      pres.resultsOption = DISPLAY_ANALYSIS;
      pres.periodOption = DISPLAY_ENDAGE;
      // try this now
      pres.resultsOption = DISPLAY_LIFEEXP_PLUS_3;
      pres.periodOption = DISPLAY_LIFEEXP_PLUS_3;
    } else {
      pres.resultsOption = DISPLAY_PRESENTATION;
      //periodOption = DISPLAY_RETIREMENT;
    }
    // these don't require rescalc or resync
    const noRecalc = true;
    this.handleUpdatePresentationChange(pres, noRecalc);
    //this.setState({ Presentations: pres });
  };

  selectMultiButtonINAorTax = (e) => {
    if (e === DISPLAY_TAXLIAB) {
      this.INAOption = DISPLAY_TAXLIAB;
      // }else if (e === DISPLAY_TAXLIAB_JLTD) {
      //  this.INAOption = DISPLAY_TAXLIAB_JLTD;
    } else if (e === DISPLAY_INCOME) {
      this.INAOption = DISPLAY_INCOME;
    }
    let l = this.state.loading;
    l = !l;
    this.setState({ loading: l });
  };

  hideEstateRemoveMsg = () => {
    this.setState({ failedRemove: false });
  };

  imageRemove = () => {
    this.setState((prevState) => ({
      dataInput: {
        ...prevState.dataInput,
        Presentations: [
          {
            ...prevState.dataInput.Presentations[0],
            adviserLogo: {
              image: null,
              left: 0,
              size: 90,
              allPages: false,
              showDetails: false,
            },
          },
        ],
      },
    }));
  };

  imageAdjust = (image, ID) => {
    console.log(image);
    if (ID === IMAGE_LOGO)
      this.setState((prevState) => ({
        dataInput: {
          ...prevState.dataInput,
          Presentations: [
            {
              ...prevState.dataInput.Presentations[0],
              adviserLogo: image,
            },
          ],
        },
      }));
    else
      this.setState((prevState) => ({
        dataInput: {
          ...prevState.dataInput,
          Presentations: [
            {
              ...prevState.dataInput.Presentations[0],
              appletImage: image,
            },
          ],
        },
      }));
  };

  render() {
    let i = 1;
    let j = 1;
    let k = 1;
    let l = 1;
    let n = 1;

    const showInput = this.state.promptForSave;

    const dataInput = this.state.dataInput;
    const lang = dataInput.Presentations[0].language;

    const dataOutput = this.state.dataOutput;

    const insuranceNeeds = this.state.dataOutput.dataInsuranceNeeds;
    const periodOption = dataInput.Presentations[0].periodOption;

    const projYears = familyProjectionYears(
      dataInput.Clients,
      periodOption,
      dataOutput.lifeExpectancy,
      insuranceNeeds,
      dataOutput.dataShortfall,
      dataInput.Presentations[0]
    );
    const insNeed = projYears.insuranceNeed;
    const insNeedRet = projYears.insuranceNeedToRet;
    const insNeedLE = projYears.insuranceNeedToLE;
    const insNeedLE3 = projYears.insuranceNeedToLE3;
    const insNeedEAge = projYears.insuranceNeedToEnd;
    let projectEnd = projYears.projectionEnd;
    let noProjectYrs = projYears.noProjectionYrs;
    const survAge = projYears.survivorAge;

    const singleFamily = isSingleFamily(dataInput.Clients);
    const singlePerson = dataInput.Clients.length === 1 ? true : false;
    const showSinglePerson =
      singlePerson && versionDetails().numericValues > 10014;

    if (singleFamily) {
      // this is protection period now
      dataInput.Presentations[0].periodOption = DISPLAY_RETIREMENT;
    }

    // single person
    if (dataInput.Clients.length === 1) {
      noProjectYrs = 0;
      dataInput.Needs.forEach((element) => {
        if (noProjectYrs < element.duration) noProjectYrs = element.duration;
      });
      projectEnd = noProjectYrs + dataInput.Clients[0].Age;
    }

    const numSurvivor = dataInput.Clients.length - 1;
    const insNeedLine = getInsNeedLine(
      dataInput.Presentations[0],
      projectEnd,
      lang,
      numSurvivor,
      singleFamily,
      noProjectYrs,
      insNeed,
      dataInput.Clients[0].Name
    );

    // if  singleFamily show years instead of ages as no children may be >1
    if (singleFamily) {
      dataOutput.dataNAAges = [];
      for (let i = 0; i < noProjectYrs; i++) dataOutput.dataNAAges.push(i + 1);
    }
    // if file is PYE
    if (dataInput.Clients.length === 1) this.survIdx = 0;

    const Survivor = this.state.dataInput.Clients[this.survIdx]; //.find(x => x.memberKey === spKey);

    const inputOutputIsValid =
      insuranceNeeds.length > 0 &&
      dataOutput.dataNAAges !== undefined &&
      Survivor !== undefined;

    //Survivor !== undefined

    if (this.state.failedAPI) console.log("timer API call failed re ADSF");

    let dataAges;
    let dataGov;
    let dataPCV;
    let dataNeed;
    let dataShort;
    let buttonCaption;
    let buttonCaption3;
    let buttonCaptionPeriod;
    let tableWidth;
    let dataEstateLiability;

    buttonCaption = [
      TITLES[lang].presBut,
      TITLES[lang].graphsBut,
      TITLES[lang].spreadsheetBut,
      TITLES[lang].analysisBut,
    ];
    buttonCaption3 = [
      TITLES[lang].presBut,
      TITLES[lang].graphsBut,
      TITLES[lang].spreadsheetBut,
    ];
    buttonCaptionPeriod = [
      TITLES[lang].retBut,
      TITLES[lang].leBut,
      TITLES[lang].age100But,
    ];

    if (
      this.survIdx !== undefined &&
      dataInput.Clients[this.survIdx].memberKey !== MEMBER.SPOUSE.Key &&
      dataInput.Clients[this.survIdx].memberKey !== MEMBER.CLIENT.Key
    )
      buttonCaptionPeriod = [TITLES[lang].protectButton];
    if (inputOutputIsValid) {
      // project liabs
      var totalLiabProjections = getProjectedLiabilities(
        dataInput,
        projectEnd,
        dataOutput.probate
      );

      //console.log(totalLiabProjections);

      dataAges = dataOutput.dataNAAges.slice(0, noProjectYrs);
      dataGov = dataOutput.dataCashFlowGov.slice(0, noProjectYrs);
      dataPCV = dataOutput.dataCashFlowPersonal.slice(0, noProjectYrs);
      // if(this.INAOption!==DISPLAY_INCOME)
      dataEstateLiability = getDataFutureEstateLiability(
        //getDataFutureEstateLiability(this.dataTaxLiability.numericValues, totalLiabProjections).slice(0, noProjectYrs);
        dataOutput.dataTaxLiability,
        totalLiabProjections
      );

      dataNeed = dataOutput.dataCashFlowNeeds.slice(0, noProjectYrs);
      dataShort = dataOutput.dataShortfall.slice(0, noProjectYrs);

      let dataSurvivorSalaryIncome = dataInput.Sources.find(
        (x) => x.sourceTypeKey === INCOMESOURCES.SURVIVORS_INCOME
      );
      if (dataSurvivorSalaryIncome !== undefined) {
        dataSurvivorSalaryIncome.reduce((a, b) => a + b, 0);
      }
      dataSurvivorSalaryIncome = dataOutput.dataShortfall.slice(
        0,
        noProjectYrs
      );

      if (dataOutput.aggregateGrid != undefined)
        tableWidth =
          Math.min(
            100,
            10 * this.state.dataOutput.aggregateGrid.dataColTitles.length
          ) + "%";

      // MCC quote
      // dataMCC= INAMCCQuote(this.state,insNeed);
    }

    const altRow = "#F8F8F8";

    const graphs = (
      <Suspense fallback={<Spinner />}>
        <OutputGraphs
          insuranceNeed={insNeed}
          projectEnd={projectEnd}
          dataCashFlowPersonal={dataPCV}
          dataInput={dataInput}
          dataNAAges={dataAges}
          dataCashFlowNeeds={dataNeed}
          dataCashFlowGov={dataGov}
          dataShortfall={dataShort}
          insNeedLine={insNeedLine}
          aggregateGrid={dataOutput.aggregateGrid}
          LE={dataOutput.lifeExpectancy.spouse} // + survAge}
          //language={lang}
          //projectTo={this.toRetirement ? 0 : 1}

          periodOption={periodOption}
          /* projectTo={
        periodOption === DISPLAY_RETIREMENT
          ? DISPLAY_RETIREMENT
          : periodOption === DISPLAY_LIFEEXP
            ? DISPLAY_LIFEEXP
            : DISPLAY_ENDAGE
      } */
        />
      </Suspense>
    );
    const graphsEP = (
      <Suspense fallback={<Spinner />}>
        <OutputGraphsEP
          insuranceNeed={insNeedLE3}
          projectEnd={projectEnd} // try this now // always to the end
          // dataEstateLiability={dataEstateLiability}
          dataInput={dataInput}
          dataNAAges={dataAges}
          lifeExp={dataOutput.lifeExpectancy.joint} // client or if spouse JLTD
          lifeExpJLTD={dataOutput.lifeExpectancy.joint}
          lifeExpClient={dataOutput.lifeExpectancy.client}
          probate={dataOutput.probate}
          nonTaxLiabilities={dataOutput.dataNonTaxLiability}
          INAOption={this.INAOption}
          //dataShortfall={dataShort}
          //dataAPISite={appSiteAPI}
          LE={dataOutput.lifeExpectancy.spouse} // + survAge}
          assetProjections={dataOutput.assetProjections}
          //language={lang}
          //projectTo={this.toRetirement ? 0 : 1}
          // periodOption={DISPLAY_LIFEEXP_PLUS_3}
        />
      </Suspense>
    );

    const analysis = (
      <div
        style={{
          marginTop: "-4px",
          backgroundColor: "lightgrey",
          paddingLeft: "5px",
        }}
      >
        <Suspense fallback={<Spinner />}>
          <AnalysisGraphs
            insuranceNeed={insNeedLE3}
            projectEnd={projectEnd} // try this now // always to the end
            dataEstateLiability={dataEstateLiability}
            dataInput={dataInput}
            dataNAAges={dataAges}
            lifeExp={dataOutput.lifeExpectancy.spouse}
            lifeExpJLTD={dataOutput.lifeExpectancy.joint}
            lifeExpClient={dataOutput.lifeExpectancy.client}
            INAOption={this.INAOption}
            dataShortfall={dataShort}
            dataAPISite={appSiteAPI}
            language={lang}
            //projectTo={this.toRetirement ? 0 : 1}
            periodOption={DISPLAY_LIFEEXP_PLUS_3}
            //projectTo={this.lifeExp + 3} // always to the end
            /* periodOption === DISPLAY_RETIREMENT
          ? 0
          : periodOption === DISPLAY_LIFEEXP
          ? 1
          : 2
      } */
          />
        </Suspense>
      </div>
    );

    let infoIcon = getGenericMessage(lang);
    infoIcon.infoText = getInfoIconSourcesGov(lang).infoText;
    const govPopup = this.state.failedRemove && (
      <div style={{ paddingLeft: "45%" }}>
        {" "}
        <Info infoIcon={infoIcon} respondToPopUp={this.hideEstateRemoveMsg} />
      </div>
    );

    /* if(this.state.initialQSParsing===-1)
      return (<div >
      <br/> None
    </div>
  
    )
    console.log("in NA: "this.props.language) 

    else  */
    console.log(dataInput.Needs);
    if (this.agentAccessQuery) return "";
    else if (this.state.promptShowCases && this.state.initialQSParsing === 0)
      return (
        <div>
          <br /> DB
        </div>
      );
    else if (
      this.state.promptShowFeedback > 0 &&
      this.state.initialQSParsing === 0
    )
      return (
        <div>
          <br />{" "}
          <TKDFeedback
            language={this.state.promptShowFeedback === 1 ? "en" : "fr"}
            email={this.userEmail}
          />
        </div>
      );
    else {
      if (this.state.initialLoading === true) {
        return (
          <div>
            <br /> loading
          </div>
        );
      } else {
        return (
          <div
            id="main"
            className={
              this.state.initialLoading === true || this.state.loading === true
                ? "mainDivBlocked"
                : "mainDiv"
            }
          >
            <style>{`@media print {display: none;}`}</style>
            <Header
              title={
                this.INAOption === DISPLAY_INCOME
                  ? TITLES[lang].appletINA
                  : TITLES[lang].appletEP
              }
              saveToFile={this.saveToFile}
              loadFromFile={this.loadFromFile}
              loadStorage={this.loadStorage}
              EmailINA={this.EmailINA}
              changeLang={this.changeLang}
              saveAsDefaultCase={this.saveAsDefaultCase}
              /* saveToFile={() => this.headerCommand(SAVETO_FILE)}
            loadFromFile={() => this.headerCommand(LOAD_FILE)}
            loadStorage={() => this.headerCommand(LOAD_STORAGE)}
            EmailINA={() => this.headerCommand(EMAIL_FILE)}
            changeLang={() => this.headerCommand(CHANGE_LANG)}
            saveAsDefaultCase={() => this.headerCommand(DEFAULT)} */

              language={lang}
            />
            {(this.state.initialLoading === true ||
              this.state.loading === true) && <Spinner />}
            {/* <div style={{marginTop:'15px'}} ><MultiButtons
        
          noButtons={2}
          buttonCaption={["Income Protection", "Estate Protection"]}
          selectMultiButton={this.selectMultiButtonINAorTax}
        /></div>
         */}

            <div className="topMargin" />

            <div style={{ height: "0px" }}>
              <PopupUserinputDialog
                openDialog={showInput === true}
                mainMessage={
                  lang === "en" ? "Save to File" : "Enregistrer dans un fichier"
                }
                formMessage={lang === "en" ? "file name" : "nom de fichier"}
                language={lang}
                infoIcon={getInfoSave(lang)}
                respondToInput={this.respondToSaveRequest}
              />
            </div>
            <div style={{ height: "0px" }}>
              <PopupUserinputDialog
                OKOnly={true}
                severity={"error"}
                openDialog={this.state.showLogout === true}
                mainMessage={
                  lang === "en" ? "Your Toolkit Direct session has expired. Toolkit Direct will now reload." : "Votre session ToolkitDirect a expiré. ToolkitDirect va maintenant se recharger."
                }
                
                language={lang}
                
                respondToInput={this.respondToLogoutRequest}
              />
            </div>
            {/* {this.state.initialLazyLoaded === false ? <span>{lang === "en" ? "loading..." : "attendez..."}</span> : "" } */}
            <Collapsible
              id={COLLAPSIBLE_PRESENTATION}
              title={TITLES[lang].presentations}
              openParent={this.openParent}
              openCollapsible={this.openCollapsible[COLLAPSIBLE_PRESENTATION]}
              handleCollapsibleClick={this.handleCollapsibleClick}
            >
              {dataInput.Presentations.map((presentation) => (
                <Suspense fallback={<Spinner />}>
                  <Presentation
                    key={presentation.id}
                    id={1}
                    provinceKey={presentation.provinceKey}
                    presentationCurr={presentation}
                    language={lang}
                    presentationsNo={1}
                    //saveAsDefaultCase={this.saveAsDefaultCase}
                    handleUpdate={this.handleUpdatePresentation}
                  />
                </Suspense>
              ))}
            </Collapsible>
            <Collapsible
              id={COLLAPSIBLE_CLIENTS}
              title={
                singlePerson ? TITLES[lang].clients_1 : TITLES[lang].clients
              }
              openParent={this.openParent}
              openForce={this.openForce}
              handleCollapsibleClick={this.handleCollapsibleClick}
              openCollapsible={this.openCollapsible[COLLAPSIBLE_CLIENTS]}
              infoIcon={APPLET_EP ? getInfoIconPYE_JLTD(lang) : undefined}
            >
              {dataInput.Clients.map((client) => (
                <Client
                  key={client.id}
                  id={i++}
                  clientCurr={client}
                  singleFamily={singleFamily}
                  isTheSurvivor={
                    (this.survIdx !== undefined &&
                      dataInput.Clients[this.survIdx].memberKey ===
                        client.memberKey) ||
                    (singleFamily && client.id > 1)
                      ? true
                      : false
                  }
                  themeColor={i % 2 && isMobileDevice() ? altRow : "white"}
                  language={lang}
                  isQC={dataInput.Presentations[0].provinceKey === "QC"}
                  clientsNo={dataInput.Clients.length} //clientsNo}
                  handleUpdate={this.handleUpdateClient}
                  handleAddClient={this.handleAddClient}
                  handleRemoveClient={this.handleRemoveClient}
                  switchClients={this.switchClients}
                  disableAddRemove={this.state.loading}
                />
              ))}
            </Collapsible>

            <Collapsible
              id={COLLAPSIBLE_ASSETS}
              title={TITLES[lang].assets}
              openParent={this.openParent}
              openCollapsible={this.openCollapsible[COLLAPSIBLE_ASSETS]}
              handleCollapsibleClick={this.handleCollapsibleClick}
            >
              {dataInput.Assets.map((asset) => (
                <Suspense fallback={<Spinner />}>
                  <Asset
                    key={asset.id}
                    assetCurr={asset}
                    id={j++}
                    language={lang}
                    themeColor={j % 2 && isMobileDevice() ? altRow : "white"}
                    assetsNo={dataInput.Assets.length} //.assetsNo}
                    clientsNo={dataInput.Clients.length} //.assetsNo}
                    handleUpdate={this.handleUpdateAsset}
                    handleAddAsset={this.handleAddAsset}
                    handleRemoveAsset={this.handleRemoveAsset}
                    // handleAddAssetTaxLiability={this.handleAddAssetTaxLiability}
                    adjustVisibleOutputSection={this.adjustVisibleOutputSection}
                    hasPersonalResidenceAlready={this.hasPersonalResidenceAlready()}
                    projection={dataOutput.assetProjections}
                    disableAddRemove={this.state.loading}
                  />
                </Suspense>
              ))}
              {/* allow zero rows */}
              {dataInput.Assets.length === 0 ? ( //).assetsNo === 0 ? (
                <AddRemove
                  currentID={0}
                  lang={lang}
                  minComps={0}
                  numberComps={0}
                  handleDoAdd={this.handleAddAsset}
                  handleDoRemove={this.handleRemoveAsset}
                />
              ) : (
                ""
              )}
            </Collapsible>
            <Collapsible
              id={COLLAPSIBLE_LIABS}
              title={TITLES[lang].liabilities}
              openParent={this.openParent}
              openCollapsible={this.openCollapsible[COLLAPSIBLE_LIABS]}
              handleCollapsibleClick={this.handleCollapsibleClick}
            >
              {dataInput.Liabilitys.map((liability) => (
                <Suspense fallback={<Spinner />}>
                  <Liability
                    key={liability.id}
                    liabilityCurr={liability}
                    probate={dataOutput.probate}
                    language={lang}
                    liabilitysNo={dataInput.Liabilitys.length} //.liabilitysNo}
                    themeColor={k % 2 && isMobileDevice() ? altRow : "white"}
                    handleUpdate={this.handleUpdateLiability}
                    handleAddLiability={this.handleAddLiability}
                    handleRemoveLiability={this.handleRemoveLiability}
                    overwriteProbate={
                      dataInput.Presentations[0].overwriteProbate && APPLET_INA
                    }
                    // handleAddAssetTaxCredit={this.handleAddAssetTaxCredit}
                    disableAddRemove={this.state.loading}
                  />
                </Suspense>
              ))}
              {/* allow zero rows */}
              {dataInput.Liabilitys.length === 0 ? ( //).liabilitysNo === 0 ? (
                <AddRemove
                  currentID={0}
                  lang={lang}
                  minComps={0}
                  numberComps={0}
                  handleDoAdd={this.handleAddLiability}
                  handleDoRemove={this.handleRemoveLiability}
                />
              ) : (
                ""
              )}
            </Collapsible>

            {this.INAOption === DISPLAY_INCOME && (
              <Collapsible
                id={COLLAPSIBLE_SOURCES}
                title={
                  singlePerson ? TITLES[lang].sources_1 : TITLES[lang].sources
                }
                openParent={this.openParent}
                openCollapsible={this.openCollapsible[COLLAPSIBLE_SOURCES]}
                handleCollapsibleClick={this.handleCollapsibleClick}
                infoIcon={getInfoIconInflationGrowth(lang)}
              >
                {govPopup}
                {dataInput.Sources.map((source) => {
                  let OrphanAges;
                  let maxOrphanDur;
                  if (
                    source.sourceTypeKey ===
                    INCOMESOURCES.GOV_ORPHANS_BENEFIT.Key
                  ) {
                    OrphanAges = dataInput.Clients.filter(function (item) {
                      return source.ownerID === item.id;
                    });

                    if (OrphanAges.length > 0)
                      maxOrphanDur =
                        (dataInput.Presentations[0].provinceKey === "QC"
                          ? MAX_ORPHAN_DUR_QC
                          : MAX_ORPHAN_DUR_NON_QC) - OrphanAges[0].Age;
                  }
                  return (
                    /* !(source.amount === 0 && source.id < noSources && source.sourceTypeKey === INCOMESOURCES.SURVIVORS_INCOME.Key) && */
                    <Suspense fallback={<Spinner />}>
                      <Source
                        key={source.id}
                        id={n++}
                        sourceCurr={
                          source.sourceTypeKey ===
                          INCOMESOURCES.GOV_ORPHANS_BENEFIT.Key
                            ? {
                                ...source,
                                maxOrphan: this.orphan,
                                maxOrphanDur: maxOrphanDur,
                              }
                            : source
                        }
                        /* Type={source.Type}
              amount={source.amount}
              startYear={source.startYear}
              duration={source.duration}
              ownerID={source.ownerID} */
                        includeGovOrphanBenefit={this.areThereChildren()}
                        language={lang}
                        marginalTaxRate={dataInput.Presentations[0].taxRate} //singlePerson?dataInput.Clients[QUOTE_CLIENT].avgTaxRate:dataInput.Clients[QUOTE_SPOUSE].avgTaxRate}
                        sourcesNo={dataInput.Sources.length} //sourcesNo}
                        themeColor={
                          n % 2 && isMobileDevice() ? altRow : "white"
                        }
                        handleUpdate={this.handleUpdateSource}
                        handleAddSource={this.handleAddSource}
                        handleRemoveSource={this.handleRemoveSource}
                        disableAddRemove={this.state.loading}
                      />
                    </Suspense>
                  );
                })}
              </Collapsible>
            )}
            {this.INAOption === DISPLAY_INCOME && (
              <Collapsible
                id={COLLAPSIBLE_NEEDS}
                title={singlePerson ? TITLES[lang].needs_1 : TITLES[lang].needs}
                openParent={this.openParent}
                openCollapsible={this.openCollapsible[COLLAPSIBLE_NEEDS]}
                handleCollapsibleClick={this.handleCollapsibleClick}
                infoIcon={getInfoIconNeedGrowth(lang)}
              >
                {dataInput.Needs.map((need) => (
                  <Suspense fallback={<Spinner />}>
                    <Need
                      key={need.id}
                      id={l++}
                      needCurr={need}
                      language={lang}
                      needsNo={dataInput.Needs.length} //needsNo}
                      afterTaxTotalIncome={this.getAfterTaxTotalIncome(
                        dataInput
                      )}
                      themeColor={l % 2 && isMobileDevice() ? altRow : "white"}
                      handleUpdate={this.handleUpdateNeed}
                      handleAddNeed={this.handleAddNeed}
                      handleRemoveNeed={this.handleRemoveNeed}
                      disableAddRemove={this.state.loading}
                    />
                  </Suspense>
                ))}
                {/* allow zero rows */}
                {dataInput.Needs.length === 0 ? ( //).liabilitysNo === 0 ? (
                  <AddRemove
                    currentID={0}
                    lang={lang}
                    minComps={0}
                    numberComps={0}
                    handleDoAdd={this.handleAddNeed}
                    handleDoRemove={this.handleRemoveNeed}
                  />
                ) : (
                  ""
                )}
              </Collapsible>
            )}
            {/*<Collapsible id="8" title={TITLES[lang].settings} openParent={this.openParent}  handleCollapsibleClick
={this. handleCollapsibleClick
}>
					<Setting key={this.state.dataSettings.Settings.id} index={1} Province={this.state.dataSettings.Settings.Province} invRate={this.state.dataSettings.Settings.invRate} inflation={this.state.dataSettings.Settings.inflation} taxRate={this.state.dataSettings.Settings.taxRate} language={lang}  handleUpdate={this.handleUpdateSetting} />
					
				</Collapsible>*/}

            {this.state.failedAPI ? (
              <div style={{ paddingLeft: "40%" }}>
                <Info
                  infoIcon={getInfoNoInternetAccess(lang)}
                  respondToPopUp={this.respondToPopUp}
                  ref={(Info) => (this.dlgLogin = Info)}
                />
              </div>
            ) : (
              ""
            )}

            {
              /* this.state.loading===false &&  */ <Collapsible
                id={COLLAPSIBLE_RESULTS}
                title={TITLES[lang].results}
                enabled={this.state.loading === false}
                openParent={this.openParent}
                openCollapsible={this.openCollapsible[COLLAPSIBLE_RESULTS]}
                handleCollapsibleClick={this.handleCollapsibleClick}
              >
                <div style={{ width: "100%", float: "left", clear: "left" }}>
                  {versionDetails().allowAnalysis === true && !APPLET_INA ? (
                    <MultiButtons
                      noButtons={4}
                      buttonCaption={buttonCaption}
                      selected={dataInput.Presentations[0].resultsOption}
                      selectMultiButton={this.selectMultiButton}
                    />
                  ) : (
                    <MultiButtons
                      noButtons={3}
                      buttonCaption={buttonCaption3}
                      selected={dataInput.Presentations[0].resultsOption}
                      selectMultiButton={this.selectMultiButton}
                    />
                  )}
                </div>

                <div style={{ width: "100%", float: "left", clear: "left" }}>
                  {/* <MultiButtons
              button1={ret}
              button2={le}
              buttonActive={this.toRetirement ? 1 : 2}
              selectButton={this.setInsDuration}
            /> */}
                  {this.INAOption === DISPLAY_INCOME &&
                    dataInput.Presentations[0].resultsOption !==
                      DISPLAY_ANALYSIS &&
                    !singleFamily && (
                      <MultiButtons
                        noButtons={3}
                        buttonCaption={buttonCaptionPeriod}
                        selected={dataInput.Presentations[0].periodOption + 1}
                        selectMultiButton={this.selectMultiButtonPeriod}
                      />
                    )}

                  {periodOption !== DISPLAY_RETIREMENT &&
                    dataInput.Presentations[0].resultsOption !==
                      DISPLAY_ANALYSIS && (
                      <span style={{ fontSize: "10px", fontColor: "grey" }}>
                        {/* <Info iconName="infoRed.png" id="warning" msg={msg1} /> */}
                      </span>
                    )}
                </div>
                {dataOutput.dataCashFlowPersonal.length === 0 ? (
                  ""
                ) : dataInput.Presentations[0].resultsOption ===
                  DISPLAY_GRAPHS ? (
                  APPLET_INA ? (
                    graphs
                  ) : (
                    graphsEP
                  )
                ) : dataInput.Presentations[0].resultsOption ===
                  DISPLAY_SPREADSHEET ? (
                  //<div style={{ width: tableWidth }}>
                  <div>
                    {/* {APPLET_INA && this.state.dataOutput.aggregateGrid !== null && this.state.dataOutput.aggregateGrid !== undefined ? */}
                    {dataOutput.aggregateGrid !== null &&
                      dataOutput.aggregateGrid !== undefined && (
                        /* !showSinglePerson && */ <Suspense
                          fallback={<Spinner />}
                        >
                          <AggregateGrid
                            aggregateGrid={dataOutput.aggregateGrid}
                            LE={
                              APPLET_INA
                                ? dataOutput.lifeExpectancy.spouse
                                : dataOutput.lifeExpectancy.joint
                            }
                            lang={lang}
                            insNeedLine={insNeedLine}
                          />
                        </Suspense>
                      )}

                    {/* : APPLET_EP && <ExcelSpreadsheetEP input={this.state} noProjectYrs={noProjectYrs} />} */}
                  </div>
                ) : dataInput.Presentations[0].resultsOption ===
                  DISPLAY_ANALYSIS ? (
                  analysis
                ) : this.INAOption === DISPLAY_INCOME ? (
                  <Suspense fallback={<Spinner />}>
                    <OutputPresentation
                      insuranceNeed={insNeed}
                      insuranceNeedRet={insNeedRet}
                      insuranceNeedLE={insNeedLE}
                      insuranceNeedEAge={insNeedEAge}
                      projectEnd={projectEnd}
                      insNeedLine={insNeedLine}
                      LE={dataOutput.lifeExpectancy}
                      dataInput={dataInput}
                      INAOption={this.INAOption}
                      dataShortfall={dataShort}
                      imageRemove={this.imageRemove}
                      imageAdjust={this.imageAdjust}
                      encryptedInputLife1AndSpouse={
                        dataOutput.encryptedInputLife1AndSpouse
                      }
                      encryptedInputLife1={dataOutput.encryptedInputLife1}
                      //periodOption={periodOption}
                      yrsCoverageIfCashAll={
                        parseInt(dataOutput.yrsCoverageIfCashAll - 1) /* +
                      (dataOutput.yrsCoverageIfCashAll === 2
                        ? " year"
                        : " years") */
                      }
                      getSpouseINA={this.getSwitchClientsState}
                      token={this.token}
                      aboutMe={this.aboutMe}
                    />
                  </Suspense>
                ) : (
                  <Suspense fallback={<Spinner />}>
                    <OutputPresentationEP
                      //insuranceNeed={insNeed}
                      insuranceNeedRet={insNeedRet}
                      insuranceNeedLE={insNeedLE}
                      //insuranceNeedEAge={insNeedEAge}
                      //projectEnd={projectEnd}
                      LE={dataOutput.lifeExpectancy.joint} //client} //{dataOutput.lifeExpectancy.spouse + survAge}
                      dataInput={dataInput}
                      assetProjections={dataOutput.assetProjections}
                      aggregateGrid={dataOutput.aggregateGrid}
                      probate={dataOutput.probate}
                      taxLiability={dataOutput.dataTaxLiability}
                      INAOption={this.INAOption}
                      dataEstateLiability={dataEstateLiability} //getDataFutureEstateLiability(this.dataTaxLiability.numericValues, totalLiabProjections)}
                      dataShortfall={dataShort}
                      appSiteParent={appSiteParent}
                      imageRemove={this.imageRemove}
                      imageAdjust={this.imageAdjust}
                      //periodOption={periodOption}
                      encryptedInputLife1AndSpouse={
                        dataOutput.encryptedInputLife1AndSpouse
                      }
                      encryptedInputLife1={dataOutput.encryptedInputLife1}
                      aboutMe={this.aboutMe}
                      token={this.token}
                    />
                  </Suspense>
                )}
              </Collapsible>
            }

            {this.state.loading === false &&
              this.state.showPopupMessage !== "" && (
                <PopupMessage
                  severity={"warning"}
                  messageTitle={this.state.showPopupMessage}
                  openDialog={this.state.showPopupMessage !== ""}
                  respondToMessage={this.respondToMessage}
                ></PopupMessage>
              )}
            {/*  {this.state.initialLoading === true && (
          <div style={{ marginTop: "20px", marginLeft: "90px" }}>
            <Loader type="TailSpin" color="black" height={30} width={30} />
          </div>
        )} */}

            {this.state.SnapImport ? <PasteClients /> : ""}
            <div id="copyDiv" style={{ paddingBottom: "40px" }}></div>

            <br />
          </div>
        );
      }
    }
  }
}
