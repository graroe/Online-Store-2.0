import { React, useState, useEffect } from "react";
import { Form, FormLabel, FormControl, Button, FormGroup } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { sha256 } from 'js-sha256';

export const Payment = () => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [curUser, setCurUser] = useState({});
  const [price, setPrice] = useState("");

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('user'))[0];
    const url = "http://localhost/630-lab/Project/server/index.php/getOrderTotal";
    let fData = new FormData();
    fData.append('User_Id', userInfo.User_Id);
    axios.post(url, fData)
      .then(res => {
        if (JSON.stringify(res.data).includes("error")) {
          console.log(res.data);
          alert("Unable to retrieve order information.")
        } else {
          console.log(res.data);
          setPrice(res.data);
        }
      })
      .then(setCurUser(userInfo));
  }, []);

  let navigate = useNavigate();
  const goToConfirmed = () => {
    let path = `/confirmed`;
    navigate(path);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cardNumber.length !== 16) {
      alert("Card Number should be 16 digits!");
    } else if (!expiryDate.match(/^(0[1-9]|10|11|12)\/20[0-9]{2}$/)) {
      alert("Expiry Date is not valid!");
    } else if (cvv.length !== 3) {
      alert("CVV should be 16 digits!");
    } else {
      const url = "http://localhost/630-lab/Project/server/index.php/payment"
      let fData = new FormData();
      let hashedCardNumber = sha256(cardNumber);
      let hashedCvv = sha256(cvv);
      fData.append('userid', curUser.User_Id);
      fData.append('hashedCardNumber', hashedCardNumber);
      fData.append('expiryDate', expiryDate);
      fData.append('hashedCvv', hashedCvv);
      axios.post(url, fData)
        .then(response => {
          console.log(response.data);
          if (response.data.includes("error")) {
            console.log(response.data);
            alert("Data was not inserted. Please try again.");
          } else {
            goToConfirmed();
          }
        })
        .catch(error => { alert(error); console.log(error) });
    }
  };

  return (
    <div>
      <h3>Payment</h3>
      <h5>Total: ${price}</h5>
      <br></br>
      <center>
        <Form method="post" onSubmit={handleSubmit}>
          <FormGroup>
            <FormLabel htmlFor="cardNumber">Card Number</FormLabel>
            <FormControl value={cardNumber} onChange={e => setCardNumber(e.target.value)} type="text" name="cardNumber" placeholder="XXXX XXXX XXXX XXXX" maxLength={16} />
          </FormGroup>
          <FormGroup>
            <FormLabel htmlFor="expiryDate">Expiry Date</FormLabel>
            <FormControl value={expiryDate} onChange={e => setExpiryDate(e.target.value)} type="text" name="expiryDate" placeholder="MM/YYYY" />
          </FormGroup>
          <FormGroup>
            <FormLabel htmlFor="cvv">CVV</FormLabel>
            <FormControl value={cvv} onChange={e => setCvv(e.target.value)} type="text" name="cvv" placeholder="123" maxLength={3} />
          </FormGroup>
          <Button type="submit">Confirm</Button>
        </Form>
      </center>
    </div >

  )
}