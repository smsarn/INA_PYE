import React from "react";
import "../components/Output.css";
import OutputPage from "../components/outputPage.js";

import {
  ASSETS,
  MAX_ORPHAN_DUR_QC,
  MAX_ORPHAN_DUR_NON_QC,
  ORPHAN_AGE_QC,
  ORPHAN_AGE_NON_QC,
  PROVINCE,
  MEMBER,
  QUOTE_CLIENT,
  QUOTE_SPOUSE,
  TITLES,
  IMAGE_APPLET_INA,
  IMAGE_APPLET_EP,
  INCOMESOURCES,
} from "../definitions/generalDefinitions";

import { OUTPUTTEXT } from "../definitions/outputDefinitions";
import {
  formatted,
  cleanFormat,
  familyProjectionYears,
  isSingleFamily,
  versionDetails,
  getListItemKeyFromName,
  getLogoAndAppletImage,
  getName,
  formatMoney,
  numFormat,
} from "../utils/helper";
import { getOutputValues } from "../data/dataExchange";
import { Bar } from "react-chartjs-2";
import AgentPortfolio from "../components/AgentPortfolio.js";

// EP
import { getAssetLiabProjections } from "../data/aggregateGridProjections";
import {
  OUTPUTTEXTEP,
  ASSET_TAX_TYPE_REAL_ESTATE,
  ASSET_TAX_TYPE_STOCKS,
  ASSET_TAX_TYPE_SMALL_BUS,
  ASSET_TAX_TYPE_RRSP,
  ASSET_TAX_TYPE_INTEREST,
  ASSET_TAX_TYPE_OTHER,
} from "../definitions/outputDefinitionsEP";
import {
  formatMoney2,
  getAgesEP,
  buildSimpleAggregateGridEP,
} from "../utils/helper";
import { OutputGraphStacked } from "../components/OutputGraphStacked";
import { OutputGraphsEPLeakage } from "../components/OutputGraphsEPLeakage";
import { MultiButtons } from "../components/MultiButtons";
import DataTable from "../components/GridExcelComponent/DataTable";

const ABOUTME_IMAGE = "aboutMeImage";
const GRID_BREAK = 30;

export function getINAPages(
  props,
  spouseSwitched,
  appletImage,
  aboutMe,
  includeAboutMe,
  barConvertedToBase64,
  aboutMeImageConvertedToBase64,
  firstPageLogoWidth
) {
  let output = getOutputValues(props);
  const lang = props.dataInput.Presentations[0].language;
  const labelsBilingual = OUTPUTTEXT[lang];
  const decimalChar = lang === "en" ? "." : ",";
  const thousands = lang === "en" ? "," : " ";

  const singlePerson = props.dataInput.Clients.length === 1 ? true : false;
  const thereAfterText = singlePerson
    ? labelsBilingual.pgTabRowThereAfter_1
    : labelsBilingual.pgTabRowThereAfter;
  const thereAfterTextSF = singlePerson
    ? labelsBilingual.pg5TabRow7_1
    : labelsBilingual.pg5TabRow7;

  const clients = props.dataInput.Clients;
  const projYears = familyProjectionYears(
    clients,
    props.dataInput.Presentations[0].periodOption,
    props.LE,
    props.LE
  );
  const singleFamily = isSingleFamily(clients);
  const noSurvivor = singlePerson && versionDetails().versionNumeric <= 10014;

  const LEIfSpouseisSurvivor = singleFamily
    ? 0
    : props.LE.spouse + props.dataInput.Clients[1].Age;
  const toRetYears = singleFamily
    ? 0
    : props.dataInput.Clients[1].retirementAge - props.dataInput.Clients[1].Age;

  const TC = output.sources.filter(
    (item) =>
      (item.name === INCOMESOURCES.TAX_CREDIT.value.en ||
        item.name === INCOMESOURCES.TAX_CREDIT.value.fr) &&
      item.value > 0
  );

  // spouse ins
  let spouseInsRet;
  let spouseInsLE;
  let LEIfClientisSurvivor;

  if (!singleFamily && spouseSwitched !== null) {
    spouseInsRet = cleanFormat(spouseSwitched.spouseInsRet, lang);
    spouseInsLE = cleanFormat(spouseSwitched.spouseInsLE, lang);
    LEIfClientisSurvivor = spouseSwitched.LEIfClientisSurvivor;
  }

  const provinceKey = getListItemKeyFromName(PROVINCE, output.province);
  let maxDur = provinceKey === "QC" ? MAX_ORPHAN_DUR_QC : MAX_ORPHAN_DUR_NON_QC;
  let orphAge = provinceKey === "QC" ? ORPHAN_AGE_QC : ORPHAN_AGE_NON_QC;

  // graph details
  const options = {
    legend: {
      display: false,
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{ stacked: true }],
      yAxes: [
        {
          stacked: true,
          /* ticks: {
              beginAtZero: true,
              steps: 10,
              stepValue: 5,
            }, */
          ticks: {
            beginAtZero: true,
            callback: function (value, index, values) {
              let result =
                value < 1000
                  ? value
                  : Intl.NumberFormat(lang).format(value / 1000) + "K";
              return result;
            },
          },
        },
      ],
    },
  };

  // //console.log(output)

  var dataLabels = singlePerson ? ["A"] : ["A", "B"];
  var dColor = ["#7399c6", "#d9d3a4"];
  const under25 =
    output.ygChild < maxDur
      ? output.insNeedYgChild25 + output.totalAsset - output.totalLiab
      : 0;
  const under18 =
    output.ygChild < orphAge
      ? output.insNeedYgChild18 + output.totalAsset - output.totalLiab
      : 0;

  let youngestChildEndAge = maxDur;
  if (output.hasChild) {
    youngestChildEndAge = Math.min(
      maxDur,
      props.dataInput.Clients.filter((item) => {
        return item.Age === output.ygChild;
      })[0].retirementAge
    );
  }

  if (output.hasChild) {
    dataLabels = ["A", "B", "C", "D"];
    dColor = ["#7399c6", "#d9d3a4", "#949ca1", "#847a18"];
  }

  /* console.log(output.clients) */
  var dataValues2 = singlePerson
    ? [output.insNeedLE]
    : [output.insNeedLE, output.insNeedRet];
  if (output.hasChild) {
    if (singleFamily) {
      dataLabels = ["A", "B", "C"];
      dataValues2 = [
        output.insNeedRet,
        output.insNeedYgChild25,
        output.insNeedYgChild18,
      ];
      dColor = ["#d9d3a4", "#949ca1", "#847a18"];
    } else {
      dataLabels = ["A", "B", "C", "D"];
      dataValues2 = [
        output.insNeedLE,
        output.insNeedRet,
        output.insNeedYgChild25,
        output.insNeedYgChild18,
      ];
      dColor = ["#7399c6", "#d9d3a4", "#949ca1", "#847a18"];
    }
  } else if (singleFamily && output.hasChild === false) {
    // single family with dep adult
    dataLabels = ["A"];
    dataValues2 = [output.insNeedRet];
    dColor = ["#d9d3a4"];
  }

  const dataInsurance2 = {
    labels: dataLabels,
    datasets: [
      {
        label: "", //Income Shortfall',
        data: dataValues2,
        fill: false, // Don't fill area under the line
        borderColor: "#2B3856", // Line color
        backgroundColor: dColor,
      },
    ],
  };

  const needTo = props.insNeedLine;
  const images = getLogoAndAppletImage(
    props.dataInput,
    props.imageRemove,
    props.imageAdjust,
    props.updateImageApplet,
    props.updateImageLogo
  );

  const logoOnTop = images.logoOnTop;
  const logoAllPages = images.logoAllPages;
  const logoOnly = images.logoOnly; // <div style={{float:"left",marginLeft:parseFloat(100*smallLogoAdj+props.dataInput.Presentations[0].adviserLogo.left)  + "%"}}><img className="logo" src={props.dataInput.Presentations[0].adviserLogo.image} /></div>;
  const logoFirstPg = images.logo1stPage1; //<div style={{marginLeft:marginLeft1stPg + "%"}}><img className="logo1st" src={props.dataInput.Presentations[0].adviserLogo.image} /></div>;
  const hasLogo = props.dataInput.Presentations[0].adviserLogo !== null;

  const posGrid = singleFamily || singlePerson ? "-80px" : "-30px";

  const aboutMeSpecs = aboutMe;

  // add pages
  const pageCover = (
    <div className="newPage" id="PageCover">
      <div
        className="printOnly"
        style={{
          height:
            props.dataInput.Presentations[0].adviserLogo.image === null
              ? "350px"
              : logoOnTop
              ? "150px"
              : "350px",
        }}
      >
        {" "}
      </div>

      <div style={{ paddingTop: "40px" }}>
        <hr className="ppi1 no-print" />

        <h1 className="ppi1 printOnly" data-ppi-noneditable>
          {TITLES[lang].appletINA}
        </h1>

        {appletImage === null ? (
          images.appletImageOnly
        ) : (
          <img
            ID={IMAGE_APPLET_INA}
            style={{ maxWidth: "100%", maxHeight: "400px" }}
            src={appletImage}
          />
        )}

        <h1 className="ppi1 no-print" data-ppi-noneditable>
          {labelsBilingual.pg1T}
        </h1>
      </div>

      <h5 className="ppi2">
        {labelsBilingual.pg1P1} {output.designedFor}
        <br />
        {labelsBilingual.pg1P2} {output.designedBy}
        <br />
        {labelsBilingual.pg1P3} {output.dateApplet}
        <br />
        {labelsBilingual.pg1P4} {output.province}
        <br />
      </h5>
    </div>
  );

  let pageAboutMe;
  if (includeAboutMe) {
    pageAboutMe = (
      <div className="newPage" id="PageAboutMe">
        <hr className="ppi1 no-print" />
        <br />
        <AgentPortfolio
          agentPortfolio={aboutMe}
          mode={"html"}
          imageID={ABOUTME_IMAGE}
          aboutMeImageConvertedToBase64={aboutMeImageConvertedToBase64}
          lang={lang}
        />
        <br />
      </div>
    );
  }

  const pageSummarywoAssumptions = (
    <div>
      <hr className="ppi1 no-print" />
      {/*<div className="pdfHeader">{headerTitle}</div>*/}
      {/* <h2 className="ppi2">{headerTitle}</h2> */}
      <div className="outputSectionTitle">{labelsBilingual.pg1T_1}</div>
      <div
        style={{
          overflowX: "auto",
          overflowY: "hidden",
          width: "100%",
        }}
      >
        <table className="INA">
          <thead>
            <tr>
              <th style={{ width: "30%", marginLeft: "0em" }}>
                {singlePerson
                  ? labelsBilingual.pg2TabT1_1
                  : labelsBilingual.pg2TabT1}
              </th>
              <th style={{ width: "10%" }}>{labelsBilingual.pg2TabT2}</th>
              <th style={{ width: "18%" }}>{labelsBilingual.pg2TabT3}</th>
              <th style={{ width: "19%" }}>
                {singleFamily
                  ? labelsBilingual.pg2TabT4Alt
                  : labelsBilingual.pg2TabT4}
              </th>
              <th style={{ width: "19%" }}>{labelsBilingual.pg2TabT5}</th>
            </tr>
          </thead>
          <tbody>
            {output.clients.map((item) => (
              <tr key={item.id}>
                <td>
                  {item.memberKey === MEMBER.CLIENT.Key
                    ? MEMBER.CLIENT.value[lang] + getName(item.name, lang)
                    : item.memberKey === MEMBER.SPOUSE.Key
                    ? MEMBER.SPOUSE.value[lang] + getName(item.name, lang)
                    : item.memberKey === MEMBER.CHILD.Key
                    ? MEMBER.CHILD.value[lang] + getName(item.name, lang)
                    : MEMBER.DEPENDENT_ADULT.value[lang] +
                      getName(item.name, lang)}
                </td>
                <td className="textalignright">
                  <span data-ppi-noneditable>{item.age}</span>
                </td>
                <td className="textalignright">
                  <span data-ppi-noneditable>
                    {formatted(item.income, lang)}
                  </span>
                </td>
                <td className="textalignright">
                  <span data-ppi-noneditable>
                    {singleFamily
                      ? item.memberKey === MEMBER.CLIENT.Key
                        ? "-"
                        : item.ret - item.age //protectionPeriod
                      : item.ret}
                  </span>
                </td>
                <td className="textalignright">
                  <span data-ppi-noneditable>
                    {item.memberKey === MEMBER.CLIENT.Key
                      ? numFormat(
                          clients[QUOTE_CLIENT].avgTaxRate,
                          false,
                          3,
                          thousands,
                          decimalChar
                        )
                      : item.memberKey === MEMBER.SPOUSE.Key
                      ? numFormat(
                          clients[QUOTE_SPOUSE].avgTaxRate,
                          false,
                          3,
                          thousands,
                          decimalChar
                        )
                      : numFormat(
                          clients[item.id - 1].avgTaxRate,
                          false,
                          3,
                          thousands,
                          decimalChar
                        )}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* financial summary
       */}
      <h4 className="ppi2"></h4>
      <table className="INA">
        <thead>
          <tr>
            <th colSpan="2" style={{ width: "100%" }}>
              {labelsBilingual.pg2T3}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="paddingleft25">{labelsBilingual.pg2P5}</td>
            <td className="textalignright">
              <span data-ppi-noneditable>
                {formatted(output.totalAssetExcludeInsurance, lang)}
              </span>
            </td>
          </tr>
          <tr>
            <td className="paddingleft25">{labelsBilingual.pg2P6}</td>
            <td className="textalignright">
              <span data-ppi-noneditable>
                {formatted(output.totalLiabExcludeDeathRelated, lang)}
              </span>
            </td>
          </tr>
          <tr>
            <td className="paddingleft25" style={{ textAlign: "right" }}>
              {labelsBilingual.pg2P7}
            </td>
            <td className="textalignright">
              <span data-ppi-noneditable>
                {formatted(
                  output.totalAssetExcludeInsurance -
                    output.totalLiabExcludeDeathRelated,
                  lang
                )}
              </span>
            </td>
          </tr>
          <tr>
            <td className="paddingleft25">
              <span data-ppi-noneditable>
                {labelsBilingual.pg2P8.replace(
                  "yyy",
                  formatted(output.govDB, lang)
                )}
              </span>
            </td>
            <td className="textalignright">
              <span data-ppi-noneditable>
                {formatted(output.totalAssetInsurance + output.govDB, lang)}
              </span>
            </td>
          </tr>
          <tr>
            <td className="paddingleft25">{labelsBilingual.pg2P9}</td>
            <td className="textalignright">
              <span data-ppi-noneditable>
                {formatted(
                  output.totalLiab - output.totalLiabExcludeDeathRelated,
                  lang
                )}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      {/* insuranse anal */}
      <h4 className="ppi2"></h4>
      <table className="INA">
        <thead>
          <tr>
            <th colSpan="3" style={{ width: "100%" }}>
              {labelsBilingual.pg2T4}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="paddingleft25" colSpan="3">
              <span data-ppi-noneditable>
                {labelsBilingual.pg2P104 +
                  ": " +
                  formatted(output.totalAssetInsurance + output.govDB, lang)}
              </span>
            </td>
          </tr>
          <tr>
            <td className="paddingleft25">{labelsBilingual.pg2P10 + ":"}</td>
            <td className="textalignright" style={{ paddingTop: ".3em" }}>
              {labelsBilingual.pg2P101 + ":"}
            </td>
            <td className="textalignright" style={{ paddingTop: ".3em" }}>
              {labelsBilingual.pg2P102 + ":"}
            </td>
          </tr>
          {singleFamily === false && (
            <tr>
              <td className="paddingleft25">
                <span data-ppi-noneditable>
                  {OUTPUTTEXT[lang].pg8TabRow3 + LEIfSpouseisSurvivor + ")"}
                </span>
              </td>
              <td className="textalignright">
                <span data-ppi-noneditable>{props.LE.spouse}</span>
              </td>
              <td className="textalignright">
                <span data-ppi-noneditable>
                  {formatted(output.insNeedLE, lang)}
                </span>
              </td>
            </tr>
          )}
          <tr>
            <td className="paddingleft25">
              {singleFamily
                ? OUTPUTTEXT[lang].pg8TabRow4Alt.replace("A. ", "")
                : OUTPUTTEXT[lang].pg8TabRow4}
            </td>
            <td className="textalignright">
              <span data-ppi-noneditable>{toRetYears}</span>
            </td>
            <td className="textalignright">
              <span data-ppi-noneditable>
                {formatted(output.insNeedRet, lang)}
              </span>
            </td>
          </tr>
          <tr>
            <td className="paddingleft25">{OUTPUTTEXT[lang].pg2P103}</td>
            <td className="textalignright">
              <span data-ppi-noneditable>{props.yrsCoverageIfCashAll}</span>
            </td>
            <td className="textalignright">
              <span data-ppi-noneditable>{formatted(0, lang)}</span>
            </td>
          </tr>
        </tbody>
      </table>
      {/* insuranse anal spouse */}
      <h4 className="ppi2"></h4>
      {!singleFamily && spouseSwitched !== null && (
        <table className="INA">
          <thead>
            <tr>
              <th colSpan="2" style={{ width: "100%" }}>
                {labelsBilingual.pg2T5}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="paddingleft25" colSpan="2">
                {labelsBilingual.pg2P12}
              </td>
            </tr>
            <tr>
              <td className="paddingleft25" colSpan="2">
                <span data-ppi-noneditable>
                  {" "}
                  {labelsBilingual.pg2P104 +
                    ": " +
                    formatted(
                      output.totalAssetInsuranceIfSpouse + output.govDB,
                      lang
                    )}
                </span>
              </td>
            </tr>
            <tr>
              <td className="paddingleft25" colSpan="2">
                {OUTPUTTEXT[lang].pg2P11.replace(
                  lang === "en" ? " NAME" : " NOM",
                  getName(clients[1].Name, lang)
                )}
              </td>
            </tr>
            <tr>
              <td className="paddingleft25">
                <span data-ppi-noneditable>
                  {OUTPUTTEXT[lang].pg8TabRow3 + LEIfClientisSurvivor + ")"}
                </span>
              </td>
              <td className="textalignright">
                <span data-ppi-noneditable>{formatted(spouseInsLE, lang)}</span>
              </td>
            </tr>
            <tr>
              <td className="paddingleft25">{OUTPUTTEXT[lang].pg8TabRow4}</td>
              <td className="textalignright">
                <span data-ppi-noneditable>
                  {formatted(spouseInsRet, lang)}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );

  const assumptions = (
    <div>
      {/* assumptions <h2 className="ppi2">{labelsBilingual.pg2T2}</h2> */}
      <h4 className="ppi2"></h4>
      {/* <div>{labelsBilingual.pg2T2}</div> */}
      <table className="INA">
        <thead>
          <tr>
            <th colSpan="2" style={{ width: "100%" }}>
              {labelsBilingual.pg2T2}
            </th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td className="paddingleft25">{labelsBilingual.pg7TabRow4}</td>
            <td className="textalignright">
              <span data-ppi-noneditable>
                {" "}
                {numFormat(output.infRate, false, 3, thousands, decimalChar)}
              </span>
            </td>
          </tr>
          <tr>
            <td className="paddingleft25">
              {singlePerson
                ? labelsBilingual.pg7TabRow5_1
                : labelsBilingual.pg7TabRow5}
            </td>
            <td className="textalignright">
              <span data-ppi-noneditable>
                {numFormat(output.invRate, false, 3, thousands, decimalChar)}
              </span>
            </td>
          </tr>
          <tr>
            <td className="paddingleft25">{labelsBilingual.pg2TabT6}</td>
            <td className="textalignright">
              <span data-ppi-noneditable>
                {numFormat(
                  props.dataInput.Presentations[0].taxRate,
                  false,
                  3,
                  thousands,
                  decimalChar
                )}
              </span>
            </td>
          </tr>
          <tr></tr>
          <tr></tr>
          <tr></tr>
        </tbody>
      </table>
      <p className="ppi2">
        {singlePerson ? labelsBilingual.pg2Tab2_1 : labelsBilingual.pg2Tab2}
      </p>
      <p className="ppi2">{labelsBilingual.pg2Tab3}</p>{" "}
    </div>
  );

  let pageSummary;
  let pageAssumptions;

  if (output.clients.length <= 5) {
    pageSummary = (
      <div className="newPage" id="PageSummary">
        {pageSummarywoAssumptions}
        {assumptions}
      </div>
    );
  } else {
    pageSummary = (
      <div className="newPage" id="PageSummary">
        {pageSummarywoAssumptions}
        <hr className="ppi1 no-print" />
      </div>
    );
    pageAssumptions = (
      <div className="newPage" id="PageAssumptions">
        {assumptions}
      </div>
    );
  }

  /* PAGE 3 Family Cash and income Sourcess at Death*/
  const pageCashIncomeNeeds = (
    <div className="newPage" id="PageCashIncomeNeeds">
      <hr className="ppi1 no-print" />
      <div className="outputSectionTitle">
        {singlePerson ? labelsBilingual.pg3T_1 : labelsBilingual.pg3T}
        <p className="ppi1">
          {singlePerson ? labelsBilingual.pg3P1_1 : labelsBilingual.pg3P1}
        </p>
      </div>
      <div
        style={{
          overflowX: "auto",
          overflowY: "hidden",
          width: "100%",
        }}
      >
        <table className="INA">
          <thead>
            <tr>
              <th style={{ width: "38%" }}>{labelsBilingual.pg3TabT} </th>
              <th style={{ width: "44%" }}>{labelsBilingual.pg3TabT2}</th>{" "}
              <th style={{ width: "18%" }}>{labelsBilingual.pg3TabT3}</th>
            </tr>
          </thead>
          <tbody>
            {output.liabilities.map((item) => {
              return (
                <tr key={item.name}>
                  <td>{item.name}</td>
                  <td>{item.desc !== undefined ? item.desc : ""}</td>
                  <td className="textalignright">
                    <span data-ppi-noneditable>
                      {formatted(item.value, lang)}
                    </span>

                    {/*       {dollarEn}{formatMoney(item.value, 0, decimalChar, thousands)} */}
                  </td>
                </tr>
              );
            })}
            <tr className="backgroundcolorDCE5F0">
              <td colSpan="2">
                <strong>{labelsBilingual.pg3TabRTot}</strong>
              </td>
              <td className="textalignright">
                <strong>
                  <span data-ppi-noneditable>
                    {formatted(output.totalLiab, lang)}
                  </span>

                  {/*       {dollarEn}
              {formatMoney(
                output.totalLiab,
                0,
                decimalChar,
                thousands
              )} */}
                </strong>
              </td>
            </tr>
            {/*	<tr className="backgroundcolorDCE5F0">
    <td><strong>Permanent Cash Needs <sup>p</sup></strong></td>
        <td className="textalignright"><strong>{dollarEn}200 <sup>p</sup></strong></td>
      </tr>*/}
          </tbody>
        </table>
      </div>
      {/* combined with pg 3 PAGE 4 Family Income Needs at Death*/}
      {/* <br />
<hr className="ppi1" />
<h2 className="ppi1">{labelsBilingual.pg4T}</h2>
<p className="ppi1">{labelsBilingual.pg4P1}</p>*/}
      <h4 className="ppi1"></h4>
      <div
        style={{
          overflowX: "auto",
          overflowY: "hidden",
          width: "100%",
        }}
      >
        <table className="INA">
          <thead>
            <tr>
              <th colSpan="2" style={{ width: "34%" }}>
                {labelsBilingual.pg4TabT}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="paddingleft25" style={{ width: "70%" }}>
                {singlePerson
                  ? labelsBilingual.pg4TabRow1_1
                  : labelsBilingual.pg4TabRow1}
              </td>
              <td className="textalignright">
                <span data-ppi-noneditable>
                  {formatted(output.Income + output.Income2, lang)}
                </span>

                {/*     {dollarEn}
            {formatMoney(
              output.Income + output.Income2,
              0,
              decimalChar,
              thousands
            )} */}
              </td>
            </tr>
            <tr className="backgroundcolorFFFFFF">
              <td>
                <br />
                {singlePerson
                  ? labelsBilingual.pg4TabRow2_1
                  : labelsBilingual.pg4TabRow2}
              </td>
              <td></td>
            </tr>

            {output.percent2.length > 0 && (
              <tr>
                <td className="paddingleft25">{labelsBilingual.pg4TabRow3}</td>
                <td className="textalignright">{output.percent1}%</td>
              </tr>
            )}
            {output.percent2.length > 0 && (
              <tr>
                <td className="paddingleft25">{labelsBilingual.pg4TabRow4}</td>
                <td className="textalignright">
                  {output.percent2.map((item) => (
                    <span>{item}% </span>
                  ))}
                </td>
              </tr>
            )}
            {output.percent2.length === 0 && (
              <tr>
                <td className="paddingleft25">
                  {singleFamily ? thereAfterTextSF : thereAfterText}
                </td>
                <td className="textalignright">{output.percent1}%</td>
              </tr>
            )}

            <tr className="backgroundcolorFFFFFF">
              <td></td>
              <td></td>
            </tr>
            <tr className="backgroundcolorFFFFFF">
              <td>{labelsBilingual.pg4TabRow5}</td>
              <td></td>
            </tr>
            {output.percent2.length > 0 && (
              <tr>
                <td className="paddingleft25">
                  {labelsBilingual.pgTabRowMoreIncome}
                </td>
                <td className="textalignright">
                  {formatted(output.percentNeed1, lang)}

                  {/*       {dollarEn}
              {formatMoney(
                output.percentNeed1,
                0,
                decimalChar,
                thousands
              )} */}
                </td>
              </tr>
            )}
            {output.percent2.length > 0 && (
              <tr>
                <td className="paddingleft25">
                  {singleFamily ? thereAfterTextSF : thereAfterText}
                </td>
                <td className="textalignright">
                  {formatted(
                    output.percentNeed2.reduce((a, b) => a + b, 0),
                    lang
                  )}

                  {/*       {dollarEn}
              {formatMoney(
                output.percentNeed2.reduce((a, b) => a + b, 0),
                0,
                decimalChar,
                thousands
              )} */}
                </td>
              </tr>
            )}
            {output.percent2.length === 0 && (
              <tr>
                <td className="paddingleft25">
                  {singleFamily ? thereAfterTextSF : thereAfterText}
                </td>
                <td className="textalignright">
                  {formatted(output.percentNeed1, lang)}

                  {/* {dollarEn}
              {formatMoney(
                output.percentNeed1,
                0,
                decimalChar,
                thousands
              )} */}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <br />
    </div>
  );

  /* PAGE 3 Family Cash and income Sourcess at Death*/
  const pageCashIncomeSources = (
    <div className="newPage" id="PageCashIncomeSources">
      <hr className="ppi1 no-print" />
      {/*<div className="pdfHeader">{headerTitle}</div>*/}
      <div className="outputSectionTitle">
        {/* {singlePerson ? labelsBilingual.pg5T_1 : labelsBilingual.pg5T} */}
        {/* combine two pages 4 and 5 */}
        {singlePerson ? labelsBilingual.pg5T_1_2 : labelsBilingual.pg5T_2}
      </div>
      <div
        style={{
          overflowX: "auto",
          overflowY: "hidden",
          width: "100%",
        }}
      >
        <table className="INA"  data-ppi-noneditable>
          <thead>
            <tr>
              <th style={{ width: "34%" }}>{labelsBilingual.pg5TabT}</th>
              <th style={{ width: "28%" }}>{labelsBilingual.pg3TabT2}</th>{" "}
              {/* desc */}
              <th style={{ width: "18%" }}>{labelsBilingual.pg5TabT2}</th>
              <th style={{ width: "20%" }}>{labelsBilingual.pg5TabT3}</th>
            </tr>
          </thead>

          <tbody>
            {/* add gov db*/}
            <tr>
              <td>{labelsBilingual.pg5TabRow1}</td>
              <td />
              <td className="textalignright">
                <span data-ppi-noneditable>
                  {formatted(output.govDB, lang)}
                </span>
              </td>
              <td className="textalignright">
                <span data-ppi-noneditable>
                  {formatted(output.govDB, lang)}
                </span>
              </td>
            </tr>
            {output.assets.map((item) => {
              if (true)
                // include all so they see the list instead of item.value>0)
                return (
                  <tr key={item.name}>
                    <td>{item.name}</td>
                    <td>{item.desc !== undefined && item.desc}</td>
                    <td className="textalignright">
                      <span data-ppi-noneditable>
                        {formatted(item.value, lang)}
                      </span>
                    </td>
                    <td className="textalignright">
                      {item.disposeValue > 0
                        ? formatted(item.disposeValue, lang)
                        : ""}
                    </td>
                  </tr>
                );
            })}
            <tr
              className="backgroundcolorDCE5F0"
              style={{ height: "2.25em", verticalAlign: "bottom" }}
            >
              <td colSpan="2">{labelsBilingual.pg5TabRow3}</td>

              <td className="textalignright">
                <span data-ppi-noneditable>
                  {formatted(output.totalAsset, lang)}
                </span>
              </td>
              <td className="textalignright">
                <span data-ppi-noneditable>
                  {formatted(output.totalDisposeAsset, lang)}
                </span>
              </td>
            </tr>
            <tr className="backgroundcolorDCE5F0">
              <td colSpan="3">
                {singlePerson
                  ? labelsBilingual.pg5TabRow4_1
                  : labelsBilingual.pg5TabRow4}
              </td>
              <td className="textalignright">
                <span data-ppi-noneditable>
                  {formatted(output.totalLiab, lang)}
                </span>
              </td>
            </tr>
            <tr>
              <td colSpan="3">
                {singlePerson
                  ? labelsBilingual.pg5TabRow5_1
                  : labelsBilingual.pg5TabRow5}
              </td>
              <td className="textalignright">
                <span data-ppi-noneditable>
                  {formatted(output.totalDisposeAsset - output.totalLiab, lang)}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* PAGE 5 Family Income Sources at Death*/}

      {/*             <div className="newPage" id="Page5">
          <hr className="ppi2 no-print" />
          {/*<div className="pdfHeader">{headerTitle}</div>*/}
      {/* <div className="outputSectionTitle">
      {singlePerson ? labelsBilingual.pg6T_1 : labelsBilingual.pg6T}
              </div> */}
      <br />
      <div
        style={{
          overflowX: "auto",
          overflowY: "hidden",
          width: "100%",
        }}
      >
        <table className="INA">
          <thead>
            <tr>
              <th style={{ width: "50%" }}>{labelsBilingual.pg6TabT}</th>
              <th style={{ width: "18%" }}>{labelsBilingual.pg5TabT2}</th>
              <th style={{ width: "24%" }} colSpan="2">
                {labelsBilingual.pg5TabT3}
              </th>
            </tr>
          </thead>

          <tbody>
            {output.sources.map((item) => {
              if (true)
                // include all so they see the list instead of item.value>0)
                return (
                  <tr key={item.name}>
                    <td style={{ width: "51%" }}>{item.name}</td>
                    <td className="textalignright" style={{ width: "14%" }}>
                      <span data-ppi-noneditable>
                        {formatted(item.value, lang)}
                      </span>
                    </td>
                    <td
                      className="textalignright"
                      style={{ width: "25%" }}
                      colSpan="2"
                    >
                      <span data-ppi-noneditable>
                        {formatted(item.valueAtDeath, lang)}
                      </span>
                    </td>
                  </tr>
                );
            })}
            <tr className="backgroundcolorFFFFFF">
              <td colSpan="2"></td>
              <td colSpan="2"></td>
            </tr>
            <tr className="backgroundcolorFFFFFF">
              <td colSpan="4">{labelsBilingual.pg6TabRow1}</td>
              {/* <td colSpan="2"></td> */}
            </tr>
            {output.percent2.length > 0 && (
              <tr>
                <td colSpan="2" className="paddingleft25">
                  {labelsBilingual.pg6TabRow2}
                </td>
                <td className="textalignright">
                  <span style={{ fontSize: ".8em" }} data-ppi-noneditable>
                    ({labelsBilingual.pg6Net + " "}
                    {formatMoney(
                      //output.totalSourceATax,
                      output.totalSourceATaxAtDeath,
                      0,
                      decimalChar,
                      thousands
                    )}
                    )
                  </span>
                </td>
                <td className="textalignright">
                  <span data-ppi-noneditable>
                    {formatted(output.totalSourceAtDeath, lang)}
                  </span>
                </td>
              </tr>
            )}
            {output.percent2.length > 0 && (
              <tr>
                <td colSpan="2" className="paddingleft25">
                  {!singleFamily ? thereAfterText : thereAfterTextSF}
                </td>
                <td className="textalignright">
                  <span style={{ fontSize: ".8em" }} data-ppi-noneditable>
                    ({labelsBilingual.pg6Net + " "}
                    {formatMoney(
                      //output.totalSource2ATax,
                      output.totalSource2ATaxAtDeath,
                      0,
                      decimalChar,
                      thousands
                    )}
                    )
                  </span>
                </td>
                <td className="textalignright">
                  <span data-ppi-noneditable>
                    {formatted(output.totalSource2AtDeath, lang)}
                  </span>
                </td>
              </tr>
            )}
            {output.percent2.length === 0 && (
              <tr>
                <td colSpan="2" className="paddingleft25">
                  {!singleFamily ? thereAfterText : thereAfterTextSF}
                </td>
                <td colSpan="2" className="textalignright">
                  {/* <span  data-ppi-noneditable>{formatted
(output.totalSource,lang)}</span>
 */}
                  <span data-ppi-noneditable>
                    {formatted(output.totalSourceAtDeath, lang)}
                  </span>
                </td>
              </tr>
            )}
            <tr className="backgroundcolorFFFFFF">
              <td colSpan="2"></td>
              <td colSpan="2"></td>
            </tr>
            <tr className="backgroundcolorFFFFFF">
              <td colSpan="4">{labelsBilingual.pg6TabRow4}</td>
              {/* <td colSpan="2"></td> */}
            </tr>
            {output.percent2.length > 0 && (
              <tr>
                <td colSpan="2" className="paddingleft25">
                  {labelsBilingual.pgTabRowMoreIncome}
                </td>

                <td className="textalignright">
                  (
                  <span style={{ fontSize: ".8em" }} data-ppi-noneditable>
                    {formatMoney(
                      output.percentNeed1,
                      0,
                      decimalChar,
                      thousands
                    )}
                  </span>
                  -
                  <span style={{ fontSize: ".8em" }} data-ppi-noneditable>
                    {formatMoney(
                      output.totalSourceATaxAtDeath,
                      0,
                      decimalChar,
                      thousands
                    )}
                  </span>
                  )
                </td>

                <td className="textalignright">
                  <strong>
                    <span data-ppi-noneditable>
                      {formatted(
                        Math.max(
                          0,
                          output.percentNeed1 - output.totalSourceATaxAtDeath
                        ),
                        lang
                      )}
                    </span>
                  </strong>
                </td>
              </tr>
            )}
            {output.percent2.length > 0 && (
              <tr>
                <td colSpan="2" className="paddingleft25">
                  {!singleFamily ? thereAfterText : thereAfterTextSF}
                </td>
                <td className="textalignrightbackgroundcolorDCE5F0">
                  (
                  <span style={{ fontSize: ".8em" }} data-ppi-noneditable>
                    {" "}
                    {formatMoney(
                      output.percentNeed2.reduce((a, b) => a + b, 0),
                      0,
                      decimalChar,
                      thousands
                    )}
                  </span>
                  -
                  <span style={{ fontSize: ".8em" }} data-ppi-noneditable>
                    {
                      /* formatMoney(output.totalSource2ATax, 0, decimalChar, thousands) */
                      formatMoney(
                        output.totalSource2ATaxAtDeath,
                        0,
                        decimalChar,
                        thousands
                      )
                    }
                  </span>
                  )
                </td>
                <td className="textalignrightbackgroundcolorDCE5F0">
                  <strong>
                    {/* {formatted(Math.max(0, output.percentNeed2.reduce((a, b) => a + b, 0) - output.totalSource2ATax),lang)}</span>
                     */}
                    <span data-ppi-noneditable>
                      {formatted(
                        Math.max(
                          0,
                          output.percentNeed2.reduce((a, b) => a + b, 0) -
                            output.totalSource2ATaxAtDeath
                        ),
                        lang
                      )}
                    </span>
                  </strong>
                </td>
              </tr>
            )}
            {output.percent2.length === 0 && (
              <tr>
                <td colSpan="2" className="paddingleft25">
                  {!singleFamily ? thereAfterText : thereAfterTextSF}
                </td>
                <td className="textalignrightbackgroundcolorDCE5F0">
                  <span style={{ fontSize: ".8em" }} data-ppi-noneditable>
                    (
                    {formatMoney(
                      output.percentNeed1,
                      0,
                      decimalChar,
                      thousands
                    )}
                    -
                    {
                      /* formatMoney(output.totalSourceATax, 0, decimalChar, thousands) */
                      formatMoney(
                        output.totalSourceATaxAtDeath,
                        0,
                        decimalChar,
                        thousands
                      )
                    }
                    )
                  </span>
                </td>
                <td className="textalignrightbackgroundcolorDCE5F0">
                  <strong>
                    <span data-ppi-noneditable>
                      {formatted(
                        Math.max(
                          0,
                          output.percentNeed1 - output.totalSourceATaxAtDeath
                        ),
                        lang
                      )}
                    </span>
                  </strong>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  /* page analysis and graph */
  const pageAnalandGraph = (
    <div className="newPage" id="PageAnalandGraph">
      <hr className="ppi1 no-print" />

      <div className="outputSectionTitle">{labelsBilingual.pg8T}</div>

      <div
        style={{
          overflowX: "auto",
          overflowY: "hidden",
          width: "100%",
        }}
      >
        <table className="INA">
          <thead>
            <tr>
              <th colSpan="2" style={{ width: "100%", marginLeft: "0em" }}>
                {singlePerson
                  ? labelsBilingual.pg8TabT_1
                  : labelsBilingual.pg8TabT}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td width="70%">{labelsBilingual.pg8TabRow1}</td>
              <td className="textalignright" width="30%">
                <span data-ppi-noneditable>
                  {formatted(output.totalDisposeAsset - output.totalLiab, lang)}
                </span>
              </td>
            </tr>
            <tr>
              <td className="backgroundcolorFFFFFF">
                <br />
                {labelsBilingual.pg8TabRow2}
              </td>
              <td className="backgroundcolorFFFFFF"></td>
            </tr>
            {!singleFamily && (
              <tr>
                <td>
                  <span data-ppi-noneditable>
                    {labelsBilingual.pg8TabRow3}
                    {props.LE.spouse + projYears.survivorAge}
                  </span>
                  )
                </td>
                <td className="textalignright">
                  <span data-ppi-noneditable>
                    {formatted(props.insuranceNeedLE, lang)}
                  </span>
                </td>
              </tr>
            )}
            <tr>
              <td>
                <strong></strong>
                {singleFamily || singlePerson
                  ? labelsBilingual.pg8TabRow4Alt.replace("B.", "A.")
                  : labelsBilingual.pg8TabRow4}
              </td>
              <td className="textalignright">
                <span data-ppi-noneditable>
                  {formatted(props.insuranceNeedRet, lang)}
                </span>
              </td>
            </tr>
            {output.hasChild && output.ygChild < maxDur && (
              <tr>
                <td>
                  <strong></strong>
                  <span data-ppi-noneditable>
                    {singleFamily
                      ? labelsBilingual.pg8TabRow5
                          .replace("C.", "B.")
                          .replace("25", output.youngestChildEndAge)
                      : labelsBilingual.pg8TabRow5.replace(
                          "25",
                          output.youngestChildEndAge
                        )}
                  </span>
                </td>
                <td className="textalignright">
                  <span data-ppi-noneditable>
                    {formatted(output.insNeedYgChild25, lang)}
                  </span>
                </td>
              </tr>
            )}
            {output.hasChild && output.ygChild < orphAge && (
              <tr>
                <td>
                  <strong></strong>
                  <span data-ppi-noneditable>
                    {singleFamily
                      ? labelsBilingual.pg8TabRow6.replace("D.", "C.")
                      : labelsBilingual.pg8TabRow6}
                  </span>
                </td>
                <td className="textalignright">
                  <span data-ppi-noneditable>
                    {formatted(output.insNeedYgChild18, lang)}
                  </span>
                </td>
              </tr>
            )}
            <tr></tr>
          </tbody>
        </table>

        <div
          style={{
            color: "darkBlue",
            marginTop: "3.5em",
            contain: "content",
          }}
        >
          <br />
          <div style={{ marginLeft: "1.25em", width: "90%" }}>
            <div
              style={{ maxWidth: "350px", maxHeight: "350px" }}
              data-ppi-noneditable
            >
              {
                <div className="printOnly">
                  {barConvertedToBase64 !== null && (
                    <img src={barConvertedToBase64} />
                  )}
                </div>
              }
              <article
                id="bar2"
                className="canvas-container no-print"
                style={{ height: "350px" }}
              >
                <Bar data={dataInsurance2} options={options} />
              </article>
            </div>
          </div>
        </div>
        <br />
        <br />
      </div>
    </div>
  );

  /* PAGE Notes */
  const pageNotes = (
    <div
      className="newPage"
      id="PageNotes"
      data-ppi-noneditable
      data-ppi-pagelocked
    >
      <hr className="ppi1 no-print" />
      {/*<div className="pdfHeader">{headerTitle}</div>*/}
      <div className="outputSectionTitle">{labelsBilingual.pg9T}</div>
      <div
        style={{
          overflowX: "auto",
          overflowY: "hidden",
          width: "100%",
        }}
      ></div>
      <p className="ppi2">{labelsBilingual.pg9P1}</p>
      <br /> <br />
      <br />
      <br />
      <br />
      {/* PAGE 8 ackno*/}
      {/*             <div className="newPage" id="Page8">
            <hr className="ppi2 no-print" />
            {/*<div className="pdfHeader">{headerTitle}</div>*/}
      <br />
      <br /> <br />
      <div className="outputSectionTitle">{labelsBilingual.pg10T}</div>
      <p className="ppi2">{labelsBilingual.pg10P1}</p>
      <br /> <br />
      <br />
      <br />
      <br />
      <p className="ppi2">
        {labelsBilingual.pg10TabRow1}
        <br />
        <span style={{ paddingLeft: "7em" }}>
          {labelsBilingual.pg10TabRow11}
        </span>
      </p>
      <br />
      <br />
      <p className="ppi2">
        {labelsBilingual.pg10TabRow2}
        <br />
        <span style={{ paddingLeft: "7em" }}>
          {labelsBilingual.pg10TabRow11}
        </span>
      </p>
      <br />
      <br />
      <p className="ppi2">
        {labelsBilingual.pg10TabRow3}
        <br />
        <span style={{ paddingLeft: "7em" }}>
          {labelsBilingual.pg10TabRow11}
        </span>
      </p>
      <br />
    </div>
  );

  /* add all pages  */
  let pages = [];
  /* cover page */

  // console.log(aboutMeSpecs, includeAboutMe);
  pages.push(pageCover);
  /* AboutMe page if requested */
  {
    aboutMeSpecs !== null && includeAboutMe && pages.push(pageAboutMe);
  }
  {
    /* PAGE 2 profile*/
  }
  if (output.clients.length <= 5) pages.push(pageSummary);
  else {
    pages.push(pageSummary);
    pages.push(pageAssumptions);
  }
  pages.push(pageCashIncomeNeeds);
  pages.push(pageCashIncomeSources);
  pages.push(pageAnalandGraph);
  pages.push(pageNotes);

  let allPages = [];
  let refPage = [];
  let iAboutMe = -1;
  if (aboutMeSpecs !== null && includeAboutMe) iAboutMe = 1;

  for (let i = 0; i < pages.length; i++)
    allPages.push(
      <div
        className="presentationItem page"
        ref={(r) => {
          refPage[i] = r;
        }}
      >
        <OutputPage
          content={pages[i]}
          header={
            i > 0 && !(includeAboutMe && i === 1) && TITLES[lang].appletINA
          }
          footer={
            i === 0 || i === pages.length - 1 || i === iAboutMe
              ? ""
              : OUTPUTTEXT[lang].pgFooter
          }
          logoTop={
            hasLogo && logoOnTop
              ? i === 0
                ? logoFirstPg
                : logoAllPages
                ? logoOnly
                : null
              : null
          }
          logoBottom={
            hasLogo && !logoOnTop
              ? i === 0
                ? logoOnly
                : logoAllPages
                ? logoOnly
                : null
              : null
          }
          firstPageLogoWidth={firstPageLogoWidth}
        />
      </div>
    );

  return { allPages: allPages, refPage: refPage };
}

function get_td(amount, lang) {
  return <td className="textalignright">{formatMoney2(amount, 0, lang)}</td>;
}

export function getEPPages(
  props,
  appletImage,
  aboutMe,
  includeAboutMe,
  aboutMeImageConvertedToBase64,
  stackedChartConvertedToBase64,
  pieEstateLeakageConvertedToBase64,
  pieEstateLeakage2ConvertedToBase64,
  firstPageLogoWidth,
  showGrids,
  graphEstateLeakageDone,
  graphEstateLeakageLEDone,
  graphStackedDone,
  clickMultiButton
) {
  let AssetLiabProjs = getAssetLiabProjections(props);

  const output = getOutputValues(props);
  const styleWithLogo = {
    overflow: "hidden",
    width: "100%",
    overflowX: "auto",
  };
  const styleWithLogoGrids = { width: "100%" };

  const lang = props.dataInput.Presentations[0].language;
  const LE = props.LE;
  const clients = props.dataInput.Clients;
  const labelsBilingual = OUTPUTTEXTEP[lang];

  let loaded = AssetLiabProjs.AssetnEstateLiabs.length > 0 ? true : false;

  //let dataAges = [];

  const startAge =
    clients.length > 1
      ? Math.min(clients[QUOTE_SPOUSE].Age, clients[QUOTE_CLIENT].Age)
      : clients[QUOTE_CLIENT].Age;
  // do to LE+3

  let dataAges = getAgesEP(clients, LE);

  let p2 = 1;
  let p5 = 1;
  let p6 = 1;

  //const { grids, loading } = this.state;
  let totalAssets = 0;
  let totalLiabs = 0;
  if (AssetLiabProjs.projectionsGrids[0] === undefined) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    ); //<div><Loader type="TailSpin" color="black" height={30} width={30} /></div>
  }

  let j = 0;

  const images = getLogoAndAppletImage(
    props.dataInput,
    props.imageRemove,
    props.imageAdjust,
    props.updateImageApplet,
    props.updateImageLogo
  );
  const aboutMeSpecs = props.aboutMe;

  const logoOnTop = images.logoOnTop;
  const logoAllPages = images.logoAllPages;
  const logoOnly = images.logoOnly; // <div style={{float:"left",marginLeft:parseFloat(100*smallLogoAdj+props.dataInput.Presentations[0].adviserLogo.left)  + "%"}}><img className="logo" src={props.dataInput.Presentations[0].adviserLogo.image} /></div>;
  const logoFirstPg = images.logo1stPage1; //<div style={{marginLeft:marginLeft1stPg + "%"}}><img className="logo1st" src={props.dataInput.Presentations[0].adviserLogo.image} /></div>;
  const hasLogo = props.dataInput.Presentations[0].adviserLogo !== null;

  // build simple agg grid:

  const aggGrid = buildSimpleAggregateGridEP(props.aggregateGrid);
  //console.log(aggGrid);

  const ABOUTME_IMAGE = "aboutMeImage";

  // add pages
  const pageCover = (
    <div className="newPage" id="PageCover">
      <div
        className="printOnly"
        style={{
          height:
            props.dataInput.Presentations[0].adviserLogo.image === null
              ? "350px"
              : logoOnTop
              ? "150px"
              : "350px",
        }}
      >
        {" "}
      </div>

      <div style={{ paddingTop: "40px" }}>
        <hr className="ppi1 no-print" />

        <h1 className="ppi1" data-ppi-noneditable>
          {TITLES[lang].appletEP}
        </h1>

        {appletImage === null ? (
          images.appletImageOnly
        ) : (
          <img
            ID={IMAGE_APPLET_EP}
            style={{ maxWidth: "100%", maxHeight: "400px" }}
            src={appletImage}
          />
        )}
      </div>

      <div>
        <h5 className="ppi2">
          {labelsBilingual.pg1P1} {output.designedFor}
          <br />
          {labelsBilingual.pg1P2} {output.designedBy}
          <br />
          {labelsBilingual.pg1P3} {output.dateApplet}
          <br />
          {labelsBilingual.pg1P4} {output.province}
          <br />
        </h5>
      </div>
    </div>
  );

  // about me
  let pageAboutMe;
  if (includeAboutMe) {
    pageAboutMe = (
      <div className="newPage" id="PageAboutMe">
        <hr className="ppi1 no-print" />
        <br />
        <AgentPortfolio
          agentPortfolio={aboutMe}
          mode={"html"}
          imageID={ABOUTME_IMAGE}
          aboutMeImageConvertedToBase64={aboutMeImageConvertedToBase64}
          lang={lang}
        />
        <br />
      </div>
    );
  }

  /* intro page */
  const pageIntro = (
    <div className="newPage" id="Intro">
      <hr className="ppi1 no-print" />
      <div style={styleWithLogo}>
        <div className="outputSectionTitle">{labelsBilingual.pg2T}</div>
        {labelsBilingual.pg2Paragraphs.map((item) => (
          <p className="ppi2" key={p2++}>
            {p2 >= 4 && p2 !== 6 && p2 !== 9 && p2 <= 12 && (
              <span
                style={{
                  paddingLeft: "15px",
                  paddingRight: "5px",
                  color: "#759AC7",
                  fontSize: "18px",
                  whiteSpace: "nowrap",
                }}
              >
                {/*{p2 < 6 ? p2 - 3 : p2 < 9 ? p2 - 4 : p2 - 5}.{" "}*/}
                &#8226;
              </span>
            )}{" "}
            {item}
            <br />
          </p>
        ))}
      </div>
    </div>
  );

  {
    /* PAGE 3 fin situation*/
  }
  const pageFinances = (
    <div className="newPage" id="PageFinances">
      <hr className="ppi1 no-print" />

      <div style={styleWithLogo}>
        <div className="outputSectionTitle">{labelsBilingual.pg3T}</div>
        <p className="ppi2">{labelsBilingual.pg3P1}</p>

        <div style={{ fontSize: "14px" }}>
          <div style={{ paddingLeft: "20px", width: "35%", float: "left" }}>
            <div>
              <table
                className="EP"
                style={{ paddingLeft: "10px", width: "100%" }}
                data-ppi-noneditable>
                <tbody>
                  <tr>
                    <th colSpan="2">{labelsBilingual.pg3TabT}</th>
                  </tr>
                  {/* add assets*/}
                  {output.assets.map((item) => {
                    totalAssets += item.value;
                    return (
                      <tr key={item.name}>
                        <td style={{ width: "65%" }}>
                          {item.name}
                          {item.name === ASSETS.OTHER_ASSETS.value[lang] &&
                          item.value > 0
                            ? " *"
                            : ""}
                        </td>
                        <td
                          className="textalignright"
                          style={{ height: "1px" }}
                        >
                          {formatMoney2(item.value, 0, lang)}
                        </td>
                      </tr>
                    );
                  })}
                  <tr
                    key={"totalAssets"}
                    style={{
                      height: "1px",
                      width: "65%",
                      backgroundColor: "#f0f0f5",
                      textAlign: "right",
                    }}
                  >
                    <td>{labelsBilingual.pg3Tab2RTot}</td>
                    <td className="textalignright" style={{ height: "1px" }}>
                      {formatMoney2(totalAssets, 0, lang)}
                    </td>
                  </tr>
                </tbody>
              </table>
              {output.otherAssetsList !== "" && (
                <p
                  className="ppi2"
                  style={{
                    color: "darkgrey",
                    marginTop: "3px",
                    marginLeft: "-10px",
                    fontSize: "12px",
                    float: "left",
                  }}
                >
                  {output.otherAssetsList}
                </p>
              )}
            </div>
          </div>
          <div style={{ paddingLeft: "23px", width: "38%", float: "left" }}>
            <div>
              <table
                className="EP"
                style={{ paddingLeft: "10px", width: "100%" }}
                data-ppi-noneditable>
                <tbody>
                  <tr>
                    <th colSpan="2">{labelsBilingual.pg3Tab2T}</th>
                  </tr>
                  {/* liabs*/}
                  {output.liabilities.map((item) => {
                    totalLiabs += item.value;
                    return (
                      <tr key={item.name}>
                        <td style={{ width: "60%" }}>{item.name}</td>
                        <td className="textalignright">
                          {formatMoney2(item.value, 0, lang)}
                        </td>
                      </tr>
                    );
                  })}
                  <tr
                    key={"totalLiabs"}
                    style={{
                      height: "1px",
                      width: "65%",
                      backgroundColor: "#f0f0f5",
                      textAlign: "right",
                    }}
                  >
                    <td>{labelsBilingual.pg3Tab2RTot}</td>
                    <td className="textalignright" style={{ height: "1px" }}>
                      {formatMoney2(totalLiabs, 0, lang)}
                    </td>
                  </tr>
                  <tr
                    key={"netWorth"}
                    style={{
                      height: "1px",
                      width: "65%",
                      backgroundColor: "#d1d1e0",
                      textAlign: "right",
                    }}
                  >
                    <td>{labelsBilingual.pg3Tab2NW}</td>
                    <td className="textalignright" style={{ height: "1px" }}>
                      {formatMoney2(totalAssets - totalLiabs, 0, lang)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div style={{ float: "left" }}>
        <h2 className="ppi2">{labelsBilingual.pg3T2}</h2>
        <p className="ppi2">{labelsBilingual.pg3P2}</p>
        <p className="ppi2">{labelsBilingual.pg3P3}</p>
      </div>
      <div
        style={{
          fontFamily: "Georgia, 'Times New Roman', imes, serif",
          fontSize: "14px",
        }}
      >
        <div style={{ paddingLeft: "20px", width: "70%", float: "left" }}>
          <div>
            <table
              className="EP"
              style={{ paddingLeft: "10px", width: "100%" }}
              data-ppi-noneditable
            >
              <tbody>
                <tr>
                  <th style={{ width: "30%" }}>
                    {labelsBilingual.pg3Tab3R1C1}
                  </th>
                  <th style={{ width: "20%" }}>
                    {labelsBilingual.pg3Tab3R1C2}
                  </th>
                  <th style={{ width: "20%" }}>
                    {labelsBilingual.pg3Tab3R1C3}
                  </th>
                  <th style={{ width: "20%" }}>
                    {labelsBilingual.pg3Tab3R1C4}
                  </th>
                </tr>
                <tr>
                  <td>{labelsBilingual.pg3Tab3R2C1}</td>
                  <td className="textalignright">
                    {
                      AssetLiabProjs.EstateLiabsByTypeGrowth[
                        ASSET_TAX_TYPE_REAL_ESTATE
                      ]
                    }
                  </td>
                  {get_td(
                    AssetLiabProjs.EstateLiabsByType[
                      ASSET_TAX_TYPE_REAL_ESTATE
                    ],
                    lang
                  )}

                  {get_td(
                    AssetLiabProjs.EstateLiabsByTypeLE3[
                      ASSET_TAX_TYPE_REAL_ESTATE
                    ],
                    lang
                  )}
                </tr>
                <tr>
                  <td>{labelsBilingual.pg3Tab3R3C1}</td>
                  <td className="textalignright">
                    {
                      AssetLiabProjs.EstateLiabsByTypeGrowth[
                        ASSET_TAX_TYPE_STOCKS
                      ]
                    }
                  </td>
                  {get_td(
                    AssetLiabProjs.EstateLiabsByType[ASSET_TAX_TYPE_STOCKS],
                    lang
                  )}
                  {get_td(
                    AssetLiabProjs.EstateLiabsByTypeLE3[ASSET_TAX_TYPE_STOCKS],
                    lang
                  )}
                </tr>
                <tr>
                  <td>{labelsBilingual.pg3Tab3R4C1}</td>
                  <td className="textalignright">
                    {
                      AssetLiabProjs.EstateLiabsByTypeGrowth[
                        ASSET_TAX_TYPE_SMALL_BUS
                      ]
                    }
                  </td>
                  {get_td(
                    AssetLiabProjs.EstateLiabsByType[ASSET_TAX_TYPE_SMALL_BUS],
                    lang
                  )}
                  {get_td(
                    AssetLiabProjs.EstateLiabsByTypeLE3[
                      ASSET_TAX_TYPE_SMALL_BUS
                    ],
                    lang
                  )}
                </tr>
                <tr>
                  <td>{labelsBilingual.pg3Tab3R5C1}</td>
                  <td className="textalignright">
                    {
                      AssetLiabProjs.EstateLiabsByTypeGrowth[
                        ASSET_TAX_TYPE_RRSP
                      ]
                    }
                  </td>
                  {get_td(
                    AssetLiabProjs.EstateLiabsByType[ASSET_TAX_TYPE_RRSP],
                    lang
                  )}
                  {get_td(
                    AssetLiabProjs.EstateLiabsByTypeLE3[ASSET_TAX_TYPE_RRSP],
                    lang
                  )}
                </tr>
                <tr>
                  <td>{labelsBilingual.pg3Tab3R6C1}</td>
                  <td className="textalignright">
                    {
                      AssetLiabProjs.EstateLiabsByTypeGrowth[
                        ASSET_TAX_TYPE_INTEREST
                      ]
                    }
                  </td>
                  {get_td(
                    AssetLiabProjs.EstateLiabsByType[ASSET_TAX_TYPE_INTEREST],
                    lang
                  )}
                  {get_td(
                    AssetLiabProjs.EstateLiabsByTypeLE3[
                      ASSET_TAX_TYPE_INTEREST
                    ],
                    lang
                  )}
                </tr>
                <tr>
                  <td>{labelsBilingual.pg3Tab3R7C1}</td>
                  <td className="textalignright">
                    {
                      AssetLiabProjs.EstateLiabsByTypeGrowth[
                        ASSET_TAX_TYPE_OTHER
                      ]
                    }
                  </td>

                  {get_td(
                    AssetLiabProjs.EstateLiabsByType[ASSET_TAX_TYPE_OTHER],
                    lang
                  )}
                  {get_td(
                    AssetLiabProjs.EstateLiabsByTypeLE3[ASSET_TAX_TYPE_OTHER],
                    lang
                  )}
                </tr>
                <tr
                  style={{
                    backgroundColor: "#f0f0f5",
                    textAlign: "right",
                  }}
                >
                  <td colSpan="2">{labelsBilingual.pg3Tab3R8C1}</td>
                  {get_td(AssetLiabProjs.EstateLiabsByTypeTotal, lang)}
                  {get_td(AssetLiabProjs.EstateLiabsByTypeLE3Total, lang)}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <p
          className="ppi2"
          style={{
            color: "darkgrey",
            marginTop: "3px",
            fontSize: "12px",
            float: "left",
          }}
        >
          {labelsBilingual.pg3P4}
          <br />
          {labelsBilingual.pg3P5}
        </p>
      </div>
    </div>
  );

  {
    /* PAGE 4 fin Future*/
  }
  const pageFinancesFut = (
    <div className="newPage" id="PageFinancesFut">
      <hr className="ppi1 no-print" />
      <div style={styleWithLogo}>
        <div className="outputSectionTitle"> {labelsBilingual.pg4T}</div>
        <p className="ppi2">{labelsBilingual.pg4P1}</p>
      </div>
      <div style={{ maxWidth: "550px" }} data-ppi-noneditable>
        {loaded === true && (
          <OutputGraphStacked
            language={lang}
            dataAges={dataAges}
            dataAssetnEstateLiabProj={AssetLiabProjs.AssetnEstateLiabs}
            LE={LE}
            useNewPDFMethod={true}
            stackedChartConvertedToBase64={stackedChartConvertedToBase64}
            graphStackedDone={graphStackedDone}
          />
        )}
      </div>
      <div
        className="ppi2"
        style={{
          color: "darkgrey",
          fontSize: "12px",
        }} data-ppi-noneditable
      >
        {labelsBilingual.pg4P2 + LE + ")"}
      </div>
      <p className="EPGreyMsg" data-ppi-noneditable>
        {labelsBilingual.pg4P3
          .replace(
            "G1",
            AssetLiabProjs.EstateLiabsByTypeTotal <
              AssetLiabProjs.EstateLiabsByTypeLE3Total
              ? lang === "en"
                ? "grows"
                : "passe"
              : lang === "en"
              ? "changes"
              : "passe"
          )

          .replace(
            "X1",
            formatMoney2(AssetLiabProjs.EstateLiabsByTypeTotal, 0, lang)
          )
          .replace(
            "X2",
            formatMoney2(AssetLiabProjs.EstateLiabsByTypeLE3Total, 0, lang)
          )}
      </p>
      <p className="ppi2">
        {OUTPUTTEXTEP[lang].graphsLeakageT1} <br />
      </p>
      <div data-ppi-noneditable>
        <OutputGraphsEPLeakage
          insuranceNeed={props.insuranceNeed}
          projectEnd={startAge + LE + 3}
          dataInput={props.dataInput}
          dataNAAges={dataAges}
          probate={props.probate}
          lifeExp={LE}
          lifeExpJLTD={LE}
          lifeExpClient={LE}
          INAOption={props.INAOption}
          LE={props.LE}
          assetProjections={props.assetProjections}
          showLeakageOnly={true}
          useNewPDFMethod={true}
          pieEstateLeakageConvertedToBase64={pieEstateLeakageConvertedToBase64}
          pieEstateLeakage2ConvertedToBase64={
            pieEstateLeakage2ConvertedToBase64
          }
          graphEstateLeakageDone={graphEstateLeakageDone}
          graphEstateLeakageLEDone={graphEstateLeakageLEDone}
        />
      </div>{" "}
    </div>
  );

  {
    /* PAGE 5 Estate Protection Alternatives*/
  }
  const pageEPAlts = (
    <div className="newPage" id="PageEPAlts">
      <hr className="ppi1 no-print" />

      <div style={styleWithLogo}>
        <div className="outputSectionTitle">{labelsBilingual.pg5T}</div>

        {labelsBilingual.pg5Paragraphs.map((item) => (
          <p className="ppi2" key={p5++}>
            {p5 >= 4 && p5 !== 8 && p5 <= 12 && (
              <span style={{ paddingLeft: "15px", color: "#759AC7" }}>
                {p5 < 8 ? p5 - 3 : p5 - 8}.{" "}
              </span>
            )}{" "}
            {item}
            <br />
          </p>
        ))}

        <p className="EPGreyMsg">{labelsBilingual.pg5Plast}</p>
      </div>
    </div>
  );

  {
    /* PAGE 6 Using Life Insurance to Preserve Your Estate*/
  }
  const pageLI = (
    <div className="newPage" id="PageLI">
      <hr className="ppi1 no-print" />

      <div style={styleWithLogo}>
        <div className="outputSectionTitle">{labelsBilingual.pg6T}</div>

        {labelsBilingual.pg6Paragraphs1.map((item) => (
          <p className="ppi2" key={p6++}>
            {p6 >= 4 && p6 <= 6 && (
              <span style={{ paddingLeft: "15px", color: "#759AC7" }}>
                {p6 < 8 ? p6 - 3 : p6 - 8}.{" "}
              </span>
            )}{" "}
            {item}
            <br />
          </p>
        ))}
      </div>
      <div style={styleWithLogo}>
        {/* Summary*/}
        <h2 className="ppi2">{labelsBilingual.pg7T}</h2>
        <p className="ppi2">{labelsBilingual.pg7P1}</p>
      </div>
    </div>
  );

  {
    /* PAGE 7 appendix ledgers*/
  }

  let pageAggGrid = [];

  aggGrid.map((grid, index) => {
    const styleP = index > 0 ? "ppi2  printOnly" : "ppi2";
    pageAggGrid.push(
      <div className="newPage" id={"PageAggGrid".concat(index)}>
        {index === 0 && <hr className="ppi1 no-print" />}

        <div style={styleWithLogoGrids}>
          <h2 className={styleP} >
            {labelsBilingual.pg8T + ": " + labelsBilingual.pg3T}
          </h2>

          <p className={styleP} >{labelsBilingual.pg8P1}</p>
          <p className={styleP+" printOnly"} >{labelsBilingual.pg8PAgg}</p>

          {index === 0 && (
            <div className="ppi2 no-print" style={{ marginLeft: "24px" }}>
              <MultiButtons
                noButtons={2}
                buttonCaption={[labelsBilingual.pg8O1, labelsBilingual.pg8O2]}
                selected={showGrids ? 2 : 1}
                selectMultiButton={clickMultiButton}
              />
            </div>
          )}

          <div>
            {
              <div
                className="printOnly"
                style={{ width: "100%", fontSize: ".8em" }}
              >
                <h4 className="ppi2">{grid.gridTitle}</h4>
                <div className="container"  data-ppi-noneditable>
                  <div className="row">
                    <div className="col s12 board">
                      <table className="INA  INA_EP_Grids" id="simple-board">
                        <thead style={{ backgroundColor: "#384d7b" }}>
                          {grid.colTitles}
                        </thead>
                        <tbody>{grid.rows}</tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    );
  });
  /* const pageAggGrid = (
    <div className="newPage" id="PageAggGrid">
      <hr className="ppi1 no-print" />

      <div style={styleWithLogoGrids}>
        <h2 className="ppi2">{labelsBilingual.pg8T}</h2>

        <p className="ppi2">{labelsBilingual.pg8P1}</p>
        <p className="ppi3">{labelsBilingual.pg8PAgg}</p>

        <div className="ppi2 no-print" style={{ marginLeft: "24px" }}>
          <MultiButtons
            noButtons={2}
            buttonCaption={[labelsBilingual.pg8O1, labelsBilingual.pg8O2]}
            selected={showGrids ? 2 : 1}
            selectMultiButton={clickMultiButton}
          />
        </div>

        <div>
          {
            <div
              className="printOnly"
              style={{ width: "100%", fontSize: ".8em" }}
            >
              <h4 className="ppi2">{aggGrid.gridTitle}</h4>
              <div className="container">
                <div className="row">
                  <div className="col s12 board">
                    <table className="INA  INA_EP_Grids" id="simple-board">
                      <thead  style={{backgroundColor: "#384d7b"}}>{aggGrid.colTitles}</thead>
                      <tbody>{aggGrid.rows}</tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  );
 */

  let pageOtherGrids = [];
  let pageOtherGridsPDF = [];
  let otherGrids = {
    gridsIfSelected: pageOtherGrids,
    gridsPDF: pageOtherGridsPDF,
  };
  {
    AssetLiabProjs.projectionsGrids.map((grid) => {
      //console.log(grid.dataColTitles)

      let rows = [];
      let title = [];
      for (var idx = 0; idx < grid.dataColTitles.length; idx++) {
        let tID = `cell${i}-${idx}`;
        title.push(
          <td key={tID} id={tID}>
            {grid.dataColTitles[idx]}
          </td>
        );
      }

      for (var i = 0; i < grid.dataProjection[0].length; i++) {
        let rowID = `row${i}`;
        let cell = [];
        let upTo = 125;
        if (i > upTo) {
          if (i % 5 === 0) {
            for (var idx = 0; idx < grid.dataColTitles.length; idx++) {
              let cellID = `cell${i}-${idx}`;
              if (i === props.LE && idx === 0)
                cell.push(
                  <td key={cellID} id={cellID}>
                    {grid.dataProjection[idx][i] + "    LE"}
                  </td>
                );
              else
                cell.push(
                  <td key={cellID} id={cellID}>
                    {grid.dataProjection[idx][i]}
                  </td>
                );
            }
          }
        } else {
          for (var idx = 0; idx < grid.dataColTitles.length; idx++) {
            let cellID = `cell${i}-${idx}`;
            const le = i === props.LE && idx === 0 ? ":LE" : "";
            cell.push(
              <td
                key={cellID}
                id={cellID}
                style={{ backgroundColor: i === props.LE && "#d2d6e5" }}
              >
                {grid.dataProjection[idx][i] + le}
              </td>
            );
          }
        }

        const i1 = GRID_BREAK + 1;
        let i2 = 200;
        if (
          props.LE > GRID_BREAK &&
          props.LE < grid.dataProjection[0].length - 2
        )
          i2 = grid.dataProjection[0].length - 3;

        if (
          i === props.LE ||
          i <= GRID_BREAK ||
          i >= grid.dataProjection[0].length - 2
        )
          rows.push(
            <tr key={i} id={rowID}>
              {cell}
            </tr>
          );
        else if (i === i1 || i === i2)
          rows.push(
            <tr
              key={i}
              id={rowID}
              style={{
                backgroundColor: "white",
                borderRight: "hidden",
                borderLeft: "hidden",
              }}
            >
              <td colSpan={grid.dataColTitles.length}>...</td>
            </tr>
          );
      }

      //console.log(title,aggGrid.titles);
      if (showGrids) {
        pageOtherGrids.push(
          <DataTable
            key={j++}
            dataColTitles={grid.dataColTitles}
            dataProjection={grid.dataProjection}
            gridTitle={grid.gridTitle}
            gridIcons={[]}
            specialRow={LE - startAge}
            language={lang}
          />
          /*  <div className="newPage" id={"assets Page".concat(j)}>
            <h4 className="ppi2">{grid.gridTitle}</h4>
            <div className="container">
              <div className="row">
                <div className="col s12 board">
                  <table className="INA INA_EP_Grids" id="simple-board" >
                    <thead  style={{backgroundColor: "red"}}>{title}</thead>
                    <tbody>{rows}</tbody>
                  </table>
                </div>
              </div>
              
            </div>
          </div> */
        );
      }
      pageOtherGridsPDF.push(
        <div className="newPage printOnly"  id={"assets Page".concat(j)}>
          <p className="ppi2">{labelsBilingual.pg8P2}</p>
          <p className="ppi3">{grid.gridTitle}</p>
          <div className="container" data-ppi-noneditable>
            <div className="row">
              <div className="col s12 board">
                <table className="INA  INA_EP_Grids" id="simple-board">
                  <thead style={{ backgroundColor: "#384d7b" }}>{title}</thead>
                  <tbody>{rows}</tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      );

      otherGrids = {
        gridsIfSelected: pageOtherGrids,
        gridsPDF: pageOtherGridsPDF,
      };

      return otherGrids;
    });
  }

  {
    /* PAGE 9 notes*/
  }
  const pageNotes = (
    <div className="newPage" id="PageNotes" data-ppi-noneditable data-ppi-pagelocked>
      <div>
        <hr className="ppi1 no-print" />
        <div style={styleWithLogo}>
          <h2 className="ppi2">{labelsBilingual.pg9T}</h2>

          <p className="ppi2">{labelsBilingual.pg9P1}</p>
          <p className="ppi2">{labelsBilingual.pg9P2}</p>
        </div>{" "}
      </div>
    </div>
  );

  /* add all pages  */
  let pages = [];
  /* cover page */
  let iAppendix = 0;

  pages.push(pageCover);
  /* AboutMe page if requested */
  {
    aboutMeSpecs !== null && includeAboutMe && pages.push(pageAboutMe);
  }

  let iHideLogoStart=0;
  let iHideLogoEnd=0;

  pages.push(pageIntro);
  iAppendix++;
  pages.push(pageFinances);
  iAppendix++;
  pages.push(pageFinancesFut);
  iAppendix++;
  pages.push(pageEPAlts);
  iAppendix++;
  pages.push(pageLI);
  iAppendix++;
  
  
  iHideLogoStart=iAppendix+1
  for (let i = 0; i < pageAggGrid.length; i++) {
    pages.push(pageAggGrid[i]);
  }
  
  for (let i = 0; i < otherGrids.gridsIfSelected.length; i++) {
    pages.push(otherGrids.gridsIfSelected[i]);
  }
  
  for (let i = 0; i < otherGrids.gridsPDF.length; i++) {
    pages.push(otherGrids.gridsPDF[i]);
  }
  iHideLogoEnd=iHideLogoStart+otherGrids.gridsPDF.length+pageAggGrid.length+otherGrids.gridsIfSelected.length-1

  pages.push(pageNotes);

  let allPages = [];
  let refPage = [];
  let iAboutMe = -1;

  let iLandscape = Array(pages.length).fill(0);
  let iHideLogo = Array(pages.length).fill(0);


  let logo;
  let aggPage = 6;
  if (aboutMeSpecs !== null && includeAboutMe) {
    aggPage = 7;
  }
  for (let j = aggPage; j <= aggPage + aggGrid.length - 1; j++)
    iLandscape[j] = 1;

  if (aboutMeSpecs !== null && includeAboutMe) {
    iAboutMe = 1;
  }

  for (let i = 0; i < pages.length; i++) {
    logo=null;
  
    if(hasLogo && logoOnTop) 
  {
    if (i === 0)
     logo=logoFirstPg
    else
    {
      if(logoAllPages && !(i>=iHideLogoStart && i<= iHideLogoEnd))
      {
        console.log(i)
        logo=logoOnly;

      } 
    } 
  }

    
    allPages.push(
      <div
        className="presentationItem page"
        ref={(r) => {
          refPage[i] = r;
        }}
      >
        <OutputPage
          content={pages[i]}
          header={
            ((i > 0 &&
            i <= iAppendix) || i===pages.length-1) &&
            !(includeAboutMe && i === 1) &&
            TITLES[lang].appletEP
          }
          footer={
            i === 0 || i === pages.length - 1 || i === iAboutMe
              ? ""
              : OUTPUTTEXT[lang].pgFooter
          }
          logoTop={logo}
            
          logoBottom={
            hasLogo && !logoOnTop  
              ? i === 0
                ? logoOnly
                : logoAllPages && !(i>=iHideLogoStart && i<= iHideLogoEnd )
                ? logoOnly
                : null
              : null
          }
          orientation={iLandscape[i] === 1 ? "landscape" : "portrait"}
          firstPageLogoWidth={firstPageLogoWidth}
        />
      </div>
    );
  }
  return { allPages: allPages, refPage: refPage, landScapePages: iLandscape };
}
