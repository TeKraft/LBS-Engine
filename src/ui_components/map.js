'use strict';
const React = require('react');
const leaflet = require('react-leaflet');
const CordovaPromiseFS = require('cordova-promise-fs');
//custom files required
//data
const config = require('../data_components/config.json');
const layers = require('../data_components/layers.json');
const friends = require('../data_components/friend.json');
//ui
const game = require('./game.js');
//logic
const locationManager = require('../business_components/locationManager.js');
const logger = require('../business_components/logger.js');
const OfflineLayer = require('../business_components/offlineLayer.js');
const RoutingMachine = require('./routing.js');

//setup for cordova promise fs
var fs = CordovaPromiseFS({
    persistent: true, // or false
    storageSize: 20*1024*1024, // storage size in bytes, default 20MB
    concurrency: 3,// how many concurrent uploads/downloads?
    Promise: require('bluebird') // Your favorite Promise/A+ library!
});

class Map extends React.Component {

    constructor(props) {
        super(props);
        this.addLayers = this.addLayers.bind(this);
        this.renderMapWithLayers = this.renderMapWithLayers.bind(this);
        this.handleOverlayadd = this.handleOverlayadd.bind(this);
        this.handleOverlayremove = this.handleOverlayremove.bind(this);
        this.handleChangeGameMode = this.handleChangeGameMode.bind(this);
        this.handleEndGame = this.handleEndGame.bind(this);
        //get the settings from the config file
        this.state = {
            circleRange: config.map.circleRange,
            position: config.map.center,
            zoom: config.map.zoom,
            hasLocation: false,
            showPopup: false,
            spotsInRange: [],
            positionInfo: 'Enable GPS to see your location.' // set to default, because if the GPS location is disabled there won't be data to show
        }
        //marker symbol for the "you are here" marker
        this.positionMarker = L.icon({
            iconUrl: 'img/man.png',
            iconSize: [50, 50],
            iconAnchor: [25, 48],
            popupAnchor: [-3, -76]
        });
        //code added:Akhil - different icon for marker
        this.tSpotMarker = L.icon({
            iconUrl: 'img/koffer.png',
            iconSize: [50, 50],
            iconAnchor: [25, 48],
            popupAnchor: [-3, -76]
        });
        //code added:Akhil - different icon for marker
        this.friendMarker = L.icon({
            iconUrl: 'img/friend.png',
            iconSize: [50, 50],
            iconAnchor: [25, 48],
            popupAnchor: [-3, -76]
        });

    }

    /**
     * Insert the gps location of the user into the map, if the gps-setting is true.
     * Update location and keep zoom level as soon as the user moves.
     */
    componentDidMount() {
        var that = this;
        locationManager.getLocation().then(function success(position) {
            var pos = [];
            pos.push(position.latitude);
            pos.push(position.longitude);
            if(that.props.gps) {
                that.setState({
                    position: pos,
                    hasLocation: true
                });
            }
        })

        // Update location and keep current zoom level as soon as movement begins. Distancefilter is set to 1 meter
        that.watchID = navigator.geolocation.watchPosition(function success(position) {
            if (that.map) {
                var zoomLvl = that.map.leafletElement.getZoom();
            } else {
                var zoomLvl = config.map.zoom;
            }
            var msg = `zoom: ${zoomLvl}, lat: ${position.coords.latitude}, lng: ${position.coords.longitude} .`
            var curPos = [position.coords.latitude, position.coords.longitude];
            if(that.props.gps) {
                that.setState({
                    position: curPos,
                    positionInfo: msg,
                    zoom: zoomLvl
                });
                var spotsInRange = [];
                var spots = layers['T-spots'].items;
                for (let i in spots) {
                        var dist = that.calcDistance( curPos, spots[i].coords );
                        if (dist <= that.state.circleRange) {
                            spotsInRange.push(spots[i].name);
                        }
                }
                that.setState({spotsInRange: spotsInRange})
                if (spotsInRange.length > 0) {
                    that.handleChangeGameMode(true);
                } else {
                    that.handleChangeGameMode(false);
                }
            }
            console.log(`GPS location set - ${msg}`);
        }, function error(err) {
            console.log(err);
            console.log("error watching location");
        },
        { enableHighAccuracy: true, timeout: 500, maximumAge: 1000, distanceFilter: 1 },    // timeout: 20000
        );

        // this.handleRouting();
    }

    // handleRouting() {
    //     console.log(this.refs);
    //     let map = this.refs.map.leafletElement;
    //     let from = this.state.position;
    //     let to = [51.960801, 7.624331];
    //     let routeControl = L.Routing.control({
    //         waypoints: [
    //             L.latLng(from[0], from[1]),
    //             L.latLng(to[0], to[1]),
    //         ],
    //         lineOptions: {
    //             // styles: [{ color: '#000', opacity: 0.8, weight: 6 }]
    //         },
    //         addWaypoints: false,
    //         draggableWaypoints: false
    //         });
            
    //         routeControl.addTo(map);

    //         console.log(routeControl);
    //         routeControl.show();
    //         routeControl.hide();

    //         // .leaflet-control-container .leaflet-routing-container-hide {
    //         //     display: none;
    //         // }
    //         // console.log(document.getElementsByClassName('leaflet-control-container-hide'));
    //     }

    componentWillUnmount() {
        navigator.geolocation.clearWatch(this.watchId);
    }

    /**
     * Calculate the distance in km of two provided points
     * @param {Array} latlng1 first point - [latitude, longitude]
     * @param {Array} latlng2 second point - [latitude, longitude]
     */
    calcDistance(latlng1, latlng2) {
        // Deg --> Rad
        var lat1 = latlng1[0]*Math.PI/180;
        var lat2 = latlng2[0]*Math.PI/180;
        var lng1 = latlng1[1]*Math.PI/180;
        var lng2 = latlng2[1]*Math.PI/180;
        // distance calculation:
        var cosG = Math.sin(lat1)*Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1);
        var dist = 6378.388 * Math.acos(cosG);
        return dist;
    };

    /**
     * Write a log that notes the change of active layers
     * @param {boolean} change If the layer was added or removed
     * @param {String} data Name of the layer that was toggled
     */
    createLog(change, data) {
        var action;
        var that = this;
        if(this.props.logging) {
            //define the log
            if(change) {
                action =  'Activate ' + data;
            }
            else action = 'Deactivate ' + data;
            var entry;
            //get the current position for the log
            locationManager.getLocation().then(function success(position) {
                entry = [position.latitude, position.longitude, that.props.picture ? 'Streetview' : 'Map', action];
                //log the data
                logger.logEntry(entry);
            }, function error(err) {
                //if there was an error getting the position, log a '-' for lat/lng
                entry = ['-', '-', that.props.picture ? 'Streetview' : 'Map', action];
                //log the data
                logger.logEntry(entry);
            })
        }
    }

    /**
     * Handle the activation of a layer on the map
     * @param {Object} e Layer Object fired by leaflet
     */
    handleOverlayadd(e) {

        this.createLog(true, e.name);
    }

    /**
     * Handle the deactivation of a layer on the map
     * @param {Object} e Layer Object fired by leaflet
     */
    handleOverlayremove(e) {
        
        this.createLog(false, e.name);
    }

    /**
     * Handle the (de-)activation of game mode. Change visibility of the play button
     * @param {boolean} bool boolean set to true if game mode is possible (because user is in range of a spot)
     */
    handleChangeGameMode(bool) {
        try {
            this.props.onGameModeChange(bool);
        } catch(e) {
            console.log('Error:\n' + e);
        }
        this.createLog('GameMode', bool);
    }

    /**
     * Function to set state for starting gaming prompt and read scores from gamescore.json
     */
    handleStartGame() {

        this.setState({
            showPopup: true,
            score: 0,
            scores: localStorage
        });
    }

    /**
     * Function to add new score to the local storage to save score
     * @param {Object} obj object containing selected spot, highest amount of points (compared current game to previously saved points) and content fo gamescore.json
     */
    handleEndGame(obj) {
        let spot = obj.spot;
        let score = obj.newScore;
        obj.scores[spot] = score;
        // add score to local storage (save score)
        localStorage.setItem(spot, score);
        this.setState({showPopup: false});
    }

    //get the elements from the layer.json file and add each layer with a layercontrol.Overlay to the map
    addLayers() {
        var mapLayers = [];
               //adding friend layer
        for (let friend in friends){
            var friendElement = [];
            for (var i = 0; i < friends[friend].length; i++) {
                //if there is a popup, insert it into the map
                if(friends[friend][i].showme) {
                    friendElement.push(<leaflet.Marker position={friends[friend][i].location} key={friends[friend][i].name} icon={this.friendMarker}>
                        <leaflet.Popup>
                            <span>
                                {friends[friend][i].name}
                            </span>
                        </leaflet.Popup>
                        </leaflet.Marker>)
                }
            }
            mapLayers.push(<leaflet.LayersControl.Overlay key={friend}
                                                        name={friend}
                                                        checked={true}>
                                                        <leaflet.FeatureGroup key={friend}>
                                                            {friendElement}
                                                        </leaflet.FeatureGroup>
                            </leaflet.LayersControl.Overlay>)
        }
        for (let layer in layers) {
            var layerElement = [];
            //check if the layer is containing markers and add those
            if (layers[layer].type == 'marker') {
                for (var i = 0; i < layers[layer].items.length; i++) {
                    //if there is a popup, insert it into the map
                    if(layers[layer].items[i].popup != undefined) {
                        layerElement.push(<leaflet.Marker position={layers[layer].items[i].coords} key={layers[layer].items[i].name} icon={this.tSpotMarker}>
                            <leaflet.Popup>
                                <span>
                                    {layers[layer].items[i].popup}
                                </span>
                            </leaflet.Popup>
                            </leaflet.Marker>)
                    }
                    else {
                        layerElement.push(<leaflet.Marker position={layers[layer].items[i].coords} key={layers[layer].items[i].name} icon={this.tSpotMarker} />)
                    }
                }
            }
            //Akhil:else it is a zone
            else if (layers[layer].type == 'zone'){
                for (var i = 0; i < layers[layer].items.length; i++) {
                    layerElement.push(<leaflet.Circle center={layers[layer].items[i].center} color={layers[layer].items[i].color} radius={config.map.circleRange*1000}
                                        key={layers[layer].items[i].name} />)
                }

            }
            //else it is a route
            else if (layers[layer].type == 'route') {
                layerElement.push(<leaflet.Polyline positions={layers[layer].coords} color='red' key={layers[layer].name} />);
            }
            mapLayers.push(<leaflet.LayersControl.Overlay key={layer} 
                                                        name={layer} 
                                                        checked={true}>
                                                        <leaflet.FeatureGroup key={layer}>
                                                            {layerElement}
                                                        </leaflet.FeatureGroup>
                            </leaflet.LayersControl.Overlay>)
        }
        return mapLayers;
    }

    renderMapWithLayers() {
        // check if the location is enabled and available
        const marker = this.state.hasLocation && this.props.gps
            ? (
                <leaflet.Marker position={this.state.position} icon={this.positionMarker} ref={this.state.onChangeCurrPosition}>
                    <leaflet.Popup>
                        <span>
                            {this.state.positionInfo}
                        </span>
                    </leaflet.Popup>
                </leaflet.Marker>
            )
            : null;
        return (
            <leaflet.Map
                center={this.state.position}
                zoom={this.state.zoom}
                dragging={this.props.draggable}
                zoomControl={this.props.zoomable}
                scrollWheelZoom={this.props.zoomable}
                zoomDelta={this.props.zoomable == false ? 0 : 1}
                onOverlayadd={this.handleOverlayadd}
                onOverlayremove={this.handleOverlayremove}
                ref='map'>
                <OfflineLayer.OfflineLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="Map data &copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                />
                <leaflet.LayersControl position="topleft">
                    {this.addLayers()}
                </leaflet.LayersControl>
                <OfflineLayer.OfflineControl />
                {marker}
            </leaflet.Map>
        )
    }

    //render the map with the layerControl
    render() {
        if (this.state.showPopup === true) {
            return (
                <game.Game
                    gps={this.state.position}
                    spots={this.state.spotsInRange}
                    numberOfQuestions={0}
                    selected={false}
                    scores={this.state.scores}
                    score={this.state.score}
                    questionnaire={true}
                    onEndGameChange={this.handleEndGame}
                >
                </game.Game>
            )
        } else {
            //if the layerControl is active, the map is rendered with the layercontrol
            if (this.props.layerControl) {
                return this.renderMapWithLayers()
            }
            else {
                // check if the location is enabled and available
                const marker = this.state.hasLocation && this.props.gps
                    ? (
                        <leaflet.Marker position={this.state.position} icon={this.positionMarker} ref={this.state.onChangeCurrPosition}>
                            <leaflet.Popup>
                                <span>
                                    {this.state.positionInfo}
                                </span>
                            </leaflet.Popup>
                        </leaflet.Marker>
                    )
                    : null;
                //return the map without any layers shown
                return (
                        <leaflet.Map 
                            center={this.state.position}
                            zoom={this.state.zoom}
                            dragging={this.props.draggable}
                            zoomControl={this.props.zoomable}
                            scrollWheelZoom={this.props.zoomable}
                            zoomDelta={this.props.zoomable == false ? 0 : 1}
                            ref='map'> 
                            <OfflineLayer.OfflineLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution="Map data &copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                            />
                            <OfflineLayer.OfflineControl />
                            {this.state.markers.map((position, idx) => 
                                <leaflet.Marker key={`marker-${idx}`} position={position}>
                                <leaflet.Popup>
                                    <span>A pretty CSS3 popup. <br/> Easily customizable.</span>
                                </leaflet.Popup>
                                </leaflet.Marker>
                                )}
                        </leaflet.Map>
                )
                // {(map) => this.map = map}
            }
        }
    }
}

module.exports = {
    Map: Map
}