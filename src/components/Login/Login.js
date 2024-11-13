import { useState } from 'react'
import './Login.css'

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { NavLink } from 'react-router-dom'
function Login() {

  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: "", password: "" })
  const [state, setState] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: credentials.email, password: credentials.password }),
    });
    const json = await response.json();

    if (json && json.success != null) {
      setState(true);
      window.scrollTo(0, 0);

      localStorage.setItem("username", json.username);

      if (json.userType === "admin") {
        localStorage.setItem("Usertype",json.userType);
        setTimeout(() => {
          navigate("/adminHome");
          window.location.reload(true);
        }, 2000);
      }

      const month = new Map();
      month['01'] = "Jan"; month['02'] = "Feb"; month['03'] = "Mar"; month['04'] = "Apr"; month['05'] = "May"; month['06'] = "June";
      month['07'] = "July"; month['08'] = "Aug"; month['09'] = "Sep"; month['10'] = "Oct"; month['11'] = "Nov"; month['12'] = "Dec";

      const year = json && json.date ? json.date.substring(0, 4) : "";
      const mn = json && json.date ? json.date.substring(5, 7) : "";
      (year.length > 0 && mn.length > 0) ? console.log(json.date.toLocaleString('default', { month: 'long' })) : console.log("no date and month!");

      localStorage.setItem("since", month[mn] + " " + year);
      localStorage.setItem("Usertype",json.userType);

      if (json.userType === "user") {
        setTimeout(() => {
          navigate("/questions");
          window.location.reload(true);
        }, 2000);
      }


    }
    else {
      alert('Invalid Credentials or User is Blocked temporarily');
    }
  }
  const onChange = (e) => {

    setCredentials({ ...credentials, [e.target.name]: e.target.value })

  }

  useEffect(() => {
  }, [state])

  return (

    <div>

      <div style={{ marginTop: '80px' }}>

        {(
          () => {
            if (state === true) {

              return (<>
                <div class="alert alert-success alert-dismissible" role="alert" Style="background-color:green; color:white;">
                  You are <strong>Successfully</strong> logged in!!
                  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
              </>)

            }
          }
        )()}
      </div>

      <body>

        <div className="bg-img">

          <div className="content">

            <header style={{ color: 'black' }}> Login</header>
            <form onSubmit={handleSubmit} method='post'>
              <div className="field">
                <span className="fa fa-user"></span>
                <input type="email" onChange={onChange} name='email' required placeholder="Email" />
              </div>
              <div className="field space">
                <span className="fa fa-lock"></span>
                <input type="password" onChange={onChange} name='password' className="pass-key" required placeholder="Password" />
              </div>
              <div className="pass">
              </div>
              <div className="field space">
                <button type="submit"
                  value="Login" className="btn btn-primary">Login </button>
              </div>
            </form>
            <div className="signup space">Don't have account?
              <NavLink to="/register">SignUp Now</NavLink>
            </div>
          </div>
        </div>
      </body>
    </div>

  )
}

export default Login