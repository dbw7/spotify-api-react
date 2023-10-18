const express = require('express');
const axios = require('axios');
const qs = require('querystring');
const { getUserInfo } = require('./util');
const { UserModel } = require('./db');
const router = express.Router();
const jwt = require('jsonwebtoken');
const checkAuth = require('./middleware/check-auth');

const CLIENT_ID = "";
const CLIENT_SECRET = "";
const REDIRECT_URI = "http://localhost:5000/auth/cb";


router.get('/', (req, res) => {
    const scope = 'user-read-private user-read-email';
    res.redirect('https://accounts.spotify.com/authorize' +
        '?response_type=code' +
        '&client_id=' + CLIENT_ID +
        (scope ? '&scope=' + encodeURIComponent(scope) : '') +
        '&redirect_uri=' + encodeURIComponent(REDIRECT_URI));
});


router.get('/cb', async (req, res) => {
    const code = req.query.code || null;
    console.log("here")
    try {
        const response = await axios({
            method: 'post',
            url: 'https://accounts.spotify.com/api/token',
            data: qs.stringify({
                code: code,
                redirect_uri: REDIRECT_URI,
                grant_type: 'authorization_code',
            }),
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + (new Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'))
            },
        });
        // console.log("response data", response.data)
        
        // IF THIS IS REACHED, THE USER HAS LOGGED IN AND GOTTEN A RESPONSE PROPERLY
        if (response.data.access_token) {
            const { access_token, refresh_token } = response.data;
            const {name, email, id} = await getUserInfo(access_token)
            await UserModel.findOrCreate({ email: email }, { name: name, email: email, id: id, accessToken: access_token, refreshToken: refresh_token}, async (err, user) => {
                // console.log("user auth.js 47", user)
                // console.log("error auth.js 48", err)
            })
            let token;
            try {
                console.log("Name", name)
                token = jwt.sign({name: name, email: email, id: id,}, "THIS NEEDS TO BE A SECRET RANDOM STRING", {expiresIn: '3d'})
            } catch (error) {
                console.log("auth error 55", error);
            }
            console.log("token", token)
            res.redirect('http://localhost:5173/login?token='+token)
        } else {
            res.redirect('/#/error/invalid token');
        }
    } catch (error) {
        console.log(error)
        res.send('Error occurred while fetching tokens. Try again.');
    }
});

// By adding router.use(checkAuth) /verify cannot be reached if the user does not have a valid token
router.use(checkAuth);
router.get("/verify", (req, res) =>{
    try {
      //throw error
      const token = req.headers.authorization.split(' ')[1];
      if(!token){
          throw new Error('Authentication failed');
      }
      const decodedToken = jwt.verify(token, "THIS NEEDS TO BE A SECRET RANDOM STRING");
      res.json({id: decodedToken.id, token:token, name: decodedToken.name, email: decodedToken.email}).status(225);
  } catch (err) {
      const error = new HttpError('Authentication failed!', 401);
      return next(error);
  }
})
  
module.exports = {
    authRouter: router
}