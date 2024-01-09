import React, { useState, useEffect } from "react";
import { Button, Form, FormControl, Table } from 'react-bootstrap';
import axios from 'axios';

export const Account = () => {
  const [orderId, setorderId] = useState('');
  const [data, setData] = useState([row => { }]);
  const [showResult, setShowResult] = useState(false);
  const [curUser, setCurUser] = useState({});

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('user'));
    setCurUser(userInfo[0]);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (orderId === "") {
      alert("Order info is blank!");
      setShowResult(false);
    } else {
      fetchData();
    }
  }

  const fetchData = () => {
    const url = "http://localhost/630-lab/Project/server/index.php/search";
    let fData = new FormData();
    fData.append('orderId', orderId);
    fData.append('userId', curUser.User_Id);
    axios.post(url, fData)
      .then(response => {
        console.log(response.data);
        if (response.data.includes("no records found")) {
          alert("No results found. Please try again.");
          setShowResult(false);
        } else {
          setData(response.data);
          console.log(data);
          setShowResult(true);
        }
      })
      .catch(error => { alert(error); console.log(error) });
  }

  return (
    <div>
      <h3>Account</h3>
      <p>
        <strong>User ID: </strong>{curUser.User_Id}<br></br>
        <strong>Login ID: </strong>{curUser.Login_Id}<br></br>
        <strong>Name: </strong>{curUser.Name}<br></br>
        <strong>Email: </strong>{curUser.Email}<br></br>
        <strong>Address: </strong>{curUser.Address}, {curUser.City_Code}<br></br>
      </p>
      <center>
        <div>
          <Form>
            <h4>Search Your Orders</h4>
            <FormControl value={orderId} onChange={e => setorderId(e.target.value)} type="text" placeholder="Order ID"></FormControl>
            <Button type='submit' onClick={handleSubmit}>Search</Button>
          </Form>
        </div>
        {showResult && (
          <div>
            <Table className="table table-hover">
              <thead>
                <tr key={"header"}>
                  {Object.keys(data[0]).map((key, index) => (
                    <th key={index}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index}>
                    {Object.values(item).map((val, index) => (
                      <td key={index}>{val}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </center >
    </div >
  );
};
