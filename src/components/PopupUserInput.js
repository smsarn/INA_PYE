import React, { Component } from 'react';
import { Dialog, Button, Card, CardContent, Typography } from '@material-ui/core'
import { DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';

import { Info } from "./Info";
import {
  getInfoSave
} from "../definitions/infoIconsDefinitions.js";


const MESSAGES = {
  en: {
  saveAs1: "To save files in your desired location: ",
  saveAs2: " - Microsoft Edge: select 'SaveAs' when prompted ",
  saveAs3: " - Google Chrome: make a one time change: ",
  saveAs4: "go to Settings - Advanced - Downloads and turn on ",
  saveAs5: "'Ask where to save each file before downloading"
  
  },
  fr: {
  saveAs1: "To save files in your desired location: ^F",
  saveAs2: " - Microsoft Edge: select 'SaveAs' when prompted  ^F",
  saveAs3: " - Google Chrome: make a one time change:  ^F",
  saveAs4: "go to Settings - Advanced - Downloads and turn on  ^F",
  saveAs5: "'Ask where to save each file before downloading  ^F"
  
  }
};


const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));


export class PopupUserinputDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: this.props.openDialog,
      name: '',
      showInfo: false
    }
  };


  componentWillReceiveProps(nextProps) {
    if (nextProps !== this.props) {

      this.setState({
        open: nextProps.openDialog
      })
    }
  }

  handleOK = () => {
    this.props.respondToInput(this.state.name)
    this.setState({
      open: !this.state.open
    })
  }


  handleCancel = () => {
    this.props.respondToInput("")
    this.setState({
      open: !this.state.open
    })
  }


  handleInfo = () => {
    this.setState({
      showInfo: !this.state.showInfo
    })
  }



  render() {

    const handleChange = evt => {


      this.setState({
        name: evt.target.value
      }

      )


    }
    const infoIcon = getInfoSave(this.props.language);
    var sourceEdge = require('../images/chooseButton.png');
    var sourceChrome = require('../images/chooseButtonChrome.png');
    var optionsEdge = require('../images/optionsEdge.png');
    var optionsChrome = require('../images/optionsChrome.png');

    const message=MESSAGES[this.props.language]

    
    return (

      <div>

       {/*  <Button/> */}
        <Dialog
          open={this.state.open}
          onClose={this.handleToggle}
          aria-labelledby="confirm-dialog"

        >
          <DialogTitle id="confirm-dialog"></DialogTitle>
          <DialogContent >
            <DialogContentText><span className="dialog">Save to File</span>
            </DialogContentText>

            <form>
              <TextField
                id="1"
                label="file name"
                value={this.state.name}
                onChange={handleChange}
                margin="normal">
              </TextField>


            </form>
          </DialogContent>
           
          <DialogActions style={{ paddingRight: '12px', paddingBottom: '10px' }}>
          <div  style={{ marginLeft: '10px'}}><Info  infoIcon={infoIcon}/>
          {/* <Button onClick={this.handleInfo} variant="contained"> <span className="dialog"> Instructions </span></Button> */}
          <Button onClick={this.handleCancel} variant="contained"   style={{ marginLeft: '222px', marginRight: '8px'}} > <span className="dialog"> Cancel </span></Button>
            <Button onClick={this.handleOK} variant="contained"> <span className="dialog"> OK </span></Button></div>
            
          </DialogActions>
          {this.state.showInfo &&
            <Card> <CardContent>
              <Typography variant="body2" color="textSecondary" component="p">
                <div>
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
              
              </li></ul></div>
             
          </Typography>
         
        </CardContent></Card>}
         
        </Dialog>

      </div >

    )


  }
}