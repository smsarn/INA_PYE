import React, { Component } from "react";
import { Pie, Bar, Line } from "react-chartjs-2";
//import "./Output.css";
import "./Output.css";
import {
  getAssetsCategoryTotal,
} from "../utils/helper";
import {
  ASSETS,
} from "../definitions/generalDefinitions";


export class OutputGraphsPie extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    //if (this.props.dataCashFlowGov !== undefined)
    var optionsPie = {
      responsive: true,
      title: {
        display: true,
        position: "top",
        text: "Assets Breakdown Today",
        fontSize: 14,//8,
        fontColor: "#111"
      },
      legend: {
        display: true,
        position: "right",
        labels: {
          fontColor: "#333",
          fontSize: 12//16
        }
      }
    };
     
    let optionsPieLiabs = JSON.parse(JSON.stringify(optionsPie));
    optionsPieLiabs.title.text="Liabilities Breakdown" 
     
    const dataPieAssets = {
      labels: [
        "Cash/TFSA/Insurance", "RRSP/RRIF", "Public/Private shares", "Real Estate", "Other"
      ],
      datasets: [
        {
             data: [
            getAssetsCategoryTotal(this.props.input.dataInput,ASSETS.CASH.Key)+
            getAssetsCategoryTotal(this.props.input.dataInput,ASSETS.LIFE_INSURANCE.Key)+
            getAssetsCategoryTotal(this.props.input.dataInput,ASSETS.CHARITABLE_GIFTS_TAX_CREDIT.Key)+
            getAssetsCategoryTotal(this.props.input.dataInput,ASSETS.TFSA.Key)
            , 
            getAssetsCategoryTotal(this.props.input.dataInput,ASSETS.RRSP_RRIF.Key), 
            getAssetsCategoryTotal(this.props.input.dataInput,ASSETS.SMALL_BUSINESS_SHARES.Key)+
            getAssetsCategoryTotal(this.props.input.dataInput,ASSETS.STOCKS_BONDS.Key),
            getAssetsCategoryTotal(this.props.input.dataInput,ASSETS.REAL_ESTATE.Key)+
            getAssetsCategoryTotal(this.props.input.dataInput,ASSETS.PERSONAL_RESIDENCE.Key),
            getAssetsCategoryTotal(this.props.input.dataInput,ASSETS.OTHER_ASSETS.Key)
          ],
          backgroundColor: ["#F7464A", "#46BFBD", "#FDB45C", "#949FB1", "#4D5360"]
        }
      ]
    }

    const dataPieLiabs = {
      labels: [
        "Loans", "Taxes", "Emergency Fund", "Other","Occur at Death"
      ],
      datasets: [
        {
             data: [
            getLiabsCategoryTotal(this.props.input.dataInput,LIABILITIES.OUTSTANDING_LOANS.Key)+
            getLiabsCategoryTotal(this.props.input.dataInput,LIABILITIES.MORTGAGE_REDEMPTION.Key)+
            getLiabsCategoryTotal(this.props.input.dataInput,LIABILITIES.CREDIT_CARDS.Key)+
            getLiabsCategoryTotal(this.props.input.dataInput,LIABILITIES.CLIENT_TAX_LIABILITY.Key)
            , 
            getLiabsCategoryTotal(this.props.input.dataInput,LIABILITIES.INCOME_TAXES.Key), 
            getLiabsCategoryTotal(this.props.input.dataInput,LIABILITIES.EMERGENCY_FUND.Key),
            getLiabsCategoryTotal(this.props.input.dataInput,LIABILITIES.OTHER.Key)+
            getLiabsCategoryTotal(this.props.input.dataInput,LIABILITIES.CHILD_HOME_CARE.Key),
            getLiabsCategoryTotal(this.props.input.dataInput,LIABILITIES.LAST_EXPENSES.Key),
        getLiabsCategoryTotal(this.props.input.dataInput,LIABILITIES.LEGAL_AND_EXECUTOR_FEES.Key), 
        getLiabsCategoryTotal(this.props.input.dataInput,LIABILITIES.LEGACY_FOR_CHILDREN.Key)+
        getLiabsCategoryTotal(this.props.input.dataInput,LIABILITIES.CHARITABLE_GIFTS.Key)+
        getLiabsCategoryTotal(this.props.input.dataInput,LIABILITIES.PROBATE.Key)
          ],
          backgroundColor: ["#F7464A", "#46BFBD", "#FDB45C", "#949FB1", "#4D5360"]
        }
      ]
    }


    
    return (
        
        let data;
        
        if(this.props.Mode===Pie.Assets)
            data=dataPieAssets
        else if(this.props.Mode===Pie.Liabs)
            data=dataPieLiabs
        else if(this.props.Mode===Pie.Taxes)
            data=dataPieTaxes
        
        <br />
        <div style={{ width: "90%" }}>
               <div>
                <article className="canvas-container" style={{height: "450px" }}>
                    <div style={{overflow:'hidden', float: 'left', width: '50%',height: "400px" }}><Pie data={dataPieAssets} options={optionsPie} /></div>
                </article>
          </div>
        </div>
    )
  }
}
