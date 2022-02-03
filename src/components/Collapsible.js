import React, { Component } from "react";
import { Info } from "./Info";

export class Collapsible extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: this.props.openCollapsible.open,
      id: this.props.openCollapsible.id,
    };
    // console.log(this.state)
  }
  componentWillReceiveProps(nextProps) {
    if (this.state.open !== nextProps.openCollapsible.open)
      this.setState({
        open: nextProps.openCollapsible.open,
        id: nextProps.openCollapsible.id,
      });
  }

  togglePanel = async (e) => {
    if(this.props.enabled!==false)
      {
    await this.props.handleCollapsibleClick({
      id: this.state.id,
      open: this.state.open,
    });
    this.setState({ open: !this.state.open });
  }
  };
  render() {
    const arr = this.state.open ? (
      <span style={{ fontSize: "14px", float: "right" }}>&#9650;</span>
    ) : (
      <span style={{ fontSize: "14px", float: "right" }}>&#9660;</span>
    );
    return (
      <div >
        <div onClick={this.togglePanel} className="header">
          {this.props.title}
          {this.props.infoIcon !== undefined && <Info infoIcon={this.props.infoIcon} /> }
             {arr}
        </div>
        {this.state.open ? (
          <div className="content">{this.props.children}</div>
        ) : null}
      </div>
    );
  }
}
