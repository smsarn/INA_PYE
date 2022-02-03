import {
    TITLES,
    ASSETS,
    IMAGE_LOGO,
    IMAGE_LOGO_OTHERPAGES,
    IMAGE_APPLET_EP,
  } from "../definitions/generalDefinitions";
  import { OUTPUTTEXT} from "../definitions/outputDefinitions";
  import { OUTPUTTEXTEP  } from "../definitions/outputDefinitionsEP";
  import { formatMoney, formatMoney2, cleanFormat } from "../utils/helper";
  import { getOutputValues } from "../data/dataExchange";
  import {insertGrid} from "./OutputPDFEP"

  import {
    PDF,
    InToPt,
    PxToPt,
    HELVETICA,
    TIMES,
    NORMAL,
    BOLD,
    HEADER_RECT_IN_W,
  } from "./PDF";
  import {
    ASSET_TAX_TYPE_PRINCIPAL_RES,
    ASSET_TAX_TYPE_REAL_ESTATE,
    ASSET_TAX_TYPE_STOCKS,
    ASSET_TAX_TYPE_SMALL_BUS,
    ASSET_TAX_TYPE_RRSP,
    ASSET_TAX_TYPE_INTEREST,
    ASSET_TAX_TYPE_OTHER,
    ASSET_TAX_TYPE_COUNT,
  } from "../definitions/outputDefinitionsEP";
  
  const DISPLAY_INCOME = 1;
  
  const BULLET_FONT_SIZE = 24;
  const NUMBER_BULLET_FONT_SIZE = 11;
  const GRID_AGGREGATE = 0;
  const GRID_INDIVIDUAL = 1;
  
  const LINES_PER_PAGE_LANDSCAPE = 27;
  const LINES_PER_PAGE_PORTRAIT = 37;
  


export async function doSavePdfINAAppendixAction(props) {
  //  try 
  {
        let pdf = new PDF();
        pdf.Create();
    
       // var paragraph;
        let height = 0.2;
        let Widths = [1.2, 0.6, 1.8, 1.4];
        let values;
        const paraWidth = 6;
        const paraLeft = 1.2;
        const lineHeight = 0.196;
        const indent = 0.15;
        let paraY = 1;// 2.2 * lineHeight;
    
        // pdf output shared with presentation
      //  let output = getOutputValues(props);
    
        const lang = props.dataInput.Presentations[0].language;
        const pg1TitleY = 4.2;
    
    //  pdf.Header(OUTPUTTEXT[lang].pg1T);

// Appendix title
      setFontForTitle(pdf, lang, 16);
      let paragraph = OUTPUTTEXT[lang].pgAppendix + ": " + OUTPUTTEXT[lang].pgAppendixT;
      insertPara(pdf, paragraph, paraLeft-.4, paraY, paraWidth);
    
      setFontForParas(pdf);
      paragraph = OUTPUTTEXT[lang].pgAppendixP1;
      paraY = paraY + 4 *lineHeight;
    insertPara(pdf, paragraph, paraLeft, paraY, paraWidth);
     
    paraY = paraY + 1.5* lineHeight;
     
      const graphWidth=paraWidth+1
      let h= document.getElementById("barNeeds").clientHeight
      let w= document.getElementById("barNeeds").clientWidth
      const maxH=2;
      const maxH2=2.5
      let hFinal=graphWidth*h/w>maxH?maxH:graphWidth*h/w
      let wFinal=graphWidth*h/w>maxH?maxH*w/h:graphWidth
      
      pdf.AddChart(
        "barNeeds",
        InToPt(paraLeft-.5),
        InToPt(paraY),
        InToPt(wFinal),
        InToPt(hFinal)
        //InToPt(graphWidth),
        //InToPt(graphWidth*h/w)
      );
      // paraY = paraY + 5*lineHeight;
      
      paraY = paraY + 12* lineHeight;
      paragraph = OUTPUTTEXT[lang].pgAppendixP2;
      insertPara(pdf, paragraph, paraLeft, paraY, paraWidth);
      paraY = paraY + 1.5* lineHeight;
     
      h= document.getElementById("barShortfall").clientHeight
      w= document.getElementById("barShortfall").clientWidth
      hFinal=graphWidth*h/w>maxH?maxH:graphWidth*h/w
      wFinal=graphWidth*h/w>maxH?maxH*w/h:graphWidth
      pdf.AddChart(
        "barShortfall",
        InToPt(paraLeft-.5),
        InToPt(paraY),
        InToPt(wFinal),
        InToPt(hFinal)
      );
      
      h= document.getElementById("pieAssets").clientHeight
      w= document.getElementById("pieAssets").clientWidth
      hFinal=graphWidth*h/w>maxH2?maxH2:graphWidth*h/w
      wFinal=graphWidth*h/w>maxH2?2*maxH2*w/h:graphWidth/2
      
      paraY = paraY + 13 * lineHeight;
      paragraph = OUTPUTTEXT[lang].pgAppendixP3;
      insertPara(pdf, paragraph, paraLeft, paraY, paraWidth);
      paraY = paraY + 1.5* lineHeight;
      pdf.AddChart(
        "pieAssets",
        InToPt(paraLeft-1),
        InToPt(paraY),
        /* InToPt(wFinal),
        InToPt(.8*hFinal) */
        InToPt(graphWidth/2),
        InToPt(graphWidth*h/w)
      );
     // paraY = paraY + 10 * lineHeight;
     h= document.getElementById("pieLiabs").clientHeight
     w= document.getElementById("pieLiabs").clientWidth
     hFinal=graphWidth*h/w>maxH2?maxH2:graphWidth*h/w
     wFinal=graphWidth*h/w>maxH2?2*maxH2*w/h:graphWidth/2
      pdf.AddChart(
        "pieLiabs",
        InToPt(paraLeft+graphWidth/2-.5),
        InToPt(paraY),
        /* InToPt(wFinal),
        InToPt(.8*hFinal) */
        InToPt(graphWidth/2),
        InToPt(graphWidth*h/w)
      );

      pdf.Footer(OUTPUTTEXT[lang].pgFooter);

      const LE = props.LE; //- props.assetProjections[0].grid.dataProjection[1][0];
      const lastRow=props.aggregateGrid.dataProjection[0].length
      paragraph = OUTPUTTEXT[lang].pgAppendix + ": " + OUTPUTTEXT[lang].pgAppendixT;
    /* 
      insertGrid2(
        pdf,
        props.aggregateGrid,
        LE,
        paraLeft - 0.2,
        1.65 * paraWidth,
        lang,
        true,
        "landscape",
        0,
        GRID_AGGREGATE,
        lastRow
      ); */
      insertGrid(
        pdf,
        props.aggregateGrid,
        LE,
        paraLeft - 0.2,
        1.65 * paraWidth,
        lang,
        true,
        "landscape",
        0,
        lastRow,        
        GRID_AGGREGATE,
        .65,
        paragraph, "", "", "", OUTPUTTEXT[lang].pgFooter
      )  

      // if too long add another page
      if (
        lastRow > LINES_PER_PAGE_LANDSCAPE &&
        lastRow < 2 * LINES_PER_PAGE_LANDSCAPE
      )
        insertGrid(
          pdf,
          props.aggregateGrid,
          LE,
          paraLeft - 0.2,
          1.65 * paraWidth,
          lang,
          true,
          "landscape",
          LINES_PER_PAGE_LANDSCAPE,
          lastRow,
          GRID_AGGREGATE,.65,
          paragraph, "", "", "", OUTPUTTEXT[lang].pgFooter
          );
      else if (lastRow > 2 * LINES_PER_PAGE_LANDSCAPE) {
        insertGrid(
          pdf,
          props.aggregateGrid,
          LE,
          paraLeft - 0.2,
          1.65 * paraWidth,
          lang,
          true,
          "landscape",
          LINES_PER_PAGE_LANDSCAPE,
          lastRow,  
          GRID_AGGREGATE,.65,
          paragraph, "", "", "", OUTPUTTEXT[lang].pgFooter
        );
        insertGrid(
          pdf,
          props.aggregateGrid,
          LE,
          paraLeft - 0.2,
          1.65 * paraWidth,
          lang,
          true,
          "landscape",
          2 * LINES_PER_PAGE_LANDSCAPE,
          lastRow,  
          GRID_AGGREGATE,.65,
          paragraph, "", "", "", OUTPUTTEXT[lang].pgFooter
        );
      }

      pdf.Footer(OUTPUTTEXT[lang].pgFooter);
    
          /*/*-Appendix		grids // Page 8*/
    
          // add a landscape page for aggregate grid
    
/*           const LE = props.LE; //- props.assetProjections[0].grid.dataProjection[1][0];
          insertGrid2(
            pdf,
            props.aggregateGrid,
            LE,
            paraLeft - 0.2,
            1.65 * paraWidth,
            lang,
            true,
            "landscape",
            0,
            GRID_AGGREGATE
          );
          // if too long add another page
          if (
            LE + 3 > LINES_PER_PAGE_LANDSCAPE &&
            LE + 3 < 2 * LINES_PER_PAGE_LANDSCAPE
          )
            insertGrid2(
              pdf,
              props.aggregateGrid,
              LE,
              paraLeft - 0.2,
              1.65 * paraWidth,
              lang,
              true,
              "landscape",
              LINES_PER_PAGE_LANDSCAPE,
              GRID_AGGREGATE
            );
          else if (LE + 3 > 2 * LINES_PER_PAGE_LANDSCAPE) {
            insertGrid2(
              pdf,
              props.aggregateGrid,
              LE,
              paraLeft - 0.2,
              1.65 * paraWidth,
              lang,
              true,
              "landscape",
              LINES_PER_PAGE_LANDSCAPE,
              GRID_AGGREGATE
            );
            insertGrid2(
              pdf,
              props.aggregateGrid,
              LE,
              paraLeft - 0.2,
              1.65 * paraWidth,
              lang,
              true,
              "landscape",
              2 * LINES_PER_PAGE_LANDSCAPE,
              GRID_AGGREGATE
            );
          }
          for (let j = 0; j < props.assetProjections.length; ++j)
            insertGrid2(
              pdf,
              props.assetProjections[j].grid,
              LE,
              paraLeft,
              paraWidth,
              lang,
              true,
              "portrait",
              0,
              GRID_INDIVIDUAL
            );
    
          //end ofPage 8
          pdf.addFooterAndHeader(headerOffset, footerText, headerText);
    
          //-Using Life Insurance to Preserve Your Estate		// Page 6
          // logo if asked for
          //    pdf.addCustomImage("EPOtherPagesLogo", pg1TitleY, image);
          result =
            result &&
            pdf.addCustomImage(IMAGE_LOGO_OTHERPAGES, pg1TitleY, image, false, top);
    
          paraY = 8 * lineHeight;
          setFontForTitle(pdf, lang);
          pdf.Text(OUTPUTTEXTEP[lang].pg9T, InToPt(paraLeft), InToPt(paraY));
          setFontForParas(pdf);
    
          paraY = paraY + 2 * lineHeight;
          insertPara(pdf, OUTPUTTEXTEP[lang].pg9P1, paraLeft, paraY, paraWidth);
          paraY = paraY + (lang === "fr" ? 7 : 6) * lineHeight;
          insertPara(pdf, OUTPUTTEXTEP[lang].pg9P2, paraLeft, paraY, paraWidth);
    
          //pdf.Footer(OUTPUTTEXTEP[lang].pgFooter);
          // pdf.showOnPage();
*/
          var data = pdf.showOnPage();
    
//        // Done
          pdf.Save("INA_Appendix_PDF.pdf");
          return data;
        }
    
  
}

    function setFontForTitle(pdf, lang, size) {
      pdf.SetFont(HELVETICA, NORMAL);
      if (size === undefined) {
        if (lang === "en") pdf.SetFontSize(PxToPt(25));
        else pdf.SetFontSize(PxToPt(20));
      } else {
        pdf.SetFont(HELVETICA, BOLD);
        if (lang === "en") pdf.SetFontSize(PxToPt(size));
        else pdf.SetFontSize(PxToPt(size - 1));
      }
    
      pdf.SetTextColor(0x45, 0x55, 0x60);
    }
    
    function addNote(pdf, para, left, paraY, paraWidth) {
      setFontForParas(pdf);
      pdf.SetTextColor(150, 150, 150);
      pdf.SetFontSize(PxToPt(12));
      insertPara(pdf, para, left, paraY, paraWidth);
      setFontForParas(pdf);
    }
    
    function setFontForParas(pdf) {
      pdf.SetFont(TIMES, NORMAL);
      pdf.SetFontSize(PxToPt(16));
      pdf.SetTextColor(0x45, 0x55, 0x60);
    }
    
    function insertBullet(pdf, bullet, left, y, size) {
      pdf.SetTextColor(115, 153, 198);
      pdf.SetFontSize(PxToPt(size));
      pdf.SetFont(TIMES, BOLD);
      pdf.Text(
        bullet,
        InToPt(left + (size === BULLET_FONT_SIZE ? 0.02 : 0)),
        InToPt(y - (size === BULLET_FONT_SIZE ? 0.03 : 0))
      );
      pdf.SetFont(TIMES, NORMAL);
      pdf.SetFontSize(PxToPt(16));
      pdf.SetTextColor(0x45, 0x55, 0x60);
    }
    
    function insertPara(pdf, para, left, paraY, paraWidth) {
      pdf.MultilineText(para, InToPt(left), InToPt(paraY), InToPt(paraWidth));
    }
    
    function insertTableTitle(
      pdf,
      paraLeft,
      paraY,
      values,
      height,
      paraWidths,
      fillColor
    ) {
      pdf.SetFontSize(PxToPt(12));
      const fill = fillColor === undefined ? [115, 153, 198] : fillColor;
      const textColor = [255, 255, 255];
      pdf.SetFont(TIMES, BOLD);
      const h = pdf.tableRow(
        fill,
        textColor,
        paraLeft,
        paraY,
        values,
        height,
        paraWidths,
        false,
        false,
        true
      );
      return h;
    }
    
    function insertTableRow(
      pdf,
      paraLeft,
      paraY,
      values,
      height,
      paraWidths,
      bold,
      fillColor,
      align
    ) {
      pdf.SetTextColor(0x45, 0x55, 0x60);
      const fill = fillColor === undefined ? [249, 249, 249] : fillColor;
      const textColor = [0x45, 0x55, 0x60];
      pdf.SetFont(TIMES, bold ? BOLD : NORMAL);
      pdf.tableRow(
        fill,
        textColor,
        paraLeft,
        paraY,
        values,
        height,
        paraWidths,
        true,
        align
      );
    }
    /* function insertTableRowBold(pdf, paraLeft, paraY, values, height, paraWidths,align) {
      pdf.SetTextColor(0x45, 0x55, 0x60);
      const fill = [235, 235, 235];
      const textColor = [0x45, 0x55, 0x60];
      pdf.SetFont(TIMES, BOLD);
      pdf.tableRow(
        fill,
        textColor,
        paraLeft,
        paraY,
        values,
        height,
        paraWidths,
        true,
        align
      );
    }
     */
    
    /* function pdf.addCustomImage( id,pg1TitleY,image,firstPage){
     
    pdf.AddImageFitWidthOnly(
      id,
      InToPt(pg1TitleY - 3 + image.left*HEADER_RECT_IN_W/100), //1.51),
      InToPt(firstPage?1.06:.29),
      InToPt(6.04*image.size/100),
      InToPt(firstPage?2.76:.38) // max height
    );
    } */
    
    function insertGrid2(
      pdf,
      grid,
      LE,
      paraLeft,
      paraWidth,
      lang,
      wrappedTitleBar,
      orientation,
      startYr,
      mode,
      lastRow
    ) {
      let i;
      let j;
      let cols = grid.dataColTitles.length;
      const height = 0.2;
      let paraY = 2.2 * height;
      let max =
        orientation === "landscape"
          ? startYr === 0
            ? LINES_PER_PAGE_LANDSCAPE
            : 2 * LINES_PER_PAGE_LANDSCAPE
          : LINES_PER_PAGE_PORTRAIT;
      const decimalChar = lang === "en" ? "." : ",";
      const thousands = lang === "en" ? "," : " ";
      //const formatFr = lang === "fr" ? true : false;
      let Widths = [];
    
      pdf.AddPage(orientation);
    
      // Appendix title
      setFontForTitle(pdf, lang, 16);
      let paragraph = OUTPUTTEXT[lang].pgAppendix + ": " + OUTPUTTEXT[lang].pgAppendixT;
      insertPara(pdf, paragraph, paraLeft, paraY, paraWidth);
    
      // Appendix para
      setFontForParas(pdf);
      paraY = paraY + 1.6 * height;
      paragraph =
        (mode === GRID_AGGREGATE
          ? OUTPUTTEXT[lang].pgAppendix
          : OUTPUTTEXT[lang].pgAppendixT) +
        (mode === GRID_AGGREGATE ? (startYr === 0 ? "" : "") : "");
      insertPara(pdf, paragraph, paraLeft, paraY, paraWidth);
    
      paraY = paraY + 0.5 * height;
    
      // grid name and title
      // grid col widths
      Widths.push(paraWidth / (cols + 5)); // year
      Widths.push(paraWidth / (cols + 5)); // age
      for (i = 2; i < cols; ++i) {
        Widths.push((paraWidth - (2 * paraWidth) / (cols + 4)) / (cols - 2));
      }
    
      // max of 8 columns in portrait
      let totalGridWidth = paraWidth;
      if (mode === GRID_INDIVIDUAL) totalGridWidth = (cols * paraWidth) / 8;
    
      let values = grid.dataColTitles;
      let goodWidth = [];
      let totalGoodWidth = 0;
      for (i = 0; i < cols; ++i) {
        goodWidth.push(pdf.textWidth(values[i]));
        totalGoodWidth += goodWidth[i];
      }
      // aportion grid title
      for (i = 0; i < cols; ++i) {
        Widths[i] = goodWidth[i] + 0.15;
      }
      let widthTotal = 0;
      for (i = 2; i < cols; ++i) widthTotal += Widths[i];
    
      // now check multilines
      let goodWidthMultiLine = [];
      let totalGoodWidthMultiLine = 0;
    
      let addMore =
        (totalGridWidth - widthTotal - Widths[0] - Widths[1]) / (cols - 2);
      if (mode === GRID_INDIVIDUAL) {
        for (i = 2; i < cols; ++i) Widths[i] += addMore;
      } else if (mode === GRID_AGGREGATE) {
        addMore =
          (totalGridWidth - widthTotal - Widths[0] - Widths[1]) / (cols - 3);
        for (i = 2; i < cols; ++i) if (i !== 4) Widths[i] += addMore;
      }
    
      for (i = 0; i < cols; ++i) {
        goodWidthMultiLine.push(pdf.textWidthMultiLine(values[i], Widths[i]));
        totalGoodWidthMultiLine += goodWidthMultiLine[i];
      }
      
      {
        paraY = paraY + 0.8 * height;
        paragraph = grid.gridTitle;
        pdf.SetFontSize(PxToPt(12));
        pdf.SetTextColor(0x45, 0x55, 0x60);
        insertPara(pdf, paragraph, paraLeft, paraY, paraWidth);
        paraY = paraY + 0.4 * height;
      }
    
      // headers
       const height2 = insertTableTitle(
        pdf,
        paraLeft,
        paraY,
        values,
        height,
        Widths,
        [51, 77, 124]
      );
      // grid rows
      let rows = startYr;
      let fillColor;
      if (wrappedTitleBar) paraY = paraY + height2;
      // 40 rows per page
      while (rows < LE + 3 && rows<lastRow) {
        //grid.dataProjection[0].length) {
    
        if (
          rows === max &&
          ((startYr === 0 && LE + 3 - rows > 6) ||
            (startYr === LINES_PER_PAGE_LANDSCAPE &&
              LE + LINES_PER_PAGE_LANDSCAPE + 3 - rows > 6))
        ) {
          if (mode === GRID_AGGREGATE) {
            insertPara(
              pdf,
              OUTPUTTEXTEP[lang].pg4P1,
              paraLeft,
              paraY + (3 * height) / 2 + 0.1,
              paraWidth
            );
            pdf.FooterLandscape(OUTPUTTEXT[lang].pgFooter);
            return rows;
          }
    
          rows = LE + 3 - 6;
          paraY = paraY + height;
          pdf.SetFont(TIMES, BOLD);
          insertPara(pdf, "......", paraLeft, paraY + height / 2, paraWidth);
          pdf.SetFont(TIMES, NORMAL);
        }
        values = [];
    
        let align = [];
        for (i = 0; i < cols; ++i) {
          //if(i===0) console.log(grid.dataProjection[i][rows])
          values.push(
            (i === 0 && rows === 0) || i === 1
              ? String(grid.dataProjection[i][rows])
              : formatMoney(
                  parseFloat(cleanFormat(grid.dataProjection[i][rows], lang)),
                  0,
                  decimalChar,
                  thousands
                ).toString()
          );
          align.push(2);
        }
        paraY = paraY + height;
        fillColor = rows % 2 ? [249, 249, 249] : [228, 229, 230];
        if (rows == LE) {
          fillColor = [208, 215, 230];
          insertPara(
            pdf,
            lang === "en" ? "LE" : "EV",
            paraLeft + totalGridWidth + 0.15,
            paraY + height / 2 + 0.01,
            paraWidth
          );
        }
        //console.log(values)
        insertTableRow(
          pdf,
          paraLeft,
          paraY,
          values,
          height,
          Widths,
          false,
          fillColor,
          align
        );
    
        rows++;
      }
    
      if (orientation === "landscape")
        pdf.FooterLandscape(OUTPUTTEXT[lang].pgFooter);
      else pdf.Footer(OUTPUTTEXT[lang].pgFooter);
    }
    