import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from 'react-bootstrap';
import axios from "axios";

export const Cart = () => {

  const [cart, setCart] = useState([]);
  //const [shipping, setShipping] = useState("Store 1");
  const [activeOrder, setActiveOrder] = useState(0);
  const updateCartURL = "http://localhost/630-lab/Project/server/index.php/updateCart";
  const removeFromCartURL = "http://localhost/630-lab/Project/server/index.php/removeFromCart";
  const updateOrderTotalURL = "http://localhost/630-lab/Project/server/index.php/updateOrderSubtotal";


  let navigate = useNavigate();
  const goToShipping = () => {
    let path = `/shipping`;
    navigate(path);
  }

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('user'))[0];
    const url0 = "http://localhost/630-lab/Project/server/index.php/getActiveOrder";
    const url = "http://localhost/630-lab/Project/server/index.php/getCart";
    let fData = new FormData();
    fData.append('User_Id', userInfo.User_Id);
    axios.post(url0, fData)
      .then(response => {
        console.log(response);
        if (JSON.stringify(response.data).includes("error")) {
          console.log("Unable to retrieve active order. Please try again.");
        } else {
          //console.log(response.data["Order_Id"]);
          const orderNo = response.data["Order_Id"];
          //console.log(orderNo);
          let fData2 = new FormData();
          fData2.append('Order_Id', orderNo);
          axios.post(url, fData2)
            .then(res => {
              //console.log(res);
              if (JSON.stringify(res.data).includes("error")) {
                console.log("Unable to retrieve cart. Please refresh and try again.")
              }
              setCart(res.data);
            })
            .then(setActiveOrder(orderNo));
        }
      })
      .catch(err => console.log(err));

  }, []);

  const handleDelete = (item) => {
    const updatedCart = cart.filter(cartItem => cartItem.Item_Id !== item.Item_Id);
    deleteFromDB(item.Item_Id);
    setCart(updatedCart);
  }

  const handleQuantityChange = (item, newQuantity) => {

    if (newQuantity === 0) {
      handleDelete(item);
      return;
    }

    updateDBQuantity(item.Item_Id, newQuantity);

    const updatedCart = cart.map(cartItem => {
      if (cartItem.Item_Id === item.Item_Id) {
        return {
          ...cartItem,
          Quantity: newQuantity
        }
      }
      return cartItem;
    });
    setCart(updatedCart);
  }

  const updateDBQuantity = (item_Id, newQuantity) => {
    let fData = new FormData();
    fData.append('Order_Id', activeOrder);
    fData.append('Item_Id', item_Id);
    fData.append('Quantity', newQuantity);
    axios.post(updateCartURL, fData)
      .then(res => {
        console.log(res.data);
      })
      .catch(error => { alert(error); console.log(error) });
  }

  const deleteFromDB = (item_Id) => {
    let fData = new FormData();
    fData.append('Item_Id', item_Id);
    fData.append('Order_Id', activeOrder);
    axios.post(removeFromCartURL, fData)
      .then(res => {
        console.log(res.data);
      })
      .catch(error => { alert(error); console.log(error) });
  }

  const updateDBOrderTotal = (newSubtotal) => {
    let fData = new FormData();
    fData.append('Order_Id', activeOrder);
    fData.append('Subtotal', newSubtotal);
    axios.post(updateOrderTotalURL, fData)
      .then(res => {
        console.log(res.data);
      })
      .catch(error => { alert(error); console.log(error) });
  }

  const handleCheckout = () => {
    if (totalPrice > 0) {
      updateDBOrderTotal(totalPrice.toFixed(2));
      goToShipping();
    }
  }

  const totalPrice = cart.length > 0 ? cart.reduce((acc, cartItem) => {
    return acc + cartItem.Quantity * cartItem.Price;
  }, 0) : 0;

  return (
    <div>
      <h3>Your Cart</h3>
      <br></br>
      <table className="table table-hover" style={{ tableLayout: "fixed" }}>
        <thead>
          <tr>
            <th scope="col" style={{ width: "40%" }}>Item</th>
            <th scope="col" style={{ width: "20%" }}>Quantity</th>
            <th scope="col" style={{ width: "20%" }}>Price</th>
            <th scope="col" style={{ width: "20%" }}></th>
          </tr>
        </thead>
        <tbody>
          {cart.map(item => (
            <tr key={item.Item_Id}>
              <td>
                <div>
                  <img src={`/assets/products/${item.Item_Id}.png`} alt="product-img" style={{ width: '30%', height: '30%' }} />
                  <div>{item.Item_name}</div>
                </div>
              </td>
              <td>
                <Button className="cart-btn" onClick={() => handleQuantityChange(item, item.Quantity - 1)}>-</Button>
                {item.Quantity}
                <Button className="cart-btn" onClick={() => handleQuantityChange(item, item.Quantity * 1 + 1)}>+</Button>
              </td>
              <td>${item.Price}</td>
              <td><Button className="cart-btn" onClick={() => handleDelete(item)}>x</Button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <h4>Your total is: <strong>${totalPrice.toFixed(2)}</strong></h4>
      <center>
        <Button className="btn btn-lg btn-primary" onClick={handleCheckout}>Checkout</Button>
      </center>
    </div>
  );
}