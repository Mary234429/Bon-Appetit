const React = require('react');

const ContactForm = ({ title }) => (
        <div>
            <h1>{title}</h1>
            <p>This is the Contact page.</p>
            <form action="/contactSubmit" method="post">
                <input type="text" placeholder="Name" name="name" id="name"></input><br/>
                <input type="email" placeholder="Email" name="email" id="email"></input><br/>
                <textarea id="message" name="message" placeholder="Message"></textarea><br/>
                <input type="submit" value="Submit"/>
            </form>
        </div>
);

module.exports = ContactForm;
