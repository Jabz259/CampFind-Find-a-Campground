//Importing Mongoose dependancy
const mongoose = require('mongoose');
//Importing Campground Schema
const Campground = require ('../models/campground');
//using cities file
const cities = require('./cities');
//Destructuring variables/instance and then calling the seedhelpers class to access its contents
const {places, descriptors} = require('./seedHelpers');

//connecting mongodb
mongoose.connect('mongodb://localhost:27017/camp-find', {
    //Deapprecated
    useNewUrlParser: true,
    // Following syntax is no longer supported according to mongoose docs : useCreateIndex: true,
    //Deapprecated
    useUnifiedTopology: true
})

//Connecting to mongoose
const db = mongoose.connection;
//Check for error
db.on("error", console.error.bind(console, "connection error:"));
//Once connected, print connection success message
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async() => {
    await Campground.deleteMany({});
    for (let i = 0;i < 50; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`
        })
        await camp.save();
    }
    
}

//This will close the connection
//If this was not here it would show in the terminal that the connection is open
seedDB().then(() => {
    mongoose.connection.close;
})
