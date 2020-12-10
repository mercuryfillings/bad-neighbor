import React from 'react'
import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import * as d3 from 'd3'
import No from '../Responses/No'
import Yes from '../Responses/Yes'
import UsedTo from '../Responses/UsedTo'
import './Main.css'
import {
  FacebookShareButton,
  LinkedinShareButton,
  RedditShareButton,
  TwitterShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  RedditIcon
} from "react-share";

export default function Main() {
//state
  //user query
  const [query, setQuery] = useState('')
  //last query
  const [prev, setPrev] = useState('')
  //raw NYC open data
  const [data, setData] = useState([])
  //filtered data - only years of frivolous 311 noise complaints
  const [years, setYears] = useState([])
  //unique set of years for x axis from earliest year to latest in dataset
  const [xAxis, setXaxis] = useState([])
  //2D array of data pairs, year + calls during that year
  const [points, setPoints] = useState([])
  //set max point
  const [max, setMax] = useState(null)
  //error message toggle
  const [toggle, setToggle] = useState(false)
  //Determine verdict
  const [verdict, setVerdict] = useState(null)

//variables

  const BASE_URL = "https://data.cityofnewyork.us/resource/erm2-nwe9.json/"
  const ADDRESS_FILTER = "?incident_address="
  const ERROR_MESSAGE = `No data for the address: ${prev}. Remember: Only enter street name and building number.`
  const d3Container = useRef(null)
  const QUOTE = 'Is there a Karen in my NYC building? Find out now!'
  const regex = /\d\w+/

//api call
  
  const apiCall = async () => {
    try {
      let rawSearch = query.toUpperCase().split(' ')
      let search = ''
      if (rawSearch[1] === 'S') {
        rawSearch[1] = 'SOUTH'
      } else if (rawSearch[1] === 'W') {
        rawSearch[1] = 'WEST'
      } else if (rawSearch[1] === 'N') {
        rawSearch[1] = 'NORTH'
      } else if (rawSearch[1] === 'E') {
        rawSearch[1] = 'EAST'
      } else if (regex.test(rawSearch[1])) {
        rawSearch[1] = rawSearch[1].slice(0, rawSearch[1].length - 2)
      }
      
      if (rawSearch[2] === 'ST') {
        rawSearch[2] = 'STREET'
      } else if (rawSearch[2] === 'DR') {
        rawSearch[2] = 'DRIVE'
      } else if (rawSearch[2] === 'AVE') {
        rawSearch[2] = 'AVENUE'
      } else if (rawSearch[2] === 'RD') {
        rawSearch[2] = 'ROAD'
      } else if (rawSearch[2] === 'BLVD') {
        rawSearch[2] = "BOULEVARD"
      } else if (rawSearch[2] === 'PL') {
        rawSearch[2] = 'PLACE'
      } else if (regex.test(rawSearch[2])) {
        rawSearch[2] = rawSearch[2].slice(0, rawSearch[2].length - 2)
      }

      if (rawSearch[3] === 'ST') {
        rawSearch[3] = 'STREET'
      } else if (rawSearch[3] === 'DR') {
        rawSearch[3] = 'DRIVE'
      } else if (rawSearch[3] === 'AVE') {
        rawSearch[3] = 'AVENUE'
      } else if (rawSearch[3] === 'RD') {
        rawSearch[3] = 'ROAD'
      } else if (rawSearch[3] === 'BLVD') {
        rawSearch[3] = "BOULEVARD" 
      } else if (rawSearch[3] === 'PL') {
        rawSearch[3] = 'PLACE'
      }
      search = rawSearch.join(' ')
      console.log(search)
      const response = await axios.get(BASE_URL + ADDRESS_FILTER + search)
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
    setPrev(query)
  }

  const handleRefresh = () => {
    window.location.reload()
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

//set max point
  
  useEffect(() => {
    if (points.length > 0) {
      let maxPt = 0
      points.forEach(point => {
        if (point[1] > maxPt) {
          maxPt = point[1]
        }
      })
      setMax(maxPt)
    }
  })

//set verdict
  
  useEffect(() => {
    if (max) {
      const arr = points.reverse()
      if (years.length > xAxis.length * 3 && arr[0][1] < max / 2) {
        setVerdict(<UsedTo complaints={years.length} time={xAxis.length} />)
      } else if (years.length > xAxis.length * 3) {
        setVerdict(<Yes complaints={years.length} time={xAxis.length} />)
      } else {
        setVerdict(<No complaints={years.length} time={xAxis.length} />)
      }
    } else if (data.length > 0) {
      setVerdict(<No complaints={years.length} time={xAxis.length} />)
    }
  }, [data, years, xAxis, points, max])

//build graph

  useEffect(() => {
    if (points.length > 0 && d3Container.current) {
      const w = 490;
      const h = 350;
      const padding = 60;

      //set xScale

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
        .attr("stroke", "#ffd166")
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
        .attr("r", (d) => 5)
        .attr('fill', '#ef476f')
      
      svg.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .selectAll("text")
        .data(points)
        .join("text")
        .attr("x", d => xScale(d[0]) + 7)
        .attr("y", d => yScale(d[1]))
        .text(d => d[1])
      
      const xAxisLocal = d3.axisBottom(xScale).tickFormat(d3.format("d"))
    
      const yAxisLocal = d3.axisLeft(yScale)

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
    <div className='body'>
      <div className='title-box' onClick={handleRefresh}>
        <h1 className='title'>Is There a Karen in My Building?</h1>
      </div>
      {verdict ? verdict : ''}
      {console.log(verdict)}
      {console.log(data)}
      {years.length > 0 ? <svg className='d3-component' ref={d3Container} width={490} height={350}/> : ''}
      <h2>{data.length < 1 && toggle ? <div className='error-box'><p className='error'>{ERROR_MESSAGE}</p></div> : ''}</h2>
      {data.length < 1 ?
        <form className='form' onSubmit={handleSubmit}>
          <input className='field' placeholder='Enter Building Number & Street Name' onChange={handleChange} />
          <button className='button'>Check 'Em Out!</button>
        </form> : <button className='button2' onClick={handleRefresh}>Search a New Address?</button>}
        <section className='intro-box'>
        {data.length < 1 ? <p className='intro'>Do bewildered police show up at your door asking about a party, only to find you alone, listening to quiet music in your pajamas? You may be sharing a building with a Karen. If you'd like to see if there's a trend of unsubstantiated 311 complaints at your building, enter your address into the search bar below.</p> : ''}
        </section>
      {data.length > 0 ? <p className="intro">If you're curious, here's a list of the frivilous complaints we've found at your address.</p> : ''}
      <ol className='complaints'>
        {data ? data.map((item) => {
          if (item.agency === 'NYPD' && item.resolution_description.includes("no evidence")) {
            return <li key={item.unique_key}>{new Date(item.created_date).toLocaleString()} | <strong>{item.agency}</strong> | <em>{item.complaint_type}: {item.descriptor}: {item.location_type}<p>{item.resolution_description}</p></em></li>
          } else {
            return ''
          }
      }) : ''}
      </ol>
      <section className='footer'>
        <div className='icons'>
        <FacebookShareButton url='www.isthereakaren.com' quote={QUOTE}>
          <FacebookIcon size={50}/>
        </FacebookShareButton>
        <LinkedinShareButton url='www.isthereakaren.com' quote={QUOTE}>
          <LinkedinIcon size={50}/>
        </LinkedinShareButton>
        <RedditShareButton url='www.isthereakaren.com' quote={QUOTE}>
          <RedditIcon size={50}/>
        </RedditShareButton>
        <TwitterShareButton url='www.isthereakaren.com' quote={QUOTE}>
          <TwitterIcon size={50}/>
          </TwitterShareButton>
        </div>
        <p className='footer-text'>App built by <a className='ext-link' href='http://www.scottdelbango.com' target='_blank'>SRD</a> using React and D3. Powered by <a className='ext-link' href='https://opendata.cityofnewyork.us/' target='_blank'>NYC Open Data</a>.
        <br/>This is all just for fun. Don't take it too seriously.</p>
      </section>
    </div>
  )
}