import React from 'react'
import './Responses.css'

export default function No(props) {
  return (
    <>
      <div className='circle-n'>
        <h1>No</h1>
      </div>
      <section className='info-box'>
        <p className='info'>It seems like your neighbors are generally sane, reasonable people — at least as far as the city of New York is concerned. There have only been {props.complaints} frivolous 311 complaints at your address over the last {props.time} years, and I think we can let that slide. Maybe it's your fault they called the cops on you.</p>
      </section>
    </>
  )
}
