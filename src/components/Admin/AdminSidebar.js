import React from "react";
import "../MyProfile/ProfileSidebar/profileSidebar.css";
import { NavLink } from "react-router-dom";

export default function AdminSidebar() {
  return (
    <div className="profile_sidebar">
      <div className="sidebar-container">
        <div className="sidebar-options">
          <div className="sidebar-option">
            <NavLink className="sideLink" to="/adminuser">
              Manage User
            </NavLink>
          </div>
          <div className="sidebar-option">
            <NavLink className="sideLink" to="/Adminquestions">
              Manage Questions
            </NavLink>
          </div>
          <div className="sidebar-option">
            <NavLink className="sideLink" to="/Adminanswer">
              Manage Answers
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}
