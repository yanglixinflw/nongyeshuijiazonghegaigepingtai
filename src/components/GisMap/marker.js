import React,{ Component} from 'react';
import { Icon } from 'antd';
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
        return (
            <div>
                {markers.isWarningMsg?
                        <i className={styles.warning}>
                            <div className={styles.warningAnimation}></div>
                        </i> 
                    : 
                        <i className={styles.normal}></i>
                    
                }
            </div>
           
        )
    }
}