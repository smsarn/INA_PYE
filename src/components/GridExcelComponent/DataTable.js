import React from "react";
import MUIDataTable from "mui-datatables";
import {
  Typography,
  TableRow,
  TableCell,
  Card,
  CardContent
} from "@material-ui/core";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import {GRID_INTERNAL_CAPTIONS} from '../../definitions/generalDefinitions';
//import DownloadExcel from './DownloadExcel'
import DownloadExcel from "./DownloadExcel";
import ExcelToolbar from "./ExcelToolbar";
//import PrintToolbar from "./printToolbar";
import {
  getInfoIconNotes
} from "../../definitions/infoIconsDefinitions.js";
import { Info } from "../Info";


export default class Datatable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      downloadExcelNow: 0
    };
  }



  getMuiTheme = () =>
    createMuiTheme({
      typography: {
        fontFamily: '"Trebuchet MS"',
        fontSize: 11,
        fontWeight: "100"
      },
      overrides: {
        MUIDataTable: {
          tableRoot: {
            margin: 0,
            
          },
          paper: {
            boxShadow: "none",
            borderBottom:"1px solid rgb(150, 150, 150)",
            borderRight:"1px solid rgb(200, 200, 200)",
          }
        },
        MuiTableRow: {
          root: {
            //for the body
            height: "100%"
          },
          head: {
            //for the head
            height: "100%"
          },
          footer: {
            display: "none"
          }
        },
        MuiTableCell: {
          head: {
            fontSize: ".8rem"
          },
          
          sizeSmall: {
            padding: "8px 3px 8px 3px"
          }

        },
        MUIDataTableToolbar: {
          root: {
            paddingLeft: "0px"
          },
          titleRoot: {
            fontSize: 24,
            fontWeight: 'bold'
          },
          icon: {
            fontSize: 24
          }
        },
        MUIDataTableBodyCell: {
          root: {
            backgroundColor: "#FF0000"
           }
        },
        MUITypography: {
          root: {
            backgroundColor: "blue"
           },
           
            body2: {
              color: 'blue',
            },
        },
        MUITablePagination: {
          caption: {
              value: 'blue',
            },
        }
      }
    });

  setExcel = () => {
    let downloadNow = this.state.downloadExcelNow === 1 ? 0 : 1;
    this.setState({ downloadExcelNow: downloadNow });
  };

  render() {
    let data = [];
    let dataRow = [];
    let j;
    let i;


    
    let unit=65
    let factor=1.3
    if(this.props.dataColTitles.length<4) // for liabs
      unit=95
   
      let divStyle={ width: factor*unit*(this.props.dataColTitles.length),  marginBottom:"10px"  }   
    if(factor*unit*this.props.dataColTitles.length>(1/factor)* window.innerWidth)
    {
      unit=((1/factor)*window.innerWidth/(factor*this.props.dataColTitles.length))
      divStyle={ width: factor*unit*(this.props.dataColTitles.length) }   
    
    } 
     if(unit<60)
    {
      unit=60 
      divStyle={ width: "100%" } 
    } 
    
    
    let columns = [];

    if (this.props.dataProjection !== undefined) {
    
      for (i = 0; i < this.props.dataProjection[0].length; ++i) {
        for (j = 0; j < this.props.dataColTitles.length; ++j) {
          if(j<1)
          dataRow.push(this.props.dataProjection[j][i]);
          else
          dataRow.push(this.props.dataProjection[j][i]);
        }
        data.push(dataRow);
        dataRow = [];
      }

      // build and style header and columns
      let widthCustom =unit;// Math.max(80,6 * this.props.dataColTitles.length); //+'%';
      let styleHeader = {
        backgroundColor: "#334d7c",
        color: "#FFFFFF",
        textAlign: "center",
        width: widthCustom,
        fontWeight: "bold",
        position: "sticky",
        top: 0,
        zIndex: 0,
      };

      let customHeader = ({ index, ...column }) => {
        return (
          
          <TableCell key={index} style={styleHeader}>
            {this.props.gridIcons !== undefined && 
            this.props.gridIcons[index] !== undefined && <div><Info infoIcon={this.props.gridIcons[index]}/><br/></div>} 
          {/* {index===this.props.headerIndex && <div><Info infoIcon={getInfoIconNotes(this.props.language)}/><br/></div>}  */}
           {column.name}
           </TableCell>
        );
      };

      for (i = 0; i < this.props.dataColTitles.length; ++i) {
        columns.push({
          name: this.props.dataColTitles[i],
          options: {
            filter: false,
            customHeadRender: customHeader
          }
        });
      }
    }
    const captions= GRID_INTERNAL_CAPTIONS[this.props.language]
    const title=<span style={{fontSize: '14px'}}  >{captions.excel}</span>
            
              
    const excelToolbarText=captions.excel 
     const options = {
      filter: false,
      filterType: "dropdown",
      selectableRows: "none",
      responsive: "scrollMaxHeight", //this removes horiz
      resizableColumns: true,
      selectableRowsHeader: false,
      viewColumns: false,
      search: false,
      download: false,
      print:false,
      textLabels:{
        pagination: {
          rowsPerPage: captions.rows,
          displayRows: captions.of
        },
        
      },
      
      rowsPerPage: 100,
      setTableProps: () => {
        return {
          padding: "default",
          size: "small",
          margin: "0px"
        };
      },
      downloadOptions: {
        filename: "INAtableDownload.csv",
        separator: ","
      },
      onDownload: (buildHead, buildBody, columns, data) => {
        //handleCSVDownload2(data, columns);
        this.setExcel();
        //return "\uFEFF" + "dfof\n " + "go to hell\n" + buildHead(headerNames) + buildBody(data);
        return false;
      },
      customRowRender: (data, dataIndex, rowIndex) => {
        let style = {textAlign: "right"};
        if (data[0] === "wwwwwww") {
          style.backgroundColor = "green";
          style.fontSize = "36px";
        }
        var rows = [];

        let i;
        for (i = 0; i < this.props.dataColTitles.length; ++i) {
          let dataI = data[i];
          rows.push(
            <TableCell key={i} style={style}>
              <Typography>{
 /* this.formatMoney(
  dataI,
    this.props.gridColumnAligns[i],
    ".",
    ","
  ) } */dataI}</Typography>
            </TableCell>
          );
        }
        // console.log(rows)
        return (
          <TableRow key={rowIndex} style={{ backgroundColor: this.props.specialRow===undefined ? (rowIndex%2?"#f9f9f9":"#e4e5e6"):(rowIndex===this.props.specialRow?"#d0d7e6":(rowIndex%2?"#f9f9f9":"#e4e5e6")) }}>
            {rows}
          </TableRow>
        );
      },
      customToolbar: () => <ExcelToolbar excelToolbarText={excelToolbarText} setExcel={this.setExcel} />
    };

   

    return (
        <div style={divStyle} >
          
        <MuiThemeProvider theme={this.getMuiTheme()}>
          <MUIDataTable
            title={this.props.gridTitle}
            data={data}
            columns={columns}
            options={options}
          />
        </MuiThemeProvider>
        {this.state.downloadExcelNow ===1 && <DownloadExcel
          excelColumnsDataMain={this.props.dataProjection}
          width={"90"}
          excelColumnsHeaders={this.props.dataColTitles}
          title={this.props.gridTitle}
          excelColumnsDataInfoSection={this.props.gridColumnsDataExcelInfoSection}
          downloadNow={this.state.downloadExcelNow}
          hideElement={true}
          language={this.props.language}
        />}
      </div>
    );
  }
}
