import React, { useState, useEffect } from "react";
import { Avatar } from "@mui/material";
import "./profileHeader.css";

export default function ProfileHeader() {
  return (
    <div className="profile">
      <div className="ProfileAndName">
        <Avatar sx={{ height: "58px", width: "58px" }} />
        <div className="nameAndActive">
          <div className="name">{localStorage.getItem("username")}</div>
          {localStorage.getItem("Usertype") != "admin" ? (
            <p>
              User since <strong>{localStorage.getItem("since")}</strong>
            </p>
          ) : (
            <></>
          )}
        </div>
      </div>
      <hr Style="border: 0.7px solid " />
    </div>
  );
}
