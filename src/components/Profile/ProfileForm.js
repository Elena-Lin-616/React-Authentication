import classes from "./ProfileForm.module.css";
import { useRef, useContext } from "react";
import AuthContext from "../../store/auth-context";
import { useHistory } from "react-router-dom";

const URL =
  "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyAYxTFqq5bGdBgpsFpv-KUUNygDTUG0Vlw";
const ProfileForm = () => {
  const history = useHistory();
  const passwordInputRef = useRef();

  const authCtx = useContext(AuthContext);
  const token = authCtx.token;

  const handleSubmit = (event) => {
    event.preventDefault();
    const enteredPassword = passwordInputRef.current.value;

    // optional : add validation
    fetch(URL, {
      method: "POST",
      body: JSON.stringify({
        idToken: token,
        password: enteredPassword,
        returnSecureToken: false,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        // assume always succeeds
        history.replace("/");
      })
      .catch((err) => console.log(err));
  };

  return (
    <form className={classes.form} onSubmit={handleSubmit}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input
          type="password"
          id="new-password"
          ref={passwordInputRef}
          minLength={7}
        />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
};

export default ProfileForm;
