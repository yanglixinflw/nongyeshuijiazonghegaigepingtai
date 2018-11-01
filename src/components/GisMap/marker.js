import React,{ Component} from 'react';
import { Icon } from 'antd';

export default class extends Component {
    constructor(props){
        super(props)
        // console.log(props)
        // const {type} = props;
    
    }
    render(){
        const {type} = this.props;
        return (
            <Icon type={type} />
        )
    }
}