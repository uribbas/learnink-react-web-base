import React from 'react';
import {
  NavLink,
  HashRouter
} from "react-router-dom";
import firebase, {db, auth} from '../../provider/database';
import Logo from '../../assets/icons/learnink-logo_500.png';
import closeIcon from '../../assets/icons/close-black-48dp.svg';
import ProfileInfo from './ProfileInfo';
import SignInScreen from './SignInScreen';

// material UI
import {
Grid,
GridRow,
GridCell,
 } from '@rmwc/grid';
import { Drawer, DrawerHeader, DrawerTitle, DrawerSubtitle, DrawerContent } from '@rmwc/drawer';
import { List, ListItem } from '@rmwc/list';
import { Button } from '@rmwc/button';
import { Avatar } from '@rmwc/avatar';

// material UI style
import '@rmwc/grid/styles';
import '@rmwc/drawer/styles';
import '@rmwc/button/styles';
import '@rmwc/avatar/styles';

import '../../App.css';
import './SignIn.css';

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // TODO
      open: this.props.open ? this.props.open : false,
      signInMode: null,
      userAuth: null,
    };
    // this.onClickMenu = this.props.onClickMenu;
    this.signOut = this.signOut.bind(this);
    this.handleOpenSignIn = this.props.handleOpenSignIn;
  }

  componentDidMount(){
    // auth.onAuthStateChanged(async userAuth => {
    //   // const user = await generateUserDocument(userAuth);
    const {userAuth} = this.props;
      console.log("userAuth", userAuth);
      if(userAuth){
          this.setState({ signInMode: 'signedIn', userAuth });
      }

    // });
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props !== prevProps) {
      // Add code here
      const {userAuth} = this.props;
      console.log("componentDidUpdate userAuth", userAuth, this.props);
      this.setState({open: this.props.open ? this.props.open : false, signInMode: userAuth ? 'signedIn' : null, userAuth});
    }
  }

  signOut(){
    // this.onClickMenu(componentProps);
    auth.signOut();
    // this.setState({signInMode: null});
  }

  render(){
    return (
      <div style={{left: 'calc(100% - 100px)', top: '0', position: 'absolute', textAlign: 'center',}}>
        <>
          {/** Make the drawer appear right-to-left */}
          <Drawer
            dir="rtl"
            modal
            open={this.state.open}
            onClose={() => {
              this.setState({open: false});
              this.handleOpenSignIn();
            }}
            style={{ maxWidth: '100%'}}
            className="signIn"
          >
            {/** Set the content back to left-to-right */}
            <DrawerHeader dir="ltr">
              <div  style={{right: '0', top: '0', position: 'absolute', margin: '1rem 1rem'}}>
                {
                  this.state.open &&
                  <img src={closeIcon} style={{width: '20px', cursor: 'pointer'}}
                    onClick={() => {
                      this.setState({open: !this.state.open});
                      this.handleOpenSignIn();
                    }}/>

                }
              </div>
              <img src={Logo} style={{width: '20%',margin: '1rem 1rem', alignSelf: 'center'}}/>
              {
                !this.state.signInMode &&
                <div>
                  <DrawerTitle>Sign In</DrawerTitle>
                  <DrawerSubtitle>Let's start the journey here</DrawerSubtitle>
                </div>
              }
              {
                this.state.signInMode &&
                <DrawerTitle>Hello!</DrawerTitle>
              }
            </DrawerHeader>
            <DrawerContent dir="ltr">
              {
                !this.state.signInMode &&
                <SignInScreen />
              }
              {
                this.state.signInMode=='signedIn' &&
                <ProfileInfo {...this.props} signOut={this.signOut}/>
              }
            </DrawerContent>
          </Drawer>
        </>
      </div>
    );
  }

}

export default SignIn;
