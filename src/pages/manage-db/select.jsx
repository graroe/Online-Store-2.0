import React, { useState } from "react";
import axios from "axios";
import { Form, FormLabel, FormControl, FormGroup, Button, Table } from "react-bootstrap";

export const Select = () => {
    const [table, setTable] = useState('');
    const [columns, setColumns] = useState('');
    const [conditions, setConditions] = useState('');

    const [showResult, setShowResult] = useState(false);
    const [data, setData] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (columns === "" | table === "") {
            alert("Table and/or columns are empty!");
            setShowResult(false);
        } else {
            fetchData();
        }
    }

    const fetchData = () => {
        const url = "http://localhost/630-lab/Project/server/index.php/manage/view"
        let fData = new FormData();
        fData.append('columns', columns);
        fData.append('table', table);
        fData.append('conditions', conditions);
        axios.post(url, fData)
            .then(response => {
                console.log(response.data);
                if (response.data.includes("no results found")) {
                    alert("No results found. Please try again.");
                    setShowResult(false);
                } else {
                    setShowResult(true);
                    setData(response.data);
                    console.log(data);
                }
            })
            .catch(error => { alert(error); console.log(error) });
    };

    return (
        <div>
            <h3>View Database Records</h3>
            <div>
                <p>NOTES:<br></br>
                    <li>General syntax: SELECT column(s) FROM table WHERE condition;</li>
                    <li>If you would like to view all the columns, put an asterisk (*) in the columns input box.</li>
                    <li>If using specific columns, please put each column name in backticks. Example: `order_id`, `user_id`</li>
                    <li>If adding conditions, separate each condition with an "AND" or "OR". Example: `order_id`&gt;=10 and `user_id`&gt;5</li>
                </p>
            </div>
            <div className="form">
                <Form name="select-form" method="post" onSubmit={handleSubmit}>
                    <FormGroup>
                        <FormLabel>Column:</FormLabel>
                        <FormControl type="text" placeholder="`order_id, user_id`" value={columns} onChange={(event) => setColumns(event.target.value)}></FormControl>
                    </FormGroup>
                    <FormGroup>
                        <FormLabel>Table:</FormLabel>
                        <FormControl type="text" placeholder="orders" value={table} onChange={(event) => setTable(event.target.value)}></FormControl>
                    </FormGroup>
                    <FormGroup>
                        <FormLabel>Conditions:</FormLabel>
                        <FormControl type="text" placeholder="`order_id` > 10" value={conditions} onChange={(event) => setConditions(event.target.value)}></FormControl>
                    </FormGroup>
                    <Button type="submit" className="btn btn-info">Submit</Button>
                </Form>
            </div>
            {showResult && (
                <div>
                    <h4><strong>Table:</strong> {table}</h4>
                    <Table className="table table-hover">
                        <thead>
                            <tr key={"header"}>
                                {Object.keys(data[0]).map((key) => (
                                    <th>{key}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item) => (
                                <tr key={item.id}>
                                    {Object.values(item).map((val) => (
                                        <td>{val}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            )}
        </div>
    );
};