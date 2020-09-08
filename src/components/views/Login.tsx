import React from 'react'
import firebase from '@/scripts/firebase'

const provider = new firebase.auth.GoogleAuthProvider()

export const Login: React.FC = () => {
  const onClick = () => {
    firebase.auth().signInWithPopup(provider)
  }

  return (
    <div>
      login page
      <button onClick={onClick} type="button">
        login
      </button>
    </div>
  )
}
