const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Game = require('./models/gamemodel');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.use(express.json());

app.get('/', (req, res) => {
    res.send('API is running...');
});

//creates a new game
app.post('/api/games', async (req, res) => {
    try {
        let games = req.body; // Expecting an array of game objects

        if (Array.isArray(games)) { 

        games = games.map(game => ({
            title: game.title,
            description: game.description,
            developer: game.developer,
            publisher: game.publisher,
            releaseDate: game.releaseDate,
            genre: game.genre,
            platform: game.platform,
            price: game.price,
            discount: game.discount,
            rating: game.rating,
            reviews: game.reviews,
            image: game.image,
            trailer: game.trailer,
            systemRequirements: game.systemRequirements,
            tags: game.tags,
        }));
    } else {
    games = [games]
}
        const createdGames = await Game.insertMany(games);

        res.status(201).json(createdGames);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error - error creating games');
    }
});


//finds a game
app.get('/api/games', async (req, res) => {
    try {
        
        const games = await Game.find(req.body);

        res.status(201).json(games);

    }catch (error) {
        console.error(error.message);
        res.status(500).send('server error - error finding game')
    }
});


app.get('/api/games/title', async (req, res) => {
    try {
        const { title } = req.query; // Get the title from the query parameters

        if (!title) {
            return res.status(400).json({ msg: 'Please provide a title to search for' });
        }

        // Find the game by title using a case-insensitive regex
        const game = await Game.findOne({ title: new RegExp(`^${title}$`, 'i') });

        if (!game) {
            return res.status(404).json({ msg: 'Game not found' });
        }

        res.status(200).json(game); // Return the found game
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error - error retrieving game');
    }
});


app.delete('/api/games/title', async (req,res) => {
    
    try {
        const {title} = req.query;

        if (!title) {
            return res.status(400).json({ msg: 'Please provide a title to search for' });
        }

        const result = await Game.deleteOne({ title: new RegExp(`^${title}$`, 'i') });

        if (result.deletedCount === 0) {
            return res.status(404).json({ msg: 'Game not found' });
        }

        res.status(200).json({ msg: 'Game has been deleted' });

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error - error deleting game');
    }
});


app.post('/api/games/edit', async (req, res) => {
    try {
        const { title, updateData } = req.body;

        if (!title || !updateData) {
            return res.status(400).json({ msg: 'Please provide a title and update data' });
        }

        // Find the game by title using a case-insensitive regex and update it
        const game = await Game.findOneAndUpdate(
            { title: new RegExp(`^${title}$`, 'i') },
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!game) {
            return res.status(404).json({ msg: 'Game not found' });
        }

        res.status(200).json(game); // Return the updated game
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error - error updating game');
    }
});



app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});