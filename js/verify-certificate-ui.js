let data = null;
let taxonomy = null;
var userLang = navigator.language || navigator.userLanguage;

var defaultLanguage = null;
var stringLanguage = null;

defaultLanguage = $(userLang.split('-'));
stringLanguage = defaultLanguage[0];

const toDataURL = url => fetch(url)
  .then(response => response.blob())
  .then(blob => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  }));
const toBuffer = url => fetch(url)
  .then(response => response.blob())
  .then(blob => blob.arrayBuffer());

$(async function () {
  if (stringLanguage != 'en' || stringLanguage != 'zh' || stringLanguage != 'es' || stringLanguage != 'pt') {
    stringLanguage = 'en';
  }
  $('#resultOk').hide();
  setupLanguageButtons();
  taxonomy = new window.$genobank.LaboratoryProcedureTaxonomy();
  if (window.ENV === 'test') {
    $('#watermark').addClass('watermark');
  }
  // if (await loadData()) {
  //   if (await verifyData()) {
  //     $('#loader').hide();
  //     $('#resultOk').show();
  //     await showData();
  //     loadAndShowLabData();
  //   }
  // }
});

function setupLanguageButtons() {
  $("#translate-en").click(function () {
    $(".localized").hide();
    $(".en").show();
    $(".btn-translate").removeClass('active');
    $(this).addClass('active');
    stringLanguage = 'en';
    loadLocalizedData();
  });

  $("#translate-zh").click(function () {
    $(".localized").hide();
    $(".zh").show();
    $(".btn-translate").removeClass('active');
    $(this).addClass('active');
    stringLanguage = 'zh';
    loadLocalizedData();
  });

  $("#translate-pt").click(function () {
    $(".localized").hide();
    $(".pt").show();
    $(".btn-translate").removeClass('active');
    $(this).addClass('active');
    stringLanguage = 'pt';
    loadLocalizedData();
  });

  // $("#translate-tl").click(function () {
  //   $(".localized").hide();
  //   $(".tl").show();
  //   $(".btn-translate").removeClass('active');
  //   $(this).addClass('active');
  // });

  $("#translate-es").click(function () {
    $(".localized").hide();
    $(".es").show();
    $(".btn-translate").removeClass('active');
    $(this).addClass('active');
    stringLanguage = 'es';
    loadLocalizedData();
  });
}

async function showData() {
  new QRCode(document.getElementById("qrCode"), {
    text: location.href,
    width: 420,
    height: 420,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.M
  });

  $('#patientName').html(data.permitteeRepresentation.patientName);
  
  // parse info to JSON to read
  

  jsonPassport = passportToJson(data.permitteeRepresentation.jsonPassport)
  vaccineJson = vaccineToJson(data.permitteeRepresentation.vaccineJsonData)




  vacBlock = document.getElementById('vaccBlock')
  function block(vaccineData){
    let block = '<div class="col-md-4">'+'<p class="font-weight-light my-0"><span class="localized en" style="">Test Type '+vaccineData.vaccineId+'</span></p>'+
    '<p class="font-weight-light my-0"><span class="localized zh" style="">测试类型 '+vaccineData.vaccineId+'</span></p>'+
    '<p class="font-weight-light my-0"><span class="localized pt" style="">Tipo de teste '+vaccineData.vaccineId+'</span></p>'+
    '<p class="font-weight-light my-0"><span class="localized tl" style="">परीक्षण प्रकार '+vaccineData.vaccineId+'</span></p>'+
    '<p class="font-weight-light my-0"><span class="localized es" style="">Tipo de prueba '+vaccineData.vaccineId+'</span></p>'+
    '<p class="font-weight-bold lead" >'+vaccineData.brand+'</p>'+

    '<p class="font-weight-light my-0"><span class="localized en" style="">Dose</span></p>'+
    '<p class="font-weight-light my-0"><span class="localized zh" style="">剂量</span></p>'+
    '<p class="font-weight-light my-0"><span class="localized pt" style="">Dose</span></p>'+
    '<p class="font-weight-light my-0"><span class="localized tl" style="">खुराक</span></p>'+
    '<p class="font-weight-light my-0"><span class="localized es" style="">Dosis</span></p>'+
    '<p class="font-weight-bold lead">'+vaccineData.dose+'</p>'+

    '<p class="font-weight-light my-0"><span class="localized en" style="">Date</span></p>'+
    '<p class="font-weight-light my-0"><span class="localized zh" style="">日期</span></p>'+
    '<p class="font-weight-light my-0"><span class="localized pt" style="">Data</span></p>'+
    '<p class="font-weight-light my-0"><span class="localized tl" style="">तारीख</span></p>'+
    '<p class="font-weight-light my-0"><span class="localized es" style="">Fecha</span></p>'+
    '<p class="font-weight-bold lead">'+vaccineData.doseDate+'</p>'+

    '<p class="font-weight-light my-0"><span class="localized en" style="">Lot Number</span></p>'+
    '<p class="font-weight-light my-0"><span class="localized zt" style="">批号</span></p>'+
    '<p class="font-weight-light my-0"><span class="localized pt" style="">Número de lote</span></p>'+
    '<p class="font-weight-light my-0"><span class="localized tl" style="">बहुत संख्या</span></p>'+
    '<p class="font-weight-light my-0"><span class="localized es" style="">Numero de lote</span></p>'+
    '<p class="font-weight-bold lead">'+vaccineData.lot+'</p>'
    '</div>'

    return block;
  }
  for (let i = 0; i< vaccineJson.vacunas.length; i++){
    vacBlock.innerHTML += block(vaccineJson.vacunas[i])
    // if i is multiple of 3, add a jump line
    if ((i+1) % 3 == 0){
      vacBlock.innerHTML += '</div></div>'
    }
  }


  const img = document.getElementById('patientUriImage');
  img.src = jsonPassport.front;
  
  $('#passportName').html(jsonPassport.name);
  $('#dateOfBirth').html(jsonPassport.date_of_birth);

  function passportToJson(dataPassport){
    dataPassport = dataPassport.substring(1, dataPassport.length - 1);
    dataPassport = dataPassport.split(',');
    return {
      "type": dataPassport[0],
      "name": dataPassport[1],
      "front": dataPassport[2],
      "identification": dataPassport[3],
      "date_of_birth": dataPassport[4],
    }
  }

  function vaccineToJson(dataVaccine){
    dataVaccine = dataVaccine.substring(2, dataVaccine.length - 2);
    dataVaccine = dataVaccine.replace(/\s*,\s*/g, ',');
    dataVaccine = dataVaccine.replace(/\},\{/g, '|');
    dataVaccine = dataVaccine.split('|'); 
    vaccineArray = [];
    _jsonVaccine = {};
    for (let i = 0; i < dataVaccine.length; i++) {
      dataVaccine[i] = dataVaccine[i].split(',');
      vaccineArray.push({
        "vaccineId": dataVaccine[i][0],
        "dose": dataVaccine[i][1],
        "brand": dataVaccine[i][2],
        "lot": dataVaccine[i][3],
        "doseDate": dataVaccine[i][4],
      });
    }
    _jsonVaccine["vacunas"] = vaccineArray;
    return _jsonVaccine
  }




  $('#patientPassport').html(data.permitteeRepresentation.patientPassport);
  loadLocalizedData();
  $('#procedureSerial').html(data.permitteeRepresentation.procedureSerial || '/');
  const hours = (Math.abs(new Date().getTime() - data.permitteeRepresentation.procedureTime.getTime()) / 36e5).toFixed(1);
  const removeseconds = moment.utc(data.permitteeRepresentation.procedureTime.toISOString(), "YYYYMMDD T hh:mm z").local().format(`YYYY-MM-DD HH:mm (UTC Z)`);
// <span class="localized tl"> संग्रह</span>
  $('#procedureTime').html(`${removeseconds} <br/>
    <span class="text-danger">(${hours}h 
      <span class="localized en"> since</span>
      <span class="localized zh"> 前</span>
      <span class="localized pt"> appre</span>
      <span class="localized es"> desde</span>)
    </span>`);


  const platformReadableTime = moment(data.platformData.timestamp.toISOString(), "YYYYMMDD T h:mm z").format('MMMM Do YYYY, hh:mm a');
  $('#platformTime').html(platformReadableTime);
  const certificate = await getCertificates(data.platformData.hash);
 
  let txHtml = '';
  const txLink = `https://rinkeby.etherscan.io/tx/${data.platformData.txHash}`;
  txHtml = `<a target="_blank" class="tx-primary" href="${txLink}">${txLink}</a>`;

  if (certificate.data && certificate.data.length > 0 && certificate.data[0].transactions && certificate.data[0].transactions.length > 1) {
    const avalanche = certificate.data[0].transactions.find((t) => t.kind == 2);
    if (avalanche) {
      const avalancheTxLink = `https://cchain.explorer.avax-test.network/tx/${avalanche.hash}`;
      txHtml = `${txHtml}<br><a target="_blank" class="tx-primary" href="${avalancheTxLink}">${avalancheTxLink}</a>`;
    }
  }

  $('#tx').html(txHtml);
  $('#serializedData').html(serializePermitteeAndCertificateForHtml(data));
}

function loadLocalizedData() {
  const procedure = taxonomy.getProcedureDescription(data.permitteeRepresentation.procedure, stringLanguage);
  const procedureResult = taxonomy.getProcedureResultDescription(data.permitteeRepresentation.procedureResult, stringLanguage);
  
  let procJson = data.permitteeRepresentation.procedure
  // procJson to String
  procJson = JSON.stringify(procJson);
  
  $('#procedureType').html(procedure);
  $('#procedureResult').html(procedureResult);
}

async function loadAndShowLabData() {
  let name = `${data.permitteeRepresentation.permitteeSerial}`;
  let logo = '';
  data['labLogo'] = '';
  let investigator = '/';
  const profile = await getPermitteeProfile(data.permitteeRepresentation.permitteeSerial, 'verify');
  if (profile && !profile.errors) {
    try {
      const profileResult = JSON.parse(profile.data.text);
      if (profileResult.name) {
        name = `${profileResult.name}/${data.permitteeRepresentation.permitteeSerial}`;
      }
      if (profileResult.logo) {
        data['labLogo'] = profileResult.logo;
        logo = `<img src="${profileResult.logo}" style="width: 100%; max-width: 100%;">`;
      }
      if (profileResult.investigator) {
        investigator = profileResult.investigator;
      }
    } catch (e) { }
  }
  data['labName'] = name;
  data['labInvestigator'] = investigator;
  $('#laboratory').html(name);
  $('#logo').html(logo);
  $('#investigator').html(investigator);
}

async function verifyData() {
  const errors = [];

  // Gets permittee address.
  const addressPermittee = getPermitteeAddressFromSignature(data);
  if (!addressPermittee) {
    errors.push(`<span class="localized en"> <span class="text-danger"><i class="fa fa-times"></i> Certificate signature invalid.</span></span>`);
    errors.push(`<span class="localized zh"> <span class="text-danger"><i class="fa fa-times"></i> 证书签名无效。</span></span>`);
    errors.push(`<span class="localized pt"> <span class="text-danger"><i class="fa fa-times"></i> Firma del certificado inválido.</span></span>`);
    errors.push(`<span class="localized tl"> <span class="text-danger"><i class="fa fa-times"></i> प्रमाणपत्र हस्ताक्षर अमान्य है।</span></span>`);
    errors.push(`<span class="localized es"> <span class="text-danger"><i class="fa fa-times"></i> Assinatura do certificado inválida.</span></span>`);
  }
  const permittee = await getPermittee(data.permitteeSignature.permitteeSerial);
  console.log(permittee);
  if (permittee && !permittee.errors) {
    if (permittee.data.owner !== addressPermittee && errors.length == 0) {
      errors.push(`<span class="localized en"> <span class="text-danger"><i class="fa fa-times"></i> Invalid laboratory signature or data.</span></span>`);
      errors.push(`<span class="localized zh"> <span class="text-danger"><i class="fa fa-times"></i> 无效的实验室签名或数据。</span></span>`);
      errors.push(`<span class="localized pt"> <span class="text-danger"><i class="fa fa-times"></i> Firma o datos de laboratorio no válidos.</span></span>`);
      errors.push(`<span class="localized tl"> <span class="text-danger"><i class="fa fa-times"></i> अमान्य प्रयोगशाला हस्ताक्षर या डेटा।</span></span>`);
      errors.push(`<span class="localized es"> <span class="text-danger"><i class="fa fa-times"></i> Assinatura ou dados laboratoriais inválidos.</span></span>`);
    }
  } else if (errors.length == 0) {
    errors.push(`<span class="localized en"> <span class="text-danger"><i class="fa fa-times"></i> Invalid signer.</span></span>`);
    errors.push(`<span class="localized zh"><span class="text-danger"><i class="fa fa-times"></i> 无效的签名者。</span></span>`);
    errors.push(`<span class="localized pt"><span class="text-danger"><i class="fa fa-times"></i> Firmante inválido.</span></span>`);
    errors.push(`<span class="localized tl"><span class="text-danger"><i class="fa fa-times"></i> अमान्य हस्ताक्षरकर्ता।</span></span>`);
    errors.push(`<span class="localized es"><span class="text-danger"><i class="fa fa-times"></i> Signatário inválido.</span></span>`);
  }
  // additional check could be if this address has a permittee token directly on blockchain.

  const address = getGenoBankioAddressFromSignature(data);
  if (!address && errors.length == 0) {
    errors.push(`<span class="localized en"><span class="text-danger"><i class="fa fa-times"></i> Certificate signature invalid.</span></span>`);
    errors.push(`<span class="localized zh"> <span class="text-danger"><i class="fa fa-times"></i>证书签名无效。</span></span>`);
    errors.push(`<span class="localized pt"><span class="text-danger"><i class="fa fa-times"></i> Firma del certificado inválido.</span></span>`);
    errors.push(`<span class="localized tl"><span class="text-danger"><i class="fa fa-times"></i> प्रमाणपत्र हस्ताक्षर अमान्य है।</span></span>`);
    errors.push(`<span class="localized es"><span class="text-danger"><i class="fa fa-times"></i> Assinatura do certificado inválida.</span></span>`);
  }

  // Additional check could be checking if genobankSignature signature was emitted in the txHash.
  if (address !== window.GENOBANK_ADDRESS && errors.length == 0) {
    errors.push(`<span class="localized en"><span class="text-danger"><i class="fa fa-times"></i> Certificate signature invalid.</span></span>`);
    errors.push(`<span class="localized zh"><span class="text-danger"><i class="fa fa-times"></i> 证书签名无效。</span></span>`);
    errors.push(`<span class="localized pt"><span class="text-danger"><i class="fa fa-times"></i> Firma del certificado inválido.</span></span>`);
    errors.push(`<span class="localized tl"><span class="text-danger"><i class="fa fa-times"></i> प्रमाणपत्र हस्ताक्षर अमान्य है।</span></span>`);
    errors.push(`<span class="localized es"><span class="text-danger"><i class="fa fa-times"></i> Assinatura do certificado inválida.</span></span>`);
  }

  if (data.procedureTime > data.timestamp && errors.length == 0) {
    errors.push(`<span class="localized en"><span class="text-danger"><i class="fa fa-times"></i> Certificate timestamp invalid.</span></span>`);
    errors.push(`<span class="localized zh"><span class="text-danger"><i class="fa fa-times"></i> 证书时间戳无效。</span></span>`);
    errors.push(`<span class="localized pt"><span class="text-danger"><i class="fa fa-times"></i> Certificado de marca de tiempo inválido.</span></span>`);
    errors.push(`<span class="localized tl"><span class="text-danger"><i class="fa fa-times"></i> प्रमाणपत्र टाइमस्टैम्प अमान्य है।</span></span>`);
    errors.push(`<span class="localized es"><span class="text-danger"><i class="fa fa-times"></i> Carimbo de data / hora do certificado inválido.</span></span>`);
  }

  let html = '';
  if (errors.length > 0) {

    for (let i = 0; i < errors.length; i++) {
      html = `
          ${html}
          ${errors[i]}
        `
    }

    $('#validationResult').html(html);
    return false;
  } else {
    $(document).ready(function(){
      if(stringLanguage.length) {
        $(".localized").hide();
        $('.' + stringLanguage).show();
        $(".btn-translate").removeClass('active');
        $('#translate-' + stringLanguage).addClass('active');
      } else {
        $(".localized").hide();
        $(".en").show();
        $(".btn-translate").removeClass('active');
        $('#translate-en').addClass('active');
      } 
    });
    $('#carouselExampleFade').show();
    return true;
  }
}

async function loadData(uri) {
  const splitUrl = uri.split('#')
  if (splitUrl.length == 2) {
    data = await decodeCertificateUriData(splitUrl[1], taxonomy);
    if (!data) {
      invalidDataError();
      return false;
    }
    return data

  } else {
    invalidDataError();
    return false;
  }
  return true;
}



function invalidDataError() {
  $('#invalidData').modal('show');
}

/**
 * Generates pdf from data.
 * @param data Data to generate pdf from.
 */
async function generatePdf() {

  const logo = await toDataURL('./assets/GenoBank.io-pdf-logo.png');
  const labelName = await toDataURL('./assets/pdf-label-name.png');
  const labelPassport = await toDataURL('./assets/pdf-label-passport.png');
  const labelResult = await toDataURL('./assets/pdf-label-result.png');
  const labelTestkit = await toDataURL('./assets/pdf-label-testkit.png');
  const labelTime = await toDataURL('./assets/pdf-label-time.png');
  const labelCopyright = await toDataURL('./assets/pdf-label-copyright.png');
  const labelExamination = await toDataURL('./assets/pdf-label-examination.png');
  const labelFacts = await toDataURL('./assets/pdf-label-facts.png');
  const labelInvestigator = await toDataURL('./assets/pdf-label-lab-director.png');
  const labelLaboratory = await toDataURL('./assets/pdf-label-lab.png');
  const labelPlatformTime = await toDataURL('./assets/pdf-label-platform-timestamp.png');
  const labelMoreInformation = await toDataURL('./assets/pdf-label-more-information.png');
  const divider = await toDataURL('./assets/pdf-divider.png');
  const roboto = await toBuffer('./assets/Roboto-Regular.ttf');
  let demo = null;
  if (window.ENV === 'test') {
    demo = await toDataURL('./assets/demo.jpeg');
  }

  // create a document the same way as above
  const doc = new PDFDocument({
    margins: {
      top: 60,
      bottom: 60,
      left: 40,
      right: 40,
    }
  });

  // pipe the document to a blob
  const stream = doc.pipe(blobStream());

  // add your content to the document here, as usual
  doc.font(roboto);
  doc.fontSize(14);

  if (data.labLogo && data.labLogo != '') {
    doc.image(data.labLogo, 450, 40, { width: 120 });
  }
  const procedureTime = moment(data.permitteeRepresentation.procedureTime.toISOString(), "YYYYMMDD T h:mm z").format('YYYY-MM-DD HH:mm (UTC Z)');
  const platformTime = moment(data.platformData.timestamp.toISOString(), "YYYYMMDD T h:mm z").format('YYYY-MM-DD HH:mm (UTC Z)');
  doc.image(labelName, 40, 40, { height: 10 });
  doc.text(data.permitteeRepresentation.patientName, 40, 53, { width: 330, height: 34 });

  doc.image(labelPassport, 40, 87, { height: 10 });
  doc.text(data.permitteeRepresentation.patientPassport, 40, 100, { width: 330, height: 34 });

  doc.image(labelTestkit, 40, 134, { height: 10 });
  doc.text(data.permitteeRepresentation.procedureSerial == '' ? '/' : data.permitteeRepresentation.procedureSerial, 40, 147, { width: 330, height: 34 });

  doc.image(labelResult, 40, 181, { height: 10 });
  doc.text(data.permitteeRepresentation.procedureResult.internationalName, 40, 194, { width: 330, height: 34 });

  doc.image(labelExamination, 40, 228, { height: 10 });
  doc.text(data.permitteeRepresentation.procedure.internationalName, 40, 241, { width: 330, height: 34 });

  doc.image(labelTime, 40, 275, { height: 10 });
  doc.text(`${procedureTime}`, 40, 288, { width: 330, height: 34 });

  doc.image(labelPlatformTime, 40, 322, { height: 20 });
  doc.text(`${platformTime}`, 40, 345, { width: 330, height: 34 });

  doc.image(divider, 0, 394, { height: 2 });
  if (demo) {
    doc.image(demo, 340, 200, { width:244, height: 169 });
  }
  doc.image(labelLaboratory, 40, 440, { height: 20 });
  doc.text(data.labName, 40, 463, { width: 380, height: 37 });

  doc.image(labelInvestigator, 40, 500, { height: 20 });
  doc.text(data.labInvestigator, 40, 523, { width: 380, height: 37 });

  doc.image(labelFacts, 40, 560, { height: 60 });
  
  doc.font('Courier');
  doc.fontSize(10);

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


  doc.text("", 40, 623, { width: 380, height: 130, continued: true })
    .fillColor('gray').text(`V1=${data.getNamespace()}|`, { continued: true })
    .fillColor('#e83e8c').text(`${data.permitteeRepresentation.patientName}|`, { continued: true })
    .fillColor('#e83e8c').text(`${data.permitteeRepresentation.patientPassport}|`, { continued: true })
    .fillColor('#e83e8c').text(`${data.permitteeRepresentation.procedure.code}`, { continued: true })
    .fillColor('gray').text(`=${data.permitteeRepresentation.procedure.internationalName}`, { continued: true })
    .fillColor('#e83e8c').text(`|${data.permitteeRepresentation.procedureResult.code}`, { continued: true })
    .fillColor('gray').text(`=${data.permitteeRepresentation.procedureResult.internationalName}`, { continued: true })
    .fillColor('#e83e8c').text(`|${data.permitteeRepresentation.procedureSerial}|`, { continued: true })
    .fillColor('#e83e8c').text(`${data.permitteeRepresentation.procedureTime.getTime()}`, { continued: true })
    .fillColor('gray').text(`=${data.permitteeRepresentation.procedureTime.toISOString()}`, { continued: true })
    .fillColor('#e83e8c').text(`|${data.permitteeRepresentation.permitteeSerial}|`, { continued: true })
    .fillColor('#e83e8c').text(`${data.platformData.timestamp.getTime()}`, { continued: true })
    .fillColor('gray').text(`=${data.platformData.timestamp.toISOString()}|`, { continued: true })
    .fillColor('#e83e8c').text(`${data.platformData.signature}`, { continued: true })
    .fillColor('#e83e8c').text(`|${data.platformData.txHash}`)

  doc.image(labelCopyright, 40, 750, { height: 10 });
  doc.image(logo, 450, 440, { width: 120 });

  doc.font(roboto);
  doc.fontSize(12);
  doc.fillColor('black');
  doc.text('Scan to verify authenticity and expiration date: ', 450, 550, { width: 120 });
  const qrcode = document.getElementById("qrCode")
  const img = qrcode.getElementsByTagName('img');
  doc.image(img[0].src, 450, 600, { width: 120 });

  doc.addPage();
  doc.image(labelMoreInformation, 40, 60, { height: 10 });
  doc.font(roboto);
  doc.fontSize(12);
  doc.fillColor('blue');
  const infoText = 'U.S. CDC Passenger Disclosure and Attestation to the United States of America';
  doc.text(infoText, 40, 73);
  const width = doc.widthOfString(infoText);
  const height = doc.currentLineHeight();
  doc.underline(40, 73, width, height, { color: 'blue' })
    .link(40, 73, width, height, 'https://genobank.io/certificates/more-information/us-cdc-passenger-disclosure.pdf');

  // get a blob when you're done
  doc.end();
  stream.on('finish', function () {
    // get a blob you can do whatever you like with
    const blob = stream.toBlob('application/pdf');
    const d = data.permitteeRepresentation.procedureTime;
    const datestring = d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2);

    const fileName = `${datestring} ${data.permitteeRepresentation.patientName}.pdf`;
    if (navigator.msSaveBlob) {
      // IE 10+
      navigator.msSaveBlob(blob, fileName);
    } else {
      const link = document.createElement('a');
      // Browsers that support HTML5 download attribute
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
    // const url = stream.toBlobURL('application/pdf');
    // $('#iframe').attr('src', url);
  });
}

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}



