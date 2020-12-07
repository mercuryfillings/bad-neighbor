import React from 'react'
import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import * as d3 from 'd3'

export default function Main() {
//state
  const [query, setQuery] = useState('')
  const [data, setData] = useState([])
  const [years, setYears] = useState([])
  const [xAxis, setXaxis] = useState([])
  const [points, setPoints] = useState([])
  const [toggle, setToggle] = useState(false)

//variables

  const BASE_URL = "https://data.cityofnewyork.us/resource/erm2-nwe9.json/"
  const ADDRESS_FILTER = "?incident_address="
  const ERROR_MESSAGE = 'No data for this address'
  const d3Container = useRef(null)

//api call
  
  const apiCall = async () => {
    try {
      const response = await axios.get(BASE_URL + ADDRESS_FILTER + query.toUpperCase())
      setData(response.data)
    } catch (error) {
      console.log(error)
    }
  }

//event handlers

  const handleChange = (e) => {
    setQuery(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    apiCall()
    setToggle(true)
  }

//set years array in state

  useEffect(() => {
    if (data.length > 0) {
      setYears(data.map(item => {
        if (item.agency === 'NYPD' && item.resolution_description.includes("no evidence")) {
          return item.created_date.slice(0, 4)
        }
      }).filter(item => {
        return item != undefined
        }).sort((a, b) => b - a))
      }
  }, [data])
  
//set xAxis array in state

  useEffect(() => {
    if (years.length > 0)
    setXaxis([...Array(Math.max(...years) - Math.min(...years) + 1).keys()].map(num => num + Math.min(...years)))
  }, [years])

//set points array in state
  
  useEffect(() => {
    if (years.length > 0) {
      let yr = xAxis.map(year => [year.toString(), 0])
      yr.forEach(pair => {
        years.forEach(year => {
          if (year === pair[0]) {
            pair[1]++
          }
        })
      })
      setPoints(yr)
    }
  }, [xAxis, years])

//build graph

  useEffect(() => {
    if (years.length > 0 && d3Container.current) {
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
        .attr("height", (d, i) => 400 - (d * 3))
        .attr('y', (d,i) => 400 - 3 * d - 3)
        .text((d) => d)
      }
  },
    [years, d3Container.current])

  return (
    <div>
      <h1>Your neighbor sucks!</h1>
      {years.length > 0 ? <svg className='d3-component' ref={d3Container} /> : ''}
      <h2>{data.length < 1 && toggle ? ERROR_MESSAGE : ''}</h2>
      {console.log(d3Container.current)}
      {years.length > 0 ? console.log(points) : ''}
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