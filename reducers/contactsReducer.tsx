import { combineReducers } from 'redux'
import { Cache } from "react-native-cache";
import { AsyncStorage } from 'react-native';

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

// init local cache
const shellCache = new Cache({
    namespace: "shellCRM",
    policy: {
        maxEntries: 50000
    },
    backend: AsyncStorage
})

export function contactsReducer ( state:State=INITIAL_STATE, action:Action ) {
    switch(action.type) {

        case 'UPDATE_CONTACTS':
        if ( !state || !state.contacts && !action.payload ) return INITIAL_STATE
        if ( !action.payload ) return state

        return Object.assign( {}, state, {
            contacts: action.payload.contacts
        } )
        
        case 'GET_CONTACTS':
            // @todo - this should only retrieve cached contacts.
            //const cachedContacts = getContactsFromCache()
            let contacts:Array<object> = getContactsFromDB( action.payload.userId )

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
            // @todo - we want to add the new object to the state.contacts array.

            const oldContacts:Array<object> = state.contacts
            if( !action.payload ) return state
            const newContact = {
                details: action.payload.contact,
                id: oldContacts.length + 1
            }
            // take in a single contact and a userId(for firebase auth purposes)
            // @todo: existing plan - add the contact to state regardless of response from addNewContact().
            // this means we figure out a way to handle out of sync local cache and db data.
            //addNewContact(action.payload.contact, action.payload.userId)
        return { ...state, 
                    contacts: [...oldContacts, newContact], 
                    userId: action.payload.userId 
                }

        case 'SORT_BIRTHDAYS':
            console.log('SORT BIRTHDAYS FIRING')
            // if we don't send any payload or contacts return state w/ empty upcomingBirthdays array
            const emptyBirthdays = []
            if ( !action.payload || !action.payload.contacts ) return { ...state, upcomingBirthdays: emptyBirthdays }
            const upcomingBirthdays = sortBirthdaysThirtyDays( action.payload.contacts )
            console.log('upcomingBirthdays in SORT_BIRTHDAYS IS:')
            console.log(upcomingBirthdays)
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
        // @todo - we might need a better way to do this if findIndex() is too slow to find the index based on the ID
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
        // @todo - we don't want to override the existing contacts[] array.
        // @todo - we just want to overwrite the relevant object within the contacts[] array and return back state.
            return { ...state, contacts: deleteContact() }

        case 'GET_PROFILE_DATA':
        if ( !action.payload || !action.payload.userId ) return state
        const myProfileData = getProfileData( action.payload.userId )
        // we want to grab the profile data either from cache or from the database. 
        // then, return that profile data as part of new state.
        // the incoming payload is an object called 'me' which represents my profile data.

        return { ...state, me: myProfileData }

        case 'UPDATE_PROFILE':
        console.log('calling UPDATE_PROFILE')
        if ( !action.payload || !action.payload.me ) return state
        console.log('UPDATE_PROFILE payload is:')
        console.log(action.payload.me)
        return { ...state, me: action.payload.me }

        default:
            return state
    }
}

const getContactsFromCache = () => {
    const contacts = shellCache.getItem( "contacts", (err, entries) => {

        if(err) return console.log('there is an error')
        return entries
    })
    return contacts
}

const getContactsFromDB = (userId) => {

}

// take a list of total contacts and filter by birthdays within next 30 days.
// @param array contacts
// return array sortedContacts
// @todo rework this without mutating the contacts object. No more tempbirthday!

const sortBirthdaysThirtyDays = ( contacts ) => {
    const now = moment()
    const nextMonth = moment(now).add(1, 'M')
    console.log(typeof(contacts))
    const filteredContactsArray = contacts
    .filter( (contact) => contact.details.birthday !== undefined )
    .map(contact => { 
      contact.details.tempBirthday = moment(contact.details.birthday).year(now.year()).format()
      return contact
    })
    
    const isBetweenContacts = filteredContactsArray.filter( contact => 
      moment(contact.details.tempBirthday).isBetween(now, nextMonth)
    )
   const sortedContacts = _.orderBy(isBetweenContacts, ['tempBirthday'], ['asc'])
   sortedContacts.map( (x) => delete(x.tempBirthday))
   return sortedContacts
}

const addNewContact = async ( contact, userId ) => {
    console.log('calling addNewContact reducer')
    console.log('this is the contact object')
    console.log(contact)
    console.log('this is the userId')
    console.log(userId)
    const dbRef = db.ref(`users/${userId}/contacts`)
    const contactRef = await dbRef.push()
    contactRef.set(contact)
        .then ( () => addNewContactToCache(contact) )
        .catch( (err) => alert('error!'))
    // @todo - this is where we have to do the firebase call to add a new item.
}

const deleteContact = ( contactId, userId ) => {
    console.log('calling deleteContact reducer')
    // @todo - copy from ProfileScreen.tsx within static navigationOptions.
}

const updateContact = ( contact, contactId, userId ) => {
    console.log('calling updateContact reducer')
    // @todo - copy from handleStateUpdate() in ProfileScreen.tsx.
    // we still want to call the action within a debounced function 
    // @performance - consider using a submit button instead of auto updating if it's smoother.
}

const updateProfile = ( contact, userId ) => {

    console.log('calling updateProfile reducer')
    db.ref(`users/${userId}/me`)
    .set(contact)
    .then( () => alert('updated!'))
    .catch ( (error) => alert('failed to update record!'))
    // @todo - copy from handleStateUpdate() in ProfileScreen.tsx.
    // we still want to call the action within a debounced function 
    // @performance - consider using a submit button instead of auto updating if it's smoother.
}

// @todo - we need to figure out how to get the initial profile data async using await as it may take a bit.

const getProfileData = (userId) => {
    console.log('calling getProfileData function')
    let me = db.ref(`users/${userId}/me`)
    let obj = {}
    me.once('value', (snapshot) => {
      snapshot.forEach( (child) => {
        const key = child.key
        const val = child.val()
        obj[key] = val
      })
      // do we call updateProfile here and move the me.on() call to somewhere else?
    })
    return obj
}

const addNewContactToCache = ( contact ) => {
    const contacts = getContactsFromCache()
    console.log('contacts in addNewContactToCache')
    console.log(typeof(contacts))
    console.log(contacts)
    const newContacts = Object.assign( {}, contacts, { contact } )
    console.log('newContacts object:')
    console.log(newContacts)
    /* shellCache.setItem("contacts", newContacts, function(err) {
        // key => contacts, value => this.state.contacts
        if(err) console.log('error with setting cache')
    })
    */
}