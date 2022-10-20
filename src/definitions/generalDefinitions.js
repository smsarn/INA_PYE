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

export const OUTPUT_WIDTH_PCT = 97.5;
export const OUTPUT_PADDING_LEFT = 2.5;

export const IMAGE_APPLET_EP = "EPPage1";
export const IMAGE_APPLET_INA = "INAPage1";
export const IMAGE_LOGO = "AdvisorLogo";
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
    ACB: "ACB",
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
    province: "Province",
    designedBy: "Designed By",
    designedFor: "Designed For",
    contributionAmt: "Contribution",
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
    ACB: "PBR",
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
    province: "Province",
    designedBy: "Par",
    designedFor: "Conçu pour",
    contributionAmt: "Contribution",
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
    insured: "être assuré...",
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
    value: { en: "Joint", fr: "Conjoint" },
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
    value: { en: "Joint", fr: "Conjoint" },
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
      fr: "Pension de survivant du gouv.",
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
