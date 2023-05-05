import React, { Component } from "react";
import { PopupUserinputDialog } from "./PopupUserInput";

export class AddRemove extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showConfirm: false,
    };
    this.confirmedID=-1;
    this.doAdd = this.doAdd.bind(this);
    this.doRemove = this.doRemove.bind(this);
  }

  respondToConfirmRemove = (OK) => {
    this.setState({ showConfirm: false });
    if(OK)
    {
      this.props.handleDoRemove(this.confirmedID);      
    } 
  };

  doRemove = (id) => {
    if (!this.props.disabled && !this.props.disabledRemove) {
      this.confirmedID = id;
      this.setState({ showConfirm: true });
    }
  };

  doAdd = () => {
    if (!this.props.disabled) this.props.handleDoAdd();
  };

  render() {
    const lang=this.props.lang;
    const noRow = 0; //this.props.minComps === 2 ? 2 : 0;
    let className = "addRemove";
    let classNameRemove = "addRemove";
    if (this.props.disabled) {
      className = "addRemove addRemoveDisabled";
      classNameRemove = "addRemove addRemoveDisabled";
    }
    if (this.props.disabledRemove)
      classNameRemove = "addRemove addRemoveDisabledRemove";

    let minRows = this.props.minComps;
    const maxRows = this.props.maxRows === undefined ? 100 : this.props.maxRows;

    if (minRows === undefined) minRows = 1;
    var returnAR = "";

    if (
      (this.props.currentID >= this.props.numberComps ||
        this.props.numberComps === 0) &&
      this.props.currentID < maxRows
    ) {
      returnAR = (
        <span>
          <button className={className} onClick={this.doAdd}>
            +
          </button>
        </span>
      );
      if (
        (minRows > 1 && this.props.currentID > minRows) ||
        this.props.currentID > minRows
      )
        returnAR = (
          <span>
            <button className={className} onClick={this.doAdd}>
              +
            </button>
            <button
              className={classNameRemove}
              onClick={() => {
                this.doRemove(this.props.currentID);
              }}
            >
              -
            </button>
          </span>
        );
    } else if (
      !(this.props.fixedFirstRow === true && this.props.currentID === 1) &&
      (this.props.currentID > minRows || minRows <= 1)
    )
      returnAR = (
        <span>
          <button
            className={classNameRemove}
            onClick={() => {
              this.doRemove(this.props.currentID);
            }}
          >
            -
          </button>
        </span>
      );
    return    <div>
      {returnAR}
      <div style={{ height: "0px" }}>
        <PopupUserinputDialog
          openDialog={this.state.showConfirm === true}
          mainMessage={lang==="en"?"Please confirm to remove ... ":"Veuillez confirmer pour supprimer ... "}
          language={lang}
          respondToInput={this.respondToConfirmRemove}
        />
      </div>
    </div>;
  }
}
