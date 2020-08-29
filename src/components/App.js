import React,{useState, useEffect} from 'react';
import Header from './ui/Header';
import Home from './Home';
import Hourly from './Hourly';
import axios from 'axios';
import {ThemeProvider} from '@material-ui/styles';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import theme from './ui/Theme';
import CustomizedSwitches from './TempChange';
import Panel from './Panel';
import Loading from './Loader';
import { makeStyles } from '@material-ui/styles';
import Footer from './Footer.js';

import {API} from 'aws-amplify'

const useStyles = makeStyles(theme =>({
  error:{
    textAlign:'center',
    marginTop:'5rem',
    fontFamily:'Kalam,cursive',
    fontSize:'2rem',
    fontWeight:900,
  }
}))

const App = () => {
const classes = useStyles()
const [response, setResponse] = useState(null);
const [zip, zset] = useState({});
const [checked,setCheck] = useState(false);
const [display, setDisplay] = useState(false);


const location = () =>{
  if(navigator.geolocation){
    setDisplay(true)
    navigator.geolocation.getCurrentPosition(coordsUser)
  
  }
}
const coordsUser = async (pos) =>{
  console.log('coords caolled')
  const lat = pos.coords.latitude;
  const long = pos.coords.longitude;
  if(lat !== null && long !== null){
    let params = {
      'queryStringParameters':
      {
          lat,
          long
      }
  }
    const res = await API.get('weather', '/get-weather', params)
    console.log(res)
    zset(res.local)
    setResponse(res.weather)
    setDisplay(false)
  }
  else{
    console.log('alert')
    alert("Denied Location Service");
  }
}

useEffect(() =>{
  setDisplay(true)
  onTermSubmit('07307');
},[])

const onTermSubmit = async (code) =>{
  
  setDisplay(true)
  let params = {
    'queryStringParameters':
    {
        zip: code
    }
  }
  const res = await API.get('weather', '/get-weather', params)
  console.log(res)
  zset(res.local)
  setResponse(res.weather)
  setDisplay(false)
};
const displayScreen = (
  <React.Fragment>
      <Route exact path="/" render={() => (response && zip ? <Home typeCheck={checked} response={response} code={zip}/>:<Loading/>)}/>
      <Route exact path="/hourly" render={() => (response ? <Hourly typeCheck={checked} response={response.hourly}/>:<Loading/>)}/>
      <Route exact path="/5day" render={() => (response ? <Panel typeCheck={checked} response={response.daily}/>:<Loading/>)}/>
  </React.Fragment>
)
return (
  <ThemeProvider theme={theme} >
    <BrowserRouter>
      <Header data={response} onForm={onTermSubmit} onLocal={location}/>
        <CustomizedSwitches checkedC={checked} setCheck={setCheck}/>
        <Switch >
          {display ? <Loading/>: response ? displayScreen:<div className={classes.error}>Enter a Valid Pin</div>}
        </Switch>
    </BrowserRouter>
    {/* <Footer/> */}
  </ThemeProvider>
);
}
export default App;
// us-central1-composite-fire-252618.cloudfunctions.net/function-1