import React,{ Component } from 'react';
import AddWarningRules from '../../components/infoManagement/addWarningRules'
export default class extends Component{
    render(){
        return(
            <React.Fragment>
                {/* <Spin size='large' spinning={loading}> */}
                    <AddWarningRules
                        // {...this.props}
                    /> 
                {/* </Spin>   */}
            </React.Fragment>
        )
    }
}
