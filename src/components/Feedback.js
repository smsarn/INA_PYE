import React from "react";
//import toolkit from './toolkit.png';
import "./NA.css";
import {
    fetchAppletNamesAndCodes,
    fetchSaveComment,
    fetchAppletDetails
  } from "../utils/FetchAPIs";

  const TOOLKIT = {
	en: {
		Title: 'PPI Toolkit Direct',
		Home: 'Home',
		Applets:'Applets',
		INA: 'Insurance Needs Analysis',
		WL: 'Insurance for Your Whole Life',
		EP: 'Protecting Your Estate',
        EB: 'Creating an Estate Bond',
        PA: 'Practice Assistant',
        PLA: 'Planning Assistant',
        LIFO: 'Life Insurance Funding Options',
        CA: 'Capital Alternatives',
        BR: 'Bridging Risk',
        IR: 'Income Replacement',
        CSW: 'Carrier Software and Websites',
        TIPS: 'Tips and Notes',
        DB: 'Presentations',
        DBCL: 'Clients',
        AU: 'Applet Usage',
        FB: 'Feedback'
	},
	fr: {
		Title: 'Boîte à outils directe- PPI',
		Home: 'Principal',
		Applets: 'Applets',
		INA: "Analyse des besoins en matière d'assurance",
		WL: 'L\'assurance pour votre vie entière',
        EP: 'Protection de votre patrimoine',
        EB: "Création d'un bon successoral",
        PA: 'Assistant à la conformité',
        PLA: 'Assistant de Planification',
        LIFO: "Modes de financement de l'assurance vie",
        CA: 'Options de capital',
        BR: "Les ponts où l'on se hasarde",
        IR: 'Remplacement du revenu',
        CSW: 'Logiciels et sites web de la compagnie d’assurance',
        TIPS: 'Conseils et remarques',
        DB: 'Presentations ^F',
        DBCL: 'Clients ^F',
        AU: "Utilisation d'applet",
        FB: 'Commentaires'

	}
  }
  

export class TKDFeedback extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      feedback:"",
      selectedApplet: 0,
      saved:true
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
    this.applets = await fetchAppletDetails()
    this.applets.sort((a, b) => (a.appletOrder > b.appletOrder) ? 1 : -1)
    this.appletList = await this.getAppletNames();
    }
    
    


  getAppletNames = async()=> {
    this.appletList = [];
    this.appletList.push(this.props.language==="en"?" All Applets": " Tous les applets");
    for (let i = 0; i < this.applets.length; i++) {
      if(this.applets[i].appletOrder>=0)
      {
        this.appletList.push(this.props.language==="en"?this.applets[i].appletNameEn:this.applets[i].appletNameFr);
      }
    }
    return this.appletList;
  }

  getAppletCode =(appletIndex) => { 
     
     const index=parseInt(appletIndex)
     let selApplet = this.applets.find(
      (x) => x.appletOrder === index
    );

    return index===0?"ALL":(selApplet===undefined?"ALL":selApplet.appletCode);
    
    
}


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
  

 save=()=>{
   
  if(this.state.feedback.length>2)
    { 
      this.setState({saved:false})

 let email=this.props.email
    let feedback={agentEmail: email, appletCode: this.getAppletCode(this.state.selectedApplet), feedback:this.state.feedback}
    fetchSaveComment(feedback)

    setTimeout(() => {
      this.setState({saved:true})
    }, 1500)
  }  
 }



 handleAppletDropDownChange = (e) => {
  this.setState({ selectedApplet: e.target.value });
};

updateInputValue = (e) => {
  this.setState({ feedback: e.target.value });
};


  render() {
    const lang = this.props.language === "en" ? "Français" : "English";
    let style = {
        fontFamily: "Trebuchet MS",
        color: "#4775ae",
        fontWeight:"500",
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
        textDecoration:"overline",
        fontSize: "14px",
      };
    const en=this.props.language==="en"
    return (
      <div className="appletDiv" style={{ overflow: "auto", marginLeft:"20px" }}>
         <div className="UsageDiv" style={{width:"80%"}}>
          <h2 style={style}> {en?"Feedback:":"Commentaires:"}
          </h2>

          <div style={style3}>{en?"Your feedback is used to improve Toolkit Direct. Please note that feedback is not anonymous.":"Vos commentaires sont utilisés pour améliorer la boîte à outils directe. Veuillez noter que les commentaires ne sont pas anonymes."}</div>      
          <br/>
          <span style={style2}>
            {en?"by Applet:  ":"Par applet:  "}
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
                  return <option key={index} value={index}>{item}</option>;
                })}
              </select>
          <br />
          <div>
          <textarea
            id={5}
            className="inputField Text"
            style={{width:"100%", height:"250px"}}
            onFocus={this.handleFocus}
            onClick={this.select}
            type="text"
            value={this.state.feedback}
            onBlur={(evt) => this.updateInputValue(evt)}
            onChange={(evt) => this.updateInputValue(evt)}
          />
          <br/>
          <span style={{marginLeft:"15px", visibility:this.state.saved?"hidden":"visible"}}>{en?" ... done":" ... finie"}</span>
          <input
              className="roundedCornerCmd"
              onClick={this.save}
              type="button"
              value={en?"Submit":"Soumittre"}
            />
          </div>
          </span>
      </div>
      </div>
    );
  }
}
