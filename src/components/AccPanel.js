import React, { Component } from "react";

export class Collapsible extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: this.props.openForce,
      openParent: this.props.openParent
    };
    this.togglePanel = this.togglePanel.bind(this);
  }
  componentWillReceiveProps(nextProps) {
       this.setState({ open: nextProps.openForce });
  }
  togglePanel(e) {
    if (this.props.id === "7") this.props.callAPI(this.state.open);
    this.props.handleClick();
    if (this.props.openForce) this.setState({ open: true, openParent: true });
    else this.setState({ open: !this.state.open, openParent: true });
  }
  render() {
     const arr =
      this.state.open && this.state.openParent ? (
        <span style={{ fontSize: "14px", float: "right" }}>&#9650;</span>
      ) : (
        <span style={{ fontSize: "14px", float: "right" }}>&#9660;</span>
      );
    return (
      <div>
        <div onClick={e => this.togglePanel(e)} className="header">
          {this.props.title}
          {arr}
        </div>
        {this.state.open && this.state.openParent ? (
          <div className="content">{this.props.children}</div>
        ) : null}
      </div>
    );
  }
}
