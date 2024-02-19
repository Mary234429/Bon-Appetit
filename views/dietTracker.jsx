import React, { useState } from 'react';

const MainComponent = ({ title }) => {
    return (
        <div className="center-container">
            <div className="container">
                <h1>{title}</h1>
                <form action="/" method="get">
                    <button type="submit">Go to Main Page</button>
                </form>
                <h1>Calories 0/2000</h1>
                <h2>Breakfast</h2>
                <form action="/recipes" method="get">
                    <button type="submit">Add food</button>
                </form>
                <h2>Lunch</h2>
                <form action="/recipes" method="get">
                    <button type="submit">Add food</button>
                </form>
                <h2>Dinner</h2>
                <form action="/recipes" method="get">
                    <button type="submit">Add food</button>
                </form>
                <h2>Snacks</h2>
                <form action="/recipes" method="get">
                     <button type="submit">Add Snacks</button>
                </form>
            </div>

            <style jsx>{`
                body {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                    margin: 0;
                    background-color: #f2f2f2;
                }

                .center-container {
                    text-align: center;
                }

                .container {
                    text-align: left;
                    max-width: 1000px;
                    width: 100%;
                    padding: 0 20px;
                    margin: 60px 0 0;
                    background-color: #fff;
                    border-radius: 10px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }

                h1 {
                    color: black;
                    margin-left: 20px;
                }

                p {
                    margin-bottom: 20px;
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

                button:hover {
                    background-color: #999;
                }

                .snackResult {
                    margin-bottom: 10px;
                }
            `}</style>
        </div>
    );
};

export default MainComponent;
