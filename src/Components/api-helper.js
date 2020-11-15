// const axios = require('axios');
// const BASE_URL = "https://data.cityofnewyork.us/resource/erm2-nwe9.json/"
// const ADDRESS_FILTER = "?incident_address="

// const apiCall = async () => {
//   try {
//     const response = await axios.get(BASE_URL + ADDRESS_FILTER + query.toUpperCase())
//     setData(response.data)
//     console.log(response)
//   } catch (error) {
//     console.log(error)
//   }
// }

// export default apiCall

//learn how to use this with try / catch
    // useEffect(() => {
  //   axios(BASE_URL+'218 HIMROD STREET')
  //     .then((res) => setData(res.data))
  //     .catch((e) => console.log(e));
  // }, [])
  // original try below
  // const axios = require('axios');
  
  //const apiCall = async () => {
  //   try {
  //     const response = await axios.get(BASE_URL + ADDRESS_FILTER + '218 HIMROD STREET')
  //     setData(response)
  //     console.log(response)
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  //useEffect(async () => {
  //   try {
  //     const response = await axios.get(BASE_URL + ADDRESS + '218 HIMROD STREET')
  //     setData(response)
  //   } catch (error) {
  //       console.log(error)
  //   }
  // }, [])

  //const apiCall = async () => {
//   try {
//     const response = await axios.get(`${BASE_URL}218 HIMROD STREET`)
//     console.log(response.data[0])
//   } catch (error) {
//     console.log(error)
//   }
// }