import React, { useState } from 'react';

const MainComponent = ({ title }) => {
    const [data, setData] = useState([]);

    const fetchData = () => {
        fetch('/recipes')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setData(data); // Update the component state with fetched data
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    };

    return (
        <html lang="en">
            <head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>{title}</title>
                <style jsx>{`
            body {
                        display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                    margin: 60px 0 0; /* Add top margin */
            }

                    .container {
                        text - align: center;
                    max-width: 600px;
                    width: 100%;
                    padding: 0 20px;
                    margin: 60px 0 0; /*Add top margin*/
            }

                    h1 {
                        color: black;
                    margin-left: 20px;
            }

                    p {
                        margin - bottom: 20px;
            }

                    button {
                        display: inline-block;
                    padding: 10px 20px;
                    background-color: #ccc;
                    color: #fff;
                    text-decoration: none;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    transition: background-color 0.3s ease;
            }

                    /* Hover effect for the button */
                    button:hover {
                        background - color: #999;
            }
          
        `}</style>
            </head>
            <body>
                <div className="container">
                    <h1>Diet Tracking</h1>
                    <form action="/" method="get">
                        <button type="submit">Go to Main Page</button>
                    </form>
                    <h1>Calories 0/2000</h1>
                    <h2>Breakfast</h2>
                    <form action="/" method="get">
                        <button type="submit">Add food</button>
                    </form>
                    <h2>Lunch</h2>
                    <form action="/" method="get">
                        <button type="submit">Add food</button>
                    </form>
                    <h2>Dinner</h2>
                    <form action="/" method="get">
                        <button type="submit">Add food</button>
                    </form>
                    <h2>Snacks</h2>
                    <form action="/" method="get">
                        <button type="submit">Add food</button>
                    </form>

                    <button id="fetchButton" onClick={fetchData}>
                        Fetch Data
                    </button>
                    <div id="dataContainer">
                        {data.length > 0 ? (
                            <ul>
                                {data.map(item => (
                                    <li key={item.id}>{item.name}</li>
                                ))}
                            </ul>
                        ) : (
                            'No data fetched yet'
                        )}
                    </div>
                </div>
            </body>
        </html>
    );
};

export default MainComponent;
