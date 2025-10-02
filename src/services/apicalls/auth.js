import axios from 'axios'
import {baseURL, endPoints} from '../constants'
var qs = require('qs')

export const logIn = async (userData) => {
    let response = null
    let config = {
        headers: {
            Authorization: '',
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }
    await axios
        .post(`${baseURL + endPoints.logIn}`, qs.stringify(userData), config)
        .then(async (responseJson) => {
            console.log("response in aut responseJson",responseJson.data);
            const tempResponseData = responseJson.data
            response = tempResponseData
            
        })
        .catch((error) => {
            console.log("erreo chala");
            response = {
                success: false,
                message: error.response.data.message
            }
        })

    return response
}