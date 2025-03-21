import React, { useEffect } from "react";
import useUser from "../hooks/useUser";

const UserProfile = ({ user }) => {
  const userData = useUser(user);

  useEffect(() => {
    if (userData) {
      console.log(userData);
    }
  }, [userData]);

  return (
    <div>
      {userData ? (
        <div>
          <h1>{userData.name}</h1>
          <p>{userData.email}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default UserProfile;

