import React from 'react'
import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import * as d3 from 'd3'

export default function Main() {
  const [query, setQuery] = useState('')
  const [data, setData] = useState([])
  const [years, setYears] = useState([])
  const [points, setPoints] = useState({})
  const [toggle, setToggle] = useState(false)
  const BASE_URL = "https://data.cityofnewyork.us/resource/erm2-nwe9.json/"
  const ADDRESS_FILTER = "?incident_address="
  const ERROR_MESSAGE = 'No data for this address'
  const d3Container = useRef(null)
  const apiCall = async () => {
    try {
      const response = await axios.get(BASE_URL + ADDRESS_FILTER + query.toUpperCase())
      setData(response.data)
      setYears(data.map(item => {
        if (item.agency === 'NYPD' && item.resolution_description.includes("no evidence")) {
          return parseInt(item.created_date.slice(0,4))
        }
      }).filter(item => {
        return item != undefined
      }).sort((a,b) => b - a))
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
    setToggle(true)
  }

  useEffect(() => {
    if (years && d3Container.current) {
      const svg = d3.select(d3Container.current)
        .append('svg')
        .attr('width', 800)
        .attr('height', 400)
      
      svg.selectAll('rect')
        .data(years)
        .enter()
        .append('rect')
        .attr('x', (d, i) => i * 30)
        .attr('y', 40)
        .attr("width", 25)
        .attr("height", (d, i) => d * 3 
      )}
  },
    [years, d3Container.current])

  return (
    <div>
      <h1>Your neighbor sucks!</h1>
      {years.length > 0 ? <svg className='d3-component' ref={d3Container} /> : ''}
      <h2>{data.length < 1 && toggle ? ERROR_MESSAGE : ''}</h2>
      {console.log(d3Container.current)}
      {years.length > 0 ? console.log(years) : ''}
      <form onSubmit={handleSubmit}>
        <label>Enter your address: </label>
        <input onChange={handleChange} />
        <button>Check 'Em Out!</button>
      </form>
      <ol>
        {data ? data.map((item) => {
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

//width={400} height={200} 