import React, { Component } from "react";

export class GridButton extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick = () => {
    this.props.handleClickGridButton();
  };

  render() {
    return (
      <span>
        <img
          className={this.props.className}
          onClick={this.handleClick}
          id={this.props.id}
          alt={this.props.alt}
          src={this.props.src}
        />
      </span>
    );
  }
}
