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

const INITIAL_STATE = {
    contacts: [],
    userId: '',
    dbRef: null
}

// init local cache
const shellCache = new Cache({
    namespace: "shellCRM",
    policy: {
        maxEntries: 50000
    },
    backend: AsyncStorage
})

export function contactsReducer ( state=INITIAL_STATE, action ) {
    switch(action.type) {
        case 'UPDATE_CONTACTS':
        const newContacts = action.payload
        if ( !state && !action.payload ) return INITIAL_STATE
        if ( !action.payload ) return state

        return Object.assign( {}, state, {
            contacts: newContacts
        } )
        
        case 'GET_CONTACTS':
            //const cachedContacts = getContactsFromCache()
            let contacts = getContactsFromDB( action.payload.userId )
            console.log('the contacts returned from getContactsFromDB: ')
            console.log(contacts)
            return Object.assign( {}, state, {
                contacts
            } )
        case 'SET_USER_ID':
            console.log('firing the SET_USER_ID action')
            console.log(action.payload.userId)
            const userId = action.payload.userId
            return { ...state, userId }
        case 'GET_DB_REF':
            return Object.assign( {}, state, {
                dbRef: db
            })
        case 'ADD_NEW_CONTACT':
            addNewContact(action.payload.contact, action.payload.userId)
            // @todo - we want to add the new object to the state.contacts array.

            // take in a single contact and a userId(for firebase auth purposes)
            // if the addNewContact method returns successful we add the contact to state.
            // @todo - need to add a new single contact to existing contacts. Rest parameters or .push()?
        return { ...state }
        case 'SORT_BIRTHDAYS':
            // @todo - check if state.contacts is actually correct!
            // @performance - we don't want to override the existing contacts[] array. 
            // make a new array and add it to state to not override previous contacts.
            const sortedContacts = sortBirthdaysThirtyDays( state.contacts )
        return { ...state, sortedContacts }
        case 'UPDATE_CONTACT':
            updateContact(null, null, null)
        // @todo - we don't want to override the existing contacts[] array.
        // @todo - we just want to overwrite the relevant object within the contacts[] array and return back state.
        return { ...state,  }
        case 'DELETE_CONTACT':
            deleteContact(null, null)
        // @todo - we don't want to override the existing contacts[] array.
        // @todo - we just want to overwrite the relevant object within the contacts[] array and return back state.
            return { ...state,  }
        case 'GET_PROFILE_DATA':
        // we want to grab the profile data either from cache or from the database. 
        // then, return that profile data as part of new state.
            console.log('calling getProfileData function')
            const me = getProfileData(action.payload.userId)
            console.log('this is the me object from getProfileData:')
            console.log(me)
        return { ...state, me}
        case 'UPDATE_PROFILE':
            console.log('action.payload: ')
            console.log(action.payload)
            updateProfile( action.payload.contact, action.payload.userId)
            // @todo - we don't want to override the existing contacts[] array.
            // @todo - we just want to overwrite the relevant object within the contacts[] array and return back state.
        return { ...state,  }
        default:
            return state
    }
}

const getContactsFromCache = () => {
    const contacts = shellCache.getItem( "contacts", (err, entries) => {
        console.log('entries within the function are: ')
        console.log(entries)
        console.log('entries is a:')
        console.log(typeof(entries))
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
// @todo hook this up to the reducer and create an action.

const sortBirthdaysThirtyDays = ( contacts ) => {
    console.log('calling sortBirthdays action')
    const now = moment()
    const nextMonth = moment(now).add(1, 'M')

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
   return sortedContacts
}

const addNewContact = async ( contact, userId ) => {
    console.log('calling addNewContact reducer')
    console.log('this is the contact object')
    console.log(contact)
    console.log('this is the userId')
    console.log(userId)
    const dbRef = await db.ref(`users/${userId}/contacts`)
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
    me.on('value', (snapshot) => {
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