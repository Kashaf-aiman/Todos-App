import React from "react";

const OnlineUser = ({ user }) => {
  return (
    <div>
    <div className="userInfo">
      <div className="userImg">
        <i className="far fa-user" />
      </div>
      <div className="userName">{user.name}</div>
      
    </div>
    {/* <div className="img">
    <img className="log-in-img" src="/3.svg" alt="error" width="20px"/>
    </div> */}

    </div>
  );
};

export default OnlineUser;
