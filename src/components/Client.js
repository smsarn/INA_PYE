import React, { Component } from "react";

import { DropDown } from "./DropDown";
//import { InputField4 } from './inputField4';
import { InputField } from "./inputField";
import { AddRemove } from "./AddRemove";
import { cleanFormat } from "../utils/helper";
import {
  getInfoIconClientsMember,
  getInfoIconClientsElig,
  getInfoIconClientsEligSinglePerson,
  getInfoIconSpouseElig,
  getInfoIconClientsTax,
  getInfoIconClientsRetire,
  getInfoIncome,
} from "../definitions/infoIconsDefinitions";
import { appletMode } from "../../package.json";

import {
  MESSAGES,
  SEX,
  SMOKING,
  MEMBER,
  CONTROLTITLE,
  TITLES,
  QUOTE_CLIENT,
  QUOTE_SPOUSE,
  APPLET_EP,
  APPLET_INA,
} from "../definitions/generalDefinitions";
import {
  getListItemNameFromKey,
  getDisableValues,
  getListItemKeyFromName,
} from "../utils/helper";
import { createDefaultClient } from "../data/createDefaults";
export class Client extends Component {
  displayName = Client.name;

  constructor(props) {
    super(props);
    this.state = {
      name: this.props.clientCurr.Name,
    };
    var sexValues = [
      {
        label: SEX.MALE.value[this.props.language],
        value: 1,
      },
      { label: SEX.FEMALE.value[this.props.language], value: 2 },
    ];

    var smokingValues = [
      {
        label: SMOKING.NON_SMOKER.value[this.props.language],
        value: 1,
      },
      { label: SMOKING.SMOKER.value[this.props.language], value: 2 },
    ];

    var memberValues = [
      {
        label: MEMBER.CLIENT.value[this.props.language],
        value: 1,
      },
      { label: MEMBER.SPOUSE.value[this.props.language], value: 2 },
      { label: MEMBER.CHILD.value[this.props.language], value: 3 },
      { label: MEMBER.DEPENDENT_ADULT.value[this.props.language], value: 4 },
    ];

    if (APPLET_EP) {
      memberValues = [
        {
          label: MEMBER.CLIENT.value[this.props.language],
          value: 1,
        },
        { label: MEMBER.SPOUSE.value[this.props.language], value: 2 },
      ];
    }

    const bilingual = CONTROLTITLE[this.props.language];
    this.dataValues = {
      DD: [
        {
          id: 1,
          Title: bilingual.sex,
          defValue: getListItemNameFromKey(
            SEX,
            this.props.clientCurr.sexKey,
            this.props.language
          ),
          disableOptionValue: getDisableValues(SEX),
          Values: sexValues,
        },
        {
          id: 2,
          Title: bilingual.smoking,
          defValue: getListItemNameFromKey(
            SMOKING,
            this.props.clientCurr.smokerKey,
            this.props.language
          ),
          disableOptionValue: getDisableValues(SMOKING),
          Values: smokingValues,
        },
        {
          id: 3,
          Title: bilingual.member,
          defValue: getListItemNameFromKey(
            MEMBER,
            this.props.clientCurr.memberKey,
            this.props.language
          ),
          disableOptionValue: getDisableValues(MEMBER),
          Values: memberValues,
        },
      ],
    };
    this.infoRetireRed = false;
  
  }

  componentWillReceiveProps(nextProps) {
    // console.log(getListItemNameFromKey(SEX,nextProps.clientCurr.sexKey,this.props.language),nextProps.clientCurr.memberKey,this.props.language)
    if (
      nextProps.clientCurr !== this.props.clientCurr ||
      nextProps.id !== this.props.id ||
      // || nextProps.hasSurivor !== this.props.hasSurivor
      nextProps.clientsNo !== this.props.clientsNo
    ) {
      // console.log(nextProps, this.props,this.dataValues)
      this.dataValues.DD[0].defValue = getListItemNameFromKey(
        SEX,
        nextProps.clientCurr.sexKey,
        this.props.language
      );
      this.dataValues.DD[1].defValue = getListItemNameFromKey(
        SMOKING,
        nextProps.clientCurr.smokerKey,
        this.props.language
      );
      this.dataValues.DD[2].defValue = getListItemNameFromKey(
        MEMBER,
        nextProps.clientCurr.memberKey,
        this.props.language
      );
      // console.log(nextProps, this.props,this.dataValues)

      this.setState({ name: nextProps.clientCurr.Name });
    }
    //  if (nextProps.clientCurr.retirementAge == this.props.clientCurr.retirementAge)
    //  this.infoRetireRed= false;
  }

  handleDoRemove = (id) => {
    if (this.props.disableAddRemove === false) {
      this.props.handleRemoveClient(id);
    }
  };

  handleDoAdd = () => {
    if (this.props.disableAddRemove === false) {
      let newCliet;
      if (this.props.clientsNo === 1) newCliet = createDefaultClient(2);
      else {
        newCliet = createDefaultClient(this.props.clientsNo + 1); //add spouse
        newCliet.Age =
          18 - 2 * (this.props.clientsNo > 6 ? 4 : this.props.clientsNo + 1);
        newCliet.sexKey =
          this.props.clientsNo % 2 ? SEX.MALE.Key : SEX.FEMALE.Key;
        newCliet.retirementAge = 25;
      }
      this.props.handleAddClient(newCliet);
    }
  };

  doSwitch = () => {
    this.props.switchClients();
  };
  handleUpdateInput = (id, value) => {
    let client = this.getCurrClient();
    /*    let client = {
      id: this.props.id,
      Age: this.props.clientCurr.Age,
      sexKey: this.props.clientCurr.sexKey,
      smokerKey: this.props.clientCurr.smokerKey,
      Income: this.props.clientCurr.Income,
      avgTaxRate: this.props.clientCurr.avgTaxRate,
      memberKey: this.props.clientCurr.memberKey,
      retirementAge: this.props.clientCurr.retirementAge,
      Eligibility: this.props.clientCurr.Eligibility,
      Name:this.props.clientCurr.Name
    };
 */
    const lang = this.props.language;
    const valueClean = cleanFormat(value, lang);
    const valueCleanInt = parseInt(valueClean);

    let changed = false;
    //this.infoRetireRed= false;
    if (id === 0) {
      changed = client.Age !== parseInt(value) ? true : false;
      client.Age = parseInt(value);
    } else if (id === 1) {
      changed = client.Income !== valueCleanInt ? true : false;
      client.Income = valueCleanInt;
    } else if (id === 2) {
      changed =
        client.avgTaxRate !==
        parseInt(100 * valueClean) / 100
          ? true
          : false;
      client.avgTaxRate =
        parseInt(100 * valueClean) / 100;
    } else if (id === 3) {
      changed = client.retirementAge !== parseInt(value) ? true : false;
      if (changed) {
        this.infoRetireRed = true;
        setTimeout(() => {
          this.infoRetireRed = false;
        }, 4000);
      }
      client.retirementAge = parseInt(value);
    } else if (id === 4) {
      changed =
        client.Eligibility !==
        parseInt(100 * valueClean) / 100
          ? true
          : false;
      client.Eligibility =
        parseInt(100 * valueClean) / 100;
    }

    if (changed) {
      this.props.handleUpdate(client);
      this.setState({ loading: this.props.disableAddRemove });
    }
  };

  updateDDown = (id, selection) => {
    let client = this.getCurrClient();
    /*  {
      id: this.props.id,
      Age: this.props.clientCurr.Age,
      sexKey: this.props.clientCurr.sexKey,
      smokerKey: this.props.clientCurr.smokerKey,
      Income: this.props.clientCurr.Income,
      avgTaxRate: this.props.clientCurr.avgTaxRate,
      memberKey: this.props.clientCurr.memberKey,
      retirementAge: this.props.clientCurr.retirementAge,
      Eligibility: this.props.clientCurr.Eligibility,
      Name:this.props.clientCurr.Name
    }; */
    if (id === 1) client.sexKey = getListItemKeyFromName(SEX, selection);
    else if (id === 2)
      client.smokerKey = getListItemKeyFromName(SMOKING, selection);
    else if (id === 3)
      client.memberKey = getListItemKeyFromName(MEMBER, selection);
    else if (id === 5) client.Name = selection;

    if (
      client.memberKey === MEMBER.CHILD.Key &&
      this.props.clientCurr.memberKey !== MEMBER.CHILD.Key
    ) {
      client.Income = 0;
      client.avgTaxRate = 0;
      client.Age = 16;
      client.retirementAge = 25;
    } else if (
      client.memberKey === MEMBER.DEPENDENT_ADULT.Key &&
      this.props.clientCurr.memberKey !== MEMBER.DEPENDENT_ADULT.Key
    ) {
      client.Income = 0;
      client.avgTaxRate = 0;
      client.Age = 25;
      client.retirementAge = 65;
    } else if (
      client.memberKey === MEMBER.SPOUSE.Key &&
      this.props.clientCurr.memberKey !== MEMBER.SPOUSE.Key
    ) {
      client.Income = 60000;
      client.avgTaxRate = 25;
      client.Age = 40;
      client.retirementAge = 65;
    }
    this.props.handleUpdate(client);
  };

  writeBack = (name) => {
    let client = this.getCurrClient();
    client.Name = name;
    this.props.handleUpdate(client);
  };

  updateName = (evt) => {
    this.setState({ name: evt.target.value }, this.writeBack(evt.target.value));
  };

  getCurrClient = () => {
    let client = {
      id: this.props.id,
      Age: this.props.clientCurr.Age,
      sexKey: this.props.clientCurr.sexKey,
      smokerKey: this.props.clientCurr.smokerKey,
      Income: this.props.clientCurr.Income,
      avgTaxRate: this.props.clientCurr.avgTaxRate,
      memberKey: this.props.clientCurr.memberKey,
      retirementAge: this.props.clientCurr.retirementAge,
      Eligibility: this.props.clientCurr.Eligibility,
      Name: this.props.clientCurr.Name,
    };
    return client;
  };

  handleFocus = (event) => {
    event.target.select();
  };

  render() {
    const nonSpouse =
      this.props.clientCurr.memberKey === MEMBER.CHILD.Key ||
      this.props.clientCurr.memberKey === MEMBER.DEPENDENT_ADULT.Key;
    const nonSpouseIsTheSurvivor = nonSpouse && this.props.isTheSurvivor;
    const nonSpouseHasIncome =
      this.props.clientCurr.Income > 0 &&
      (this.props.clientCurr.memberKey === MEMBER.CHILD.Key ||
        this.props.clientCurr.memberKey === MEMBER.DEPENDENT_ADULT.Key);
    const bilingual = CONTROLTITLE[this.props.language];
    const singlePerson = this.props.clientsNo === 1 ? true : false;
    let clientMember =
      this.props.clientCurr.memberKey === MEMBER.CLIENT.Key &&
      this.props.id === 1;
    let disableMember = clientMember; // || (this.props.clientCurr.memberKey === MEMBER.SPOUSE.Key &&
    //     this.props.id === 2);
    // console.log(CONTROLTITLE[this.props.language].member, this.props.language,this.dataValues.DD[2])
    // disable Client
    this.dataValues.DD[2].disableOptionValue[QUOTE_CLIENT] = true;
    this.dataValues.DD[2].disableOptionValue[
      QUOTE_SPOUSE
    ] = nonSpouseIsTheSurvivor ? this.props.clientCurr.id !== 2 : true;
    let desc =
      this.props.clientCurr.id === 1
        ? TITLES[this.props.language].insured
        : this.props.clientCurr.id === 2
        ? TITLES[this.props.language].benef
        : "";
    if (APPLET_EP)
      desc =
        this.props.clientCurr.id === 1
          ? singlePerson
            ? TITLES[this.props.language].insured
            : TITLES[this.props.language].insuredJLTD
          : this.props.clientCurr.id === 2
          ? TITLES[this.props.language].insuredJLTD
          : "";
    const greyedName = desc;
    const nameHolder = this.state.name === "" ? desc : this.state.name;

    const textColourStyle =
      this.state.name === "" || this.state.name === greyedName
        ? { color: "#99A4be" }
        : { color: "black" };
    if (this.state.loading === true && this.props.disableAddRemove === true) {
      return "";
    } else {
      return (
        <div className="inputRow">
          <div className="dropDown inputDiv">
            <div className="controlTitle">
              {CONTROLTITLE[this.props.language].name}
            </div>
            <input
              key={5}
              id={5}
              className="inputField  textareaAssetName"
              /*                 style={textColourStyle} */
              placeholder={greyedName}
              value={this.state.name}
              onClick={(e) => this.handleFocus(e)}
              onFocus={(e) => this.handleFocus(e)}
              type="text"
              onBlur={(evt) => this.updateName(evt)}
              onChange={(evt) => this.setState({ name: evt.target.value })}

              //onBlur={(evt) => this.updateName(evt)}
            />

            {/* 
              <input
                id={12}
                type="text"
                className="inputField  textareaAssetName"
                onChange={this.updateDesc}
                value={assetCurr.description}
              /> */}
          </div>
          <InputField
            id={0}
            inputName={bilingual.age}
            format={1}
            Count={this.props.clientsNo}
            language={this.props.language}
            inputValue={this.props.clientCurr.Age}
            handleUpdateInput={this.handleUpdateInput}
          />
          {this.dataValues.DD.map((dd) => {
            return (nonSpouse && dd.Title === bilingual.smoking) ||
              dd.Title === bilingual.age ? (
              ""
            ) : (
              <DropDown
                key={dd.id}
                id={dd.id}
                Count={this.props.clientsNo}
                Title={dd.Title}
                defValue={dd.defValue}
                disable={dd.Title === bilingual.member ? disableMember : false}
                infoIcon={
                  dd.Title === bilingual.member &&
                  dd.defValue ===
                    getListItemNameFromKey(
                      MEMBER,
                      MEMBER.CLIENT.Key,
                      this.props.language
                    )
                    ? getInfoIconClientsMember(this.props.language)
                    : undefined
                }
                // hasSurivor={this.props.hasSurivor}
                Values={dd.Values}
                language={this.props.language}
                disableOption={dd.disableOptionValue}
                updateDDown={this.updateDDown}
              />
            );
          })}

          {
            /* nonSpouse && !nonSpouseHasIncome   && !nonSpouseIsTheSurvivor ? (
          ""
        ) :  */ <InputField
              id={1}
              inputName={bilingual.income}
              format={2}
              Count={this.props.clientsNo}
              infoIcon={
                this.props.id === 1
                  ? getInfoIncome(this.props.language)
                  : undefined
              }
              language={this.props.language}
              inputValue={this.props.clientCurr.Income}
              handleUpdateInput={this.handleUpdateInput}
            />
          }
          {
            /* nonSpouse && !nonSpouseHasIncome  && !nonSpouseIsTheSurvivor ? (
          ""
        ) : */ <InputField
              id={2}
              inputName={bilingual.avgTax}
              format={3}
              Count={this.props.clientsNo}
              //info={MESSAGES[this.props.language].infoAvgTax}
              infoIcon={
                this.props.id === 1 && !singlePerson
                  ? getInfoIconClientsTax(this.props.language)
                  : undefined
              }
              showInfo={!disableMember} //infoOnlyForRowID={2}
              language={this.props.language}
              inputValue={
                Math.round(10000 * this.props.clientCurr.avgTaxRate) / 10000
              }
              handleUpdateInput={this.handleUpdateInput}
            />
          }
          {singlePerson || (nonSpouse && !nonSpouseIsTheSurvivor) ? (
            ""
          ) : (
            <InputField
              id={3}
              inputName={
                nonSpouseIsTheSurvivor || singlePerson
                  ? bilingual.protectToAge
                  : bilingual.retAge
              }
              format={1}
              Count={this.props.clientsNo}
              language={this.props.language}
              inputValue={this.props.clientCurr.retirementAge}
              infoIcon={
                this.props.id !== 1
                  ? getInfoIconClientsRetire(
                      this.props.language,
                      this.infoRetireRed
                    )
                  : undefined
              }
              titleColour= {nonSpouseIsTheSurvivor || singlePerson?"red":""}
              handleUpdateInput={this.handleUpdateInput}
            />
          )}
          {nonSpouse ? (
            ""
          ) : (
            <InputField
              id={4}
              inputName={this.props.isQC?bilingual.qppElig:bilingual.cppElig}
              format={3}
              Count={this.props.clientsNo}
              //info={MESSAGES[this.props.language].infoElig}
              infoIcon={
                this.props.id === 1
                  ? (singlePerson?getInfoIconClientsEligSinglePerson(this.props.language):getInfoIconClientsElig(this.props.language))
                  : getInfoIconSpouseElig(this.props.language)
              }
              showInfo={disableMember}
              language={this.props.language}
              inputValue={
                Math.round(10000 * this.props.clientCurr.Eligibility) / 10000
              }
              handleUpdateInput={this.handleUpdateInput}
            />
          )}
          {/* {isVersion2019() === false && disableMember ? ( */}
          {clientMember === true &&
            this.props.clientsNo > 1 &&
            !this.props.singleFamily &&
            APPLET_INA && (
              <button
                className="switchClient"
                style={{
                  width: this.props.language === "en" ? "115px" : "125px",
                }}
                onClick={this.doSwitch}
              >
                {/* <font size="-4">&#8645;</font> */}
                {bilingual.switch}
                {/* Switch Client */}
              </button>
            )}
          <AddRemove
            currentID={this.props.id}
            numberComps={this.props.clientsNo}
            fixedFirstRow={true}
            lang={this.props.language}
            minComps={1} //{appletMode==="INA"?2:1}
            disabled={this.props.disableAddRemove}
            maxRows={APPLET_INA ? 100 : 2}
            handleDoAdd={this.handleDoAdd}
            handleDoRemove={this.handleDoRemove}
           />
          {/* {isMobileDevice() && this.props.id < this.props.clientsNo ? (
          <hr className="ppi2" />
        ) : (
          ""
        )} */}
        </div>
      );
    }
  }
}
