import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { parse } from 'qs';
import { Spin } from 'antd';
import BreadcrumbView from '../../components/PageHeader/breadcrumb';
import RulesDetail from '../../components/infoManagement/rulesDetail'
@connect(({ rulesDetail, loading }) => ({
    rulesDetail,
    loading: loading.models.rulesDetail
}))
export default class extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ruleId: ''
        }
    }
    componentDidMount() {
        let ruleId = parse(window.location.href.split(':'))[3];
        // console.log(ruleId)
        const { dispatch } = this.props;
        dispatch({
            type:'rulesDetail/clear'
        })
        dispatch({
            type: 'rulesDetail/fetch',
            payload: {
                ruleId
            }
        })
        this.setState({
            ruleId
        })
    }
    render() {
        let { rulesDetail, loading } = this.props;
        let { ruleId } = this.state;
        if (ruleId == "") {
            return null
        }
        let arr = Object.keys(rulesDetail);
        if (arr.length == 0) return rulesDetail = null;
        // console.log(rulesDetail)
        return (
            <Fragment>
                <Spin size='large' spinning={loading}>
                    <BreadcrumbView
                        {...this.props}
                    />
                    <RulesDetail
                        {...{ rulesDetail, ruleId }}
                    />
                </Spin>
            </Fragment>
        )
    }
}