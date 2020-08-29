/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/




var express = require('express')
var bodyParser = require('body-parser')
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
var zipcodes = require('zipcodes');
const request = require('request');

// declare a new express app
var app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
});


/**********************
 * Example get method *
 **********************/

app.get('/get-weather',(req,res)=>{
  if(Object.keys(req.query).length===2){
      const obj2 = zipcodes.lookupByCoords(req.query.lat,req.query.long)
      let url2 = `https://api.openweathermap.org/data/2.5/onecall?lat=${req.query.lat}&lon=${req.query.long}&appid=${process.env.API_KEY}&units=metric`
      request(url2, function (err, response, body) {
          const resDATA = JSON.parse(body)
          const weatherinfo = {
              weather:resDATA,
              local:obj2
            }
            err ? console.log("no weather"):res.send(weatherinfo);
          })   

  }
  else if(Object.keys(req.query).length==1){
      if(req.query.zip.length===0){
          res.send('no data')
      }
      else {
        const zipCode = req.query.zip;
        var obj = zipcodes.lookup(zipCode);
        let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${obj.latitude}&lon=${obj.longitude}&appid=${process.env.API_KEY}&units=metric`
        request(url, function (err, response, body) {
            const resDATA = JSON.parse(body)
            const weatherinfo = {
                weather:resDATA,
                local:obj
            }
            err ? console.log("no weather"):res.send(weatherinfo);
        
        })
  }      
  }
  else console.log("Enter a zip for weather info");
});



app.listen(3000, function() {
    console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
