import React,{ Component} from 'react';
import styles from './index.less';
export default class extends Component {
    constructor(props){
        super(props)
        const {markers} = props;
        if(!markers){
            return null
        }
        // console.log(isWarningMsg)
        // const {type} = props;
        this.state = {
            markers,
        }
    
    }
    render(){
        const {markers} = this.state;
        const {chosenMarker} = this.props;
        // console.log(chosenMarker)
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
                    markers.isWarningMsg?
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