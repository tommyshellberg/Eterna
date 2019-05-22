import * as functions from 'firebase-functions';
const sanitizeHtml = require('sanitize-html');

const sanitizeData = ( data:any ) => {
    return sanitizeHtml(data, {
        allowedTags: [],
        allowedAttributes: {}
    })
  }

exports.onContactWrite = functions.database.ref(`users/{uid}/contacts/{id}`).onWrite( (change, context) => {
    const data = change.after.val()
    console.log('data is being updated')
    console.log(data)
    for (const prop in data) {
        data[prop] = sanitizeData(data[prop])
    }
    return change.after.ref.update(data)
  })

  exports.onMeWrite = functions.database.ref(`users/{uid}/me`).onWrite( (change, context) => {
    const data = change.after.val()
    console.log('data is being updated')
    console.log(data)
    for (const prop in data) {
        data[prop] = sanitizeData(data[prop])
    }
    return change.after.ref.update(data)
  })