import { React, useState, useEffect } from "react";
import {
  Form,
  FormLabel,
  FormControl,
  FormGroup,
  Button,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { sha256 } from 'js-sha256';

export const Login = () => {
  const [userid, setUserid] = useState("");
  const [password, setPassword] = useState("");

  const [curUser, setCurUser] = useState({});
  const [alreadyLoggedIn, setAlreadyLoggedIn] = useState(false);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('user'));
    if (userInfo) {
      setCurUser(userInfo[0]);
      setAlreadyLoggedIn(true);
      console.log("Already logged in!");
    } else {
      setAlreadyLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    setCurUser({});
    setAlreadyLoggedIn(false);
    setUserid("");
    setPassword("");
    localStorage.clear();
    window.location.reload();
  };

  let navigate = useNavigate();
  const toRegister = () => {
    let path = `/register`;
    navigate(path);
  }
  const toShop = () => {
    let path = `/shop`;
    navigate(path);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userid.length === 0) {
      alert("Username has been left blank!");
    } else if (password.length === 0) {
      alert("Password has been left blank!");
    } else {
      const url = "http://localhost/630-lab/Project/server/index.php/login"
      let fData = new FormData();
      let hashedPassword = sha256(password);
      fData.append('userid', userid);
      fData.append('password', hashedPassword);
      axios.post(url, fData)
        .then(response => {
          console.log(response.data);
          if (JSON.stringify(response.data).includes("user not found")) {
            alert("User not found. Please try again.");
          } else {
            localStorage.setItem("user", JSON.stringify(response.data));
            const userInfo = JSON.parse(localStorage.getItem('user'));
            setCurUser(userInfo[0]);
            toShop();
          }
        })
        .catch(error => { alert(error); console.log(error) });
    }
  };

  if (alreadyLoggedIn) {
    return (
      <div className="card bg-secondary form">
        <h2>Welcome to the E-Commerce App!</h2>
        <center>
          <h6>{curUser.Name}, you are already loggged in.</h6>
          <Button onClick={toShop} className="btn btn-dark">Start Shopping!</Button>
          <hr></hr>
          <Button onClick={handleLogout} className="btn btn-dark">Logout</Button>
        </center>
      </div>
    );
  }
  else {
    return (
      <div className="card bg-secondary form">
        <center>
          <h2>Welcome to the E-Commerce App!</h2>
          <h3>Login</h3>
          <br></br>
          <Form method="post" onSubmit={handleSubmit}>
            <FormGroup>
              <FormLabel htmlFor="userid">User ID</FormLabel>
              <FormControl value={userid} onChange={e => setUserid(e.target.value)} type="text" name="userid" placeholder="Username" />
            </FormGroup>
            <FormGroup>
              <FormLabel htmlFor="password">Password</FormLabel>
              <FormControl value={password} onChange={e => setPassword(e.target.value)} type="password" name="password" placeholder="Password" />
            </FormGroup>
            <Button type="submit" className="btn btn-dark">Log In</Button>
          </Form>
          <hr></hr>
          <h6 className="custom-margins">Dont have an account? Register Now!</h6>
          <Button onClick={toRegister} className="btn btn-dark">Register</Button>
        </center>
      </div>
    );
  }
};
