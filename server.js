require('dotenv').config(); // ✅ Load environment variables first

const express = require('express');
const http = require('http');
const connectDB = require('./config/db');
const { setRoutes } = require('./routes/index');
const expressLayout = require('express-ejs-layouts');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoStore = require('connect-mongo'); // For session storage in MongoDB
const session = require('express-session');

// const uploadMiddlewares = require('./middlewares/uploadMiddlewares');

const app = express();
app.use(cors(
    {
        origin: 'http://localhost:4000', // Replace with your frontend URL
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
    }   
));
// app.use(cookieParser());
app.use(session({
    secret: 'yourSecretKey', // Replace with a secret string for security
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // set to true if using HTTPS

    // store funtion that enables you to store a session in our mongoDb database
    store: mongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        autoReconnect: true,
        ttl: 31 * 60 * 60 * 24,  // Set session TTL to 31 days (in seconds)
        autoRemove: 'native',
        // autoRemoveInterval: 1200000,  // 24 minutes
    })
}));

app.use(express.json()); // For parsing application/json

// ✅ Middleware to parse JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));


// ✅ Connect to MongoDB
connectDB();




app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));
app.set('layout', './layouts/main');

// Parse JSON and URL-encoded bodies

app.use(expressLayout);



// ✅ Set up routes
setRoutes(app);

// ✅ Create and start the HTTP server
const server = http.createServer(app);

const PORT = 5000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});




