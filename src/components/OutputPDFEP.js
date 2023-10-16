import {
  TITLES,
  ASSETS,
  IMAGE_LOGO,
  IMAGE_LOGO_OTHERPAGES,
  IMAGE_APPLET_EP,
} from "../definitions/generalDefinitions";
import { OUTPUTTEXTEP } from "../definitions/outputDefinitionsEP";
import { formatMoney, formatMoney2, cleanFormat } from "../utils/helper";
import { getOutputValues } from "../data/dataExchange";

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

export function doSavePdfActionEP(props, AssetLiabProjs) {
  try {
    let pdf = new PDF();
    pdf.Create();

    var paragraph;
    let height = 0.2;
    let Widths = [1.2, 0.6, 1.8, 1.4];
    let values;
    const paraWidth = 6;
    const paraLeft = 1.2;
    const lineHeight = 0.196;
    const indent = 0.15;
    let paraY = 8 * lineHeight;

    // pdf output shared with presentation
    let output = getOutputValues(props);

    const lang = props.dataInput.Presentations[0].language;
    const pg1TitleY = 4.2;

   
    pdf.SetFont(HELVETICA, NORMAL);
    if (lang === "en") pdf.SetFontSize(PxToPt(36));
    else pdf.SetFontSize(PxToPt(36));
    pdf.SetTextColor(0x45, 0x55, 0x60);
    pdf.Text(
      props.INAOption === DISPLAY_INCOME
        ? TITLES[lang].appletINA
        : TITLES[lang].appletEP,
      InToPt(paraLeft),
      InToPt(pg1TitleY)
    );
    /* page 1: Cover page */

    //pdf.addCustomImage("AdvisorLogo", pg1TitleY, image, true);
    const image = props.dataInput.Presentations[0].adviserLogo;
    const headerOffset = image.image === null ? 0 : 0.25;
    const top = props.dataInput.Presentations[0].adviserLogo.top;

    let result;
    result = pdf.addCustomImage(IMAGE_LOGO, pg1TitleY, image, true, top);

    pdf.AddImage(
      IMAGE_APPLET_EP,
      InToPt(paraLeft + 0.01),
      InToPt(pg1TitleY + 0.5),
      InToPt(6.04),
      InToPt(2.76)
    );

    pdf.SetFontSize(PxToPt(18));
    pdf.SetTextColor(0x45, 0x55, 0x60);
    pdf.Text(
      OUTPUTTEXTEP[lang].pg1P1 + output.designedFor,
      InToPt(paraLeft + 0.02),
      InToPt(pg1TitleY + 3.63)
    );
    pdf.Text(
      OUTPUTTEXTEP[lang].pg1P2 + output.designedBy,
      InToPt(paraLeft + 0.02),
      InToPt(pg1TitleY + 4.13)
    );
    pdf.Text(
      OUTPUTTEXTEP[lang].pg1P3 + output.dateApplet,
      InToPt(paraLeft + 0.02),
      InToPt(pg1TitleY + 4.42)
    );
    pdf.Text(
      OUTPUTTEXTEP[lang].pg1P4 + output.province,
      InToPt(paraLeft + 0.02),
      InToPt(pg1TitleY + 4.69)
    );

    {
      /*end ofPage 1*/
      const footerText = OUTPUTTEXTEP[lang].pgFooter;
      const headerText = OUTPUTTEXTEP[lang].pg1T;
      pdf.addFooterAndHeader(headerOffset, footerText, headerText);

      /*-Introduction		// Page 2*/
      // logo if asked for
      //    pdf.addCustomImage("EPOtherPagesLogo", pg1TitleY, image);
      result =
        result &&
        pdf.addCustomImage(IMAGE_LOGO_OTHERPAGES, pg1TitleY, image, false, top);

      setFontForTitle(pdf, lang);
      pdf.Text(OUTPUTTEXTEP[lang].pg2T, InToPt(paraLeft), InToPt(paraY));
      setFontForParas(pdf);

      let parag = [];
      OUTPUTTEXTEP[lang].pg2Paragraphs.map((item) => parag.push(item));

      paraY = paraY + 2 * lineHeight;
      insertPara(pdf, parag[0], paraLeft, paraY, paraWidth);

      paraY = paraY + 5 * lineHeight;
      insertPara(pdf, parag[1], paraLeft, paraY, paraWidth);

      paraY = paraY + (lang === "en" ? 4.5 : 5.5) * lineHeight;
      insertBullet(pdf, ".", paraLeft + indent, paraY, BULLET_FONT_SIZE);
      insertPara(pdf, parag[2], paraLeft + 2.3 * indent, paraY, paraWidth);

      paraY = paraY + 1.2 * lineHeight;
      insertBullet(pdf, ".", paraLeft + indent, paraY, BULLET_FONT_SIZE);
      insertPara(pdf, parag[3], paraLeft + 2.3 * indent, paraY, paraWidth);

      paraY = paraY + 2 * lineHeight;
      insertPara(pdf, parag[4], paraLeft, paraY, paraWidth);

      paraY = paraY + 3 * lineHeight;
      insertBullet(pdf, ".", paraLeft + indent, paraY, BULLET_FONT_SIZE);
      insertPara(pdf, parag[5], paraLeft + 2.3 * indent, paraY, paraWidth);

      paraY = paraY + 1.2 * lineHeight;
      insertBullet(pdf, ".", paraLeft + indent, paraY, BULLET_FONT_SIZE);
      insertPara(pdf, parag[6], paraLeft + 2.3 * indent, paraY, paraWidth);

      paraY = paraY + 3 * lineHeight;
      insertPara(pdf, parag[7], paraLeft, paraY, paraWidth);

      paraY = paraY + 3 * lineHeight;
      insertBullet(pdf, ".", paraLeft + indent, paraY, BULLET_FONT_SIZE);
      insertPara(pdf, parag[8], paraLeft + 2.3 * indent, paraY, paraWidth);

      paraY = paraY + 1.2 * lineHeight;
      insertBullet(pdf, ".", paraLeft + indent, paraY, BULLET_FONT_SIZE);
      insertPara(pdf, parag[9], paraLeft + 2.3 * indent, paraY, paraWidth);

      paraY = paraY + 1.2 * lineHeight;
      insertBullet(pdf, ".", paraLeft + indent, paraY, BULLET_FONT_SIZE);
      insertPara(pdf, parag[10], paraLeft + 2.3 * indent, paraY, paraWidth);

      /*end ofPage 2*/
      pdf.addFooterAndHeader(headerOffset, footerText, headerText);

      /*/*-Your FEPncial Situation		// Page 3*/
      // logo if asked for
      //    pdf.addCustomImage("EPOtherPagesLogo", pg1TitleY, image);
      result =
        result &&
        pdf.addCustomImage(IMAGE_LOGO_OTHERPAGES, pg1TitleY, image, false, top);

      paraY = 8 * lineHeight;
      setFontForTitle(pdf, lang);
      pdf.Text(OUTPUTTEXTEP[lang].pg3T, InToPt(paraLeft), InToPt(paraY));
      setFontForParas(pdf);

      paraY = paraY + 2 * lineHeight;
      paragraph = OUTPUTTEXTEP[lang].pg3P1;
      insertPara(pdf, paragraph, paraLeft, paraY, paraWidth);

      // assets table
      let tableWidthAss =
        lang === "fr" ? paraWidth / 2 + 0.3 : paraWidth / 2 - 0.2;
      let totalAssets = 0;
      height = 0.24;
      Widths = [paraWidth / 4 + 0.4, paraWidth / 4 - 0.6];
      if (lang === "fr")
        Widths = [(3 * tableWidthAss) / 4 + 0.1, tableWidthAss / 4 - 0.1];

      paraY = paraY + 3.2 * lineHeight;
      const tmpY = paraY;
      values = [OUTPUTTEXTEP[lang].pg3TabT];

      let align = [];
      insertTableTitle(pdf, paraLeft, paraY, values, height, [
        tableWidthAss + 0.01,
      ]);

      output.assets.map((element) => {
        values = [
          element.name +
            (element.name === ASSETS.OTHER_ASSETS.value[lang] &&
            element.value > 0
              ? " *"
              : ""),
          formatMoney2(element.value, 0, lang),
        ];
        //   console.log(values)
        align.push(0);
        align.push(2);
        totalAssets += parseFloat(element.value);
        paraY = paraY + height;
        insertTableRow(
          pdf,
          paraLeft,
          paraY,
          values,
          height,
          Widths,
          false,
          [249, 249, 249],
          align
        );
      });

      align = [];
      align.push(2);
      align.push(2);
      paraY = paraY + height;
      insertTableRow(
        pdf,
        paraLeft,
        paraY,
        [OUTPUTTEXTEP[lang].pg3Tab2RTot, formatMoney2(totalAssets, 0, lang)],
        height,
        Widths,
        true,
        [235, 235, 235],
        align
      );
      // other assets footnote

      if (output.otherAssetsList !== "") {
        paraY = paraY + 2.2 * lineHeight;
        paragraph = output.otherAssetsList;
        addNote(pdf, paragraph, paraLeft, paraY, paraWidth);
      }
      setFontForParas(pdf);
      //

      // liabs table
      let tableWidth =
        lang === "fr" ? paraWidth / 2 - 0.05 : paraWidth / 2 - 0.2;
      Widths = [paraWidth / 4 + 0.4, paraWidth / 4 - 0.6];
      if (lang === "fr") Widths = [(3 * tableWidth) / 4, tableWidth / 4];

      let totalLiabs = 0;
      const tableLeft = paraLeft + tableWidthAss + 0.2;
      paraY = tmpY;
      values = [OUTPUTTEXTEP[lang].pg3Tab2T];
      insertTableTitle(pdf, tableLeft, paraY, values, height, [
        tableWidth + 0.01,
      ]);

      align = [];
      output.liabilities.map((element) => {
        values = [element.name, formatMoney2(element.value, 0, lang)];
        align.push(0);
        align.push(2);

        totalLiabs += parseFloat(element.value);
        paraY = paraY + height;
        insertTableRow(
          pdf,
          tableLeft,
          paraY,
          values,
          height,
          Widths,
          false,
          [249, 249, 249],
          align
        );
      });

      align = [];
      align.push(2);
      align.push(2);

      paraY = paraY + height;
      insertTableRow(
        pdf,
        tableLeft,
        paraY,
        [OUTPUTTEXTEP[lang].pg3Tab2RTot, formatMoney2(totalLiabs, 0, lang)],
        height,
        Widths,
        true,
        [235, 235, 235],
        align
      );
      paraY = paraY + height;
      insertTableRow(
        pdf,
        tableLeft,
        paraY,
        [
          OUTPUTTEXTEP[lang].pg3Tab2NW,
          formatMoney2(totalAssets - totalLiabs, 0, lang),
        ],
        height,
        Widths,
        true,
        [205, 205, 205],
        align
      );

      //Your growing tax liab
      paraY = paraY + 4.6 * lineHeight;
      setFontForTitle(pdf, lang);
      pdf.Text(OUTPUTTEXTEP[lang].pg3T2, InToPt(paraLeft), InToPt(paraY));
      setFontForParas(pdf);
      //
      paraY = paraY + 2 * lineHeight;
      paragraph = OUTPUTTEXTEP[lang].pg3P2;
      insertPara(pdf, paragraph, paraLeft, paraY, paraWidth);

      tableWidth = paraWidth;
      Widths = [
        tableWidth / 4 + 0.4,
        tableWidth / 4 - 0.5,
        tableWidth / 4 - 0.1,
        tableWidth / 4 + 0.12,
      ];
      if (lang === "fr")
        Widths = [
          tableWidth / 4 + 0.85,
          tableWidth / 4 - 0.45,
          tableWidth / 4 - 0.25,
          tableWidth / 4 + 0.25,
        ];

      paraY = paraY + (lang === "fr" ? 3.2 : 2.8) * lineHeight;
      values = [
        OUTPUTTEXTEP[lang].pg3Tab3R1C1,
        OUTPUTTEXTEP[lang].pg3Tab3R1C2,
        OUTPUTTEXTEP[lang].pg3Tab3R1C3,
        OUTPUTTEXTEP[lang].pg3Tab3R1C4,
      ];
      const height2 = insertTableTitle(
        pdf,
        paraLeft,
        paraY,
        values,
        height,
        Widths
      );
      paraY = paraY + height + height2;
      //paraY = paraY + height;
      insertTableRow(
        pdf,
        paraLeft,
        paraY,
        [
          OUTPUTTEXTEP[lang].pg3Tab3R2C1,
          AssetLiabProjs.EstateLiabsByTypeGrowth[ASSET_TAX_TYPE_REAL_ESTATE],
          formatMoney2(
            AssetLiabProjs.EstateLiabsByType[ASSET_TAX_TYPE_REAL_ESTATE],
            0,
            lang
          ),
          formatMoney2(
            AssetLiabProjs.EstateLiabsByTypeLE3[ASSET_TAX_TYPE_REAL_ESTATE],
            0,
            lang
          ),
        ],
        height,
        Widths,
        false,
        [249, 249, 249],
        align
      );
      paraY = paraY + height;
      insertTableRow(
        pdf,
        paraLeft,
        paraY,
        [
          OUTPUTTEXTEP[lang].pg3Tab3R3C1,
          AssetLiabProjs.EstateLiabsByTypeGrowth[ASSET_TAX_TYPE_STOCKS],
          formatMoney2(
            AssetLiabProjs.EstateLiabsByType[ASSET_TAX_TYPE_STOCKS],
            0,
            lang
          ),
          formatMoney2(
            AssetLiabProjs.EstateLiabsByTypeLE3[ASSET_TAX_TYPE_STOCKS],
            0,
            lang
          ),
        ],

        height,
        Widths,
        false,
        [249, 249, 249],
        align
      );
      paraY = paraY + height;
      insertTableRow(
        pdf,
        paraLeft,
        paraY,
        [
          OUTPUTTEXTEP[lang].pg3Tab3R4C1,
          AssetLiabProjs.EstateLiabsByTypeGrowth[ASSET_TAX_TYPE_SMALL_BUS],
          formatMoney2(
            AssetLiabProjs.EstateLiabsByType[ASSET_TAX_TYPE_SMALL_BUS],
            0,
            lang
          ),
          formatMoney2(
            AssetLiabProjs.EstateLiabsByTypeLE3[ASSET_TAX_TYPE_SMALL_BUS],
            0,
            lang
          ),
        ],

        height,
        Widths,
        false,
        [249, 249, 249],
        align
      );
      paraY = paraY + height;
      insertTableRow(
        pdf,
        paraLeft,
        paraY,
        [
          OUTPUTTEXTEP[lang].pg3Tab3R5C1,
          AssetLiabProjs.EstateLiabsByTypeGrowth[ASSET_TAX_TYPE_RRSP],
          formatMoney2(
            AssetLiabProjs.EstateLiabsByType[ASSET_TAX_TYPE_RRSP],
            0,
            lang
          ),
          formatMoney2(
            AssetLiabProjs.EstateLiabsByTypeLE3[ASSET_TAX_TYPE_RRSP],
            0,
            lang
          ),
        ],
        height,
        Widths,
        false,
        [249, 249, 249],
        align
      );
      paraY = paraY + height;
      insertTableRow(
        pdf,
        paraLeft,
        paraY,
        [
          OUTPUTTEXTEP[lang].pg3Tab3R6C1,
          AssetLiabProjs.EstateLiabsByTypeGrowth[ASSET_TAX_TYPE_INTEREST],
          formatMoney2(
            AssetLiabProjs.EstateLiabsByType[ASSET_TAX_TYPE_INTEREST],
            0,
            lang
          ),
          formatMoney2(
            AssetLiabProjs.EstateLiabsByTypeLE3[ASSET_TAX_TYPE_INTEREST],
            0,
            lang
          ),
        ],
        height,
        Widths,
        false,
        [249, 249, 249],
        align
      );
      paraY = paraY + height;
      insertTableRow(
        pdf,
        paraLeft,
        paraY,
        [
          OUTPUTTEXTEP[lang].pg3Tab3R7C1,
          AssetLiabProjs.EstateLiabsByTypeGrowth[ASSET_TAX_TYPE_OTHER],
          formatMoney2(
            AssetLiabProjs.EstateLiabsByType[ASSET_TAX_TYPE_OTHER],
            0,
            lang
          ),
          formatMoney2(
            AssetLiabProjs.EstateLiabsByTypeLE3[ASSET_TAX_TYPE_OTHER],
            0,
            lang
          ),
        ],
        height,
        Widths,
        false,
        [249, 249, 249],
        align
      );

      Widths = [
        tableWidth / 4 + (lang === "fr" ? 0.6 : 0.1) + tableWidth / 4 - 0.2,
        tableWidth / 4 - (lang === "fr" ? 0.25 : 0.1),
        tableWidth / 4 + (lang === "fr" ? 0.25 : 0.12),
      ];
      paraY = paraY + height;
      insertTableRow(
        pdf,
        paraLeft,
        paraY,
        [
          OUTPUTTEXTEP[lang].pg3Tab3R8C1,
          formatMoney2(AssetLiabProjs.EstateLiabsByTypeTotal, 0, lang),
          formatMoney2(AssetLiabProjs.EstateLiabsByTypeLE3Total, 0, lang),
        ],
        height,
        Widths,
        true,
        [235, 235, 235],
        align
      );

      paraY = paraY + 2.2 * lineHeight;
      paragraph = OUTPUTTEXTEP[lang].pg3P4;
      addNote(pdf, paragraph, paraLeft, paraY, paraWidth);
      paraY = paraY + (lang === "fr" ? 1.7 : 0.8) * lineHeight;
      paragraph = OUTPUTTEXTEP[lang].pg3P5;
      addNote(pdf, paragraph, paraLeft, paraY, paraWidth);

      /*end ofPage 3*/
      pdf.addFooterAndHeader(headerOffset, footerText, headerText);
      /*/*-Future value of estate		// Page 4*/
      // logo if asked for
      //pdf.addCustomImage("EPOtherPagesLogo", pg1TitleY, image);
      result =
        result &&
        pdf.addCustomImage(IMAGE_LOGO_OTHERPAGES, pg1TitleY, image, false, top);

      paraY = 8 * lineHeight;
      setFontForTitle(pdf, lang);
      pdf.Text(OUTPUTTEXTEP[lang].pg4T, InToPt(paraLeft), InToPt(paraY));
      setFontForParas(pdf);

      paraY = paraY + 2 * lineHeight;
      paragraph = OUTPUTTEXTEP[lang].pg4P1;
      insertPara(pdf, paragraph, paraLeft, paraY, paraWidth);

      paraY = paraY + 4.7 * lineHeight;
      pdf.AddChart(
        "stackedChart",
        InToPt(paraLeft),
        InToPt(paraY),
        InToPt(paraWidth),
        InToPt(20 * lineHeight)
      );

      paraY = paraY + 20.5 * lineHeight;
      paragraph = OUTPUTTEXTEP[lang].pg4P2 + props.LE + ")";
      addNote(pdf, paragraph, paraLeft, paraY, paraWidth);

      paraY = paraY + 3.7 * lineHeight;
      paragraph = OUTPUTTEXTEP[lang].pg4P3
      .replace(
        "G1",
        AssetLiabProjs.EstateLiabsByTypeTotal<AssetLiabProjs.EstateLiabsByTypeLE3Total?
        (lang==="en"?"grows":"passe"):(lang==="en"?"changes":"passe")
      )
        .replace(
          "X1",
          formatMoney2(AssetLiabProjs.EstateLiabsByTypeTotal, 0, lang)
        )
        .replace(
          "X2",
          formatMoney2(AssetLiabProjs.EstateLiabsByTypeLE3Total, 0, lang)
        );
      pdf.drawRect(paraLeft, paraY - 0.3, paraWidth + 0.4, 3 * height, [
        235,
        235,
        235,
      ]);
      insertPara(pdf, paragraph, paraLeft + 0.2, paraY, paraWidth);

      paraY = paraY + 3 * lineHeight;
      pdf.AddChart(
        "pieEstateLeakage",
        InToPt(paraLeft - 0.7),
        InToPt(paraY),
        InToPt(0.75 * paraWidth),
        InToPt((43 * paraWidth) / 120)
      );
      // paraY = paraY + 5*lineHeight;
      pdf.AddChart(
        "pieEstateLeakage2",
        InToPt(paraLeft + 0.48 * paraWidth),
        InToPt(paraY),
        InToPt(0.75 * paraWidth),
        InToPt((43 * paraWidth) / 120)
      );

      /*end ofPage 4*/
      pdf.addFooterAndHeader(headerOffset, footerText, headerText);

      /*/*-Estate Protection Alternatives		// Page 5*/
      // logo if asked for
      //    pdf.addCustomImage("EPOtherPagesLogo", pg1TitleY, image);
      result =
        result &&
        pdf.addCustomImage(IMAGE_LOGO_OTHERPAGES, pg1TitleY, image, false, top);

      paraY = 8 * lineHeight;
      setFontForTitle(pdf, lang);
      pdf.Text(OUTPUTTEXTEP[lang].pg5T, InToPt(paraLeft), InToPt(paraY));
      setFontForParas(pdf);

      parag = [];
      OUTPUTTEXTEP[lang].pg5Paragraphs.map((item) => parag.push(item));
      //console.log(parag);

      paraY = paraY + 2 * lineHeight;
      paragraph = parag[0];
      insertPara(pdf, paragraph, paraLeft, paraY, paraWidth);

      paraY = paraY + 4 * lineHeight;
      paragraph = parag[1];
      insertPara(pdf, paragraph, paraLeft, paraY, paraWidth);

      paraY = paraY + 2.5 * lineHeight;
      paragraph = parag[2];
      insertBullet(
        pdf,
        "1.",
        paraLeft + indent,
        paraY,
        NUMBER_BULLET_FONT_SIZE
      );
      insertPara(pdf, paragraph, paraLeft + 2.3 * indent, paraY, paraWidth);

      paraY = paraY + 1.5 * lineHeight;
      paragraph = parag[3];
      insertBullet(
        pdf,
        "2.",
        paraLeft + indent,
        paraY,
        NUMBER_BULLET_FONT_SIZE
      );
      insertPara(pdf, paragraph, paraLeft + 2.3 * indent, paraY, paraWidth);

      paraY = paraY + 1.5 * lineHeight;
      paragraph = parag[4];
      insertBullet(
        pdf,
        "3.",
        paraLeft + indent,
        paraY,
        NUMBER_BULLET_FONT_SIZE
      );
      insertPara(pdf, paragraph, paraLeft + 2.3 * indent, paraY, paraWidth);

      paraY = paraY + (lang === "fr" ? 2.5 : 1.5) * lineHeight;
      paragraph = parag[5];
      insertBullet(
        pdf,
        "4.",
        paraLeft + indent,
        paraY,
        NUMBER_BULLET_FONT_SIZE
      );
      insertPara(pdf, paragraph, paraLeft + 2.3 * indent, paraY, paraWidth);

      paraY = paraY + 2 * lineHeight;
      paragraph = parag[6];
      insertPara(pdf, paragraph, paraLeft, paraY, paraWidth);

      paraY = paraY + 1.5 * lineHeight;
      paragraph = parag[7];
      insertBullet(
        pdf,
        "1.",
        paraLeft + indent,
        paraY,
        NUMBER_BULLET_FONT_SIZE
      );
      insertPara(pdf, paragraph, paraLeft + 2.3 * indent, paraY, paraWidth);

      paraY = paraY + 5 * lineHeight;
      paragraph = parag[8];
      insertBullet(
        pdf,
        "2.",
        paraLeft + indent,
        paraY,
        NUMBER_BULLET_FONT_SIZE
      );
      insertPara(pdf, paragraph, paraLeft + 2.3 * indent, paraY, paraWidth);

      paraY = paraY + 6 * lineHeight;
      paragraph = parag[9];
      insertBullet(
        pdf,
        "3.",
        paraLeft + indent,
        paraY,
        NUMBER_BULLET_FONT_SIZE
      );
      insertPara(pdf, paragraph, paraLeft + 2.3 * indent, paraY, paraWidth);

      paraY = paraY + 4 * lineHeight;
      paragraph = parag[10];
      insertBullet(
        pdf,
        "4.",
        paraLeft + indent,
        paraY,
        NUMBER_BULLET_FONT_SIZE
      );
      insertPara(pdf, paragraph, paraLeft + 2.3 * indent, paraY, paraWidth);

      paraY = paraY + 6 * lineHeight;
      paragraph = OUTPUTTEXTEP[lang].pg5Plast;

      //this.setDrawColor(235, 235, 235);
      pdf.drawRect(paraLeft, paraY - 0.3, paraWidth + 0.4, 3 * height, [
        235,
        235,
        235,
      ]);
      insertPara(pdf, paragraph, paraLeft + 0.2, paraY, paraWidth);

      /*end ofPage 5*/
      pdf.addFooterAndHeader(headerOffset, footerText, headerText);

      /*/*-Using Life Insurance to Preserve Your Estate		// Page 6*/
      // logo if asked for
      //    pdf.addCustomImage("EPOtherPagesLogo", pg1TitleY, image);
      result =
        result &&
        pdf.addCustomImage(IMAGE_LOGO_OTHERPAGES, pg1TitleY, image, false, top);

      paraY = 8 * lineHeight;
      setFontForTitle(pdf, lang);
      pdf.Text(OUTPUTTEXTEP[lang].pg6T, InToPt(paraLeft), InToPt(paraY));
      setFontForParas(pdf);

      parag = [];
      OUTPUTTEXTEP[lang].pg6Paragraphs1.map((item) => parag.push(item));
      //console.log(parag);

      paraY = paraY + 2 * lineHeight;
      paragraph = parag[0];
      insertPara(pdf, paragraph, paraLeft, paraY, paraWidth);

      paraY = paraY + 5 * lineHeight;
      paragraph = parag[1];
      insertPara(pdf, paragraph, paraLeft, paraY, paraWidth);

      paraY = paraY + 3.5 * lineHeight;
      paragraph = parag[2];
      insertBullet(
        pdf,
        "1.",
        paraLeft + indent,
        paraY,
        NUMBER_BULLET_FONT_SIZE
      );
      insertPara(pdf, paragraph, paraLeft + 2.3 * indent, paraY, paraWidth);

      paraY = paraY + 1.4 * lineHeight;
      paragraph = parag[3];
      insertBullet(
        pdf,
        "2.",
        paraLeft + indent,
        paraY,
        NUMBER_BULLET_FONT_SIZE
      );
      insertPara(pdf, paragraph, paraLeft + 2.3 * indent, paraY, paraWidth);

      paraY = paraY + 1.4 * lineHeight;
      paragraph = parag[4];
      insertBullet(
        pdf,
        "3.",
        paraLeft + indent,
        paraY,
        NUMBER_BULLET_FONT_SIZE
      );
      insertPara(pdf, paragraph, paraLeft + 2.3 * indent, paraY, paraWidth);

      paraY = paraY + 2 * lineHeight;
      paragraph = parag[5];
      insertPara(pdf, paragraph, paraLeft, paraY, paraWidth);

      paraY = paraY + 6 * lineHeight;
      paragraph = parag[6];
      insertPara(pdf, paragraph, paraLeft, paraY, paraWidth);

      // reduced after edit
      /*   paraY = paraY + 4 * lineHeight;
    paragraph = parag[7];
    insertPara(pdf, paragraph, paraLeft, paraY, paraWidth);

    paraY = paraY + 4 * lineHeight;
    paragraph = parag[8];
    insertPara(pdf, paragraph, paraLeft, paraY, paraWidth);

    paraY = paraY + 3 * lineHeight;
    paragraph = parag[9];
    insertPara(pdf, paragraph, paraLeft, paraY, paraWidth); */

      /*end ofPage 6*/
      //    addFooterAndHeader(pdf, lang);

      // combine summary page with last

      /*/*-Summary		// Page 7*/
      // paraY = 8 * lineHeight;
      // logo if asked for
      //    pdf.addCustomImage("EPOtherPagesLogo", pg1TitleY, image);
      result =
        result &&
        pdf.addCustomImage(IMAGE_LOGO_OTHERPAGES, pg1TitleY, image, false, top);

      paraY = paraY + 8 * lineHeight;
      setFontForTitle(pdf, lang);
      pdf.Text(OUTPUTTEXTEP[lang].pg7T, InToPt(paraLeft), InToPt(paraY));
      setFontForParas(pdf);

      paraY = paraY + 2 * lineHeight;
      paragraph = OUTPUTTEXTEP[lang].pg7P1;
      pdf.MultilineText(
        paragraph,
        InToPt(paraLeft),
        InToPt(paraY),
        InToPt(paraWidth)
      );

      /*end ofPage 7*/
      pdf.Footer(OUTPUTTEXTEP[lang].pgFooter);

      /*/*-Appendix		grids // Page 8*/

      // add a landscape page for aggregate grid

      const LE = props.LE; //- props.assetProjections[0].grid.dataProjection[1][0];
      const offsetLE=4;
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
        LE + offsetLE > LINES_PER_PAGE_LANDSCAPE &&
        LE + offsetLE < 2 * LINES_PER_PAGE_LANDSCAPE
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
      else if (LE + offsetLE > 2 * LINES_PER_PAGE_LANDSCAPE) {
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

      /*end ofPage 8*/
      pdf.addFooterAndHeader(headerOffset, footerText, headerText);

      /*/*-Using Life Insurance to Preserve Your Estate		// Page 6*/
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
      var data = pdf.showOnPage();

      if (result === false) alert(lang==="en"?"PDF image error":"Erreur d’image PDF");

      // Done
      pdf.Save("PYE_PDF.pdf");
      return data;
    }
  } catch (error) {}
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
  mode
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
  let paragraph = OUTPUTTEXTEP[lang].pg8T + ": " + OUTPUTTEXTEP[lang].pg3T;
  insertPara(pdf, paragraph, paraLeft, paraY, paraWidth);

  // Appendix para
  setFontForParas(pdf);
  paraY = paraY + 1.6 * height;
  paragraph =
    (mode === GRID_AGGREGATE
      ? OUTPUTTEXTEP[lang].pg8P1
      : OUTPUTTEXTEP[lang].pg8P2) +
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
    Widths[i] =goodWidth[i] + 0.15;
    if(Widths[i]>2.1*Widths[0])Widths[i]=2.1*Widths[0]
  }

  
  let widthTotal = 0;
  for (i = 2; i < cols; ++i) widthTotal += Widths[i];

  // now check multilines
  let goodWidthMultiLine = [];
  let totalGoodWidthMultiLine = 0;

  let addMore =
    (totalGridWidth - widthTotal - Widths[0] - Widths[1]) / (cols - 2);
  if (mode === GRID_INDIVIDUAL) {
    if(cols<8)
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
  // aportion grid title

  /*  for (i = 0; i < cols; ++i)
    if(Widths[i]<.9*goodWidthMultiLine[i])
        Widths[i]=goodWidthMultiLine[i]/.9
 */
  //for (i = 0; i < cols; ++i)
  //console.log(values[i],goodWidth[i],goodWidthMultiLine[i],Widths[i])
  // for (i = 0; i < cols; ++i)
  //  Widths[i]=goodWidthMultiLine[i]/.9*totalGridWidth/totalGoodWidthMultiLine

  // if(mode===GRID_AGGREGATE)
  {
    paraY = paraY + 0.8 * height;
    paragraph = grid.gridTitle;
    pdf.SetFontSize(PxToPt(12));
    pdf.SetTextColor(0x45, 0x55, 0x60);
    insertPara(pdf, paragraph, paraLeft, paraY, paraWidth);
    paraY = paraY + 0.4 * height;
  }

  // headers
  //console.log(values)
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
  const offsetLE=4
 
  while (rows < LE + offsetLE) {
    //grid.dataProjection[0].length) {

    if (
      rows === max &&
      ((startYr === 0 && LE + offsetLE - rows > 2) ||
        (startYr === LINES_PER_PAGE_LANDSCAPE &&
          LE + LINES_PER_PAGE_LANDSCAPE + offsetLE - rows > 2))
    ) {
      if (mode === GRID_AGGREGATE) {
        insertPara(
          pdf,
          "",
          paraLeft,
          paraY + (3 * height) / 2 + 0.1,
          paraWidth
        );
        pdf.FooterLandscape(OUTPUTTEXTEP[lang].pgFooter);
        return rows;
      }

      rows = LE + offsetLE - 2;
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
        (i === 0 && rows === 0) || i === 1 || i === 11
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
    pdf.FooterLandscape(OUTPUTTEXTEP[lang].pgFooter);
  else pdf.Footer(OUTPUTTEXTEP[lang].pgFooter);
}