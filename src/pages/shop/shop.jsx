import React, { Component } from "react";
import { Button } from "react-bootstrap";
import axios from "axios";
import "./shop.css";

export class Shop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      activeOrderId : 0
    };
    this.handleAddToCart = this.handleAddToCart.bind(this);
  }

  componentDidMount() {
    const url = "http://localhost/630-lab/Project/server/index.php/storefront/";
    const url0 = "http://localhost/630-lab/Project/server/index.php/getActiveOrder";
    const userInfo = JSON.parse(localStorage.getItem('user'))[0];
    let fData = new FormData();
    fData.append('User_Id', userInfo.User_Id);

    axios
      .get(url)
      .then((response) => response.data)
      .then((data) => {
        this.setState({ products: data });
        console.log(this.state.products);
      });

    axios.post(url0, fData)
      .then(response => {
        console.log(response);
        console.log(response.data["Order_Id"]);
        this.setState({activeOrderId : response.data["Order_Id"]}, () => {
          console.log(this.state);
        });
      });

  }

  handleAddToCart(item_id) {
    const url = "http://localhost/630-lab/Project/server/index.php/postOrder/";
    const order_id = this.state.activeOrderId; 
  
    console.log(item_id);
    console.log(order_id);

    let fData = new FormData();
    fData.append('Order_Id', order_id);
    fData.append('Item_Id', item_id);
    fData.append('User_Id', (JSON.parse(localStorage.getItem('user'))[0]).User_Id);
    axios.post(url, fData)
    .then(response => {
      console.log(response.data);
      alert("Item added to cart");
    })
    .catch(error => {
      console.log(error);
      alert("Failed to add item to cart");
    });
  }


  render() {
    const handleDragEnd = (event) => {
      var mx = event.clientX;
      var my = event.clientY;
      var bbox = document.getElementById("cart").getBoundingClientRect();
      if (mx <= bbox.right && mx >= bbox.left && my <=bbox.bottom && my >= bbox.top){
        this.handleAddToCart(localStorage.getItem("dragging"));
      }
    };

    return (
      <div className="shop">
        <h3>E-Store</h3>
        <div className="products">
          {this.state.products.map((result, index) => {
            return (
              <div className="product" key={index}>
                <div draggable onDragStart={() => localStorage.setItem("dragging", result.item_id)}
                 onDragEnd={handleDragEnd}>
                  <img src={`/assets/products/${result.item_id}.png`} alt="product-img" />
                  <div className="description">
                    <p><b>{result.item_name}</b></p>
                    <p>${result.price}</p>
                  </div>
                  <Button className="btn btn-success" onClick={() => this.handleAddToCart(result.item_id)}>Add to Cart</Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
