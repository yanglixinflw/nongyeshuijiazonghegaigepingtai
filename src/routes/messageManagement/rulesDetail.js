import React,{Component} from 'react';
import { connect } from 'dva';
import { parse } from 'qs';
import RulesDetail from '../../components/infoManagement/rulesDetail'
@connect(({ rulesDetail, loading }) => ({
    rulesDetail,
    loading: loading.models.rulesDetail
}))
export default class extends Component{
    componentDidMount() {
        let ruleId = parse(window.location.href.split(':'))[3];
        const { dispatch } = this.props;
        dispatch({
            type: 'rulesDetail/fetch',
            payload: {
                ruleId
            }
        })
    }
    render(){
        let { rulesDetail, loading } = this.props;
        let arr = Object.keys(rulesDetail);
        if (arr.length ==0 ) return rulesDetail = null;
        // console.log(rulesDetail)
        return(
            <div>
                <RulesDetail 
                    {...{rulesDetail}}
                />
            </div>
        )
    }
}