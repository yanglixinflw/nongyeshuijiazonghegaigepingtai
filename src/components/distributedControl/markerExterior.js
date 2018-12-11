import React,{ Component} from 'react';
import styles from './mapControl.less';
export default class extends Component {
    constructor(props){
        super(props)
        const {markers} = props;
        if(!markers){
            return null
        }
        const {deviceTypeId} = markers;
        this.state = {
            markers,
            deviceTypeId
        }
    
    }
    render(){
        const {markers,deviceTypeId} = this.state;
        const {chosenMarker} = this.props;
        // console.log(info)
        if(deviceTypeId==5){
            return (
                <div className={styles.markerCamera}>
                    {
                        chosenMarker?
                            <i className={styles.chosen}>
                                <div className={styles.chosenAnimation1}></div>
                                <div className={styles.chosenAnimation2}></div>
                                <div className={styles.chosenAnimation3}></div>
                            </i> 
                        :
                        markers.isWarning?
                            <i className={styles.warning}>
                                <div className={styles.warningAnimation1}></div>
                                <div className={styles.warningAnimation2}></div>
                                <div className={styles.warningAnimation3}></div>
                            </i> 
                        : 
                            <i className={styles.normal}></i>
                        
                    }
                </div>
               
            )
        }else if(deviceTypeId==2){
            return (
                <div className={styles.markerWaterM}>
                    {
                        chosenMarker?
                            <i className={styles.chosen}>
                                <div className={styles.chosenAnimation1}></div>
                                <div className={styles.chosenAnimation2}></div>
                                <div className={styles.chosenAnimation3}></div>
                            </i> 
                        :
                        markers.isWarning?
                            <i className={styles.warning}>
                                <div className={styles.warningAnimation1}></div>
                                <div className={styles.warningAnimation2}></div>
                                <div className={styles.warningAnimation3}></div>
                            </i> 
                        : 
                            <i className={styles.normal}></i>
                        
                    }
                </div>
               
            )
        }else if(deviceTypeId==3){
            return (
                <div className={styles.markerEleMeter}>
                    {
                        chosenMarker?
                            <i className={styles.chosen}>
                                <div className={styles.chosenAnimation1}></div>
                                <div className={styles.chosenAnimation2}></div>
                                <div className={styles.chosenAnimation3}></div>
                            </i> 
                        :
                        markers.isWarning?
                            <i className={styles.warning}>
                                <div className={styles.warningAnimation1}></div>
                                <div className={styles.warningAnimation2}></div>
                                <div className={styles.warningAnimation3}></div>
                            </i> 
                        : 
                            <i className={styles.normal}></i>
                        
                    }
                </div>
               
            )
        }else if(deviceTypeId==1){
            return (
                <div className={styles.markerWaterV}>
                    {
                        chosenMarker?
                            <i className={styles.chosen}>
                                <div className={styles.chosenAnimation1}></div>
                                <div className={styles.chosenAnimation2}></div>
                                <div className={styles.chosenAnimation3}></div>
                            </i> 
                        :
                        markers.isWarning?
                            <i className={styles.warning}>
                                <div className={styles.warningAnimation1}></div>
                                <div className={styles.warningAnimation2}></div>
                                <div className={styles.warningAnimation3}></div>
                            </i> 
                        : 
                            <i className={styles.normal}></i>
                        
                    }
                </div>
               
            )
        }
        
    }
}