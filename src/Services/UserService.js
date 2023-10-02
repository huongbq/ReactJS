import axios from './axios'

const fetchAllUser = (page) => {
  return axios.get(`/api/users?page=${page}`);
}

const postCreateUser = (name, job) => {
  return axios.post('/api/user', { name, job })
}

const putUpdateUser = (name, job) => {
  return axios.put('/api/user', { name, job })
}

const deleteUser = (id) => {
  return axios.delete(`/api/users/${id}`)
}

export { fetchAllUser, postCreateUser, putUpdateUser, deleteUser }