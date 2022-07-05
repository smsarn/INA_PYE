import React, { Component } from "react";
import DataTable from "./GridExcelComponent/DataTable";
import { getInfoINA } from "../definitions/infoIconsDefinitions";
import { Info } from "./Info";
import {
  APPLET_INA,
} from "../definitions/generalDefinitions";

export default class AggregateGrid extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    
    return (
      <div>
        <h3 className="ppi1">
          {APPLET_INA ?this.props.insNeedLine:""}
          {APPLET_INA &&
          <Info
              infoIcon={getInfoINA(this.props.lang)}
          />}
        </h3>

        <DataTable
          gridTitle=""// use same title as othr pages {this.props.aggregateGrid.gridTitle}
          dataColTitles={this.props.aggregateGrid.dataColTitles}
          dataProjection={this.props.aggregateGrid.dataProjection}
          gridColumnsDataExcelInfoSection={
            this.props.aggregateGrid.gridColumnsDataExcelInfoSection
          }
          gridColumnAligns={this.props.aggregateGrid.gridColumnAligns}
          gridIcons={this.props.aggregateGrid.gridIcons}
          specialRow={this.props.LE}
          language={this.props.lang}
        />
      </div>
    );
  }
}
