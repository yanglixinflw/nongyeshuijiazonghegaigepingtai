import React,{ Component} from 'react';
import styles from './index.less';
import classnames from 'classnames'
export default class extends Component{
    constructor(props){
        super(props)
        //console.log(props)
        // const map = props.__map__;
        
        // console.log(map)
    }
    render(){
        return (
            <div> 
                <i className={classnames('dyhsicon', 'dyhs-bofang', `${styles.playIcon}`)}></i>
                <div className={styles.mask}></div>
            </div>
        )
    }
}