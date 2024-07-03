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
const {campgroundSchema} = require('./schemas.js')
const CatchAsync = require('./Utils/CatchAsync');
const ExpressError = require('./Utils/ExpressError')

//method override
const methodOverride = require('method-override');
const campground = require('./models/campground');


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


const validateCampground = (req, res, next) => {
        const {error} = campgroundSchema.validate(req.body);

        if(error) {
            const msg = error.details.map(el => el.message).join(',')
            throw new ExpressError(msg, 400)
        } else {
            next()
        }

}

//
app.get('/', (req,res) => {
    res.render('home')

});

app.get('/campgrounds', CatchAsync (async (req,res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});

}));

//Order of routes matter
app.get('/campgrounds/new', (req,res) => {
    res.render('campgrounds/new')
} )

//posting and saving information
// app.post('/campgrounds', async (req,res) => {
//     const campground = new Campground(req.body.campground);
//     await campground.save();
//     res.redirect(`/campgrounds/${campground._id}`);
// })

app.post('/campgrounds', validateCampground, CatchAsync (async (req, res, next) => {


        const campground = new Campground(req.body.campground);
        await campground.save();
        res.redirect(`/campgrounds/${campground._id}`)
}))


app.get('/campgrounds/:id', CatchAsync (async (req, res) =>{
    //getting the req, then the params (:id) then assinging its requested ID
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', {campground});
}))


app.delete('/campgrounds/:id', CatchAsync (async(req,res) => {
    //req.params will capture and store the id from the URL
    const{id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))


//Setting a get route to save data to mongodb
// app.get('/makecampground', async (req, res) => {
//     const camp = new Campground({title: 'My Backyard', description: 'Testing our first document'});
//     await camp.save();
//     res.send(camp);
// })

app.get('/campgrounds/:id/edit', CatchAsync (async (req,res) => {
    //passing selected data to req.params for access from HTML
    const campground = await Campground.findById(req.params.id);
    //render the details to campgrounds edit class
    res.render('campgrounds/edit', {campground});
}))

app.put('/campgrounds/:id', validateCampground, CatchAsync (async (req,res) => {
    const {id} = req.params;
    //using
    //console.log("This is req.body.campround for '/campgrounds/:id' " + req.body.campground);
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground});
    console.log(campground)
    res.redirect(`/campgrounds/${campground._id}`);

}))

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