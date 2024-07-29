const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Game = require('./models/gamemodel');
const Review = require('./models/reviewmodel'); // Adjust the path as necessary


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

/* create read update and delete functions for games*/ 

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

// Creates a new review for a specific game by title
app.post('/api/games/reviews/:title', async (req, res) => {
    try {
        const { userId, rating, comment } = req.body;
        const { title } = req.params;


        if (rating === undefined) {
            return res.status(400).json({ msg: 'Rating is required' });
        }
        
        const titleRegex = new RegExp(`${title}`, 'i');

        

        // Find the game by title
        const game = await Game.findOne({ title: titleRegex });


        if (!game) {
            return res.status(404).json({ msg: 'Game not found' });
        }

        console.log('Game found:', game);

        // Create a new review
        const newReview = new Review({
            user: userId,
            game: game._id,
            rating,
            comment,
        });

        // Save the review
        const savedReview = await newReview.save();

        res.status(201).json({ title: game.title, review: savedReview });
    } catch (error) {
        console.error('Error creating review:', error.message);
        res.status(500).send('Server error - error creating review');
    }
});





// Get all reviews for a specific game by its title
app.get('/api/games/reviews/:title', async (req, res) => {
    try {
        const { title } = req.params;

        const titleRegex = new RegExp(`^${title}$`, 'i'); // Exact match with case-insensitivity

        // Find the game by title
        const game = await Game.findOne({ title: titleRegex });

        if (!game) {
            return res.status(404).json({ msg: 'Game not found' });
        }

        // Find all reviews for the game
        const reviews = await Review.find({ game: game._id }).populate('user', 'name'); // Adjust the fields as necessary

        res.status(200).json(reviews);
    } catch (error) {
        console.error('Error retrieving reviews:', error.message);
        res.status(500).send('Server error - error retrieving reviews');
    }
});






app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});