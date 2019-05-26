import moment from 'moment'
import _ from 'lodash'

const now = moment()
const nextMonth = moment(now).add(1, 'M')

const sortContacts = (contacts) => {
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
  
  module.exports = sortContacts