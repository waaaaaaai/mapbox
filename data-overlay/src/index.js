import React from 'react'
import ReactDOM from 'react-dom'
import mapboxgl from 'mapbox-gl'
import * as d3 from 'd3';
//import data from './data.json'
import data from './china.json'
//import axios from 'axios';
import hujia from './hujia.json'

mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';

var color = d3.scaleQuantize()
.range(["rgb(237,248,233)", "rgb(186,228,179)",
"rgb(116,196,118)", "rgb(49,163,84)", "rgb(0,109,44)"]);



const options = [{
  name: 'Count',
  description: 'Estimated total user count',
  property: 'count',
  stops: [
    [0, '#f8d5cc'],
    [10, '#f4bfb6'],
    [50, '#f1a8a5'],
    [100, '#ee8f9a'],
    [500, '#ec739b'],
    [100000000, '#dd5ca8'],
    [250000000, '#c44cc0'],
    [500000000, '#9f43d7'],
    [1000000000, '#6e40e6']
  ]
}, {
  name: 'GDP',
  description: 'Estimate total GDP in millions of dollars',
  property: 'gdp_md_est',
  stops: [
    [0, '#f8d5cc'],
    [1000, '#f4bfb6'],
    [5000, '#f1a8a5'],
    [10000, '#ee8f9a'],
    [50000, '#ec739b'],
    [100000, '#dd5ca8'],
    [250000, '#c44cc0'],
    [5000000, '#9f43d7'],
    [10000000, '#6e40e6']
  ]
}]

class Application extends React.Component {

state = {
      active: options[0]
  };



  
  componentDidUpdate() {
    this.setFill();
  }

  componentDidMount() {

  //   axios.get('http://data-hujia.cctalk.com/hujia/api/eventrecord/76/',{headers:{Cookie: 'sessionid=dcw7qke40ia9sv6xjiwiteo96gza53q4'}})
  //   .then(res => {
  //       this.setState({ items: res.data });  
  //  });

  //console.log(data.features);
  
  var min =999, max =0;
  for(var province of data.features) {

    var count = hujia.filter(function(o){
      return o.province == province.properties.name
    }).length 
    if (count < min){
      min = count
    }
    else if (count > max){
      max = count
    }
    province.properties['count'] = count 
 
}
  console.log(data.features)

  color.domain(min,max)
  

  

    this.map = new mapboxgl.Map({
      container: 'map', // just an ID
      style: 'mapbox://styles/mapbox/streets-v9',
      center: [107, 33],
      zoom: 3.4
    });

    this.map.on('load', () => {
      this.map.addSource('countries', {
        type: 'geojson',
        data
      });

      this.map.addLayer({
        id: 'countries',
        type: 'fill',
        source: 'countries'
      }, 'country-label-lg'); // ID metches `mapbox/streets-v9`


      this.setFill();
    });
  }

  setFill() {
    const { property, stops } = this.state.active;
    this.map.setPaintProperty('countries', 'fill-color', {
      property,
      stops,
      
    });

    this.map.setPaintProperty('countries', 'fill-opacity',0.5);   
  }

  render() {
    const { name, description, stops, property } = this.state.active;
    const renderLegendKeys = (stop, i) => {
      return (
        <div key={i} className='txt-s'>
          <span className='mr6 round-full w12 h12 inline-block align-middle' style={{ backgroundColor: stop[1] }} />
          <span>{`${stop[0].toLocaleString()}`}</span>
        </div>
      );
    }

    const renderOptions = (option, i) => {
      return (
        <label key={i} className="toggle-container">
          <input onChange={() => this.setState({ active: options[i] })} checked={option.property === property} name="toggle" type="radio" />
          <div className="toggle txt-s py3 toggle--active-white">{option.name}</div>
        </label>
      );
    }

    return (
      <div>
        <div id='map' className="absolute top right left bottom" />
        <div className="toggle-group absolute top left ml12 mt12 border border--2 border--white bg-white shadow-darken10 z1">
          {options.map(renderOptions)}
        </div>
        <div className="bg-white absolute bottom right mr12 mb24 py12 px12 shadow-darken10 round z1 wmax180">
          <div className='mb6'>
            <h2 className="txt-bold txt-s block">{name}</h2>
            <p className='txt-s color-gray'>{description}</p>
          </div>
          {stops.map(renderLegendKeys)}
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Application />, document.getElementById('app'));
