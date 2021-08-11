import React, { useState, useEffect } from 'react';
import AppRouter from 'components/Router';
import { authService } from 'fbase'

function App() {
  const [init, setinit] = useState(false)
  const [userObj, setuserObj] = useState(null)
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        // setuserObj(user)
        setuserObj({
          displayName:user.displayName,
          uid:user.uid,
          updateProfile:(args) => user.updateProfile(args),
        })
      } else{
        setuserObj(null)
      }
      setinit(true)
    })
  }, [])
  const refreshUser = () => {
    const user = authService.currentUser;
    // setuserObj(Object.assign({},user))
    setuserObj({
      displayName:user.displayName,
      uid:user.uid,
      updateProfile:(args) => user.updateProfile(args),
    })
  }
  return (
    <>
      {init ? (
        <AppRouter refreshUser={refreshUser} userObj={userObj} isLoggedIn={Boolean(userObj)} />
      ) : (
        "Initializing..."
      )}
      <footer>&copy; {new Date().getFullYear()} Hwitter </footer>
    </>
  );
}

export default App