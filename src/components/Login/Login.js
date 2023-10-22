import React, { useState, useEffect, useReducer, useContext } from "react";

import Card from "../UI/Card/Card";
import classes from "./Login.module.css";
import Button from "../UI/Button/Button";
import AuthContext from "../store/AuthContext";
import Input from "../Input/Input";

const emailReducer = (state, action) => {
  if (action.type === "USER_INPUT") {
    return { value: action.val, isValid: action.val.includes("@") };
  }
  if (action.type === "INPUT_BLUR") {
    return { value: state.value, isValid: state.value.includes("@") };
  }
  return { value: "", isValid: false };
};
const passwordReducer = (state, action) => {
  if (action.type === "USER_INPUT") {
    return { value: action.val, isValid: action.val.trim().length > 6 };
  }
  if (action.type === "INPUT_BLUR") {
    return { value: state.value, isValid: state.value.trim().length > 6 };
  }
  return { value: "", isValid: false };
};

const Login = (props) => {
  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: "",
    isValid: null,
  });
  const [passwordState, dispatchpassword] = useReducer(passwordReducer, {
    value: "",
    isValid: null,
  });
  const [enteredCollege, setEnteredCollege] = useState("");
  const [collegeIsValid, setCollegeIsValid] = useState();
  const [formIsValid, setFormIsValid] = useState(false);
  useEffect(() => {
    const identifier = setTimeout(() => {
      setFormIsValid(
        emailState.value.includes("@") &&
          passwordState.value.trim().length > 6 &&
          enteredCollege.trim().length > 2
      );
    }, 500);
    return () => {
      clearTimeout(identifier);
    };
  }, [emailState.value, passwordState.value, enteredCollege]);

  const emailChangeHandler = (event) => {
    dispatchEmail({ type: "USER_INPUT", val: event.target.value });
  };

  const passwordChangeHandler = (event) => {
    dispatchpassword({ type: "USER_INPUT", val: event.target.value });
  };
  const collegeChangeHandler = (event) => {
    setEnteredCollege(event.target.value);
  };

  const validateEmailHandler = () => {
    dispatchEmail({ type: "INPUT_BLUR" });
  };

  const validatePasswordHandler = () => {
    dispatchpassword({ type: "INPUT_BLUR" });
  };
  const validateCollegeHandler = () => {
    setCollegeIsValid(enteredCollege.trim().length > 2);
  };
  const authCtx = useContext(AuthContext);

  const submitHandler = (event) => {
    event.preventDefault();
    authCtx.onLogin(emailState.value, passwordState.value, enteredCollege);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input
          isValid={emailState.isValid}
          label="Email"
          id="email"
          type="text"
          value={emailState.value}
          onChange={emailChangeHandler}
          onBlur={validateEmailHandler}
        />
        <Input
          isValid={passwordState.isValid}
          label="Password"
          id="password"
          type="password"
          value={passwordState.value}
          onChange={passwordChangeHandler}
          onBlur={validatePasswordHandler}
        />
        <Input
          isValid={collegeIsValid}
          label="College"
          id="college"
          type="text"
          value={enteredCollege}
          onChange={collegeChangeHandler}
          onBlur={validateCollegeHandler}
        />
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} disabled={!formIsValid}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
