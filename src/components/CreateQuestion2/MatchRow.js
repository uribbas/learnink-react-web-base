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

class MatchRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // TBA
      dummy: true,
    };
    this.matchRow=this.props.matchRow;
    this.step = this.props.step;
    this.onMatchChange = this.props.onMatchChange;
    this.removeMatch= this.props.removeMatch;
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.matchRow !== prevProps.matchRow) {
        this.matchRow=this.props.matchRow;
        this.step = this.props.step;
        this.onMatchChange = this.props.onMatchChange;
        this.removeMatch= this.props.removeMatch;
     // force re-render the DOM
      this.setState({dummy: true});
    }
  }

  render() {
   // console.log("step and hint", this.step, this.hint.hint);
    return (
      <Grid key={this.step}>
      <GridRow>
        <GridCell span={2}>
          <Button type="button" label={"Row Match " + (this.step+1)}
          />
        </GridCell>
        <GridCell span={1}>
          <Button type="button" label="remove"
            danger
            raised
            //disabled={this.step==0}
            onClick={(e)=>this.removeMatch(e,this.step)}
          />
        </GridCell>
        <GridCell span={9}></GridCell>
        <GridCell span={3}>
          <TextField
             textarea
              outlined
              fullwidth
              required
              //disabled={this.step==0}
              label="Match Text..."
              //rows={2}
              // maxLength={20}
              characterCount
              helpText={{
                persistent: true,
                validationMsg: true,
                children: 'The field is required'
              }}
              value={this.matchRow.matchText}
              onChange={(e)=>this.onMatchChange(e,'matchText',this.step)}
            />
          </GridCell>
          <GridCell span={3}>
            <TextField
                textarea
                outlined
                fullwidth
                required
                label="Answer Text..."
                //rows={2}
                // maxLength={20}
                characterCount
                helpText={{
                  persistent: true,
                  validationMsg: true,
                  children: 'The field is required'
                }}
                value={this.matchRow.answerText}
                onChange={(e)=>this.onMatchChange(e,'answerText',this.step)}
              />
            </GridCell>
      </GridRow>
    </Grid>
    )
  }
}

export default MatchRow;
