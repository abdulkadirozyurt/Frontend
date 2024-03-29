import axios from "axios";
import EditUserModal from "./EditUserModal";
import { useNavigate } from "react-router-dom";
import "../ListHR.css";
import React, { useState, useEffect } from "react";
import { Input } from "reactstrap";

const UserList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_PORT}/user/listUsers`, {},{
        headers: {
          Authorization: `Bearer: ${localStorage.getItem("userToken")}`
        },
      });

      if (response.data.success) {
        setUsers(response.data.users);
      } else {
        console.error(
          "Kullanıcıları listeleme başarısız:",
          response.data.message
        );
      }
    } catch (error) {
      console.error(
        "Kullanıcıları listeleme sırasında bir hata oluştu:",
        error
      );
    }
  };

  const handleDelete = async (userId) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_PORT}/user/deleteUser`,
        {
          data: { userId },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );

      if (response.data.success) {
        alert(response.data.message);
        fetchUsers();
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Kullanıcı silme sırasında bir hata oluştu:", error);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredHRs = users.filter((user) => {
    return (
      user.fullName.toLocaleLowerCase('tr').includes(searchTerm.toLocaleLowerCase('tr'))
    );
  });

  const handleUpdate = async (updatedUser) => {
    
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_PORT}/user/updateUser`,
        updatedUser,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );

      if (response.data.success) {
        alert(response.data.message);
        fetchUsers();
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Kullanıcı güncelleme sırasında bir hata oluştu:", error);
    }

    handleCloseModal();
  };

  return (

    <div className="container">
      <div className="mt-4 mb-2">
        <Input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearch}
          style={{ width: "200px" }}
        />
      </div>
      <div className="user-list-container">
        <h2>Human Resources List</h2>
        <table className="user-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Full Name</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredHRs.map((user) => (
              <tr key={user._id}>
                <td>{user.email}</td>
                <td>{user.fullName}</td>
                <td>{user.phone}</td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(user)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => {
                      let result = window.confirm(
                        "Are you sure you want to delete this HR employee?"
                      );
                      if (result) {
                        handleDelete(user._id);
                      }
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {showEditModal && (
          <EditUserModal
            user={selectedUser}
            onUpdate={handleUpdate}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </div>

  );
};

export default UserList;
