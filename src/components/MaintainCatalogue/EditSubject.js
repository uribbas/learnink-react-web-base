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

class EditSubject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subject: {},
    }
    this.gradeId = this.props.gradeId;
    this.subject = this.props.subject;
    this.onShowEdit = this.props.onShowEdit;
  }
  componentDidMount() {
    // Typical usage (don't forget to compare props):
    this.setState({subject: this.subject ? this.subject : {}});
  }

  onSubmit = e => {
    e.preventDefault();
    const db = firebase.firestore();

    let {subject} = this.state;
    Object.assign(subject,{gradeId: this.gradeId,})
    // create the question
    db.collection("subjects")
    .doc(subject.gradeId + "_" + subject.subjectId)
    .set(subject)
    .then(() => {
      alert('Subject has been created/updated successfully');
      console.log("Subject has been created/updated successfully"); // array of cities objects
      this.onShowEdit();
    })
    .catch((error)=>{
      alert('Subject coulnot be saved. Please check the error: ' + error.toString());
    });

  };

  render(){
    let subject = this.state.subject;
    console.log("subject", this.state.subject, this.subject);
    return(
      <div>
        <Typography use="overline">Subject</Typography>
        <form onSubmit={this.onSubmit}>
          <Grid>
            <GridRow>
              <GridCell span={12}>
                <TextField required label="subject Id" style={{width: '33%'}}
                disabled={this.subject}
                value={subject ? subject.subjectId :'' }
                onChange={(e)=>{
                  let {subject} = this.state;
                  subject.subjectId = e.target.value;
                  this.setState({subject});
                }}
                />
              </GridCell>
              <GridCell span={12}>
                <TextField required  label="Title" style={{width: '100%'}}
                value={subject ? subject.subjectName : ''}
                onChange={(e)=>{
                  let {subject} = this.state;
                  subject.subjectName = e.target.value;
                  this.setState({subject});
                }}
                />
              </GridCell>
              <GridCell span={12}>
                <TextField  required textarea rows={5} outlined label="Description" style={{width: '100%'}}
                value={subject ? subject.subjectDescription : ''}
                onChange={(e)=>{
                  let {subject} = this.state;
                  subject.subjectDescription = e.target.value;
                  this.setState({subject});
                }}
                />
              </GridCell>
              <GridCell span={12}>
                <TextField  required label="subject ImageUrl" style={{width: '100%'}}
                value={subject ? subject.subjectImageUrl :''}
                onChange={(e)=>{
                  let {subject} = this.state;
                  subject.subjectImageUrl = e.target.value;
                  this.setState({subject});
                }}
                />
              </GridCell>
                <CardMedia
                  square
                  style={{
                    backgroundImage: 'url(' + subject.subjectImageUrl + ')'
                  }}
                >
                </CardMedia>
              <GridCell span={12}>
                <Button type="button" label="Back" outlined onClick={()=>this.onShowEdit()}/>
                <Button type="submit" label="Sumit" raised />
              </GridCell>
            </GridRow>
          </Grid>
        </form>

      </div>
    );
  }
}

export default EditSubject;
