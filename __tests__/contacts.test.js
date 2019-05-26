const { stripHtmlFromObj } = require('../functions/src/')

describe( 'sanitize dirty inputs', () => {

    const data = {
        "id": 1,
        "firstName": "<strong>Thomas</strong>",
        "lastName": "<script>alert('you are screwed');</script>Shellberg",
        "birthday": "Sat May 25 2019 12:34:33 <script>alert('hi!')</script>GMT+0200 (Central European Summer Time)",
        "phone": "<b>(480)555-5555</b>",
        "email": "<script>alert('sup');</script>thomas@shellberg.com",
        "address": "<bold>Ruhreckstrasse 39</bold>, Hagen, 58099, Germany"
    }

    it('should strip out HTML tags from first name', () => {
        const strippedData = stripHtmlFromObj(data)
        expect(strippedData.firstName).toEqual('Thomas')
    })

    it('should strip out HTML script tags from last name', () => {
        const strippedData = stripHtmlFromObj(data)
        expect(strippedData.lastName).toEqual('Shellberg')
    })

    it('should strip out HTML from birthday string', () => {
        const strippedData = stripHtmlFromObj(data)
        expect(strippedData.birthday).toEqual("Sat May 25 2019 12:34:33 GMT+0200 (Central European Summer Time)")
    })

    it( 'should strip out HTML from phone number', () => {
        const strippedData = stripHtmlFromObj(data)
        expect(strippedData.phone).toEqual("(480)555-5555")
    } )

    it( 'should strip out HTML from email address', () => {
        const strippedData = stripHtmlFromObj(data)
        expect(strippedData.email).toEqual("thomas@shellberg.com")
    } )

    it( 'should strip out HTML from address', () => {
        const strippedData = stripHtmlFromObj(data)
        expect(strippedData.address).toEqual("Ruhreckstrasse 39, Hagen, 58099, Germany")
    } )

})

describe( 'preserve clean inputs', () => {

    const data = {
        "id": 1,
        "firstName": "Thomas",
        "lastName": "Shellberg",
        "birthday": "Sat May 25 2019 12:34:33 GMT+0200 (Central European Summer Time)",
        "phone": "(480)555-5555",
        "email": "thomas@shellberg.com",
        "address": "Ruhreckstrasse 39, Hagen, 58099, Germany"
    }

    it('should preserve first name', () => {
        const strippedData = stripHtmlFromObj(data)
        expect(strippedData.firstName).toEqual('Thomas')
    })

    it('should preserve last name', () => {
        const strippedData = stripHtmlFromObj(data)
        expect(strippedData.lastName).toEqual('Shellberg')
    })

    it('should preserve birthday string', () => {
        const strippedData = stripHtmlFromObj(data)
        expect(strippedData.birthday).toEqual("Sat May 25 2019 12:34:33 GMT+0200 (Central European Summer Time)")
    })

    it( 'should preserve phone number', () => {
        const strippedData = stripHtmlFromObj(data)
        expect(strippedData.phone).toEqual("(480)555-5555")
    } )

    it( 'should preserve email address', () => {
        const strippedData = stripHtmlFromObj(data)
        expect(strippedData.email).toEqual("thomas@shellberg.com")
    } )

    it( 'should preserve address', () => {
        const strippedData = stripHtmlFromObj(data)
        expect(strippedData.address).toEqual("Ruhreckstrasse 39, Hagen, 58099, Germany")
    } )

})