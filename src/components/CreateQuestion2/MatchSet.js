import React from 'react';
import firebase from '../../provider/database';
import MatchRow from './MatchRow';
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

class MatchSet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // TBA
      dummy: true,
    };
    this.matchRows = this.props.matchRows;
    this.onMatchChange = this.props.onMatchChange;
    this.addMatch=this.props.addMatch;
    this.removeMatch = this.props.removeMatch;
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.matchRows !== prevProps.matchRows) {
      this.matchRows= this.props.matchRows;
      this.onMatchChange = this.props.onMatchChange;
      this.addMatch=this.props.addMatch;
      this.removeMatch = this.props.removeMatch;
      // force re-render the DOM
      this.setState({dummy: true});
    }
  }

  render() {
   console.log("Inside render for MatchSet");
    return (
      // <form  onSubmit={this.saveHint}>
      <div>
        <div style={{padding: '1rem'}}>
            {
              this.matchRows.map((matchRow,idx)=>{
                    return <MatchRow
                                MatchRow={matchRow}
                                step={idx}
                                totalSteps={this.matchRows.length}
                                onMatchChange={this.onMatchChange}
                                removeMatch={this.removeMatch}
                              />


                  }
              )
            }
        </div>
        <br/>
        <div>
          <Button type="button" label="add match" outlined onClick={this.addMatch}/>
          <div><br/></div>
        </div>
      </div>
    )
  }
}

export default MatchSet;
