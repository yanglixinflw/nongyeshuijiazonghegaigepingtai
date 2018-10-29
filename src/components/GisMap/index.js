import React,{Component} from 'react';
import { Map } from 'react-amap';
import styles from './index.less';
const MY_AMAP_KEY = 'cba14bed102c3aa9a34455dfe21c8a6e';
export default class extends Component {
    constructor(props){
        super(props)
    }
    render(){
        return(
            <div className={styles.map}>
                <div>
                    <Input />
                </div>
                <Map amapkey={MY_AMAP_KEY}/>
            </div>
        )
    }
}