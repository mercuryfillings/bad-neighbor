import React from 'react'
import './Responses.css'

export default function Yes() {
  return (
    <>
      <div className='circle-y'>
        <h1>Yes</h1>
      </div>
      <section className='info-box'>
        <p className='info'>It's coming from inside the house! Sorry to say, but there is ABSOLUTELY a Karen in your midst, and they would like to speak with your manager (the police).</p>
        <br />
        <br/>
        <p className='info'>Here's a graph showing your neighbor at work. All of these claims were determined to be unfounded by the police.</p>
      </section>
    </>
  )
}