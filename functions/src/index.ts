import * as functions from 'firebase-functions';
const sanitizeHtml = require('sanitize-html');

const sanitizeData = ( data:any ) => {
      return sanitizeHtml(data, {
        allowedTags: [],
        allowedAttributes: {}
      })
    }

exports.stripHtmlFromObj = ( data:any ) => {
    for (const prop in data) {
        data[prop] = sanitizeData(data[prop])
    }
    return data
}

exports.onContactWrite = functions.database.ref(`users/{uid}/contacts/{id}`).onWrite( (change, context) => {
    const data = change.after.val()
    const strippedData = stripHtmlFromObj(data)
    return change.after.ref.update(strippedData)
  })

  exports.onMeWrite = functions.database.ref(`users/{uid}/me`).onWrite( (change, context) => {
    const data = change.after.val()
    const strippedData = stripHtmlFromObj(data)
    return change.after.ref.update(strippedData)
  })
