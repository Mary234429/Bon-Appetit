// ContactForm.jsx
const React = require('react');

const ContactForm = ({ title }) => {
    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('http://localhost:3000/submit-form', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (response.ok) {
                console.log('Success:', await response.text());
            } else {
                console.error('Server responded with a non-OK status:', response.status);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <h1>{title}</h1>
            <p>This is the Contact page.</p>
            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input type="text" name="name" required />
                </label>
                <br />
                <label>
                    Email:
                    <input type="email" name="email" required />
                </label>
                <br />
                <label>
                    Message:
                    <textarea name="message" required />
                </label>
                <br />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

module.exports = ContactForm;
