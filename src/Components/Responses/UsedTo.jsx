import React from 'react'
import './Responses.css'

export default function UsedTo(props) {
  return (
    <>
    <div className='circle-u'>
      <h1 className='text'>There Was at One Point!</h1>
      </div>
      <section className='info-box'>
        <p className='info'>Your building used to be Karen-positive, but it looks like whoever it was chilled out or moved away or died or something. There have been <span className='no-text'>{props.complaints}</span> frivolous 311 complaints at your address over the last <span className='no-text'>{props.time}</span> years, but that's gone way down recently.</p>
      </section>
    </>
  )
}