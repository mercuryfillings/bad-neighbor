import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'

export default function Main() {
  const [query, setQuery] = useState('')
  const [address, setAddress] = useState('')
  const [data, setData] = useState({})
  const BASE_URL = "https://data.cityofnewyork.us/resource/erm2-nwe9.json/"
  const ADDRESS = "?incident_address="

  useEffect(async () => {
    try {
      const response = await axios.get(BASE_URL + ADDRESS + '218 HIMROD STREET')
      setData(response)
    } catch (error) {
      console.log(error)
    }
  }, [])

  const handleChange = (e) => {
    setQuery(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setAddress(query)
  }
  console.log(data)

  return (
    <div>
      <h1>Your neighbor sucks!</h1>
      <h2>{address}</h2>
      <form onSubmit={handleSubmit}>
        <label>Enter your address: </label>
        <input onChange={handleChange} />
        <button>Check 'Em Out!</button>
      </form>
    </div>
  )
}
