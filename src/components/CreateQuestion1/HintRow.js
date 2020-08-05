import React from 'react';
// import Latex from 'react-latex';
import Latex from '../../provider/latex';

import firebase from '../../provider/database';
// material UI
import { Select } from '@rmwc/select';
import { Grid, GridCell, GridRow } from '@rmwc/grid';
import { TextField } from '@rmwc/textfield';
import { Button } from '@rmwc/button';
import { Typography } from '@rmwc/typography';
// Material UI style
import '@rmwc/select/styles';
import '@rmwc/grid/styles';
import '@rmwc/textfield/styles';
import '@rmwc/button/styles';
import '@rmwc/typography/styles';

// Katex css
import 'katex/dist/katex.min.css'

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

  textFieldPreview(text){
    return (
      <div >
        <Typography use="overline">Preview</Typography>
        <br/>
        <Typography
          use="caption"
          // tag="div"
          theme="textSecondaryOnBackground"
        >
            <Latex>{ text }</Latex>
        </Typography>
      </div>
    );
  }

  render() {
    console.log("step and hint", this.step, this.hint, this.hint.hint);
    return (
      <Grid key={this.step}>
      <GridRow>
        <span>{'Step ' + (this.step + 1)}</span>
        <GridCell span={12}>
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
          <GridCell span={12} style={{textAlign:'left'}}>
          {
            this.hint.hint &&
            this.textFieldPreview(this.hint.hint)
          }
          </GridCell>
          <GridCell span={12}>
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
            <GridCell span={12} style={{textAlign:'left'}}>
            {
              this.hint.isCorrectFeedback &&
              this.textFieldPreview(this.hint.isCorrectFeedback)
            }
            </GridCell>
            <GridCell span={12}>
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
            <GridCell span={12} style={{textAlign:'left'}}>
            {
              this.hint.isWrongFeedback &&
              this.textFieldPreview(this.hint.isWrongFeedback)
            }
            </GridCell>
            <GridCell span={12}>
              <TextField textarea fullwidth outlined required label="Answer of Hint..."
                disabled={this.step==0}
                value={this.hint.answer}
                onChange={(e)=>this.onFieldChange(e,'answer',this.step)}
              />
            </GridCell>
            <GridCell span={12} style={{textAlign:'left'}}>
            {
              this.hint.answer &&
              this.textFieldPreview(this.hint.answer)
            }
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
            <GridCell span={1}>
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
