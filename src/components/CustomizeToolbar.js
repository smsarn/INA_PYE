
import React, { Component } from "react";
import { PopupMessage } from "./PopupMessage";
import { OUTPUTTEXT } from "../definitions/outputDefinitions";
import {
  handleFetchAdvisorPortfolio
} from "../utils/FetchAPIs";
import { Switch } from '@material-ui/core';
import {
  CONTROLTITLE,
} from "../definitions/generalDefinitions";
import { withStyles } from "@material-ui/core/styles";
import { Info } from "./Info";
import { getInfoPDF } from "../definitions/infoIconsDefinitions";

const REACT_APP_ADVISOR_PROFILE_EN = "https://advisor.ppisolutions.ca/sites/ppisolutions/en/tools/Pages/your-link-between.aspx?src=tkd"
const REACT_APP_ADVISOR_PROFILE_FR = "https://advisor.ppisolutions.ca/sites/ppisolutions/fr/outils/Pages/votre-interconnexion.aspx?src=tkd"


const styles = theme => ({
  switchBase: {
    color: "rgb(235,235,235)",
    "&$checked": {
      color:"#4775ae" 
    },
    "&$checked + $track": {
      backgroundColor:"rgb(117, 134, 145)"
    }
  },
  checked: {},
  track: {
    backgroundColor: "rgb(117, 134, 145)",
  }
});


class CustomizeToolbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      aboutMe:this.props.aboutMe,
      includeAboutMe:true,
      refreshAboutMe:false,
    };
    this.showLogo="none"
    this.showAppletImage="none"
  }

  
  toggleCheckbox=()=>
  {
    const include=!this.state.includeAboutMe;
    this.setState(
      { includeAboutMe: include }, this.props.toggleCheckbox(include))
  }

  doAboutMe=async()=>{
    if(this.state.refreshAboutMe)
    {
      const aboutMeQuery= await handleFetchAdvisorPortfolio(this.props.token)
      this.setState({aboutMe: aboutMeQuery,refreshAboutMe:false }, this.props.updateAboutMe(aboutMeQuery))
      
    }  
    else
    {
      this.setState({refreshAboutMe:true});
      window.open(this.props.lang==="en"?REACT_APP_ADVISOR_PROFILE_EN:REACT_APP_ADVISOR_PROFILE_FR, '_blank', 'noreferrer');
    }
  }


render(){
  const { classes } = this.props;
  const lang = this.props.lang;

  const labelsBilingual = OUTPUTTEXT[lang];
  const aboutMeExists = this.state.aboutMe!==undefined && this.state.aboutMe.lastname!==undefined
 const pdfInfo=<div>{CONTROLTITLE[lang].pdf} {this.props.info && <div
      style={{
        //   width: "80px",
        marginTop: "4px",
        paddingRight: "12px",
        paddingLeft: "10px",
        float: "right",
        
      }}
    >
      <Info infoIcon={getInfoPDF(lang)} />
    </div>}</div>

return(  <div style={{ float: "none" }}>
          {this.state.refreshAboutMe && (
                <PopupMessage
                  severity={"warning"}
                  messageTitle={labelsBilingual.toolCustomizeAboutRefreshMsg}
                  openDialog={this.state.refreshAboutMe}
                  respondToMessage={()=>{return;}}
                ></PopupMessage>
              )}
         <div style={{ width: "100%" }}>
          <fieldset
            style={{
             /*  marginTop: PDFTopMargin - 35 + "px", */
              marginRight: "0px",
              paddingRight: "8px",
              float: "right",
              borderRadius: "5px",
            }}
          >

            <legend>{labelsBilingual.toolCustomizeTitle}</legend>
              <div className="customizationCmdsDiv">
                  
              {aboutMeExists && <span style={{float:"left", whiteSpace: "nowrap"}}>
                    <Switch 
                    focusVisibleClassName={classes.focusVisible}
                    disableRipple
                    classes={{
                      root: classes.root,
                      switchBase: classes.switchBase,
                      thumb: classes.thumb,
                      track: classes.track,
                      checked: classes.checked
                    }}

                            checked={this.state.includeAboutMe}
                            onChange={this.toggleCheckbox}
                      
                  />
                    {labelsBilingual.toolCustomizeIncludeAboutMe}     
                    
                </span>}
               
                  <input style={{float:"left",display:"inline-block"}}
                    className={this.state.refreshAboutMe?"customizationCmd glow":"customizationCmd"} 
                    onClick={this.doAboutMe}
                    type="button"
                    value={aboutMeExists && this.state.refreshAboutMe===false?labelsBilingual.toolCustomizeAboutEdit:(this.state.refreshAboutMe?labelsBilingual.toolCustomizeAboutRefresh:labelsBilingual.toolCustomizeAboutAdd)}
                  />
                
                  <input
                    className="customizationCmd"
                   
                    onClick={() => {
                      this.showLogo = "block";
                      var logoCtrls=document.getElementById(this.props.images.imagePackageIDLogo)
                      var logoCtrlsButton=document.getElementById("button" + this.props.images.imagePackageIDLogo)
                      if (logoCtrls!==null && logoCtrlsButton!==null)
                      {
                        logoCtrls.style.display = "block";
                        logoCtrlsButton.click();
                      }
                    }}
                    type="button"
                    value={labelsBilingual.toolCustomizeLogo}
                  />
                  <input
                    className="customizationCmd"
                    onClick={() => {
                      this.showAppletImage = "block";
                      // never show cover image selection
                      
                        document.getElementById(
                        this.props.images.imagePackageIDApplet
                      ).style.display = "none"; //"block"
                      if(this.props.defaltCover)
                      {
                        document.getElementById("button" + this.props.images.imagePackageIDApplet)
                        .click();
                        }
                        else
                        {
                          this.props.restoreCover()
                        }
                        
                     
                    }}
                    type="button"
                    value={this.props.defaltCover?labelsBilingual.toolCustomizeCover:labelsBilingual.toolCustomizeCoverRestore}
                  />
                  <input
                    className="customizationCmd"
                    onClick={this.props.editPres}
                    type="button"
                    value={labelsBilingual.toolCustomizeAdv}
                  />
                  <button
                    className="customizationCmd"
                    
                    onClick={() => {this.props.doPDF();}}
                    type="button"
                    value="pdfInfo_c"
                  >{pdfInfo}</button>
        
        </div>
          </fieldset>
          </div>    
          <div className="presentation">       
          <div className="presentationItem page ">
          <div className="INA_MuiGrid-root INA_MuiGrid-container page-wrapper">
          
          <div style={{ display: this.showLogo, clear:"both" }}>
            {this.props.images.logo1stPage}
          </div>
          </div>
          </div>
          </div>
          <div style={{ display: this.showAppletImage }}>
            {this.props.images.applet}
          </div>
</div>)

}
}
export default withStyles(styles, { withTheme: true })(CustomizeToolbar);