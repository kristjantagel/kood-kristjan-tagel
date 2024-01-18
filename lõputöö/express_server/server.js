const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const session = require('express-session');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const port = 3002;
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public', 'views'));

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));

mongoose.connect('mongodb+srv://kristjantagel:x9HVAk6a0INY9pK3@tpl0.vrmdnol.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to the database');
});

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    firstName: String,
    lastName: String,
    age: Number,
    gender: String,
    avatar: String,
    feedback: [{ message: String, timestamp: { type: Date, default: Date.now } }]
});

const User = mongoose.model('User', userSchema);

const requireAuth = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
};

app.get('/', (req, res) => {
    if (req.session.user) {
        res.render('home', { req });
    } else {
        res.redirect('/login');
    }
});

app.get('/login', (req, res) => {
    res.render('login', { req });
});

app.get('/profile', requireAuth, (req, res) => {
    res.render('profile', { req });
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

app.get('/about', (req, res) => {
    res.render('about', { req });
})

app.get('/contact', (req, res) => {
    res.render('contact', { req });
});

app.get('/home', requireAuth, (req, res) => {
    res.render('home', { req });
});

app.get('/aot', (req, res) => {
    res.redirect('https://www.crunchyroll.com/series/GR751KNZY/attack-on-titan');
});

app.get('/dbz', (req, res) => {
    res.redirect('https://www.crunchyroll.com/series/G9VHN9PPW/dragon-ball-z');
});

app.get('/naruto', (req, res) => {
    res.redirect('https://www.crunchyroll.com/series/GY9PJ5KWR/naruto');
});

app.get('/onepiece', (req, res) => {
    res.redirect('https://www.crunchyroll.com/series/GRMG8ZQZR/one-piece');
});

app.post('/check-username', async (req, res) => {
    const { username } = req.body;

    try {
        const existingUser = await User.findOne({ username: username });

        if (existingUser) {
            return res.json({ available: false });
        }

        return res.json({ available: true });
    } catch (error) {
        console.error('Error checking username availability:', error);
        res.status(500).json({ available: false });
    }
});

app.post('/register', async (req, res) => {
    const { username, password, firstName, lastName, age, gender } = req.body;

    try {
        if (!username || !password || !firstName || !lastName || !age || !gender) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const existingUser = await User.findOne({ username: username });
        if (existingUser) {
            return res.status(401).json({ error: 'Username already exists' });
        }

        if (!validatePassword(password)) {
            return res.status(402).json({ error: 'Password must be at least 8 characters long and include one number and one uppercase letter' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const defaultAvatar = 'https://storage.googleapis.com/pai-images/241a68765f2049eba217df96ca6f7a7b.jpeg';

        const newUser = new User({
            username,
            password: hashedPassword,
            firstName,
            lastName,
            age,
            gender,
            avatar: defaultAvatar
        });

        await newUser.save();

        res.status(201).json({ success: true, message: 'Registration successful' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ error: 'Error during registration' });
    }
});


function validatePassword(password) {
    const passwordRegex = /^(?=.*[0-9])(?=.*[A-Z]).{8,}$/;
    return passwordRegex.test(password);
}

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username: new RegExp('^'+username+'$', 'i') });

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            req.session.user = user;
            res.redirect('/profile');
        } else {
            res.status(401).json({ error: 'Invalid username or password' });
        }
    } catch (error) {
        console.error("Error during login process:", error);
        res.status(500).json({ error: 'Error during login' });
    }
});


app.post('/submit-feedback', requireAuth, async (req, res) => {
    const { feedback } = req.body;

    if (!feedback) {
        return res.status(400).send('Feedback message is required');
    }

    try {
        const userId = req.session.user._id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).send('User not found');
        }

        user.feedback.push({ message: feedback });

        await user.save();

        req.session.user = user;

        res.redirect('/profile');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error submitting feedback');
    }
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}. Visit http://localhost:${port}`);
});
