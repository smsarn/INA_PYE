import { buildMode } from "../../package.json";
import { appletMode } from "../../package.json";

export const APPLET_INA = appletMode === "INA";
export const APPLET_EP = appletMode === "EP";
export const DISPLAY_NAME = appletMode;
export const DEFAULT_QUOTE = appletMode === "INA" ? "INADefaultData" : "EPDefaultData";
export const DISPLAY_ANALYSIS_ON = false; // not showing now so dont load

export const QUOTE_CLIENT = 0;
export const QUOTE_SPOUSE = 1;
export const QUOTE_JOINT = 2;
export const FIRST_BENEFICIARY_ID = 2; // index is 1 in Clients

export const ALIGN_LEFT = 1;
export const ALIGN_CENTRE = 2;
export const ALIGN_RIGHT = 3;

export const OUTPUT_WIDTH_PCT = 100;
export const OUTPUT_PADDING_LEFT = 2.5;


export const COVER_IMAGE = "CoverImage";
export const IMAGE_APPLET_EP = COVER_IMAGE + "EP";
export const IMAGE_APPLET_INA = COVER_IMAGE + "INA";
export const IMAGE_LOGO = "AdvisorLogo";
export const LOGO_IMAGE_WITH_CTRLS = "imagePackageIDLogo"
export const IMAGE_LOGO_OTHERPAGES = "AdvisorLogoOtherPages";

export const ASSET_PersonalResidence = 0;
export const ASSET_RealEstate = 1;
export const ASSET_Stocks = 2;
export const ASSET_company = 3;
export const ASSET_RRSP = 4;
export const ASSET_Bank = 5;
export const ASSET_Cash = 6;
export const ASSET_Other = 7;
export const ASSET_Insurance = 8;
export const ASSET_TaxCredit = 0;

export const TAX_NonTaxable = 0;
export const TAX_CapGains = 1;
export const TAX_CapGainsAnnual = 2;
export const TAX_RRSP = 3;
export const TAX_Taxable = 4;
export const TAX_Dividend = 5;

export const LIABILITY_LastExpenses = 0;
export const LIABILITY_LegalExecutorFees = 1;
export const LIABILITY_OutstandingLoans = 2;
export const LIABILITY_MortgageRedemption = 3;
export const LIABILITY_EmergencyFund = 4;
export const LIABILITY_CharitableGifts = 5;
export const LIABILITY_LegacyforChildren = 6;
export const LIABILITY_ChildHomeCare = 7;
export const LIABILITY_CreditCards = 8;
export const LIABILITY_IncomeTaxes = 9;
export const LIABILITY_ClientTaxliability = 10;
export const LIABILITY_Other = 11;

export const ASSET_API_OUTPUT_Year = 0;
export const ASSET_API_OUTPUT_Age = 1;
export const ASSET_API_OUTPUT_FMV = 2;
export const ASSET_API_OUTPUT_EOYBalance = 3;
export const ASSET_API_OUTPUT_ACB = 4;
export const ASSET_API_OUTPUT_UCC = 5;
export const ASSET_API_OUTPUT_CCA = 6;
export const ASSET_API_OUTPUT_CapitalGain = 7;
export const ASSET_API_OUTPUT_TaxabaleGain = 8;
export const ASSET_API_OUTPUT_Recapture = 9;
export const ASSET_API_OUTPUT_TaxPayable = 10;
export const ASSET_API_OUTPUT_CapGainsExemption = 11;
export const ASSET_API_OUTPUT_Deposits = 12;
export const ASSET_API_OUTPUT_Withdrawals = 13;
export const ASSET_API_OUTPUT_RRIF = 14;
export const ASSET_API_OUTPUT_TaxPayableonIncome = 15;
export const ASSET_API_OUTPUT_DispositionAmount = 16;

export const LIABILITY_API_OUTPUT_Year = 0;
export const LIABILITY_API_OUTPUT_Age = 1;
export const LIABILITY_API_OUTPUT_ProjectedValue = 2;
export const LIABILITY_API_OUTPUT_TaxCredit = 3;

export const DROPDOWN_WIDE = 1;

export const OWNER_ACTION_CLIENTLIQUIDATE = 0;
export const OWNER_ACTION_CLIENTROLLOVER = 1;
export const OWNER_ACTION_Spouse = 2;
export const OWNER_ACTION_Joint = 3;

export const DEFAULT_DIVIDEND_TAX_RATE = 30;
export const DEFAULT_AVG_TAX_RATE = 25;
export const DEFAULT_CLIENT_AGE = 45;
export const DEFAULT_SPOUSE_AGE = 40;
export const DEFAULT_SPOUSE_SALARY = 60000;
export const DEFAULT_CLIENT_SALARY = 60000;
export const DEFAULT_SPOUSE_CPP = 100;
export const DEFAULT_CLIENT_CPP = 50;
export const DEFAULT_SPOUSE_RETIREMENT = 65;
export const DEFAULT_CLIENT_RETIREMENT = 65;
export const DEFAULT_PROVINCE = "BC";
export const DEFAULT_INFLATION = 2;
export const DEFAULT_INVESTMENT = 3;
export const DEFAULT_NEED_PERCENT1 = 75;
export const DEFAULT_NEED_PERCENT2 = 60;

export const DEFAULT_RRIF_AGE = 71;

export const DISPLAY_RETIREMENT = 0;
export const DISPLAY_LIFEEXP = 1;
export const DISPLAY_ENDAGE = 2;
export const DISPLAY_LIFEEXP_PLUS_3 = 3;

export const ORPHAN_AGE_QC = 17;
export const ORPHAN_AGE_NON_QC = 18;
export const MAX_ORPHAN_DUR_QC = 18;
export const MAX_ORPHAN_DUR_NON_QC = 25;
export const UNIVERSITY_START_AGE = 18;
export const UNIVERSITY_END_AGE = 22;

export const DISPLAY_PRESENTATION = 1;
export const DISPLAY_GRAPHS = 2;
export const DISPLAY_SPREADSHEET = 3;
export const DISPLAY_ANALYSIS = 4;

export const PAGE_HEIGHT = 11;
export const MAX_LOGO_HEIGHT = 0.28;

const API_SITE_PROD = ""; //"https://privateapi.ppi.ca/ToolkitDirect"
const API_SITE_TEST = ""; //"https://test-tkdirectapi.ppi.ca";
const API_SITE_LOCAL = "http://localhost:8082"; // ""; turn this to "" and use proxy server on 3003, first turn on from toolkitDirectProxy Server projet by npm start

export const appSiteAPI =
  buildMode === 0
    ? API_SITE_LOCAL
    : buildMode === 1
    ? API_SITE_TEST
    : API_SITE_PROD;


export const ASSET_YEAR_TODAY = {
  en: {
    today: "today",
  },
  fr: {
    today: "auj.",
  },
};

export const TAXASSETS = {
  en: {
    header: "Tax Treatment",
    Values: [
      /* 'Non-taxable',	
			'Capital Gains Income',	
			'Registered',	
			'Fully Taxable',	
			'RRIF',	
			'Life Insurance',	
			'Dividend'	 */
      "Non-taxable",
      "Capital Gains Deferred",
      "Capital Gains Annual",
      "Registered",
      "Fully Taxable",
      "Dividend",
    ],
  },
  fr: {
    header: "Traitement fiscal",
    Values: [
      "Non imposable",
      "Gains en capital différés",
      "Gains en capital annuels",
      "Enregistré",
      "Pleinement imposable",
      "Dividende",
      /* 'Non imposable',	
			'Revenus de gains en capital',	
			'Enregistré',	
			'Pleinement imposable',	
			'FERR',	
			'Assurance vie',	
			'Dividendes/Participations'	 */
    ],
  },
};

export const CONTROLTITLEASSETS = {
  en: {
    type: "Type",
    owner: "Owner",
    amount: "Current Value",
    tax: "Tax Method",
    disposeYr: "Year to Dispose",
    disposeDur: "Duration of Disposal",
    ACB: "ACB",
    smallBusinessCapGainExemption: "Exemption ...",
    
  },
  fr: {
    type: "Type",
    owner: "Propriétaire",
    amount: "Valeur actuelle",
    tax: "Moyen de taxation",
    disposeYr: "Année d'élimination",
    disposeDur: "Durée de la cession",
    ACB: "PBR",
    smallBusinessCapGainExemption: "Exonération ...",
    
  },
};

export const CONTROLTITLELIABS = {
  en: {
    year: "Year",
    repay: "Repayment",
    projValue: "Projected Value",
  },
  fr: {
    year: "Année",
    repay: "Remboursement",
    projValue: "Valeur projetée",
  },
};






/* export const LIABILITIES = {
  en: {
    header: "Cash Needs at Death",
    Values: [
      "Last Expenses",
      "Legal and Executor Fees",
      "Outstanding Loans",
      "Mortgage Redemption",
      "Emergency Fund",
      "Charitable Gifts",
      "Legacy for Children",
      "Child/Home Care",
      "Credit Cards",
      "Income Taxes",
      "Other",
      "Client Tax liability"
    ]
  },
  fr: {
    header: "Liquidités requises au décès",
    Values: [
      "Derniers frais",
      "Frais juridiques et successoraux",
      "Emprunts à rembourser",
      "Acquittement de l'hypothèque",
      "Fonds d'urgence",
      "Dons de bienfaisance",
      "Héritage pour les enfants",
      "Garde d'enfants/soins à domicile",
      "Cartes de crédit",
      "Impôt sur le revenu",
      "Autre",
      "Impôt à payer par le client"
    ]
  }
}; */

export const INCSOURCESATDEATH = {
  en: {
    options: {
      header: "Options",
      client: "Client Retirement Age",
      spouse: "Spouse Retirement Age",
    },
    CPP: {
      header: "Canada Pension Plan",
      client: "Client Participation",
      spouse: "Spouse Participation",
    },
    survivorRetInc: {
      header: "Estimated Survivor's Retirement Income (in today's dollars)",
      client: "Client Annual Income",
      spouse: "Spouse Annual Income",
    },
  },
  fr: {
    options: {
      header: "Options",
      client: "Âge de la retraite - client",
      spouse: "Âge de la retraite - conjoint",
    },
    CPP: {
      header: "Régime de pensions du Canada",
      client: "Contribution du client",
      spouse: "Contribution du conjoint",
    },
    survivorRetInc: {
      header:
        "Estimation du revenu de retraite du survivant (en dollars d'aujourd'hui)",
      client: "Revenu annuel du client",
      spouse: "Revenu annuel du conjoint",
    },
  },
};

export const PRESENTATION = {
  en: {
    illustrate: {
      header: "Illustrate Death Of",
      client: "Client (New Client)",
      spouse: "Spouse",
      combined: "Combined",
    },
    pres: {
      header: "Presentation",
      assump: {
        header: "Presentation Options",
        inf: "Inflation Rate",
        inv: "Investment Interest Rate",
      },
      type: {
        header: "Presentation Type",
        power: "PowerPoint",
        excel: "Excel",
      },
      lang: {
        header: "Presentation Language",
        en: "English",
        fr: "French",
      },
      template: {
        header: "Presentation Templates - 1 available",
        file: "File Name",
      },
    },
    insQuote: {
      header: "Life Insurance Quote",
      lifeExp: "For survivor's normal life expectancy",
      65: "Until survivor is age 65",
      25: "Until youngest child is age 25",
      18: "Until youngest child is age 18",
    },
  },
  fr: {
    illustrate: {
      header: "Exemple présentant le décès...",
      client: "Client (nouveau client)",
      spouse: "Conjoint",
      combined: "Combiné",
    },
    pres: {
      header: "Présentation",
      assump: {
        header: "Options de la présentation",
        inf: "Taux d'inflation",
        inv: "Taux d'intérêt des placements",
      },
      type: {
        header: "Type de présentation",
        power: "PowerPoint",
        excel: "Excel",
      },
      lang: {
        header: "Langue de la présentation",
        en: "Anglais",
        fr: "Français",
      },
      template: {
        header: "Modèles de présentation - 1 disponible",
        file: "Nom du fichier",
      },
    },
    insQuote: {
      header: "Soumission d'assurance vie",
      lifeExp: "Pour l'espérance de vie moyenne du survivant",
      65: "Jusqu'au 65e anniversaire du survivant",
      25: "Jusqu'au 25e anniversaire de l'enfant le plus jeune",
      18: "Jusqu'au 18e anniversaire de l'enfant le plus jeune",
    },
  },
};

export const ASSUMPTIONS = {
  en: {
    client: {
      header: "Client",
      retAge: "Retirement Age",
      margTax: "Current Marginal Tax Rate",
      avTax: "Average Tax Rate at Retirement",
    },
    spouse: {
      header: "Spouse",
      retAge: "Retirement Age",
      margTax: "Current Marginal Tax Rate",
      avTax: "Average Tax Rate at Retirement",
    },
    incAndInf: {
      header: "Retirement Income and Inflation",
      aftTaxInc: "Current After-Tax Income",
      avTax: "Current Average Tax Rate",
      aftTaxRetInc: "Desired After-Tax Retirement Income",
      infRate: "Inflation Rate",
    },
  },
  fr: {
    client: {
      header: "Client",
      retAge: "Âge de la retraite",
      margTax: "Taux d'imposition marginal actuel",
      avTax: "Taux d'imposition moyen à la retraite",
    },
    spouse: {
      header: "Conjoint",
      retAge: "Âge de la retraite",
      margTax: "Taux d'imposition marginal actuel",
      avTax: "Taux d'imposition moyen à la retraite",
    },
    incAndInf: {
      header: "Revenus de retraite et inflation",
      aftTaxInc: "Revenus actuels après impôts",
      avTax: "Taux d'imposition moyen actuel",
      aftTaxRetInc: "Revenus de retraite souhaités après impôts",
      infRate: "Taux d'inflation",
    },
  },
};

export const CURRENTSAVE = {
  en: {
    client: {
      header: "Client",
      regist: {
        header: "Registered",
        currVal: "Current Value",
        annCont: "Annual Contributions",
        RoR: "Current Rate of Return",
        RoRAtRet: "Assumed Rate of Return at Retirement",
      },
      nonRegist: {
        header: "Non-Registered",
        currVal: "Current Value",
        annCont: "Annual Contributions",
        RoR: "Current Rate of Return",
        RoRAtRet: "Assumed Rate of Return at Retirement",
      },
      TFSA: {
        header: "TFSA",
        currVal: "Current Value",
        annCont: "Annual Contributions",
        RoR: "Current Rate of Return",
        RoRAtRet: "Assumed Rate of Return at Retirement",
      },
    },
    spouse: {
      header: "Spouse",
      regist: {
        header: "Registered",
        currVal: "Current Value",
        annCont: "Annual Contributions",
        RoR: "Current Rate of Return",
        RoRAtRet: "Assumed Rate of Return at Retirement",
      },
      nonRegist: {
        header: "Non-Registered",
        currVal: "Current Value",
        annCont: "Annual Contributions",
        RoR: "Current Rate of Return",
        RoRAtRet: "Assumed Rate of Return at Retirement",
      },
      TFSA: {
        header: "TFSA",
        currVal: "Current Value",
        annCont: "Annual Contributions",
        RoR: "Current Rate of Return",
        RoRAtRet: "Assumed Rate of Return at Retirement",
      },
    },
  },
  fr: {
    client: {
      header: "Client",
      regist: {
        header: "Enregistrée",
        currVal: "Valeur actuelle",
        annCont: "Cotisations annuelles",
        RoR: "Taux de rendement actuel",
        RoRAtRet: "Taux de rendement hypothétique à la retraite",
      },
      nonRegist: {
        header: "Non enregistrée",
        currVal: "Valeur actuelle",
        annCont: "Cotisations annuelles",
        RoR: "Taux de rendement actuel",
        RoRAtRet: "Taux de rendement hypothétique à la retraite",
      },
      TFSA: {
        header: "CELI",
        currVal: "Valeur actuelle",
        annCont: "Cotisations annuelles",
        RoR: "Taux de rendement actuel",
        RoRAtRet: "Taux de rendement hypothétique à la retraite",
      },
    },
    spouse: {
      header: "Spouse",
      regist: {
        header: "Enregistrée",
        currVal: "Valeur actuelle",
        annCont: "Cotisations annuelles",
        RoR: "Taux de rendement actuel",
        RoRAtRet: "Taux de rendement hypothétique à la retraite",
      },
      nonRegist: {
        header: "Non enregistrée",
        currVal: "Valeur actuelle",
        annCont: "Cotisations annuelles",
        RoR: "Taux de rendement actuel",
        RoRAtRet: "Taux de rendement hypothétique à la retraite",
      },
      TFSA: {
        header: "CELI",
        currVal: "Valeur actuelle",
        annCont: "Cotisations annuelles",
        RoR: "Taux de rendement actuel",
        RoRAtRet: "Taux de rendement hypothétique à la retraite",
      },
    },
  },
};

export const PROGGOUV = {
  en: {
    CPP: {
      header: "Canada Pension Plan",
      part: "Client Participation",
      start: "Client Start Age",
      spousePart: "Spouse Participation",
      spouseStart: "Spouse Start Age",
    },
    oldAgeSec: {
      header: "Old Age Security",
      part: "Client Participation",
      start: "Client Start Age",
      spousePart: "Spouse Participation",
      spouseStart: "Spouse Start Age",
    },
  },
  fr: {
    CPP: {
      header: "Régime de pensions du Canada",
      part: "Contribution du client",
      start: "Âge du client au départ",
      spousePart: "Contribution du conjoint",
      spouseStart: "Âge du conjoint au départ",
    },
    oldAgeSec: {
      header: "Sécurité de la vieillesse",
      part: "Contribution du client",
      start: "Âge du client au départ",
      spousePart: "Contribution du conjoint",
      spouseStart: "Âge du conjoint au départ",
    },
  },
};

export const INCSOURCESATRET = {
  en: {
    client: {
      header: "Client",
      from: "From Age",
      to: "To Age",
      inc: "Income Amount",
    },
    spouse: {
      header: "Spouse",
      from: "From Age",
      to: "To Age",
      inc: "Income Amount",
    },
  },
  fr: {
    client: {
      header: "Client",
      from: "de l'âge",
      to: "à l'âge",
      inc: "Montant des revenus",
    },
    spouse: {
      header: "Spouse",
      from: "de l'âge",
      to: "à l'âge",
      inc: "Montant des revenus",
    },
  },
};

export const CONTROLTITLE = {
  en: {
    age: "Age",
    sex: "Sex",
    smoking: "Smoking Status",
    name: "Name",
    member: "Member",
    type: "Type",
    owner: "Owner",
    growthDir: "Grows/Reduces",
    exposureDur: "Exposure Duration",
    changeRate: "Reduction Rate",
    repay: "Annual Repayment",
    amount: "Current Value",
    FA: "Face Amount",
    amountGross: "Gross Value",
    afterTaxAmount: "After-tax Value",
    percent: "Percent",
    tax: "Tax Method",
    desc: "Description",
    disposeYr: "Year to Dispose",
    disposeDur: "Dur. of Disposal",
    startYear: "Start Year",
    dur: "Duration",
    ACB: "Initial ACB",
    smallBusinessCapGainExemption: "Exemption...",
    growth: "Growth Rate",
    income: "Gross Income",
    avgTax: "Avg. Tax Rate",
    retAge: "Retirement Age",
    protectToAge: "Protect to Age",
    cppElig: "CPP Eligibility",
    qppElig: "QPP Eligibility",
    invRate: "Investment Rate",
    inflation: "Inflation Rate",
    taxRate: "Marginal Tax Rate",
    dividendTaxRate: "Dividend Tax Rate",
    taxCreditTaxRate:"Tax Rate",
    taxCreditTaxRate:"Deductible Amount",
    taxRefund:"Tax Refund",
    province: "Province",
    designedBy: "Designed By",
    designedFor: "Designed For",
    contributionAmt: "Contribution",
    contributionAmtSB: "Capital Injection",
    contributionStartYr: "From Year",
    contributionDur: "Duration",
    withdrawalAmt: "Withdrawal",
    withdrawalStartYr: "From Year",
    withdrawalDur: "Duration",
    incomeRate: "Income Rate",
    RRIFRate: "RRIF Growth Rate",
    RRIFAge: "RRIF Age",
    ownershipAction: "Ownership",
    pdf: "Export to PDF",
    pdfINAAppendix: "Export to PDF Appendix",
    print: "Printable Page",
    lifo: "Life Insurance Funding Options",
    wl: "Insurance for Your Whole Life",
    ep: "Protecting Your Estate ",
    ca: "Capital Alternatives ",
    eb: "Creating an Estate Bond ",
    compulife: "Get a Quote ...",
    save: "Save",
    load: "Load",
    rec: "Recover",
    notes: "Notes",
    switch: "Switch Client",
    probateOW: "Overwrite Probate",
    contribsGrow: "Contributions to Assets grow with inflation",
    withdsGrow: "Withdrawals from Assets grow with inflation",
  },
  fr: {
    age: "Âge",
    sex: "Sexe",
    smoking: "Fumeur / non-fumeur",
    name: "Nom",
    member: "Membre",
    type: "Type",
    owner: "Propriétaire",
    growthDir: "Augmente/diminue",
    exposureDur: "Durée de l'exposition",
    changeRate: "Taux de réduction",
    repay: "Remboursement annuel",
    amount: "Valeur actuelle",
    FA: "Capital assuré",
    amountGross: "Valeur brute",
    afterTaxAmount: "Valeur après impôt",
    percent: "Pourcentage",
    tax: "Méthode fiscale",
    desc: "Description",
    disposeYr: "Année à éliminer",
    disposeDur: "Durée de l'élimination",
    startYear: "Année de démarrage",
    dur: "Durée",
    ACB: "PBR initial",
    smallBusinessCapGainExemption: "Exonération...",
    growth: "Taux de croissance",
    income: "Revenu brut",
    avgTax: "% d'impôt moyen",
    retAge: "Âge de la retraite",
    protectToAge: "Protection à l'âge",
    cppElig: "Admissibilité au RPC",
    qppElig: "Admissibilité au RRQ",
    invRate: "Taux de rendement",
    inflation: "Taux d'inflation",
    taxRate: "% d'impôt marginal",
    dividendTaxRate: "Taux d'imposition", // des dividendes",
    taxCreditTaxRate: "% d'impôt",
    taxCreditTaxRate:"montant déductible",
    taxRefund:"remboursement d'impôt",
    province: "Province",
    designedBy: "Par",
    designedFor: "Conçu pour",
    contributionAmt: "Contribution",
    contributionAmtSB: "Injection de capital",
    contributionStartYr: "From Year",
    contributionDur: "Durée",

    withdrawalAmt: "Retrait",
    withdrawalStartYr: "De l'année",
    withdrawalDur: "Durée",

    incomeRate: "Revenu en %",
    RRIFRate: "Taux de crois. FERR",
    RRIFAge: "Âge – FERR",
    ownershipAction: "Propriété",
    pdf: "Exporter en format PDF",
    pdfINAAppendix: "Exporter vers l'annexe PDF",
    print: "Page imprimable",
    lifo: "Modes de financement de l'assurance vie",
    wl: "L'assurance pour votre vie entière",
    ep: "Protection de votre patrimoine",
    ca: "Options de capital ",
    eb: "Création d'un bon successoral ",
    compulife: "Générer une cotation",
    save: "Enregistrer",
    load: "Charger",
    rec: "Récupérer",
    notes: "Notes",
    switch: "Client d'échange",
    probateOW: "Écraser l'homologation",
    contribsGrow: "Les contributions aux actifs augmentent avec l'inflation",
    withdsGrow: "Les retraits de l'actif augmentent avec l'inflation",
  },
};

export const TITLES = {
  en: {
    appletINA: "Insurance Needs Analysis",
    appletEP: "Protecting Your Estate",
    clients: "Family Profile",
    clients_1: "Client Profile",
    assets: "Assets, Sources of Cash",
    liabilities: "Liabilities, Cash Needs at Death",
    sources: "Sources of Income of the Survivor",
    sources_1: "Sources of Income of the Estate",
    needs: "Income Needs of the Survivor",
    needs_1: "Income Needs of the Estate",
    settings: "Presentation Options",
    presentations: "Presentation Details",
    results: "Results",
    presBut: "Presentation",
    graphsBut: "Graphs",
    retBut: "Retirement",
    protectButton: "Protection Period",
    leBut: "Life Expectancy",
    age100But: "Age 100",
    spreadsheetBut: "Spreadsheet",
    analysisBut: "Analysis",
    benef: "beneficiary...",
    insuredJLTD: "insure as JLTD",
    insured: "to be insured...",

    default: "Set as Default",
    defaultClear: "Clear Default",
  },
  fr: {
    appletINA: "Analyse des besoins en matière d'assurance",
    appletEP: "Protection de votre patrimoine",
    clients: "Profil familial",
    clients_1: "Profil du client",
    assets: "Sources de capitaux",
    liabilities: "Liquidités requises au décès",
    sources: "Sources de revenus au décès",
    sources_1: "Sources de revenus de la succession",
    needs: "Besoins de revenu du survivant",
    needs_1: "Besoins de revenu du la succession",
    settings: "Options de la présentation",
    presentations: "Précisions sur la présentation",
    results: "Résultats",
    presBut: "Présentation",
    graphsBut: "Graphique",
    retBut: "Retraite",
    protectButton: "Période de protection",
    leBut: "Espérance de vie",
    age100But: "100 ans",
    spreadsheetBut: "Feuille de calcul",
    analysisBut: "Analyse",
    benef: "bénéficiaire...",
    insured: "assuré...",
    default: "Définir par défaut",
    defaultClear: "Effacer Par défaut",
  },
};

export const UNLISTED = {
  en: {
    Assets: {
      Values: ["Charit. Gifts Tax Credit"],
    },
  },
  fr: {
    Assets: {
      Values: ["Crédit d'impôt pour don de bienfaisance"],
    },
  },
};

export const OUTPUTTITLE = {
  en: {
    Values: [
      "Insurance Needs Analysis",
      "Family Cash Needs at Death",
      "Family Income Needs at Death",
      "Family Cash Sources at Death",
      "Family Income Sources at Death",
      "Life Insurance Analysis",
      "Some Important Notes",
    ],
  },
  fr: {
    Values: [
      "Analyse des besoins en matière d'assurance",
      "Liquidités requises pour la famille au décès",
      "Revenus requis pour la famille au décès",
      "Sources de liquidités de la famille au décès",
      "Sources de revenus de la famille au décès",
      "Analyse des besoins d'assurance vie",
      "Notes importantes",
    ],
  },
};

export const OUTPUTTITLE_EP = {
  en: {
    Values: [
      "Protecting your Estate",
      "Family Cash Needs at Death",
      "Family Income Needs at Death",
      "Family Cash Sources at Death",
      "Family Income Sources at Death",
      "Life Insurance Analysis",
      "Some Important Notes",
    ],
  },
  fr: {
    Values: [
      "Protection de votre patrimoine",
      "Liquidités requises pour la famille au décès",
      "Revenus requis pour la famille au décès",
      "Sources de liquidités de la famille au décès",
      "Sources de revenus de la famille au décès",
      "Analyse des besoins d'assurance vie",
      "Notes importantes",
    ],
  },
};

export const MESSAGES = {
  en: {
    insNeed: "Insurance Needs",
    graphLine2: "To provide for the income shortfall until retirement",
    graphT1: "Personal cash Flow",
    graphT2: "Government cash Flow",
    graphT3: "Income Needs",
    graphT4: "Shortfall(-)/Surplus(+)",
    
    ever: " ... for ever",
    taxMsg: "Tax methods need to be discussed with your financial advisor",
    fetch: "Failed to connect to the server",
    
  },
  fr: {
    insNeed: "Besoins d'assurance",
    graphLine2:
      "Pour couvrir le manque à gagner en matière de revenus jusqu'à la retraite",
    graphT1: "Liquidités personnelles",
    graphT2: "Liquidités versées par l'état",
    graphT3: "Revenus requis",
    graphT4: "Manque à gagner(-)/surplus(+)",
    infoYr0:
      "L'année 0 est l'année d                                                                                     u décès",
    infoRetDur: "Le nombre d'années avant la retraite est de .... ans",
    infoAvgTax:
      "Survivor's tax rate is applied to annual income and interest and annual asset disposition. Marginal tax rate (under Presentaion Details) is applied to planned or potential full disposition of an asset",
    infoAdjust:
      "Ajuster les besoins de revenu et les durées de la source de revenu à dernier âge (99) or l'espérance de vie de",
    clientOnly:
      "L'analyse des besoins est toujours effectuée pour le «client» membre de la famille",
    infoElig:
      "Les prestations du survivant et de l'orphelin sont basées sur l'admissibilité du client",
    ever: " ... pour toujours",
    taxMsg:
      "Les méthodes fiscales doivent être discutées avec votre conseiller financier",
    fetch: "Défaut de connexion au serveur",
    ie:
      "s'il vous plaît utiliser les navigateurs Edge ou Chrome pour les graphiques et les fonctionnalités complètes",
    govB:
      "Ne supprimez pas les prestations gouvernementales. Pour les ajuster, modifier l'admissibilité du client",
    assetTax:
      "Veuillez utiliser les valeurs des actifs après impôt jusqu'à ce que la méthode d'imposition devienne disponibl",
  },
};

export const COLUMN_TITLES = {
  INA_SHEET_HEADERS: {
    en: {
      Full: [
        "Calendar Year",
        "Survivor Age",
        "Income Needs",
        "Survivors' CPP/QPP",
        "Survivors' Income",
        "Other Income",
        "Total Income",
        "Assets, Liabilities Cash Flow",
        "Additional Amounts Required",
        "Additional Capital Required",
        "Capital Fund",
      ],
    },
    fr: {
      Full: [
        "Année calendaire",
        "Âge du survivant",
        "Revenus requis",
        "RPC/RRQ des survivants",
        "Revenu des survivants",
        "Autre revenu",
        "Revenu total",
        "Flux de trésorerie des actifs et des passifs",
        "Montants additionnel requis",
        "Capital additionnel requis",
        "Fonds de capitaux",
      ],
    },
  },
  EP_SHEET_HEADERS: {
    en: {
      Full: [
        "Year",
        "Age",
        "BOY Balance",
        "Fair Market Value",
        "Contributions",
        "Income, RRIF",
        "Sale Proceeds",
        "Tax on Income",
        "Capital Gain",
        "Capital Gains Exemption",
        "EOY Balance",
        "Average Growth",
        "Non-Tax Liabilities",
        "Tax Payable at Death",
      ],
    },
    fr: {
      Full: [
        "Année",
        "Âge",
        "Valeur en début d'année",
        "Juste valeur marchande",
        "Contributions",
        "Revenus, FEER",
        "Produits de la vente",
        "Impôt sur le revenu",
        "Gain en capital",
        "Exonération des gains en capital",
        "Valeur en fin d'année",
        "Croissance moyenne",
        "obligations non fiscales",
        "Impôt payable au décès",
      ],
    },
  },

  en: {
    intRate: "Interest Rate",
    infRate: "Inflation Rate",
    surplusCapital: "Surplus Capital",
    blank: "",
    additionalCapitalReq: "Additional Capital Required:",
    survivorLE: "For survivor's normal life expectancy",
    survivor65: "Until survivor is age 65",
    survivorProtection: "Until the end of Protection Period",
    Year: "Year",
    Age: "Age",
    FMV: "Fair Market Value",
    FA: "Face Amount",
    EOYBalance: "EOY Balance",
    AvgGrowth: "Average Growth",
    ACB: "ACB",
    AnnualContribution: "Annual Contribution",
    MinRRIFIncome: "Min. RRIF Income",
    Withdrawal: "Income, Withdrawal",
    SaleProceeds: "Sale Proceeds",
    RentalIncome: "Rental Income",
    TaxLiability: "Tax Liability",
    Taxonincome: "Tax on income",
    TaxLiabilityatDeath: "Tax Liability at Death",
    CapitalGain: "Capital Gain",
    CapitalGainsExemption: "Capital Gains Exemption",
  },
  fr: {
    intRate: "Taux d'intérêt",
    infRate: "Taux d'inflation",
    surplusCapital: "Capital excédentaire",
    blank: "",
    additionalCapitalReq: "Capital additionnel requis: ",
    survivorLE: "Pour l'espérance de vie moyenne du survivant",
    survivor65: "Jusqu'au 65e anniversaire du survivant",
    survivorProtection: "Jusqu'à la fin de la période de protection",
    Year: "Année",
    Age: "Âge",
    FMV: "Juste valeur marchande",
    FA: "Capital assuré",
    EOYBalance: "Valeur FDA",
    AvgGrowth: "Croissance moyenne",
    ACB: "PBR",
    AnnualContribution: "Cotisations annuelles",
    MinRRIFIncome: "Revenu minimal d'un FERR",
    Withdrawal: "Revenu, retrait",
    SaleProceeds: "Produits de la vente",
    RentalIncome: "Revenus locatifs",
    TaxLiability: "Impôt à payer",
    Taxonincome: "Impôt sur le revenu",
    TaxLiabilityatDeath: "Impôt à payer au décès",
    CapitalGain: "Gain en capital",
    CapitalGainsExemption: "Exonération des gains en capital",    
  },
};

export const GRID_INTERNAL_CAPTIONS = {
  en: {
    excel: "Download Excel",
    rows: "Rows per page",
    of: "of",
  },
  fr: {
    excel: "Télécharger le fichier Excel",
    rows: "Lignes par page",
    of: "lignes 1-5 sur 10",
  },
};

export const TOTALS = {
  ESTATE_LIAB: {
    value: { en: "Estate Liability", fr: "Droits successoraux" },
    Key: "ESTATE_LIAB",
    order: 1,
    colour: "#872651",
  },
  TAX_LIAB: {
    value: { en: "Tax Liability", fr: "Impôt à payer" },
    Key: "TAX_LIAB",
    order: 1,
    colour: "#872651",
  },
};

export const EMAIL = {
  en: {
    body: "The following link opens your quote in Toolkit Direct", //. Once there, click on Insurance Needs Analysis to open up the attached quote.",
  },
  fr: {
    body:
      "Le lien suivant ouvre vos valeurs d'entrée dans Boîte à outils directe",
  },
};

export const LIABILITIES = {
  LAST_EXPENSES: {
    value: { en: "Last Expenses", fr: "Derniers frais" },
    Key: "LAST_EXPENSES",
    order: 2,
    ID: 0,
  },
  LEGAL_AND_EXECUTOR_FEES: {
    value: {
      en: "Legal and Executor Fees",
      fr: "Frais juridiques et successoraux",
    },
    Key: "LEGAL_AND_EXECUTOR_FEES",
    order: 3,
    ID: 1,
  },
  OUTSTANDING_LOANS: {
    value: { en: "Outstanding Loans", fr: "Emprunts à rembourser" },
    Key: "OUTSTANDING_LOANS",
    order: 4,
    ID: 2,
  },
  MORTGAGE_REDEMPTION: {
    value: { en: "Mortgage Redemption", fr: "Acquittement de l'hypothèque" },
    Key: "MORTGAGE_REDEMPTION",
    order: 5,
    ID: 3,
  },
  EMERGENCY_FUND: {
    value: { en: "Emergency Fund", fr: "Fonds d'urgence" },
    Key: "EMERGENCY_FUND",
    order: 6,
    ID: 4,
  },
  CHARITABLE_GIFTS: {
    value: { en: "Charitable Gifts", fr: "Dons de bienfaisance" },
    Key: "CHARITABLE_GIFTS",
    order: 7,
    ID: 5,
  },
  LEGACY_FOR_CHILDREN: {
    value: { en: "Legacy for Children", fr: "Héritage pour les enfants" },
    Key: "LEGACY_FOR_CHILDREN",
    order: 8,
    ID: 6,
  },
  CHILD_HOME_CARE: {
    value: { en: "Child/Home Care", fr: "Garde d'enfants/soins à domicile" },
    Key: "CHILD_HOME_CARE",
    order: 9,
    ID: 7,
  },
  CREDIT_CARDS: {
    value: { en: "Credit Cards", fr: "Cartes de crédit" },
    Key: "CREDIT_CARDS",
    order: 10,
    ID: 8,
  },
  INCOME_TAXES: {
    value: { en: "Income Taxes", fr: "Impôt sur le revenu" },
    Key: "INCOME_TAXES",
    order: 11,
    ID: 9,
  },
  OTHER: { value: { en: "Other", fr: "Autre" }, Key: "OTHER", order: 10 },
  CLIENT_TAX_LIABILITY: {
    value: { en: "Client Tax liability", fr: "Impôt à payer par le client" },
    Key: "CLIENT_TAX_LIABILITY",
    order: 0, // no show
    ID: 10,
  },
  PROBATE: {
    value: { en: "Probate", fr: "Frais d'homologation" },
    Key: "PROBATE",
    order: 1,
    ID: 11,
  },
  
};

export const ASSETS = {
  PERSONAL_RESIDENCE: {
    value: {
      en: "Principal Residence",
      fr: "Résidence principale",
      oldName: "Personal Residence",
    },
    Key: "PERSONAL_RESIDENCE",
    order: 1,
    ID: 0,
    colour: "#9B5BA5",
  },
  REAL_ESTATE: {
    value: { en: "Real Estate", fr: "Immobilier" },
    Key: "REAL_ESTATE",
    order: 2,
    ID: 1,
    colour: "#0093b2",
  },
  STOCKS_BONDS: {
    value: { en: "Stocks & Bonds", fr: "Actions et obligations" },
    Key: "STOCKS_BONDS",
    order: 3,
    ID: 2,
    colour: "#00215b",
  },
  SMALL_BUSINESS_SHARES: {
    value: {
      en: "Small Business Shares",
      fr: "Actions de petites entreprises ",
    },
    Key: "SMALL_BUSINESS_SHARES",
    order: 4,
    ID: 3,
    colour: "#c4dfe0",
  },
  RRSP_RRIF: {
    value: { en: "RRSP/RRIF", fr: "REER/FERR" },
    Key: "RRSP_RRIF",
    order: 5,
    ID: 4,
    colour: "#cf7f00",
  },
  INTEREST_BEARING: {
    value: { en: "Interest Bearing", fr: "Placement à intérêt" },
    Key: "INTEREST_BEARING",
    order: 7,
    ID: 5,
    colour: "#dfd666",
  },
  CASH: {
    value: { en: "Cash", fr: "Liquidités" },
    Key: "CASH",
    order: 8,
    ID: 6,
    colour: "darkred",
  },
  OTHER_ASSETS: {
    value: { en: "Other Assets", fr: "Autres actifs" },
    Key: "OTHER_ASSETS",
    order: 9,
    ID: 7,
    colour: "#949a9e",
  },
  LIFE_INSURANCE: {
    value: { en: "Life Insurance", fr: "Assurance vie" },
    Key: "LIFE_INSURANCE",
    order: 10,
    ID: 8,
    colour: "872651",
  },
  CHARITABLE_GIFTS_TAX_CREDIT: {
    value: {
      en: "Charit. Gifts Tax Credit",
      fr: "Crédit d'impôt pour don de bienfaisance",
    },
    Key: "CHARITABLE_GIFTS_TAX_CREDIT",
    order: 0, // no show,
    ID: 9,
    colour: "872651",
  },
  TFSA: {
    value: {
      en: "TFSA",
      fr: "CELI",
    },
    Key: "TFSA",
    order: 6,
    ID: 10,
    colour: "872651",
  },
};

export const OWNERSHIP = {
  CLIENT: {
    value: { en: "Client", fr: "Client" },
    Key: "CLIENT",
    order: 0,
    ID: 0,
  },
  SPOUSE: {
    value: { en: "Spouse", fr: "Conjoint" },
    Key: "SPOUSE",
    order: 3,
    ID: 1,
  },
  JOINT: {
    value: { en: "Joint", fr: "Conjointement" },
    Key: "JOINT",
    order: 4,
    ID: 2,
  },
};

export const ASSET_OWNERSHIP_ACTION = {
  CLIENT: {
    value: { en: "Client", fr: "Client" },
    Key: "CLIENT",
    order: 0,
    ID: 0,
  },
  SPOUSE: {
    value: { en: "Spouse", fr: "Conjoint" },
    Key: "SPOUSE",
    order: 3,
    ID: 1,
  },
  JOINT: {
    value: { en: "Joint", fr: "Conjointement" },
    Key: "JOINT",
    order: 4,
    ID: 2,
  },
  CLIENT_LIQUIDATE: {
    value: { en: "Client: Liquidate", fr: "Client : Liquider" },
    Key: "CLIENT_LIQUIDATE",
    order: 1,
    ID: 3,
  },
  CLIENT_ROLLOVER: {
    value: { en: "Client: Roll-over", fr: "Client : Report" },
    Key: "CLIENT_ROLLOVER",
    order: 2,
    ID: 4,
  },
};

export const ASSET_TAX = {
  NON_TAXABLE: {
    value: { en: "Non-taxable", fr: "Non imposable" },
    Key: "NON_TAXABLE",
    order: 1,
    ID: 0,
  },
  CAPITAL_GAINS_DEFERRED: {
    value: { en: "Capital Gains Deferred", fr: "Gains en capital différés" },
    Key: "CAPITAL_GAINS_DEFERRED",
    order: 2,
    ID: 1,
  },
  CAPITAL_GAINS_ANNUAL: {
    value: { en: "Capital Gains Annual", fr: "Gains en capital annuels" },
    Key: "CAPITAL_GAINS_ANNUAL",
    order: 3,
    ID: 2,
  },
  REGISTERED: {
    value: { en: "Registered", fr: "Enregistré" },
    Key: "REGISTERED",
    order: 4,
    ID: 3,
  },
  FULLY_TAXABLE: {
    value: { en: "Fully Taxable", fr: "Pleinement imposable" },
    Key: "FULLY_TAXABLE",
    order: 5,
    ID: 4,
  },
  DIVIDEND: {
    value: { en: "Dividend", fr: "Dividende" },
    Key: "DIVIDEND",
    order: 0,
    ID: 5,
  },
  INTEREST: {
    value: { en: "Interest", fr: "Intérêts" },
    Key: "INTEREST",
    order: 6,
    ID: 6,
  },
  QUALIFYING_SMALL_BUSINESS: {
    value: { en: "Qualif. Small Business", fr: "petites entreprises" },
    Key: "QUALIFYING_SMALL_BUSINESS",
    order: 7,
    ID: 7,
  },
};

export const INCOMESOURCES = {
  SURVIVORS_INCOME: {
    value: { en: "Survivor's Income", fr: "Revenus du survivant" },
    Key: "SURVIVORS_INCOME",
    order: 1,
    ID: 0,
  },
  GOV_SURVIVORS_PENSION: {
    value: {
      en: "Gov. Survivor's Pension",
      fr: "Revenu de survivant du gouv.",
    },
    Key: "GOV_SURVIVORS_PENSION",
    order: 2,
    ID: 1,
  },
  GOV_DEATH_BENEFIT: {
    value: { en: "Gov. Death Benefit", fr: "Prestation de décès du gouv." },
    Key: "GOV_DEATH_BENEFIT",
    order: 3,
    ID: 2,
  },
  GOV_ORPHANS_BENEFIT: {
    value: {
      en: "Gov. Orphan's Benefit",
      fr: "Prestation d'orphelin du gouv.",
    },
    Key: "GOV_ORPHANS_BENEFIT",
    order: 4,
    ID: 3,
  },
  RENTAL_INCOME: {
    value: { en: "Rental Income", fr: "Revenus locatifs" },
    Key: "RENTAL_INCOME",
    order: 5,
    ID: 4,
  },
  DIVIDEND_INCOME: {
    value: { en: "Dividend Income", fr: "Revenu de dividendes" },
    Key: "DIVIDEND_INCOME",
    order: 6,
    ID: 5,
  },

  RETIREMENT_INCOME: {
    value: { en: "Retirement Income", fr: "Revenus de retraite" },
    Key: "RETIREMENT_INCOME",
    order: 7,
    ID: 6,
  },
  OTHER: {
    value: { en: "Other", fr: "Autre" },
    Key: "OTHER",
    order: 8,
    ID: 7,
  },
  RRIF: {
    value: { en: "RRIF", fr: "FERR" },
    Key: "RRIF",
    order: 0,
    ID: 8,
  },
  TAX_CREDIT: {
    value: { en: "Tax Savings", fr: "Économies d'impôt" },
    Key: "TAX_CREDIT",
    order: 9,
    ID: 9,
  },
};

export const INCOMENEEDS = {
  PERCET_OF_INCOME: {
    value: { en: "% of Total Income", fr: "% du revenu total" },
    Key: "PERCET_OF_INCOME",
    order: 1,
    ID: 0,
  },

  EDUCATION_FUND: {
    value: { en: "Education Fund", fr: "Fonds d'études" },
    Key: "EDUCATION_FUND",
    order: 2,
    ID: 1,
  },

  TEMPORARY_INCOME: {
    value: { en: "Temporary Income", fr: "Revenus temporaires" },
    Key: "TEMPORARY_INCOME",
    order: 3,
    ID: 2,
  },

  OTHER: {
    value: { en: "Other", fr: "Autre" },
    Key: "OTHER",
    order: 4,
    ID: 3,
  },
};

export const PROVINCE = {
  // 
  // {AB, BC, ON, QC, MB, NS, NB, NF, SK, PE, NT, NU,YU,YT}
  AB: {
    value: { en: "Alberta", fr: "Alberta" },
    Key: "AB",
    order: 1,
    ID: 0,
  },
  BC: {
    value: { en: "British Columbia", fr: "Colombie-Britannique" },
    Key: "BC",
    order: 2,
    ID: 1,
  },
  ON: {
    value: { en: "Ontario", fr: "Ontario" },
    Key: "ON",
    order: 8,
    ID: 2,
  },
  QC: {
    value: { en: "Quebec", fr: "Québec" },
    Key: "QC",
    order: 10,
    ID: 3,
  },
  MB: {
    value: { en: "Manitoba", fr: "Manitoba" },
    Key: "MB",
    order: 3,
    ID: 4,
  },
  NS: {
    value: { en: "Nova Scotia", fr: "Nouvelle-Écosse" },
    Key: "NS",
    order: 6,
    ID: 5,
  },
  NB: {
    value: { en: "New Brunswick", fr: "Nouveau-Brunswick" },
    Key: "NB",
    order: 4,
    ID: 6,
  },
  NF: {
    value: { en: "Newfoundland and Labrador", fr: "Terre-Neuve-et-Labrador" },
    Key: "NF",
    order: 3,
    ID: 7,
  },
  SK: {
    value: { en: "Saskatchewan", fr: "Saskatchewan" },
    Key: "SK",
    order: 11,
    ID: 8,
  },
  PE: {
    value: { en: "Prince Edward Island", fr: "Île-du-Prince-Édouard" },
    Key: "PE",
    order: 9,
    ID: 9,
  },
  YU: {
    value: { en: "Yukon", fr: "Yukon" },
    Key: "YU",
    order: 12,
    ID: 12,
  },
  NU: {
    value: { en: "Nunavut", fr: "Nunavut" },
    Key: "NU",
    order: 7,
    ID: 11,
  },
  NT: {
    value: { en: "Northwest Territories", fr: "Territoires du Nord-Ouest" },
    Key: "NT",
    order: 5,
    ID: 10,
  },
};

export const MEMBER = {
  CLIENT: {
    value: { en: "Client", fr: "Client" },
    Key: "CLIENT",
    order: 1,
    ID: 0,
  },
  SPOUSE: {
    value: { en: "Spouse", fr: "Conjoint" },
    Key: "SPOUSE",
    order: 2,
    ID: 1,
  },
  CHILD: {
    value: { en: "Child", fr: "Enfant" },
    Key: "CHILD",
    order: 3,
    ID: 2,
  },
  DEPENDENT_ADULT: {
    value: { en: "Dependent Adult", fr: "Adulte à charge" },
    Key: "DEPENDENT_ADULT",
    order: 4,
    ID: 3,
  },
};

export const SEX = {
  MALE: {
    value: { en: "Male", fr: "Homme" },
    Key: "MALE",
    order: 1,
    ID: 0,
  },
  FEMALE: {
    value: { en: "Female", fr: "Femme" },
    Key: "FEMALE",
    order: 2,
    ID: 1,
  },
};

export const GROWTHDIR = {
  GROWS: {
    value: { en: "Grows", fr: "Augmente" },
    Key: "GROWS",
    order: 1,
    ID: 0,
  },
  REDUCES: {
    value: { en: "Reduces", fr: "Diminue" },
    Key: "REDUCES",
    order: 2,
    ID: 1,
  },
  /* en: {
    Values: ["Grows", "Reduces"],
  },
  fr: {
    Values: ["Augmente", "Diminue"],
  }, */
};

export const SMOKING = {
  NON_SMOKER: {
    value: { en: "Non-Smoker", fr: "Non-fumeur" },
    Key: "NON_SMOKER",
    order: 1,
    ID: 0,
  },
  SMOKER: {
    value: { en: "Smoker", fr: "Fumeur" },
    Key: "SMOKER",
    order: 2,
    ID: 1,
  },
};

export const MONTHS = {
  en: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  fr: [
    "janvier",
    "février",
    "mars",
    "avril",
    "mai",
    "juin",
    "juillet",
    "août",
    "septembre",
    "octobre",
    "novembre",
    "décembre",
  ],
};


export const COVER_IMAGE_BASE64_INA="data:image/png;base64, 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"

export const COVER_IMAGE_BASE64_EP="data:image/png;base64, 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"

