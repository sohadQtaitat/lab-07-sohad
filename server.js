
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


app.get('/location',locationHandler);
app.get('/weather', weatherHanddler);
app.get('/events', eventHanddler);


//////////////////////////////////////////////////------------ Location------------/////////////////////////////Sohad/



  function locationHandler(req,res){
getlocation(req.query.data)
.then(locationData => res.status(200).json(locationData));
  };

  
    function getlocation (city){
        const url =`https://maps.googleapis.com/maps/api/geocode/json?address=${city}&key=${process.env.GEOCODE_API_KEY}`
        return superagent.get(url)
        .then( data =>{
            return new Location (city , data.body)
        })
    };


    
    function Location( city ,data ) {
        this.search_query = city;
        this.formatted_query = data.results[0].formatted_address;
        this.latitude = data.results[0].geometry.location.lat;
      this.longitude = data.results[0].geometry.location.lng;
  }





//////////////////////////////////////////////////------------ Weather------------/////////////////////////////Sohad/

  function weatherHanddler(req,res) {
    getWeather(req.query.data)
       .then (weatherData => res.status(200).json(weatherData) );
   };
   
   
   
   
   function getWeather (query) {
     const url = `https://api.darksky.net/forecast/${process.env.DARKSKY_API_KEY}/${query.latitude},${query.longitude}`;
     return superagent.get(url)
     .then( data => {
       let weather = data.body;
       return weather.daily.data.map( (day) => {
         return new Weather(day);
        });
      });
    };
    function Weather( day ) {
      
      this.forecast = day.summary;
      this.time = new Date(day.time * 1000).toDateString();
      
    }

//////////////////////////////////////////////////------------ Event------------/////////////////////////////Sohad/


    function eventHanddler(req,res) {
     getEventINFO(req.query.data)
        .then (eventData => res.status(200).json(eventData) );
    };
    function getEventINFO (query) {
    const url = `http://api.eventful.com/json/events/search?app_key=${process.env.EVENTS_API}&location=${query.formatted_query}`;
    return superagent.get(url)
    .then( data => {
      let eventl = JSON.parse(data.text);
      return eventl.events.event.map( (day) => {
        return new Event(day);
      });
    });
  };

  

 function Event (day){
              this.link = day.url ;
              this.name = day.title ;
              this.event_date = day.start_time ;
              this.summary = day.description 

          }
         


/////////////////////////////////////////////////-----------Error------------/////////////////////////////Sohad/




app.get('/foo',(request,response) =>{
    throw new Error('ops');
})

app.use('*', (request, response) => {
    response.status(404).send('Not Found')
  })

  
app.get('/', (request,response)=>{
  response.status(200).send("Hi :)");
});


app.use((error,request,response) => {
    response.status(500).send(error)
})

/////////////////////////////////////////////////-----------listening for requests------------/////////////////////////////Sohad/

 
app.listen(PORT, () => console.log(`App is listening on ${PORT}`));

