'use strict';

const React = require('react');
const leaflet = require('react-leaflet');

const L = require('leaflet');
const leafletRoutingMachine = require('leaflet-routing-machine');

class RoutingMachine extends leaflet.MapLayer {
    // componentWillMount() {
        constructor(props) {
            super(props);
            console.log('constructor');
            console.log(props);
        }

            createLeafletElement(props) {
                console.log(props);
                const {map, from, to} = this.props;
                // return new L.Routing.control({
                //     position: 'topleft',
                //     waypoints: [
                //         L.latLng(from[0], from[1]),
                //         L.latLng(to[0], to[1]),
                //     ],
                // }).addTo(map);

                if (this.map !== undefined) {              
                    // console.log(JSON.stringify(this.map));
                    console.log(this);
            
                    map = this.map.leafletElement;
            
                    let leafletElement = L.Routing.control({
                        waypoints: [
                            L.latLng(from.latitude, from.longitude),
                            L.latLng(to.latitude, to.longitude),
                        ],
                        lineOptions: {
                            styles: [{ color: '#000', opacity: 0.8, weight: 6 }]
                        },
                        addWaypoints: false,
                        draggableWaypoints: false,
                        })
                        .addTo(map);
                    
                    return leafletElement.getPlan();
                }
                // this.leafletElement.getPlan();
        
                // return null;
            }
    // }




    // constructor(props) {
    //     super(props);
    //     this.state = {
    //       routingPopUp: null,
    //     };
    //     this.initializeRouting = this.initializeRouting.bind(this);
    //   }
    
    //   componentDidUpdate() {
    //     this.initializeRouting();
    //   }
    
    //   componentWillUnmount() {
    //     // this.destroyRouting();
    //   }
    
    //   initializeRouting() {
    //     if (this.props.map && !this.routing) {
    //       const plan = new L.Routing.Plan([
    //         L.latLng(53.349183, 83.761164),
    //         L.latLng(51.292651, 85.686975)
    //       ], {
    //         routeWhileDragging: false,
    //         geocoder: L.Control.Geocoder.nominatim(),
    //       });
    
    //       this.routing = L.Routing.control({
    //         plan,
    //         serviceUrl: MAPBOX_SERVICE_URL,
    //         router: L.Routing.mapbox(MAPBOX_TOKEN),
    //       });
    
    //       this.props.map.leafletElement.addControl(this.routing);
    //       L.DomEvent.on(this.props.map.leafletElement, 'click', this.createPopupsHandler);
    //     }
    //   }

    // componentWillMount() {
    //     super.componentWillMount();
    //     const {map, from, to} = this.props;
    //     this.leafletElement = L.Routing.control({
    //       position: 'topleft',
    //       waypoints: [
    //         L.latLng(from[0], from[1]),
    //         L.latLng(to[0], to[1]),
    //       ],
    //     }).addTo(map);
    //   }
    
    //   render() {
    //     return null;
    //   }

    // constructor (props) {
    //     console.log('RoutingMachine');
    //     console.log(props);
    //     console.log(this.props);

    //     const {map, from, to} = this.props

    //     // return L.Routing.control({
    //     // position: 'topleft',
    //     // waypoints: [
    //     //     L.latLng(from[0], from[1]),
    //     //     L.latLng(to[0], to[1]),
    //     // ],
    //     // });

    //     let leafletElement = L.Routing.control({
    //         waypoints: [
    //             L.latLng(from.latitude, from.longitude),
    //             L.latLng(to.latitude, to.longitude),
    //         ],
    //         lineOptions: {
    //             styles: [{ color: '#000', opacity: 0.8, weight: 6 }]
    //         },
    //         addWaypoints: false,
    //         draggableWaypoints: false,
    //     })
    //     .addTo(map);
  
    //     return leafletElement.getPlan();
    // }

    // constructor (props) {
    //     super(props);
    //     console.log('RoutingMachine');
    //     console.log(props);
    // }

    // componentWillMount() {
    //     console.log(this);
    //     super.componentWillMount();
    //     const {map, from, to} = this.props;
    //     this.leafletElement = L.Routing.control({
    //       position: 'topleft',
    //       waypoints: [
    //         L.latLng(from[0], from[1]),
    //         L.latLng(to[0], to[1]),
    //       ],
    //     }).addTo(map);

    //     // this.leafletElement.getPlan();
    //   }
    
    //   render() {
    //     return (
    //         <div>
    //             <p> hello its me </p>
    //         </div>
    //     ); // leafletElement.getPlan();
    //   }

    // componentWillMount() {
    //     console.log('mounting');
    //     super.componentWillMount();
    //     const {map, from, to} = this.props;
    //     this.leafletElement = L.Routing.control({
    //       position: 'topleft',
    //       waypoints: [
    //         L.latLng(from[0], from[1]),
    //         L.latLng(to[0], to[1]),
    //       ],
    //     }).addTo(map);
    //   }
    
    //   render() {
    //     return null;
    //   }

}


module.exports = {
    RoutingMachine: RoutingMachine
}