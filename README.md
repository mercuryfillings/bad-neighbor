Moving into a new place in NYC? Hold it. You should know if your neighbor is an excessive 311 complainer!

# README 

- [Project Planning](#Project-Planning)
  - [Overview](#Overview)
  - [Wireframes](#Wireframes)
  - [MVP](#MVP)
    - [Goals](#Goals)
    - [Libraries](#Libraries)
    - [Data](#Data)
    - [Component Hierarchy](#Component-Hierarchy)
    - [Component Breakdown](#Component-Breakdown)
    - [Component Estimates](#Component-Estimates)
    - [Helper Functions](#Helper-Functions)
  - [Post-MVP](#Post-MVP)
- [Project Delivery](#Project-Delivery)
  - [Code Showcase](#Code-Showcase)
  - [Code Issues & Resolutions](#Code-Issues--Resolutions)

### Overview


**Project Title** Is There a Karen in Your Building?

<br>

### Wireframes
n/a


<br>

### MVP

> Bad neighbors calling the police on you over nothing? Live in NYC and want to see if it's a trend? Just input your building number and street name into the handy field and *poof* like magic, you get a definitive YES or NO (or sometimes, "There was at one point"), along with a handy line graph illustrating the issue if enough data exists. This miraculous insight into your living situation is made possible by filtering NYC darta for your address down to exclsuively 311 complaints about your address that were deemed to be frivolous by the NYPD. 
<br>

#### Goals

- Parse user input and manipulate string to match formatting for NYC Open Data
- Filter data to just the complaints listed as frivlous by the NYPD
- Return a definitive result based on filtered data

<br>

#### Results
Managed to pull this off almost exactly as I'd envisioned it. 

#### Libraries

> Use this section to list all supporting libraries and their role in the project.

|     Library      | Description                                |
| :--------------: | :----------------------------------------- |
| Axios | _Pulling API data_ |
| D3 | _Data Visualization_ | 
| React-vis | _tested but not used_ |

(Also installed but eventually did not use: sinon, storybook, & moment)

<br>

#### Data

> Use the Data Section to define the API(s) you will be consuming for your project, inluding sample URL queries.

|    API     | Quality Docs? | Website       | 
| :--------: | :-----------: | :------------ |
| NYC Open Data 311 |      yes      | _https://data.cityofnewyork.us/Social-Services/311-Service-Requests-from-2010-to-Present/erm2-nwe9_ |

<br>

#### Component Hierarchy

> Use this section to define your React components and the data architecture of your app.

```
src
|__ assets/
      |__ data-tests
      |__ fonts
      |__ graphics
|__ components/
    |__ index.js  
      |__ App.js 
        |__ Main.jsx
        |__ No.jsx
        |__ Yes.jsx
        |__ UsedTo.jsx
      
```

<br>

#### Component Breakdown



|  Component   |    Type    | state | props | Description                                                      |
| :----------: | :--------: | :---: | :---: | :--------------------------------------------------------------- |
|    Main   | functional |   Y   |   n   | _API, app logic, and conditional formatting._               |
|   Yes    |   functional    |   n   |   y   | _Returns if verdict is yes_   |
| No | functional |   n   |   y   | _Returns if verdict is no_ |
|    UsedTo    | functional |   n   |  Y   | _Returns if verdict used to be Yes but is not anymore_ |


<br>


#### Swot Analysis

Strengths: _This is a funny project that I could see being useful and sharable_

Weaknesses: _The logic isn't really sound - it's entirely based on whether police found evidence when they showed up. This means that not every complaint is acutally frivolous. But this is a fun novelty, and not meant to be super scientific._

Opportunities: _Would love to expand this to different cities, and I'm considering expanding it into a full-scale real estate tool for getting a better understanding of where you may move. The NYC Open Data has a terrible interface, and I haven't seen any other similar apps, so it seems like a real opportunity._

Threats: _Overcomplicating this as I expand._ 


|  Function  | Description                                |
| :--------: | :----------------------------------------- |
| n/a | _ _ |

<br>

### Post-MVP

- _Add gallery_
- _Add other large municipal data sets_
- _Expand insight offerings & available data_

<br>

***

## Project Delivery

### Code Showcase
```
complicated API call to parse string input and translate to NYC open data formatting:

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
```
