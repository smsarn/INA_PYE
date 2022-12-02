import React, { Component } from 'react';
import { Dialog, Button, Card, CardContent, Typography } from '@material-ui/core'
import { DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';

import { Info } from "./Info";
/* import {
  getInfoSave
} from "../definitions/infoIconsDefinitions.js";
 */

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
    this.props.respondToInput(true, this.state.name)
    this.setState({
      open: !this.state.open
    })
  }


  handleCancel = () => {
    this.props.respondToInput(false, "")
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
    /* const infoIcon = getInfoSave(this.props.language); */
    const infoIcon = this.props.infoIcon;
    
    return (

      <div>
        <Dialog
          open={this.state.open}
          onClose={this.handleToggle}
          aria-labelledby="confirm-dialog">
          <DialogTitle id="confirm-dialog"></DialogTitle>
          <DialogContent >
            {/* <DialogContentText><span className="dialog">{this.props.language==="en"?"Save to File":"Enregistrer dans un fichier"}</span>   */}
            <DialogContentText><span className="dialog">{this.props.mainMessage}</span>  
            </DialogContentText>
            {this.props.formMessage!== undefined && <form>
              <TextField
                id="1"
               /*  label={this.props.language==="en"?"file name":"nom de fichier"} */
                label={this.props.formMessage}
                value={this.state.name}
                onChange={handleChange}
                margin="normal">
              </TextField>
            </form>}
          </DialogContent>
           
          <DialogActions style={{ paddingRight: '12px', paddingBottom: '10px' }}>
          {infoIcon!==undefined && <span  style={{ height:"50px", marginLeft: '10px'}}><Info  infoIcon={infoIcon}/></span>}<br/>
          {/* <Button onClick={this.handleInfo} variant="contained"> <span className="dialog"> Instructions </span></Button> */}
          <Button onClick={this.handleCancel} variant="contained"   style={{marginLeft: this.props.language==="en"?"222px":"340px", marginRight:"8px"}} > <span className="dialog"> {this.props.language==="en"?"Cancel":"Annuler"} </span></Button>
          <Button onClick={this.handleOK} variant="contained"> <span className="dialog"> OK </span></Button>
            
          </DialogActions>
          </Dialog>

      </div >

    )


  }
}