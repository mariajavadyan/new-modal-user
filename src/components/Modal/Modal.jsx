import React, { useState, useEffect } from "react";
import UsersList from "../UsersList/UsersList";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./Modal.css";

const Modal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState([]);

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(6, "Login is too short")
        .max(16, "Login is too long, please enter less than 16 symbols")
        .required("Username is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    }),

    onSubmit: async (values, { resetForm }) => {
      try {
        await fetch("http://localhost:8000/users/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        console.log("new user added");
        await fetchUsers();
      } catch (error) {
        console.error("Error submitting form:", error);
      } finally {
        console.log("Form submitted:", values);
        resetForm();
        closeModal();
      }
    },
  });

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:8000/users/");
      const users = await response.json();
      setUsers(users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleDelete = async (userId) => {
    try {
      const apiUrl = `http://localhost:8000/users/${userId}`;
      const response = await fetch(apiUrl, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        console.log("User deleted:", userId);
        setUsers(users.filter((user) => user.id !== userId));
      } else {
        console.error("Error deleting user:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <h2>Modal Form</h2>
      <button onClick={openModal}>Add User</button>

      <UsersList users={users} handleDelete={handleDelete} />

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Form Modal</h3>
            <form onSubmit={formik.handleSubmit}>
              <div>
                <label htmlFor="username">Username:</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.username && formik.errors.username && (
                  <p>{formik.errors.username}</p>
                )}
              </div>
              <div>
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.email && formik.errors.email && (
                  <p>{formik.errors.email}</p>
                )}
              </div>

              <button type="submit">Submit</button>
            </form>
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Modal;
