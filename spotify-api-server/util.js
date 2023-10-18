const axios = require('axios');

const getUserInfo = async (accessToken) => {
    console.log("getting user data")
    try {
        const response = await axios({
            method: 'get',
            url: 'https://api.spotify.com/v1/me',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            },
        });

        // console.log(response.data)
        // console.log(response.data.display_name)
        // console.log(response.data.email)
        // console.log(response.data.id)
        const name = response.data.display_name
        const email = response.data.email
        const id = response.data.id
        return {name, email, id}
        
    } catch (error) {
        console.log("error 80", error)
    }
}

module.exports = {
    getUserInfo
}