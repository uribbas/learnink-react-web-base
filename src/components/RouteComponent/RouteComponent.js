import React from 'react';
import {
  Route,
  HashRouter,
  BrowserRouter,
  Redirect,
} from "react-router-dom";
import firebase, {auth} from '../../provider/database';
import {getUserProfile} from '../../provider/userInfo';
import AppHeader from '../AppHeader/AppHeader';
import InfoPage from '../InfoPage/InfoPage';
import DashBoard from '../DashBoard/DashBoard';
import Grade from '../Grade/Grade';
import Subject from '../Subject/Subject';
import Chapter from '../Chapter/Chapter';
import Question from '../Question/Question';
import Practice from '../Practice/Practice';
import CreateQuestion1 from '../CreateQuestion1/CreateQuestion';
import CreateQuestion2 from '../CreateQuestion2/CreateQuestion';
import MaintainCatalogue from '../MaintainCatalogue/MaintainCatalogue';
import QuestionList from '../QuestionList/QuestionList';

class RouteComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // TODO
      userAuth: null,
      userProfile: null,
      componentProps: {},
      dummy:  false,
    };
    // reference to the AppHeader to provide access of the signin page component from anywhere in the app
    this.aphRef = null;
    // this.setComponentProps = this.setComponentProps.bind(this);
  }

  componentDidMount(){
    auth.onAuthStateChanged(async userAuth => {
      // const user = await generateUserDocument(userAuth);
      console.log("RouterComponent componentDidMount userAuth", userAuth);
      // if(userAuth){
          let userProfile = await getUserProfile(userAuth);
          console.log(" before setstate", userProfile);
          this.setState({ userAuth, userProfile });
          console.log(" after setstate", userProfile);
      // }
    });
  }

  componentDidUpdate = async (prevProps)=>{
    // Typical usage (don't forget to compare props):
    if (this.props !== prevProps) {
      // Add code here
      await auth.onAuthStateChanged(async userAuth => {
        // const user = await generateUserDocument(userAuth);
        console.log("RouterComponent componentDidUpdate userAuth", userAuth);
        // if(userAuth){
            let userProfile = await getUserProfile(userAuth);
            console.log(" before setstate", userProfile);
            this.setState({ userAuth, userProfile });
            console.log(" after setstate", userProfile);
        // }

      });
    }
  }

  // setComponentProps(componentProps){
  //   console.log("shared componentProps", componentProps);
  //   this.setState({componentProps: componentProps});
  // }

  render(){
    let {userAuth, userProfile} = this.state;
    let allRouterProps = {userAuth, userProfile, aphRef: this.aphRef};
    return (
      <HashRouter>
        <div>
          <AppHeader {...allRouterProps} ref={(aph)=>{this.aphRef = aph;}} style={{position: 'absolute', top: '0', left: '0'}}/>
          {
            !userAuth &&
            <Route >
              <Redirect to="/" />
            </Route>
          }
          <Route exact path="/" component={()=>userAuth ? <Redirect to="/dashboard" {...allRouterProps}/> : <InfoPage {...allRouterProps}/>}/>
          <Route path="/dashboard" component={()=><DashBoard {...allRouterProps}/>}/>
          <Route path="/grade" component={()=><Grade {...allRouterProps}/>}/>
          <Route path="/subject" component={()=><Subject {...allRouterProps}/>}/>
          <Route path="/chapter" component={()=><Chapter {...allRouterProps}/>}/>
          <Route path="/question" component={()=><Question {...allRouterProps}/>}/>
          <Route path="/practice" component={()=><Practice {...allRouterProps}/>}/>
          <Route path="/catalogue" component={()=><MaintainCatalogue {...allRouterProps}/>}/>
          <Route path="/standard-question" component={()=><CreateQuestion1 {...allRouterProps}/>}/>
          <Route path="/match-sides" component={()=><CreateQuestion2 {...allRouterProps}/>}/>
          <Route path="/question-list" component={()=><QuestionList {...allRouterProps}/>}/>
        </div>
      </HashRouter>
    );
  }

}

export default RouteComponent;
