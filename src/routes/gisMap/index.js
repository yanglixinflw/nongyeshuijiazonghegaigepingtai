import React from 'react';
import BreadcrumbView from 'components/PageHeader/breadcrumb';
import MyMap from '../../components/GisMap/index';
import { Map } from 'react-amap';
class IndexPage extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div>
        <div>
          <BreadcrumbView
            {...this.props}
          />
        </div>
        <Map>
          <MyMap />
        </Map>
        
      </div>

    );
  }
}

IndexPage.propTypes = {
};

export default IndexPage;
