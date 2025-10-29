import React from 'react'
export default function Results({data}){
  return (
    <div className="card" style={{marginTop:12}}>
      <h3>Possible Diagnoses</h3>
      <ul>
        {data.diagnoses.map(d=> <li key={d.disease}>{d.disease} — {d.confidence}%</li>)}
      </ul>
      <h3>Nearby Doctors</h3>
      <ul>
        {data.doctors.map(doc=> <li key={doc.id}>{doc.name} ({doc.specialty}) — {doc.distance_km ? doc.distance_km.toFixed(2)+' km' : 'location unknown'}</li>)}
      </ul>
    </div>
  )
}