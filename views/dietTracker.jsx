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
          /* Your styles here */
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
