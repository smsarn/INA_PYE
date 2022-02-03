// Imports
import React, { Component } from "react";
import jsPDF from "jspdf";

// Constants
const PORTRAIT = "portrait";
const PT = "pt";
const LETTER = "letter";

const PNG = "png";

export const HELVETICA = "Helvetica";
export const TIMES = "Times";

export const NORMAL = "normal";
export const BOLD = "bold";
export const ITALIC = "italic";

export const HEADER_RECT_IN_X: number = 1;
export const HEADER_RECT_IN_Y: number = 0.48;
export const HEADER_RECT_IN_W: number = 6.4;
export const HEADER_RECT_IN_H: number = 0.45;
export const HEADER_RECT_R: number = 148;
export const HEADER_RECT_G: number = 148;
export const HEADER_RECT_B: number = 148;

export const HEADER_TEXT_PT_SIZE: number = 10;
export const HEADER_TEXT_IN_X: number = 1;
export const HEADER_TEXT_IN_Y: number = 0.75;
export const HEADER_TEXT_IN_W: number = 6;
export const HEADER_TEXT_R: number = 0xff;
export const HEADER_TEXT_G: number = 0xff;
export const HEADER_TEXT_B: number = 0xff;

export const FOOTER_TEXT_PT_SIZE: number = 8;
export const FOOTER_TEXT_IN_X: number = 1.5;
export const FOOTER_TEXT_IN_Y: number = 11 - 3 * 0.125;
export const FOOTER_TEXT_IN_Y_L: number = 8 - 3 * 0.125;

export const TEXT_R: number = 0x45;
export const TEXT_G: number = 0x55;
export const TEXT_B: number = 0x60;

export const MAX_LOGO_HEIGHT = 0.38;
// Functions
export const InToPt = (in_) => {
  return in_ * 25;
};

export const PxToPt = (px) => {
  return (px / 96) * 72;
};

const fontName = HELVETICA;
const fontStyle = NORMAL;
const fontSize = 16;

const textRed = 0x00;
const textGreen = 0x00;
const textBlue = 0x00;

const fillRed = 0xff;
const fillGreen = 0xff;
const fillBlue = 0xff;

const showGrids = true;

const PAGE_WIDTH = 8.4;
export const PAGE_HEIGHT = 11;
const PAGE_USED_AREA_LEFT = 1.2;
const PAGE_USED_AREA_RIGHT = 7.24;

// Classes
export class PDF extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.pdf = new jsPDF();
  }

  AddImage = (imageID, x, y, w, h) => {
    if (this.pdf === null) return;
    const imgData = document.getElementById(imageID);
    const imgProps = this.pdf.getImageProperties(imgData);
    const pdfHeight = (imgProps.height * w) / imgProps.width;
    if (pdfHeight > h) {
      w = (imgProps.width * h) / imgProps.height;
    } else h = pdfHeight;
    this.pdf.addImage(document.getElementById(imageID), PNG, x, y, w, h);
  };

  AddImageFitWidthOnly = (imageID, x, y, w, maxHeight) => {
    if (this.pdf === null) return;
    let imgData = document.getElementById(imageID);

    if (imgData !== null) {
      try {
        const imgProps = this.pdf.getImageProperties(imgData);

        //const pdfWidth = this.pdf.internal.pageSize.getWidth();
        let pdfHeight = (imgProps.height * w) / imgProps.width;

        if (pdfHeight > maxHeight) {
          if (x + w > (3 * InToPt(PAGE_WIDTH)) / 4)
            x += w - (w * maxHeight) / pdfHeight;
          else if (x + (w * maxHeight) / pdfHeight / 2 > InToPt(PAGE_WIDTH) / 4)
            x += w / 2 - (w * maxHeight) / pdfHeight / 2;

          /*  else if(x+w/2>InToPt(PAGE_WIDTH/4))
          x-=(w-w*maxHeight / pdfHeight)/2 */

          w *= maxHeight / pdfHeight;
          pdfHeight = maxHeight;
        }
        this.pdf.addImage(imgData, PNG, x, y, w, pdfHeight);
        return true;
      } catch (error) {
        return false;
      }
    }
  };

  addCustomImage = (id, pg1TitleY, image, firstPage, top) => {
     const left =
      image === null || image === undefined
        ? 0
        : (image.left * HEADER_RECT_IN_W) / 100;
    const result = this.AddImageFitWidthOnly(
      id,
      InToPt(pg1TitleY - 3 + left), //1.51),
      InToPt(
        firstPage
          ? top
            ? 1.06
            : FOOTER_TEXT_IN_Y + 0.25
          : top
          ? 0.29
          : FOOTER_TEXT_IN_Y + 0.25
      ),
      InToPt((6.04 * image.size) / 100),
      InToPt(firstPage ? (top ? 2.76 : MAX_LOGO_HEIGHT) : MAX_LOGO_HEIGHT) // max height
    );
    return result;
  };

  AddChart = (containerID, x, y, w, h) => {
    if (this.pdf === null) return;

    const CANVAS_CLASS_NAME = "chartjs-render-monitor";

    let containerElement = document.getElementById(containerID);
    let canvasElement = null;

    if (containerElement !== null)
      if (
        containerElement.getElementsByClassName(CANVAS_CLASS_NAME).length === 1
      )
        canvasElement = containerElement.getElementsByClassName(
          CANVAS_CLASS_NAME
        )[0];

    let dataUrl = canvasElement.toDataURL();

    if (dataUrl !== null) this.pdf.addImage(dataUrl, "JPEG", x, y, w, h);
  };

  AddCanvas = (canvasID, x, y, w, h) => {
    if (this.pdf === null) return;

    let canvasElement = null;
    let dataUrl = null;

    canvasElement = document.getElementById(canvasID);

    if (canvasElement !== null) dataUrl = canvasElement.toDataURL();

    if (dataUrl !== null) this.pdf.addImage(dataUrl, "JPEG", x, y, w, h);
  };

  AddPage = (mode) => {
    if (this.pdf === null) return;

    this.pdf.addPage("", mode);
  };

  Create = () => {
    if (this.pdf !== null) return;

    this.pdf = new jsPDF({
      orientation: PORTRAIT,
      unit: PT,
      format: LETTER,
    });
  };

  ShowGrids = () => {
    return this.showGrids;
  };

  ShowGrids = (showGrids) => {
    this.showGrids = showGrids;
  };

  Grid = () => {
    if (this.pdf === null) return;

    if (this.showGrids === false) return;

    const FONT_SIZE = 12;
    const LARGE_FONT_SIZE = 16;

    this.pdf.setFontSize(12);
    this.pdf.setFont(HELVETICA, NORMAL);
    this.pdf.setTextColor(0x00, 0x88, 0x00);

    let x;
    let y;

    this.pdf.text("0", 0, FONT_SIZE);

    for (x = 1; x <= 8; x++) this.pdf.text("" + x, InToPt(x), FONT_SIZE);

    for (y = 1; y <= 11; y++) this.pdf.text("" + y, 0, InToPt(y));

    for (x = 0.25; x <= 8.5; x += 0.25)
      for (y = 0.25; y <= 11; y += 0.25)
        this.pdf.text(".", InToPt(x), InToPt(y));

    this.pdf.setFont(HELVETICA, BOLD);
    this.pdf.setFontSize(LARGE_FONT_SIZE);
    for (x = 1; x <= 8; x += 1)
      for (y = 1; y <= 11; y += 1) this.pdf.text(".", InToPt(x), InToPt(y));

    if (this.fontSize !== null) this.pdf.setFontSize(this.fontSize);

    if (
      this.textRed !== null &&
      this.textGreen !== null &&
      this.textBlue !== null
    )
      this.pdf.setTextColor(this.textRed, this.textGreen, this.textBlue);

    if (this.fontName !== null && this.fontStyle !== null)
      this.pdf.setFont(this.fontName, this.fontStyle);
  };

  MultilineText = (text, x, y, w) => {
    if (this.pdf === null) return;

    let textLines = [];

    textLines = this.pdf.splitTextToSize(text, w, {
      fontName: this.fontName,
      fontSize: this.fontSize,
    });

    this.pdf.text(textLines, x, y);
  };

  DrawLine = (x, y, w) => {
    this.pdf.line(x, y, x + w, y);
  };

  Reset = () => {
    this.pdf = null;
  };

  SetFont = (fontName, fontStyle) => {
    if (this.pdf === null) return;

    this.pdf.setFont(fontName, fontStyle);

    this.fontName = fontName;
    this.fontStyle = fontStyle;
  };

  SetFontSize = (fontSize) => {
    if (this.pdf === null) return;

    this.pdf.setFontSize(fontSize);

    this.fontSize = fontSize;
  };

  Save = (fileName) => {
    if (this.pdf === null) return;

    this.pdf.save(fileName);
  };

  SetTextColor = (red, green, blue) => {
    if (this.pdf === null) return;

    this.pdf.setTextColor(red, green, blue);

    this.textRed = red;
    this.textGreen = green;
    this.textBlue = blue;
  };

  SetFillColor = (red, green, blue) => {
    if (this.pdf === null) return;

    this.pdf.setFillColor(red, green, blue);

    this.fillRed = red;
    this.fillGreen = green;
    this.fillBlue = blue;
  };

  showOnPage = () => {
    //this.pdf.output('datauri');
    //window.open(this.pdf.output('bloburl'))
    //this.pdf.output('dataurlnewwindow');
    //return this.pdf.output('datauri')
    var blob = this.pdf.output("bloburl");
    return blob;
  };
  Rectangle = (x, y, w, h) => {
    if (this.pdf === null) return;

    this.pdf.roundedRect(x, y, w, h, 0, 0, "F");
  };

  textWidth = (text) => {
    var arrayText = text.split(" ");
    let minWidth = 0;
    //console.log(arrayText)
    for (let i = 0; i < arrayText.length; i++) {
      minWidth = Math.max(minWidth, this.pdf.getTextWidth(arrayText[i]));
    }
    return minWidth / 25; // pt to int
  };
  textWidthMultiLine = (text, width) => {
    let arrayText = this.pdf.splitTextToSize(text, InToPt(width));
    let minWidth = 0;
    for (let i = 0; i < arrayText.length; i++) {
      minWidth = Math.max(minWidth, this.pdf.getTextWidth(arrayText[i]));
    }
    return minWidth / 25; // pt to int
  };

  adjustTextWidth = (arrayText) => {
    let minWidth = 0;
    for (let i = 0; i < arrayText.length; i++) {
      minWidth = Math.max(minWidth, this.pdf.getTextWidth(arrayText[i]));
    }
    return minWidth / 25; // pt to int
  };

  tableRow = (
    fill,
    textColor,
    x,
    y,
    values,
    height,
    Widths,
    box,
    align,
    title
  ) => {
    const lines2Fac = 1.75;
    const lines3Fac = 2.7;
    const cols = values.length;
    let textY = y + height / 2 + 0.05;
    // wrap if needed
    let h = height;
    for (i = 1; i <= cols; i++) {
      if (
        this.pdf.getTextWidth(values[i - 1]) > 2 * InToPt(Widths[i - 1]) &&
        h < parseFloat(lines3Fac * height)
      ) {
        //console.log(values[i - 1],this.pdf.getTextWidth(values[i - 1]),.8*InToPt(Widths[i - 1]))
        h = lines3Fac * height;
        textY = y + height / 2 + 0.07;
      } else if (
        this.pdf.getTextWidth(values[i - 1]) > InToPt(Widths[i - 1]) &&
        h < parseFloat(lines2Fac * height)
      ) {
        //console.log(values[i - 1],this.pdf.getTextWidth(values[i - 1]),.8*InToPt(Widths[i - 1]))
        h = lines2Fac * height;
        textY = y + height / 2 + 0.07;
      }
      let textOut;
      if (h > height) {
        textOut = this.pdf.splitTextToSize(
          values[i - 1],
          InToPt(Widths[i - 1] - 0.1)
        );
        // adjust width if necessary
        //console.log(textOut,h,height)
        if (title === true) {
          if (textOut.length > 2 && h < parseFloat(lines3Fac * height))
            h = lines3Fac * height;
          else if (textOut.length > 1 && h < parseFloat(lines2Fac * height))
            h = lines2Fac * height;
          textY = y + height / 2 + 0.07;
          // console.log(textOut,h,height)
        }
      }
    }
    this.SetTextColor(textColor[0], textColor[1], textColor[2]);
    //this.SetFontSize(12);
    var i;
    let rightAlign;
    let xi = x;
    for (i = 1; i <= cols; i++) {
      // wrap if needed
      let textOut;
      if (h > height) {
        textOut = this.pdf.splitTextToSize(
          values[i - 1],
          InToPt(Widths[i - 1] - 0.1)
        );
      } else {
        textOut = values[i - 1];
        if (align !== undefined) {
          if (align[i - 1] !== undefined) {
            if (align[i - 1] === 2) rightAlign = true;
          }
        }
      }
      this.SetFillColor(fill[0], fill[1], fill[2]);
      this.Rectangle(
        InToPt(xi),
        InToPt(y),
        InToPt(Widths[i - 1] + 0.1),
        InToPt(h)
      );
      if (box) {
        this.pdf.setDrawColor(155, 155, 155);
        this.pdf.rect(
          InToPt(xi),
          InToPt(y),
          InToPt(Widths[i - 1] + 0.1),
          InToPt(h)
        );
      }
      if (rightAlign)
        this.RightText(
          values[i - 1],
          InToPt(xi - 0.05),
          InToPt(textY),
          InToPt(Widths[i - 1])
        );
      else this.pdf.text(textOut, InToPt(xi + 0.1), InToPt(textY));

      //  this.MultilineText(values[i - 1], InToPt(xi + .1), InToPt(y + .25), InToPt(3));
      xi += Widths[i - 1];
    }
    //pdf.SetFillColor(fill[0], fill[1], fill[2]);
    //pdf.Rectangle(InToPt(x), InToPt(y), InToPt(w), InToPt(height));
    //pdf.Text("Family Profile", InToPt(x[0] + .1), InToPt(y + .25));
    //pdf.SetFillColor(115, 153, 198);
    //pdf.Rectangle(InToPt(x[1]), InToPt(y), InToPt(w), InToPt(0.4));
    //pdf.Text("Income", InToPt(x[1] + .1), InToPt(y + .25));
    //pdf.SetFillColor(115, 153, 198);
    //pdf.Rectangle(InToPt(x[2]), InToPt(y), InToPt(w), InToPt(0.4));
    //pdf.Text("Retirement Age", InToPt(x[2] + .1), InToPt(y + .25));

    return h - height; // excess height from here
  };

  Text = (text, x, y) => {
    if (this.pdf === null) return;

    this.pdf.text(text, x, y);
  };

  CenterText = (text, x, y, w) => {
    if (this.pdf === null) return;

    let tw = this.pdf.getTextWidth(text);

    this.pdf.text(text, x + (w - tw) / 2, y);
  };

  RightText = (text, x, y, w) => {
    if (this.pdf === null) return;

    let tw = this.pdf.getTextWidth(text);

    this.pdf.text(text, x + (w - tw) + 0.1, y);
  };

  Header = (textH, headerOffset) => {
    if (headerOffset === undefined) headerOffset = 0;
    this.SetFillColor(HEADER_RECT_R, HEADER_RECT_G, HEADER_RECT_B);

    this.Rectangle(
      InToPt(HEADER_RECT_IN_X),
      InToPt(HEADER_RECT_IN_Y + headerOffset),
      InToPt(HEADER_RECT_IN_W),
      InToPt(HEADER_RECT_IN_H)
    );

    this.SetTextColor(HEADER_TEXT_R, HEADER_TEXT_G, HEADER_TEXT_B);
    this.SetFont(HELVETICA, NORMAL);
    this.SetFontSize(HEADER_TEXT_PT_SIZE);
    this.CenterText(
      textH,
      InToPt(HEADER_TEXT_IN_X),
      InToPt(HEADER_TEXT_IN_Y + headerOffset),
      InToPt(HEADER_TEXT_IN_W)
    );
  };

  addFooterAndHeader = (headerOffset, footerText, headerText) => {
    this.Footer(footerText);
    this.AddPage();
    this.Header(headerText, headerOffset);
  };

  Footer = (textF) => {
    this.SetTextColor(TEXT_R, TEXT_G, TEXT_B);
    this.SetFont(TIMES, NORMAL);
    this.SetFontSize(FOOTER_TEXT_PT_SIZE);
    this.Text(textF, InToPt(FOOTER_TEXT_IN_X), InToPt(FOOTER_TEXT_IN_Y));
  };

  FooterLandscape = (textF) => {
    this.SetTextColor(TEXT_R, TEXT_G, TEXT_B);
    this.SetFont(TIMES, NORMAL);
    this.SetFontSize(FOOTER_TEXT_PT_SIZE);
    this.Text(textF, InToPt(FOOTER_TEXT_IN_X), InToPt(FOOTER_TEXT_IN_Y_L));
  };

  drawRect(paraLeft, paraY, paraWidth, height, color) {
    this.SetFillColor(color[0], color[1], color[2]);
    this.pdf.rect(
      InToPt(paraLeft),
      InToPt(paraY),
      InToPt(paraWidth),
      InToPt(height),
      "F"
    );
  }

  addFooter = (footer, title) => {
    this.Footer(footer);
    this.AddPage();
    this.Header(title);
  };

  addHeaderNoFooter = (headerOffset, headerText) => {
    this.AddPage();
    this.Header(headerText, headerOffset);
  };

  tableRowSingle = (
    fill,
    textColor,
    x,
    y,
    values2,
    height,
    Widths,
    coloured
  ) => {
    const values = [values2];

    if (coloured)
      // has colour
      this.tableRow(fill, textColor, x, y + 0.1, values, height - 0.1, [1.2]);
    else this.tableRow(fill, textColor, x, y, values, height, Widths);
  };

}