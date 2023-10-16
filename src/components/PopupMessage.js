import React, { Component } from "react";
import { Dialog, Button } from "@material-ui/core";
import {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@material-ui/core";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
//import IconButton from '@material-ui/core/IconButton';
//import CloseIcon from '@material-ui/icons/Close';
//import { withStyles } from '@material-ui/core/styles';
import SnackbarContent from "@material-ui/core/SnackbarContent";

//

export class PopupMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: this.props.openDialog,
      showInfo: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps !== this.props) {
      this.setState({
        open: nextProps.openDialog,
      });
    }
  }

  handleToClose = (event, reason) => {
    if ("clickaway" == reason) return;
    this.setState({ open: false });
    this.props.respondToMessage();
  };

  render() {
    const severity = this.props.severity; // this.props.success===1?'success':(this.props.success===0?'info':"error")
    return (
      <div
        style={{
          position: "fixed",
          top: "5px",
          height: "30px",
          marginTop: "20px",
          minWidth: "80px",
          maxWidth: "380px",
          left: "52%",
          transform: "translate(-50%, -50%)",
          zIndex: "1112",
        }}
      >
        <Alert severity={severity}>{this.props.messageTitle}</Alert>

        <Snackbar
          style={{ top: "0", height: "0px", display: "none" }}
          open={this.state.open}
          autoHideDuration={
            this.props.time === undefined ? 5000 : this.props.time
          }
          onClose={this.handleToClose}
          //       onClose={() => {this.setState({open: false}); this.props.respondToMessage()}}
        ></Snackbar>
      </div>
    );
  }
}
