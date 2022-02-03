import React, { Component } from "react";

export class AddRemove extends React.Component {
  constructor(props) {
    super(props);
    this.doAdd = this.doAdd.bind(this);
    this.doRemove = this.doRemove.bind(this);
  }

  doRemove = (id) => {
    if (!this.props.disabled && !this.props.disabledRemove )
      this.props.handleDoRemove(id);
  };

  doAdd = () => {
    if (!this.props.disabled)
      this.props.handleDoAdd();
  };

  render() {
    const noRow = 0; //this.props.minComps === 2 ? 2 : 0;
    let className="addRemove";
    let classNameRemove="addRemove";
    if(this.props.disabled)
    {
      className="addRemove addRemoveDisabled";
      classNameRemove="addRemove addRemoveDisabled";
    }  
    if(this.props.disabledRemove)
      classNameRemove="addRemove addRemoveDisabledRemove";
    
	let minRows = this.props.minComps;
    const maxRows=this.props.maxRows === undefined?100:this.props.maxRows;
    
    if (minRows === undefined) minRows = 1;
    var returnAR = "";

    
    if (
      (this.props.currentID >= this.props.numberComps ||
      this.props.numberComps === 0) && this.props.currentID < maxRows
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
    return returnAR;
  }
}
