import React from 'react';
import {
  Route,
  HashRouter
} from "react-router-dom";
import DrawerMenu from './DrawerMenu';
import CreateQuestion1 from '../CreateQuestion1/CreateQuestion';
import CreateQuestion2 from '../CreateQuestion2/CreateQuestion';
import MaintainCatalogue from '../MaintainCatalogue/MaintainCatalogue';
import QuestionList from '../QuestionList/QuestionList';

class RouteComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // TODO
      componentProps: {},
    };
    this.setComponentProps = this.setComponentProps.bind(this);
  }

  setComponentProps(componentProps){
    console.log("shared componentProps", componentProps);
    this.setState({componentProps: componentProps});
  }

  render(){
    let {componentProps} = this.state;
    return (
      <HashRouter>
        <div>
          <div className="drawer">
            <DrawerMenu />
          </div>
          <Route exact path="/" component={()=><MaintainCatalogue {...componentProps} setComponentProps={this.setComponentProps}/>}/>
          <Route path="/standard-question" component={()=><CreateQuestion1 {...componentProps} setComponentProps={this.setComponentProps}/>}/>
          <Route path="/match-sides" component={()=><CreateQuestion2 {...componentProps} setComponentProps={this.setComponentProps}/>}/>
          <Route path="/question-list" component={()=><QuestionList {...componentProps} setComponentProps={this.setComponentProps}/>}/>
          {/* {
            this.state.questionType == 'Standard question' &&
            <CreateQuestion1 />
          }
          {
            this.state.questionType == 'Match Sides' &&
            <CreateQuestion2 />
          }
          {
            this.state.questionType == 'Maintain Catalogue' &&
            <MaintainCatalogue />
          } */}
        </div>
      </HashRouter>
    );
  }

}

export default RouteComponent;
