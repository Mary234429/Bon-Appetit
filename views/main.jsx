const React = require('react');

const Main = ({ title }) => (
    <div>
        <h1>{title}</h1>
        <p>Welcome to the home page!</p>
        <form action="/dietTracker" method="get">
            <button type="submit">Go to Diet Tracker</button>
        </form>
    </div>
);

module.exports = Main;
