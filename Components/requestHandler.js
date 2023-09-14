'use client'

export async function getRequestHandler({ route, successCallback, errorCallback }) {
    return fetch(route, { method: 'GET' }).then((response) => {
        response.json().then(body => {
            successCallback(body)
        }).catch(err => {
            errorCallback(err)
        })
    }).catch(err => {
        errorCallback(err)
    })
}


export async function postRequestHandler({ route, body, fileArray, successCallback, errorCallback }) {
    const formData = new FormData();

    if (body) {
        Object.keys(body).forEach(key => formData.append(key, body[key]))
    }

    const filenames = [];

    if (fileArray?.length) {
        fileArray.map((file, index) => {
            formData.append(file.filename, file.file);
            filenames.push(file.filename);
        })
        formData.append('filenames', JSON.stringify(filenames))
    }

    return fetch(route, { method: 'POST', body: formData, }).then((response) => {
        console.log('response', response)
        response.json().then(value => {
            successCallback(value)
        }).catch(err => {
            console.log('json error', err)
            errorCallback(err)
        })
    }).catch(err => {
        console.log('gen error')
        errorCallback(err)
    })
}