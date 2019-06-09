import {contactsReducer} from '../contactsReducer'

describe('Test UPDATE_CONTACTS in reducer', () => {

  const type = 'UPDATE_CONTACTS'

  const contactsEmptyArray = []

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
        id: "LfoKxcDqq2VvPFAS8MV",
      }
  ]
  const newSingleContact = [{
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

  it('should return a state object with a contacts array if state is null and payload is single contact', () => {
    const state = null
    const payload = contactsWithSingleContact
    const action = { type, payload }
    const expectedState = {
      contacts: [],
      userId: '',
      dbRef: null
  }
  })

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
        contacts: contactsEmptyArray,
        userId: 'userId',
        dbRef: 'dbRef'
      }
      const newContacts = newSingleContact
      const expectedState = {
        contacts: newSingleContact,
        userId: 'userId',
        dbRef: 'dbRef'
      }
      const payload = newContacts
      const action = { type, payload }
      const newState = contactsReducer( state, action )
      expect(newState).toEqual(expectedState)
  } )
})

describe('Test GET_CONTACTS in reducer', () => {
  
})