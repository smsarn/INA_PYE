
import React, { Component } from "react";
import './html.css';
//import './print.css';
import Grid from '@mui/material/Grid';
//import PPIImg from './PPIImg';

export default class AgentPortfolio extends Component {

//export default function AgentPortfolio() {
  constructor(props) {
    super(props);
  }


  render() {
   
    
  
   const lang=this.props.lang; 
  //const [mode, setMode] = useState('html');
  //const [mode, setMode] = useState('print');

  const makeNavigatableURL = (url) => {
    if (!url.includes('https://')) {
      return `https://${url}`;
    }
    return url;
  };

  const makeReadableURL = (url) => {
    if (url.includes('https://')) {
      return url.replace(new RegExp('https://', 'gi'), '');
    }
    return url;
  };

  const advisorPortfolio = {
    advisorInformation: {
      firstName:this.props.agentPortfolio.firstname,
      lastName:this.props.agentPortfolio.lastname,
    
      jobTitle: this.props.agentPortfolio.title,
      designations:this.props.agentPortfolio.designations,
      phone:this.props.agentPortfolio.phone,
      extension: this.props.agentPortfolio.phone_ext,
    },
    businessInformation: {
      businessName:this.props.agentPortfolio.business_name,
      address:this.props.agentPortfolio.address,
      suite:this.props.agentPortfolio.suite,
      city:this.props.agentPortfolio.city,
      province:this.props.agentPortfolio.province,
      postalCode:this.props.agentPortfolio.postal_code,
      
    },
    socialMediaandLinks: {
      twitter:this.props.agentPortfolio.twitter,
      facebook:this.props.agentPortfolio.facebook,
      instagram:this.props.agentPortfolio.instagram,
      linkedin:this.props.agentPortfolio.linkedin,
      youtube:this.props.agentPortfolio.youtube,
      companyWebsite: this.props.agentPortfolio.website,
    },
    about: {
      biography:
      this.props.agentPortfolio.about,
    },
    images: {
      profileImage: this.props.agentPortfolio.profile_image_url,
      logo_url:this.props.agentPortfolio.logo_url,
      
    },
  };


console.log(advisorPortfolio.socialMediaandLinks)

  const ext= lang==="en"?"Extension":"Poste"

  return (
    <Grid container spacing={1}>
      {advisorPortfolio.images.profileImage && (
        
        this.props.aboutMeImageConvertedToBase64!==null?
        <Grid item xs={12}>
          <img id={this.props.imageID} width="200px"
          src= {this.props.aboutMeImageConvertedToBase64}
        />
        </Grid>

          :
          <Grid item xs={this.props.mode === 'html' ? 3 : 12}>
        <img crossorigin="anonymous" id={this.props.imageID}  width="100%" style={{overflow:"auto"}}
            src={advisorPortfolio.images.profileImage}
              /* src={`${advisorPortfolio.images.profileImage}?${
              this.props.mode === 'html'
                ? 'w=240&h=240&fit=fill&f=face'
                : 'w=180&h=180&fit=fill&f=face'
            }`} */
          />
        </Grid>
      )}
      <Grid item xs={this.props.mode === 'html' ? 9 : 6}>
        <Grid container>
          <Grid item xs={12}>
            <h3 className="h3 Trebuchet bold">
              {advisorPortfolio.advisorInformation.firstName}&nbsp;
              {advisorPortfolio.advisorInformation.lastName}
              {advisorPortfolio.advisorInformation.designations && (
                <>,&nbsp;{advisorPortfolio.advisorInformation.designations}</>
              )}
            </h3>
          </Grid>
          {advisorPortfolio.advisorInformation.jobTitle && (
            <Grid item xs={12}>
              <span className="h4 Trebuchet bold" style={{ padding: 0 }}>
                {advisorPortfolio.advisorInformation.jobTitle}
              </span>
            </Grid>
          )}
          {advisorPortfolio.about.biography && (
            <Grid item xs={12}>
              <span className="p Georgia">
                {advisorPortfolio.about.biography}
              </span>
            </Grid>
          )}
        </Grid>
      </Grid>
      {advisorPortfolio.advisorInformation.email && (
        <Grid item xs={12}>
          <span className="p Trebuchet bold headingColor">{lang==="en"?"Email:":"Courriel"}</span>
          &nbsp;
          <span className="p Trebuchet">
            {advisorPortfolio.advisorInformation.email}:
          </span>
        </Grid>
      )}
      {advisorPortfolio.advisorInformation.phone && (
        <Grid item xs={12}>
          <span className="p Trebuchet bold headingColor">{lang==="en"?"Phone":"Téléphone"}</span>
          &nbsp;
          <span className="p Trebuchet">
            {advisorPortfolio.advisorInformation.phone}
            {advisorPortfolio.advisorInformation.extension && (
              <>
              &nbsp;{ext}&nbsp;
                {advisorPortfolio.advisorInformation.extension}
              </>
            )}
          </span>
        </Grid>
      )}
      {advisorPortfolio.socialMediaandLinks.companyWebsite && (
        <Grid item xs={12}>
          <span className="p Trebuchet bold headingColor">{lang==="en"?"Website":"Site Web"}</span>
          &nbsp;
          <a
            className="p Trebuchet link"
            href={makeNavigatableURL(
              advisorPortfolio.socialMediaandLinks.companyWebsite
            )}
            target="_blank"
            rel="noreferrer"
          >
            {makeReadableURL(
              advisorPortfolio.socialMediaandLinks.companyWebsite
            )}
          </a>
        </Grid>
      )}
      {advisorPortfolio.businessInformation.address && (
        <Grid container item xs={12}>
          <Grid item xs={12}>
            <span className="p Trebuchet bold headingColor">{lang==="en"?"Address":"Adresse"}</span>
          </Grid>
          <Grid item xs={12}>
            <span className="p Trebuchet">
              {advisorPortfolio.businessInformation.businessName}
            </span>
          </Grid>
          <Grid item xs={12}>
            <span className="p Trebuchet">
              {advisorPortfolio.businessInformation.address}
            </span>
          </Grid>
          {advisorPortfolio.businessInformation.suite && (
            <Grid item xs={12}>
              <span className="p Trebuchet">
                {advisorPortfolio.businessInformation.suite}
              </span>
            </Grid>
          )}
          <Grid item xs={12}>
            <span className="p Trebuchet">
              {advisorPortfolio.businessInformation.city},&nbsp;
              {advisorPortfolio.businessInformation.province}&nbsp;
              {advisorPortfolio.businessInformation.postalCode}
            </span>
          </Grid>
        </Grid>
      )}
      {(advisorPortfolio.socialMediaandLinks.twitter ||
        advisorPortfolio.socialMediaandLinks.facebook ||
        advisorPortfolio.socialMediaandLinks.linkedIn ||
        advisorPortfolio.socialMediaandLinks.instagram ||
        advisorPortfolio.socialMediaandLinks.youTube) && (
        <Grid container item xs={12} spacing={1}   style={{marginLeft:"-8px"}} >
          <Grid item xs={12}>
            <span className="p Trebuchet bold headingColor">{lang==="en"?"Social Media":"Médias sociaux"}</span>
          </Grid>
          {advisorPortfolio.socialMediaandLinks.twitter && (
            <Grid container item xs={12} spacing={1} alignItems="center" >
              <Grid item style={{paddingLeft:"0px"}}>
                {/* <img src="./images/social.media.icons_28x28px_twitter.svg" /> */}
                <img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyOCIgaGVpZ2h0PSIyOCIgdmlld0JveD0iMCAwIDI4IDI4Ij48ZGVmcz48c3R5bGU+LmNscy0xe2ZpbGw6I2ZmZjt9LmNscy0ye2ZpbGw6IzQ3NzVhZTt9PC9zdHlsZT48L2RlZnM+PHBhdGggY2xhc3M9ImNscy0yIiBkPSJNMjUuOTMsMEgyLjA3Qy45MywwLDAsLjksMCwyLjAyVjI1Ljk4YzAsMS4xMiwuOTMsMi4wMiwyLjA3LDIuMDJIMjUuOTNjMS4xNCwwLDIuMDctLjkxLDIuMDctMi4wMlYyLjAyYzAtMS4xMS0uOTMtMi4wMi0yLjA3LTIuMDJaIi8+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMTAuNjksMjMuMTRjOC4yMiwwLDEyLjcxLTYuODEsMTIuNzEtMTIuNzEsMC0uMTksMC0uMzktLjAxLS41OCwuODctLjYzLDEuNjMtMS40MiwyLjIzLTIuMzEtLjgsLjM2LTEuNjYsLjYtMi41NywuNywuOTItLjU1LDEuNjMtMS40MywxLjk2LTIuNDctLjg2LC41MS0xLjgyLC44OC0yLjg0LDEuMDgtLjgyLS44Ny0xLjk4LTEuNDEtMy4yNi0xLjQxLTIuNDcsMC00LjQ3LDItNC40Nyw0LjQ3LDAsLjM1LC4wNCwuNjksLjEyLDEuMDItMy43MS0uMTktNy0xLjk2LTkuMjEtNC42Ny0uMzgsLjY2LS42LDEuNDMtLjYsMi4yNSwwLDEuNTUsLjc5LDIuOTIsMS45OSwzLjcyLS43My0uMDItMS40Mi0uMjItMi4wMi0uNTYsMCwuMDIsMCwuMDQsMCwuMDYsMCwyLjE2LDEuNTQsMy45NywzLjU4LDQuMzgtLjM4LC4xLS43NywuMTYtMS4xOCwuMTYtLjI5LDAtLjU3LS4wMy0uODQtLjA4LC41NywxLjc3LDIuMjIsMy4wNyw0LjE3LDMuMS0xLjUzLDEuMi0zLjQ1LDEuOTEtNS41NSwxLjkxLS4zNiwwLS43Mi0uMDItMS4wNy0uMDYsMS45OCwxLjI3LDQuMzIsMi4wMSw2Ljg1LDIuMDEiLz48L3N2Zz4="/>
              </Grid>
              <Grid item>
                <a
                  className="p Trebuchet link"
                  href={makeNavigatableURL(
                    advisorPortfolio.socialMediaandLinks.twitter
                  )}
                  target="_blank"
                  rel="noreferrer"
                >
                  {makeReadableURL(
                    advisorPortfolio.socialMediaandLinks.twitter
                  )}
                </a>
              </Grid>
            </Grid>
          )}
          {advisorPortfolio.socialMediaandLinks.facebook && (
            <Grid container item xs={12} spacing={1} alignItems="center" >
              <Grid item style={{paddingLeft:"0px"}}>
                {/* <img src="./images/social.media.icons_28x28px_facebook.svg" /> */}
                <img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyOCIgaGVpZ2h0PSIyOCIgdmlld0JveD0iMCAwIDI4IDI4Ij48ZGVmcz48c3R5bGU+LmNscy0xe2ZpbGw6I2ZmZjt9LmNscy0ye2ZpbGw6IzQ3NzVhZTt9PC9zdHlsZT48L2RlZnM+PHBhdGggY2xhc3M9ImNscy0yIiBkPSJNMjYuNDUsMEgxLjU1Qy42OSwwLDAsLjY5LDAsMS41NVYyNi40NWMwLC44NSwuNjksMS41NSwxLjU1LDEuNTVIMTQuOTZ2LTEwLjgzaC0zLjY0di00LjI0aDMuNjR2LTMuMTJjMC0zLjYyLDIuMjEtNS41OSw1LjQzLTUuNTksMS41NSwwLDIuODcsLjEyLDMuMjYsLjE3djMuNzhoLTIuMjJjLTEuNzYsMC0yLjEsLjg0LTIuMSwyLjA2djIuN2g0LjJsLS41NSw0LjI0aC0zLjY1djEwLjgzaDcuMTJjLjg1LDAsMS41NS0uNjksMS41NS0xLjU1VjEuNTVjMC0uODUtLjY5LTEuNTUtMS41NS0xLjU1WiIvPjxwYXRoIGlkPSJmIiBjbGFzcz0iY2xzLTEiIGQ9Ik0xOS4zMywyOHYtMTAuODNoMy42NWwuNTUtNC4yNGgtNC4ydi0yLjdjMC0xLjIyLC4zNC0yLjA2LDIuMS0yLjA2aDIuMjJ2LTMuNzhjLS4zOS0uMDUtMS43Mi0uMTctMy4yNi0uMTctMy4yMywwLTUuNDMsMS45Ny01LjQzLDUuNTl2My4xMmgtMy42NHY0LjI0aDMuNjR2MTAuODNoNC4zOFoiLz48L3N2Zz4="/>
              </Grid>
              <Grid item>
                <a
                  className="p Trebuchet link"
                  href={makeNavigatableURL(
                    advisorPortfolio.socialMediaandLinks.facebook
                  )}
                  target="_blank"
                  rel="noreferrer"
                >
                  {makeReadableURL(
                    advisorPortfolio.socialMediaandLinks.facebook
                  )}
                </a>
              </Grid>
            </Grid>
          )}
          {advisorPortfolio.socialMediaandLinks.linkedin && (
            <Grid container item xs={12} spacing={1} alignItems="center" >
              <Grid item style={{paddingLeft:"0px"}}>
               {/*  <img src="./images/social.media.icons_28x28px_linkedin.svg" /> */}
                <img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyOCIgaGVpZ2h0PSIyOCIgdmlld0JveD0iMCAwIDI4IDI4Ij48ZGVmcz48c3R5bGU+LmNscy0xe2ZpbGw6IzQ3NzVhZTt9PC9zdHlsZT48L2RlZnM+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMjUuOTMsMEgyLjA3Qy45MywwLDAsLjksMCwyLjAyVjI1Ljk4YzAsMS4xMiwuOTMsMi4wMiwyLjA3LDIuMDJIMjUuOTNjMS4xNCwwLDIuMDctLjkxLDIuMDctMi4wMlYyLjAyYzAtMS4xMS0uOTMtMi4wMi0yLjA3LTIuMDJaTTguMzEsMjMuODZINC4xNVYxMC41aDQuMTZ2MTMuMzZabS0yLjA4LTE1LjE5Yy0xLjMzLDAtMi40MS0xLjA4LTIuNDEtMi40MXMxLjA3LTIuNDEsMi40MS0yLjQxLDIuNDEsMS4wOCwyLjQxLDIuNDEtMS4wOCwyLjQxLTIuNDEsMi40MVptMTcuNjMsMTUuMTloLTQuMTV2LTYuNWMwLTEuNTUtLjAzLTMuNTQtMi4xNi0zLjU0cy0yLjQ5LDEuNjktMi40OSwzLjQzdjYuNjFoLTQuMTVWMTAuNWgzLjk4djEuODNoLjA2Yy41NS0xLjA1LDEuOTEtMi4xNiwzLjkzLTIuMTYsNC4yLDAsNC45OCwyLjc3LDQuOTgsNi4zN3Y3LjMzWiIvPjwvc3ZnPg=="/>
              
              </Grid>
              <Grid item>
                <a
                  className="p Trebuchet link"
                  href={makeNavigatableURL(
                    advisorPortfolio.socialMediaandLinks.linkedin
                  )}
                  target="_blank"
                  rel="noreferrer"
                >
                  {makeReadableURL(
                    advisorPortfolio.socialMediaandLinks.linkedin
                  )}
                </a>
              </Grid>
            </Grid>
          )}
          {advisorPortfolio.socialMediaandLinks.instagram && (
            <Grid container item xs={12} spacing={1} alignItems="center" >
              <Grid item style={{paddingLeft:"0px"}}>
              {/*   <img src="./images/social.media.icons_28x28px__instagram.svg" /> */}
              <img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyOCIgaGVpZ2h0PSIyOCIgdmlld0JveD0iMCAwIDI4IDI4Ij48ZGVmcz48c3R5bGU+LmNscy0xe2ZpbGw6IzQ3NzVhZTt9PC9zdHlsZT48L2RlZnM+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMTguOTIsNC43Mkg5LjA4Yy0yLjQxLDAtNC4zNiwxLjk1LTQuMzYsNC4zNnY5Ljg0YzAsMi40MSwxLjk1LDQuMzYsNC4zNiw0LjM2aDkuODRjMi40MSwwLDQuMzYtMS45NSw0LjM2LTQuMzZWOS4wOGMwLTIuNDEtMS45NS00LjM2LTQuMzYtNC4zNlptLTQuODcsMTQuOTJjLTMuMDksMC01LjYtMi41MS01LjYtNS42czIuNTEtNS42LDUuNi01LjYsNS42LDIuNTEsNS42LDUuNi0yLjUxLDUuNi01LjYsNS42Wm01LjktMTAuMjFjLS43MiwwLTEuMy0uNTgtMS4zLTEuM3MuNTgtMS4zLDEuMy0xLjMsMS4zLC41OCwxLjMsMS4zLS41OCwxLjMtMS4zLDEuM1oiLz48Y2lyY2xlIGNsYXNzPSJjbHMtMSIgY3g9IjE0LjA0IiBjeT0iMTQuMDQiIHI9IjMuNjMiLz48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0yNS45MywwSDIuMDdDLjkzLDAsMCwuOSwwLDIuMDJWMjUuOThjMCwxLjEyLC45MywyLjAyLDIuMDcsMi4wMkgyNS45M2MxLjE0LDAsMi4wNy0uOTEsMi4wNy0yLjAyVjIuMDJjMC0xLjExLS45My0yLjAyLTIuMDctMi4wMlptLS43MywxOS4wNWMwLDMuNC0yLjc1LDYuMTUtNi4xNSw2LjE1SDguOTVjLTMuNCwwLTYuMTUtMi43NS02LjE1LTYuMTVWOC45NWMwLTMuNCwyLjc1LTYuMTUsNi4xNS02LjE1aDEwLjFjMy40LDAsNi4xNSwyLjc1LDYuMTUsNi4xNXYxMC4xWiIvPjwvc3ZnPg=="/>
              </Grid>
              <Grid item>
                <a
                  className="p Trebuchet link"
                  href={makeNavigatableURL(
                    advisorPortfolio.socialMediaandLinks.instagram
                  )}
                  target="_blank"
                  rel="noreferrer"
                >
                  {makeReadableURL(
                    advisorPortfolio.socialMediaandLinks.instagram
                  )}
                </a>
              </Grid>
            </Grid>
          )}

          {advisorPortfolio.socialMediaandLinks.youtube && (
            <Grid container item xs={12} spacing={1} alignItems="center" >
              <Grid item style={{paddingLeft:"0px"}}>
              {/*   <img src="./images/social.media.icons_28x28px__youtube.svg" /> */}
              <img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyOCIgaGVpZ2h0PSIyOCIgdmlld0JveD0iMCAwIDI4IDI4Ij48ZGVmcz48c3R5bGU+LmNscy0xe2ZpbGw6IzQ3NzVhZTt9PC9zdHlsZT48L2RlZnM+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMjUuOTMsMEgyLjA3Qy45MywwLDAsLjksMCwyLjAyVjI1Ljk4YzAsMS4xMiwuOTMsMi4wMiwyLjA3LDIuMDJIMjUuOTNjMS4xNCwwLDIuMDctLjkxLDIuMDctMi4wMlYyLjAyYzAtMS4xMS0uOTMtMi4wMi0yLjA3LTIuMDJabS01LjI5LDE0LjZsLTEwLjg0LDUuMTdjLS4yOSwuMTQtLjYyLS4wNy0uNjItLjM5VjguNzFjMC0uMzIsLjM0LS41NCwuNjMtLjM5bDEwLjg0LDUuNWMuMzIsLjE2LC4zMiwuNjMsMCwuNzhaIi8+PC9zdmc+"/>
              
              </Grid>
              <Grid item>
                <a
                  className="p Trebuchet link"
                  href={makeNavigatableURL(
                    advisorPortfolio.socialMediaandLinks.youtube
                  )}
                  target="_blank"
                  rel="noreferrer"
                >
                  {makeReadableURL(
                    advisorPortfolio.socialMediaandLinks.youtube
                  )}
                </a>
              </Grid>
            </Grid>
          )}
        </Grid>
      )}
    </Grid>
  );
}
}