import React from 'react';
import firebase from '../../provider/database';
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

class HintRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // TBA
      dummy: true,
    };
    this.hint = this.props.hint;
    this.step = this.props.step;
    this.totalSteps = this.props.totalSteps;
    this.onFieldChange = this.props.onFieldChange;
    this.removeHint= this.props.removeHint;
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.hint !== prevProps.hint) {
      this.hint = this.props.hint;
      this.step = this.props.step;
      this.totalSteps = this.props.totalSteps;
      this.onFieldChange = this.props.onFieldChange;
      this.removeHint= this.props.removeHint;
      // force re-render the DOM
      this.setState({dummy: true});
    }
  }

  render() {
    console.log("step and hint", this.step, this.hint.hint);
    return (
      <Grid key={this.step}>
      <GridRow>
        <span>{'Step ' + (this.step + 1)}</span>
        <GridCell span={3}>
          <TextField
              textarea
              outlined
              fullwidth
              required
              disabled={this.step==0}
              label="Assistive Hint..."
              rows={2}
              // maxLength={20}
              characterCount
              helpText={{
                persistent: true,
                validationMsg: true,
                children: 'The field is required'
              }}
              value={this.hint.hint}
              onChange={(e)=>this.onFieldChange(e,'hint',this.step)}
            />
          </GridCell>
          <GridCell span={2}>
            <TextField
                textarea
                outlined
                fullwidth
                required
                label="Feedback if Correct..."
                rows={2}
                // maxLength={20}
                characterCount
                helpText={{
                  persistent: true,
                  validationMsg: true,
                  children: 'The field is required'
                }}
                value={this.hint.isCorrectFeedback}
                onChange={(e)=>this.onFieldChange(e,'isCorrectFeedback',this.step)}
              />
            </GridCell>
            <GridCell span={2}>
              <TextField
                  textarea
                  outlined
                  fullwidth
                  required
                  label="Feedback if Incorrect..."
                  rows={2}
                  // maxLength={20}
                  characterCount
                  helpText={{
                    persistent: true,
                    validationMsg: true,
                    children: 'The field is required'
                  }}
                  value={this.hint.isWrongFeedback}
                  onChange={(e)=>this.onFieldChange(e,'isWrongFeedback',this.step)}
                />
              </GridCell>
          <GridCell span={2}>
            <TextField required label="Answer of Hint..."
              disabled={this.step==0}
              value={this.hint.answer}
              onChange={(e)=>this.onFieldChange(e,'answer',this.step)}
            />
          </GridCell>
          <GridCell span={2}>
            <TextField required label="Next Step if correct..." type="number"
              // disabled={this.totalSteps==this.step+1}
              value={this.hint.isCorrectStep}
              onChange={(e)=>this.onFieldChange(e,'isCorrectStep',this.step)}
            />
          </GridCell>
          <GridCell span={2}>
            <TextField required label="Next Step if wrong..." type="number"
              // disabled={this.totalSteps==this.step+1}
              value={this.hint.isWrongStep}
              onChange={(e)=>this.onFieldChange(e,'isWrongStep',this.step)}
            />
          </GridCell>
          <GridCell span={2}>
            <Button type="button" label="remove"
              danger
              raised
              disabled={this.step==0}
              onClick={(e)=>this.removeHint(e,this.step)}/>
          </GridCell>
      </GridRow>
    </Grid>
    )
  }
}

export default HintRow;
