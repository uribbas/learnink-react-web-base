import React from 'react';
import {
  NavLink,
} from "react-router-dom";
import Logo from '../../assets/icons/learnink-logo_500.png';
import Login from '../../assets/icons/login-black-48dp.svg';
import Science from '../../assets/icons/featured-icon.png';
import SignIn from '../SignIn/SignIn';
// material UI
import {
Grid,
GridRow,
GridCell,
 } from '@rmwc/grid';
 import { Typography } from '@rmwc/typography';
 import { Button } from '@rmwc/button';
 import { IconButton } from '@rmwc/icon-button';
import { TopAppBar, TopAppBarRow, TopAppBarSection, TopAppBarNavigationIcon,
  TopAppBarTitle, TopAppBarActionItem, TopAppBarFixedAdjust } from '@rmwc/top-app-bar';

// material UI style
import '@rmwc/grid/styles';
import '@rmwc/typography/styles';
import '@rmwc/button/styles';
import '@rmwc/icon-button/styles';
import '@rmwc/top-app-bar/styles';

class AppHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openSignIn: false,
      dummy: false,
    }
    this.handleOpenSignIn = this.handleOpenSignIn.bind(this);
    this.topAppBar = this.topAppBar.bind(this);
    this.parentHandler = this.props.parentHandler;
  }

  handleOpenSignIn(openSignIn){
      console.log("handleOpenSignIn", openSignIn, this.state.openSignIn);
      this.setState({openSignIn: openSignIn ? openSignIn : false });
  }

  topAppBar(){
    const {userAuth} = this.props;
    return(
      <div>
      <TopAppBar short style={{background:'#ffffff', color: '#000000',
        boxShadow:'rgba(0, 0, 0, 0.2) 0px 2px 4px -1px, rgba(0, 0, 0, 0.14) 0px 4px 5px 0px, rgba(0, 0, 0, 0.12) 0px 1px 10px 0px',
      }}>
        <TopAppBarRow>
          <TopAppBarSection>
            <NavLink to="/" style={{textDecorationLine: 'none'}}><TopAppBarNavigationIcon icon={Logo}/></NavLink>
            {/* <img src={Logo} style={{marginLeft: '1rem', height: '45px',}}/> */}
            <TopAppBarTitle>
              <Typography use="headline4"
                style={{
                  marginLeft: '0rem',
                  fontWeight: 'bold',
                  // fontFamily: '\'Just Another Hand\''
                }}>
                Learnink
              </Typography>
            </TopAppBarTitle>
          </TopAppBarSection>
          <TopAppBarSection alignEnd>
            {/* <TopAppBarActionItem icon={userAuth ? Science : Login } style={{color: '#000000'}} onClick={()=>{this.handleOpenSignIn(true);}}/> */}
            <TopAppBarActionItem icon={userAuth ? "menu" : Login } style={{color: '#000000'}} onClick={()=>{this.handleOpenSignIn(true);}}/>
          </TopAppBarSection>
        </TopAppBarRow>
      </TopAppBar>
      <TopAppBarFixedAdjust />
      </div>
    );
  }

  render(){
    const {userAuth} = this.props;
    console.log("AppHeader", this.state.openSignIn);
    return(
      <div style={{ textAlign: 'left', margin: '-12px 0', background: '#ffffff'}}>
        {
          this.topAppBar()
        }
        <div className="">
          <SignIn open={this.state.openSignIn} {...this.props} handleOpenSignIn={this.handleOpenSignIn}/>
        </div>
        {/* <Grid style={{}}>
          <GridRow>

            <GridCell phone={3} tablet={7} desktop={11} style={{marginTop: '0px',}}>
              <img src={Logo} style={{height: '45px',}}/>
              <Typography use="headline4" style={{paddingLeft: '1rem', fontWeight: 'bold'}}>
                Learnink
              </Typography>
            </GridCell>
              <div style={{ position: 'absolute', right: '20px', top: '12px'}}>
                {
                  !userAuth &&
                  <Button outlined label={ userAuth ? "Sign out" : "Sign in" } style={{height: '25px', fontSize: '10px',}}
                    onClick={()=>{this.setState({openSignIn: true});}}
                    >
                  </Button>
                }
                {
                  userAuth &&
                  <IconButton icon={Science} style={{border: '1px solid lightgrey', borderRadius: '50%'}}
                    onClick={()=>{this.setState({openSignIn: true});}}
                  />
                }
              </div>
          </GridRow>
        </Grid> */}
      </div>
    );
  }
}

export default AppHeader;
