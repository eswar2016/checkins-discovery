import _ from "lodash";
import map from 'lodash/map'
import React, { PropTypes, Component } from 'react';
import ReactDOM from "react-dom";

import Helmet from "react-helmet";
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete'
var classNames = require('classnames');
import axios    from  'axios';
import {
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow,
} from "react-google-maps";


const GettingStartedGoogleMap = withGoogleMap(props => (
  <GoogleMap
    ref={props.onMapLoad}
    defaultZoom={5}
    options={{ minZoom: 3, maxZoom: 20 }}
    center={{ lat: 20.5937, lng: 78.9629 }}
    onClick={props.onMapClick}

  >
    {props.markers.map(marker => (
      <Marker
        {...marker}
        onRightClick={() => props.onMarkerRightClick(marker)}
        onClick={() => props.onMarkerClick(marker)}
      />
    ))}
  </GoogleMap>
));

export default class GettingStartedExample extends Component {

  constructor(props)
    {
        super(props);
        this.state = {
            markers: [{
              position: {
                lat: 20.5937,
                lng: 78.9629,
              },
              key: `India`,
              defaultAnimation: 2,
              showInfo:false,

            }],
            address: 'India',
            results: []
          };
          this.onChange = (address) => this.setState({ address })

    }
    handleFormSubmit(event){
        event.preventDefault()
            this.searchNearPlaces()

        /*
        geocodeByAddress(this.state.address)
          .then(results => getLatLng(results[0]))
          .then(latLng => {
            this.setState({
              markers: [],

                })
                const nextMarkers = [
              ...this.state.markers,
              {
                position: latLng,
                defaultAnimation: 2,
                key: Date.now(), // Add a key property for: http://fb.me/react-warning-keys
              },
            ];
            this.setState({
              markers: nextMarkers,
                })
            console.log(this.state.markers)
            var bounds = new google.maps.LatLngBounds();

            console.log("bounds", bounds, )

             bounds.extend(this.state.markers[0].position);


            console.log(this._mapComponent.getZoom())
            this._mapComponent.fitBounds(bounds);

            })
          .catch(error => console.error('Error', error))
          */
      }


  handleMapLoad(map) {
    this._mapComponent = map;

    }



  handleMapClick(event) {
    this.setState({
              markers: [],

                })
    const nextMarkers = [
      ...this.state.markers,
      {
        position: event.latLng,
        defaultAnimation: 2,
        key: Date.now(), // Add a key property for: http://fb.me/react-warning-keys
      },
    ];
    this.setState({
      markers: nextMarkers,
    });
    console.log(this.state.markers)
    var bounds = new google.maps.LatLngBounds();
    console.log(bounds)

     bounds.extend(this.state.markers[0].position);


    this._mapComponent.fitBounds(bounds);
/*
    if (nextMarkers.length === 3) {
      this.props.toast(
        `Right click on the marker to remove it`,
        `Also check the code!`
      );
    }*/
  }

  handleMarkerRightClick(targetMarker) {

    const nextMarkers = this.state.markers.filter(marker => marker !== targetMarker);
    this.setState({
      markers: nextMarkers,
    });
    var bounds = new google.maps.LatLngBounds();
    console.log(bounds)
    this.state.markers.map((marker, i) => {
        console.log(marker, i)
     bounds.extend(marker.position);
    })


    this._mapComponent.fitBounds(bounds);
  }

  handleEnter(address){
    console.log('address:  ', address)
  geocodeByAddress(address)
    .then(results => {
      console.log('results', results)
    })
}

     getUrl() {
        const clientID = 'K05DHY5O5XPD413VH2WDYIJRZC3YX1UZ0DDWJOB1LSISD4XG',
              clientSecret = 'AUHDGTORWSJ2VAMX5FVYQBEZCUHKTGICQPIOD2XBVPNIP2WA',
              version = 'v=20140806';
        let location = this.state.address,
            url = 'https://api.foursquare.com/v2/venues/explore?client_id=' + clientID + '&client_secret=' + clientSecret + '&near=' + location + '&' + version;
        return url;
    }
    searchNearPlaces() {
        let url = this.getUrl();

        axios.get(url)
          .then(response => {
            let results = response.data.response.groups[0].items;
            this.setState({ results:results });

            //const uniqueLoc = [];
            //results.map(loc => {
            //    if (uniqueLoc.indexOf(loc.venue.name) === -1) {
            //        uniqueLoc.push(loc.venue.name)

            //        console.log(loc.venue.name)
            //    }
            //})

          this.setState({
              markers: [],

                })
            var bounds = new google.maps.LatLngBounds();

          results.map((el, i) => {
                if (i < 20) {
                    const nextMarkers = [
              ...this.state.markers,
              {
                position: { lat: el.venue.location.lat, lng: el.venue.location.lng  },
                defaultAnimation: 2,
               key: Date.now(),
               // showInfo: true
              },
            ];
            this.setState({
              markers: nextMarkers,
                })

            console.log("bounds", bounds, )

             bounds.extend(this.state.markers[i].position);


                }

            })
             this._mapComponent.fitBounds(bounds);


          }).catch(error => console.error('Error', error))
          console.log('state.results:  ', this.state.results)

    }

    handleMouseoverMarker(map, marker){
        console.log('marker:  ', map)
    }

  render() {
     const inputProps = {
      value: this.state.address,
      onChange: this.onChange,
      type: 'search',
      placeholder: 'Search Places...',
      autoFocus: true,
    }
    const cssClasses = {
    root: 'form-group',
    input: 'form-control',
    autocompleteContainer: 'my-autocomplete-container'
  }
  const myStyles = {
    root: { position: 'absolute' },
    input: { width: '100%' },
    autocompleteContainer: { backgroundColor: 'green' },
    autocompleteItem: { color: 'black' },
    autocompleteItemActive: { color: 'blue' }
  }
  const handleSelect = (address, placeId) => {
  this.setState({ address, placeId })

  // You can do other things with address string or placeId. For example, geocode :)
}
const AutocompleteItem = ({ suggestion }) => (<div><i className="fa fa-map-marker"/>{suggestion}</div>)
    return (
      <div ref="map" style={{height: '600px'}}>
        <Helmet
          title="GoogleMap"
        />
        <form onSubmit={this.handleFormSubmit.bind(this)}>
            <PlacesAutocomplete
                inputProps={inputProps}
                classNames={cssClasses}
                styles={myStyles}
                autocompleteItem={AutocompleteItem}
                 />
                 <button type="submit">Submit</button>
      </form>

        <GettingStartedGoogleMap
          containerElement={
            <div style={{ height: '650px' }} />
          }
          mapElement={
            <div style={{ height: '650px' }} />
          }
          onMapLoad={this.handleMapLoad.bind(this)}
          onMapClick={this.handleMapClick.bind(this)}
          markers={this.state.markers}
          onMarkerClick={this.handleMouseoverMarker.bind(this)}
          onMarkerRightClick={this.handleMarkerRightClick.bind(this)}

        />

      </div>
    );
  }
}

window.initMap = () => {
    ReactDOM.render(
        <GettingStartedExample />,
    document.getElementById('root')
)
}