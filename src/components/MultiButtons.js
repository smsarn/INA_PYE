import React, { Component } from "react";

export class MultiButtons extends React.Component {
  constructor(props) {
    super(props);
    const buttonsDefault = this.setupButtons(
      this.props.selected,
      this.props.noButtons,
      this.props.buttonCaption
    );
    this.state = {
      buttons: buttonsDefault,
    };
  }

 /*  getDerivedStateFromProps(){

  } */

  componentWillReceiveProps(nextProps) {
    const buttonsDefault = this.setupButtons(
      nextProps.selected,
      nextProps.noButtons,
      nextProps.buttonCaption
    );
    this.setState({ buttons: buttonsDefault });
  }

  setupButtons = (selected, noButtons, buttonCaption) => {
    selected = selected === undefined ? 0 : selected - 1;
    let buttonsDefault = [];
    let i;
    for (i = 0; i < noButtons; ++i) {
      if (i === selected)
        buttonsDefault.push({
          id: selected,
          name: buttonCaption[selected],
          style:
            noButtons === 1
              ? "roundedCornerCmd"
              : "multiButtons multiButtonsAct",
        });
      else
        buttonsDefault.push({
          id: i,
          name: buttonCaption[i],
          style: "multiButtons",
        });
    }
    return buttonsDefault;
  };

  selectButton = (index) => {
    let buttonsDefault = this.state.buttons;
    let i;
    for (i = 0; i < this.props.noButtons; ++i) {
      buttonsDefault[i].style =
        buttonsDefault[i].id === index
          ? "multiButtons multiButtonsAct"
          : "multiButtons";
    }
    this.setState({ buttons: buttonsDefault });
    this.props.selectMultiButton(index + 1);
  };

  render() {
    const stylePosition =
      this.props.width !== undefined ? { width: this.props.width } : {};
    const stylePositionLast =
      this.props.width !== undefined
        ? { width: this.props.width, marginRight: "5px" }
        : { marginRight: "5px" };

    return (
      <div style={{ marginRight: "10px" }}>
        {this.state.buttons.map((item) => (
          <button
            key={item.id}
            className={item.style}
            style={
              item.id === this.props.noButtons - 1
                ? stylePositionLast
                : stylePosition
            }
            onClick={() => this.selectButton(item.id)}
          >
            {item.name}
          </button>
        ))}
      </div>
    );
  }
}
