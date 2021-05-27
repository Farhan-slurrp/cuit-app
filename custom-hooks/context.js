import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useLocalStorage } from "./localStorage";

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [tokenInfo, setTokenInfo] = useLocalStorage("userInfo", null);
  const router = useRouter();

  const addThread = async (e) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: tokenInfo.token,
      },
    };

    const formData = JSON.stringify({
      content: e.target.content.value,
    });
    const res = await axios.post(
      "https://afternoon-temple-94147.herokuapp.com/api/threads",
      formData,
      config
    );

    const data = await res.data;
    if (data.success) {
      e.target.reset();
    }
    return data;
  };

  const editThread = async (value, threadId) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: tokenInfo.token,
      },
    };

    const formData = JSON.stringify({
      content: value,
    });
    const res = await axios.put(
      `https://afternoon-temple-94147.herokuapp.com/api/threads/${threadId}`,
      formData,
      config
    );

    const data = await res.data;
    return data;
  };

  const deleteThread = async (threadId) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: tokenInfo.token,
      },
    };

    const res = await axios.delete(
      `https://afternoon-temple-94147.herokuapp.com/api/threads/${threadId}`,
      config
    );

    const data = await res.data;
    return data;
  };

  const addComment = async (e, threadId) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: tokenInfo.token,
      },
    };

    const formData = JSON.stringify({
      content: e.target.content.value,
    });
    const res = await axios.post(
      `https://afternoon-temple-94147.herokuapp.com/api/comments/${threadId}`,
      formData,
      config
    );

    const data = await res.data;
    if (data.success) {
      e.target.reset();
    }
    return data;
  };

  const editComment = async (value, threadId, commentId) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: tokenInfo.token,
      },
    };

    const formData = JSON.stringify({
      content: value,
    });
    const res = await axios.put(
      `https://afternoon-temple-94147.herokuapp.com/api/comments/${threadId}?commentId=${commentId}`,
      formData,
      config
    );

    const data = await res.data;
    return data;
  };

  const deleteComment = async (threadId, commentId) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: tokenInfo.token,
      },
    };

    const res = await axios.delete(
      `https://afternoon-temple-94147.herokuapp.com/api/comments/${threadId}?commentId=${commentId}`,
      config
    );

    const data = await res.data;
    return data;
  };

  const onLogout = () => {
    const logout = confirm("Are you sure to logout?");
    if (logout) {
      setTokenInfo(null);
      router.push("/");
    }
  };

  const onLogin = async (e) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const formData = JSON.stringify({
      username: e.target.username.value,
      password: e.target.password.value,
    });
    const res = await axios.post(
      "https://afternoon-temple-94147.herokuapp.com/api/users/login",
      formData,
      config
    );

    const data = await res.data;
    if (data.success) {
      setTokenInfo(data);
      e.target.reset();
      router.back();
    }
    return data;
  };

  const onSignup = async (e) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const formData = JSON.stringify({
      username: e.target.username.value,
      email: e.target.email.value,
      password: e.target.password.value,
    });
    const res = await axios.post(
      "https://afternoon-temple-94147.herokuapp.com/api/users/register",
      formData,
      config
    );

    const data = await res.data;
    if (data.success) {
      setTokenInfo(data);
      e.target.reset();
      router.back();
    }
    return data;
  };

  return (
    <AppContext.Provider
      value={{
        loading,
        tokenInfo,
        onLogout,
        onLogin,
        onSignup,
        addThread,
        addComment,
        editThread,
        editComment,
        deleteComment,
        deleteThread,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider };
