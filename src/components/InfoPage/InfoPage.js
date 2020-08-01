import React from 'react';
import {
  NavLink,
} from "react-router-dom";
import Logo from '../../assets/icons/learnink-logo_500.png';
import Science from '../../assets/icons/featured-icon.png';
import IconList from './IconList';
import AppHeader from '../AppHeader/AppHeader';
import Grade from '../Grade/Grade';

// material UI
import {
Grid,
GridRow,
GridCell,
 } from '@rmwc/grid';
 import { Typography } from '@rmwc/typography';
 import { Button } from '@rmwc/button';
 import { IconButton } from '@rmwc/icon-button';

// material UI style
import '@rmwc/grid/styles';
import '@rmwc/typography/styles';
import '@rmwc/button/styles';
import '@rmwc/icon-button/styles';
import './InfoPage.css';

class InfoPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openSignIn: false,
      dummy: false,
    }
    this.appHeaderHanler = this.appHeaderHanler.bind(this);
    this.setComponentProps = this.props.setComponentProps;
  }

  componentDidMount() {

  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props !== prevProps) {
      // Add code here
      console.log("Infopage componentDidUpdate",this.props.userAuth, prevProps.userAuth);
      this.setState({dummy: true});
    }
  }

  appHeaderHanler(){
    this.setState({openSignIn: false});
  }

  render(){
    const {userAuth} = this.props;
    const {openSignIn} = this.state;
    return(
    <>
      {/* <AppHeader {...this.props} openSignIn={openSignIn} parentHandler={this.appHeaderHanler}/> */}
      <div style={{ textAlign: 'left',padding: '0.5rem'}}>
        <Grid>
          <GridRow>
            <GridCell phone={4} tablet={8} desktop={4}>
              <Typography use="headline4" >
                Experience
              </Typography>
              <br/>
              <Typography use="headline6">
                the
              </Typography>
              <br/>
              <Typography use="headline4">
                Difference
              </Typography>
              <GridRow>
                <GridCell phone={4} tablet={8} desktop={12} style={{textAlign:'justify'}}>
                  <Typography use="subtitle1" >
                    LearnInk is the technical aid to build skills across different subjects and development areas.
                    It's adapative by design, assists exhaustively to put understanding into practice for a firm, solid foundation through joyful engagement.
                  </Typography>
                </GridCell>
                <GridCell phone={4} tablet={8} desktop={12}>
                  <Button raised label="Let's start" style={{height: '30px', fontSize: '12px', marginTop: '10px', fontWeight: 'bold'}}
                    onClick={()=>{
                      // aphRef for AppHeader open and close function call
                      this.props.aphRef.handleOpenSignIn(true);
                      // console.log("aphRef", this.props.aphRef)
                    }}
                    >
                  </Button>
                </GridCell>
              </GridRow>
            </GridCell>
            <GridCell phone={4} tablet={8} desktop={8}>
              <IconList />
            </GridCell>
          </GridRow>
        </Grid>
        <div style={{ textAlign: 'left', padding: '0rem 0rem'}}>
          <Grade {...this.props}/>
        </div>
      </div>
    </>
    );
  }
}

export default InfoPage;
