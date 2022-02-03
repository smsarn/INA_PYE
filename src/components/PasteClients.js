import React from 'react';
import { useEffect, useState } from 'react';

// NOTE: USE FOR LOCAL DEVELOPMENT
// const APP_SITE /*: string */ = "https://test-tkdirectapi.ppi.ca";

// NOTE: USE FOR TESTING / PRODUCTION
const APP_SITE /*: string */ = "";

const NA_QS_URL /*: string */ = APP_SITE + "/api/NA_QS";


// interface IClient {
//   clientFileName: string;
//   clientFileContent: string;
//   clientJson: string;
// }

// interface IClients {
//   id: string,
//   clients: IClient[];
// }

// interface IClientProps {
//   clientFileName: string;
//   clientJson: string;
//   clientIndex: number;
//   setClientFileContent (index: number, fileContent: string): void;
// }

const Client /*: React.FC<IClientProps> */ = (props) => {

  const [encryptedJson, setEncryptedJson] = useState/*<string>*/("");
  const [jsonEncrypted, setJsonEncrypted] = useState/*<boolean>*/(false);
  const [encryptedJsonAssigned, setEncryptedJsonAssigned] = useState/*<boolean>*/(false);

  useEffect(
    () => {

      (async () => {

        var myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Content-Type", "application/json");

        let obj = JSON.parse(props.clientJson);
        let raw = JSON.stringify(obj);


        let data = await fetch(NA_QS_URL, {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
        })
          .then(response => { return response.text(); })
          .catch(error => { return error; });

        if (typeof data === "string") {
          setEncryptedJson(data);
          setJsonEncrypted(true);

        }

      })();

    },
    [
      jsonEncrypted,
    ]
  );

  if (jsonEncrypted === true && encryptedJsonAssigned === false) {
    setEncryptedJsonAssigned(true);
    props.setClientFileContent(props.clientIndex, encryptedJson.substr(1, encryptedJson.length - 2));
  }

  return (
    <div
      style={{
        marginTop: 16,
        marginLeft: 16,
        display: "none",
      }}
    >
      <div>
        {props.clientFileName}
      </div>
      <div>
        {encryptedJson}
      </div>
    </div>
  );

}

function PasteClients() {  

  const [clients, setClients] = useState/*<IClients>*/({ id: "", clients: [] });

  const [note, setNote] = useState/*<string>*/("");

  const pasteClients = () => {

    setNote("");

    navigator.clipboard.readText().then(
      clipText => {

        let parsedObject = null;

        try {
          parsedObject = JSON.parse(clipText);

          if (parsedObject.id !== undefined) {
            if (parsedObject.clients !== undefined) {
              if (parsedObject.clientFileSpecs !== undefined) {

                let id = parsedObject.id;

                if (parsedObject.clients !== undefined) {
                  if (parsedObject.clientFileSpecs !== undefined) {

                    let pastedClients /*: IClient[] */ = [];

                    if (Array.isArray(parsedObject.clients) === true) {
                      if (Array.isArray(parsedObject.clientFileSpecs) === true) {

                        for (let i = 0; i < parsedObject.clients.length; i++) {

                          let clientJson = JSON.stringify(parsedObject.clients[i]);
                          let clientFileName = parsedObject.clientFileSpecs[i].clientFileName;

                          let client /*: IClient*/ = {
                            clientFileName: clientFileName,
                            clientJson: clientJson,
                            clientFileContent: "",
                          };

                          pastedClients.push(client);
                        }

                      }
                    }

                    // Set new clients.
                    setClients({ id: id, clients: pastedClients });

                    // Clear clipboard if we have any clients.
                    if (parsedObject.clients.length > 0) {

                      navigator.clipboard.writeText("<empty clipboard>").then(function () {
                        /* clipboard successfully set */
                      }, function () {
                        /* clipboard write failed */
                      });

                      setNote(`${parsedObject.clients.length} files created.`);
                      return;

                    }
                    else {
                      setNote("No files created.");
                    }

                  }
                }

              }
            }
          }


        }
        catch (e) {
          setNote("No files created. Clipboard content not recognized.");
        }

      }
    );

    setNote("No files created. Clipboard content not recognized.");

    setClients({id:"", clients:[]});

  }

  function setClientFileContent (index /*: number */, clientFileContent /*: string*/){

    let newClients/*: IClient[]*/ = [];
    let allClientFileContentsAssigned = true;

    for (let i = 0; i < clients.clients.length; i++){
      
      let newClient /*: IClient*/ = {
        clientFileName: clients.clients[i].clientFileName,
        clientJson: clients.clients[i].clientJson,
        clientFileContent: clients.clients[i].clientFileContent,
      }

      if (i === index){
        newClient.clientFileContent = clientFileContent;
      }

      newClients.push(newClient);
    }

    for (let i = 0; i < clients.clients.length; i++){
      
      if (newClients[i].clientFileContent === null){
        allClientFileContentsAssigned = false;
        break;
      }
      else if (newClients[i].clientFileContent === ""){
        allClientFileContentsAssigned = false;
        break;
      }

    }

    if (allClientFileContentsAssigned === true){

      let clientFileSpecs = [];

      for (let i = 0; i < clients.clients.length; i++){

        let clientFileSpec = {
          clientFileName: newClients[i].clientFileName,
          clientFileContent: newClients[i].clientFileContent
        };

        clientFileSpecs.push(clientFileSpec);
      }

      let clientFileSpecsCollection = {id: clients.id, clientFileSpecs: clientFileSpecs};
      let clientFileSpecsCollectionJson = JSON.stringify(clientFileSpecsCollection, null, 2);
     
      navigator.clipboard.writeText(clientFileSpecsCollectionJson).then(function () {
        /* clipboard successfully set */
      }, function () {
        /* clipboard write failed */
      });

    }

    setClients({id: clients.id, clients: newClients});

  }

  function clientComponents() /*: any*/ {

    let clientComponents /*: any[]*/ = [];

    for (let i = 0; i < clients.clients.length; i++) {
      clientComponents.push(
        <Client
          key={i}
          clientFileName={clients.clients[i].clientFileName}
          clientJson={clients.clients[i].clientJson}
          clientIndex={i}
          setClientFileContent={setClientFileContent}
        />
      )
    }

    return (
      <React.Fragment>
        {clientComponents}
      </React.Fragment>
    );

  }

  return (
    <div>

      <div
        style={{
          marginTop: 16,
        }}
      >
        <button
          style={{
            marginLeft: 16,
          }}
          onClick={pasteClients}
          style={{backgroundColor:"yellow"}}
        >
          Create Exported Client Files
        </button>

      </div>

      <div
        style={{
          marginTop: 16,
          marginLeft: 16,
        }}
      >
        {note}
        </div>

      <div
        style={{
          marginTop: 16,
        }}
      >
        {clientComponents()}
      </div>

    </div>
  );

}

export default PasteClients;
