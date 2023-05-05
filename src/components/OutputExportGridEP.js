import React, { Component } from "react";

import "./Output.css";
import { Info } from "./Info";
import { getInfoExportINA } from "../definitions/infoIconsDefinitions";
import {
  CONTROLTITLE,
  TITLES,
} from "../definitions/generalDefinitions";

import { OUTPUTTEXTEP } from "../definitions/outputDefinitionsEP";
import {
  } from "../utils/helper";
  



export default class OutputExportGrid extends Component {

  constructor(props) {
    super(props);
    this.state = {
    }
  }


  render() {

    const lang=this.props.lang
    const labelsBilingual = OUTPUTTEXTEP[lang];
    

    return (
        <table
                className="EP"
                style={{ paddingLeft: "10px", width: "100%" }}
              >
                <tbody style={{ fontSize: "14px" }}>
                  <tr>
                    <th
                      className="tableNeedsEP"
                      style={{
                        borderStyle: "hidden",
                        background: "transparent",
                        verticalAlign: "bottom",
                      }}
                    >
                      {labelsBilingual.exportData}
                      {
                        <div
                          style={{
                            paddingTop: "0px",
                            marginTop: "-3px",
                            marginLeft: "150px",
                          }}
                        >
                          <Info infoIcon={getInfoExportINA(lang)} />
                        </div>
                      }
                    </th>
                  </tr>
                  <tr>
                    <td
                      style={{
                        borderStyle: "hidden",
                        padding: "5px",
                      }}
                    >
                      <div
                        style={{ width: "100%", float: "left", clear: "left" }}
                      >
                        <input
                          className="roundedCornerCmd"
                          style={{
                            //     width: "180px",
                            marginTop: "10px",
                            marginRight: "0px",
                            paddingRight: "8px",
                            float: "right",
                          }}
                          onClick={this.props.doINA}
                          type="button"
                          value={TITLES[lang].appletINA}
                        />
                      </div>
                      <div
                        style={{ width: "100%", float: "left", clear: "left" }}
                      >
                        <input
                          className="roundedCornerCmd"
                          style={{
                            //    width: "80px",
                            marginTop: "-1px",
                            marginRight: "0px",
                            paddingRight: "8px",
                            float: "right",
                          }}
                          onClick={this.props.doLIFO}
                          type="button"
                          value={CONTROLTITLE[lang].lifo}
                        />
                      </div>
                      <div
                        style={{ width: "100%", float: "left", clear: "left" }}
                      >
                        <input
                          className="roundedCornerCmd"
                          style={{
                            //    width: "80px",
                            marginTop: "-1px",
                            marginRight: "0px",
                            paddingRight: "8px",
                            float: "right",
                          }}
                          onClick={this.props.doCA}
                          type="button"
                          value={CONTROLTITLE[lang].ca}
                        />
                      </div>
                      <div
                        style={{ width: "100%", float: "left", clear: "left" }}
                      >
                        <input
                          className="roundedCornerCmd"
                          style={{
                            //    width: "80px",
                            marginTop: "-1px",
                            marginRight: "0px",
                            paddingRight: "8px",
                            float: "right",
                          }}
                          onClick={this.props.doEB}
                          type="button"
                          value={CONTROLTITLE[lang].eb}
                        />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>    )
                        }
                    }

