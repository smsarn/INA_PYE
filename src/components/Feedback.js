import React from "react";
//import toolkit from './toolkit.png';
import "./NA.css";
import { MultiButtons } from "../components/MultiButtons";
import {
  fetchAppletNamesAndCodes,
  fetchSaveComment,
  fetchAppletDetails,
} from "../utils/FetchAPIs";


export class TKDFeedback extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      feedback: "",
      type: 1,
      selectedApplet: 0,
      saved: true,
    };
    // applets
    this.applets = null;
    this.appletList = [];
    /*  this.appletList = [];
    this.appletList.push(this.props.language==="en"?" All Applets": " Tous les applets");
    for (let i = 0; i < this.getAppletNames(this.props.language).length; i++) {
      this.appletList.push(this.getAppletNames(this.props.language)[i]);
    }
    console.log(this.appletList)     */
  }

  componentDidMount = async () => {
    this.applets = await fetchAppletDetails();
    this.applets.sort((a, b) => (a.appletOrder > b.appletOrder ? 1 : -1));
    this.appletList = await this.getAppletNames();
  };

  getAppletNames = async () => {
    this.appletList = [];
    this.appletList.push(
      this.props.language === "en" ? " All Applets" : " Tous les applets"
    );
    for (let i = 0; i < this.applets.length; i++) {
      if (this.applets[i].appletOrder >= 0) {
        this.appletList.push(
          this.props.language === "en"
            ? this.applets[i].appletNameEn
            : this.applets[i].appletNameFr
        );
      }
    }
    return this.appletList;
  };

  getAppletCode = (appletIndex) => {
    const index = parseInt(appletIndex);
    let selApplet = this.applets.find((x) => x.appletOrder === index);

    return index === 0
      ? "ALL"
      : selApplet === undefined
      ? "ALL"
      : selApplet.appletCode;
  };

  /* getAppletNames2= (lang)=> {
    return [
    TOOLKIT[lang].PA,
    TOOLKIT[lang].PLA,
    TOOLKIT[lang].INA,
    TOOLKIT[lang].EP,
    TOOLKIT[lang].WL,
    TOOLKIT[lang].LIFO,
    TOOLKIT[lang].CA,
    TOOLKIT[lang].EB,
    TOOLKIT[lang].BR,
    TOOLKIT[lang].IR,
    TOOLKIT[lang].CSW]
} */

  /* getAppletDetails= (lang)=> {
  let appletDetails=[];
  appletDetails.push({index:0, name:"All"})
  appletDetails.push({index:1, name:"All"})
  

  return [
  TOOLKIT[lang].PA,
  TOOLKIT[lang].PLA,
  TOOLKIT[lang].INA,
  TOOLKIT[lang].EP,
  TOOLKIT[lang].WL,
  TOOLKIT[lang].LIFO,
  TOOLKIT[lang].CA,
  TOOLKIT[lang].EB,
  TOOLKIT[lang].BR,
  TOOLKIT[lang].IR,
  TOOLKIT[lang].CSW]
} */

  /* getAppletCode =(appletIndex) => {    
    if (appletIndex=== 0)
        return "ALL"
    else if (appletIndex=== "1")
        return "PA"
    else if (appletIndex=== "2")
        return "PLA"
    else if (appletIndex=== "3")
        return "INA"
    else if (appletIndex=== "4")
        return "EP"
    else if (appletIndex=== "5")
        return "WL"
    else if (appletIndex=== "6")
        return "LIFO"
    else if (appletIndex=== "7")
        return "CA"
    else if (appletIndex=== "8")
        return "EB"
    else if (appletIndex=== "9")
        return "BR"
    else if (appletIndex=== "10")
        return "IR"
    else if (appletIndex=== "11")
        return "CSW"
    else
        return "ALL"
    
    
}
 */

  /*   componentWillReceiveProps(nextProps){
    if(nextProps.language!==this.props.language){
        this.appletList = [];
        this.appletList.push(nextProps.language==="en"?" All Applets": " Tous les applets");
        for (let i = 0; i < this.getAppletNames(nextProps.language).length; i++) {
          this.appletList.push(this.getAppletNames(nextProps.language)[i]);
        }
      }
}
   */

  save = () => {
    if (this.state.feedback.length > 2) {
      this.setState({ saved: false });

      let email = this.props.email;
      let feedback = {
        agentEmail: email,
        appletCode: this.getAppletCode(this.state.selectedApplet),
        type: this.state.type,
        feedback: this.state.feedback,
      };
      fetchSaveComment(feedback);

      setTimeout(() => {
        this.setState({ saved: true });
      }, 1500);
    }
  };

  handleAppletDropDownChange = (e) => {
    this.setState({ selectedApplet: e.target.value });
  };

  updateInputValue = (e) => {
    this.setState({ feedback: e.target.value });
  };

  clickMultiButton = (e) => {
    this.setState({ type: e });
  };

  render() {
    const lang = this.props.language === "en" ? "Français" : "English";
    let style = {
      fontFamily: "Trebuchet MS",
      color: "#4775ae",
      fontWeight: "500",
      marginBottom: "5px",
    };
    let style2 = {
      fontFamily: "Trebuchet MS",
      fontSize: "14px",
      color: "#2F4755",
      marginLeft: "0px",
    };
    let style3 = {
      fontFamily: "Trebuchet MS",
      color: "#4775ae",
      textDecoration: "overline",
      fontSize: "14px",
    };
    const en = this.props.language === "en";
    return (
      <div
        className="appletDiv"
        style={{ overflow: "auto", marginLeft: "20px" }}
      >
        <div className="UsageDiv" style={{ width: "80%" }}>
          <h2 style={style}> {en ? "Feedback:" : "Commentaires:"}</h2>

          <div style={style3}>
            {en
              ? "Your feedback is used to improve Toolkit Direct. Please note that feedback is not anonymous."
              : "Vos commentaires sont utilisés pour améliorer la boîte à outils directe. Veuillez noter que les commentaires ne sont pas anonymes."}
          </div>
          <br />
          <span style={style2}>
            <div className="ppi2 no-print" style={{ marginLeft: "24px" }}>
              <MultiButtons
                width="200px"
                noButtons={2}
                buttonCaption={[
                  "Conceptual (Digital Sales)",
                  "Technical (Help Desk)",
                ]}
                selected={this.state.type}
                selectMultiButton={this.clickMultiButton}
              />
              <span style={{ marginLeft: "20px" }}>
                {" "}
                {en ? "by Applet:  " : "Par applet:  "}
              </span>
              <select
                style={{
                  height: "24px",
                  marginLeft: "5px",
                  marginRight: "20px",
                }}
                name="applets"
                id="applets"
                value={this.state.selectedApplet}
                onChange={this.handleAppletDropDownChange}
              >
                {this.appletList.map((item, index) => {
                  return (
                    <option key={index} value={index}>
                      {item}
                    </option>
                  );
                })}
              </select>
            </div>
            <br />
            <div>
              <textarea
                id={5}
                className="inputField Text"
                style={{ width: "100%", height: "250px" }}
                onFocus={this.handleFocus}
                onClick={this.select}
                type="text"
                value={this.state.feedback}
                onBlur={(evt) => this.updateInputValue(evt)}
                onChange={(evt) => this.updateInputValue(evt)}
              />
              <br />
              <span
                style={{
                  marginLeft: "15px",
                  visibility: this.state.saved ? "hidden" : "visible",
                }}
              >
                {en ? " ... done" : " ... finie"}
              </span>
              <input
                className="roundedCornerCmd"
                onClick={this.save}
                type="button"
                value={en ? "Submit" : "Soumittre"}
              />
            </div>
          </span>
        </div>
      </div>
    );
  }
}
