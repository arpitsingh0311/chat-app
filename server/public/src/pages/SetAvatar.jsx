import React, { useState, useEffect, forwardRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import loader from "../assets/loader.gif";
import { setAvatarRoute } from "../utils/APIRoutes.js";
// import { Buffer } from "buffer";

function SetAvatar() {
  const api = "https://robohash.org";
  // const api = "https://api.multiavatar.com";

  const navigate = useNavigate();

  const [avatars, setAvatars] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);

  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    if(!localStorage.getItem('chat-app-user')){
      navigate('/');
    }
  }, []);

  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("Please select an avatar", toastOptions);
    } else {
      const user = await JSON.parse(localStorage.getItem("chat-app-user"));
      const {data} = await axios.post(`${setAvatarRoute}/${user._id}`,{
        image: avatars[selectedAvatar],
      });
      console.log(data);
      if (data.isSet) {
        user.isAvatarImageSet = true;
        user.avatarImage = data.image;
        localStorage.setItem("chat-app-user",JSON.stringify(user));
        navigate('/');
      } else{
        toast.error("Error setting avatar. Please try again", toastOptions);
      }
    }
  };

  useEffect(() => {
    const fetchAvatars = async () => {
      const data = [];
      for (let i = 0; i < 4; i++) {
        /*        
        const image = await axios.get(
          ${api}/${Math.round(Math.random() * 1000)}
        );
        const buffer = Buffer.from(image.data); // Don't use new Buffer (deprecated)
        data.push(buffer.toString("base64"));*/
        // Just generate URLs with random numbers
        const seed = Math.round(Math.random() * 1000);
        // RoboHash supports .png or .svg (we'll use png for simplicity)
        const imageUrl = `${api}/${seed}.png`;
        data.push(imageUrl);
      }
      // console.log(data);
      setAvatars(data);
      setisLoading(false);
    };

    fetchAvatars();
  }, []);

  return (
    <>
      {isLoading ? (
        <Container>
          <img src={loader} alt="loader" className="loader" />
        </Container>
      ) : (
        <Container>
          <div className="title-container">
            <h1>Pick an avatar as your profile picture</h1>
          </div>
          <div className="avatars">
            {avatars.map((avatar, index) => {
              return (
                <div
                  key={index}
                  className={`avatar ${
                    selectedAvatar === index ? "selected" : ""
                  }`}
                >
                  <img
                    // src={`data:image/svg+xml;base64,${avatar}`}
                    src={avatar}
                    alt="avatar"
                    onClick={() => setSelectedAvatar(index)}
                  />
                </div>
              );
            })}
          </div>
          <button className="submit-btn" onClick={setProfilePicture}>
            Set as Profile Picture
          </button>
        </Container>
      )}
      <ToastContainer />
    </>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  background-color: #131324;
  height: 100vh;
  width: 100vw;
  .loader {
    max-inline-size: 100%;
  }
  .title-container {
    h1 {
      color: while;
    }
  }
  .avatars {
    display: flex;
    gap: 2rem;

    .avatar {
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 5rem;
      display: flex;
      align-items: center;
      transition: 0.5sec ease-in-out;
      img {
        height: 7rem;
        background: linear-gradient(135deg, #1a1a2e, #0f3460);
        border-radius: 5rem;
        padding: 0.4rem;
      }
    }
    .selected {
      border: 0.4rem solid #4e0eff;
    }
  }
  .submit-btn {
    background-color: #997af0;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    transition: 0.3s ease-in-out;
    &:hover {
      background-color: #4e0eff;
    }
  }
`;

export default SetAvatar;
