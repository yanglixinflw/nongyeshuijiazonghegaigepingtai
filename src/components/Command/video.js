import React,{Component} from 'react'
import styles from './index.less'
export default class extends Component{
    render(){
        let {value}=this.props
        return(
            <div className={styles.video}>
                {value}
            </div>
        )
    }
}