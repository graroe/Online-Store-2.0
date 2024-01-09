import { React, useState } from "react";
import { Form, FormLabel, FormControl, FormGroup, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { sha256 } from 'js-sha256';

export const Register = () => {
    const [userid, setuserid] = useState('');
    const [name, setname] = useState('');
    const [phone, setphone] = useState('');
    const [email, setemail] = useState('');
    const [address, setaddress] = useState('');
    const [city, setcity] = useState('');
    const [password, setpassword] = useState('');
    const [cpassword, setcpassword] = useState('');

    const [confirmedRegistration, setConfirmedRegistration] = useState(false);

    let navigate = useNavigate();
    const routeChange = () => {
        let path = `/login`;
        navigate(path);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (userid.length === 0) {
            alert("Username has been left blank!");
        } else if (name.length === 0) {
            alert("Name has been left blank!");
        } else if (phone.length === 0) {
            alert("Phone has been left blank!");
        } else if (email.length === 0) {
            alert("Email has been left blank!");
        } else if (address.length === 0) {
            alert("Address has been left blank!");
        } else if (city.length === 0) {
            alert("City has been left blank!");
        } else if (password.length === 0) {
            alert("Password has been left blank!");
        } else if (cpassword !== password) {
            alert("Passwords dont match!");
        } else {
            const url = "http://localhost/630-lab/Project/server/index.php/register"
            let hashedPassword = sha256(password);
            let fData = new FormData();
            fData.append('userid', userid);
            fData.append('name', name);
            fData.append('phone', phone);
            fData.append('email', email);
            fData.append('address', address);
            fData.append('city', city);
            fData.append('password', hashedPassword);
            axios.post(url, fData)
                .then(response => {
                    console.log(response.data);
                    if (response.data.includes("registered successfully")) {
                        setConfirmedRegistration(true);
                    } else {
                      alert("Registration unsuccessful. Please try again.");
                    }
                })
                .catch(error => { alert(error); console.log(error) });
        }
    }

    return (
        <div className="card bg-secondary form">
            <h2>Welcome to the E-Commerce App!</h2>
            <h3>Register</h3>
            <br></br>
            <Form name="registerForm" method="post" onSubmit={handleSubmit}>
                <center>
                    <div className="form-body">
                        <FormGroup>
                            <FormLabel htmlFor="userid">Username: </FormLabel>
                            <FormControl value={userid} onChange={e => setuserid(e.target.value)} type="text" name="userid" placeholder="Username" />
                        </FormGroup>
                        <FormGroup>
                            <FormLabel htmlFor="name">Name: </FormLabel>
                            <FormControl value={name} onChange={e => setname(e.target.value)} type="text" name="name" placeholder="First, Last" />
                        </FormGroup>
                        <FormGroup>
                            <FormLabel htmlFor="phone">Phone Number: </FormLabel>
                            <FormControl value={phone} onChange={e => setphone(e.target.value)} type="tel" name="phone" maxLength={10} placeholder="1112223333" />
                        </FormGroup>
                        <FormGroup>
                            <FormLabel htmlFor="email">Email: </FormLabel>
                            <FormControl value={email} onChange={e => setemail(e.target.value)} type="email" name="email" placeholder="@example.aol" />
                        </FormGroup>
                        <FormGroup>
                            <FormLabel htmlFor="address">Address: </FormLabel>
                            <FormControl value={address} onChange={e => setaddress(e.target.value)} type="text" name="address" placeholder="123 Dundas Street" />
                        </FormGroup>
                        <FormGroup>
                            <FormLabel htmlFor="city">City: </FormLabel>
                            <FormControl value={city} onChange={e => setcity(e.target.value)} type="text" name="city" placeholder="City" />
                        </FormGroup>
                        <FormGroup>
                            <FormLabel htmlFor="password">Password: </FormLabel>
                            <FormControl value={password} onChange={e => setpassword(e.target.value)} type="password" name="password" placeholder="Password" />
                        </FormGroup>
                        <FormGroup>
                            <FormLabel htmlFor="confirmPassword">Confirm Password: </FormLabel>
                            <FormControl value={cpassword} onChange={e => setcpassword(e.target.value)} type="password" name="cpassword" placeholder="Confirm Password" />
                        </FormGroup>
                    </div>
                    <Button type="submit" className="btn btn-dark">Register</Button>

                    {confirmedRegistration && (
                        <div>
                            <hr></hr>
                            <h6 className="custom-margins">You have registered successfully!</h6>
                            <h6 className="custom-margins">Log in to your account to begin shopping!</h6>
                            <Button className="btn btn-dark" onClick={routeChange}>Login</Button>
                        </div>
                    )}
                </center>
            </Form>
        </div>
    );
} 