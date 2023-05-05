import React from "react";
export const OUTPUTTEXT = {
  en: {
    insNeeds100: "Insurance Needs to age 100",
    insNeedsRet: "Insurance Needs to retirement (age ",
    insNeedsRetLE: "Insurance Needs to life expectancy (age ",
    insNeedsSingleFamily: "Insurance Needs for a Single Parent with Protection Period of ",
    insNeedsSinglePerson: "Insurance Needs for a Single Person with Protection Period of ",
    
    years: " years",
    addSurvivor: "Survivors need to be added under Family Profile. Single Person 'Insurance Needs' is coming soon!",
    pg1T: "Insurance Needs Analysis - Estate",
    pg1T_1: "Summary",
    pg1P1: "Designed for: ",
    pg1P2: "Designed by: ",
    pg1P3: "Date: ",
    pg1P4: "Province: ",
    pg2TabT1: "Family Profile",
    pg2TabT1_1: "Profile",
    pg2TabT2: "Age",
    pg2TabT3: "Annual Income",
    pg2TabT4: "Retirement Age",
    pg2TabT4Alt: "Protection Period",
    pg2TabT5: "Avg. Tax Rate",
    pg2TabT6: "Marginal Tax Rate",
    pg2T2: "Assumptions",
    /* pg3T: "Family Cash Needs at Death", */
    pg2Tab2: "Needs Analysis is always done for the family member 'Client'",
    pg2Tab2_1: "Needs Analysis is always done for 'Client'",
    pg2Tab3: "Using these factors the total capital required to generate an inflation indexed income thus depleting all capital at the end of the desired insurance time period is calculated. This amount is based on the present value of shortfalls, discounted at the after tax investment rate. It is adjusted, if necessary to make sure early shortfalls are provided for.",
    pg2T3: "Financial Summary",
    pg2T4: "Insurance Analysis",
    pg2T5: "Insurance Analysis for your Spouse",
    pg2P5:"Total Assets (excluding insurance)",
    pg2P6: "Total Liabilities (excluding death related)",//OUTPUTTEXT[lang].pg7TabRow4,
    pg2P7: "Net Worth",//OUTPUTTEXT[lang].pg7TabRow4,
    pg2P8: "Total insurance available at death, yyy of which is taxable",//OUTPUTTEXT[lang].pg7TabRow4, //  + output.govDB already part of totalassets
    pg2P9: "Total death related liabilities",
    pg2P10: "Additional Insurance for Client",
    pg2P101:"insured years",
    pg2P102:"insurance",
    pg2P103: "No Insurance: How long does cashing all assets last?",
    pg2P104: "Existing insurance + Government death benefit",
    pg2P12: "This is a good opportunity to consider additional insurance for your spouse as well",
    pg2P11: "Additional Insurance for Spouse NAME:",
    
    pg3T: "Family Cash and Income Needs",
    pg3T_1: "Estate Cash and Income Needs",
    pg3P1:
      "When you die, your family will face two important money needs, a need for Cash and a need for Income. While some cash needs are temporary, others are required at all stages of life.",
    pg3P1_1:
      "When you die, your Estate will face two important money needs, a need for Cash and a need for Income. While some cash needs are temporary, others are required at all stages of life.",
    pg3TabT: "Cash Needs",
    pg3TabT2: "Description",
    pg3TabT3: "Amount",
    pg3TabRTot: "Total",
    /* pg4T: "Family Income Needs", */
    pg4T: "",
    /* pg4P1: "When you die, your family will face two important money needs, a need for Cash and a need for Income.", */
    pg4P1: "Continued ...",
    pg4TabT: "Income Needs",
    pg4TabRow1: "Current Total Annual Family Income",
    pg4TabRow1_1: "Current Total Annual Income",
    pg4TabRow2:
      "Percentage of this income you want your family to have to maintain your present standard of living for these time periods is:",
    pg4TabRow2_1:
      "Percentage of this income you want your Estate to have for these time periods is:",
    pg4TabRow3: "While more income is required",
    pg4TabRow4: "For survivor thereafter",
    pg4TabRow5: "Therefore your desired after-tax income is:",
    pgTabRowMoreIncome: "While more income is required",
    pgTabRowThereAfter: "For the survivor thereafter",
    pgTabRowThereAfter_1: "For the Estate thereafter",
    //pgTabRowThereAfter: "For the survivor thereafter",
    pg5T: "Family Cash Sources",// at Death",
    pg5T_1: "Estate Cash Sources",// at Death",
    pg5T_2: "Family Cash and Income Sources",// at Death",
    pg5T_1_2: "Estate Cash and Income Sources",// at Death",
    pg5TabT: "Cash Sources",
    pg5TabT2: "All", 
    pg5TabT3: "At Death",
    pg5TabRow1: "CPP/QPP Death Benefit",
    pg5TabRow3: "Total Cash Available",
    pg5TabRow4: "Less Family Cash needs at Death",
    pg5TabRow4_1: "Less Estate Cash needs at Death",
    pg5TabRow5:
      "Surplus Cash available to produce income for surviving members of the family",
    pg5TabRow5_1:
      "Surplus Cash available to produce income for the Estate",
    pg6T: "Family Income Sources",// at Death",
    pg6T_1: "Estate Income Sources",// at Death",
    pg6TabT: "Income Sources",
    pg6TabRow1:
      "Therefore the total annual income available for this time period is:",
    pg6TabRow2: "While more income is required",
    //pg6TabRow3: "For survivor thereafter",
    pg5TabRow7: "For surviving members of the family",
    pg5TabRow7_1: "For the Estate",
    pg6TabRow4:
      "The additional after tax income required (desired income less income available) for this time period is:",
    //pg6TabRow5: "While more income is required",
    //pg6TabRow6: "For survivor thereafter",
    pg6Net: "net ",
    pg7T: "Life Insurance Analysis",
    pg7TabT: "Your Family Income Position at Death",
    pg7TabT_1: "Your Estate Income Position at your Death",
    pg7TabRow1:
      "The additional  after tax income required (desired income less income available) for this time period is:",
    //pg7TabRow2: "While more income is required",
    //pg7TabRow3: "For survivor thereafter",
    pg7TabRow4: "Rate of inflation you think will continue",
    pg7TabRow5:
      "Rate of interest the survivor could earn on investments in future years",
    pg7TabRow5_1:
      "Rate of interest the Estate could earn on investments in future years",
    pg7TabRow6:
      "Using these factors the total capital required to generate an inflation indexed income thus depleting all capital at the end of this time period is:",
    pg7TabRow7: "A. For survivor's normal life expectancy (age ",
    pg7TabRow8: "B. Until survivor retirement",
    pg7TabRow9: "C. Until youngest child is age 25",
    pg7TabRow10: "D. Until youngest child is age 18",
    pg8T: "Life Insurance Analysis",
    pg8TabT: "Your Family Financial Position at Death",
    pg8TabT_1: "Your Estate's Financial Position at Death",
    pg8TabRow1:
      "Present surplus capital available for investment after covering cash needs is:",
    pg8TabRow2:
      "Therefore the additional  income-producing capital (i.e. Life Insurance) needed to solve the income requirement for these time periods is:",
    pg8TabRow3: "A. For survivor's normal life expectancy (age ",
    pg8TabRow4: "B. Until survivor retirement",
    pg8TabRow5: "C. Until youngest child is age 25",
    pg8TabRow6: "D. Until youngest child is age 18",
    pg8TabRow4Alt: "A. Until end of Protection Period",
    pg9T: "Some Important Notes",
    pg9P1:
      "This presentation is for general information purposes. The information contained in this presentation must not be taken or relied upon by the reader as legal, accounting, taxation or actuarial advice. For these matters readers should seek independent professional advice. Please refer to insurance company illustrations, policy contracts and information folders regarding any insurance matters referred to in this presentation, as those documents will govern in all cases.",
    //pgFooter: "See Some Important Notes at the end of this presentation.",
    pgFooter: "See Some Important Notes at the end of this presentation.",
    pg10T: "Acknowledgments",
    pg10P1:
      "I, ____________________________ acknowledge receipt of this Presentation and any quotes related to the information therein, and confirm my understanding of it as a summary and general overview of the illustrated benefits and values. I understand that the aforementioned illustrated benefits and values are neither estimates nor guarantees of future performance; and that actual results may vary based on timing, market performance, health and insurability. These values are subject to change and may differ from those illustrated.",
    pg10TabRow1: "Signature of Client(s): ____________________",
    pg10TabRow11: "Date: ___________",
    pg10TabRow2: "Signature of Client(s): ____________________",
    pg10TabRow3: "Signature of Advisor: ____________________",
    pgAppendix: "Appendix",
    pgAppendixT:
      "INA Graphs and Spreadsheet",
      pgAppendixP1: "Incoming cash flows (+) vs outgoing income needs (-)",
      pgAppendixP2: "Shortfall = incoming - outgoing cash flows and is funded by insurance",
      pgAppendixP3 : "Current financial situation",
      INASummaryTableC11:"Insurance Needs",
      INASummaryTableC12:"To Retirement",
      INASummaryTableC13:"To Life Expectancy",
      INASummaryTableC14:"To Age 100",
      INASummaryTableC15:"No Insurance: Cash All Assets",
      INASummaryTableC16:"Smart Choice:",
      INASummaryTableC21:"to cover Survivors' Life Style:",
      INASummaryTableC26Closed: (
        <span> Type of insurance based on <b><i>Shortfall</i></b> ... </span>)  ,
      INASummaryTableC26Open: (
        <span> Graph of <b><i>Shortfall</i></b> can be helpful in mapping out the type of insurance that covers shortfalls: Term, if needs are temporary, Permanent, if needs are long term, and Permanent with Term riders if both.  </span>),
        INASummaryTableC31:"Number of coverage years:",
      
        INASummaryTableC36Closed: (
        <span> Advantages of insurance over cashing all Assets ...</span> ) ,
        INASummaryTableC35:"  ... with no insurance if all Assets had to be cashed today",
        INASummaryTableC36Open: (
          <ul><li> Assets continue to work for survivors efficiently</li>
          <li>Probate is reduced or postponed</li>
          <li>            
          Adding insurance coverage to existing assets provides the flexibility to cover survivor needs for as long as necessary.
          </li></ul>
        ),
        
      exportData: "Export Data to:",
      toolCustomizeTitle:"Customize/Generate PDF"    ,
      toolCustomizeCover: "Replace Cover Image",
      toolCustomizeCoverRestore: "Restore Default Cover Image",
      toolCustomizeIncludeAboutMe: "Include \"About Me\" Page?",
      toolCustomizeAboutAdd: 'Add "About Me"',
      toolCustomizeAboutRefresh: "Refresh \"About Me\"",
      toolCustomizeAboutEdit: "Edit \"About Me\"",
      toolCustomizeAboutRefreshMsg:"To view the latest information, please click the  Refresh \"About Me\"  button in the Results section." ,
      toolCustomizeAdv: "Advanced Customization",
      toolCustomizeLogo:"Add/Edit logo",
      customizeAlert:"This client presentation has been designed to comply with industry regulations and includes a page with Some Important Notes for your protection. Responsibility for use of this document, whether or not it is edited, is solely yours.",
      customizeAlertTitle:"Customize Presentation",
      taxSavingToEP:"INA cases that include “Tax Savings” as a source of income cannot be exported to Protecting Your Estate until the next software update"
                
                        
      
  },
  fr: {
    insNeeds100: "Besoins en assurance jusqu'à l'âge de 100 ans",
    insNeedsRet: "Besoins en assurance jusqu'à la retraite(âge ",
    insNeedsRetLE: "Besoins en assurance jusqu'à l'espérance de vie (âge ",
    insNeedsSingleFamily: "Besoins d'assurance pour un parent isolé avec une période de protection de ",
    insNeedsSinglePerson: "Besoins d'assurance pour un seul individu avec une période de protection de ",
    years: " années",
    addSurvivor: "Les survivants doivent être ajoutés dans le profil familial. Besoins d'assurance pour un seul individu arrive bientôt!",
    pg1T: "Analyse des besoins en matière d'assurance - successorale",
    pg1T_1: "Résumé",
    pg1P1: "Conçu pour : ",
    pg1P2: "Par: ",
    pg1P3: "Date: ",
    pg1P4: "Province: ",
    pg2TabT1: "Profil familial",
    pg2TabT1_1: "Profil",
    pg2TabT2: "Àge",
    pg2TabT3: "Revenu annuel",
    pg2TabT4: "Àge de la retraite",
    pg2TabT4Alt: "Période de protection",
    pg2T2: "Hypothèses",
    pg2Tab2: "L'analyse des besoins est toujours faite pour le membre de la famille 'Client'",
    pg2Tab2_1: "L'analyse des besoins est toujours faite pour le 'Client'",
    pg2Tab3: "Ces facteurs permettent de calculer le capital total nécessaire pour générer un revenu indexé à l'inflation, le capital étant donc complètement épuisé à la fin de la période d'assurance souhaitée. Ce montant est basé sur la valeur actuelle des manques à gagner, actualisée au taux de rendement après impôt. Il est rajusté au besoin, afin que l'on puisse s'assurer que les manques à gagner initiaux sont prévus pour.",
    
    pg2TabT5: "Taux d'imposition moyen",
    pg2TabT6: "Taux marginal d'imposition",
   /*  pg3T: "Besoin de liquidités pour la famille au décès", */
    pg2T3: "Résumé financier ",
    pg2T4: "Analyse des assurances",
    pg2T5: "Analyse de l’assurance pour votre conjoint",
    
    pg2P5:"Total des actifs (hors assurance)",
    pg2P6: "Total des passifs (non liés au décès)",//OUTPUTTEXT[lang].pg7TabRow4,
    pg2P7: "Valeur nette",//OUTPUTTEXT[lang].pg7TabRow4,
    pg2P8: "Assurance totale disponible au décès, dont yyy imposables",//OUTPUTTEXT[lang].pg7TabRow4, //  + output.govDB already part of totalassets
    pg2P9: "Total des passifs liés au décès",
    pg2P10: "Assurance supplémentaire pour le client",
    pg2P101:"années assurées",
    pg2P102:"assurance",
    pg2P103: "Pas d'assurance: Combien de temps dure l'encaissement de tous les actifs",
    pg2P104: "Assurance existante + Prestation de décès du gouvernement",
    pg2P12: "C'est une bonne occasion d'envisager une assurance supplémentaire pour votre conjoint également",
    pg2P11: "Assurance supplémentaire pour le conjoint: ",
    
    pg3T: "Besoins familiaux en matière de liquidités et de revenus",
    pg3T_1: "Besoins la succession en matière de liquidités et de revenus",
   
    pg3P1:
      /* "À votre décès, votre famille fera face à deux importants besoins financiers, soient d'obtenir des liquidités ainsi que des revenus. Bien que certains besoins de liquidités soient temporaires, d'autres sont nécessaires lors de toutes les étapes de la vie, ils sont donc identifiés comme 'Besoins de liquidités permanents'..", */
      "À votre décès, votre famille fera face à deux importants besoins financiers, soient d'obtenir des liquidités ainsi que des revenus. Bien que certains besoins de liquidités soient temporaires, d'autres sont nécessaires lors de toutes les étapes de la vie.",
    pg3P1_1:
      /* "À votre décès, votre famille fera face à deux importants besoins financiers, soient d'obtenir des liquidités ainsi que des revenus. Bien que certains besoins de liquidités soient temporaires, d'autres sont nécessaires lors de toutes les étapes de la vie, ils sont donc identifiés comme 'Besoins de liquidités permanents'..", */
      "À votre décès, votre succession fera face à deux importants besoins financiers, soient d'obtenir des liquidités ainsi que des revenus. Bien que certains besoins de liquidités soient temporaires, d'autres sont nécessaires lors de toutes les étapes de la vie.",
    pg3TabT: "Besoins de liquidités",
    pg3TabT2: "Description",
    pg3TabT3: "Valeur",
    
    pg3TabRTot: "Total",
    /* pg4T: "Besoin de revenus pour la famille au décès", */
    pg4T: "",
    /* pg4P1:
      "À votre décès, votre famille fera face à deux importants besoins financiers, soient d'obtenir des liquidités ainsi que des revenus.",
    */
   pg4P1: "Suite ... ", 
    pg4TabT: "Besoins de revenus",
    pg4TabRow1: "Montant actuel du revenu familial annuel",
    pg4TabRow1_1: "Montant actuel du revenu annuel",
    pg4TabRow2:
      "Pourcentage du revenu souhaité pour maintenir le niveau de vie actuel de votre famille pendant la période:",
    pg4TabRow2_1:
      "Pourcentage du revenu souhaité pour les besoins votre succession pendant la période:",
    //pg4TabRow3: "While more income is required",
    pg4TabRow3: "Un revenu plus élevé est requis",
   
    pg4TabRow4: "Pour le survivant par la suite",
    pg4TabRow5: "Le revenu souhaité s'élève donc à :",
    pgTabRowMoreIncome: "Un revenu plus élevé est requis",
    pgTabRowThereAfter: "Pour le survivant par la suite",
    pgTabRowThereAfter_1: "Pour la succession par la suite",
    pg5T: "Sources de liquidité pour la famille",// au décès",
    pg5T_1: "Sources de liquidité pour la succession",// au décès",
    pg5T_2: "Sources de liquidité et de revenus pour la famille",// au décès",
    pg5T_1_2: "Sources de liquidité et de revenus pour la succession",// au décès",
    pg5TabT: "Sources de liquidité",
    pg5TabT2: "Tous",
    pg5TabT3: "Au décès",
  
    pg5TabRow1:
      "Prestation de décès du RPC/RRQ",
    pg5TabRow3: "Total des liquidités disponibles",
    pg5TabRow4: "Moins les liquidités nécessaires au décès de l'assuré",
    pg5TabRow4_1: "Moins les liquidités nécessaires au décès de l'assuré",
    pg5TabRow5:
      "Excédent sur les liquidités disponibles pouvant assurer un revenu à la famille",
    pg5TabRow5_1:
      "Excédent sur les liquidités disponibles pouvant assurer un revenu à la succession",
    pg6T: "Sources de revenu pour la famille",// au décès",
    pg6T_1: "Sources de revenu pour la succession",// au décès",
    pg6TabT: "Sources de revenu",
    pg6TabRow1:
      "Le revenu annuel total disponible pour cette période s'élève donc à :",
    pg6TabRow2: "Un revenu plus élevé est requis",
    //pg6TabRow3: "Pour le survivant par la suite",
    pg5TabRow7:
    "Pour les membres survivants de la famille",
    pg5TabRow7_1:
    "Pour la succession",
    
    pg6TabRow4:
    "Le revenu supplémentaire après impôt requis (revenu souhaité moins revenu disponible) pour cette période est :",      
    //pg6TabRow5: "Un revenu plus élevé est requis",
    //pg6TabRow6: "Pour le survivant par la suite",
    pg6Net: "net",
    
    pg7T: "Besoins d'assurance",
    pg7TabT: "État des revenus de la famille au décès",
    pg7TabT_1: "État des revenus de la succession au décès",
    pg7TabRow1:
    "Le revenu supplémentaire après impôt requis (revenu souhaité moins revenu disponible) pour cette période est :",
    //pg7TabRow2: "Un revenu plus élevé est requis",
    //pg7TabRow3: "Pour le survivant par la suite",
    pg7TabRow4: "Taux d'inflation prévu",
    pg7TabRow5: "Taux d'intérêt potentiel des placements futurs du survivant",
    pg7TabRow5_1: "Taux d'intérêt potentiel des placements futurs de la succession",
    pg7TabRow6:
      "Basé sur ces facteurs financiers, le capital total requis pour générer des revenus indexés à l'inflation et qui sera épuisé à la fin de la période est :",
    pg7TabRow7: "A. Pour la durée de vie présumée du survivant (âge ",
    pg7TabRow8: "B. Jusqu'à la retraite du survivant",
    pg7TabRow9: "C. Jusqu'au 25e anniv. du benjamin",
    pg7TabRow10: "D. Jusqu'au 18e anniv. du benjamin",
    pg8T: "Besoins d'assurance",
    pg8TabT: "État des revenus de la famille au décès",
    pg8TabT_1: "État des revenus de la succession au décès",
    pg8TabRow1:
      "Capitaux excédentaires actuellement disponibles pour investissement après couverture des besoins financiers :",
    pg8TabRow2:
      "Manque à gagner en capitaux productifs de revenu(ex. assurance) pour les périodes ci-dessous :",
    pg8TabRow3: "A. Pour la durée de vie présumée du survivant (âge ",
    pg8TabRow4: "B. Jusqu'à la retraite du survivant",
    pg8TabRow5: "C. Jusqu'au 25e anniv. du benjamin",
    pg8TabRow6: "D. Jusqu'au 18e anniv. du benjamin",
    pg8TabRow4Alt: "A. Jusqu'à la fin de la période de protection",
    pg9T: "Notes importantes",
    pg9P1:
      "Le présent exposé ne comporte que des renseignements généraux. L'information qui s'y trouve ne doit pas être considérée par le lecteur comme des conseils juridiques, comptables, fiscaux ou actuariels. Pour ces questions, le lecteur devrait consulter un professionnel indépendant. Veuillez-vous reporter aux illustrations d'assurance, aux libellés des contrats et aux documents d'information des sociétés d'assurance pour obtenir des précisions sur les questions d'assurance mentionnées dans le présent exposé, puisque dans tous les cas, ce sont ces documents qui prévalent.",
    pgFooter: "Voir les Notes importantes à la fin du présent exposé.",
      pg10T: "Accusé de réception",
    pg10P1:
      "Je soussigné, _______________________ accuse réception du présent document et des soumissions connexes, et considère toute l'information sur les prestations et les valeurs comme un résumé seulement. Je comprends que les prestations et les valeurs susmentionnées ne sont ni estimatives ni garantes du rendement futur. Je comprends aussi que les résultats réels peuvent fluctuer en fonction du temps et du rendement du marché, ainsi que de l'état de santé et de l'assurabilité de la personne. Ces résultats peuvent faire l'objet de modifications et différer des valeurs présentées dans l'exposé.",
    pg10TabRow1: "Signature du client: ____________________",
    pg10TabRow11: "jour, mois, année: ___________",
    pg10TabRow2: "Signature du client: ____________________",
    pg10TabRow3: "Signature du conseiller en assurance: ____________________",
    pgAppendix:  "Annexe",
    pgAppendixT:
      "Graphiques et feuilles de calcul de l'analyse des besoins en matière d'assurance",
      pgAppendixP1: "Flux de trésorerie entrants (+) et sortants (-)",
      pgAppendixP2: "Le manque à gagner = flux de trésorerie entrants - sortants et est financé par l'assurance",
      pgAppendixP3 : "Situation financière actuelle",
      INASummaryTableC11:"Besoins en assurance",
      INASummaryTableC12:"À la retraite\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0",
      INASummaryTableC13:"À l’espérance de vie",
      INASummaryTableC14:"Jusqu’à\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0 100 ans ",
      INASummaryTableC15:"Pas d’assurance : encaisser tous les actifs",
      INASummaryTableC16:"Choix intelligent",
      INASummaryTableC21:"Couvrir le style de vie des survivants",
      INASummaryTableC26Closed: (
        <span> Type d’assurance en fonction du <b><i>Manque à gagner</i></b> ... </span>)  ,
      INASummaryTableC26Open: (
        <span> Le graphique du <b><i>manque à gagner</i></b> peut être utile pour cartographier le type d’assurance qui couvre les manques à gagner : temporaire, si les besoins sont temporaires, permanente, si les besoins sont à long terme et permanente avec avenants temporaires au cas des deux</span>),
        INASummaryTableC31:"Nombre d’années de couverture",
      
        INASummaryTableC36Closed: (
        <span> Avantages de l’assurance par rapport à l’encaissement de tous les actifs ... </span> ) ,
        INASummaryTableC35:"  ... with no insurance if all Assets had to be cashed today ^F",
        INASummaryTableC36Open: (
          <ul><li> Les actifs continuent de fonctionner efficacement pour les survivants</li>
          <li>L’homolgation est réduite ou reportée</li>
          <li>            
          L’ajout d’une couverture d’assurance aux actifs existants offre la flexibilité nécessaire pour couvrir les besoins du survivant aussi longtemps que nécessaire
          </li></ul>
        ),
      


      exportData: "Exporter des données vers:",
      toolCustomizeTitle:"Personnaliser/Générer PDF"    ,
      toolCustomizeCover: "Remplacer l'image de couverture",
      toolCustomizeCoverRestore: "Rétablir l'image de couverture par défaut",
      toolCustomizeIncludeAboutMe: "Inclure la page \"À propos de moi\" ?",
      toolCustomizeAboutAdd: "Ajouter " + "" + "À propos de moi",
      toolCustomizeAboutRefresh: "Actualiser \"À propos de moi\"",
      toolCustomizeAboutEdit: "Modifier \"À propos de moi\"",
      toolCustomizeAboutRefreshMsg:"Pour consulter les dernières informations, cliquez sur le bouton  Actualiser \"À propos de moi\" dans la section Résultats." ,
      toolCustomizeAdv: "Personnalisation avancée",
      toolCustomizeLogo:"Ajouter/modifier le logo"        ,
      customizeAlert:"Cette présentation client a été conçue pour être conforme aux réglementations du secteur et comprend une page contenant des Notes Importantes pour votre protection. La responsabilité de l'utilisation de ce document, qu'il soit édité ou non, vous incombe exclusivement.",
      customizeAlertTitle:"Personnaliser la présentation",
      taxSavingToEP:"Les cas INA qui incluent des « économies d’impôt » comme source de revenus ne peuvent pas êtres exportés vers Protéger votre succession jusqu’à la prochaine mise à jour logicielle."
    }
    };

export const GRAPHS_LABLES = {
  en: {
    insNeed: "Insurance Needs",
    graphMsg: "To provide for the income shortfall until retirement",
    persCF: "Personal cash Flow",
    govCF: "Government cash Flow",
    incomeNeeds: "Income Needs",
    shortfall: "Shortfall (-) / Surplus (+)",
    assetsBrk: "Assets Breakdown Today",
    liabsBrk: "Liabilities Breakdown" ,
    cashLike:        "Cash/TFSA/Insurance", 
    RRSP: "RRSP/RRIF", 
    shares: "Public/Private shares", 
    realEstate: "Real Estate", 
    otherAssets:"Other",
    loans: "Loans", 
    taxes:"Taxes", 
    emergency:"Emergency Fund", 
    otherLiabs:"Other",
    atDeath: "At Death and Future Amts.",
    insNeeds100: "Insurance Needs to age 100",
    insNeedsRet: "Insurance Needs to retirement (age ",
    insNeedsRetLE: "Insurance Needs to life expectancy (age ",
    
    currFins: "Your current financial situation is summarized below: "
  },
  fr: {
    insNeed: "Besoins d'assurance",
    graphMsg:
      "Pour couvrir le manque à gagner en matière de revenus jusqu'à la retraite",
      persCF: "Liquidités personnelles",
      govCF: "Liquidités versées par l'état",
      incomeNeeds: "Revenus requis",
      shortfall: "Manque à gagner (-) / Surplus (+)",
      
    assetsBrk: "Ventilation des actifs (aujourd'hui)",
    liabsBrk: "Ventilation des passifs",
    cashLike:        "Liquidités/CELI/Assurance",
    RRSP: "REER/FERR",
    shares: "Titres publics/privés",
    realEstate: "Immobilier",
    otherAssets:"Autre",
    loans: "Prêts",
    taxes:"Charges fiscales",
    emergency:"Fonds d'urgence",
    otherLiabs:"Autre",
    atDeath: "Au décès et engagements futurs",
    insNeeds100: "Besoins en assurance jusqu'à l'âge de 100 ans",
    insNeedsRet: "Besoins en assurance jusqu'à la retraite(âge ",
    insNeedsRetLE: "Besoins en assurance jusqu'à l'espérance de vie (âge ",
    
    currFins: "YLe sommaire de votre situation financière actuelle se trouve ci-dessous: "
    
  }
}
