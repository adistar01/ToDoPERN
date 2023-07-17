import React, { useState } from "react";
import { useCookies } from 'react-cookie';

const Auth = () => {

  const [cookies, setCookie, removeCookie] = useCookies(null);

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);

  const viewLogin = (status) => {
    setError(null);
    setIsLogin(status);
  };

  const handleSubmit = async (e, endpoint) => {
    e.preventDefault();
      if (!isLogin && password !== confirmPassword) {
        setError("Make sure Passwords match");
        return;
      }
      const response = await fetch(
        `${process.env.REACT_APP_GOSERVER}/${endpoint}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );
      const data = await response.json();

      if(data.error){
        setError(data.error)
      }else{
        setCookie('Email', data.email);
        setCookie('AuthToken', data.token);

        window.location.reload()
      }
  };

  return (
    <div className="auth-container">
      <div className="auth-container-box">
        <form>
          <h2>{isLogin ? "Please Log In : " : "Please Sign Up : "}</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {!isLogin && (
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          )}
          <input
            type="submit"
            className="create"
            onClick={(e) => handleSubmit(e, isLogin ? "login" : "signup")}
          />
          {error && <p>{error}</p>}
        </form>
        <div className="auth-options">
          <button
            onClick={() => viewLogin(false)}
            style={{
              backgroundColor: !isLogin
                ? "rgb(255, 255, 255)"
                : "rgb(188, 188, 188)",
            }}
          >
            Sign Up
          </button>

          <button
            onClick={() => viewLogin(true)}
            style={{
              backgroundColor: isLogin
                ? "rgb(255, 255, 255)"
                : "rgb(188, 188, 188)",
            }}
          >
            LogIn
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
