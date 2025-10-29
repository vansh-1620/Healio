import React from 'react'
export default function Navbar({user,onLogout}){
  return (
    <div className="nav">
      <div><strong>HEALIO</strong></div>
      <div>
        {user ? (
          <>
            <span style={{marginRight:12}}>Hi, {user.name||user.email}</span>
            <button className="button" onClick={onLogout}>Logout</button>
          </>
        ) : null}
      </div>
    </div>
  )
}