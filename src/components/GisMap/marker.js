import React,{ Component} from 'react';
import { Icon } from 'antd';
import styles from './index.less';
export default class extends Component {
    constructor(props){
        super(props)
        // console.log(props)
        // const {type} = props;
    
    }
    render(){
        const {type,isWarningMsg} = this.props;
        return (
            <div>
                {isWarningMsg?<Icon type='warning' className={styles.waring}/>:null}
                <Icon type={type} />
            </div>
           
        )
    }
}