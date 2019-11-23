
'use strict';



require('dotenv').config();
//Dependencies
const cors  = require('cors');
const express = require('express');
const superagent = require('superagent');

//Setup
const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());

//////////////////////////////////////////////////------------ Routes ------------/////////////////////////////Sohad/

//////////////////////////////////////////////////------------ API routes------------/////////////////////////////Sohad/



app.get('/location', locationFind);

app.get('/weather', weatherFind);

app.get('/events', eventData);






// function to get location data
function locationFind(request, response) {

  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${request.query.data}&key=${process.env.GEOCODE_API_KEY}`;


  superagent.get(url)
    .then(result => {
      const location = new Location(result, request.query.data);
      response.send(location);
    })
    .catch(err => handleError(err, response));
}













function weatherFind(request, response) {

    
  const url = `https://api.darksky.net/forecast/${process.env.WEATHER_API_KEY}/${request.query.data.latitude},${request.query.data.longitude}`;


  superagent.get(url)
    .then(result => {
      const weatherStatues = result.body.daily.data.map(day => new Weather(day));
    //   console.log('soo', weatherStatues);
      response.send(weatherStatues);
    })
    .catch(err => handleError(err, response));
}






function eventData(request, response) {

  const url = `https://www.eventbriteapi.com/v3/events/search/token=${process.env.EVENTBRITE_API_KEY}&location.address=${request.query.data.formatted_query}`;

  superagent.get(url)
    .then(result => {
      const eventStatues = result.body.events.map(event => new Event(event));
      response.send(eventStatues);
    })
    .catch(error => handleError(error, response));
}





function Location(data, userData) {
  this.formatted_query = data.body.results[0].formatted_address;
  this.latitude = data.body.results[0].geometry.location.lat;
  this.longitude = data.body.results[0].geometry.location.lng;
  this.query = userData;
}


function Weather(day) {
  let time = new Date(day.time * 1000);
  this.time = time.toDateString();
  this.forecast = day.summary;
}

function Event(event) {
  this.link = event.url;
  this.name = event.name.text;
  this.event_date = new Date(event.start.local).toString().slice(0, 15);
  this.summary = event.summary;
}



/////////////////////////////////////////////////-----------Error------------/////////////////////////////Sohad/




app.get('/foo',(request,response) =>{
    throw new Error('ops');
})

app.use('*', (request, response) => {
    response.status(404).send('Not Found')
})

app.use((error,request,response) => {
    response.status(500).send(error)
})

/////////////////////////////////////////////////-----------listening for requests------------/////////////////////////////Sohad/

 
app.listen(PORT, () => console.log(`App is listening on ${PORT}`));