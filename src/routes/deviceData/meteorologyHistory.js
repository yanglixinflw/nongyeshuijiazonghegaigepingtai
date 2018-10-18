import React, { Component } from 'react';
import MeteorologyHistory from '../../components/DeviceData/meteorologyHistory';
import { connect } from 'dva';
@connect(({ meteorologyhistory, loading }) => ({
    meteorologyhistory,
    loading: loading.models.meteorologyhistory,
}))
export default class extends Component {
    constructor(props){
        super(props)
    }
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'meteorologyhistory/fetch',
        });
    }
    render() {
        let { meteorologyhistory ,loading} = this.props
        // console.log(meteorologyhistory)
        let arr = Object.keys(meteorologyhistory)
        if (arr.length === 0) return meteorologyhistory = null
        return (
            <div>
                <MeteorologyHistory
                    // {...meteorologyhistory}
                    {...this.props}
                />
                
                {/* 123456 */}
            </div>
        )

    }
}