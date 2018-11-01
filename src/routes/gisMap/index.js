import React from 'react';
import MyMapComponent from '../../components/GisMap/index';
import styles from './index.less';
class IndexPage extends React.Component {
  constructor(props) {
    super(props)     
  }
  render() {
    return (
      <div>
        <div className={styles.map}>
            <MyMapComponent />   
        </div>
        
      </div>

    );
  }
}

IndexPage.propTypes = {
};

export default IndexPage;
