const sanitizeHtml = require('sanitize-html');

const sanitizeData = ( data ) => {
    return sanitizeHtml(data, {
        allowedTags: [],
        allowedAttributes: {}
    })
  }

const stripHtmlFromObj = ( data ) => {
    for (const prop in data) {
        data[prop] = sanitizeData(data[prop])
    }
    return data
}

describe( 'sanitize HTML inputs', () => {

    const data = {
        "id": 1,
        "firstName": "<strong>Thomas</strong>",
        "lastName": "<script>alert('you are screwed');</script>Shellberg",
        "birthday": new Date(),
        "phone": "(480)555-5555",
        "email": "thomas@shellberg.com",
        "address": "Ruhreckstrasse 39, Hagen, 58099, Germany"
    }

    it('should strip out HTML tags from contact', () => {
        const strippedData = stripHtmlFromObj(data)
        expect(strippedData.firstName).toEqual('Thomas')
    })

    it('should strip out HTML script tags from contact', () => {
        const strippedData = stripHtmlFromObj(data)
        expect(strippedData.lastName).toEqual('Shellberg')
    })

    it('should strip out HTML but leave Date object intact', () => {
        const strippedData = stripHtmlFromObj(data)
        expect(strippedData.birthday).toBeInstanceOf(Date)
    })

})