import {contactsReducer} from '../contactsReducer'
import moment from 'moment'

const contactsWithSingleContact = [
  {
      details: {
        address: "Jdjdjdjdbdjdidbdbdjdbbdis",
        birthday: "2019-05-26T00:00:00+02:00",
        email: "jim@jumson.com",
        firstName: "Jims",
        lastName: "Jimsons",
        phone: "45804563211",
      },
      id: 1,
    },
]

describe('Test contactsReducer', () => {

  it('should return existing state if action.type is missing or not defined in switch statement', () => {
    const type = null
    const payload = null
    const action = { type, payload }
    const state = {
      contacts: contactsWithSingleContact,
      userId: 'userId',
      dbRef: null
    }
    //@todo - is this the wrong way to do this assignment? Are we just setting expectedState to a reference of state?
    // this could cause problems with equality testing.
    const expectedState = state
    const newState = contactsReducer(state, action)
    expect(newState).toEqual(expectedState)
  })
})

describe('Test UPDATE_CONTACTS in contactsReducer', () => {

  const type = 'UPDATE_CONTACTS'
  it('should return a state object with empty contacts array if state and payload is null', () => {
    const payload = null
    const action = { type, payload }
    const expectedState = {
      contacts: [],
      userId: '',
      dbRef: null
  }
  const newState = contactsReducer( null, action )
  expect(newState).toEqual(expectedState)
  })

  it('should return original state object if passed null payload', () => {
    const state = {
      contacts: contactsWithSingleContact,
      userId: 'userId',
      dbRef: 'dbRef'
    }
    const payload = null
    const action = { type, payload }
    const expectedState = state
    const newState = contactsReducer( state, action )
    expect(newState).toEqual(expectedState)
  })
    


  it( 'should return a state object with a contacts array when updating contacts', () => {
      const state = {
        contacts: [],
        userId: 'userId',
        dbRef: 'dbRef'
      }
      const newContacts = contactsWithSingleContact
      const expectedState = {
        contacts: contactsWithSingleContact,
        userId: 'userId',
        dbRef: 'dbRef'
      }
      const payload = { contacts: newContacts }
      const action = { type, payload }
      const newState = contactsReducer( state, action )
      expect(newState).toEqual(expectedState)
  } )
})

describe('Test ADD_NEW_CONTACT in contactsReducer', () => {

  // @todo - should probably add actions to a constants file now.
  const type='ADD_NEW_CONTACT'
  const newContact = {
      address: "new address",
      birthday: "2019-05-26T00:00:00+02:00",
      email: "tom@tom.blog",
      firstName: "Tom",
      lastName: "Tomson",
      phone: "45805555555",
    }

  it('should add a new contact when existing contacts are empty', () => {
    const userId = 'userId'
    const contact = newContact
    const contacts = []
    const state = {
      contacts,
      userId,
      dbRef: null
    }
    const payload = {contact, userId}
    const action = { type, payload }
    newContacts = [
      newContact
    ]

    const expectedState = {
      contacts: [
        {
          details: {
            address: "new address",
            birthday: "2019-05-26T00:00:00+02:00",
            email: "tom@tom.blog",
            firstName: "Tom",
            lastName: "Tomson",
            phone: "45805555555",
          },
          id: 1
        }
      ],
      userId,
      dbRef: null
    }
    const newState = contactsReducer( state, action )
    expect(newState).toEqual(expectedState)

  })

  it('should add a new contact to existing array containing single contact', () => {
    const userId = 'userId'
    const contact = newContact
    const contacts = contactsWithSingleContact
    const state = {
      contacts,
      userId,
      dbRef: null
    }
    const payload = {contact, userId}
    const action = { type, payload }
    newContacts = [
      {
          details: {
            address: "Jdjdjdjdbdjdidbdbdjdbbdis",
            birthday: "2019-05-26T00:00:00+02:00",
            email: "jim@jumson.com",
            firstName: "Jims",
            lastName: "Jimsons",
            phone: "45804563211",
          },
          id: 1,
        },
        {
          details: {
            address: "new address",
            birthday: "2019-05-26T00:00:00+02:00",
            email: "tom@tom.blog",
            firstName: "Tom",
            lastName: "Tomson",
            phone: "45805555555",
          },
          id: 2,
        }
    ]

    const expectedState = {
      contacts: newContacts,
      userId,
      dbRef: null
    }
    const newState = contactsReducer( state, action )
    expect(newState).toEqual(expectedState)

  })

  it('should return existing contacts if payload is null', () => {
    const userId = 'userId'
    const contacts = contactsWithSingleContact
    const state = {
      contacts,
      userId,
      dbRef: null
    }
    const payload = null
    const action = { type, payload }

    const expectedState = {
      contacts,
      userId,
      dbRef: null
    }
    const newState = contactsReducer( state, action )
    expect(newState).toEqual(expectedState)

  })

})

describe('Test DELETE_CONTACT in contactsReducer', () => {

  //constants for all DELETE_CONTACT tests
  const type = 'DELETE_CONTACT'
  const userId = 'userId'

  it('should return original state if userId is falsy', () => {
    const dbRef = null
    const userId = null
    const contacts = [{
      details: {
        address: "new address",
        birthday: "2019-05-26T00:00:00+02:00",
        email: "tom@tom.blog",
        firstName: "Tom",
        lastName: "Tomson",
        phone: "45805555555",
      },
      id: "1234",
    }]
    const state = {
      contacts,
      userId,
      dbRef
    }
    const expectedState = {
      contacts,
      userId,
      dbRef
    }
    const contactId = '1234'
    const payload = { contactId, userId }
    const action = { type, payload }

    const newState = contactsReducer( state, action )
    expect(newState).toEqual(expectedState)
  })

  it('should return original state if payload is falsy', () => {
    const dbRef = null
    const userId = null
    const contacts = [{
      details: {
        address: "new address",
        birthday: "2019-05-26T00:00:00+02:00",
        email: "tom@tom.blog",
        firstName: "Tom",
        lastName: "Tomson",
        phone: "45805555555",
      },
      id: "1234",
    }]
    const state = {
      contacts,
      userId,
      dbRef
    }
    const expectedState = {
      contacts,
      userId,
      dbRef
    }
    const payload = null
    const action = { type, payload }

    const newState = contactsReducer( state, action )
    expect(newState).toEqual(expectedState)
  })

  it('should return state with empty contacts array if we remove the only existing contact', () => {
    // DELETE_CONTACT action takes in contactId and userId as args
    const contacts = [{
      details: {
        address: "new address",
        birthday: "2019-05-26T00:00:00+02:00",
        email: "tom@tom.blog",
        firstName: "Tom",
        lastName: "Tomson",
        phone: "45805555555",
      },
      id: "1234",
    }]
    const state = {
      contacts,
      userId,
      dbRef: null
    }
    const expectedState = {
      contacts: [],
      userId: userId,
      dbRef: null
    }

    const contactId = '1234'
    const payload = { contactId, userId }
    const action = { type, payload }

    const newState = contactsReducer( state, action )
    expect(newState).toEqual(expectedState)
  })

  it('should return state with a single contact array if we remove one of two contacts', () => {
    // DELETE_CONTACT action takes in contactId and userId as args
    const contacts = [
      {
          details: {
            address: "Jdjdjdjdbdjdidbdbdjdbbdis",
            birthday: "2019-05-26T00:00:00+02:00",
            email: "jim@jumson.com",
            firstName: "Jims",
            lastName: "Jimsons",
            phone: "45804563211",
          },
          id: "LfoKxcDqq2VvPFAS8MV",
        },
        {
          details: {
            address: "new address",
            birthday: "2019-05-26T00:00:00+02:00",
            email: "tom@tom.blog",
            firstName: "Tom",
            lastName: "Tomson",
            phone: "45805555555",
          },
          id: "1234",
        }
    ]
    const state = {
      contacts,
      userId,
      dbRef: null
    }
    const expectedState = {
      contacts: [
        {
          details: {
            address: "Jdjdjdjdbdjdidbdbdjdbbdis",
            birthday: "2019-05-26T00:00:00+02:00",
            email: "jim@jumson.com",
            firstName: "Jims",
            lastName: "Jimsons",
            phone: "45804563211",
          },
          id: "LfoKxcDqq2VvPFAS8MV",
        }
      ],
      userId: userId,
      dbRef: null
    }

    const contactId = '1234'
    const payload = { contactId, userId }
    const action = { type, payload }

    const newState = contactsReducer( state, action )
    expect(newState).toEqual(expectedState)
  })
})

describe('Test SET_USER_ID in contactsReducer', () => {
  const type = 'SET_USER_ID'
  const contacts = [
    {
        details: {
          address: "Jdjdjdjdbdjdidbdbdjdbbdis",
          birthday: "2019-05-26T00:00:00+02:00",
          email: "jim@jumson.com",
          firstName: "Jims",
          lastName: "Jimsons",
          phone: "45804563211",
        },
        id: "LfoKxcDqq2VvPFAS8MV",
      }
  ]

  it('should return original state if action.payload is falsy', () => {
    const dbRef = null
    const userId = null
    const state = {
      contacts,
      userId,
      dbRef
    }
    const expectedState = {
      contacts,
      userId,
      dbRef
    }
  
    const payload = { userId }
    const action = { type, payload }
  
    const newState = contactsReducer( state, action )
    expect(newState).toEqual(expectedState)

  })

  it('should return new state with userId when passed a userId in action.payload', () => {
    const dbRef = null
    const userId = '1234'
    const state = {
      contacts,
      userId: null,
      dbRef
    }
    const expectedState = {
      contacts,
      userId,
      dbRef
    }
  
    const payload = { userId }
    const action = { type, payload }
  
    const newState = contactsReducer( state, action )
    expect(newState).toEqual(expectedState)

  })


})

describe('Test GET_DB_REF in contactsReducer', () => {
  const type = 'GET_DB_REF'
  const contacts = []

  it('should return original state with dbRef', () => {
    const dbRef = undefined
    const userId = null
    const state = {
      contacts,
      userId,
      dbRef
    }
    const expectedState = {
      contacts: [],
      userId: null,
      dbRef: undefined
    }
    const action = { type }
  
    const newState = contactsReducer( state, action )
    expect(newState).toEqual(expectedState)
})
})

describe('Test UPDATE_PROFILE in contactsReducer', () => {
  const type = 'UPDATE_PROFILE'

  it('should update my profile data when passed a new contact object', () => {
    const userId = '1234'
    const dbRef = null
    const newMe = {
      address: "new address",
      birthday: "2019-05-26T00:00:00+02:00",
      email: "tom@tom.blog",
      firstName: "Tom",
      lastName: "Tomson",
      phone: "45805555555",
    }
    const state = {
      contacts: contactsWithSingleContact,
      userId,
      me: null,
      dbRef
    }
    const expectedState = {
      contacts: contactsWithSingleContact,
      userId,
      me: newMe,
      dbRef
    }
  
    const payload = { me: newMe }
    const action = { type, payload }
  
    const newState = contactsReducer( state, action )
    expect(newState).toEqual(expectedState)
  })

  it('should return existing state if me is falsy or payload is falsy', () => {
    const userId = '1234'
    const dbRef = null
    const me = {
      address: "new address",
      birthday: "2019-05-26T00:00:00+02:00",
      email: "tom@tom.blog",
      firstName: "Tom",
      lastName: "Tomson",
      phone: "45805555555",
    }
    const newMe = null
    const state = {
      contacts: contactsWithSingleContact,
      userId,
      me,
      dbRef
    }
    const expectedState = {
      contacts: contactsWithSingleContact,
      userId,
      me,
      dbRef
    }
  
    const payload = { me: newMe }
    const action = { type, payload }
  
    const newState = contactsReducer( state, action )
    expect(newState).toEqual(expectedState)
  })
})

describe ( 'test birthday sorting', () => {

  const type = 'SORT_BIRTHDAYS'

  // @todo - we cannot hardcode the birthdays here or else our tests will fail after a given time.
  const now = moment()
  const upcomingBirthday = moment(now).add(1, 'week').toString()
  const twoMonthsFromNow = moment(now).add(2, 'M').toString()
  const contactsOneUpcomingBirthday = [{
    "id": 1,
    "details": {
        "firstName": "Thomas",
        "lastName": "Shellberg",
        "birthday": twoMonthsFromNow,
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
        "birthday": upcomingBirthday,
        "phone": "(480)555-5555",
        "email": "thomas@shellberg.com",
        "address": "Ruhreckstrasse 39, Hagen, 58099, Germany"
    }
  }]

  const upcomingBirthdays = [
    {
      "id": 2,
      "details": {
          "firstName": "Frank",
          "lastName": "Frankerson",
          "birthday": upcomingBirthday,
          "phone": "(480)555-5555",
          "email": "thomas@shellberg.com",
          "address": "Ruhreckstrasse 39, Hagen, 58099, Germany"
      }
    }]
  it( 'should sort contacts based on date, ignoring year', () => {
      const state = {
        contacts: contactsOneUpcomingBirthday,
        me: {},
        dbRef: null,
        userId: '1234'
      }
      const expectedState = {
        contacts: contactsOneUpcomingBirthday,
        me: {},
        dbRef: null,
        userId: '1234',
        upcomingBirthdays
      }
      const payload = {
        contacts: contactsOneUpcomingBirthday 
      }
      const action = { type, payload }
      const newState = contactsReducer(state, action)
      expect(newState).toEqual(expectedState)
  } )

} )