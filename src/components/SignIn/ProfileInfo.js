import React from 'react';
import {
  NavLink,
  HashRouter
} from "react-router-dom";
import firebase, { auth, db } from '../../provider/database';
import Logo from '../../assets/icons/learnink-logo_500.png';
import Profile from '../../assets/icons/featured-icon.png';
import closeIcon from '../../assets/icons/close-black-48dp.svg';

// material UI
import {
  Grid,
GridRow,
GridCell,
 } from '@rmwc/grid';
 import {
 Card,
 CardMedia,
 CardPrimaryAction,
 CardActions } from '@rmwc/card';
 import { TextField } from '@rmwc/textfield';
import { Button } from '@rmwc/button';
import { Avatar } from '@rmwc/avatar';
import { CircularProgress } from '@rmwc/circular-progress';
import { Select } from '@rmwc/select';

// material UI style
import '@rmwc/grid/styles';
import '@rmwc/textfield/styles';
import '@rmwc/button/styles';
import '@rmwc/avatar/styles';
import '@rmwc/circular-progress/styles';
import '@rmwc/select/styles';
import '@rmwc/card/styles';

import '../../App.css';

class ProfileInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // TODO
      displayMode: 'none',
      userProfile: {
        name: null,
        email: null,
        phoneNumber: null,
        gender: null,
      },
    };
    // this.fetchedProfile = false;
    this.userAuth = this.props.userAuth;
    this.userProfile = this.props.userProfile;
    this.updateProfile = this.updateProfile.bind(this);
    this.getUserProfile = this.getUserProfile.bind(this);
  }

  componentDidMount() {
    // Typical usage (don't forget to compare props):
    console.log("ProfileInfo data componentDidMount", this.state.userProfile.uid, this.props.userAuth, " => ", this.state.displayMode);
    // if (this.props !== prevProps) {
      // Add code here
      // this.userAuth = this.props.userAuth;
      // if(!this.fetchedProfile){
      //   this.fetchedProfile = true;
      this.getUserProfile('none');
      // }
    // }
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    // console.log("ProfileInfo data", this.state, this.props.userAuth, " => ", prevProps.userAuth, this.state.displayMode);
    if (this.props.userAuth !== prevProps.userAuth) {
      // Add code here
      // this.fetchedProfile = false;
      console.log("ProfileInfo data", this.state, this.props.userAuth, " => ", prevProps.userAuth, this.state.displayMode);
    }
    // if(!this.fetchedProfile){
    //   this.fetchedProfile = true;
    //   this.getUserProfile();
    // }
  }

  getUserProfile= (displayMode) => {
    // this.setState({displayMode: 'loader'});
    console.log("userProfile through props", this.userAuth, this.userProfile);
    const { userProfile } = this.props;
    if(!userProfile.name || !userProfile.email || !userProfile.phoneNumber || !userProfile.gender ){
      displayMode = 'editProfile'
    }
    this.setState({userProfile,displayMode: displayMode ? displayMode : 'editProfile'});

    // this.setState({phoneNumber: ''});
  }

  updateProfile(e){
    // TBA
    e.preventDefault();
    let {userProfile} = this.state;
    let newUserProfile = {...userProfile};
    console.log("updateProfile", newUserProfile.id, newUserProfile);
    let id = newUserProfile.id;
    delete newUserProfile.id;
    delete newUserProfile.userCreationTimeStamp;
    Object.assign(newUserProfile,{
                                lastUpdateTimeStamp: new Date(),
                               });
    console.log("updateProfile", id, newUserProfile);
    db.collection("users").doc(id).set(newUserProfile,{merge:true})
      .then(()=>{
        this.setState({displayMode: 'none'});
      })
      .catch((error)=>{
        alert("Error while updating profile data " + error.toSting());
      });
  }



  render(){
    const { displayMode, userProfile } = this.state;
    return (
          <>
            <div style={{margin: '1rem 1rem'}}>
              {
                displayMode == 'loader' &&
                <GridRow>
                  <GridCell span={12}>
                    <CircularProgress size="xlarge" />
                  </GridCell>
                </GridRow>
              }
              {
               displayMode == 'none' &&
               <Card style={{margin: '0rem 1rem', padding: '1rem 2rem', boxShadow: 'none' }}>
               <GridRow style={{top:'30px',}}>
                <GridCell span={12}>
                  <Button raised label="Edit profile" style={{fontSize: '12px', fontWeight: 'bold', width: '100%', justifyContent: 'space-around'}}
                    onClick={()=>{
                      this.setState({displayMode: 'editProfile'},
                                    ()=>{
                                      this.getUserProfile();
                                    });}} type="button"
                    >
                  </Button>
                </GridCell>
                <GridCell span={12}>
                  <Button outlined label="Sign out" style={{fontSize: '12px', fontWeight: 'bold', width: '100%', justifyContent: 'space-around'}}
                    onClick={()=>{this.props.signOut();}} type="button"
                    >
                  </Button>
                </GridCell>
              </GridRow>
            </Card>
              }
              {
                displayMode == 'editProfile' &&
                <form onSubmit={(e)=>this.updateProfile(e)}>
                  <Card style={{margin: '0rem 1rem', padding: '1rem 2rem' }}>
                  <GridRow>
                    {/* <GridCell span={12}>
                      <Avatar src={Profile} size="medium" style={{border: '4px solid rgb(0,0,0,0.0)', backgroundColor: 'rgb(0,0,0,0.08)'}}/>
                    </GridCell> */}
                    <GridCell span={12}>
                      <TextField required fullwidth label="Name..."
                        // disabled={displayMode}
                        value={userProfile.name ? userProfile.name : ''}
                        onChange={(e)=>{
                          let {userProfile} = this.state;
                          userProfile.name = e.target.value;
                          this.setState({userProfile});
                        }}
                      />
                    </GridCell>
                    <GridCell span={12}>
                      <Select
                        label="Gender..."
                        enhanced
                        required
                        options={['Boy', 'Girl', 'None']}
                        value={userProfile.gender}
                        onChange={(e)=>{
                          let {userProfile} = this.state;
                          userProfile.gender = e.target.value;
                          this.setState({userProfile});
                        }}
                      />
                    </GridCell>
                    <GridCell span={12}>
                      <TextField required fullwidth label="Email..."
                        disabled={["google.com","password"].includes(this.userAuth.providerData[0].providerId)}
                        value={userProfile.email ? userProfile.email : ''}
                        onChange={(e)=>{
                          let {userProfile} = this.state;
                          userProfile.email = e.target.value;
                          this.setState({userProfile});
                        }}
                      />
                    </GridCell>
                    {/* <GridCell phone={1} tablet={3} desktop={3}>
                      <TextField required fullwidth label="" type="text"
                        disabled
                        value={"+91"}
                        onChange={(e)=>{
                          // this.setState({countryCode: e.target.value});
                        }}
                      />
                    </GridCell> */}
                    {/* <GridCell phone={3} tablet={5} desktop={9}>
                      <TextField required fullwidth label="Phone number..." type="number"
                        disabled={this.userAuth.providerData[0].providerId == "phone"}
                        value={userProfile.phone.replace("+91",'')}
                        onChange={(e)=>{
                          let {userProfile} = this.state;
                          userProfile.phone = "+91" + e.target.value;
                          this.setState({userProfile});
                        }}
                      />
                    </GridCell> */}
                    <GridCell span={12}>
                      <TextField required fullwidth label="Phone number..." //type="number"
                        disabled={this.userAuth.providerData[0].providerId == "phone"}
                        value={userProfile.phoneNumber ? userProfile.phoneNumber : ''}
                        onChange={(e)=>{
                          let {userProfile} = this.state;
                          userProfile.phoneNumber = e.target.value;
                          this.setState({userProfile});
                        }}
                      />
                    </GridCell>
                    <GridCell span={12}>
                      <Button raised label="Submit" style={{fontSize: '12px', fontWeight: 'bold', width: '100%', justifyContent: 'space-around'}}
                          type="submit"
                        />
                    </GridCell>
                    <GridCell span={12}>
                      <Button outlined label="Cancel" style={{fontSize: '12px', fontWeight: 'bold', width: '100%', justifyContent: 'space-around'}}
                        onClick={()=>{this.setState({displayMode: 'none'})}}
                        type="button"
                        />
                    </GridCell>
                  </GridRow>
                </Card>
              </form>
              }
            </div>
          </>
    );
  }

}

export default ProfileInfo;
