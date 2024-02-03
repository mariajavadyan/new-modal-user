import React from "react";
import "./UsersList.css";

const UsersList = ({ users, handleDelete }) => {
  return (
    <div className="users-list">
      {users.length && (
        <div>
          {users.map((user) => (
            <div key={user.id} className="user">
              <h2>Username: {user.username}</h2>
              <p>Email: {user.email}</p>
              <button
                className="btn-delete"
                onClick={() => handleDelete(user.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UsersList;
