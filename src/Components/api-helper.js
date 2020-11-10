const BASE_URL = "https://data.cityofnewyork.us/resource/erm2-nwe9.json/?incident_address="
const axios = require('axios');

const apiCall = async () => {
  try {
    const response = await axios.get(`${BASE_URL}218 HIMROD STREET`)
    console.log(response.data[0])
  } catch (error) {
    console.log(error)
  }
}

export default apiCall

//learn how to use this with try / catch
    // useEffect(() => {
  //   axios(BASE_URL+'218 HIMROD STREET')
  //     .then((res) => setData(res.data))
  //     .catch((e) => console.log(e));
  // }, [])
  // original try below
  // const axios = require('axios');
  // const apiCall = async () => {
  //   try {
  //     const response = await axios.get(`${BASE_URL}218 HIMROD STREET`)
  //     console.log(response.data[0])
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }