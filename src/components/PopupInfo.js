import React, { Component } from 'react';
import { Box, Card, CardContent, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

import {
  getInfoSave
} from "../definitions/infoIconsDefinitions.js";



export class PopupInfoDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: this.props.infoIcon.popupOpenByProps,
      name: '',
      showInfo: false
    }
  };


  componentWillReceiveProps(nextProps) {
    if (nextProps !== this.props) {

      this.setState({
        open: nextProps.infoIcon.popupOpenByProps
      })
    }
  }

  render() {

    const theme = createMuiTheme({
      typography: {
        fontFamily: '"Trebuchet MS"',
        fontSize: 12,
        color: 'red',      
      },
    })  

    return (

    

<Box width="100%" border={2} borderColor={ this.props.infoIcon.popupBorderColor} borderRadius={5}>
        <Card> <CardContent >
        <ThemeProvider theme={theme}>
          <Typography color="textPrimary" component="p" >
                {this.props.infoIcon.infoText}
             
               {/*  <div>
                To save files in your desired location:<ul><li>Microsofrft Edge:
              <ul>
                <li>Go to Options {this.state.showInfo && <img  alt="info" src={optionsEdge}  />} </li>
                <li>Click Downlods - Click Download settings</li>
                <li>Turn on "Ask where to save each file before downloading" {this.state.showInfo && <img  alt="info" src={sourceEdge}  />}
              </li>
               </ul>
               </li><li>Google Chrome:
               <ul>
               <li>Go to Options {this.state.showInfo && <img  alt="info" src={optionsChrome}  />} </li>
                <li>Click Settings - Advanced - Downloads</li>
                <li>Turn on "Ask where to save each file before downloading" {this.state.showInfo && <img  alt="info" src={sourceChrome}  />}
                </li>
               </ul>
              
              </li></ul></div> */}
             
          </Typography>
          </ThemeProvider>
         
        </CardContent></Card>
        </Box>
 
    )


  }
}