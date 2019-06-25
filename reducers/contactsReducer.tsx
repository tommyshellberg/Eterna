import moment from 'moment'
import _ from 'lodash'

// firebase stuff
import {firebase} from '@firebase/app'
import '@firebase/auth'
import '@firebase/database'

// set a reference to the firebase database instance which is reused throughout our reducers.
var db
export function getDbRef () {
    db = firebase.database()
}

interface State {
    contacts: Array<object>,
    userId: string,
    dbRef: any,
    me: object
}

interface Action {
    type: string,
    payload: object
}

const INITIAL_STATE = {
    contacts: [],
    userId: '',
    dbRef: null,
    me: {}
}

export function contactsReducer ( state:State=INITIAL_STATE, action:Action ) {
    switch(action.type) {

        case 'UPDATE_CONTACTS':
        if ( !state || !state.contacts && !action.payload ) return INITIAL_STATE
        if ( !action.payload ) return state

        return Object.assign( {}, state, {
            contacts: action.payload.contacts
        } )
        
        case 'GET_CONTACTS':
            // implement caching later
            return Object.assign( {}, state, {
                contacts
            } )

        case 'SET_USER_ID':
            if( !action.payload || !action.payload.userId ) return state
            const userId = action.payload.userId
            return { ...state, userId }

        case 'GET_DB_REF':
            return Object.assign( {}, state, {
                dbRef: db
            })

        case 'ADD_NEW_CONTACT':

            const oldContacts:Array<object> = state.contacts
            if( !action.payload ) return state
            const newContact = {
                ...action.payload.contact,
                id: oldContacts.length + 1
            }
        return { ...state, 
                    contacts: [...oldContacts, newContact], 
                    userId: action.payload.userId 
                }

        case 'SORT_BIRTHDAYS':
            const emptyBirthdays = []
            if ( !action.payload || !action.payload.contacts ) return { ...state, upcomingBirthdays: emptyBirthdays }
            const upcomingBirthdays = sortBirthdaysThirtyDays( action.payload.contacts )

        return { ...state, upcomingBirthdays }

        case 'UPDATE_CONTACT':
            const updateIndex = state.contacts.findIndex( (x) => x.id === action.payload.contact.id )
            const removedContact = [ 
                    ...state.contacts.slice( 0, updateIndex ),
                    ...state.contacts.slice( updateIndex + 1 ) 
                ]
            const reAddContact = [...removedContact, action.payload.contact]
        return { ...state, contacts: reAddContact }

        case 'DELETE_CONTACT':
        if ( !action.payload || !action.payload.contactId) return state
        const deleteContact = () => {
            const contacts = state.contacts
            const index = contacts.findIndex( (x) => x.id === action.payload.contactId )
            const newContacts = [
                ...contacts.slice( 0, index ),
                ...contacts.slice( index + 1 )
            ]
            return newContacts
        }
            return { ...state, contacts: deleteContact() }

        case 'GET_PROFILE_DATA':
        if ( !action.payload || !action.payload.userId ) return state
        const myProfileData = getProfileData( action.payload.userId )
        return { ...state, me: myProfileData }

        case 'UPDATE_PROFILE':
        if ( !action.payload || !action.payload.me ) return state
        return { ...state, me: action.payload.me }

        default:
            return state
    }
}

// take a list of total contacts and filter by birthdays within next 30 days.
// @param array contacts
// return array sortedContacts

const sortBirthdaysThirtyDays = ( contacts ) => {
    const now = moment()
    const nextMonth = moment(now).add(1, 'M')
    const filteredContactsArray = contacts
    .filter( (contact) => contact.birthday !== undefined )
    .map(contact => { 
      contact.tempBirthday = moment(contact.birthday).year(now.year()).format()
      return contact
    })
    
    const isBetweenContacts = filteredContactsArray.filter( contact => 
      moment(contact.tempBirthday).isBetween(now, nextMonth)
    )
   const sortedAndFilteredContacts = _.orderBy(isBetweenContacts, ['tempBirthday'], ['asc'])
   return sortedAndFilteredContacts
}

const getProfileData = (userId) => {
    let me = db.ref(`users/${userId}/me`)
    let obj = {}
    me.once('value', (snapshot) => {
      snapshot.forEach( (child) => {
        const key = child.key
        const val = child.val()
        obj[key] = val
      })
    })
    return obj
}