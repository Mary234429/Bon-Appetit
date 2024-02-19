import React from 'react';

const About = ({ title }) => (
    <div>
        <h1>{title}</h1>
        <p>This is the About US page.</p>
        <form action="/" method="get">
            <button type="submit">Go to Main Page</button>
        </form>


    </div>
);

module.exports = About;