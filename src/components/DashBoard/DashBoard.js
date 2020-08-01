import React from 'react';
import firebase from '../../provider/database';

import AppHeader from '../AppHeader/AppHeader';
import Categories from '../Categories/Categories';
import Grade from '../Grade/Grade';

// material UI
import { Typography } from '@rmwc/typography';
import { Button } from '@rmwc/button';
import { IconButton } from '@rmwc/icon-button';
import {
Grid,
GridCell,
GridRow,
 } from '@rmwc/grid';

// material UI style
import '@rmwc/typography/styles';
import '@rmwc/button/styles';
import '@rmwc/icon-button/styles';
import '@rmwc/grid/styles';

class DashBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
    this.setComponentProps = this.props.setComponentProps;
  }

  componentDidMount(prevProps) {
    // Typical usage (don't forget to compare props):
    // if (this.props !== prevProps) {
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props !== prevProps) {
    }
  }

  render(){
    return(
      <div style={{ textAlign: 'left', padding: '0rem 0rem',
        //background: 'rgba(0,0,0,0.02)',
        minHeight: '94vh'}}>
        {/* <AppHeader {...this.props}/> */}
        <div style={{ textAlign: 'left', padding: '0rem 0rem'}}>
          {/* <Grid>
            <GridRow>
              <GridCell phone={4} tablet={2} desktop={2}>
                <Categories />
              </GridCell>
            </GridRow>
          </Grid> */}
          <Grade {...this.props}/>
        </div>
      </div>


    );
  }
}

export default DashBoard;
