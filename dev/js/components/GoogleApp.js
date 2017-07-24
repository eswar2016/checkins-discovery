import _ from "lodash";

import React, { PropTypes, Component } from 'react';
import ReactDOM from "react-dom";

import Helmet from "react-helmet";
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete'
var classNames = require('classnames');

import {
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps";


const GettingStartedGoogleMap = withGoogleMap(props => (
  <GoogleMap
    ref={props.onMapLoad}
    defaultZoom={6}
    center={{ lat: 20.5937, lng: 78.9629 }}
    onClick={props.onMapClick}
  >
    {props.markers.map(marker => (
      <Marker
        {...marker}
        onRightClick={() => props.onMarkerRightClick(marker)}
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
            }],
            address: 'India',
          };
          this.onChange = (address) => this.setState({ address })

        //handleMapClick = this.handleMapClick.bind(this);
        //handleMarkerRightClick = this.handleMarkerRightClick.bind(this);

    }
    handleFormSubmit(event){
        event.preventDefault()
        geocodeByAddress(this.state.address)
          .then(results => getLatLng(results[0]))
          .then(latLng => {
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
            })
          .catch(error => console.error('Error', error))

      }


  handleMapLoad(map) {
    this._mapComponent = map;
    console.log('map:  ', map)

    }



  handleMapClick(event) {
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

    if (nextMarkers.length === 3) {
      this.props.toast(
        `Right click on the marker to remove it`,
        `Also check the code!`
      );
    }
  }

  handleMarkerRightClick(targetMarker) {

    const nextMarkers = this.state.markers.filter(marker => marker !== targetMarker);
    this.setState({
      markers: nextMarkers,
    });
  }

  handleEnter(address){
    console.log('address:  ', address)
  geocodeByAddress(address)
    .then(results => {
      console.log('results', results)
    })
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
                onEnterKeyDown={this.handleEnter.bind(this)}
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