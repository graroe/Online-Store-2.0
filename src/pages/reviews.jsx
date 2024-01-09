import { React, useState, useEffect } from "react";
import { Form, FormLabel, FormSelect, FormControl, Button, FormGroup } from 'react-bootstrap';
import axios from "axios";


export const Reviews = () => {

  const [itemID, setItemID] = useState("");
  const [itemID2, setItemID2] = useState("");
  const [starRating, setStarRating] = useState("");
  const [review, setReview] = useState("");
  const [seeReviews, setSeeReviews] = useState([]);
  const [itemList, setItemList] = useState([]);
  const [itemList2, setItemList2] = useState([]);


  useEffect(() => {
    getReviews();
  }, []);

  useEffect(() => {
    getItemByID(2);
  }, []);

  useEffect(() => {
    const url = "http://localhost/630-lab/Project/server/index.php/storefront";
    axios.get(url)
      .then(response => {
        console.log(response.data);
        setItemList(response.data);
        setItemList2(response.data);
      })
      .catch(error => { alert(error); console.log(error) });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(itemID);
    console.log(starRating);
    console.log(review);
    if (itemID.length === 0) {
      alert("Product has not been selected!");
    } else if (starRating.length === 0) {
      alert("Password has been left blank!");
    }
    else {
      const url = "http://localhost/630-lab/Project/server/index.php/reviews"
      let fData = new FormData();
      fData.append('item_id', itemID);
      fData.append('star_rating', starRating);
      fData.append('review', review)
      axios.post(url, fData)
        .then(response => {
          console.log(response.data);
          if (response.data.includes("successful")) {
            alert("Review added");
            getReviews()
          } else {
            alert("Try again");
          }
        })
        .catch(error => { alert(error); console.log(error) });
    }
  };



  const getItemByID = (id) => {
    const url = "http://localhost/630-lab/Project/server/index.php/getItemName";
    let fData = new FormData();
    fData.append('Item_Id', id);
    return axios.post(url, fData)
      .then(res => {
        console.log(res.data.Item_name);
        return res.data.Item_name;
      })
      .catch(err => console.log(err));
  }


  const getReviewsById = (id) => {
    console.log(id);
    const url = "http://localhost/630-lab/Project/server/index.php/getReviewsById";
    let fData = new FormData();
    fData.append('Item_Id', id);
    return axios.post(url, fData)
      .then(res => {
        console.log(res.data);
        const promises = res.data.map(review => {
          return getItemByID(review.Item_Id)
            .then(itemName => {
              return {
                ...review,
                Item_Id: itemName,
              };
            })
            .catch(err => console.log(err));
        });
        Promise.all(promises).then(modifiedData => {
          setSeeReviews(modifiedData);
          console.log(seeReviews);
        });
      })
      .catch(error => {
        alert(error);
        console.log(error);
      });
  };

  const getReviews = (id) => {
    const url = "http://localhost/630-lab/Project/server/index.php/getReviews";
    axios.get(url)
      .then(response => {
        console.log(response.data);
        const promises = response.data.map(review => {
          return getItemByID(review.Item_Id)
            .then(itemName => {
              return {
                ...review,
                Item_Id: itemName,
              };
            })
            .catch(err => console.log(err));
        });
        Promise.all(promises).then(modifiedData => {
          setSeeReviews(modifiedData);
          console.log(seeReviews);
        });
      })
      .catch(error => {
        alert(error);
        console.log(error);
      });
  };

  return (

    <div>
      <center>
        <h3> Leave a review!</h3>
        <Form method="post" onSubmit={handleSubmit}>

          <FormGroup>
            <FormLabel for="item-select">Select item:</FormLabel>
            <FormSelect id="item-select" name="item" value={itemID} onChange={e => setItemID(e.target.value)}>
              <option></option>
              {itemList.map(item => (
                <option key={item.item_id} value={item.item_id}>{item.item_name}</option>
              ))}
            </FormSelect>
          </FormGroup>

          <FormGroup>
            <FormLabel for="rating-select">Star rating:</FormLabel>
            <FormSelect id="rating-select" name="rating" value={starRating} onChange={e => setStarRating(e.target.value)}>
              <option></option>
              <option value="1">1 star</option>
              <option value="2">2 stars</option>
              <option value="3">3 stars</option>
              <option value="4">4 stars</option>
              <option value="5">5 stars</option>
            </FormSelect>
          </FormGroup>

          <FormGroup>
            <FormLabel for="description-input">Description:</FormLabel>
            <FormControl as="textarea" value={review} onChange={e => setReview(e.target.value)} rows={5} id="description-input" name="description"></FormControl>
          </FormGroup>
          <Button type="submit">Submit Review</Button>
        </Form >


        <FormGroup>
          <h4>Show reviews for:</h4>
          <FormSelect id="item-select2" name="item2" value={itemID2} onChange={e => {
            setItemID2(e.target.value);
            getReviewsById(e.target.value); // Call your function here with the selected value
          }}>
            <option></option>
            {itemList2.map(item => (
              <option key={item.item_id} value={item.item_id}>{item.item_name}</option>
            ))}
          </FormSelect>
        </FormGroup>

        <table class="table table-hover">
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Star Rating</th>
              <th>Review</th>
            </tr>
          </thead>
          <tbody>
            {seeReviews.map((seeReviews, index) => (
              <tr key={index}>
                <td>{seeReviews.Item_Id}</td>
                <td>{seeReviews.star_rating}</td>
                <td>{seeReviews.review}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </center>


    </div >

  )
}