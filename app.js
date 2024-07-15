//Importing express dependency
const express = require('express');
//creating a express app
const app = express();
//require path
const path = require ('path');

//Importing Mongoose dependancy
const mongoose = require('mongoose');
//Importing Campground Schema
const Campground = require ('./models/campground');
//EJS MATE ENGINE
const ejsMate = require('ejs-mate');

//require joi
const Joi = require('joi')
const {campgroundSchema, reviewSchema} = require('./schemas.js')


const CatchAsync = require('./Utils/CatchAsync');
const ExpressError = require('./Utils/ExpressError')
const campground = require('./models/campground');

//method override
const methodOverride = require('method-override');
const Review = require('./models/review');


const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');


//connecting mongodb
mongoose.connect('mongodb://localhost:27017/camp-find', {
    //Deapprecated
    useNewUrlParser: true,
    // Following syntax is no longer supported according to mongoose docs : useCreateIndex: true,
    //Deapprecated
    useUnifiedTopology: true
})

//parses body for req.body, without this req.body is undefined
//once we are able to pass data through it, we can store the data
app.use(express.urlencoded({extended: true}));
//use method override
app.use(methodOverride("_method"));

//Connecting to mongoose
const db = mongoose.connection;
//Check for error
db.on("error", console.error.bind(console, "connection error:"));
//Once connected, print connection success message
db.once("open", () => {
    console.log("Database connected");
});

//using the engine
app.engine('ejs', ejsMate);
//
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/campgrounds', campgrounds );
app.use('/campgrounds/:id/reviews', reviews );

//
app.get('/', (req,res) => {
    res.render('home')

});

//does it for all urls
app.all('*', (req,res,next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err,req,res,next) => {
    const {statusCode = 500} = err;
    if (!err.message) err.message = 'oh no, something went wrong!'
    res.status(statusCode).render('error', {err})
}
)

//Calling our express server
app.listen(3000, ()=> {
    console.log('Serving on port 3000');
});

//Setting a get route to save data to mongodb
// app.get('/makecampground', async (req, res) => {
//     const camp = new Campground({title: 'My Backyard', description: 'Testing our first document'});
//     await camp.save();
//     res.send(camp);
// })


