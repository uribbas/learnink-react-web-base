import React from 'react';
import firebase from '../../provider/database';

// material UI
import { Card, CardMedia, CardPrimaryAction, CardMediaContent, CardActions, CardActionButtons, CardActionButton } from '@rmwc/card';
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

class Subject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subjects:[],
    }
    this.gradeId = this.props.gradeId;
    this.onSelectSubject = this.props.onSelectSubject;
    this.onShowEdit = this.props.onShowEdit;
    this.getSubjects();
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.gradeId !== prevProps.gradeId) {
      this.gradeId = this.props.gradeId;
      // force re-render the DOM
      this.setState({dummy: true},()=>this.getSubjects());
    }
  }

  getSubjects(){
    console.log("subjects fetched for grade: ", this.gradeId);
    db.collection("subjects")
    .where("gradeId","==",this.gradeId)
    .onSnapshot((querySnapshot)=>{
        let subjects = [];
        querySnapshot.forEach((doc)=>{
            subjects.push(doc.data());
        });
        console.log("subjects fetched: ", subjects);
        this.setState({subjects});
    });
  }

  renderSubject(){
    return this.state.subjects.map((s,i)=>{
      console.log("processing ", s);
      return (
        <GridCell phone={1} desktop={2} tablet={2}>
          <Card style={{ textAlign: 'left'}}>
            <CardPrimaryAction
              onClick={()=>this.onSelectSubject(s.subjectId)}>
              <CardMedia
                square
                style={{
                  backgroundImage: 'url(' + s.subjectImageUrl + ')'
                }}
              >
                <CardMediaContent>
                  <Typography
                    use="caption"
                    tag="div"
                    theme="textPrimaryOnDark"
                    style={{
                      padding: '0.25rem 0.25rem',
                      backgroundImage:
                        'linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.5) 100%)',
                      bottom: '0',
                      left: '0',
                      right: '0',
                      position: 'absolute',
                      fontWeight: 'bold',
                      color: 'white',
                    }}
                  >
                    {s.subjectId}
                  </Typography>
                </CardMediaContent>
              </CardMedia>
            </CardPrimaryAction>
            <CardActions>
              <CardActionButtons>
                <CardActionButton onClick={()=>{this.onShowEdit("subject",s)}}>Edit</CardActionButton>
              </CardActionButtons>
            </CardActions>
          </Card>
        </GridCell>
      );
    })
  }

  render(){
    return(
      <div>
        <Grid>
          <GridRow>
            <GridCell span={12}>
              <GridRow>
                {
                  this.renderSubject()
                }
              </GridRow>
            </GridCell>
          </GridRow>
        </Grid>
      </div>
    );
  }
}

export default Subject;
