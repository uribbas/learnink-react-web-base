import React from 'react';
import firebase from '../../provider/database';
import HintRow from './HintRow';
// material UI
import { Select } from '@rmwc/select';
import { Grid, GridCell, GridRow } from '@rmwc/grid';
import { TextField } from '@rmwc/textfield';
import { Button } from '@rmwc/button';
// Material UI style
import '@rmwc/select/styles';
import '@rmwc/grid/styles';
import '@rmwc/textfield/styles';
import '@rmwc/button/styles';

class QuestionAssistance extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // TBA
      dummy: true,
    };
    this.hints = this.props.hints;
    this.addHint = this.props.addHint;
    this.onFieldChange = this.props.onFieldChange;
    this.removeHint = this.props.removeHint;
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.hints !== prevProps.hints) {
      this.hints = this.props.hints;
      this.addHint = this.props.addHint;
      this.onFieldChange = this.props.onFieldChange;
      this.removeHint = this.props.removeHint;
      // force re-render the DOM
      this.setState({dummy: true});
    }
  }

  render() {
    console.log("Inside render for QuestionAssistance",this.hints, this.hints.length);
    return (
      // <form  onSubmit={this.saveHint}>
      <div>
        <div >
          <span>Assistive hints to answer the question</span>
          <br/>
        </div>
        <div style={{padding: '1rem'}}>
            {
              this.hints.map((hint,idx)=>{
                    return <HintRow
                                hint={hint}
                                step={idx}
                                totalSteps={this.hints.length}
                                onFieldChange={this.onFieldChange}
                                removeHint={this.removeHint}
                              />


                  }
              )
            }
        </div>
        <br/>
        <div>
          <Button type="button" label="add hint" outlined onClick={this.addHint}/>
          <div><br/></div>
        </div>
      </div>
    )
  }
}

export default QuestionAssistance;
