import React, { useState, useEffect } from "react";
import axios from "axios";

export const Confirmed = () => {
  const [user, setUser] = useState({});
  const [orderDetails, setOrderDetails] = useState({});
  const [tripDetails, setTripDetails] = useState({});
  const [userDetails, setUserDetails] = useState({});
  const [orderedItems, setordereditems] = useState({});
  const [OrderedItemsInfo, setOrderedItemsInfo] = useState({})
  const [showTable, setShowTable] = useState(false);

  useEffect(() => {
    if (orderDetails) {
      handleSubmits();
    }
    if (orderedItems.length > 0) {
      handleiteminformation();
    }
    setUser(JSON.parse(localStorage.getItem("user"))[0]);
    const url1 = "http://localhost/630-lab/Project/server/index.php/confirmed";

    let fData = new FormData();
    fData.append("User_Id", user.User_Id);

    axios
      .post(url1, fData)
      .then((res) => {
        const userInfo = JSON.parse(localStorage.getItem("user"));
        setUserDetails(userInfo[0]);
        if (res.data.includes("error")) {
          console.log(res.data[0]);
          alert("Unable to retrieve order information.");
        } else {
          setOrderDetails(res.data[0]);
          setTripDetails(res.data[1]);
        }
      })
      .catch((error) => {
        alert(error);
        console.log(error);
      });
  }, [orderedItems]);
  
  const handleSubmits = async (e) => {
    const url2 = "http://localhost/630-lab/Project/server/index.php/confirmed2";
    let fData2 = new FormData();
    fData2.append("Order_Id", orderDetails.Order_Id);
  
    try {
      const res = await axios.post(url2, fData2);
      if (res.data.includes("error")) {
        alert("Unable to retrieve order information.");
      } else {
        setordereditems(res.data);
      }
    } catch (error) {
      alert(error);
      console.log(error);
    }
  };
  
  
  const handleiteminformation = async (e) => {
    const url3 = "http://localhost/630-lab/Project/server/index.php/getItemInfo";
    const itemIds = orderedItems.map((item) => item.Item_Id); // extract only the Item_Id property
    const fData3 = new FormData();
    itemIds.forEach((itemId) => {
      fData3.append("Item_Id[]", itemId);
    });
    
    try {
      const res = await axios.post(url3, fData3);
      setOrderedItemsInfo(res.data);
      setShowTable(true);
    } catch (error) {
      alert(error);
      console.log(error);
    }
  };

  return (
    <div>
      <h3>Your order has been confirmed!</h3>
      <h5>Here are the full details of your order:</h5>
      <center>
        <strong>Name: </strong>
        {userDetails.Name}
        <br></br>
        <strong>Address: </strong>
        {userDetails.Email}
        <br></br>
        <strong>Email: </strong>
        {userDetails.Address}, {userDetails.City_Code}
        <br></br>
        <strong>Phone Number: </strong>
        {userDetails.Tel_no}
        <br></br>
      
      </center>
      <br></br>
      <div>
      <center>
        <strong>Order Placed: </strong>
        {orderDetails.Date_Issued}
        <br></br>
        <strong>Store Branch: </strong>
        {tripDetails.Branch}
        <br></br>
        <strong>Express Shipping: </strong>
        {tripDetails.Express === 1 ? "Yes" : "No"}
        <br></br>
        <strong>Estimated Delivery Date: </strong>
        {orderDetails.Est_Delivery_Date}
        <br></br>
        <strong>Subtotal (without delivery): </strong>${orderDetails.Subtotal}
        <br></br>
        <strong>Total Price: </strong>${orderDetails.Total_Price}
        <br></br>
        </center>
      </div>
      <center>
        <br></br>
      {showTable && (
        <table className="table table-hover">
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Price</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {OrderedItemsInfo.map((item, index) => (
            <tr key = {index}>
              <td>{item.Item_name}</td>
              <td>${item.Price}</td>
              <td>{orderedItems[index].Quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
      )}</center>
    </div>
  );
};
