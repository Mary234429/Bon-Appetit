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
      <a className="registerButton" href="/auth/google">
        <img
          height="20"
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          loading="lazy"
          alt="google logo"
        />
        <span size="20">Register</span>
      </a>
      <style jsx="true">{`
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
        .registerButton {
          display: inline-block;
          background-color: #4285f4;
          color: white;
          text-decoration: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
        }
        .registerButton:hover {
          background-color: #357ae8;
        }
        .registerButton img {
          vertical-align: middle;
          margin-right: 10px;
        }
      `}</style>
    </div>
  );
};


module.exports = Main;
