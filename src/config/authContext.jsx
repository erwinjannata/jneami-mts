/* eslint-disable no-async-promise-executor */
/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";
import firebase from "./../config/firebase";
import { useContext } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [uid, setUid] = useState(null);
  const [name, setName] = useState("");
  const [origin, setOrigin] = useState("");
  const [level, setLevel] = useState(0);
  let db = firebase.database();

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        setUid(user.uid);
        db.ref(`users/${user.uid}`).on("value", (snapshot) => {
          if (snapshot.exists()) {
            setName(snapshot.val().name);
            setOrigin(snapshot.val().origin);
            setLevel(snapshot.val().permissionLevel);
          }
        });
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, [db]);

  const login = (email, password) => {
    return new Promise(async (resolve, reject) => {
      try {
        await firebase
          .auth()
          .setPersistence(firebase.auth.Auth.Persistence.SESSION);
        const { user } = await firebase
          .auth()
          .signInWithEmailAndPassword(email, password);
        setUser(user);
        resolve(user);
      } catch (error) {
        reject(error);
      }
    });
  };

  const logout = () => {
    return new Promise((resolve, reject) => {
      try {
        firebase.auth().signOut();
        setUser(null);
        setUid(null);
        setName("");
        setOrigin("");
        setLevel(0);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  };

  const resetPassword = (email) => {
    try {
      firebase
        .auth()
        .sendPasswordResetEmail(email)
        .then(() => {
          alert("Email terkirim, cek inbox Gmail");
        })
        .catch((error) => {
          alert(error.message);
        });
    } catch (error) {
      alert(error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, uid, name, origin, level, login, logout, resetPassword }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const UseAuth = () => {
  return useContext(AuthContext);
};
