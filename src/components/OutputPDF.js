import React from "react";
import {
  OUTPUTTITLE,
  TITLES,
  MEMBER,
  MAX_ORPHAN_DUR_QC,
  MAX_ORPHAN_DUR_NON_QC,
  ORPHAN_AGE_QC,
  ORPHAN_AGE_NON_QC,
  PROVINCE,
  IMAGE_LOGO,
  IMAGE_LOGO_OTHERPAGES,
  IMAGE_APPLET_INA
} from "../definitions/generalDefinitions";
import { OUTPUTTEXT } from "../definitions/outputDefinitions";
import {
  getListItemNameFromKey,
  formatMoney,
  getListItemKeyFromName,
  cleanFormat,
  isSingleFamily,
  getName,
  formatted
} from "../utils/helper";
import { getOutputValues } from "../data/dataExchange";

import {
  PDF,
  InToPt,
  PxToPt,
  HELVETICA,
  TIMES,
  NORMAL,
  BOLD,
  ITALIC,
} from "./PDF";

const DISPLAY_INCOME = 1;
const DISPLAY_TAXLIAB = 2;

const LINE_CHART_DIV_ID = "bar1";
const LINE_CHART_DIV2_ID = "lineChartDiv2";

const LINE_CHART_DIV_STYLE = {
  marginTop: "65px",
  marginLeft: "64px",
  marginBottom: "64px",
  height: "192px",
  width: "384px",
};

const LINE_CHART_DIV2_STYLE = {
  marginTop: "65px",
  marginLeft: "64px",
  marginBottom: "64px",
  height: "192px",
  width: "384px",
};

const TOP_MARGIN = 0.48;
const PARA_WIDTH = 5.5;


async function getSpouseINA(props)
{
  let data;
  data= await props.getSpouseINA();
  const spouseInsRet=data.dataOutput.dataInsuranceNeeds[0].Value;
  const spouseInsLE=data.dataOutput.dataInsuranceNeeds[1].Value;
  const LESpouse=data.dataOutput.lifeExpectancy.spouse+data.dataInput.Clients[1].Age

  return {spouseInsRet:spouseInsRet,spouseInsLE:spouseInsLE, LESpouse:LESpouse};
}

function formattedMoneyString(value,lang){
  return formatted(value,lang).toString()
}



export async function doSavePdfAction(props) {
  let pdf = new PDF();
  pdf.Create();

  // pdf.ShowGrids = false;

  var htmlElement;
  var paragraph;

  // pdf output shared with presentation
  let output = getOutputValues(props);
  const lang = props.dataInput.Presentations[0].language;
  const provinceKey = getListItemKeyFromName(PROVINCE, output.province);
  let maxDur = provinceKey === "QC" ? MAX_ORPHAN_DUR_QC : MAX_ORPHAN_DUR_NON_QC;
  let orphAge = provinceKey === "QC" ? ORPHAN_AGE_QC : ORPHAN_AGE_NON_QC;
  const clients = props.dataInput.Clients;
  const assets = props.dataInput.Assets;
  const singleFamily = isSingleFamily(clients);
  const labelsBilingual = OUTPUTTEXT[lang];

  const singlePerson = props.dataInput.Clients.length === 1 ? true : false;
  const thereAfterText=singlePerson ? OUTPUTTEXT[lang].pgTabRowThereAfter_1:OUTPUTTEXT[lang].pgTabRowThereAfter;
  const thereAfterTextSF= singlePerson ? OUTPUTTEXT[lang].pg5TabRow7_1:OUTPUTTEXT[lang].pg5TabRow7

  const decimalChar = lang === "en" ? "." : ",";
  const thousands = lang === "en" ? "," : " ";
  const formatFr = lang === "fr" ? true : false;


  // are there two need periods eg when children this or that
  const twoNeedPercents = output.percent2.length > 0 ? true : false;
  const pg1TitleY = 4.2;
  // Page 1
  pdf.SetFont(HELVETICA, NORMAL);
  if (lang === "en") pdf.SetFontSize(PxToPt(36));
  else pdf.SetFontSize(PxToPt(24));
  pdf.SetTextColor(0x45, 0x55, 0x60);
  pdf.Text(
    props.INAOption === DISPLAY_INCOME
      ? TITLES[lang].appletINA
      : TITLES[lang].appletEP,
    InToPt(1.5),
    InToPt(pg1TitleY) //3.5)
  );
  /* 
  pdf.AddImageFitWidthOnly(
    "INAPage1Logo",
    InToPt(1.51), //1.51),
    InToPt(1.06),
    InToPt(5.54),
    InToPt(2.76) // max height
  ); */
  const image = props.dataInput.Presentations[0].adviserLogo;
  const top = props.dataInput.Presentations[0].adviserLogo.top;
  const pg1ImageID=props.dataInput.Presentations[0].adviserLogo.ID;

  const imageApp = props.dataInput.Presentations[0].appletImage;
  
  let result;
  result=pdf.addCustomImage(IMAGE_LOGO, pg1TitleY, image, true,top);

  //result=pdf.addCustomImage(IMAGE_APPLET_INA, InToPt(pg1TitleY + 0.5), imageApp, true,top);
    pdf.AddImage(
    IMAGE_APPLET_INA,
    InToPt(1.51),
    InToPt(pg1TitleY + 0.5), //4.06),
    InToPt(5.54),
    InToPt(2.75)
  ); 
   //	console.log(output.clients);
  //	console.log(OUTPUTTEXT[lang].pg1P1);

  pdf.SetFont(HELVETICA, NORMAL);
  pdf.SetFontSize(PxToPt(18));
  pdf.SetTextColor(0x45, 0x55, 0x60);
  pdf.Text(
    OUTPUTTEXT[lang].pg1P1 + output.designedFor,
    InToPt(1.52),
    InToPt(pg1TitleY + 3.63) //7.13
  );
  pdf.Text(
    OUTPUTTEXT[lang].pg1P2 + output.designedBy,
    InToPt(1.52),
    InToPt(pg1TitleY + 4.13) //7.63)
  );
  pdf.Text(
    OUTPUTTEXT[lang].pg1P3 + output.dateApplet,
    InToPt(1.52),
    InToPt(pg1TitleY + 4.42) //7.92)
  );
  pdf.Text(
    OUTPUTTEXT[lang].pg1P4 + output.province,
    InToPt(1.52),
    InToPt(pg1TitleY + 4.69) //8.19)
  );

  

  const headerOffset = image.image === null ? 0 : 0.25;
  const topToTitle_Y  =1.35
  const titleToPara_Y  =1.6
  
  const topMargin = pdf.HEADER_RECT_IN_Y + headerOffset;
  {
    /*---}			// Page 2*/
    const footerText = OUTPUTTEXT[lang].pgFooter;
    const headerText = OUTPUTTEXT[lang].pg1T;
    
    pdf.addFooterAndHeader(headerOffset, footerText, headerText);

    result=result && pdf.addCustomImage(IMAGE_LOGO_OTHERPAGES, pg1TitleY, image,false,top);

    pdf.SetFont(HELVETICA, NORMAL);
    if (lang === "en") pdf.SetFontSize(PxToPt(25));
    else pdf.SetFontSize(PxToPt(20));
    pdf.SetTextColor(0x45, 0x55, 0x60);
    pdf.Text(
      OUTPUTTITLE[lang].Values[0],
      InToPt(1.5),
      InToPt(headerOffset + topToTitle_Y)
    );

    pdf.SetFont(TIMES, NORMAL);
    pdf.SetFontSize(PxToPt(16));
    pdf.SetTextColor(0x45, 0x55, 0x60);

    // profile table
    let x = 1.5;
    let y = headerOffset + titleToPara_Y;
    let incY = 0.4;
    let incTableY = 0.25;
    const incColourdRowsY= incTableY + 0.08;
    let height = 0.35;
    const val = singleFamily
      ? labelsBilingual.pg2TabT4Alt
      : labelsBilingual.pg2TabT4;
    let values = [
     (singlePerson? OUTPUTTEXT[lang].pg2TabT1_1:OUTPUTTEXT[lang].pg2TabT1),
      OUTPUTTEXT[lang].pg2TabT2,
      OUTPUTTEXT[lang].pg2TabT3,
      val,
      OUTPUTTEXT[lang].pg2TabT5,
    ];
    let fill = [115, 153, 198];
    let textColor = [255, 255, 255];
    let Widths = [2.3, 0.5, .9, .9,.8]; // add up to PARA_WIDTH=5.5
    if(lang==="fr") Widths = [2.0, 0.4, .85, .75,1.4];
    pdf.tableRow(fill, textColor, x, y, values, height, Widths);

    
    y += incY+.2;
    fill = [255, 255, 255];
    textColor = [0x45, 0x55, 0x60];
    output.clients.forEach(function (element) {
      
      const len=(getListItemNameFromKey(MEMBER, element.memberKey, lang) + getName(element.name,lang)).length
      values = [
        len>26?getListItemNameFromKey(MEMBER, element.memberKey, lang) :getListItemNameFromKey(MEMBER, element.memberKey, lang) + getName(element.name,lang),
        element.age.toString(),
        formattedMoneyString(element.income,lang)
        /* "$" +
          formatMoney(
           element.income,
            0,
            decimalChar,
            thousands
          ) */,
        (singleFamily
          ? (element.memberKey === MEMBER.CLIENT.Key
            ? "-"
            : element.ret-element.age) //protectionPeriod
          : element.ret).toString(),
        (clients[element.id - 1].avgTaxRate + "%").toString(),
      ];
      pdf.tableRow(fill, textColor, x, y, values, height, Widths);
      y += incTableY;
      if(len>26){
        values= [
          getName(element.name,lang),
          "",
          "",
          "",
          "",
        ];
        pdf.tableRow(fill, textColor, x, y, values, height, Widths);
        y += incTableY;
    
      }
    });

    // fin. summary table
    pdf.SetFont(TIMES, NORMAL);
    pdf.SetFontSize(PxToPt(16));
    pdf.SetTextColor(0x45, 0x55, 0x60);

    y += incTableY-.05;
    fill = [115, 153, 198];
    textColor = [255, 255, 255];
    Widths = [4.3, 1.2]; // add up to PARA_WIDTH=5.5
    let values2 = [OUTPUTTEXT[lang].pg2T3, ""];

    pdf.tableRow(fill, textColor, x, y, values2, height, Widths);

    fill = [255, 255, 255];
    textColor = [0x45, 0x55, 0x60];
    values2 = [
      OUTPUTTEXT[lang].pg2P5,
      (
        formattedMoneyString(output.totalAssetExcludeInsurance,lang)
        /* "$" +
        formatMoney(
          output.totalAssetExcludeInsurance,
          0,
          decimalChar,
          thousands
        ) */
      ),
    ];
    y += incY;
    pdf.tableRow(fill, textColor, x, y, values2, height, Widths);
    values2 = [
      OUTPUTTEXT[lang].pg2P6,
      (
        formattedMoneyString(output.totalLiabExcludeDeathRelated,lang)
        /* 
        "$" +
        formatMoney(
          output.totalLiabExcludeDeathRelated,
          0,
          decimalChar,
          thousands
        ) */
      ),
    ];
    y += incTableY;
    pdf.tableRow(fill, textColor, x, y, values2, height, Widths);
    values2 = OUTPUTTEXT[lang].pg2P7;
    y += incTableY;
    pdf.tableRowSingle(fill, textColor, x+2.8, y, values2, height, Widths,false);
    
    values2 =
      (
        formattedMoneyString(output.totalAssetExcludeInsurance -
          output.totalLiabExcludeDeathRelated,lang)
        
        /* "$" +
        formatMoney(
          output.totalAssetExcludeInsurance -
            output.totalLiabExcludeDeathRelated,
          0,
          decimalChar,
          thousands
        ) */
      );
    fill = [196, 223, 224];
    pdf.tableRowSingle(fill, textColor, x+4.3, y, values2, height, Widths, true);
    
    //pdf.tableRow(fill, textColor, x+4.3, y+.065, values2, height-.10, [1.2]);
    fill = [255, 255, 255];
    const allDB=formattedMoneyString(output.totalAssetInsurance+output.govDB,lang);
    const govDB=formattedMoneyString(output.govDB,lang);
    values2 = [
      OUTPUTTEXT[lang].pg2P8.replace("yyy",govDB), 
      (
        allDB
      ),
    ];
    y += incColourdRowsY;
    pdf.tableRow(fill, textColor, x, y, values2, height, Widths);

    values2 = [
      OUTPUTTEXT[lang].pg2P9,
      (
        formattedMoneyString(output.totalLiab - output.totalLiabExcludeDeathRelated,lang)
        
        /* "$" +
        formatMoney(
          output.totalLiab - output.totalLiabExcludeDeathRelated,
          0,
          decimalChar,
          thousands
        ) */
      ),
    ];
    y += incTableY;
    pdf.tableRow(fill, textColor, x, y, values2, height, Widths);
    pdf.DrawLine(InToPt(1.5), InToPt(y + incY), InToPt(PARA_WIDTH));

    // ins
    y += 1.2*incY;
    values2 =  OUTPUTTEXT[lang].pg2P10 + getName(clients[0].Name,lang) +":"
    pdf.tableRowSingle(fill, textColor, x, y, values2, height, [PARA_WIDTH],false);
    
    if(!singleFamily)
    {
    values2 = [
      OUTPUTTEXT[lang].pg8TabRow3 + props.LE + ")",
      ""
    ];
    y += incColourdRowsY;
    pdf.tableRow(fill, textColor, x, y, values2, height, Widths);

    values2 = (
      formattedMoneyString(output.insNeedLE,lang)
        
      /* "$" + formatMoney(output.insNeedLE, 0, decimalChar, thousands) */)
    fill = [196, 223, 224];
    pdf.tableRowSingle(fill, textColor, x+4.3, y, values2, height, Widths, true);

  }
   
  //pdf.tableRow(fill, textColor, x+4.3, y+.065, values2, height-.10, [1.2]);
    fill = [255, 255, 255];
    
    values2 = [
      singleFamily? OUTPUTTEXT[lang].pg8TabRow4Alt.replace("A. ",""): OUTPUTTEXT[lang].pg8TabRow4
      
      ,
      "",
    ];
    y += incColourdRowsY;
    pdf.tableRow(fill, textColor, x, y, values2, height, Widths);
    
    values2 =(
      formattedMoneyString(output.insNeedRet,lang)
        /* "$" + formatMoney(output.insNeedRet, 0, decimalChar, thousands) */)
    fill = [196, 223, 224];
    pdf.tableRowSingle(fill, textColor, x+4.3, y, values2, height, Widths, true);
    fill = [255, 255, 255];
    
    // spouse ins
    if(!singleFamily)
    {
        const spouseSwitched= await getSpouseINA(props)
        const spouseInsRet=cleanFormat(spouseSwitched.spouseInsRet, lang);
        const spouseInsLE=cleanFormat(spouseSwitched.spouseInsLE, lang);
        const LESpouse=spouseSwitched.LESpouse
        pdf.DrawLine(InToPt(1.5), InToPt(y + incY), InToPt(PARA_WIDTH));
    

        y += 1.2*incY;
        pdf.tableRow(fill, textColor, x, y, [OUTPUTTEXT[lang].pg2P12], height, Widths);
   
        y += 1.35*incY;
        
        values2 =  [OUTPUTTEXT[lang].pg2P11.replace(lang==="en"?" NAME":" NOM", getName(clients[1].Name,lang)) ,
          (
            formattedMoneyString(output.totalAssetInsuranceIfSpouse+output.govDB,lang)
            /*  "$" +
            formatMoney(
              output.totalAssetInsuranceIfSpouse+output.govDB,              
              0,
              decimalChar,
              thousands
            ) */
          )]

          pdf.tableRow(fill, textColor, x, y, values2, height, Widths);
        
        values2 = [
          OUTPUTTEXT[lang].pg8TabRow3 + LESpouse + ")",
          ""
        ];
        y += incColourdRowsY;
        pdf.tableRow(fill, textColor, x, y, values2, height, Widths);
    
        values2 = (
          formattedMoneyString(spouseInsLE,lang)
        /* "$" + formatMoney( spouseInsLE, 0, decimalChar, thousands) */)
        fill = [196, 223, 224];
        pdf.tableRowSingle(fill, textColor, x+4.3, y, values2, height, Widths, true);
    
      
      //pdf.tableRow(fill, textColor, x+4.3, y+.065, values2, height-.10, [1.2]);
        fill = [255, 255, 255];
        
        values2 = [
          OUTPUTTEXT[lang].pg8TabRow4
          ,
          "",
        ];
        y += incColourdRowsY;
        pdf.tableRow(fill, textColor, x, y, values2, height, Widths);
        
        values2 =(
          formattedMoneyString(spouseInsRet,lang)
        /* "$" + formatMoney( spouseInsRet, 0, decimalChar, thousands) */)
        fill = [196, 223, 224];
        pdf.tableRowSingle(fill, textColor, x+4.3, y, values2, height, Widths, true);
        fill = [255, 255, 255];
      

    }



    // if more than 5 clients move
    if(output.clients.length>lang==="en"?4:3){
      pdf.addFooterAndHeader(headerOffset, footerText, headerText);
      /* extra assump PAGE */
      result=result && pdf.addCustomImage(IMAGE_LOGO_OTHERPAGES, pg1TitleY, image,false,top);
      pdf.SetFont(HELVETICA, NORMAL);
      if (lang === "en") pdf.SetFontSize(PxToPt(25));
      else pdf.SetFontSize(PxToPt(20));
      pdf.SetFont(TIMES, NORMAL);
      pdf.SetFontSize(PxToPt(16));
      x = 1.5;
      y = headerOffset + titleToPara_Y-.3;
      incY = 0.44;
      height = 0.35;

    }
    else
      y += 2*incTableY;
    
    // assump table
    pdf.SetFont(TIMES, NORMAL);
    pdf.SetFontSize(PxToPt(16));
    pdf.SetTextColor(0x45, 0x55, 0x60);

    //  pdf.DrawLine(InToPt(1.5), InToPt(y - 0.13), InToPt(PARA_WIDTH));
    // y += .3*incY;
    fill = [115, 153, 198];
    textColor = [255, 255, 255];
    Widths = [4.9, 0.6]; // add up to PARA_WIDTH=5.5
    values2 = [OUTPUTTEXT[lang].pg2T2, ""];

    pdf.tableRow(fill, textColor, x, y, values2, height, Widths);

    fill = [255, 255, 255];
    textColor = [0x45, 0x55, 0x60];
    values2 = [OUTPUTTEXT[lang].pg7TabRow4, (output.infRate + "%").toString()];
    y += incY;
    pdf.tableRow(fill, textColor, x, y, values2, height, Widths);
    values2 = [singlePerson?OUTPUTTEXT[lang].pg7TabRow5_1:OUTPUTTEXT[lang].pg7TabRow5, (output.invRate + "%").toString()];
    y += incTableY;
    pdf.tableRow(fill, textColor, x, y, values2, height, Widths);

    values2 = [
      OUTPUTTEXT[lang].pg2TabT6,
      (
        parseFloat(props.dataInput.Presentations[0].taxRate).toFixed(2) + "%"
      ).toString(),
    ];
    y += incTableY;
    pdf.tableRow(fill, textColor, x, y, values2, height, Widths);

    pdf.SetFont(TIMES, NORMAL);
    pdf.SetFontSize(PxToPt(16));
    pdf.SetTextColor(0x45, 0x55, 0x60);

    y += 2 * incY-.07;
    pdf.DrawLine(InToPt(1.5), InToPt(y - 0.35), InToPt(PARA_WIDTH));
   // y += 0.7 * incY;

    paragraph = singlePerson?OUTPUTTEXT[lang].pg2Tab2_1: OUTPUTTEXT[lang].pg2Tab2;
    pdf.MultilineText(paragraph, InToPt(1.5), InToPt(y), InToPt(5.6));

    y += incY -.05;
    paragraph = OUTPUTTEXT[lang].pg2Tab3;
    pdf.MultilineText(paragraph, InToPt(1.5), InToPt(y), InToPt(5.6));
    
    /* // notes
    pdf.SetFont(TIMES, NORMAL);
    pdf.SetFontSize(PxToPt(16));
    pdf.SetTextColor(0x45, 0x55, 0x60);

    y += 2.8 * incY;
    fill = [115, 153, 198];
    textColor = [255, 255, 255];
    Widths = [4.9, 0.6]; // add up to PARA_WIDTH=5.5
    values2 = [OUTPUTTEXT[lang].pg9T, ""];

    pdf.tableRow(fill, textColor, x, y, values2, height, Widths);

    y += 1.6 * incY;
    paragraph = OUTPUTTEXT[lang].pg9P1;
    pdf.SetFont(TIMES, NORMAL);
    pdf.SetFontSize(PxToPt(16));
    pdf.SetTextColor(0x45, 0x55, 0x60);
    pdf.MultilineText(paragraph, InToPt(1.5), InToPt(y), InToPt(PARA_WIDTH));
 */
    /* 	values = ["Client", "$70,000", "65"];
			y += incY;	
			pdf.tableRow(fill, textColor, x, y, values, height, Widths);
			values = ["Spouse", "$50,000", "65"];
			y +=incY;
			pdf.tableRow(fill, textColor, x, y, values, height, Widths);
		  */

    //pdf.SetFillColor(255, 255, 255);
    //pdf.SetTextColor(0x45, 0x55, 0x60);
    //pdf.Rectangle(InToPt(1.5), InToPt(2), InToPt(1.8), InToPt(0.4));
    //pdf.Text("Client", InToPt(1.61), InToPt(2.25));
    //pdf.SetFillColor(255, 255, 255);
    //pdf.Rectangle(InToPt(3.32), InToPt(2), InToPt(1.8), InToPt(0.4));
    //pdf.Text("$70,000", InToPt(3.43), InToPt(2.25));
    //pdf.SetFillColor(255, 255, 255);
    //pdf.Rectangle(InToPt(5.14), InToPt(2), InToPt(1.8), InToPt(0.4));
    //pdf.Text("65", InToPt(5.25), InToPt(2.25));

    //pdf.SetFillColor(255, 255, 255);
    //pdf.Rectangle(InToPt(1.5), InToPt(2.5), InToPt(1.8), InToPt(0.4));
    //pdf.Text("Spouse", InToPt(1.61), InToPt(2.75));
    //pdf.SetFillColor(255, 255, 255);
    //pdf.Rectangle(InToPt(3.32), InToPt(2.5), InToPt(1.8), InToPt(0.4));
    //pdf.Text("$50,000", InToPt(3.43), InToPt(2.75));
    //pdf.SetFillColor(255, 255, 255);
    //pdf.Rectangle(InToPt(5.14), InToPt(2.5), InToPt(1.8), InToPt(0.4));
    //pdf.Text("65", InToPt(5.25), InToPt(2.75));

    //	// Page 3
//    pdf.AddPage();
  //  pdf.Header(headerText, headerOffset);

    pdf.addFooterAndHeader(headerOffset, footerText, headerText);

    {
      /* PAGE 3 Family Cash Needs at Death*/
    }

    // combine 2 and 3
    // logo if asked for
    result=result && pdf.addCustomImage(IMAGE_LOGO_OTHERPAGES, pg1TitleY, image,false,top);

    pdf.SetFont(HELVETICA, NORMAL);
    if (lang === "en") pdf.SetFontSize(PxToPt(25));
    else pdf.SetFontSize(PxToPt(20));

    pdf.SetTextColor(0x45, 0x55, 0x60);
    pdf.Text(singlePerson?OUTPUTTEXT[lang].pg3T_1:OUTPUTTEXT[lang].pg3T, InToPt(1.5), InToPt(headerOffset + topToTitle_Y
  ));

    paragraph =singlePerson?OUTPUTTEXT[lang].pg3P1_1:OUTPUTTEXT[lang].pg3P1;
    pdf.SetFont(TIMES, NORMAL);
    pdf.SetFontSize(PxToPt(16));
    pdf.SetTextColor(0x45, 0x55, 0x60);
    pdf.MultilineText(
      paragraph,
      InToPt(1.5),
      InToPt(headerOffset + 1.8),
      InToPt(PARA_WIDTH)
    );

    x = 1.5;
    y = headerOffset + 2.5;
    incY = 0.4;
    height = 0.35;
    Widths = [4.3, 1.2]; // add up to PARA_WIDTH=5.5

    values = [OUTPUTTEXT[lang].pg3TabT];
    fill = [115, 153, 198];
    textColor = [255, 255, 255];
    pdf.tableRow(fill, textColor, x, y, values, height, [PARA_WIDTH]);

    fill = [255, 255, 255];
    textColor = [0x45, 0x55, 0x60];

    y += incY;
    output.liabilities.forEach(function (element) {
      values = [
        element.name,
        (
          formattedMoneyString(element.value,lang)
        /* "$" + formatMoney(element.value, 0, decimalChar, thousands) */
        ),
      ];
      pdf.tableRow(fill, textColor, x, y, values, height, Widths);
      y += incTableY;
    });
    y -= incTableY;
    values = [
      OUTPUTTEXT[lang].pg3TabRTot,
      (
        formattedMoneyString(output.totalLiab,lang)
        /* "$" + formatMoney(output.totalLiab, 0, decimalChar, thousands) */
      ),
    ];
    y += incY;
    pdf.tableRow(fill, textColor, x, y, values, height, Widths);
    pdf.DrawLine(InToPt(1.5), InToPt(y), InToPt(PARA_WIDTH));

    // pdf.addFooterAndHeader(headerOffset,footerText, headerText);

    {
      /* PAGE 4 Family Income Needs at Death*/
    }
    // pdf.addCustomImageIMAGE_LOGO_OTHERPAGES, pg1TitleY, image);

    // combined with page 3
    /*    pdf.SetFont(HELVETICA, NORMAL);
    if (lang === "en") pdf.SetFontSize(PxToPt(25));
    else pdf.SetFontSize(PxToPt(20));

     pdf.SetTextColor(0x45, 0x55, 0x60);
    pdf.Text(OUTPUTTEXT[lang].pg4T, InToPt(1.5), InToPt(topToTitle_Y
  ));
    
    paragraph = OUTPUTTEXT[lang].pg4P1;
    pdf.SetFont(TIMES, NORMAL);
    pdf.SetFontSize(PxToPt(16));
    pdf.SetTextColor(0x45, 0x55, 0x60);
    pdf.MultilineText(paragraph, InToPt(1.5), InToPt(headerOffset+topToTitle_Y
  ), InToPt(PARA_WIDTH));
/ / this is already in pg 3 so no para here
*/
    x = 1.5;
    //   y = headerOffset+1.65;//2.3; don't go down
    y += incY;
    //incY = 0.44;
    height = 0.35;
    //const Widths = 5;

    values = [OUTPUTTEXT[lang].pg4TabT];
    fill = [115, 153, 198];
    textColor = [255, 255, 255];
    pdf.tableRow(fill, textColor, x, y, values, height, [PARA_WIDTH]);

    fill = [255, 255, 255];
    textColor = [0x45, 0x55, 0x60];

    values = [
      (singlePerson?OUTPUTTEXT[lang].pg4TabRow1_1: OUTPUTTEXT[lang].pg4TabRow1),
      (
        formattedMoneyString(output.Income + output.Income2,lang)
        /* "$" +
        formatMoney(output.Income + output.Income2, 0, decimalChar, thousands) */
      ),
    ];
    y += incY;
    pdf.tableRow(fill, textColor, x, y, values, height, Widths);

    y += incY;
    pdf.MultilineText(
     singlePerson? OUTPUTTEXT[lang].pg4TabRow2_1:OUTPUTTEXT[lang].pg4TabRow2,
      InToPt(x + 0.1),
      InToPt(y + incY),
      InToPt(3)
    );

    //values = [OUTPUTTEXT[lang].pg4TabRow2,""];
    y += incY - 0.3;
    pdf.DrawLine(InToPt(1.5), InToPt(y - 0.13), InToPt(PARA_WIDTH));

    //pdf.tableRow(fill, textColor, x, y, values, height, Widths);

    if (twoNeedPercents) {
      values = [
        OUTPUTTEXT[lang].pgTabRowMoreIncome,
        (output.percent1 + "%").toString(),
      ];
      y += 2.1 * incY;
      pdf.DrawLine(InToPt(1.5), InToPt(y), InToPt(PARA_WIDTH));
      pdf.tableRow(fill, textColor, x, y, values, height, Widths);

      values = [
        thereAfterText,
        //(output.percent2 + "%").toString(),
        (output.percent2.map((item) => item + "% ")).toString(),
      ];
      y += incTableY;
      pdf.tableRow(fill, textColor, x, y, values, height, Widths);
      //    pdf.DrawLine(InToPt(1.5), InToPt(y), InToPt(PARA_WIDTH));
    } else {
      values = [
        thereAfterText,
        (output.percent1 + "%").toString(),
      ];
      y += 2.1 * incY;
      pdf.tableRow(fill, textColor, x, y, values, height, Widths);
      //  pdf.DrawLine(InToPt(1.5), InToPt(y), InToPt(PARA_WIDTH));
    }
    values = [OUTPUTTEXT[lang].pg4TabRow5, ""];
    y += 1.5 * incY;
    pdf.tableRow(fill, textColor, x, y, values, height, Widths);
    //pdf.DrawLine(InToPt(1.5), InToPt(y), InToPt(PARA_WIDTH));

    if (twoNeedPercents) {
      values = [
        OUTPUTTEXT[lang].pgTabRowMoreIncome,
        (
          formattedMoneyString(output.percentNeed1,lang)
        /* "$" + formatMoney(output.percentNeed1, 0, decimalChar, thousands) */
        ),
      ];
      y += incY;
      pdf.tableRow(fill, textColor, x, y, values, height, Widths);
      pdf.DrawLine(InToPt(1.5), InToPt(y), InToPt(PARA_WIDTH));

      values = [
        thereAfterText,
        (
          formattedMoneyString(output.percentNeed2.reduce((a, b) => a + b, 0),lang)
        /* "$" + formatMoney(output.percentNeed2.reduce((a, b) => a + b, 0), 0, decimalChar, thousands) */
        ),
      ];
    } else
      values = [
        thereAfterText,
        (
          formattedMoneyString(output.percentNeed1,lang)
        /* "$" + formatMoney(output.percentNeed1, 0, decimalChar, thousands) */
        ),
      ];

    y += incTableY;
    pdf.tableRow(fill, textColor, x, y, values, height, Widths);
    //pdf.DrawLine(InToPt(1.5), InToPt(y), InToPt(PARA_WIDTH));
    //pdf.tableRow(fill, textColor, x, y, values, height, Widths);
    //y += incY;
    //pdf.DrawLine(InToPt(1.5), InToPt(y), InToPt(PARA_WIDTH));

    pdf.addFooterAndHeader(headerOffset, footerText, headerText);

    {
      /* PAGE 5 Family Cash Sources at Death*/
    }
    result=result && pdf.addCustomImage(IMAGE_LOGO_OTHERPAGES, pg1TitleY, image,false,top);

    Widths =  lang === "en"?[3.35, 1.1, 1.1]:[3.65, .95, .95]; // add up to PARA_WIDTH=5.5
    pdf.SetFont(HELVETICA, NORMAL);
    if (lang === "en") pdf.SetFontSize(PxToPt(25));
    else pdf.SetFontSize(PxToPt(20));

    pdf.SetTextColor(0x45, 0x55, 0x60);
    pdf.Text(singlePerson?OUTPUTTEXT[lang].pg5T_1:OUTPUTTEXT[lang].pg5T, InToPt(1.5), InToPt(headerOffset + topToTitle_Y
  ));

    pdf.SetFont(TIMES, NORMAL);

    pdf.SetFontSize(PxToPt(16));

    x = 1.5;
    y = headerOffset + titleToPara_Y;
    incY = 0.44;
    height = 0.35;
    //const Widths = 5;
    values = [
      OUTPUTTEXT[lang].pg5TabT,
      OUTPUTTEXT[lang].pg5TabT2,
      OUTPUTTEXT[lang].pg5TabT3,
    ];
    fill = [115, 153, 198];
    textColor = [255, 255, 255];
    pdf.tableRow(fill, textColor, x, y, values, height, Widths);

    fill = [255, 255, 255];
    textColor = [0x45, 0x55, 0x60];
    pdf.SetTextColor(0x45, 0x55, 0x60);

    /* if (lang === "fr") {
      y += incY;
      y += 0.3;
      pdf.MultilineText(
        OUTPUTTEXT[lang].pg5TabRow1,
        InToPt(x + 0.1),
        InToPt(y),
        InToPt(3)
      );
      pdf.Text(
        "$" + formatMoney(output.govDB, 0, decimalChar, thousands),
        InToPt(x + 3.35),
        InToPt(y)
      );
      pdf.Text(
        "$" + formatMoney(output.govDB, 0, decimalChar, thousands),
        InToPt(x + 4.45),
        InToPt(y)
      );
    } else */ {
      values = [
        OUTPUTTEXT[lang].pg5TabRow1,
        (
          formattedMoneyString(output.govDB,lang)
        /* "$" + formatMoney(output.govDB, 0, decimalChar, thousands) */),
        (
          formattedMoneyString(output.govDB,lang)
        /* "$" + formatMoney(output.govDB, 0, decimalChar, thousands) */),
          
      ];
      y += incY;
      pdf.tableRow(fill, textColor, x, y, values, height, Widths);
    }

    y += incY;
    output.assets.forEach(function (element) {
      values = [
        element.name,
        (
          formattedMoneyString(element.value,lang)
        /* "$" + formatMoney(element.value, 0, decimalChar, thousands) */
        ),
        element.disposeValue > 0
          ? (
            formattedMoneyString(element.disposeValue,lang)
            /* "$" + formatMoney(element.disposeValue, 0, decimalChar, thousands) */
            )
          : "",
      ];
      pdf.tableRow(fill, textColor, x, y, values, height, Widths);
      y += incTableY;
    });

    values = [
      OUTPUTTEXT[lang].pg5TabRow3,
      (
        formattedMoneyString(output.totalAsset,lang)
        /* "$" + formatMoney(output.totalAsset, 0, decimalChar, thousands) */
      ),
      (
        formattedMoneyString(output.totalDisposeAsset,lang)
        /* "$" + formatMoney(output.totalDisposeAsset, 0, decimalChar, thousands) */
      ),
    ];
    y += incY;
    pdf.tableRow(fill, textColor, x, y, values, height, Widths);

   /*  if (lang === "fr") {
      y += 0.73 * incY;
      pdf.MultilineText(
        OUTPUTTEXT[lang].pg5TabRow4,
        InToPt(x + 0.1),
        InToPt(y + 0.4),
        InToPt(3)
      );
      pdf.Text(
        "$" +
          formatMoney(output.totalLiab, 0, decimalChar, thousands),
        InToPt(x + 4.45),
        InToPt(y + 0.41)
      );
      y += 0.73 * incY;
    } else */ {
      values = [
        singlePerson?OUTPUTTEXT[lang].pg5TabRow4_1: OUTPUTTEXT[lang].pg5TabRow4,
        "",
        (
          formattedMoneyString(output.totalLiab,lang)
        /* "$" + formatMoney(output.totalLiab, 0, decimalChar, thousands) */
        ),
      ];
      y += incY;
      pdf.tableRow(fill, textColor, x, y, values, height, Widths);
    }

    y += incY;
    /* pdf.MultilineText(
      OUTPUTTEXT[lang].pg5TabRow5,
      InToPt(x + 0.1),
      InToPt(y + 0.4),
      InToPt(3)
    ); */
    values = [
      singlePerson?OUTPUTTEXT[lang].pg5TabRow5_1: OUTPUTTEXT[lang].pg5TabRow5,
      "",
      (
        formattedMoneyString(output.totalDisposeAsset - output.totalLiab,lang)
        /* "$" + formatMoney(output.totalDisposeAsset - output.totalLiab, 0, decimalChar, thousands) */
      ),
    ];
    //y += incY;
    pdf.tableRow(fill, textColor, x, y, values, height, Widths);
    
    /* pdf.Text(
      "$" +
        formatMoney(
          output.totalDisposeAsset - output.totalLiab,
          0,
          decimalChar,
          thousands
        ),
      InToPt(x + 4.45),
      InToPt(y + 0.41)
    ); */

    y += incY;
    pdf.DrawLine(InToPt(1.5), InToPt(y - 0.43), InToPt(PARA_WIDTH));

    pdf.addFooterAndHeader(headerOffset, footerText, headerText);

   
   
   
   
    {
      /* PAGE 6 Family Income Sources at Death*/
    }
    result=result && pdf.addCustomImage(IMAGE_LOGO_OTHERPAGES, pg1TitleY, image,false,top);
    Widths = [4.4, 1.1]; // add up to PARA_WIDTH=5.5
    Widths = [3.0,1.6, .9]; // add up to PARA_WIDTH=5.5
    pdf.SetFont(HELVETICA, NORMAL);
    if (lang === "en") pdf.SetFontSize(PxToPt(25));
    else pdf.SetFontSize(PxToPt(20));

    pdf.SetTextColor(0x45, 0x55, 0x60);
    pdf.Text(singlePerson?OUTPUTTEXT[lang].pg6T_1: OUTPUTTEXT[lang].pg6T, InToPt(1.5), InToPt(headerOffset + topToTitle_Y
  ));

    pdf.SetFont(TIMES, NORMAL);

    pdf.SetFontSize(PxToPt(16));

    x = 1.5;
    y = headerOffset + titleToPara_Y;
    incY = 0.44;
    height = 0.35;
    //const Widths = 5;
    /* values = [OUTPUTTEXT[lang].pg6TabT];
    fill = [115, 153, 198];
    textColor = [255, 255, 255];
    pdf.tableRow(fill, textColor, x, y, values, height, [PARA_WIDTH]); */

    values = [
      OUTPUTTEXT[lang].pg6TabT,
      OUTPUTTEXT[lang].pg5TabT2,
      OUTPUTTEXT[lang].pg5TabT3,
    ];
    fill = [115, 153, 198];
    textColor = [255, 255, 255];
    pdf.tableRow(fill, textColor, x, y, values, height, Widths);



    fill = [255, 255, 255];
    textColor = [0x45, 0x55, 0x60];

    y += incY;
    output.sources.forEach(function (element) {
      values = [
        element.name,
        (
          formattedMoneyString(element.value,lang)
        /* "$" + formatMoney(element.value, 0, decimalChar, thousands) */
        ),
        formattedMoneyString(element.valueAtDeath,lang),
      ];
      pdf.tableRow(fill, textColor, x, y, values, height, Widths);
      y += incTableY;
    });
    y += incY;
    pdf.MultilineText(
      OUTPUTTEXT[lang].pg6TabRow1,
      InToPt(x + 0.1),
      InToPt(y + 0.35),
      InToPt(3)
    );
    y += incY + 0.3;
    pdf.DrawLine(InToPt(1.5), InToPt(y - 0.04), InToPt(PARA_WIDTH));
    //y += incY+.1;

    // Widths = [3.1, 1.2, 1.2]; // add up to PARA_WIDTH=5.5
    Widths = [4.8, .8]; // add up to PARA_WIDTH=5.5
  
    if (twoNeedPercents) {
      y += incY - 0.27;

      pdf.tableRow(
        fill,
        textColor,
        x,
        y,
        [OUTPUTTEXT[lang].pgTabRowMoreIncome],
        height,
        Widths
      );

      pdf.SetFontSize(PxToPt(12));
      pdf.tableRow(
        fill,
        textColor,
        x + 3.6,
        y,
        [
          "(" +
            labelsBilingual.pg6Net +
            (
              formattedMoneyString(output.totalSourceATaxAtDeath,lang)
        /* "  $" +
              formatMoney(output.totalSourceATax, 0, decimalChar, thousands) */
            ).toString() +
            ")",
        ],
        height,
        Widths
      );
      pdf.SetFontSize(PxToPt(16));
      pdf.tableRow(
        fill,
        textColor,
        x + 4.6,
        y,
        [
          (
            formattedMoneyString(output.totalSourceAtDeath,lang)
        /* "$" + formatMoney(output.totalSource, 0, decimalChar, thousands) */
          ),
        ],
        height,
        Widths
      );

      // y += incY;
      y += incColourdRowsY;

      pdf.tableRow(
        fill,
        textColor,
        x,
        y,
        [!singleFamily?thereAfterText: (thereAfterTextSF)],
        height,
        Widths
      );

      pdf.SetFontSize(PxToPt(12));
      pdf.tableRow(
        fill,
        textColor,
        x + 3.6,
        y,
        [
          "(" +
            labelsBilingual.pg6Net +
            (
              formattedMoneyString(output.totalSource2ATaxAtDeath,lang)
        /* "  $" +
              formatMoney(output.totalSource2ATax, 0, decimalChar, thousands) */
            ).toString() +
            ")",
        ],
        height,
        Widths
      );
      pdf.SetFontSize(PxToPt(16));
      pdf.tableRow(
        fill,
        textColor,
        x + 4.6,
        y,
        [
          (
            formattedMoneyString(output.totalSource2AtDeath,lang)
        /* "$" + formatMoney(output.totalSource2, 0, decimalChar, thousands) */
          ),
        ],
        height,
        Widths
      );

      /* values = [
        OUTPUTTEXT[lang].pgTabRowMoreIncome,
        (
          "$" + formatMoney(output.totalSource, 0, decimalChar, thousands)
        ),
      ];
      y += incY - 0.27;
      pdf.tableRow(fill, textColor, x, y, values, height, Widths);
 */
      /*     values = [
        thereAfterText,
        (
          "$" + formatMoney(output.totalSource2, 0, decimalChar, thousands)
        ),
      ];
      y += incY;
      pdf.SetFontSize(PxToPt(16));
      pdf.tableRow(fill, textColor, x, y, values, height, Widths);

      values = [
        "(" + ("$" + formatMoney(output.totalSourceATax, 0, decimalChar, thousands)
      ) + " " + labelsBilingual.pg6Net + ")",
    ];
    pdf.SetFontSize(PxToPt(12));
    pdf.tableRow(fill, textColor, x+3, y, values, height, Widths); */
      pdf.SetFontSize(PxToPt(16));
    } else {
      /*    values = [
        thereAfterText,
        (
          "$" + formatMoney(output.totalSource1, 0, decimalChar, thousands)
        )
        +
        "          (" + ("$" + formatMoney(output.totalSource2ATax, 0, decimalChar, thousands)
      ) + " " + labelsBilingual.pg6Net + ")",
      ]; */
      y += incY;
      pdf.tableRow(
        fill,
        textColor,
        x,
        y,
        [!singleFamily?thereAfterText: (thereAfterTextSF)],
        height,
        Widths
      );

      pdf.SetFontSize(PxToPt(12));
      pdf.tableRow(
        fill,
        textColor,
        x + 3.6,
        y,
        [
          "(" +
            labelsBilingual.pg6Net +
            (
              formattedMoneyString(output.totalSourceATaxAtDeath,lang)
        /* "  $" +
              formatMoney(output.totalSourceATax, 0, decimalChar, thousands) */
            ) +
            ")",
        ],
        height+.1,
        Widths
      );
      pdf.SetFontSize(PxToPt(16));
      pdf.tableRow(
        fill,
        textColor,
        x + 4.6,
        y,
        [
          (
            formattedMoneyString(output.totalSourceAtDeath,lang)
        /* "$" + formatMoney(output.totalSource, 0, decimalChar, thousands) */
          ),
        ],
        height+.1,
        Widths
      );

      /*      pdf.tableRow(fill, textColor, x, y, values, height, Widths); */
    }
    y += incY + 0.5;
    pdf.MultilineText(
      OUTPUTTEXT[lang].pgTabRowMoreIncome,
      InToPt(x + 0.1),
      InToPt(y),
      InToPt(3)
    );
    y += incY - 0.13;
    pdf.DrawLine(InToPt(1.5), InToPt(y + 0.26), InToPt(PARA_WIDTH));

    //values = [OUTPUTTEXT[lang].pgTabRowMoreIncome, ("$"+ formatMoney(output.percentNeed1-output.totalSource, 0,decimalChar,thousands))];
    //y += incY;
    //pdf.tableRow(fill, textColor, x, y, values, height, Widths);

    //	values = [thereAfterText, ("$"+ formatMoney(output.percentNeed2-output.totalSource2, 0,decimalChar,thousands))];
    //	y += incY;
    //pdf.tableRow(fill, textColor, x, y, values, height, Widths);
    //#7399C6
    //pdf.Text(thereAfterText,  x, y);
    //pdf.tableRow(fill, textColor, x, y, thereAfterText, [1]);

    values = [OUTPUTTEXT[lang].pgTabRowMoreIncome];
    y += incY;
    //Widths = [3.1,1.2, 1.2]; // add up to PARA_WIDTH=5.5
    pdf.tableRow(fill, textColor, x, y, values, height, Widths);

    if (twoNeedPercents) {
      pdf.SetFontSize(PxToPt(12));
      pdf.tableRow(
        fill,
        textColor,
        x + 3.6,
        y,
        [
          "(" +
            (
              formatMoney(output.percentNeed1, 0, decimalChar, thousands)
            ).toString() +
            "-" +
            (
              
              formatMoney(output.totalSourceATaxAtDeath, 0, decimalChar, thousands)
            ).toString() +
            ")",
        ],
        height+.1,
        [1.2]
      );

      pdf.SetFontSize(PxToPt(16));
      fill = [196, 223, 224];
      
      values2=(
        formattedMoneyString(Math.max(0, output.percentNeed1 - output.totalSourceATaxAtDeath),lang)
        /* "$" +
        formatMoney(
          Math.max(0, output.percentNeed1 - output.totalSourceATax),
          0,
          decimalChar,
          thousands
        ) */
      )
      pdf.tableRowSingle(fill, textColor, x+4.6, y, values2, height, Widths, true);
      /* pdf.tableRow(
        fill,
        textColor,
        x + 4.4,
        y,
        [
          (
            "$" +
            formatMoney(
              Math.max(0, output.percentNeed1 - output.totalSourceATax),
              0,
              decimalChar,
              thousands
            )
          ),
        ],
        height,
        [1]
      );
 */
      fill = [255, 255, 255];
      values = [!singleFamily?thereAfterText:(thereAfterTextSF)];
      //y += incY;
      y += incColourdRowsY;
      pdf.tableRow(fill, textColor, x, y, values, height, Widths);

      pdf.SetFontSize(PxToPt(12));
      pdf.tableRow(
        fill,
        textColor,
        x + 3.6,
        y,
        [
          "(" +
            (
              formatMoney(output.percentNeed2.reduce((a, b) => a + b, 0), 0, decimalChar, thousands)
            ).toString() +
            "-" +
            (
              formatMoney(output.totalSource2ATaxAtDeath, 0, decimalChar, thousands)
            ).toString() +
            ")",
        ],
        height+.1,
        [1.2]
      );

      pdf.SetFontSize(PxToPt(16));
      fill = [196, 223, 224];
      values2=(
        formattedMoneyString(Math.max(0, output.percentNeed2.reduce((a, b) => a + b, 0) - output.totalSource2ATaxAtDeath),lang)
        /* "$" +
        formatMoney(
          Math.max(0, output.percentNeed2.reduce((a, b) => a + b, 0) - output.totalSource2ATax),          
          0,
          decimalChar,
          thousands
        ) */
      )
      pdf.tableRowSingle(fill, textColor, x+4.6, y, values2, height, Widths, true);
/* 
      pdf.tableRow(
        fill,
        textColor,
        x + 4.4,
        y,
        [
          (
            "$" +
            formatMoney(
              Math.max(0, output.percentNeed2 - output.totalSource2ATax),
              0,
              decimalChar,
              thousands
            )
          ),
        ],
        height,
        [1]
      ); */
    } else {
      fill = [255, 255, 255];
      pdf.SetFontSize(PxToPt(12));
      pdf.tableRow(
        fill,
        textColor,
        x + 3.6,
        y,
        [
          "(" +
            (
              formatMoney(output.percentNeed1, 0, decimalChar, thousands)
            ).toString() +
            "-" +
            (
              
              formatMoney(output.totalSourceATaxAtDeath, 0, decimalChar, thousands)
            ).toString() +
            ")",
        ],
        height+.1,
        [1.2]
      );
      pdf.SetFontSize(PxToPt(16));
      fill = [196, 223, 224];
      
      values2=(
        formattedMoneyString(Math.max(0, output.percentNeed1 - output.totalSourceATaxAtDeath),lang)
        /* "$" +
        formatMoney(
          Math.max(0, output.percentNeed1 - output.totalSourceATax),
          0,
          decimalChar,
          thousands
        ) */
      )
      pdf.tableRowSingle(fill, textColor, x+4.6, y, values2, height, Widths, true);
      
    }

    pdf.SetFontSize(PxToPt(16));
    /*       fill = [196, 223, 224];


    pdf.tableRow(
        fill,
        textColor,
        x + 4.4,
        y,
        [
          (
            "$" +
            formatMoney(
              Math.max(0, output.percentNeed1 - output.totalSource),
              0,
              decimalChar,
              thousands
            )
          ),
        ],
        height,
        [1]
      ); */

    pdf.addFooterAndHeader(headerOffset, footerText, headerText);

   
   
   
   
   
   
   
   
   
    {
      // remove this page
      /* PAGE 7 Life info anal*/
    } /* 
    pdf.addCustomImage(IMAGE_LOGO_OTHERPAGES, pg1TitleY, image);

    Widths = [4.3, 1.2];
    pdf.SetFont(HELVETICA, NORMAL);
    if (lang === "en") pdf.SetFontSize(PxToPt(25));
    else pdf.SetFontSize(PxToPt(20));

    pdf.SetTextColor(0x45, 0x55, 0x60);
    pdf.Text(OUTPUTTEXT[lang].pg7T, InToPt(1.5), InToPt(headerOffset+topToTitle_Y
  ));

    pdf.SetFont(TIMES, NORMAL);

    pdf.SetFontSize(PxToPt(16));

    x = 1.5;
    y = headerOffset+titleToPara_Y;
    incY = 0.42;
    height = 0.35;
    //const Widths = 5;
    values = [OUTPUTTEXT[lang].pg7TabT];
    fill = [115, 153, 198];
    textColor = [255, 255, 255];
    pdf.tableRow(fill, textColor, x, y, values, height, [PARA_WIDTH]);

    fill = [255, 255, 255];
    textColor = [0x45, 0x55, 0x60];
    pdf.SetTextColor(0x45, 0x55, 0x60);

    y += incY + 0.2;
    pdf.MultilineText(
      OUTPUTTEXT[lang].pg7TabRow1,
      InToPt(x + 0.1),
      InToPt(y),
      InToPt(3)
    );
    y += incY / 2;

    //if (output.hasChild) {
    //	if (output.ygChild < 18) {
    if (twoNeedPercents) {
      values = [
        OUTPUTTEXT[lang].pg7TabRow2,
        (
          "$" +
          formatMoney(
            Math.max(0, output.percentNeed1 - output.totalSource),
            0,
            decimalChar,
            thousands
          )
        ),
      ];
      y += incY;
      pdf.tableRow(fill, textColor, x + 0.1, y, values, height, Widths);

      values = [
        thereAfterText,
        (
          "$" +
          formatMoney(
            Math.max(0, output.percentNeed2 - output.totalSource2),
            0,
            decimalChar,
            thousands
          )
        ),
      ];
    } else
      values = [
        thereAfterText,
        (
          "$" +
          formatMoney(
            Math.max(0, output.percentNeed1 - output.totalSource),
            0,
            decimalChar,
            thousands
          )
        ),
      ];

    y += incY;
    pdf.tableRow(fill, textColor, x + 0.1, y, values, height, Widths);

    values = [OUTPUTTEXT[lang].pg7TabRow4, (output.infRate + "%")];
    y += incY;
    pdf.tableRow(fill, textColor, x + 0.1, y, values, height, Widths);

    y += incY + 0.22;
    pdf.MultilineText(
      OUTPUTTEXT[lang].pg7TabRow5,
      InToPt(x + 0.2),
      InToPt(y),
      InToPt(3)
    );
    pdf.Text(
      (output.invRate + "%"),
      InToPt(x + 4.25),
      InToPt(y + 0.21)
    );

    y += incY + 0.3;
    pdf.DrawLine(InToPt(1.5), InToPt(y - 0.23), InToPt(PARA_WIDTH));
    y += incY - 0.2;
    pdf.MultilineText(
      OUTPUTTEXT[lang].pg7TabRow6,
      InToPt(x + 0.2),
      InToPt(y),
      InToPt(3)
    );
    y += incY - 0.2;
    values = [
      OUTPUTTEXT[lang].pg7TabRow7 + props.LE + ")",
      (
        "$" +
        formatMoney(
          Math.max(0, output.insNeedLE + output.totalAsset - output.totalLiab),
          0,
          decimalChar,
          thousands
        )
      ),
    ];
    y += incY + 0.1;
    pdf.tableRow(fill, textColor, x, y, values, height, Widths);

    values = [
      OUTPUTTEXT[lang].pg7TabRow8,
      (
        "$" +
        formatMoney(
          Math.max(0, output.insNeedRet + output.totalAsset - output.totalLiab),
          0,
          decimalChar,
          thousands
        )
      ),
    ];
    y += incY;
    pdf.tableRow(fill, textColor, x, y, values, height, Widths);

    if (output.hasChild) {
      if (output.ygChild < maxDur) {
        values = [
          OUTPUTTEXT[lang].pg7TabRow9,
          (
            "$" +
            formatMoney(
              Math.max(
                0,
                output.insNeedYgChild25 + output.totalAsset - output.totalLiab
              ),
              0,
              decimalChar,
              thousands
            )
          ),
        ];
        y += incY;
        pdf.tableRow(fill, textColor, x, y, values, height, Widths);
      }

      if (output.ygChild < orphAge) {
        values = [
          OUTPUTTEXT[lang].pg7TabRow10,
          (
            "$" +
            formatMoney(
              Math.max(
                0,
                output.insNeedYgChild18 + output.totalAsset - output.totalLiab
              ),
              0,
              decimalChar,
              thousands
            )
          ),
        ];
        y += incY;
        pdf.tableRow(fill, textColor, x, y, values, height, Widths);
      }
    }
    //  pdf.AddChart("bar1", InToPt(1.5), InToPt(y + 0.7), InToPt(4), InToPt(2));

    pdf.addFooterAndHeader(headerOffset,footerText, headerText);
 */
    {
      /* PAGE 8 Life info anal 2 */
    }
    result=result && pdf.addCustomImage(IMAGE_LOGO_OTHERPAGES, pg1TitleY, image,false,top);

    Widths = [4.3, 1.2];
    pdf.SetFont(HELVETICA, NORMAL);
    if (lang === "en") pdf.SetFontSize(PxToPt(25));
    else pdf.SetFontSize(PxToPt(20));

    pdf.SetTextColor(0x45, 0x55, 0x60);
    pdf.Text(OUTPUTTEXT[lang].pg8T, InToPt(1.5), InToPt(headerOffset + topToTitle_Y
  ));

    pdf.SetFont(TIMES, NORMAL);

    pdf.SetFontSize(PxToPt(16));

    x = 1.5;
    y = headerOffset + titleToPara_Y;
    incY = 0.42;
    height = 0.35;
    //const Widths = 5;
    values = [singlePerson?OUTPUTTEXT[lang].pg8TabT_1: OUTPUTTEXT[lang].pg8TabT];
    fill = [115, 153, 198];
    textColor = [255, 255, 255];
    pdf.tableRow(fill, textColor, x, y, values, height, [PARA_WIDTH]);

    fill = [255, 255, 255];
    textColor = [0x45, 0x55, 0x60];
    pdf.SetTextColor(0x45, 0x55, 0x60);

    /* values = [OUTPUTTEXT[lang].pg8TabRow1, ("$"+ formatMoney(totalAsset-output.totalLiab, 0,decimalChar,thousands))];
	  y += incY;	
	  pdf.tableRow(fill, textColor, x, y, values, height, Widths); */

    y += incY + 0.2;
    pdf.MultilineText(
      OUTPUTTEXT[lang].pg8TabRow1,
      InToPt(x),
      InToPt(y),
      InToPt(3)
    );
    pdf.Text(
      (
        formattedMoneyString(output.totalDisposeAsset - output.totalLiab,lang)
        /* "$" +
        formatMoney(
          output.totalDisposeAsset - output.totalLiab,
          0,
          decimalChar,
          thousands
        ) */
      ),
      InToPt(x + 4.42),
      InToPt(y + 0.21)
    );

    y += incY + 0.3;
    pdf.MultilineText(
      OUTPUTTEXT[lang].pg8TabRow2,
      InToPt(x),
      InToPt(y),
      InToPt(3)
    );
    y += incY - 0.1;

    if(!singleFamily)
    {
    values = [
      OUTPUTTEXT[lang].pg8TabRow3 + props.LE + ")",
      (
        formattedMoneyString(output.insNeedLE,lang)
        /* "$" + formatMoney(output.insNeedLE, 0, decimalChar, thousands) */
      ),
    ];
    y += incY + 0.1;
    pdf.tableRow(fill, textColor, x, y, values, height, Widths);
  }

    values = [
      singleFamily? OUTPUTTEXT[lang].pg8TabRow4Alt.replace("A. ",""): OUTPUTTEXT[lang].pg8TabRow4,
      (
        formattedMoneyString(output.insNeedRet,lang)
        /* "$" + formatMoney(output.insNeedRet, 0, decimalChar, thousands) */
      ),
    ];
    y += incY;
    pdf.tableRow(fill, textColor, x, y, values, height, Widths);

    if (output.hasChild) {
      if (output.ygChild < maxDur) {
        values = [
          singleFamily?OUTPUTTEXT[lang].pg8TabRow5.replace("C.","B.").replace("25",output.youngestChildEndAge): OUTPUTTEXT[lang].pg8TabRow5.replace("25",output.youngestChildEndAge),
          (
            formattedMoneyString(output.insNeedYgChild25,lang)
        /* "$" +
            formatMoney(output.insNeedYgChild25, 0, decimalChar, thousands) */
          ),
        ];
        y += incY;
        pdf.tableRow(fill, textColor, x, y, values, height, Widths);
      }

      if (output.ygChild < orphAge) {
        values = [
          singleFamily?OUTPUTTEXT[lang].pg8TabRow6.replace("D.","C."): OUTPUTTEXT[lang].pg8TabRow6,
          (
            formattedMoneyString(output.insNeedYgChild18,lang)
        /* "$" +
            formatMoney(output.insNeedYgChild18, 0, decimalChar, thousands) */
          ),
        ];
        y += incY;
        pdf.tableRow(fill, textColor, x, y, values, height, Widths);
      }
    }
    pdf.AddChart("bar2", InToPt(1.5), InToPt(y + 0.7), InToPt(4), InToPt(2));

    pdf.addFooterAndHeader(headerOffset, footerText, headerText);

    {
      /* Nptes*/
    }
    result=result && pdf.addCustomImage(IMAGE_LOGO_OTHERPAGES, pg1TitleY, image,false,top);

    pdf.SetFont(HELVETICA, NORMAL);
    if (lang === "en") pdf.SetFontSize(PxToPt(25));
    else pdf.SetFontSize(PxToPt(20));

    pdf.SetTextColor(0x45, 0x55, 0x60);
    pdf.Text(OUTPUTTEXT[lang].pg9T, InToPt(1.5), InToPt(headerOffset+topToTitle_Y
  ));

    paragraph = OUTPUTTEXT[lang].pg9P1;
    pdf.SetFont(TIMES, NORMAL);
    pdf.SetFontSize(PxToPt(16));
    pdf.SetTextColor(0x45, 0x55, 0x60);
    pdf.MultilineText(paragraph, InToPt(1.5), InToPt(headerOffset+1.8), InToPt(PARA_WIDTH));

    //pdf.addFooterAndHeader(headerOffset,footerText, headerText);
    pdf.addHeaderNoFooter(headerOffset,headerText);
    {
      /* Acknow*/
    }
    result=result && pdf.addCustomImage(IMAGE_LOGO_OTHERPAGES, pg1TitleY, image,false,top);

    pdf.SetFont(HELVETICA, NORMAL);
    if (lang === "en") pdf.SetFontSize(PxToPt(25));
    else pdf.SetFontSize(PxToPt(20));

    pdf.SetTextColor(0x45, 0x55, 0x60);
    pdf.Text(OUTPUTTEXT[lang].pg10T, InToPt(1.5), InToPt(headerOffset + topToTitle_Y
  ));

    paragraph = OUTPUTTEXT[lang].pg10P1;
    pdf.SetFont(TIMES, NORMAL);
    pdf.SetFontSize(PxToPt(16));
    pdf.SetTextColor(0x45, 0x55, 0x60);
    pdf.MultilineText(
      paragraph,
      InToPt(1.5),
      InToPt(headerOffset + 1.8),
      InToPt(PARA_WIDTH)
    );

    pdf.SetFont(TIMES, NORMAL);

    pdf.SetFontSize(PxToPt(16));

    x = 1.5;
    y = headerOffset + 3.6;
    incY = 0.42;
    height = 0.35;
    //const Widths = 5;
    fill = [255, 255, 255];
    textColor = [0x45, 0x55, 0x60];
    pdf.SetTextColor(0x45, 0x55, 0x60);

    let yOffset = props.lang === "fr" ? 3 : 4;
    y += incY + 0.2;
    pdf.MultilineText(
      OUTPUTTEXT[lang].pg10TabRow1,
      InToPt(x),
      InToPt(y),
      InToPt(4)
    );
    pdf.Text(OUTPUTTEXT[lang].pg10TabRow11, InToPt(x + yOffset), InToPt(y));

    y += incY;
    pdf.MultilineText(
      OUTPUTTEXT[lang].pg10TabRow2,
      InToPt(x),
      InToPt(y),
      InToPt(4)
    );
    pdf.Text(OUTPUTTEXT[lang].pg10TabRow11, InToPt(x + yOffset), InToPt(y));

    y += incY;
    pdf.MultilineText(
      OUTPUTTEXT[lang].pg10TabRow3,
      InToPt(x),
      InToPt(y),
      InToPt(4)
    );
    pdf.Text(OUTPUTTEXT[lang].pg10TabRow11, InToPt(x + yOffset), InToPt(y));

    pdf.Footer(OUTPUTTEXT[lang].pgFooter);

    if(result===false)
      alert(lang==="en"? "PDF image error, SVG extension is not supported":"Erreur d’image PDF, l’extension SVG n’est pas prise en charge")  

    // Done
    pdf.Save("INA_PDF.pdf");
  }
}

