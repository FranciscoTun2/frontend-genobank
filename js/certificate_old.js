/**
 * @dev Pretty serialization of data. Includes colors.
 * Example: =io.genobank.certificates.v1.permittee-certification|DANIEL FRANCISCO URIBE BENITEZ|MX/320491837|1=COVID-19/PCR|N=NEGATIVE/SAFE||1611517330=2021-01-24T07:42Z
 * @param data Data to serialize.
 */
 let elements_added = 0
 function serializePermitteeAndCertificateForHtml(data) {
   return [
     `<span class="text-muted">V1=${data.getNamespace()}|</span>`,
     `${data.permitteeRepresentation.patientName}|`,
     `${data.permitteeRepresentation.patientPassport}|`,
     `${data.permitteeRepresentation.procedure.code}<span class="text-muted">=${data.permitteeRepresentation.procedure.internationalName}</span>|`,
     `${data.permitteeRepresentation.procedureResult.code}<span class="text-muted">=${data.permitteeRepresentation.procedureResult.internationalName}</span>|`,
     `${data.permitteeRepresentation.procedureSerial}|`,
     `${data.permitteeRepresentation.procedureTime.getTime()}<span class="text-muted">=${data.permitteeRepresentation.procedureTime.toISOString()}</span>|`,
     `${data.permitteeRepresentation.permitteeSerial}|`,
     `${data.permitteeSignature.signature}|`,
     `${data.platformData.timestamp.getTime()}<span class="text-muted">=${data.platformData.timestamp.toISOString()}</span>|`,
     `${data.platformData.signature}|`,
     `${data.platformData.txHash}`,
   ].join('');
 }
 
/**
 * Decodes URL data.
 * @param  data Data from url (after #).
 * @param procedures LaboratoryProcedureTaxonomy data so we can decode friendly data versions.
 */
async function decodeCertificateUriData(data, taxonomy) {
  try {
    let params = decodeURIComponent(data);
    if (params) {
      const values = params.split('|');
      if (values.length != 11) {
        return null;
      } else {
        const procedure = taxonomy.getProcedureByCode(values[2]);
        const procedureResult = taxonomy.getProcedureResultByCode(procedure, values[3]);

        let network = null;
        if (window.ENV === 'main') {
          network = new window.$genobank.Network(1); // production
        } else {
          network = new window.$genobank.Network(0); // test
        }
        const platformData = {
          txHash: values[10 + elements_added],
          signature: values[9 + elements_added],
          timestamp: new Date(parseInt(values[8 + elements_added])),
          hash: ''
        };

        const permitteeRepresentation = new window.$genobank.PermitteeRepresentation({
          network,
          patientName: values[0],
          patientPassport: values[1],
          procedure,
          procedureResult,
          procedureSerial: values[4],
          procedureTime: new Date(parseInt(values[5])),
          permitteeSerial: values[6],
        });
        // permitteeRepresentation["jsonPassport"] = values[7];
        // permitteeRepresentation["vaccineJsonData"] = values[8];
        // permitteeRepresentation["jsonCovidTest"] = values[9];

        let serialization = await getFullSerialization(permitteeRepresentation);

        const permitteeSignature = {
          signature: values[7 + elements_added],
          claim: getClaim(serialization),
          permitteeSerial: values[6]
        };
        const certificate = new window.$genobank.NotarizedCertificate(permitteeRepresentation, permitteeSignature, platformData);
        return certificate;
      }
    } else {
      return null;
    }
  } catch (e) {
    console.log(e);
    return null;
  }
}

function getPermitteeAddressFromSignature(data) {
  try {
    const msgHashBytesPermittee = ethers.utils.arrayify(data.permitteeSignature.claim);
    const pubKeyPermittee = ethers.utils.recoverPublicKey(msgHashBytesPermittee, data.permitteeSignature.signature);

    return ethers.utils.computeAddress(pubKeyPermittee);
  } catch (e) {
    return null;
  }
}

function getGenoBankioAddressFromSignature(data) {
  try {
    const serializedData = data.getPlatformFullSerialization();
    const msgHash = ethers.utils.hashMessage(serializedData);
    const msgHashBytes = ethers.utils.arrayify(msgHash);
    const pubKey = ethers.utils.recoverPublicKey(msgHashBytes, data.platformData.signature);
    return ethers.utils.computeAddress(pubKey);
  } catch (e) {
    console.log(e);
    return null;
  }
}


async function getFullSerialization(permitteeRepresentation){
  // permitteeRepresentation.jsonPassport = await checkDataExist(permitteeRepresentation.jsonPassport)
    return [
      permitteeRepresentation.network.namespacePrefix+permitteeRepresentation.namespaceSuffix,
      permitteeRepresentation.patientName,
      permitteeRepresentation.patientPassport,
      permitteeRepresentation.procedure.internationalName,
      permitteeRepresentation.procedureResult.internationalName,
      permitteeRepresentation.procedureSerial,
      permitteeRepresentation.procedureTime.toISOString(),
      permitteeRepresentation.permitteeSerial
    ].join('|');
}


const checkDataExist = async (jsonImg) => {
  let jsonImgaux = jsonImg.split(',')
  jsonImgaux = jsonImgaux[2]
  hash = jsonImgaux.substring(jsonImgaux.indexOf('/ipfs/')+6)
  let validated
  const url = 'https://api.pinata.cloud/data/pinList?status=pinned&hashContains='+hash

  validated = await axios
    .get(url, {
        headers: {
          pinata_api_key: 'ba65da047212926c9ee4',
          pinata_secret_api_key: '3897644a77bf3ea3836a17fa1bed1c8897f95e5f148be0728e2f73c48aa7baec'
        }
      })
      .then(function (response) {
        if (response.data.count > 0) {
          return true
        } else {
          return false
        }
      })
      .catch(function (error) {
          console.log(error);
      });


  if (validated){
    return jsonImg
  }else{
    return False
  }

}


function getClaim(serialization){
  return ethers.utils.hashMessage(serialization)
}