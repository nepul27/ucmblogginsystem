import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Navbar.css";

var iconstyle = {
  marginleft: "10px",
  textDecoration: "none",
};
var title = {
  color: "#0D6EFD",
};
export default function Navbar() {
  const navigate = useNavigate();
  const [loginStatus, setLoginStatus] = useState(false);

  const isLoggedin = () => {
    if (localStorage.getItem("username") !== null) {
      setLoginStatus(true);
    }
  };

  const logout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("since");
    localStorage.removeItem("Usertype");

    setLoginStatus(false);
    navigate("/");
    window.location.reload(true);
  };

  const searchQuestion = async (e) => {
    e.preventDefault();
    const que = document.getElementById("searchQue").value;

    await fetch(`http://localhost:5000/api/question/search?keyword=${que}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((questions) => {
        navigate("/search", { state: questions });
      });
  };

  useEffect(() => {
    isLoggedin();
  }, [loginStatus]);

  return (
    <div>
      <nav
        className="navbar navbar-expand-lg navbar-dark bg-light"
        Style="box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px; position:fixed;top:0; z-index:9999; width:100%;"
      >
        <div className="container-fluid">
          <div
            className="navbar-brand d-flex"
            style={{ fontWeight: "500", color: "black", paddingTop: "10px" }}
          >
            <a href="/" style={iconstyle}>
              &nbsp;<i style={title}>UCM</i>
              <b>Blogger</b>
            </a>
          </div>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarScroll"
            aria-controls="navbarScroll"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarScroll">
            <form
              className="d-flex"
              style={{ width: 500 }}
              onSubmit={searchQuestion}
            >
              <input
                className="form-control me-2"
                id="searchQue"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <button className="btn btn-outline-primary" type="submit">
                Search
              </button>
            </form>
              <div className="searchbar"></div>
              <ul
                className="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll"
                Style={{ bsSscrollHheight: "100px" }}
              >
                <li class="nav-item">
                  {loginStatus && localStorage.getItem("Usertype") === "user" && (
                    <a
                      className="nav-link mr"
                      href="/editor"
                      style={{ color: "black" }}
                    >
                      <button className="btn btn-outline dark">&lt;/&gt;</button>
                    </a>
                  )}
                </li>
              </ul>

            {loginStatus && localStorage.getItem("Usertype") === "user" && (
              <NavLink to="/profile" className="btn btn-white mr-2">
                {localStorage.getItem("username")}
              </NavLink>
            )}

            {loginStatus && localStorage.getItem("Usertype") === "admin" && (
              <NavLink to="/admin" className="btn btn-white mr-2">
                {localStorage.getItem("username")}
              </NavLink>
            )}

            <button onClick={() => navigate('/questions')} className="btn btn-white mr-2">
              <i className="fa fa-home"></i>
            </button>

            <ul className="navbar-nav " Style={{ bsSscrollHheight: "100px" }}>
              {loginStatus === true ? (
                <li class="nav-item">
                  <button className="btn btn-outline-primary" onClick={logout}>
                    Logout
                  </button>
                </li>
              ) : (
                <>
                  <li class="nav-item">
                    <NavLink
                      className="nav-link"
                      to="/login"
                      style={{ color: "black" }}
                    >
                      <button className="btn btn-outline-primary">Login</button>
                    </NavLink>
                  </li>
                  <li class="nav-item">
                    <NavLink
                      className="nav-link"
                      to="/register"
                      style={{ color: "black" }}
                    >
                      <button className="btn btn-primary">Register</button>
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}
