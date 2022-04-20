import axios from 'axios';
const baseUrl = '/api/persons';

const getAllPersons = () => {
    return axios.get(baseUrl)
}

const create = newPerson => {
    return axios.post(baseUrl, newPerson)
}

const update = (id, newPerson) => {
    return axios.put(`${baseUrl}/${id}`, newPerson)
}

const deletePerson = (id) => {
    return axios.delete(`${baseUrl}/${id}`)
}

const personService =  {
    getAllPersons: getAllPersons,
    create: create,
    update: update,
    deletePerson: deletePerson
}

export default personService