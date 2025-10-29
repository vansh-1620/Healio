import React, {useState} from 'react'
import API from '../api'
import './SymptomForm.css';


const SYMPTOMS = ['fever','cough','runny_nose','body_ache','loss_of_smell','breathlessness','sneezing','itchy_eyes']
const LEVELS = ['none','mild','moderate','severe']

export default function SymptomForm({onResults}){
  const [values,setValues] = useState(SYMPTOMS.reduce((a,c)=>({...a,[c]:'none'}),{}))
  const [loading,setLoading]=useState(false)

  function setVal(k,v){ setValues({...values,[k]:v}) }

  async function submit(e){
    e.preventDefault(); setLoading(true)
    // try geolocation
    let lat=null, lon=null
    try{
      await new Promise((res,rej)=>navigator.geolocation.getCurrentPosition(p=>{lat=p.coords.latitude; lon=p.coords.longitude;res()},err=>res()))
    }catch(e){}

    try{
      const r = await API.post('/diagnose',{symptoms:values, lat, lon})
      onResults(r.data)
    }catch(err){alert(err.response?.data?.msg || 'error')}
    setLoading(false)
  }

  return (
    <form onSubmit={submit}>
      <div className="symptom-grid">
        {SYMPTOMS.map(s=> (
          <div key={s} className="symptom-card">
            <strong>{s.replace('_',' ')}</strong>
            <div>
              {LEVELS.map(l=> (
                <label key={l} style={{marginRight:6}}>
                  <input type="radio" name={s} value={l} checked={values[s]===l} onChange={()=>setVal(s,l)} /> {l}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{marginTop:12}}>
        <button className="button">{loading? 'Analyzing...' : 'Analyze & Find Doctors'}</button>
      </div>
    </form>
  )
}