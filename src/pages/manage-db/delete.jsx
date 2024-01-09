import React, { useState } from "react";
import axios from "axios";
import { Form, FormLabel, FormControl, FormGroup, Button } from "react-bootstrap";

export const Delete = () => {
    const [table, setTable] = useState('');
    const [conditions, setConditions] = useState('');

    const [showResult, setShowResult] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (table==="" | conditions==="") {
            alert("Table and/or conditions are empty!");
            setShowResult(false);
        } else {
            const url = "http://localhost/630-lab/Project/server/index.php/manage/delete";
            let fData = new FormData();
            fData.append('table', table);
            fData.append('conditions', conditions);
            axios.post(url, fData)
                .then(response => {
                    console.log(response.data);
                    if (response.data.includes("data deleted successfully")) {
                        setShowResult(true);
                    } else {
                        alert("Data was not deleted. Please try again.");
                        setShowResult(false);
                    }
                })
                .catch(error => { alert(error); console.log(error) });
        }
    };

    return (
        <div>
            <h3>Delete Database Records</h3>
            <div>
                <p>NOTES:<br></br> 
                    <li>General syntax: DELETE FROM (table) WHERE (conditions);</li>
                    <li>When entering a column name, add backticks around the name.</li>
                    <li>When entering multiple conditions, separate each with an "AND" or "OR" keyword.</li>
                </p>
            </div>
            <div className="form">
                <Form name="select-form" method="post" onSubmit={handleSubmit}>
                    <FormGroup>
                        <FormLabel>Table:</FormLabel>
                        <FormControl type="text" placeholder="orders" value={table} onChange={(event) => setTable(event.target.value)}></FormControl>
                    </FormGroup>
                    <FormGroup>
                        <FormLabel>Values:</FormLabel>
                        <FormControl type="text" placeholder="`truck_id`=12 and `truck_code`>1000" value={conditions} onChange={(event) => setConditions(event.target.value)}></FormControl>
                    </FormGroup>
                    <Button type="submit" className="btn btn-info">Submit</Button>
                </Form>
                {showResult && (
                    <h6>Data was successfully deleted from the database.</h6>
                )}
            </div>
        </div>
    );
};
