// import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Table from 'react-bootstrap/Table';
import { fetchAllUser } from '../../Services/UserService';
import ReactPaginate from 'react-paginate';
import ModalAddNewUser from '../Modals/ModalAddNewUser'
import ModalEditUser from '../Modals/ModalEditUser';
import ModalConfirm from '../Modals/ModalConfirm';
import _, { debounce } from 'lodash'
import { CSVDownload, CSVLink } from 'react-csv';

export default function TableUsers() {

  const [listUsers, setListUsers] = useState([])
  const [dataUserEdit, setDataUserEdit] = useState({})
  const [totalLists, setTotalLists] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [isShowModalAddNew, setIsShowModalAddNew] = useState(false)
  const [isShowModalEdit, setIsShowModalEdit] = useState(false)
  const [dataUserDelete, setDataUserDelete] = useState({})
  const [isShowModalDelete, setIsShowModalDelete] = useState(false)
  const [sortBy, setSortBy] = useState('asc')
  const [sortField, setSortField] = useState('id')
  // const [keyword, setKeyword] = useState('')


  const handleClose = () => {
    setIsShowModalAddNew(false)
    setIsShowModalEdit(false)
    setIsShowModalDelete(false)
  }

  useEffect(() => {
    getUsers(1)
  }, [])

  const getUsers = async (page) => {
    let res = await fetchAllUser(page);
    if (res && res.data) {
      setTotalLists(res.total)
      setListUsers(res.data)
      setTotalPages(res.total_pages)
    }
  }

  const handlePageClick = (event) => {
    getUsers(+event.selected + 1);
  }

  const handleUpdateUser = (user) => {
    setListUsers([user, ...listUsers])
  }

  const handleEditUser = (user) => {
    setDataUserEdit(user)
    setIsShowModalEdit(true)
  }

  const handleEditUserFromModal = (user) => {
    let cloneListUser = [...listUsers]
    let index = listUsers.findIndex(item => item.id === user.id)
    cloneListUser[index].first_name = user.first_name;
    setListUsers(cloneListUser)
  }

  const handleDeleteUser = (user) => {
    setIsShowModalDelete(true);
    setDataUserDelete(user)
  }

  const handleDeleteUserFromModal = (user) => {
    let cloneListUser = _.cloneDeep(listUsers)
    cloneListUser = cloneListUser.filter(item => item.id !== user.id)
    setListUsers(cloneListUser)
  }

  const handleSort = (sortBy, sortField) => {
    setSortBy(sortBy);
    setSortField(sortField)
    let cloneListUser = _.cloneDeep(listUsers)
    cloneListUser = _.orderBy(cloneListUser, [sortField], [sortBy])
    setListUsers(cloneListUser)
  }

  const handleSearch = debounce((e) => {
    let term = e.target.value
    if (term) {
      let cloneListUser = _.cloneDeep(listUsers);
      cloneListUser = cloneListUser.filter(item => item.email.includes(term))
      setListUsers(cloneListUser)
    } else {
      getUsers(1)
    }
  }, 500)

  const csvData = []

  return (
    <>
      <div className="my-3 d-flex align-items-center justify-content-between">
        <strong>List User:</strong>
        <div className="download">
          <input type="file" id='import' hidden />
          <label htmlFor='import' className='btn btn-success'>
            <i class="fa-solid fa-file-import"></i> Import
          </label>
          <CSVLink
            data={csvData}
            filename={'my-file.csv'}
            className='btn btn-secondary mx-2'
          >
            <i class="fa-solid fa-file-export"></i> Export
          </CSVLink>
          <button
            className='btn btn-primary'
            onClick={() => setIsShowModalAddNew(true)}
          >
            <i className="fa-solid fa-circle-plus"></i> Add New
          </button>
        </div>
      </div>
      <div className='col-4 my-3'>
        <input
          type="text"
          placeholder='Search user by email...'
          className='form-control'
          onChange={(e) => handleSearch(e)}
        />
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th className='d-flex align-items-center justify-content-between'>
              <span>ID</span>
              <span>
                <i
                  className="fa-solid fa-arrow-up-long mx-1"
                  onClick={() => handleSort('asc', 'id')}
                ></i>
                <i
                  className="fa-solid fa-arrow-down-long"
                  onClick={() => handleSort('desc', 'id')}
                ></i>
              </span>
            </th>
            <th>Email</th>
            <th className='d-flex align-items-center justify-content-between'>
              <span>First Name</span>
              <span>
                <i
                  className="fa-solid fa-arrow-up-long mx-1"
                  onClick={() => handleSort('asc', 'first_name')}
                ></i>
                <i
                  className="fa-solid fa-arrow-down-long"
                  onClick={() => handleSort('desc', 'first_name')}
                ></i>
              </span></th>
            <th>Last Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {listUsers && listUsers.length > 0 && listUsers.map((item, index) => {
            return (
              <tr key={`user-${index}`}>
                <td>{item.id}</td>
                <td>{item.email}</td>
                <td>{item.first_name}</td>
                <td>{item.last_name}</td>
                <td>
                  <button
                    className='btn btn-warning mx-3'
                    onClick={() => handleEditUser(item)}
                  >
                    <i class="fa-solid fa-pen"></i> Edit
                  </button>
                  <button
                    className='btn btn-danger'
                    onClick={() => handleDeleteUser(item)}
                  >
                    <i class="fa-solid fa-trash"></i> Delete
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </Table>
      <div className='d-flex justify-content-center'>
        <ReactPaginate
          breakLabel="..."
          nextLabel="next >"
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          pageCount={totalPages}
          previousLabel="< previous"
          pageClassName='page-item'
          pageLinkClassName='page-link'
          previousClassName='page-item'
          previousLinkClassName='page-link'
          nextClassName='page-item'
          nextLinkClassName='page-link'
          breakClassName='page-item'
          breakLinkClassName='page-link'
          containerClassName='pagination'
          activeClassName='active'
        />
      </div>
      <ModalAddNewUser
        show={isShowModalAddNew}
        handleClose={handleClose}
        handleUpdateUser={handleUpdateUser}
      />
      <ModalEditUser
        show={isShowModalEdit}
        handleClose={handleClose}
        handleEditUserFromModal={handleEditUserFromModal}
        dataUserEdit={dataUserEdit}
      />
      <ModalConfirm
        show={isShowModalDelete}
        handleClose={handleClose}
        dataUserDelete={dataUserDelete}
        handleDeleteUserFromModal={handleDeleteUserFromModal}
      />
    </>
  )
}


