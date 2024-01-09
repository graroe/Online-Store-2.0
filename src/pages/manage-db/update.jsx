import React, { useState } from "react";
import axios from "axios";
import { Form, FormLabel, FormControl, FormGroup, Button } from "react-bootstrap";

export const Update = () => {
    const [table, setTable] = useState('');
    const [values, setValues] = useState('');
    const [conditions, setConditions] = useState('');

    const [showResult, setShowResult] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (table==="" | values==="" | conditions==="") {
            alert("Table, values, or conditions are empty!");
            setShowResult(false);
        } else {
            const url = "http://localhost/630-lab/Project/server/index.php/manage/update";
            let fData = new FormData();
            fData.append('table', table);
            fData.append('values', values);
            fData.append('conditions', conditions);
            console.log(fData);
            axios.post(url, fData)
                .then(response => {
                    console.log(response.data);
                    if (response.data.includes("data updated successfully")) {
                        setShowResult(true);
                    } else {
                        alert("Data was not updated. Please try again.");
                        setShowResult(false);
                    }
                })
                .catch(error => { alert(error); console.log(error) });
        }
    };

    return (
        <div>
            <h3>Update Database Records</h3>
            <div>
                <p>NOTES:<br></br> 
                    <li>General syntax: UPDATE (table) SET (values) WHERE (conditions);</li>
                    <li>Please put each column name in backticks.</li>
                    <li>When entering multiple values and conditions, separate each with a comma.</li>
                </p>
            </div>
            <div className="form">
                <Form name="select-form" method="post" onSubmit={handleSubmit}>
                    <FormGroup>
                        <FormLabel>Table:</FormLabel>
                        <FormControl type="text" placeholder="truck" value={table} onChange={(event) => setTable(event.target.value)}></FormControl>
                    </FormGroup>
                    <FormGroup>
                        <FormLabel>Values:</FormLabel>
                        <FormControl type="text" placeholder="`availability_code`=333" value={values} onChange={(event) => setValues(event.target.value)}></FormControl>
                    </FormGroup>
                    <FormGroup>
                        <FormLabel>Conditions:</FormLabel>
                        <FormControl type="text" placeholder="`availability_code`=666" value={conditions} onChange={(event) => setConditions(event.target.value)}></FormControl>
                    </FormGroup>
                    <Button type="submit" className="btn btn-info">Submit</Button>
                </Form>
                {showResult && (
                    <h6>Data was successfully updated in the database.</h6>
                )}
            </div>
        </div>
    );
};
