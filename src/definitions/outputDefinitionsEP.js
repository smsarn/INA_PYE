export const ASSET_TAX_TYPE_PRINCIPAL_RES = 0;
export const ASSET_TAX_TYPE_REAL_ESTATE = 1;
export const ASSET_TAX_TYPE_STOCKS = 2;
export const ASSET_TAX_TYPE_SMALL_BUS = 3;
export const ASSET_TAX_TYPE_RRSP = 4;
export const ASSET_TAX_TYPE_INTEREST = 5;
export const ASSET_TAX_TYPE_OTHER = 6;


export const ASSET_TAX_TYPE_COUNT = 7;


export const OUTPUTTEXTEP = {
  en: {
    pg1T: "Protecting Your Estate",
    pg1P1: "Designed for: ",
    pg1P2: "Designed by: ",
    pg1P3: "Date: ",
    pg1P4: "Province: ",

    pg2T: "Introduction",
    pg2Paragraphs: [
      "Throughout your lifetime, your success has allowed you to accumulate assets beyond those that you will need to provide for an enjoyable retirement. The ownership of some of these assets will result in a tax liability upon your death (or the death of your spouse). These assets can be divided into three groups: ",
      "First, assets of a capital nature. The current Canadian tax law provides for the deemed disposition of your capital assets on your death at fair market value, and any increase in value over the cost (the tax term is Adjusted Cost Base) is taxed as a capital gain. The most common assets in this category are:",
      "Shares in private or public companies",
      "Second home or vacation properties",
      "Second, assets that generally produce income on your death. The most common assets in this category are:",
      "Registered assets, RRSPs or RRIFs",
      "Assets that are taxed as income such as interest bearing assets, GICs or money market funds",
      "Third, are assets that are either fully tax paid or do not attract tax on death. The most common of these are:",
      "Non-taxable assets such as cash and TFSAs",
      "Principal residence",
      "The tax free proceeds from a life insurance policy",
    ],

    pg3T: "Your Financial Situation",
    pg3P1:
      "Your current balance sheet and estimated net worth are summarized below. In order to calculate your future tax liability it is necessary to project the growth in the value of your assets going forward. (See Appendix for details.)",
    pg3TabT: "Assets",
    pg3TabRTot: "Total Assets Available",
    pg3Tab2T: "Liabilities",
    pg3Tab2RTot: "Total",
    pg3Tab2NW: "Net Worth",

    pg3T2: "Your Growing Tax Liability",
    pg3P2:
      "As the value of your assets grow so does the tax liability that your estate will incur upon death. To project this liability, we have assumed the following asset growth rates:",
    pg3P3: "",
    pg3Tab3R1C1: "Assets",
    pg3Tab3R1C2: "Growth Rate",
    pg3Tab3R1C3: "Tax Liability Today",
    pg3Tab3R1C4: "Tax Liability Life Exp. + 3*",

    pg3Tab3R2C1: "Real Estate (Non-Principal)",
    pg3Tab3R2C2: "",
    pg3Tab3R2C3: "",
    pg3Tab3R2C4: "",

    pg3Tab3R3C1: "Stocks & Bonds",
    pg3Tab3R3C2: "",
    pg3Tab3R3C3: "",
    pg3Tab3R3C4: "",

    pg3Tab3R4C1: "Small Business Shares",
    pg3Tab3R4C2: "",
    pg3Tab3R4C3: "",
    pg3Tab3R4C4: "",

    pg3Tab3R5C1: "RRSP/RRIF",
    pg3Tab3R5C2: "",
    pg3Tab3R5C3: "",
    pg3Tab3R5C4: "",

    pg3Tab3R6C1: "Interest Bearing",
    pg3Tab3R6C2: "",
    pg3Tab3R6C3: "",
    pg3Tab3R6C4: "",

    pg3Tab3R7C1: "Other",
    pg3Tab3R7C2: "",
    pg3Tab3R7C3: "",
    pg3Tab3R7C4: "",

    pg3Tab3R8C1: "Total",
    pg3Tab3R8C2: "",
    pg3Tab3R8C3: "",
    pg3Tab3R8C4: "",
    pg3P4:" * Tax liability is estimated based on today's personal income tax rate and current income tax legislation",
    pg3P5:" ** Please see assumptions in Appendix for withdrawals of amounts from RRIF as they factor into this calculation",
    pg4T: "Future Value of Your Estate",
    pg4P1:
      "Using the growth rate and income tax assumptions, this chart shows the total value of your estate in the future and the corresponding tax liability on death that would need to be funded for each year going forward.",
    pg4GT:"Estate Value & Tax Liability",
    pg4P2: " * Life Expectancy is slightly shaded in the bar graph (year: ",
    pg4P3:
      "Your future tax liability G1 from $X1 today to $X2 at life expectancy plus 3 years, and will need to be funded upon death.",

    pg5T: "Estate Protection Alternatives",
    pg5Paragraphs: [
      "Many people want to keep their estate intact to pass on to their heirs.  But what is the best method to fund this tax liability upon your death so that your assets can be passed to your heirs unencumbered?",
      "Typically, there are four options to provide the liquidity to pay taxes that come due upon death:",
      "Liquidate assets ",
      "Borrow funds, which usually means using assets as security",
      "Create a cash reserve by systematically saving during your lifetime",
      "Transfer the risk by purchasing life insurance in advance",
      "Some of the advantages and disadvantages to each of these methods are:",
      "Liquidate assets -  Business cycles and the state of the markets are critical in the value of an asset. You have no way of knowing what this will be at your death. Further, the sale of assets by an estate often signals to a purchaser that there is a degree of urgency, which does not help the seller realize full value.",
      "Borrow Funds -  In estate situations, the main objective is usually to distribute the assets to the beneficiaries.  Borrowing against the assets, which will likely require pledging them as security, makes this more difficult. Further, it is not possible to predict the market conditions at the time of death. Financial institutions go through cycles, as do loan rates. ",
      "Create a cash reserve - In the context of an estate situation a cash reserve is not a practical option as you do not know when death will occur and whether there will be ample cash flow at that time.",
      "Transfer the risk by purchasing life insurance -  Life insurance, purchased in advance, removes many of the risks associated with funding the tax liability upon death. The death benefit provides liquidity at exactly the time it is needed, and in Canada it is paid tax-free to the named beneficiary.",
    ],
    pg5Plast:
      "The most practical, and cost effective, method to transfer the risk of funding a tax liability is to purchase life insurance.",

    pg6T: "Using Life Insurance to Preserve Your Estate",
    pg6Paragraphs1: [
      "A permanent life insurance policy can be a good way to provide for this future tax liability. Life insurance removes many of the financial risks associated with a premature death. It provides the financial assistance when it is needed, upon the death of the life insured. ",
      "The type of life insurance that is most appropriate for this need is permanent insurance, because coverage stays in place until death, no matter the age. There are three types of permanent cash value life insurance coverage:",
      "Universal Life",
      "Whole Life",
      "Hybrid Life",
      "Cash values are made up of accumulated capital within the policy's tax deferred accumulation fund including any guaranteed cash surrender values that are offered to the policyowner by the insurance company upon cancellation of the contract. Depending on the type of policy the total cash value, including the guaranteed portion, may be accessed by the policyowner through a number of different methods.",
      "One of the challenges facing the purchase of insurance is that the tax liability changes over time. Insurance policies can be custom designed to meet your unique situation by matching the death benefit as closely as possible to the need for cash to pay tax liabilities at the time of death. ",
    ],
    pg6Paragraphs2: [
      "This is a hybrid product that is customized to address your growing estate liability insurance needs. A hybrid life insurance policy offers a unique combination of the best elements of traditional whole life and universal life insurance:",
      "Cost of insurance is guaranteed not to increase",
      "Death benefit is a combination of the base insurance amount, additional paid up coverage and the value of investments",
      "Policy has contractually guaranteed cash values",
      "Additional funds, above the cost of insurance, may be deposited",
      "The funds are invested at the discretion of the policy owner (not the insurance company) and include these options: fixed income, stock market index accounts, mutual fund mirrored accounts and smoothed return investment account",
    ],

    pg7T: "Summary",
    pg7P1:
      "The best method of covering a future tax liability upon death is to purchase life insurance, which effectively transfers the risk away from the estate. Not only does it give you peace of mind, it also outperforms other alternative methods in terms of financial cost.",
    pg8T: "Appendix",
    pg8P1:
      "Detailed tax liability projections for all asset categories",
      pg8PAgg: "Aggregate",
    pg8P2: "Detailed tax liability projections by individual asset category:",
    pg8O1: "Hide",
    pg8O2: "Show",

    pgFooter: "See Some Important Notes at the end of this presentation.",

    pg9T: "Some Important Notes",
    pg9P1:
      "This presentation is for general information purposes. The information contained in this presentation must not be taken or relied upon by the reader as legal, accounting, taxation or actuarial advice. For these matters readers should seek independent professional advice. Please refer to insurance company illustrations, policy contracts and information folders regarding any insurance matters referred to in this presentation.",
    pg9P2:
      "Any tax calculations are provided as examples only and are based on the personal income tax rates and income tax legislation in effect on the date of the presentation. It is assumed that the taxpayer is a Canadian resident and not a US citizen.",

      graphsT1:"Estate Liability breakdown Today and at Life Expectancy plus 3 years:",
      graphsT2:"Estate Liability Today",
      graphsT3:"Estate Liability at Life Expectancy +3",
      graphsL1:"Liabilities",
      graphsL2:"Taxes: RRSP/RRIF",
      graphsL3:"Taxes: Capital Gains",
      graphsL4:"Taxes: As Income",
      graphsL5:"Taxes: Dividend",
      graphs2L1:"Future Insurance Needs",
      graphs2L2:"Life Expectancy",
      graphsTaxes:"Taxes: ",
      graphsLeakageT1: "Estate Leakage Today and at Life Expectancy plus 3 years:",
      graphsLeakageT2: "Estate Leakage Today",
      graphsLeakageT3: "Estate Leakage at Life Expectancy +3",
      graphsLeakage1: "Net Estate Value",
      graphsLeakage2: "Tax Liability",
      graphsLeakage3: "Other Liabilities",

      EPSummaryTableC11: "Insurance Needs",
      EPSummaryTableC12: "Today",
      EPSummaryTableC13: "at Life Expectancy",
      EPSummaryTableC14: "Smart Choice:",
      EPSummaryTableC21: "to cover Tax Liabilities",
      EPSummaryTableC31: "to cover All Liabilities",
      EPSummaryTableC24: "A permanent life insurance policy can be custom designed to include the Face + Fund option, a short premium payment period, and a death benefit that covers the need today and grows over time to match the need at Life Expectancy. Note the Insurance Need at Life Expectancy, and use trial and error in ",
      exportData: "Export Data to:",
      customizeAlert:"This client presentation has been designed to comply with industry regulations and includes a page with Some Important Notes for your protection. Responsibility for use of this document, whether or not it is edited, is solely yours.",
      customizeAlertTitle:"Customize Presentation",
    

      
  },
  fr:  {
        pg1T: "Protection de votre patrimoine",
    pg1P1: "Préparé pour : ",
    pg1P2: "Préparé par : ",
    pg1P3: "Date : ",
    pg1P4: "Province : ",

    pg2T: "Introduction",
    pg2Paragraphs: [
      "Tout au long de votre vie, votre réussite vous a permis d'accumuler plus d'actifs que ce dont vous aurez besoin pour vous assurer une retraite agréable. La propriété de certains de ces actifs entraînera une obligation fiscale à votre décès (ou au décès de votre conjoint). Ces actifs se divisent en trois catégories : ",
      "Premièrement, les immobilisations. La Loi de l'impôt sur le revenu du Canada prévoit actuellement une disposition présumée de vos biens en immobilisation à la juste valeur marchande à votre décès, et toute augmentation de la valeur par rapport au coût d'acquisition (le terme fiscal est « prix de base rajusté ») sera imposée comme un gain en capital. Les actifs les plus courants dans cette catégorie sont les suivants :",
      "Actions de sociétés publiques ou fermées",
      "Résidences secondaires ou de vacances",
      "Deuxièmement, les actifs qui produisent généralement des revenus à votre décès. Les actifs les plus courants dans cette catégorie sont les suivants :",
      "Actifs enregistrés, REER ou FERR",
      "Actifs imposés en tant que revenus, tels que les actifs porteurs d'intérêts, les CPG ou les fonds du marché monétaire",
      "Troisièmement, les actifs totalement libérés d'impôt ou qui ne sont pas imposables au décès. Les actifs les plus courants dans cette catégorie sont les suivants :",
      "Actifs non imposables, tels que les liquidités et les CELI",
      "Résidence principale",
      "Capital décès libre d'impôt au titre d'une police d'assurance vie",
    ],

    pg3T: "Votre situation financière",
    pg3P1:
      "Votre bilan actuel et la valeur nette approximative de vos actifs sont résumés ci-dessous. Afin de calculer l'impôt que vous aurez à payer, il est nécessaire de prévoir la croissance future de vos actifs. (Voir les projections détaillées en annexe.)",
    pg3TabT: "Actifs",
    pg3TabRTot: "Total des actifs disponibles",
    pg3Tab2T: "Passifs",
    pg3Tab2RTot: "Total",
    pg3Tab2NW: "Valeur nette",

    pg3T2: "Augmentation de votre obligation fiscale",
    pg3P2:
      "L'obligation fiscale à laquelle sera assujetti votre patrimoine à votre décès augmente proportionnellement à la valeur de vos biens. Pour prévoir cette obligation, nous avons utilisé les hypothèses de taux de croissance suivantes :",
    pg3P3: "",
    pg3Tab3R1C1: "Actifs",
    pg3Tab3R1C2: "Taux de croissance",
    pg3Tab3R1C3: "Obligation fiscale actuelle",
    pg3Tab3R1C4: "Obligation fiscale à l'espérance de vie, plus 3 ans*",

    pg3Tab3R2C1: "Biens immobiliers (non principaux)",
    pg3Tab3R2C2: "",
    pg3Tab3R2C3: "",
    pg3Tab3R2C4: "",

    pg3Tab3R3C1: "Actions et obligations",
    pg3Tab3R3C2: "",
    pg3Tab3R3C3: "",
    pg3Tab3R3C4: "",

    pg3Tab3R4C1: "Actions de petites entreprises",
    pg3Tab3R4C2: "",
    pg3Tab3R4C3: "",
    pg3Tab3R4C4: "",

    pg3Tab3R5C1: "REER/FERR**",
    pg3Tab3R5C2: "",
    pg3Tab3R5C3: "",
    pg3Tab3R5C4: "",

    pg3Tab3R6C1: "Actifs porteurs d'intérêts",
    pg3Tab3R6C2: "",
    pg3Tab3R6C3: "",
    pg3Tab3R6C4: "",

    pg3Tab3R7C1: "Autres",
    pg3Tab3R7C2: "",
    pg3Tab3R7C3: "",
    pg3Tab3R7C4: "",

    
    pg3Tab3R8C1: "Total",
    pg3Tab3R8C2: "",
    pg3Tab3R8C3: "",
    pg3Tab3R8C4: "",

    pg3P4:
      " * L'obligation fiscale est projetée en utilisant votre taux d'imposition personnel actuel et la loi de l'impôt sur le revenu courante",
    pg3P5:
      " ** Veuillez consulter en annexe les hypothèses relatives aux retraits de montants du FERR, puisqu'ils sont pris en compte dans ce calcul",

    pg4T: "Valeur future de votre patrimoine",
    pg4P1:
          "Selon les taux de croissance et d'imposition présumés, le tableau ci-dessous présente la valeur totale future de votre patrimoine et l'obligation fiscale au décès qu'il faudrait financer pour chaque année à venir.",
    pg4GT:"Valeur du patrimoine et obligation fiscale",
    pg4P2: " * L'espérance de vie est légèrement ombragée dans le graphique à barres (année: ",
    pg4P3:
      "Votre obligation fiscale future G1 de X1 $ aujourd'hui à X2 $ à l'espérance de vie plus 3 ans, et devra être financée au décès.",

    pg5T: "Options de protection du patrimoine",
    pg5Paragraphs: [
      "Beaucoup de gens veulent garder leur patrimoine intact pour le transmettre à leurs héritiers.  Mais quel est le meilleur moyen de financer l'obligation fiscale qui en découle à au décès afin que leurs actifs puissent être transmis sans encombre à leurs héritiers?",
      "En règle générale, il y a quatre moyens d'obtenir les liquidités nécessaires pour payer les impôts exigibles au décès :",
      "Liquider les actifs",
      "Emprunter de l'argent, ce qui signifie généralement utiliser des actifs en garantie",
      "Créer une réserve de liquidités en épargnant de façon systématique tout au long de sa vie",
      "Transférer le risque en souscrivant une assurance vie à l'avance",
      "Voici certains des avantages et inconvénients de chacune de ces options :",
      "Liquider les actifs - Les cycles économiques et l'état des marchés sont déterminants pour la valeur d'un actif. Vous n'avez aucun moyen de savoir ce qu'elle sera à votre décès. En outre, la vente d'actifs par les ayants droit indique souvent à un acheteur qu'il y a une certaine urgence, ce qui n'aide pas le vendeur à en obtenir la pleine valeur.",
      "Emprunter de l'argent -  En planification successorale, l'objectif principal est généralement de distribuer les actifs aux bénéficiaires. Emprunter de l'argent en cédant des actifs en garantie rend la tâche plus difficile. En outre, il n'est pas possible de prévoir les conditions du marché au moment du décès. Les institutions financières connaissent des cycles, tout comme les taux d'intérêt sur les prêts. ",
"Créer une réserve de liquidités - en planification successorale, une réserve de liquidités n'est pas une option pratique, puisque vous ne savez pas quand le décès surviendra et si, à ce moment-là, il y aura assez de liquidités.",
      "Transférer le risque en souscrivant une assurance vie -  la souscription à l'avance d'une assurance vie permet d'éliminer une grande partie des risques associés au financement de l'obligation fiscale au décès. Le capital décès procure des liquidités au moment même où on en a besoin. Au Canada, il est versé au bénéficiaire en franchise d'impôt.",
    ],
    pg5Plast:
      "La souscription d'une assurance vie est la méthode la plus pratique et la plus rentable pour transférer le risque associé au financement de l'obligation fiscale.",

    pg6T: "Utiliser l'assurance vie pour protéger votre patrimoine",
    pg6Paragraphs1: [
      "Une police d'assurance vie permanente peut être un bon moyen de sécuriser cette future obligation fiscale. L'assurance vie élimine une grande partie des risques financiers associés à un décès prématuré. Elle fournit l'aide financière nécessaire moment du décès de l'assuré. ",
      "À cette fin, l'assurance permanente est le type d'assurance vie le plus approprié, car la protection reste en vigueur jusqu'au décès, peu importe l'âge. Il y a trois formules d'assurance vie permanente avec valeur de rachat :",
      "Vie universelle",
      "Vie entière",
      "Vie hybride",
      "Les valeurs de rachat comprennent le capital accumulé dans le fonds d'accumulation à impôt différé de la police, y compris toute valeur de rachat garantie offerte au titulaire de police par la compagnie d'assurance à la résiliation du contrat. Selon le type de police, le titulaire peut avoir accès à la valeur de rachat totale, y compris la partie garantie, grâce à un certain nombre de méthodes différentes.",
      "L'une des difficultés que pose l'achat d'une assurance est que l'obligation fiscale change au fil du temps. Les polices d'assurance peuvent être conçues sur mesure pour répondre à votre situation particulière. Pour ce faire, on s'assure que le capital décès correspond le plus possible aux liquidités nécessaires pour payer l'obligation fiscale au moment du décès. ",
    ],
    pg6Paragraphs2: [
      "Il s'agit d'un produit hybride conçu sur mesure pour répondre à vos besoins d'assurance visant à prévoir les obligations croissantes liées à votre patrimoine. Une police d'assurance vie hybride combine de façon unique les meilleurs éléments de l'assurance vie entière traditionnelle et de l'assurance vie universelle :",
      "Le coût de l'assurance n'augmentera pas",
      "Le capital décès est constitué du montant d'assurance de base, d'une assurance supplémentaire libérée et de la valeur des placements",
      "La police comprend des valeurs de rachat garanties par le contrat",
      "Des fonds supplémentaires, en sus du coût de l'assurance, peuvent être déposés",
      "Les fonds sont investis à la discrétion du titulaire de la police (et non de la compagnie d'assurance) et comprennent les options suivantes : revenu fixe, comptes indiciels d'actions, fonds distincts qui calquent des fonds communs et compte de placement à rendement stabilité",
    ],

    pg7T: "Résumé",
    pg7P1:
      "La souscription d'une assurance vie constitue le meilleur moyen de prévoir l'obligation fiscale au décès. Elle dégage efficacement les ayants droit du risque financier. Non seulement elle vous apporte la tranquillité d'esprit, mais elle surpasse également les autres méthodes alternatives en terme de coût financier..",
    pg8T: "Annexe",
    pg8P1:
      "Projections détaillées de l'obligation fiscale pour toutes les catégories d'actifs combinées",
    pg8PAgg: "Agrégat",
    pg8P2: "Projections détaillées de l'obligation fiscale par catégorie d'actifs :",
    pg8O1: "Cacher",
    pg8O2: "Montrer",


    pgFooter: "Voir les notes importantes à la fin du document.",

    pg9T: "Notes importantes",
    pg9P1:
      "Le présent exposé ne comporte que des renseignements généraux. L'information qui s'y trouve ne doit pas être considérée par le lecteur comme des conseils juridiques, comptables, fiscaux ou actuariels. Pour ces questions, le lecteur devrait consulter un professionnel indépendant. Veuillez vous reporter aux exposés de vente, au libellé des contrats et à la documentation des compagnies d'assurance pour obtenir des précisions sur les questions d'assurance mentionnées dans le présent document.",
    pg9P2:
      "Tous les calculs fiscaux sont fournis à titre d'exemple seulement et sont basés sur les taux d'impôt et la Loi de l'impôt sur le revenu en vigueur en date de la présentation. Nous présumons qu'il s'agit d'un résident canadien et non pas d'un citoyen américain.",
      graphsT1:"Obligation fiscale aujourd'hui et à l'espérance de vie, plus 3 ans",
      graphsT2:"Obligation fiscale aujourd'hui",
      graphsT3:"Obligation fiscale à l'espérance de vie, plus 3 ans",
      graphsL1:"Passifs",
      graphsL2:"Impôt: REER/FERR",
      graphsL3:"Impôt: Gain en capital",
      graphsL4:"Impôt: sur le revenu",
      graphsL5:"Impôt: sur dividende",
      graphs2L1:"Besoins d'assurance futurs ",
      graphs2L2:"à l'espérance de vie",
      graphsTaxes:"Impôt: ",
      graphsLeakageT1: "Réduction du patrimoine aujourd'hui et à l'espérance de vie, plus 3 ans",
      graphsLeakageT2: "Réduction du patrimoine aujourd'hui",
      graphsLeakageT3: "Réduction du patrimoine à l'espérance de vie, plus 3 ans",
      graphsLeakage1: "Valeur successorale nette",
      graphsLeakage2: "Obligation fiscale",
      graphsLeakage3: "Autres éléments de passif",

      EPSummaryTableC11: "Besoins en matière d'assurance",
      EPSummaryTableC12: "aujourd'hui",
      EPSummaryTableC13: "à l'espérance de vie",
      EPSummaryTableC14: "choix judicieux :",
      EPSummaryTableC21: "pour couvrir les obligations fiscales :",
      EPSummaryTableC31: "pour couvrir toutes les obligations :",
      EPSummaryTableC24: "Une police d'assurance-vie permanente peut être conçue sur mesure pour inclure l'option Montant d'assurance + fonds, une courte période de paiement des primes et une prestation de décès qui couvre le besoin aujourd'hui et qui augmente avec le temps pour correspondre au besoin à l'espérance de vie. Notez le besoin d'assurance à l'espérance de vie et faites des essais et erreurs dans  ",
      exportData: "Exporter des données vers:",
      customizeAlert:"Cette présentation client a été conçue pour être conforme aux réglementations du secteur et comprend une page contenant des Notes Importantes pour votre protection. La responsabilité de l'utilisation de ce document, qu'il soit édité ou non, vous incombe exclusivement.",
      customizeAlertTitle:"Personnaliser la présentation",
      

  },


};
