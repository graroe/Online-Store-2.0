import React, { useState } from "react";
import axios from "axios";
import { Form, FormLabel, FormControl, FormGroup, Button } from "react-bootstrap";

export const Insert = () => {
    const [table, setTable] = useState('');
    const [columns, setColumns] = useState('');
    const [values, setValues] = useState('');

    const [showResult, setShowResult] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (table==="" | values==="") {
            alert("Table and/or values are empty!");
            setShowResult(false);
        } else {
            const url = "http://localhost/630-lab/Project/server/index.php/manage/insert";
            let fData = new FormData();
            fData.append('table', table);
            fData.append('columns', columns);
            fData.append('values', values);
            axios.post(url, fData)
                .then(response => {
                    console.log(response.data);
                    if (response.data.includes("data inserted successfully")) {
                        setShowResult(true);
                    } else {
                        alert("Data was not inserted. Please try again.");
                        setShowResult(false);
                    }
                })
                .catch(error => { alert(error); console.log(error) });
        }
    };

    return (
        <div>
            <h3>Insert Database Records</h3>
            <div>
                <p>NOTES:<br></br> 
                    <li>General syntax: INSERT INTO table (columns) VALUES (values);</li>
                    <li>If you would like to insert into all the columns, you can leave the columns field empty and simply enter the values.</li>
                    <li>If using specific columns, please put each column name in backticks.</li>
                    <li>When entering multiple columns and values, separate each with a comma.</li>
                </p>
            </div>
            <div className="form">
                <Form name="select-form" method="post" onSubmit={handleSubmit}>
                    <FormGroup>
                        <FormLabel>Table:</FormLabel>
                        <FormControl type="text" placeholder="orders" value={table} onChange={(event) => setTable(event.target.value)}></FormControl>
                    </FormGroup>
                    <FormGroup>
                        <FormLabel>Columns:</FormLabel>
                        <FormControl type="text" placeholder="`order_id`, `user_id`" value={columns} onChange={(event) => setColumns(event.target.value)}></FormControl>
                    </FormGroup>
                    <FormGroup>
                        <FormLabel>Values:</FormLabel>
                        <FormControl type="text" placeholder="18, 65" value={values} onChange={(event) => setValues(event.target.value)}></FormControl>
                    </FormGroup>
                    <Button type="submit" className="btn btn-info">Submit</Button>
                </Form>
                {showResult && (
                    <h6>Data was successfully inserted into the database.</h6>
                )}
            </div>
        </div>
    );
};
