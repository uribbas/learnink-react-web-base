import React from 'react';
import firebase from '../../provider/database';

// material UI
import { Card, CardMedia, CardPrimaryAction, CardMediaContent } from '@rmwc/card';
import { Typography } from '@rmwc/typography';
import { Fab } from '@rmwc/fab';
import { Select } from '@rmwc/select';
import { Grid, GridCell, GridRow } from '@rmwc/grid';
import { TextField } from '@rmwc/textfield';
import { Button } from '@rmwc/button';
// material UI style
import '@rmwc/card/styles';
import '@rmwc/typography/styles';
import '@rmwc/fab/styles';
import '@rmwc/select/styles';
import '@rmwc/grid/styles';
import '@rmwc/textfield/styles';
import '@rmwc/button/styles';

const db = firebase.firestore();

class EditGrade extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      grade: {},
    }
    this.grade = this.props.grade;
    this.onShowEdit = this.props.onShowEdit;
  }
  componentDidMount() {
    // Typical usage (don't forget to compare props):
    this.setState({grade: this.grade ? this.grade : {}});
  }

  onSubmit = e => {
    e.preventDefault();
    const db = firebase.firestore();

    let {grade} = this.state;
    // create the question
    db.collection("grades")
    .doc(grade.gradeId)
    .set(grade)
    .then(() => {
      alert('Grade has been created/updated successfully');
      console.log("Grade has been created/updated successfully"); // array of cities objects
      this.onShowEdit();
    })
    .catch((error)=>{
      alert('Grade coulnot be saved. Please check the error: ' + error.toString());
    });

  };

  render(){
    let grade = this.state.grade;
    console.log("Grade", this.state.grade, this.grade);
    return(
      <div>
        <Typography use="overline">Grade</Typography>
        <form onSubmit={this.onSubmit}>
          <Grid>
            <GridRow>
              <GridCell span={12}>
                <TextField label="Grade Id" style={{width: '25%'}}
                disabled={this.grade}
                value={grade ? grade.gradeId :'' }
                onChange={(e)=>{
                  let {grade} = this.state;
                  grade.gradeId = e.target.value;
                  this.setState({grade});
                }}
                />
              </GridCell>
              <GridCell span={12}>
                <TextField  label="Title" style={{width: '100%'}}
                value={grade ? grade.name : ''}
                onChange={(e)=>{
                  let {grade} = this.state;
                  grade.name = e.target.value;
                  this.setState({grade});
                }}
                />
              </GridCell>
              <GridCell span={12}>
                <TextField  label="Grade ImageUrl" style={{width: '100%'}}
                value={grade ? grade.gradeImageUrl :''}
                onChange={(e)=>{
                  let {grade} = this.state;
                  grade.gradeImageUrl = e.target.value;
                  this.setState({grade});
                }}
                />
              </GridCell>
                <CardMedia
                  square
                  style={{
                    backgroundImage: 'url(' + grade.gradeImageUrl + ')'
                  }}
                >
                </CardMedia>
              <GridCell span={12}>
                <Button label="Back" outlined onClick={()=>this.onShowEdit()}/>
                <Button label="Sumit" raised />
              </GridCell>
            </GridRow>
          </Grid>
        </form>
      </div>
    );
  }
}

export default EditGrade;
