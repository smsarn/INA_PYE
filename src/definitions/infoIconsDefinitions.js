import React, { Component } from "react";
import { appletMode } from "../../package.json";
import { INCOMENEEDS } from "./generalDefinitions";

const DEFAULT_MARGIN_LEFT = -67;
const DEFAULT_MARGIN_TOP = 0;
const DEFAULT_WIDTH = 140;
const DEFAULT_HEIGHT = 100;

const POPUP_BORDER_INFO = "#7399C6";
const POPUP_BORDER_ALERT = "red";
const POPUP_BORDER_MESSAGE = "#7399C6";

export const SHOW_AUTOMATIC_RED = 0;
export const SHOW_STANDARD = 1;
export const SHOW_STANDARD_RED = 2;
export const SHOW_NONE = 3;
export const SHOW_STANDARD_LIGHT_BLUE = 4;
export const SHOW_STANDARD_WHITE = 5;

const infoHighlightStyle = { color: "#6f2852", fontWeight: "bold" };

const MESSAGES = {
  en: {
    infoYr0: appletMode==="INA"?"Year 0 stands for 'at death': today":"Year 0 stands for 'today'",
    infoRetDur: "Duration to retirement is … years",
    infoAvgTax: (
      <div>
        {" "}
        {/* style={{color:"#54585a"}}> */}
        Survivor's <span style={infoHighlightStyle}>Avg. Tax Rate</span> is
        applied to annual income, interest and annual asset disposition. <br />
        <span style={infoHighlightStyle}>Marginal Tax Rate </span>(under
        Presentation Details) is applied to planned or potential full
        disposition of an asset
      </div>
    ),
    infoIconRetire: (
      <div>
        {" "}
        {/* style={{color:"#54585a"}}> */}
        <span style={infoHighlightStyle}>Income Source</span> and <span style={infoHighlightStyle}>Income Needs</span> durations are usually based on this value.
        <br />They will be adjusted automatically, <br />please recheck.
      </div>
    ),
    infoAdjust:
      "Adjust Income Needs and Income Source durations to end age (99) or Life Expectancy of",
    clientOnly: "Needs Analysis is always done for member 'Client'",
    infoElig: (
      <div>
        {" "}
        Survivor's and orphan's benefits are based on Client's eligibility
        <br />
        Set <span style={infoHighlightStyle}>Province</span> under "Presentation
        Details" for CPP or QPP
      </div>
    ),
    infoEligSinglePerson:
    "for government Death Benefit",
    infoSpouseElig:
      "100% means the Survivor is assumed to be fully eligible for government benefits by the age of 65",
    ever: " ... for ever",
    taxMsg: "Tax methods need to be discussed with your financial advisor",
    fetch: "Failed to connect to the server",
    ie: "Please use Edge or Chrome browsers for graphs and full functionality",
    govB: (
      <div>
        Do not delete government benefits. <br />
        To adjust them, change{" "}
        <span style={infoHighlightStyle}>Client's "CPP/QPP Eligibility"</span>
      </div>
    ),
    assetTax:
      "Please use after tax asset values until Tax Method becomes available",
    internet:
      "You need to login to the PPI site again." +
      "You can save your data before clicking on this message or use " +
      "'Recover' in INA to reload your input data." +
      "Please click to refresh.",

    RRIF:
      "RRIF is reflected in survivor's income based on their own or rolled-over RRSP. Maximum withdrawal age is 71",
    rollOver:
      "Client's assets can usually be rolled-over to their spouse to avoid liquidation",
    insurance:
      "Client's insurance is available to the survivor while Spouse or Joint (JLTD) insurance is not.",
    rental:
      "This is rental income for Real Estate and Dividend income for Stocks. Both as a % of Current Value. Alternatively they can be entered under 'Sources of Income ...'. Such income (after tax) impacts survivors' cash flows and therefore 'Insurance Needs' of the Client",
    note:
      "Pull down on lower bottom to enlarge. A few small paragraphs can be saved (up to 5000 characters)",
    save: (
      <div>
        To save files to your desired location:
        <br />
        <span style={infoHighlightStyle}>Microsoft Edge:</span>
        <li>Go to menu ..., Downloads, Download Settings</li>
        <span style={infoHighlightStyle}>Google Chrome:</span>
        <li>Go to menu ..., Settings, Advanced, Downloads</li>
        <span style={infoHighlightStyle}>then in either browser:</span>
        <li>Turn on "Ask where to save each file before downloading"</li>
      </div>
    ),
    gridCapFund:
      "Capital Fund consists of Additional Capital required (Insurance Needs) less Additional Income Required, accruing at after-tax 'Investment Rate'",
    salary:
      "Gross income, government benefits and other annual income types are assumed to grow at inflation rate",
    salaryPercent:
      "The After-tax value is shown in today's dollars. It will grow at inflation rate",
    afterTax: "All amounts are after tax",
    taxExempt: (
      <div>
        Small Business{" "}
        <span style={infoHighlightStyle}>Capital Gains Tax Exemption</span> is
        assumed to grow at inflation rate
      </div>
    ),
    infoINA:
      "This amount is based on the present value of shortfalls, discounted at the after tax investment rate. It is adjusted if necessary, to make sure early shortfalls are provided for",
      infoBOYEOY: "BOY stands for Beginning of Year and EOY for End of Year",
      infoAvgGrowth:  <div>Average Growth = ( <br/>EOY Balance + Sale Proceeds <br/> - BOY Balance <br/>) / BOY Balance </div>,
      infoPDF:
      "INA Graphs and Spreadsheet can be exported to PDF under 'Graphs' tab",  
      probate:
      appletMode==="INA"?"Probate is based on Client's assets at time of death and does not include Joint assets or assets that belong to, or can be rolled-over to Spouse":
      "Probate is based on Client's assets at time of death. If a Spouse is added, hence JLTD coverage, it will also include Joint assets or assets that belong to, or can be rolled-over to Spouse",  
      TFSA:
      "RRSP and TFSA contributions and withdrawals are subject to limitations set by CRA",  
      DepositWithd:
      "Contributions and Withdrawals affect asset's fair market value and also cash flows. Survivors' cash flows from all sources directly impact 'Insurance Needs' of the Client",  
      inflationGrowth:
      "Gross income, government benefits and other annual income types are assumed to grow at your selected inflation rate",  
      PYE_JLTD:
      "When a Spouse is added, the Estate liability needs to be insured with a JLTD coverage. As such, it includes tax and other liabilities of both at the last death",  
      needGrowth:
      "Income Needs are assumed to grow at your selected inflation rate",
      needGrowth_1:
      "Estate Income Needs are assumed to grow at your selected inflation rate",
      exportINA:
      "Data can be exported to Insurance Needs Analysis, where insurance needs to support survivor(s) life style can be calculated",
      taxLiab:
      "Asset projections take Tax Liability into account. You don't need to enter a separate liability related to taxes such as capital gains",
      liabDesc:
      "You may use this to indicate a permanent/non-permanent liability",
  },
  fr: {
    infoYr0:
    appletMode==="INA"?"L'année 0 est l'année du décès: aujourd'hui":"L'année 0 représente aujourd'hui",
    infoRetDur: "Le nombre d'années avant la retraite est de .... ans",
    infoAvgTax: (
      <div>
        Le taux d'imposition marginal (sous la rubrique « Précisions sur la
        présentation ») s'applique à la disposition planifiée ou potentielle
        complète d'un actif.{" "}
        <span style={infoHighlightStyle}>Le taux d'imposition moyen</span> du
        survivant s'applique au revenu annuel, aux intérêts et à la disposition
        annuelle des actifs.
        <br />
        <span style={infoHighlightStyle}>
          Le taux d'imposition marginal{" "}
        </span>{" "}
        (sous la rubrique « Précisions sur la présentation ») s'applique à la
        disposition planifiée ou potentielle complète d'un actif.
      </div>
    ),
    infoIconRetire: <div>
    {" "}
    {/* style={{color:"#54585a"}}> */}
    Les durées de la <span style={infoHighlightStyle}>source de revenus</span> et des <span style={infoHighlightStyle}>besoins en matière de revenus</span> sont généralement basées sur cette valeur.
        <br />Elles seront rajustées automatiquement, veuillez les vérifier de nouveau.
  </div>,
    
    infoAdjust:
      "Ajuster les besoins de revenu et les durées de la source de revenu à âge à l'échéance (99) or l'espérance de vie de",
    clientOnly:
      "L'analyse des besoins est toujours effectuée pour le «client» membre de la famille",
    infoElig: (
      <div>
        Les prestations du survivant et de l'orphelin sont basées sur
        l'admissibilité du client
        <br />
        Définir{" "}
        <span style={infoHighlightStyle}>la province</span> (RPC ou RRQ) à la
        rubrique 'Précisions sur la présentation'
      </div>
    ),
    infoEligSinglePerson:
    "pour prestation de décès du gouvernment",
    
    infoSpouseElig:
      "100 % signifie que le survivant est supposé être pleinement admissible aux prestations gouvernementales avant l'âge de 65 ans",
    ever: " ... pour toujours",
    taxMsg:
      "Les méthodes fiscales doivent être discutées avec votre conseiller financier",
    fetch: "Défaut de connexion au serveur",
    ie:
      "s'il vous plaît utiliser les navigateurs Edge ou Chrome pour les graphiques et les fonctionnalités complètes",
    govB: (
      <div>
        Ne supprimez pas les prestations gouvernementales. <br />
        Pour les ajuster, modifier{" "}
        <span style={infoHighlightStyle}>l'admissibilité du client</span>
      </div>
    ),
    assetTax:
      "Veuillez utiliser les valeurs des actifs après impôt jusqu'à ce que la méthode d'imposition devienne disponibl",
    internet:
      "  Vous devez vous connecter à nouveau au site PPI." +
      "Vous pouvez enregistrer vos données avant de cliquer sur ce message" +
      "pour recharger vos données d'entrée." +
      "S'il vous plaît cliquez pour rafraîchir.",
    RRIF:
      "Le FERR est pris en compte dans le revenu du survivant sur la base de son propre REER ou d'un REER transféré. L'âge maximal pour retirer des fonds est de 71 ans.",
    rollOver:
      "Les actifs du client peuvent habituellement être transférés au conjoint pour éviter une liquidation.",
    insurance:
      "L'assurance du client est offerte au survivant, alors que l'assurance du conjoint ou l'assurance conjointe (sur deux têtes) ne le sont pas.",
    rental:
      "Il s'agit du revenu de location lié aux biens immobiliers et du revenu de dividende lié aux actions. Il s'agit dans les deux cas d'un pourcentage de la valeur actuelle. Ils peuvent également être saisis dans la rubrique « Sources de revenus… ». Un tel revenu (après impôt) aura un impact sur les flux monétaires des survivants et par conséquent, sur les « besoins en assurance » du client.",
    note:
      "Abaissez le bord inférieur pour agrandir. Quelques petits paragraphes peuvent être enregistrés (jusqu'à 5 000 caractères).",
    save: (
      <div>
        Pour enregistrer les fichiers à l'emplacement voulu :<br />
        <span style={infoHighlightStyle}>Microsoft Edge:</span>
        <li>Aller au menu..., Téléchargements, Paramètres de téléchargement</li>
        <span style={infoHighlightStyle}>Google Chrome:</span>
        <li>
          Aller au menu..., Paramètres, Paramètres avancés, Téléchargements
        </li>
        <span style={infoHighlightStyle}>
          puis dans l'un ou l'autre des navigateurs :
        </span>
        <li>
          Activer la fonction « Me demander quoi faire avec chaque
          téléchargement » ou « Toujours demander où enregistrer les fichiers ».
        </li>
      </div>
    ),
    gridCapFund:
      "Le fonds de capitaux est constitué du capital additionnel requis (besoins d'assurance), diminué du revenu additionnel requis et accru du taux de rendement après impôt.",
    salary:
      "Le revenu brut, les prestations de l'État et les autres types de revenus annuels sont présumés croître au taux d'inflation",
    salaryPercent:
      "La valeur après impôt est indiquée en dollars d'aujourd'hui. Il augmentera au taux d'inflation",
    afterTax: "Tous les montants sont après impôt",
    taxExempt: (
      <div>
        {" "}
        <span style={infoHighlightStyle}>
          Exonération des gains en capital
        </span>{" "}
        pour les petites entreprises est présumée croître au taux d'inflation
      </div>
    ),
    infoINA:
      "Ce montant est basé sur la valeur actualisée des manques à gagner en matière de revenus, actualisée au taux de rendement après impôt. Il est ajusté, si nécessaire, pour s'assurer que des manque à gagner précoces sont prévus",
      infoBOYEOY: "DDA signifie Début d'année et FDA, Fin d'année",
      infoAvgGrowth:  <div>Croissance moyenne = ( <br/>Valeur FDA + Produits de la vente <br/> - Valeur en début d'année <br/>)/Valeur en début d'année </div>,
      infoPDF:
      "Les graphiques et la feuille de calcul de l'analyse des besoins en matière d'assurance peuvent être exportés en format PDF sous l'onglet 'Graphique'",      
      probate:
      appletMode==="INA"?"L'homologation est basée sur les actifs du client au moment du décès et n'inclut pas les actifs communs ou les actifs qui appartiennent au conjoint ou qui peuvent être transférés à celui-ci":
      "L'homologation est basée sur les actifs du client au moment du décès. Si un conjoint est ajouté, donc la couverture CDD (conjointe au dernier décès), elle comprendra également les actifs communs ou les actifs qui appartiennent au conjoint ou qui peuvent lui être transférés",  
   TFSA:
      "Les cotisations et les retraits REER et CELI sont assujettis aux limites établies par l'ARC",  
      DepositWithd:
      "Les cotisations et les retraits affectent la juste valeur marchande des actifs et les flux monétaires. Les flux monétaires des survivants, quelle que soit leur origine, ont un impact direct sur les 'besoins en assurance' du client",  
      inflationGrowth:
      "Le revenu brut, les prestations gouvernementales et les autres types de revenus annuels sont supposés croître au taux d'inflation que vous avez sélectionné",  
      PYE_JLTD:
      "Lorsqu'un conjoint est ajouté, la responsabilité de la succession doit être assurée avec une couverture CDD. En tant que telle, elle comprend les obligations fiscales et les autres dettes des deux conjoints au dernier décès",  
      needGrowth:
      "Les besoins en revenu sont supposés croître au taux d'inflation que vous avez choisi",
      needGrowth_1:
      "Les besoins en revenu de la succession sont supposés croître au taux d'inflation que vous avez choisi",
      exportINA:
      "Les données peuvent être exportées vers l'analyse des besoins en assurance, qui permet de calculer les besoins en assurance pour soutenir le style de vie du ou des survivant(s)",
      taxLiab:
      "Les projections d'actifs prennent en compte le passif fiscal. Vous n'avez pas besoin d'entrer un passif séparé lié aux impôts tel que les gains en capital",
      liabDesc:
      "You may use this to indicate a permanent/non-permanent liability ^F",
  },
};

export function getGenericMessage(lang) {
  return {
    infoID: "infoGenericMsg",
    infoText: "",
    iconMode: SHOW_NONE,
    popupOpenByProps: true,
    popupBorderColor: POPUP_BORDER_ALERT,
    position: {
      marginLeft: DEFAULT_MARGIN_LEFT,
      marginTop: DEFAULT_MARGIN_TOP + 5,
      width: DEFAULT_WIDTH + 30,
      height: DEFAULT_HEIGHT,
    },
  };
}

export function getInfoIconTaxExempt(lang) {
  return {
    infoID: "infoExempt",
    infoText: MESSAGES[lang].taxExempt,
    iconMode: SHOW_STANDARD,
    popupOpenByProps: false,
    popupBorderColor: POPUP_BORDER_INFO,
    position: {
      marginLeft: DEFAULT_MARGIN_LEFT,
      marginTop: DEFAULT_MARGIN_TOP,
      width: DEFAULT_WIDTH + 20,
      height: DEFAULT_HEIGHT,
    },
  };
}

export function getInfoIconSourcesGov(lang) {
  return {
    infoID: "infogov",
    infoText: MESSAGES[lang].govB,
    iconMode: SHOW_STANDARD_RED,
    popupOpenByProps: false,
    popupBorderColor: POPUP_BORDER_ALERT,
    position: {
      marginLeft: DEFAULT_MARGIN_LEFT + 12,
      marginTop: DEFAULT_MARGIN_TOP,
      width: DEFAULT_WIDTH,
      height: DEFAULT_HEIGHT,
    },
  };
}

export function getInfoNoInternetAccess(lang) {
  return {
    infoID: "infoNoInternetAccess",
    infoText: MESSAGES[lang].internet,
    iconMode: SHOW_NONE,
    popupOpenByProps: true,
    popupBorderColor: POPUP_BORDER_ALERT,
    position: {
      marginLeft: DEFAULT_MARGIN_LEFT,
      marginTop: DEFAULT_MARGIN_TOP + 5,
      width: DEFAULT_WIDTH + 80,
      height: DEFAULT_HEIGHT,
    },
  };
}

export function getInfoIconSourcesRRIF(lang) {
  return {
    infoID: "RRIF",
    infoText: MESSAGES[lang].RRIF,
    iconMode: SHOW_STANDARD,
    popupOpenByProps: false,
    popupBorderColor: POPUP_BORDER_INFO,
    position: {
      marginLeft: DEFAULT_MARGIN_LEFT,
      marginTop: DEFAULT_MARGIN_TOP,
      width: DEFAULT_WIDTH,
      height: DEFAULT_HEIGHT,
    },
  };
}

export function getInfoIconClientsMember(lang) {
  return {
    infoID: "infoMember",
    infoText: MESSAGES[lang].clientOnly,
    iconMode: SHOW_STANDARD,
    popupOpenByProps: false,
    popupBorderColor: POPUP_BORDER_INFO,
    position: {
      marginLeft: DEFAULT_MARGIN_LEFT + 12,
      marginTop: DEFAULT_MARGIN_TOP,
      width: DEFAULT_WIDTH,
      height: DEFAULT_HEIGHT,
    },
  };
}

export function getInfoIncome(lang) {
  return {
    infoID: "infosalary",
    infoText: MESSAGES[lang].salary,
    iconMode: SHOW_STANDARD,
    popupOpenByProps: false,
    popupBorderColor: POPUP_BORDER_INFO,
    position: {
      marginLeft: DEFAULT_MARGIN_LEFT + 12,
      marginTop: DEFAULT_MARGIN_TOP,
      width: DEFAULT_WIDTH,
      height: DEFAULT_HEIGHT,
    },
  };
}

export function getInfoSalaryPercent(lang) {
  return {
    infoID: "infoSalaryPercent",
    infoText: MESSAGES[lang].salaryPercent,
    iconMode: SHOW_STANDARD,
    popupOpenByProps: false,
    popupBorderColor: POPUP_BORDER_INFO,
    position: {
      marginLeft: DEFAULT_MARGIN_LEFT,
      marginTop: DEFAULT_MARGIN_TOP,
      width: DEFAULT_WIDTH,
      height: DEFAULT_HEIGHT,
    },
  };
}

export function getInfoIconAssetsIncomeRate(lang) {
  return {
    infoID: "infoIconIncomeRate",
    infoText: MESSAGES[lang].rental,
    iconMode: SHOW_STANDARD,
    popupOpenByProps: false,
    popupBorderColor: POPUP_BORDER_INFO,
    position: {
      marginLeft: DEFAULT_MARGIN_LEFT,
      marginTop: DEFAULT_MARGIN_TOP,
      width: DEFAULT_WIDTH +100,
      height: DEFAULT_HEIGHT,
    },
  };
}

export function getInfoIconPYE_JLTD(lang) {
  return {
    infoID: "infoIconPYE_JLTD",
    infoText: MESSAGES[lang].PYE_JLTD,
    iconMode: SHOW_STANDARD_WHITE,
    popupOpenByProps: false,
    popupBorderColor: POPUP_BORDER_INFO,
    position: {
      marginLeft: DEFAULT_MARGIN_LEFT,
      marginTop: DEFAULT_MARGIN_TOP,
      width: DEFAULT_WIDTH +100,
      height: DEFAULT_HEIGHT,
    },
  };
}


export function getInfoIconNeedGrowth(lang) {
  return {
    infoID: "infoIconNeedGrowth",
    infoText: MESSAGES[lang].needGrowth,
    iconMode: SHOW_STANDARD_WHITE,
    popupOpenByProps: false,
    popupBorderColor: POPUP_BORDER_INFO,
    position: {
      marginLeft: DEFAULT_MARGIN_LEFT,
      marginTop: DEFAULT_MARGIN_TOP,
      width: DEFAULT_WIDTH +100,
      height: DEFAULT_HEIGHT,
    },
  };
}


export function getInfoINA(lang) {
  return {
    infoID: "infoINA",
    infoText: MESSAGES[lang].infoINA,
    iconMode: SHOW_STANDARD,
    popupOpenByProps: false,
    popupBorderColor: POPUP_BORDER_INFO,
    position: {
      marginLeft: DEFAULT_MARGIN_LEFT,
      marginTop: DEFAULT_MARGIN_TOP,
      width: DEFAULT_WIDTH + 50,
      height: DEFAULT_HEIGHT,
    },
  };
}

export function getInfoPDF(lang) {
  return {
    infoID: "infoPDF",
    infoText: MESSAGES[lang].infoPDF,
    iconMode: SHOW_STANDARD,
    popupOpenByProps: false,
    popupBorderColor: POPUP_BORDER_INFO,
    position: {
      marginLeft: DEFAULT_MARGIN_LEFT,
      marginTop: DEFAULT_MARGIN_TOP,
      width: DEFAULT_WIDTH + 30,
      height: DEFAULT_HEIGHT,
    },
  };
}



export function getInfoExportINA(lang) {
  return {
    infoID: "exportINA",
    infoText: MESSAGES[lang].exportINA,
    iconMode: SHOW_STANDARD,
    popupOpenByProps: false,
    popupBorderColor: POPUP_BORDER_INFO,
    position: {
      marginLeft: DEFAULT_MARGIN_LEFT,
      marginTop: DEFAULT_MARGIN_TOP,
      width: DEFAULT_WIDTH + 30,
      height: DEFAULT_HEIGHT,
    },
  };
}

export function getInfoIconAssetsOwner(lang) {
  return {
    infoID: "infoIconOwner",
    infoText: MESSAGES[lang].rollOver,
    iconMode: SHOW_STANDARD,
    popupOpenByProps: false,
    popupBorderColor: POPUP_BORDER_INFO,
    position: {
      marginLeft: DEFAULT_MARGIN_LEFT + 12,
      marginTop: DEFAULT_MARGIN_TOP,
      width: DEFAULT_WIDTH,
      height: DEFAULT_HEIGHT,
    },
  };
}

export function getInfoIconTFSA(lang) {
  return {
    infoID: "infoIconTFSA",
    infoText: MESSAGES[lang].TFSA,
    iconMode: SHOW_STANDARD,
    popupOpenByProps: false,
    popupBorderColor: POPUP_BORDER_INFO,
    position: {
      marginLeft: DEFAULT_MARGIN_LEFT + 20,
      marginTop: DEFAULT_MARGIN_TOP,
      width: DEFAULT_WIDTH,
      height: DEFAULT_HEIGHT,
    },
  };
}

export function getInfoIconProbate(lang) {
  return {
    infoID: "infoIconProbate",
    infoText: MESSAGES[lang].probate,
    iconMode: SHOW_STANDARD,
    popupOpenByProps: false,
    popupBorderColor: POPUP_BORDER_INFO,
    position: {
      marginLeft: DEFAULT_MARGIN_LEFT + 20,
      marginTop: DEFAULT_MARGIN_TOP,
      width: DEFAULT_WIDTH +30,
      height: DEFAULT_HEIGHT,
    },
  };
}



export function getInfoIconLiabDesc(lang) {
  return {
    infoID: "infoIconLiabDesc",
    infoText: MESSAGES[lang].liabDesc,
    iconMode: SHOW_STANDARD,
    popupOpenByProps: false,
    popupBorderColor: POPUP_BORDER_INFO,
    position: {
      marginLeft: DEFAULT_MARGIN_LEFT + 20,
      marginTop: DEFAULT_MARGIN_TOP,
      width: DEFAULT_WIDTH +80,
      height: DEFAULT_HEIGHT,
    },
  };
}

export function getInfoIconDepositWithd(lang) {
  return {
    infoID: "infoIconDepositWithd",
    infoText: MESSAGES[lang].DepositWithd,
    iconMode: SHOW_STANDARD,
    popupOpenByProps: false,
    popupBorderColor: POPUP_BORDER_INFO,
    position: {
      marginLeft: DEFAULT_MARGIN_LEFT + 20,
      marginTop: DEFAULT_MARGIN_TOP,
      width: DEFAULT_WIDTH +50,
      height: DEFAULT_HEIGHT,
    },
  };
}


export function getInfoIconInflationGrowth(lang) {
  return {
    infoID: "infoIconInflationGrowth",
    infoText: MESSAGES[lang].inflationGrowth,
    iconMode: SHOW_STANDARD_WHITE,
    popupOpenByProps: false,
    popupBorderColor: POPUP_BORDER_INFO,
    position: {
      marginLeft: DEFAULT_MARGIN_LEFT + 20,
      marginTop: DEFAULT_MARGIN_TOP,
      width: DEFAULT_WIDTH +50,
      height: DEFAULT_HEIGHT,
    },
  };
}

export function getInfoIconAssetsIns(lang) {
  return {
    infoID: "insurance",
    infoText: MESSAGES[lang].insurance,
    iconMode: SHOW_STANDARD,
    popupOpenByProps: false,
    popupBorderColor: POPUP_BORDER_INFO,
    position: {
      marginLeft: DEFAULT_MARGIN_LEFT + 30,
      marginTop: DEFAULT_MARGIN_TOP,
      width: DEFAULT_WIDTH,
      height: DEFAULT_HEIGHT,
    },
  };
}

export function getInfoIconAssetsYr0(lang) {
  return {
    infoID: "infoIconYr0",
    infoText: MESSAGES[lang].infoYr0,
    iconMode: SHOW_STANDARD,
    popupOpenByProps: false,
    popupBorderColor: POPUP_BORDER_INFO,
    position: {
      marginLeft: DEFAULT_MARGIN_LEFT + 12,
      marginTop: DEFAULT_MARGIN_TOP,
      width: DEFAULT_WIDTH,
      height: DEFAULT_HEIGHT,
    },
  };
}

export function getInfoIconClientsElig(lang) {
  return {
    infoID: "infoIconElig",
    infoText: MESSAGES[lang].infoElig,
    iconMode: SHOW_STANDARD,
    popupOpenByProps: false,
    popupBorderColor: POPUP_BORDER_INFO,
    position: {
      marginLeft: DEFAULT_MARGIN_LEFT + 6,
      marginTop: DEFAULT_MARGIN_TOP,
      width: DEFAULT_WIDTH + 25,
      height: DEFAULT_HEIGHT,
    },
  };
}

export function getInfoIconClientsEligSinglePerson(lang) {
  return {
    infoID: "infoIconEligSP",
    infoText: MESSAGES[lang].infoEligSinglePerson,
    iconMode: SHOW_STANDARD,
    popupOpenByProps: false,
    popupBorderColor: POPUP_BORDER_INFO,
    position: {
      marginLeft: DEFAULT_MARGIN_LEFT + 6,
      marginTop: DEFAULT_MARGIN_TOP,
      width: DEFAULT_WIDTH + 25,
      height: DEFAULT_HEIGHT,
    },
  };
}

export function getInfoIconSpouseElig(lang) {
  return {
    infoID: "infoIconSpouseElig",
    infoText: MESSAGES[lang].infoSpouseElig,
    iconMode: SHOW_STANDARD,
    popupOpenByProps: false,
    popupBorderColor: POPUP_BORDER_INFO,
    position: {
      marginLeft: DEFAULT_MARGIN_LEFT + 6,
      marginTop: DEFAULT_MARGIN_TOP,
      width: DEFAULT_WIDTH + 25,
      height: DEFAULT_HEIGHT,
    },
  };
}

export function getInfoIconClientsTax(lang) {
  return {
    infoID: "infoIconAvgTax",
    infoText: MESSAGES[lang].infoAvgTax,
    iconMode: SHOW_STANDARD,
    popupOpenByProps: false,
    popupBorderColor: POPUP_BORDER_INFO,
    position: {
      marginLeft: DEFAULT_MARGIN_LEFT - 20,
      marginTop: DEFAULT_MARGIN_TOP,
      width: DEFAULT_WIDTH + 70,
      height: DEFAULT_HEIGHT,
    },
  };
}



export function getInfoIconClientsRetire(lang,flagRed) {
  return {
    infoID: "infoIconRetire",
    infoText: MESSAGES[lang].infoIconRetire,
    iconMode: flagRed?SHOW_STANDARD_RED:SHOW_STANDARD,
    popupOpenByProps: false,
    popupBorderColor: POPUP_BORDER_INFO,
    position: {
      marginLeft: DEFAULT_MARGIN_LEFT - 20,
      marginTop: DEFAULT_MARGIN_TOP,
      width: DEFAULT_WIDTH + 45,
      height: DEFAULT_HEIGHT,
    },
  };
}

export function getInfoTaxLiability(lang) {
  return {
    infoID: "infoIconAvgTax",
    infoText: MESSAGES[lang].infoAvgTax,
    iconMode: SHOW_STANDARD_LIGHT_BLUE,
    popupOpenByProps: false,
    popupBorderColor: POPUP_BORDER_INFO,
    position: {
      marginLeft: DEFAULT_MARGIN_LEFT - 88,
      marginTop: DEFAULT_MARGIN_TOP,
      width: DEFAULT_WIDTH + 70,
      height: DEFAULT_HEIGHT,
    },
  };
}

export function getInfoIconTaxLiab(lang) {
  return {
    infoID: "infoIcontaxLiab",
    infoText: MESSAGES[lang].taxLiab,
    iconMode: SHOW_STANDARD,
    popupOpenByProps: false,
    popupBorderColor: POPUP_BORDER_INFO,
    position: {
      marginLeft: DEFAULT_MARGIN_LEFT - 20,
      marginTop: DEFAULT_MARGIN_TOP,
      width: DEFAULT_WIDTH + 70,
      height: DEFAULT_HEIGHT,
    },
  };
}
export function getInfoBOYEOY(lang) {
  return {
    infoID: "infoBOYEOY",
    infoText: MESSAGES[lang].infoBOYEOY,
    iconMode: SHOW_STANDARD_LIGHT_BLUE,
    popupOpenByProps: false,
    popupBorderColor: POPUP_BORDER_INFO,
    position: {
      marginLeft: DEFAULT_MARGIN_LEFT - 70,
      marginTop: DEFAULT_MARGIN_TOP+45,
      width: DEFAULT_WIDTH + 35,
      height: DEFAULT_HEIGHT,
    },
  };
}

export function getInfoAvgGrowth(lang) {
  return {
    infoID: "infoAvgGrowth",
    infoText: MESSAGES[lang].infoAvgGrowth,
    iconMode: SHOW_STANDARD_LIGHT_BLUE,
    popupOpenByProps: false,
    popupBorderColor: POPUP_BORDER_INFO,
    position: {
      marginLeft: DEFAULT_MARGIN_LEFT - 70,
      marginTop: DEFAULT_MARGIN_TOP+45,
      width: DEFAULT_WIDTH + 70,
      height: DEFAULT_HEIGHT,
    },
  };
}

export function getInfoIconNotes(lang) {
  return {
    infoID: "InfoIconNotes",
    infoText: MESSAGES[lang].note,
    iconMode: SHOW_STANDARD,
    popupOpenByProps: false,
    popupBorderColor: POPUP_BORDER_INFO,
    position: {
      marginLeft: DEFAULT_MARGIN_LEFT + 20,
      marginTop: DEFAULT_MARGIN_TOP,
      width: DEFAULT_WIDTH + 70,
      height: DEFAULT_HEIGHT,
    },
  };
}

export function getInfoSave(lang) {
  return {
    infoID: "InfoSave",
    infoText: MESSAGES[lang].save,
    iconMode: SHOW_STANDARD,
    popupOpenByProps: false,
    popupBorderColor: POPUP_BORDER_INFO,
    position: {
      marginLeft: DEFAULT_MARGIN_LEFT + 105,
      marginTop: DEFAULT_MARGIN_TOP - 172,
      width: DEFAULT_WIDTH + 225,
      height: DEFAULT_HEIGHT - 280,
    },
  };
}

export function getInfoExcelcapFund(lang) {
  return {
    infoID: "InfoExcelcapFun",
    infoText: MESSAGES[lang].gridCapFund,
    iconMode: SHOW_STANDARD_LIGHT_BLUE,
    popupOpenByProps: false,
    popupBorderColor: POPUP_BORDER_INFO,
    position: {
      marginLeft: DEFAULT_MARGIN_LEFT - 88,
      marginTop: DEFAULT_MARGIN_TOP+35,
      width: DEFAULT_WIDTH + 110,
      height: DEFAULT_HEIGHT,
    },
  };
}

export function getInfoExcelAllAfterTax(lang) {
  return {
    infoID: "InfoATax",
    infoText: MESSAGES[lang].afterTax,
    iconMode: SHOW_STANDARD_LIGHT_BLUE,
    popupOpenByProps: false,
    popupBorderColor: POPUP_BORDER_INFO,
    position: {
      marginLeft: DEFAULT_MARGIN_LEFT + 30,
      marginTop: DEFAULT_MARGIN_TOP+45,
      width: DEFAULT_WIDTH + 20,
      height: DEFAULT_HEIGHT,
    },
  };
}
