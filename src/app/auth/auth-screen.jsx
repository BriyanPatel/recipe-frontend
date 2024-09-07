"use client";

import { useState } from "react";
import Login from "./login";
import Register from "./register";

/**
 * AuthScreen is a component that renders either a login form or a register
 * form, depending on the value of the `state` state variable. If the state
 * variable is "login", it renders the login form; otherwise, it renders the
 * register form.
 *
 * The component uses the `useState` hook to initialize the `state` variable
 * with the value "login". It then uses the `return` statement to render a
 * `div` element with the class "h-full flex items-center justify-center
 * bg-[#5c3b58]". The `div` element contains another `div` element with the
 * class "md:h-auto md:w-[420px]". This `div` element is used to render
 * either the login form or the register form, depending on the value of the
 * `state` variable.
 *
 * The component also uses the `setState` function to change the value of the
 * `state` variable. This is done by passing the `setState` function to the
 * `Login` and `Register` components as a prop. When the user clicks the
 * "login" or "register" button, the `setState` function is called with the
 * value "login" or "register", respectively, which causes the component to
 * re-render with the other form.
 */
const AuthScreen = () => {
  const [state, setState] = useState("login");
  return (
    <div className="h-full flex items-center justify-center bg-[#5c3b58]">
      <div className="md:h-auto md:w-[420px]">{state==="login" ? <Login setState={setState} /> : <Register setState={setState} />}</div>
    </div>
  );
};

export default AuthScreen;
