const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;







// const ENDPOINT = "https://api.igdb.com/v4"

// const accessToken = {
//     "access_token": "w5jtz4c8n2vz498jt0k518q72fb9qb",
//     "expires_in": 4821240,
//     "token_type": "bearer"
// }


// body = 'fields name,release_dates.*,cover.*,genres.*; where name = "Halo 5: Guardians";';
// const headers = new Headers();
// headers.append('Accept', 'application/json');
// headers.append('Client-ID', CLIENT_ID);
// headers.append('Authorization', `Bearer ${accessToken}`);

// fetch(ENDPOINT, {
//   method: 'POST',
//   headers,
//   body
// }).then(response => response.json())
//   .then(data => console.log(data))
//   .catch(error => console.error(error));







mongoose.connect(process.env.MONGO_URI, {
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.use(express.json());

app.get('/', (req, res) => {
    res.send('API is running...');
});






/* create read update and delete functions for games*/ 

//creates a new game
app.post('/api/games', async (req, res) => {

});


// Route to get gaming news from IGDB
app.get('/api/gaming-news', async (req, res) => {

    try {
        const tokenResponse = await axios.post(`https://id.twitch.tv/oauth2/token`,null, {
            params: {
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_SECRET,
                grant_type: 'client_credentials',
            }
        });
        const accessToken = tokenResponse.data.access_token;

        // Step 2: Fetch data from IGDB API using the Access Token
        const igdbResponse = await axios.post('https://api.igdb.com/v4/feeds', {}, {
        headers: {
          'Client-ID': process.env.CLIENT_ID,
          'Authorization': `Bearer ${accessToken}`,
        }
      });

      // Step 3: Send the data to the frontend
    res.json(igdbResponse.data);

    }catch(error){
        console.error(error);
        res.status(500).send('Server Error');
    }

});

//finds a game by its title
app.get('/https://api.igdb.com/v4/games/search', async (req, res) => {

});


app.delete('/api/games/title', async (req,res) => {

});


app.post('/api/games/edit', async (req, res) => {

});







// Creates a new review for a specific game by title
app.post('/api/games/reviews/:title', async (req, res) => {

});





// Get all reviews for a specific game by its title
app.get('/api/games/reviews/:title', async (req, res) => {

});






app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});