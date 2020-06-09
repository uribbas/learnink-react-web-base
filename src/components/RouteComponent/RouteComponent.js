import React from 'react';
import DrawerMenu from './DrawerMenu';
import CreateQuestion1 from '../CreateQuestion1/CreateQuestion';
import CreateQuestion2 from '../CreateQuestion2/CreateQuestion';

class RouteComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // TODO
      questionType: 'Standard question',
    };
    this.onClickQuestion = this.onClickQuestion.bind(this);
  }

  onClickQuestion(questionType){
    console.log("clicked questionType", this.state.questionType, questionType);
    this.setState({questionType: questionType});
  }

  render(){
    let {questionType} = this.state;
    console.log("render questionType", this.state.questionType, questionType);
    return (
      <div>
        <div className="drawer">
          <DrawerMenu
            onClickQuestion={this.onClickQuestion}
          />
        </div>
        {
          this.state.questionType == 'Standard question' &&
          <CreateQuestion1 />
        }
        {
          this.state.questionType == 'Match Sides' &&
          <CreateQuestion2 />
        }
      </div>
    );
  }

}

export default RouteComponent;
