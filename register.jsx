import React, {useState} from 'react'
import API from '../api'
export default function Register(){
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [name,setName]=useState('')
  async function submit(e){
    e.preventDefault()
    try{
      await API.post('/register',{email,password,name})
      alert('registered — now login')
    }catch(err){alert(err.response?.data?.msg || 'register failed')}
  }
  return (
    <div className="card">
      <h3>Register</h3>
      <form onSubmit={submit}>
        <div className="form-row"><input placeholder="name" value={name} onChange={e=>setName(e.target.value)} /></div>
        <div className="form-row"><input placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} /></div>
        <div className="form-row"><input placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} /></div>
        <button className="button">Create Account</button>
      </form>
    </div>
  )
}