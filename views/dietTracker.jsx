const React = require('react');

const MainComponent = ({ title, stylesPath }) => (
    <html lang="en">
        <head>
            <meta charSet="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <link rel="stylesheet" href={stylesPath} />
            <title>{title}</title>
        </head>
        <body>
            <div className="container">
                <h1 style={{ color: 'navy', marginLeft: '20px' }}>Diet Tracking</h1>
                <p>This is the Diet Tracker page.</p>
                <form action="/" method="get">
                    <button type="submit">Go to Main Page</button>
                </form>
            </div>
        </body>
    </html>
);

export default MainComponent;
