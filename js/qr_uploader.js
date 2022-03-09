const testFunction = async () => {
    let file = document.getElementById('file').files[0];
    console.log(file);

    // const url = 'http://test-api-genobank.herokuapp.com/read_qrcode';
    const url = 'http://localhost:5000/read_qrcode';
    const formData = new FormData();
    formData.append('file', file);

    axios.post(url, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        params:{
            'data': 'DATAAAAAAAAAAAAAAAA'
        }
    })
    .then(response=>{
        console.log(response);
    }).catch(err=>{
        console.log(err)
    })

    // axios.get(url, {
    //     params: {
    //         data: file
    //     }
    // })
    // .then(response=>{
    //     console.log(response);
    // }).catch(err=>{
    //     console.log(err)
    // })

}

document.getElementById("btn-scan").addEventListener("click", testFunction);