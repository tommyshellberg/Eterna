const sortContacts = require('../components/functions/birthdaySort.js') 

const contacts = [{
    "id": 1,
    "details": {
        "firstName": "Thomas",
        "lastName": "Shellberg",
        "birthday": "Sat May 29 1985 12:34:33 GMT+0200 (Central European Summer Time)",
        "phone": "(480)555-5555",
        "email": "thomas@shellberg.com",
        "address": "Ruhreckstrasse 39, Hagen, 58099, Germany"
    }
},
{
    "id": 2,
    "details": {
        "firstName": "Frank",
        "lastName": "Frankerson",
        "birthday": "Sat May 24 1990 12:34:33 GMT+0200 (Central European Summer Time)",
        "phone": "(480)555-5555",
        "email": "thomas@shellberg.com",
        "address": "Ruhreckstrasse 39, Hagen, 58099, Germany"
    }
}
]

describe ( 'test birthday sorting', () => {

    it( 'should sort contacts based on date, ignoring year', () => {
        const sortedContacts = sortContacts(contacts) 
        expect(sortedContacts)[0].birthday.toEqual("Sat May 24 1990 12:34:33 GMT+0200 (Central European Summer Time)")
    } )

} )