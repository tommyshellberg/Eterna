import moment from 'moment'
import _ from 'lodash'

const now = moment()
const nextMonth = moment(now).add(1, 'M')

const sortContacts = (contacts) => {
    const filteredContactsArray = contacts
    .filter( (contact) => contact.birthday !== undefined )
    .map(contact => { 
      contact.tempBirthday = moment(contact.birthday).year(now.year()).format()
      return contact
    })
    
    const isBetweenContacts = filteredContactsArray.filter( contact => 
      moment(contact.tempBirthday).isBetween(now, nextMonth)
    )
   const sortedContacts = _.orderBy(isBetweenContacts, ['tempBirthday'], ['asc'])
   return sortedContacts
  }
  
  module.exports = sortContacts