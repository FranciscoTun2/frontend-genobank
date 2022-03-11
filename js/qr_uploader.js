let taxonomy = null;
const scanImage = async () => {
    taxonomy = new window.$genobank.LaboratoryProcedureTaxonomy();


    let file = document.getElementById('file').files[0];

    // const url = 'https://api-genobank-test.herokuapp.com/read_qrcode';
    const url = 'http://localhost:5000/read_qrcode';
    const formData = new FormData();
    formData.append('file', file);
    taxonomy = new window.$genobank.LaboratoryProcedureTaxonomy();

    let data = await axios.post(url, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        params:{
            'data': 'Data sample'
        }
    })
    .then(response=>{
        return response
    }).catch(err=>{
        console.log(err)
    })

    console.log(data.data[0])

    let certificateUri = data.data[0]
    let array = data.data[1]
    console.log(array.arrayData)

    // let uerelel = "http://localhost:5501/test/certificates/verify-certificate-v1.html#Francisco%20Argenis%20Tun%20Chan%7C1234%7C1%7CN%7C%7C1614069145429%7C41%7C%7BPasaporte,Francisco%20Argenis,https://gateway.pinata.cloud/ipfs/QmZtYoxqzqnseRKtAVMki3oXoFyfnawPxw32ymLXb7haFi,G29397810,1976-02-19%7D%7C%5B%7B1,Primera%20dosis,Astra%20Zeneca,123412351235,12/02/2021%7D,%7B2,Primera%20dosis,Astra%20Zeneca,123412351235,12/02/2021%7D,%7B3,Refuerzo,Astra%20Zeneca,123412351235,12/02/2021%7D%5D%7C%7Bwww.descargapruebacovid.com%7D%7C0x623c1872e54d9f61a0e06fa4b043e8b09a708ae05f730665e6db74928ee4996000827d0e82d227eedfa50436b90ba1d55034ff8fca185e9a4015dbe9330ca6b81b%7C1646675493457%7C0x35034290136831454afca010d8ae37fa4f45d00c8c0628d77bc9ee39fc6754d525158764c0ecd41836c67178513b7a01c08606413fb9959df2c0ac6cd23ec7281c%7C0xbe1ed634f3ccd6998133782604d235f556d3d5dae5f33f189f64ae91ab41e150"
    let uerelel = "https://genobank.io/certificates/verify-certificate-v1#Daniel%20Francisco%20Uribe%20Benitez%7CG29397810%20MALE%2045%7C2%7CN%7CFM-MDE-89722%7C1642255500000%7C5%7C0x87451c8d50b21f104a8e80f735c774ed223f706532c66b2a8c23980b595b9b412e379373d225d1c1341d96b6d89b3d34dc0483215652281bbd75b97e0fae5c491b%7C1642255576067%7C0x6225a9eacd9ccaec67eca298968f14d98093575f41bd856ffbddd90ded10b17817e122a4fe7a49161eacebf6e060d99182fe92d7d6e122d639f875a3b0c9c2831c%7C0x301068a4e5c335ece530dbb930d62c5d4c96b903fc01b1c03460d15c9f435113"
    let datos = await loadData(certificateUri).then(data => {
        return data
    }).catch(err => {
        console.log(err)
    })
    console.log("datos",datos)

    const procedure = taxonomy.getProcedureDescription(datos.permitteeRepresentation.procedure, 'en');
    const procedureResult = taxonomy.getProcedureResultDescription(datos.permitteeRepresentation.procedureResult, 'en');


    let divScann = document.getElementById('divScann');
    let divForm = document.getElementById('divForm');
    divScann.style.display = 'none';
    divForm.style.display = 'block';

    let inputName = document.getElementById('name');
    let idnumber = document.getElementById('idnumber');
    let test = document.getElementById('test');
    let inputresult = document.getElementById('inputresult');
    let lab = document.getElementById('lab');
    let testdate = document.getElementById('testdate');


    inputName.value = array.arrayData[0];
    idnumber.value = array.arrayData[1];
    test.value = array.arrayData[2];
    inputresult.value = array.arrayData[3];
    lab.value = array.arrayData[4];
    testdate.value = array.arrayData[5];



    // let jsonProcedure = {"internationalName":"COVID-19-PCR","descriptionLocalizations":[{"language":"en","translation":"SARS-CoV-2 Polymerase Chain Reaction test"},{"language":"es","translation":"Prueba de reacción en cadena de la polimerasa SARS-CoV-2"},{"language":"pt","translation":"Teste de reação em cadeia de polimerase SARS-CoV-2"},{"language":"zh","translation":"SARS-CoV-2 聚合酶链反应试验"}],"code":"1","results":[{"internationalName":"NEGATIVE","descriptionLocalizations":[{"language":"en","translation":"SARS-CoV-2 was not detected"},{"language":"es","translation":"SARS-CoV-2 no se detectó"},{"language":"pt","translation":"SARS-CoV-2 não foi detectado"},{"language":"zh","translation":"未检测到SARS-CoV-2"}],"code":"N"},{"internationalName":"POSITIVE","descriptionLocalizations":[{"language":"en","translation":"SARS-CoV-2 was detected"},{"language":"es","translation":"SARS-CoV-2 se detectó"},{"language":"pt","translation":"SARS-CoV-2 foi detectado"},{"language":"zh","translation":"检测到SARS-CoV-2"}],"code":"P"}],"status":2}
    
    

    console.log(procedure)
    console.log(procedureResult)


    // // console.log(procedure);
    // // console.log(procedureResult);

    





}

document.getElementById("btn-scan").addEventListener("click", scanImage);