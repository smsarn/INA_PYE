import React, { Component } from "react";
import {
    formatMoney,
    cleanFormat
} from "../utils/helper";
import {
    COLUMN_TITLES,
    TITLES,
    INCOMESOURCES
} from "../definitions/generalDefinitions";
import {
    getInfoExcelcapFund,
    getInfoExcelAllAfterTax
} from "../definitions/infoIconsDefinitions";
import { Info } from "./Info";
import { getAssetGridValues } from "../data/assetGridProjections";
import { getOutputValues, setUIDataToAPI } from "../data/dataExchange";
import DataTable from "./GridExcelComponent/DataTable";
import Loader from 'react-loader-spinner'
import _ from 'lodash';

export class ExcelSpreadsheetEP extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            aggregateGrid: null,
        }
        this.dataAges = []
    }

    async componentDidMount() {
        //console.log('STARTED MOUNTING')
        this.setState({ loading: true });
        const data = await this.getEPGridData();
        this.setState({
            aggregateGrid: data,
            loading: false,
        })
    }

    async componentWillReceiveProps(nextProps) {
         if (!_.isEqual(nextProps.input, this.props.input)) {
            this.setState({ loading: true });
            const data = await this.getEPGridData();
            this.setState({
                aggregateGrid: data,
                loading: false,
            })
        }
    }

    // componentWillReceiveProps(nextProps) {
    //     // console.log(this.props.assetCurr.assetTypeKey,nextProps.assetCurr.assetTypeKey, this.props.assetCurr, nextProps.assetCurr);
    //     if (_.isEqual(nextProps.aggregateGrid, this.props.aggregateGrid)) {
    //       return false
    //       }
    //     }


    EPFullSpreadsheetData = async (cols) => {
        let noYrs = this.props.noProjectYrs;

        const formatFr = this.props.input.lang === "fr" ? true : false
        const decimalChar = this.props.input.lang === "en" ? "." : ","
        const thousands = this.props.input.lang === "en" ? "," : " "

        let count = 0;
        let dataColumns = new Array(cols).fill(0).map(() => new Array(noYrs).fill(0));

        const dataNA =await setUIDataToAPI(this.props.input);

        const assetsLength = this.props.input.dataInput.Assets.length;

        for (let i = 0; i < assetsLength; i++) {
            const element = this.props.input.dataInput.Assets[i];
            const data = await getAssetGridValues(dataNA, element, this.props.input.lang, true);
            count += 1;
            // console.log(data, data.dataProjection[0][0], data.dataProjection[0][1])

            for (let col = 0; col < 2; col++) {
                for (let yr = 0; yr < noYrs; yr++) {
                    dataColumns[col][yr] = parseInt(data.dataProjection[col][yr])

                }
            }
            // dont add up year and age
            for (let col = 2; col < Math.min(cols, data.dataProjection.length); col++) {
                for (let yr = 0; yr < noYrs; yr++) {
                    //console.log(yr,col,parseInt(data.dataProjection[col]))
                    // console.log(col, yr, parseInt(data.dataProjection[col][yr]))
                    dataColumns[col][yr] = parseInt(cleanFormat(dataColumns[col][yr], formatFr)) + parseInt(cleanFormat(data.dataProjection[col][yr], formatFr))

                }

            }

        };

        for (let col = 0; col < cols; col++) {
            for (let yr = 0; yr < noYrs; yr++) {
                if(yr===0)
                    dataColumns[2][yr]= parseInt(dataColumns[10][yr])-parseInt(dataColumns[4][yr])-parseInt(dataColumns[5][yr])+parseInt(dataColumns[6][yr])+parseInt(dataColumns[7][yr])
                else
                    dataColumns[2][yr]=dataColumns[10][yr-1]

                //console.log(parseInt(dataColumns[10][yr]),parseInt(dataColumns[6][yr]),parseInt(dataColumns[2][yr]),100*(-1+(parseInt(dataColumns[10][yr])+parseInt(dataColumns[6][yr]))/parseInt(dataColumns[2][yr]))    )
                dataColumns[11][yr] = Math.round(10000*(-1+(parseInt(dataColumns[10][yr])+parseInt(dataColumns[6][yr]))/parseInt(dataColumns[2][yr]))).toFixed(2)/100 +" %"
         
            }

        }
        for (let col = 0; col < cols; col++) {
            if(col!==11){
            for (let yr = 0; yr < noYrs; yr++) {
                dataColumns[col][yr] = formatMoney(dataColumns[col][yr], 0, decimalChar, thousands)
            }}

        }

        return dataColumns;
    }




    // EP spreadsheet
    getEPGridData = async () => {
        let gridColumnAligns;
        let dataTitle;
        let dataColHeaders;
        let dataColumns;
        let excelDataInfoSection;
        let gridIcons;


        // spreadsheet
        const language = this.props.input.lang;
        dataTitle = TITLES[this.props.input.lang].appletEP;
        dataColHeaders = this.EPFullSpreadsheetHeaders(this.props.input.lang);

        dataColumns = await this.EPFullSpreadsheetData(
            dataColHeaders.length
        );
        gridColumnAligns = new Array(dataColHeaders.length).fill(2);
        gridIcons = new Array(dataColHeaders.length)


        const decimalChar = language === "en" ? "." : ","
        const thousands = language === "en" ? "," : " "


        return {
            gridTitle: dataTitle,
            dataColTitles: dataColHeaders,
            dataProjection: dataColumns,
            gridIcons: gridIcons
        }

    }

    EPFullSpreadsheetHeaders = (lang) => {
        let headers = [];
        let i;

        for (i = 0; i < COLUMN_TITLES.EP_SHEET_HEADERS[lang].Full.length; ++i) {
            headers.push(COLUMN_TITLES.EP_SHEET_HEADERS[lang].Full[i]);
        }

        return headers;
    }

    render() {
        const lang = this.props.input.lang
        const { grids, loading } = this.state;

        if (loading) {// || this.state.aggregateGrid===null || this.state.aggregateGrid===undefined) {
            return <Loader type="TailSpin" color="black" height={30} width={30} />;
        }
        return (
            <div>
                <DataTable
                    gridTitle={this.state.aggregateGrid.gridTitle}
                    dataColTitles={this.state.aggregateGrid.dataColTitles}
                    dataProjection={this.state.aggregateGrid.dataProjection}
                    //  gridColumnsDataExcelInfoSection={this.state.aggregateGrid.gridColumnsDataExcelInfoSection}
                    // gridColumnAligns={this.state.aggregateGrid.gridColumnAligns}
                    // gridIcons={this.state.aggregateGrid.gridIcons}
                    language={this.props.input.lang}
                />
            </div>);
    }
}

