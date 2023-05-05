import React, { Component } from "react";

import "./Output.css";

import {
    CONTROLTITLE,
} from "../definitions/generalDefinitions";

import { OUTPUTTEXTEP } from "../definitions/outputDefinitionsEP";
import {
    formatMoney2,
  } from "../utils/helper";
  



export default class OutputInfoGridEP extends Component {

  constructor(props) {
    super(props);
    this.state = {
 
    }
  }

  

  render() {
   
   
    
   const lang=this.props.lang
   const LE=this.props.LE

  
   const labelsBilingual = OUTPUTTEXTEP[lang];
    
    const styleAmtCell = { textAlign: "right", height: "1px" };


      return (
        <table
        className="NeedsTable"
        style={{
          paddingLeft: "10px",
          width: "100%",
          minWidth: "600px",
        }}
      >
        <tbody style={{ fontSize: "1.2em", verticalAlign: "top" }}>
          <tr>
            <th className="noBorder" width="14%"></th>
            <th className="noBorder" width="8%"></th>
            <th className="noBorder" width="8%"></th>
            <th className="noBorder" width="70%"></th>
          </tr>
          <tr>
            <th className="tableNeedsEP">
              {labelsBilingual.EPSummaryTableC11}
            </th>
            <th className="tableNeedsEP">
              {labelsBilingual.EPSummaryTableC12}
            </th>
            <th className="tableNeedsEP">
              {labelsBilingual.EPSummaryTableC13}
            </th>

            <th className="tableNeedsEP">
              {labelsBilingual.EPSummaryTableC14}
            </th>
          </tr>
          <tr>
            <td style={{ height: "1px", textAlign: "right" }}>
              {labelsBilingual.EPSummaryTableC21}
            </td>
            <td className="textalignright" style={styleAmtCell}>
              {formatMoney2(
                this.props.taxLiability !== undefined &&
                  this.props.taxLiability[0],
                0,
                lang
              )}
            </td>
            <td className="textalignright" style={styleAmtCell}>
              {formatMoney2(
                this.props.taxLiability !== undefined &&
                  this.props.taxLiability[LE],
                0,
                lang
              )}
            </td>

            <td rowSpan="2">
              {labelsBilingual.EPSummaryTableC24}{" "}
              <span
                onClick={this.doLIFO}
                style={{ color: "#0070c0", cursor: "pointer" }}
              >
                <u>
                  <b>
                    <i>{CONTROLTITLE[lang].lifo}</i>
                  </b>
                </u>
              </span>
            </td>
          </tr>
          <tr>
            <td style={{ height: "1px", textAlign: "right" }}>
              {labelsBilingual.EPSummaryTableC31}
            </td>
            <td
              className="textalignright"
              style={{ height: "1px", whiteSpace: "nowrap" }}
            >
              {formatMoney2(this.props.dataEstateLiability[0], 0, lang)}
            </td>
            <td
              className="textalignright"
              style={{ height: "1px", whiteSpace: "nowrap" }}
            >
              {formatMoney2(
                this.props.dataEstateLiability[LE],
                0,
                lang
              )}
            </td>
          </tr>
        </tbody>
      </table>
      )

  }
}
