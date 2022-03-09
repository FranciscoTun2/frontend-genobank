const testFunction = async () => {
    console.log('testFunction');
    let file = document.getElementById('file').files[0];
    const url = 'http://127.0.0.1:8081/read_qrcode';
    let data = new FormData();
    const metadata = JSON.stringify({
        'title': 'test',
        'description': 'test',
    })
    data.append('file', metadata);

    return axios.post(url, data, {
        maxBodyLength: 'Infinity',
        headers: {
            "Access-Control-Allow-Origin": "http://127.0.0.1:5500"
        }
    }).then(function (response) {
        console.log(response);
    }).catch(function (error) {
        console.log(error);
    });

}

document.getElementById("btn-scan").addEventListener("click", testFunction);