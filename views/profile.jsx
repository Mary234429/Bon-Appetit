import React from 'react';

const Profile = ({ title }) => (
    <div>
        <h1>{title}</h1>
        <p>This is the Profile page.</p>
        <form action="/" method="get">
            <button type="submit">Go to Main Page</button>
        </form>


    </div>
);

module.exports = Profile;