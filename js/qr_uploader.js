
// let host = "https://api-genobank-test.herokuapp.com/"
// let host = "http://192.168.50.219:5000/"
let host = "http://localhost:5000/"
let APIGENOPERMITEE = "https://api.genobank.io/permittees/";
let APIGENOPROFILES = "https://api.genobank.io/profiles/";

let taxonomy = null;

let divScann = document.getElementById('divScann');
let divForm = document.getElementById('divForm');

let file = document.getElementById('file')

let inputName = document.getElementById('name');
let idnumber = document.getElementById('idnumber');
let test = document.getElementById('test');
let inputresult = document.getElementById('inputresult');
let labName = document.getElementById('labName');
let labInvest = document.getElementById('labInvest');
let labImage = document.getElementById('logoLab');
let testdate = document.getElementById('testdate');
let spinnerscann = document.getElementById('spinerscann');
let email = document.getElementById('email');

let dataPatient = null

const scanImage = async () => {
    taxonomy = new window.$genobank.LaboratoryProcedureTaxonomy();


    file = file.files[0];
    if (file != null) {
        // const url = 'https://api-genobank-test.herokuapp.com/read_qrcode';
        // const url = host+'read_qrcode';
        const url = host+'validate_pdf';

        spinnerscann.style.display = 'block';

        const formData = new FormData();
        formData.append('file', file);
        taxonomy = new window.$genobank.LaboratoryProcedureTaxonomy();

        let data = await axios.post(url, formData)
        .then(response=>{
            console.log(response)
            spinnerscann.style.display = 'none';
            return response
        }).catch(err=>{
            spinnerscann.style.display = 'none';
            console.log(err)
        })

        let certificateUri = data.data[0]
        let array = data.data[1]

        // let uerelel = "http://localhost:5501/test/certificates/verify-certificate-v1.html#Francisco%20Argenis%20Tun%20Chan%7C1234%7C1%7CN%7C%7C1614069145429%7C41%7C%7BPasaporte,Francisco%20Argenis,https://gateway.pinata.cloud/ipfs/QmZtYoxqzqnseRKtAVMki3oXoFyfnawPxw32ymLXb7haFi,G29397810,1976-02-19%7D%7C%5B%7B1,Primera%20dosis,Astra%20Zeneca,123412351235,12/02/2021%7D,%7B2,Primera%20dosis,Astra%20Zeneca,123412351235,12/02/2021%7D,%7B3,Refuerzo,Astra%20Zeneca,123412351235,12/02/2021%7D%5D%7C%7Bwww.descargapruebacovid.com%7D%7C0x623c1872e54d9f61a0e06fa4b043e8b09a708ae05f730665e6db74928ee4996000827d0e82d227eedfa50436b90ba1d55034ff8fca185e9a4015dbe9330ca6b81b%7C1646675493457%7C0x35034290136831454afca010d8ae37fa4f45d00c8c0628d77bc9ee39fc6754d525158764c0ecd41836c67178513b7a01c08606413fb9959df2c0ac6cd23ec7281c%7C0xbe1ed634f3ccd6998133782604d235f556d3d5dae5f33f189f64ae91ab41e150"
        // let uerelel = "https://genobank.io/certificates/verify-certificate-v1#Daniel%20Francisco%20Uribe%20Benitez%7CG29397810%20MALE%2045%7C2%7CN%7CFM-MDE-89722%7C1642255500000%7C5%7C0x87451c8d50b21f104a8e80f735c774ed223f706532c66b2a8c23980b595b9b412e379373d225d1c1341d96b6d89b3d34dc0483215652281bbd75b97e0fae5c491b%7C1642255576067%7C0x6225a9eacd9ccaec67eca298968f14d98093575f41bd856ffbddd90ded10b17817e122a4fe7a49161eacebf6e060d99182fe92d7d6e122d639f875a3b0c9c2831c%7C0x301068a4e5c335ece530dbb930d62c5d4c96b903fc01b1c03460d15c9f435113"
        let datos = await loadData(certificateUri).then(data => {
            return data
        }).catch(err => {
            console.log(err)
        })

        let laboratoryData = await axios.get(APIGENOPROFILES, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(response=>{
            return response
        }).catch(err=>{
            console.log(err)
        })
    
        let arrayData = laboratoryData.data.data
        let _jsonData= {}
        
        for (let i = 0; i < arrayData.length; i++) {
            _jsonData[arrayData[i].serial] = JSON.parse(arrayData[i].text)
        }
        // console.log(datos.permitteeRepresentation.permitteeSerial)

        laboratoryData = _jsonData[datos.permitteeRepresentation.permitteeSerial]


        const procedure = taxonomy.getProcedureDescription(datos.permitteeRepresentation.procedure, 'en');
        const procedureResult = taxonomy.getProcedureResultDescription(datos.permitteeRepresentation.procedureResult, 'en');


        divScann.style.display = 'none';
        divForm.style.display = 'block';

        inputName.value = array.arrayData[0]
        idnumber.value = array.arrayData[1]
        test.value = procedure
        inputresult.value = procedureResult
        labName.innerHTML = laboratoryData.name;
        labInvest.innerHTML = (laboratoryData.investigator).split('|')[0]
        labImage.src = laboratoryData.logo
        testdate.value = array.arrayData[5]

        dataPatient={
            "name": array.arrayData[0],
            "idnumber": array.arrayData[1],
            "test": procedure,
            "testresult": procedureResult,
            "labName": laboratoryData.name,
            "labInvestigator": (laboratoryData.investigator).split('|')[0],
            "labLogo": laboratoryData.logo,
            "testdate": array.arrayData[5]
        }


    }else{
        alert('Please select a file');
    }

}


const signUp = async () => {
    let btnConfirm = document.getElementById('confirmData');
    let spinnerConfirm = document.getElementById('spinnerConfirm');

    let alertSuccess = document.getElementById('alertSuccess');
    let alertError = document.getElementById('alertError');
    
    const url = host+'sign_up';
    const formData = new FormData();

    let mail = email.value;

    if (mail === ''){
        alert('Please enter your email');
    }else{
        btnConfirm.disabled = true;
        spinnerConfirm.style.display = 'flexbox';
        dataPatient['email'] = mail
        let dataPatientString = JSON.stringify(dataPatient);

        console.log(dataPatientString)

        // formData.append("data",data);
        formData.append("data",dataPatientString);
        let responseSignUp = await axios.post(url, formData)
        .then(response=>{
            // spinnerscann.style.display = 'none';
            alertSuccess.style.display = 'block';
            alertError.style.display = 'none';
            btnConfirm.disabled = false;
            spinnerConfirm.style.display = 'none';
            return response
        }).catch(err=>{
            alertError.innerHTML = err.response.data.message;
            alertError.style.display = 'block';
            alertSuccess.style.display = 'none';
            // spinnerscann.style.display = 'none';
            btnConfirm.disabled = false;
            spinnerConfirm.style.display = 'none';
            console.log(err)
        })
        console.log(responseSignUp)

    }
}

// document.getElementById("btn-scan").addEventListener("click", scanImage);
document.getElementById("confirmData").addEventListener("click", signUp);

// execute scanImage() when a file is selected
document.getElementById("file").addEventListener("change", scanImage);