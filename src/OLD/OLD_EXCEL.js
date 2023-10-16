import React from "react";
import ReactExport from "react-data-export";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const dataSet1 = [
    {
        name: "Johson",
        amount: 30000,
        sex: 'M',
        is_married: true
    },
    {
        name: "Monika",
        amount: 355000,
        sex: 'F',
        is_married: false
    },
    {
        name: "John",
        amount: 250000,
        sex: 'M',
        is_married: false
    },
    {
        name: "Josef",
        amount: 450500,
        sex: 'M',
        is_married: true
    }
];

const dataSet2 = [
    {
        name: "Johnson",
        total: 25,
        remainig: 16
    },
    {
        name: "Josef",
        total: 25,
        remainig: 7
    }
];


const multiDataSet = [
    {
        columns: ["Name", "Salary", "Sex"],
        data: [
            ["Johnson", 30000, "Male"],
            ["Monika", 355000, "Female"],
            ["Konstantina", 20000, "Female"],
            ["John", 250000, "Male"],
            ["Josef", 450500, "Male"],
        ]
    },
    {
        xSteps: 1, // Will start putting cell with 1 empty cell on left most
        ySteps: 5, //will put space of 5 rows,
        columns: ["Name", "Department"],
        data: [
            ["Johnson", "Finance"],
            ["Monika", "IT"],
            ["Konstantina", "IT Billing"],
            ["John", "HR"],
            ["Josef", "Testing"],
        ]
    }
];

export default class DownloadExcel extends React.Component {
    	

    render() {

        if (this.props.downloadNow===0)
            return ''
        else
         if (false)
            return (
            <ExcelFile>
                <ExcelSheet dataSet={multiDataSet} name="Organization"/>
            </ExcelFile>
            );
         else
            return (
                <ExcelFile  hideElement={true}>
                    <ExcelSheet data={dataSet1} name="Employees">
                        <ExcelColumn label="Name" value="name"/>
                        <ExcelColumn label="Wallet Money" value="amount"/>
                        <ExcelColumn label="Gender" value="sex"/>
                        <ExcelColumn label="Marital Status"
                                    value={(col) => col.is_married ? "Married" : "Single"}/>
                    </ExcelSheet>
                    <ExcelSheet data={dataSet2} name="Leaves">
                        <ExcelColumn label="Name" value="name"/>
                        <ExcelColumn label="Total Leaves" value="total"/>
                        <ExcelColumn label="Remaining Leaves" value="remaining"/>
                    </ExcelSheet>
                </ExcelFile>
            );
    }
}