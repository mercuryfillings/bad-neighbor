import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'

export default function Main() {
  const [query, setQuery] = useState('')
  const [data, setData] = useState([])
  const BASE_URL = "https://data.cityofnewyork.us/resource/erm2-nwe9.json/"
  const ADDRESS_FILTER = "?incident_address="
  const ERROR_MESSAGE = 'No data for this address'
  const apiCall = async () => {
    try {
      const response = await axios.get(BASE_URL + ADDRESS_FILTER + query.toUpperCase())
      setData(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const handleChange = (e) => {
    setQuery(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    apiCall()
  }


  return (
    <div>
      <h1>Your neighbor sucks!</h1>
      <h2>{data.length < 1 ? ERROR_MESSAGE : ''}</h2>
      {data ? console.log(data) : ''}
      <form onSubmit={handleSubmit}>
        <label>Enter your address: </label>
        <input onChange={handleChange} />
        <button>Check 'Em Out!</button>
      </form>
      <ol>
        {data ? data.map((item, idx) => {
          if (item.agency === 'NYPD' && item.resolution_description.includes("no evidence")) {
            return <li key={item.unique_key}>{new Date(item.created_date).toLocaleString()} | <strong>{item.agency}</strong> | <em>{item.complaint_type}: {item.descriptor}: {item.location_type}<p>{item.resolution_description}</p></em></li>
          } else {
            return ''
          }
      }) : ''}
      </ol>
    </div>
  )
}
