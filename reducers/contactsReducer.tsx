import { combineReducers } from 'redux'
import { Cache } from "react-native-cache";
import { AsyncStorage } from 'react-native';

import moment from 'moment'
import _ from 'lodash'

const INITIAL_STATE = {
    contacts: [],
    userId: ''
}

// init cache
const shellCache = new Cache({
    namespace: "shellCRM",
    policy: {
        maxEntries: 50000
    },
    backend: AsyncStorage
})

const contactsReducer = ( state=INITIAL_STATE, action ) => {
    switch(action.type) {
        case 'GET_CACHED_CONTACTS':
            const contacts= getContactsFromCache()
            return { ... state, contacts }
        case 'ADD_NEW_CONTACT':
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
        // @todo - we don't want to override the existing contacts[] array.
        // @todo - we just want to overwrite the relevant object within the contacts[] array and return back state.
        return { ...state,  }
        default:
            return state
    }
}

const getContactsFromCache = () => {
    shellCache.getItem( "contacts", (err, entries) => {
        if(err) return console.log('there is an error')
        console.log('the entries in cache: ')
        console.log(entries)
        return entries
    })
}

// take a list of total contacts and filter by birthdays within next 30 days.
// @param array contacts
// return array sortedContacts
// @todo hook this up to the reducer and create an action.

const sortBirthdaysThirtyDays = ( contacts ) => {
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

const addNewContact = ( contact, userId ) => {
    // @todo - this is where we have to do the firebase call to add a new item.
}

const deleteContact = ( contactId, userId ) => {
    // @todo - copy from ProfileScreen.tsx within static navigationOptions.
}

const updateContact = ( contact, contactId, userId ) => {
    // @todo - copy from handleStateUpdate() in ProfileScreen.tsx.
    // we still want to call the action within a debounced function 
    // @performance - consider using a submit button instead of auto updating if it's smoother.
}

export default combineReducers({
    contacts: contactsReducer
})