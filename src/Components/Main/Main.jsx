import React from 'react'
import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import * as d3 from 'd3'

export default function Main() {
//state
  //user query
  const [query, setQuery] = useState('')
  //raw NYC open data
  const [data, setData] = useState([])
  //filtered data - only years of frivolous 311 noise complaints
  const [years, setYears] = useState([])
  //unique set of years for x axis from earliest year to latest in dataset
  const [xAxis, setXaxis] = useState([])
  //2D array of data pairs, year + calls during that year
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
    if (points.length > 0 && d3Container.current) {
      const w = 800;
      const h = 500;
      const padding = 60;

      //set xScale (need to dynamically set inital date in domain)

      const xScale = d3.scaleTime()
        .domain([d3.min(xAxis, (d) => d), d3.max(xAxis, (d) => d)])
        .range([padding, w - padding]);
      
      //set yScale
      
      const yScale = d3.scaleLinear()
        .domain([0, d3.max(points, (d) => d[1])])
        .range([h - padding, padding]);
      
      //build graph SVG
      
      const svg = d3.select(d3Container.current)
        .append('svg')
        .attr('width', w)
        .attr('height', h)
      
      //add strokes
      
        svg.append("path")
        .datum(points)
        .attr("fill", "none")
        .attr("stroke", "#69b3a2")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
          .x((d) => xScale(d[0]) )
          .y((d) => yScale(d[1]) )
        )
      
      //add dots
      
      svg.selectAll("circle")
        .data(points)
        .enter()
        .append("circle")
        .attr("cx", (d) => xScale(d[0]))
        .attr("cy",(d) => yScale(d[1]))
        .attr("r", (d) => 5);
      
      const xAxisLocal = d3.axisBottom(xScale).tickFormat(d3.format("d"));
    
      const yAxisLocal = d3.axisLeft(yScale);

      svg.append("g")
      .attr("transform", "translate(0," + (h - padding) + ")")
      .call(xAxisLocal)
      
      svg.append("g")
      .attr("transform", "translate(" + padding + ",0)")
      .call(yAxisLocal)
      
      }
  },
    [points, xAxis, d3Container.current])

  return (
    <div>
      <h1>Your neighbor sucks!</h1>
      {years.length > 0 ? <svg className='d3-component' ref={d3Container} width={800} height={500}/> : ''}
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