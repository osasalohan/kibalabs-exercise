import React, {useEffect, useState, useRef} from 'react';
import csv from 'csvtojson';
import './App.css';

function App() {
    const initialRender = useRef(true);
    const [data, setData] = useState();

    const fetchCSV = async () => {
        const res = await fetch('/cities.csv');
        const text = await res.text();
        const data = await csv().fromString(text);
        setData(sortByField(data));
    };

    const sortByField = (data) => {
        const urlSearchParams = new URLSearchParams(window.location.search);
        const {orderByField} = Object.fromEntries(urlSearchParams.entries());

        if (!orderByField) return data;

        const param = formatParam(orderByField);
        if (!data[0][param]) return data;

        data.sort((a, b) => {
                a = formatStr(a[param]);
                b = formatStr(b[param]);
                return isNaN(a) ? a.localeCompare(b) : Number(a) - Number(b);
            }
        );
        return data;
    };

    const formatParam = (param) => {
        return param.split(" ")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join("\n");
    }

    const formatStr = (str) => str.split(/[\s,"]+/).join("");

    useEffect(() => {
        if (initialRender.current) {
            fetchCSV();
            initialRender.current = false;
        }
    })

    return (
        <div className="App">
            {
                data ?
                    <table>
                        <thead>
                        <tr>
                            {Object.keys(data[0]).map((key, i) => <th key={i}>{key}</th>)}
                        </tr>
                        </thead>
                        <tbody>
                        {data.map((item, i) => (
                            <tr key={i}>
                                {Object.values(item).map((val, j) => <td key={j}>{val}</td>)}
                            </tr>
                        ))}
                        </tbody>
                    </table> :
                    <p>Loading...</p>
            }
        </div>
    );
}

export default App;
