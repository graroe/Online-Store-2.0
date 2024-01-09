import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, FormSelect } from 'react-bootstrap';
import { FormCheck } from 'react-bootstrap';
import axios from "axios";

export const Shipping = () => {
  const [addressLine, setAddressLine] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [source, setSource] = useState([]);
  const [destination, setDestination] = useState([]);
  const [dcode, setdcode] = useState("");
  const [expressShipping, setExpressShipping] = useState("");

  const options = [
    { value: "44 Thorncliffe", label: "Toronto Store", dcode: "1" },
    { value: "182 Markham Road", label: "Markham Store", dcode: "2" },
    { value: "22 Yorkland Blvd", label: "North York Store", dcode: "3" },
  ];

  const [map, setMap] = useState(null);

  let navigate = useNavigate();
  const goToPayment = () => {
    let path = `/payment`;
    navigate(path);
  };

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('user'))[0];
    setAddressLine(userInfo.Address + ", " + userInfo.City_Code);
    console.log(addressLine);

    const mapOptions = {
      center: { lat: 43.6532, lng: -79.3832 },
      zoom: 10,
    };
    const newMap = new window.google.maps.Map(document.getElementById("map"), mapOptions);
    setMap(newMap);

    const sourceMarker = new window.google.maps.Marker({
      position: { lat: 0, lng: 0 },
      map: newMap,
      title: "",
    });

    const destinationMarker = new window.google.maps.Marker({
      position: { lat: 0, lng: 0 },
      map: newMap,
      title: "Your Address",
    });

    const directionsService = new window.google.maps.DirectionsService();
    const directionsRenderer = new window.google.maps.DirectionsRenderer();
    directionsRenderer.setMap(newMap);

    window.google.maps.event.addListenerOnce(newMap, "idle", () => {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: source.address }, (results, status) => {
        if (status === window.google.maps.GeocoderStatus.OK) {
          sourceMarker.setPosition(results[0].geometry.location);
          sourceMarker.setTitle(source.label);
          map.setZoom(10);
          directionsService.route(
            {
              origin: source.address,
              destination: addressLine,
              travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
              if (status === window.google.maps.DirectionsStatus.OK) {
                directionsRenderer.setDirections(result);
              } else {
                console.error(`error fetching directions`);
              }
            }
          );
        }
      });
    });

  }, [source, destination, addressLine]);

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
    const selectedLocation = options.find((option) => option.value === event.target.value);
    setSource({
      address: selectedLocation.value,
      label: selectedLocation.label,
    });
    setDestination({
      address: addressLine,
      label: "Your Location",
    });
    setdcode(selectedLocation.dcode);
    console.log(dcode);
  };

  const toconfirm = (e) => {
    e.preventDefault();
    addToTripTable();
    updateOrderTable();
  }

  const addToTripTable = () => {
    const url = "http://localhost/630-lab/Project/server/index.php/shipping"
    const userInfo = JSON.parse(localStorage.getItem('user'))[0];
    let fData = new FormData();
    fData.append('dcode', dcode);
    fData.append('exsh', expressShipping);
    fData.append('User_Id', userInfo.User_Id);
    axios.post(url, fData)
      .then(response => {
        console.log(response.data);
        if (response.data.includes("successfully")) {
          goToPayment();
        } else {
          alert("Shipping unsuccessful. Please try again.");
        }
      })
      .catch(error => { alert(error); console.log(error) });
  }

  const updateOrderTable = () => {
    const userInfo = JSON.parse(localStorage.getItem('user'))[0];
    const url0 = "http://localhost/630-lab/Project/server/index.php/getActiveOrder";
    const url = "http://localhost/630-lab/Project/server/index.php/updateOrderTotal";
    let fData = new FormData();
    fData.append('User_Id', userInfo.User_Id);
    axios.post(url0, fData)
      .then(response => {
        console.log(response);
        if (JSON.stringify(response.data).includes("error")) {
          alert("Unable to retrieve active order. Please try again.");
        } else {
          console.log(response.data["Order_Id"]);
          const orderNo = response.data["Order_Id"];
          console.log(orderNo);
          let fData2 = new FormData();
          fData2.append('Order_Id', orderNo);
          fData2.append('exsh', expressShipping);
          axios.post(url, fData2)
            .then(res => {
              //console.log(res);
              if (res.data.includes("error")) {
                alert("Unable to update shipping delivery type. Please try again.");
                console.log(res.data);
              } else {
                console.log(JSON.stringify(response.data));
              }
            })
            .catch(err => console.log(err));
        }
      })
      .catch(err => console.log(err));
  }

  return (
    <div>
      <h3>Shipping Information</h3>
      <center>
        <Form>
          <h5>Please select type of shipping: </h5>
          <div className="radio-div">
            <FormCheck
              type="radio"
              label="Normal Shipping - 7 business days"
              name="shippingType"
              onChange={() => setExpressShipping("0")}
              className="radio-label"
            />
            <FormCheck
              type="radio"
              label="Express Shipping (+$10.00) - 2 business days"
              name="shippingType"
              onChange={() => setExpressShipping("1")}
              className="radio-label"
            />
          </div>
          <br></br>
          <fieldset>
            <h5>Please select a branch location:</h5>
            <div>
              <label className="form-label mt-4" htmlFor="location">Select a branch location:</label>
              <FormSelect id="location" className="form-control" value={selectedOption} onChange={handleSelectChange} required>
                <option value=""></option>
                {options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </FormSelect>
            </div>
          </fieldset>
          <div id="map" style={{ height: "400px" }}></div>
          <Button variant="primary" type="submit" onClick={toconfirm}>
            Confirm
          </Button>
        </Form>
      </center>
    </div>
  );
};