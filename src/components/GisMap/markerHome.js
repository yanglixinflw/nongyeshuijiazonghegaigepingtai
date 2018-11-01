import React, { Component, Fragment } from 'react';
import { Map, Marker, InfoWindow } from 'react-amap';
import MarkerContent from './marker';
import IwContent from './infoWindow';
const MY_AMAP_KEY = 'cba14bed102c3aa9a34455dfe21c8a6e';
export default class extends Component {
    constructor(props) {
        super(props)
        console.log(props)
        this.markerEvents = {
            created: (markerInstance) => {
            //   console.log(markerInstance);
            //   console.log(markerInstance.getPosition());
            },
            click:()=>{
                this.setState({
                    infoVisible:true,
                })
            }
        }
        this.windowEvents = {
            created: (infoWindow) => {
                // console.log(infoWindow)
            },
            open: () => {
                // console.log('InfoWindow opened')
            },
            close: () => {
                // console.log('InfoWindow closed')
                this.setState({
                    infoVisible:false
                })
            },
            change: () => {
                // console.log('InfoWindow prop changed')
            },
        }
        this.state = {
            infoVisible:true,
            infoOffset:[0,-31],
        }
    }
    render() {
        const { type,homePosition } = this.props;
        const { infoVisible, infoOffset } = this.state;
        console.log(homePosition)
        return (
            <Map>
                {
                    homePosition.map((v, i) => { 
                        // debugger 
                        console.log(v)
                        return(
                    <Map key={i} amapkey={MY_AMAP_KEY}
                    //地图控件 插件
                    >
                        <Marker
                            position={v}
                            events={this.markerEvents}
                        >
                            <MarkerContent type={type} />
                        </Marker>
                        <InfoWindow
                            position={v}
                            visible={infoVisible}
                            events={this.windowEvents}
                            offset={infoOffset}
                        >
                            <IwContent />
                        </InfoWindow>
                    </Map>

                    )
                       
                    })
                }



            </Map>

        )
    }
}