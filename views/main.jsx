const React = require('react');

const Main = () => {
  return (
    <div>
      <h1>LOGIN</h1>
      <a className="googleButton" href="/auth/google">
        <img
          height="20"
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          loading="lazy"
          alt="google logo"
        />
        <span size="20">Login with Google</span>
      </a>
      <style jsx>{`
        .googleButton {
          display: inline-block;
          background-color: #4285f4;
          color: white;
          text-decoration: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
        }
        .googleButton:hover {
          background-color: #357ae8;
        }
        .googleButton img {
          vertical-align: middle;
          margin-right: 10px;
        }
      `}</style>
    </div>
  );
};

module.exports = Main;
