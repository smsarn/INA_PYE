import React, { Component } from "react";

import "./Output.css";

import {
  APPLET_INA,
  DISPLAY_LIFEEXP,
  DISPLAY_ENDAGE,
  DISPLAY_RETIREMENT,
  CONTROLTITLE
} from "../definitions/generalDefinitions";

import { OUTPUTTEXT } from "../definitions/outputDefinitions";
import {
    formatted,
    doCompuLife,
  } from "../utils/helper";
  



export default class OutputExportGrid extends Component {

  constructor(props) {
    super(props);
    this.state = {
    }
  }


  render() {

    const lang=this.props.lang
    const labelsBilingual = OUTPUTTEXT[this.props.lang];
    

    return (
        <table style={{ paddingLeft: "10px", width: "100%" }}>
                  <tbody style={{ fontSize: "1.2em" }}>
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
                          style={{
                            width: "100%",
                            float: "left",
                            clear: "left",
                          }}
                        >
                          <input
                            className="roundedCornerCmd"
                            style={{
                              // width: "180px",
                              marginTop: "0px",
                              paddingRight: "8px",
                              float: "right",
                            }}
                            onClick={() =>
                              doCompuLife(
                                lang,
                                this.props.insuranceNeed,
                                this.props.pres.provinceKey,
                                this.props.client.Age,
                                this.props.client.sexKey,
                                this.props.client.smokerKey,
                                this.props.pres.designedBy,
                                this.props.pres.designedFor
                              )
                            }
                            type="button"
                            value={CONTROLTITLE[lang].compulife}
                          />
                        </div>
                        <div
                          style={{
                            width: "100%",
                            float: "left",
                            clear: "left",
                          }}
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
                            onClick={()=>{this.props.doEP(this.props.TC)}}
                            type="button"
                            value={CONTROLTITLE[lang].ep}
                          />
                        </div>
                        <div
                          style={{
                            width: "100%",
                            float: "left",
                            clear: "left",
                          }}
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
                          style={{
                            width: "100%",
                            float: "left",
                            clear: "left",
                          }}
                        >
                          <input
                            className="roundedCornerCmd"
                            style={{
                              //    width: "80px",
                              marginTop: "0px",
                              marginRight: "0px",
                              paddingRight: "8px",
                              float: "right",
                            }}
                            onClick={this.props.doWL}
                            type="button"
                            value={CONTROLTITLE[lang].wl}
                          />
                        </div>
                        <div
                          style={{
                            width: "100%",
                            float: "left",
                            clear: "left",
                          }}
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
                      </td>
                    </tr>
                  </tbody>
                </table>
    )
                        }
                    }

