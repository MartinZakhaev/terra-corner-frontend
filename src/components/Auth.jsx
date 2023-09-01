import React, { useEffect, useState, useRef } from "react";
import Cookies from "universal-cookie";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faLock,
  faAddressCard,
  faUnlockKeyhole,
  faImage,
  faSquarePhone,
  faGear,
} from "@fortawesome/free-solid-svg-icons";
import lottie from "lottie-web/build/player/lottie_light";
import terraCornerLogin from "../assets/static/terraCornerLogin.json";
import toast from "react-hot-toast";

const cookies = new Cookies();

const initialState = {
  fullname: "",
  username: "",
  password: "",
  confirmPassword: "",
  phoneNumber: "",
  avatarURL: "",
};

const Auth = () => {
  const cloudinaryRef = useRef();
  const widgetRef = useRef();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(initialState);
  const [isSignup, setIsSignup] = useState(false);
  const [userImage, setUserImage] = useState("");

  useEffect(() => {
    cloudinaryRef.current = window.cloudinary;
    widgetRef.current = cloudinaryRef.current.createUploadWidget(
      {
        cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
        uploadPreset: process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET,
      },
      function (error, result) {
        if (!error && result && result.event === "success") {
          const imageUrl = result.info.secure_url;
          setUserImage(imageUrl);
          toast.success("Avatar image uploaded successfully!!");
        } else if (error) {
          toast.error("Error uploading avatar image. Please try again.");
        }
      }
    );

    lottie.loadAnimation({
      container: document.querySelector("#auth__form-animation"),
      animationData: terraCornerLogin,
    });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { fullname, username, password, phoneNumber, avatarURL } = form;
      const URL = "https://sore-teal-eagle-sari.cyclic.cloud/auth";
      const {
        data: { token, userId, hashedPassword, fullName },
      } = await axios.post(`${URL}/${isSignup ? "signup" : "login"}`, {
        username,
        password,
        fullname: form.fullName,
        phoneNumber,
        avatarURL,
      });
      cookies.set("token", token);
      cookies.set("username", username);
      cookies.set("fullName", fullname);
      cookies.set("userId", userId);
      if (isSignup) {
        cookies.set("phoneNumber", phoneNumber);
        cookies.set("avatarURL", userImage);
        cookies.set("hashedPassword", hashedPassword);
      }
      setLoading(false);
      window.location.reload();
    } catch (error) {
      setLoading(false);
      toast.error(
        "Oops! It seems like the username or password is not correct. Give it another shot!"
      );
    }
  };

  const switchMode = () => {
    setIsSignup((prevIsSignup) => !prevIsSignup);
  };

  return (
    <div className="auth__form-outer-container">
      <div className="auth__form-center-container">
        <div className="auth__form-left-div">
          <div className="auth__form-left-div-input-container">
            <h1 className="auth__form-header">
              {isSignup
                ? "Begin Your Adventure 🗺️"
                : "Get Started by Logging In 🚀"}
            </h1>
            <p className="auth__form-subheader">
              {isSignup
                ? "Start your adventure with us by signing up for an account."
                : "Begin your journey by logging into your account."}
            </p>
            <form onSubmit={handleSubmit}>
              {isSignup && (
                <div className="auth__form-container_fields-content_input">
                  <input
                    name="fullName"
                    type="text"
                    placeholder="Full Name"
                    onChange={handleChange}
                    required
                  />
                  <FontAwesomeIcon className="icon" icon={faAddressCard} />
                </div>
              )}
              <div className="auth__form-container_fields-content_input">
                <input
                  name="username"
                  type="text"
                  placeholder="Username"
                  onChange={handleChange}
                  required
                />
                <FontAwesomeIcon className="icon" icon={faUser} />
              </div>
              {isSignup && (
                <div className="auth__form-container_fields-content_input">
                  <input
                    name="phoneNumber"
                    type="text"
                    placeholder="Phone Number"
                    onChange={handleChange}
                    required
                  />
                  <FontAwesomeIcon className="icon" icon={faSquarePhone} />
                </div>
              )}
              {isSignup && (
                <div className="auth__form-container_fields-content_input">
                  <input
                    name="avatarURL"
                    type="text"
                    placeholder="Avatar"
                    onClick={() => widgetRef.current.open()}
                    required
                    value={userImage}
                  />
                  <FontAwesomeIcon className="icon" icon={faImage} />
                </div>
              )}
              <div className="auth__form-container_fields-content_input">
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  onChange={handleChange}
                  required
                />
                <FontAwesomeIcon className="icon" icon={faLock} />
              </div>
              {isSignup && (
                <div className="auth__form-container_fields-content_input">
                  <input
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm Password"
                    onChange={handleChange}
                    required
                  />
                  <FontAwesomeIcon className="icon" icon={faUnlockKeyhole} />
                </div>
              )}
              <div className="auth__form-container_fields-content_button">
                <button>
                  {loading ? (
                    <FontAwesomeIcon
                      icon={faGear}
                      size="lg"
                      spin
                      style={{ color: "#ffffff" }}
                    />
                  ) : isSignup ? (
                    "Sign Up"
                  ) : (
                    "Sign In"
                  )}
                </button>
              </div>
            </form>
            <div className="auth__form-container_fields-account">
              <p>
                {isSignup
                  ? "Already have an account? "
                  : "Don't have an account? "}
                <span onClick={switchMode}>
                  {isSignup ? "Sign In" : "Sign Up"}
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className="auth__form-right-div" id="auth__form-animation"></div>
      </div>
    </div>
  );
};

export default Auth;
