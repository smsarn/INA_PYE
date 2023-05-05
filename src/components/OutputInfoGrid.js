import React, { Component } from "react";

import "./Output.css";

import {
  APPLET_INA,
  DISPLAY_LIFEEXP,
  DISPLAY_ENDAGE,
  DISPLAY_RETIREMENT
} from "../definitions/generalDefinitions";

import { OUTPUTTEXT } from "../definitions/outputDefinitions";
import {
    formatted,
  } from "../utils/helper";
  



export default class OutputInfoGrid extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showShortfallHint: false,
      showHowLongHint: false,
    }
  }

  toggleHint = () => {
    this.setState({ showShortfallHint: !this.state.showShortfallHint });
  };

  toggleHintHL = () => {
    this.setState({ showHowLongHint: !this.state.showHowLongHint });
  };

  render() {
   
   
    
    let styleSelCell = [];
    styleSelCell.push(
      this.props.periodOption === DISPLAY_RETIREMENT
        ? { color: "#ffffff", background: "#334754" }
        : {}
    );
    styleSelCell.push(
      this.props.periodOption === DISPLAY_LIFEEXP
        ? { color: "#ffffff", background: "#334754" }
        : {}
    );
    styleSelCell.push(
      this.props.periodOption === DISPLAY_ENDAGE
        ? { color: "#ffffff", background: "#334754" }
        : {}
    );
    const labelsBilingual = OUTPUTTEXT[this.props.lang];
    
    const styleAmtCell = { textAlign: "right", height: "1px" };


      return (
          <table className="NeedsTable">
          <tbody style={{ fontSize: "1.2em", verticalAlign: "top" }}>
            <tr>
              <th className="noBorder" width="13%"></th>
              <th className="noBorder" width="12%"></th>
              <th className="noBorder" width="12%"></th>
              <th className="noBorder" width="12%"></th>
              <th className="noBorder" width="12%"></th>
              <th className="noBorder" width="39%"></th>
            </tr>
            <tr>
              <th className="tableNeedsEP">
                {labelsBilingual.INASummaryTableC11}
              </th>
              <th className="tableNeedsEP" style={styleSelCell[0]}>
                {labelsBilingual.INASummaryTableC12}
              </th>
              <th className="tableNeedsEP" style={styleSelCell[1]}>
                {labelsBilingual.INASummaryTableC13}{" "}
              </th>
              <th className="tableNeedsEP" style={styleSelCell[2]}>
                {labelsBilingual.INASummaryTableC14}
              </th>
              <th
                className="tableNeedsEP"
                style={{ color: "white", backgroundColor: "#612C51" }}
              >
                {labelsBilingual.INASummaryTableC15}
              </th>
  
              <th className="tableNeedsEP">
                {labelsBilingual.INASummaryTableC16}
              </th>
            </tr>
            <tr>
              <td style={{ height: "1px", textAlign: "right" }}>
                {labelsBilingual.INASummaryTableC21}
              </td>
              <td className="textalignright" style={styleAmtCell}>
               {formatted(this.props.gridData.insuranceNeedRet, this.props.lang)}
  
              </td>
              <td className="textalignright" style={styleAmtCell}>
                {formatted(this.props.gridData.insuranceNeedLE, this.props.lang)}
  
              </td>
              <td className="textalignright" style={styleAmtCell}>
                {formatted(this.props.gridData.insuranceNeedEAge, this.props.lang)}
  
              </td>
  
              <td
                className="textalignright"
                style={{ color: "#612C51" }}
              >
                _
              </td>
  
              <td>
                {this.state.showShortfallHint ? (
                  <span
                    style={{
                      color: "#612C51",
                      cursor: "pointer",
                    }}
                    onClick={this.toggleHint}
                  >
                    &#9650;
                  </span>
                ) : (
                  <span
                    style={{
                      color: "#612C51",
                      cursor: "pointer",
                    }}
                    onClick={this.toggleHint}
                  >
                    &#9660;
                  </span>
                )}
                {this.state.showShortfallHint ? (
                  <span
                    style={{ display: "block", marginLeft: "15px" }}
                  >
                    {labelsBilingual.INASummaryTableC26Open}
                  </span>
                ) : (
                  labelsBilingual.INASummaryTableC26Closed
                )}
              </td>
            </tr>
            <tr>
              <td
                rowSpan="2"
                style={{ height: "1px", textAlign: "right" }}
              >
                {labelsBilingual.INASummaryTableC31}
              </td>
              <td rowSpan="2" style={styleAmtCell}>
                {this.props.gridData.projYears.noProjectYrsRet}
              </td>
              <td rowSpan="2" style={styleAmtCell}>
                {this.props.gridData.projYears.noProjectYrsLE}
              </td>
              <td rowSpan="2" style={styleAmtCell}>
                {this.props.gridData.projYears.noProjectYrs100}
              </td>
              <td
                rowSpan="2"
                style={{ color: "#612C51", textAlign: "right" }}
              >
                {this.props.gridData.yrsCoverageIfCashAll}
              </td>
            </tr>
  
            <tr>
              <td>
                {this.state.showHowLongHint ? (
                  <span
                    style={{
                      color: "#612C51",
                      /*  fontSize: "1.3em", */
                      cursor: "pointer",
                    }}
                    onClick={this.toggleHintHL}
                  >
                    &#9650;
                  </span>
                ) : (
                  <span
                    style={{
                      color: "#612C51",
                      cursor: "pointer",
                    }}
                    onClick={this.toggleHintHL}
                  >
                    &#9660;
                  </span>
                )}
                {this.state.showHowLongHint
                  ? labelsBilingual.INASummaryTableC36Open
                  : labelsBilingual.INASummaryTableC36Closed}
              </td>
            </tr>
          </tbody>
        </table>
      )

  }
}
