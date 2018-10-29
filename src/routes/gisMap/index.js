import React from 'react';
import BreadcrumbView from 'components/PageHeader/breadcrumb';
import MyMap from '../../components/GisMap/index';
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
          
        <MyMap />
      </div>

    );
  }
}

IndexPage.propTypes = {
};

export default IndexPage;
