interface Details {
    address: string;
    birthday: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
}

interface Contact {
    id: string
}


export const getContacts = ( userId ) => ({ 
    type: 'GET_CONTACTS',
    payload: {
        userId
    }
})

export const updateContacts = ( contacts ) => ({
    type: 'UPDATE_CONTACTS',
    payload: {
        contacts
    }
})

export const sortBirthdaysThirtyDays = ( contacts ) => ({ 
    type: 'SORT_BIRTHDAYS',
    payload: {
        contacts
    }
})

/* take in the object representing a new contact and create a new one
 * @param object contact
 * @param string userId
 * @todo - figure out structure of the payload, a new object with contact and userId, right? 
*/
export const addNewContact = ( contact:Contact, userId ) => ({
    type: 'ADD_NEW_CONTACT',
    payload: { contact, userId }
})

/* delete a contact from the contacts array
 * @param string userId
 * @param string contactId
*/
export const deleteContact = ( contactId ) => ({
    type: 'DELETE_CONTACT',
    payload: {
        contactId
    }
})

/* update the details of an existing contact from the ProfileScreen
 * @param object contact - the object representing the contact
 * @param string contactId - the contactID stored in Firebase for this contact
 * @param string userId - the logged-in user's Firebase id
*/
export const updateContact = ( contact:Contact ) => ({
    type: 'UPDATE_CONTACT',
    payload: {
        contact
    }
})

export const updateProfile = ( me ) => ({
    type: 'UPDATE_PROFILE',
    payload: {
        me
    }
})

export const setUserId = ( userId ) => ({
    type: 'SET_USER_ID',
    payload: {
        userId
    }
})

export const getDbRef = () => ({
    type: 'GET_DB_REF'
})

export const getProfileData = ( userId ) => ({
    type: 'GET_PROFILE_DATA',
    payload: {
        userId
    }
})

// @todo - where do we tell the app to subscribe to our firebase db changes using .on()? 
// remember that .on() will pull the contacts from the db when initially called so it can't be just be done within a normal lifecycle method.
// If it's done within a normal lifecycle method it will render loading from cache useless.
// do we compare the contacts within the .on() method to cached and skip updating state if they're equal?