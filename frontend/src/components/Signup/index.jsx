import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";

const Signup = () => {
  // State variables for form data, password strength, current password, error, and show password
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [passwordStrength, setPasswordStrength] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  // Function to handle input changes in the form
  const handleChange = ({ currentTarget: input }) => {
    const newPassword = input.value;
    setData({ ...data, [input.name]: newPassword });

    // Set the current password and check password strength
    setCurrentPassword(newPassword);
    const strength = assessPasswordStrength(newPassword);
    setPasswordStrength(strength);
  };

  // Function to assess password strength based on criteria
  const assessPasswordStrength = (password) => {
    const hasSymbol = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/\-=]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);

    const characterTypes = [hasSymbol, hasLowercase, hasUppercase, hasNumber];
    const presentTypesCount = characterTypes.filter((type) => type).length;

    if (presentTypesCount >= 4) {
      return "Strong";
    } else if (presentTypesCount === 3) {
      return "Medium";
    } else {
      return "Weak";
    }
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = "http://localhost:8080/api/users";
      const { data: res } = await axios.post(url, data);
      navigate("/login");
      console.log(res.message);
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
        setTimeout(() => {
          setError("");
        }, 1500);
      }
    }
  };

  // Function to toggle password visibility
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // Function to get the password strength symbol (Unicode)
  const getPasswordStrengthSymbol = (strength) => {
    if (strength === "Weak") {
      return "🟥";
    } else if (strength === "Medium") {
      return "🟨";
    } else if (strength === "Strong") {
      return "🟩";
    }
  };

  return (
    <div className={styles.signup_container}>
      <div className={styles.signup_form_container}>
        <div className={styles.left}>
          <h1>Welcome to EcoConnect</h1>
          <Link to="/login">
            <button type="button" className={styles.white_btn}>
              Sign In
            </button>
          </Link>
        </div>
        <div className={styles.right}>
          <form className={styles.form_container} onSubmit={handleSubmit}>
            <h1>Create Account</h1>

            {/* Input fields for first name, last name, email, and password */}
            <input
              type="text"
              placeholder="First Name"
              name="firstName"
              onChange={handleChange}
              value={data.firstName}
              required
              className={styles.input}
            />
            <input
              type="text"
              placeholder="Last Name"
              name="lastName"
              onChange={handleChange}
              value={data.lastName}
              required
              className={styles.input}
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
              value={data.email}
              required
              className={styles.input}
            />
            <input
              type={showPassword ? "text" : "password"} // Toggle password visibility
              placeholder="Password"
              name="password"
              onChange={handleChange}
              value={data.password}
              required
              className={styles.input}
              id="passwordInput"
            />

            {/* Checkbox to show/hide password */}
            <div className={styles.checkboxContainer}>
              <label htmlFor="passwordInput" className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={showPassword}
                  onChange={toggleShowPassword}
                />
                Show Password
              </label>
            </div>

            {/* Display password strength and symbol */}
            <div className={styles.passwordStrengthContainer}>
              {currentPassword && (
                <span className={styles.passwordStrengthSymbol}>
                  {getPasswordStrengthSymbol(passwordStrength)}
                </span>
              )}
              {currentPassword && (
                <span className={styles.passwordStrengthText}>
                  Password Strength: {passwordStrength}
                </span>
              )}
            </div>

            {/* Display error message if there's an error */}
            {error && <div className={styles.error_msg}>{error}</div>}

            {/* Submit button */}
            <button type="submit" className={styles.green_btn}>
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;