import React from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import MyMapComponent from '../../components/GisMap/index';
import styles from './index.less';
@connect(({ mapGis, loading }) => ({
  mapGis,
  loading: loading.models.mapGis
}))
class IndexPage extends React.Component {
  constructor(props) {
    super(props)
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'mapGis/fetchCamera',
      payload: {
        deviceTypeId: 1,
        pageSize: 100
      }
    })
    dispatch({
      type: 'mapGis/fetchWaterMeter',
      payload: {
        deviceTypeId: 2,
        pageSize: 100
      }
    })
    dispatch({
      type: 'mapGis/fetchElectricMeter',
      payload: {
        deviceTypeId: 3,
        pageSize: 100
      }
    })
    dispatch({
      type: 'mapGis/fetchWaterValve',
      payload: {
        deviceTypeId: 4,
        pageSize: 100
      }
    })
  }
  render() {
    let { mapGis, loading } = this.props;
    let arr = Object.keys(mapGis);
    if (arr.length <= 3) return mapGis = null
    console.log(mapGis)
    return (
      <div className={styles.map}>
        {/* <Spin size='large' spinning={loading}> */}
          <MyMapComponent
            {...{ mapGis }}
          />
        {/* </Spin> */}
      </div>



    );
  }
}

IndexPage.propTypes = {
};

export default IndexPage;
