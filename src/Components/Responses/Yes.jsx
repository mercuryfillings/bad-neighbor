import React from 'react'
import './Responses.css'

export default function Yes() {
  return (
    <>
      <div className='circle-y'>
        <h1>Yes</h1>
      </div>
      <section className='info-box'>
        <p className='info'>It's coming from inside the house! Sorry to say, but there is ABSOLUTELY a Karen in your building. Don't look now, but I think I hear the cops outside.</p>
        <br />
        <br/>
        <p className='info'>Here's a graph showing your neighbor at work. All of these calls were unsubstantiated by the police, who are legally required to respond in person to any and all noise complaints they receive.</p>
      </section>
    </>
  )
}