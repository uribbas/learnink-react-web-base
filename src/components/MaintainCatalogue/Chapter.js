import React from 'react';
import firebase from '../../provider/database';
import {
  NavLink,
} from "react-router-dom";
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

class Chapter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chapters:[],
    }
    this.setComponentProps=this.props.setComponentProps;
    this.gradeId = this.props.gradeId;
    this.subjectId = this.props.subjectId;
    this.onSelectSubject = this.props.onSelectSubject;
    this.onShowEdit = this.props.onShowEdit;
    this.getChapters();
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props !== prevProps) {
      this.gradeId = this.props.gradeId;
      this.subjectId = this.props.subjectId;
      // force re-render the DOM
      this.setState({dummy: true},()=>this.getChapters());
    }
  }

  getChapters(){
    console.log("chapters fetched for : ", this.gradeId, this.subjectId);
    db.collection("chapters")
    .where("gradeId","==",this.gradeId)
    .where("subjectId","==",this.subjectId)
    .onSnapshot((querySnapshot)=>{
        let chapters = [];
        querySnapshot.forEach((doc)=>{
            chapters.push(doc.data());
        });
        console.log("chapters fetched: ", chapters);
        this.setState({chapters});
    });
  }

  renderChapter(){
    return this.state.chapters.map((c,i)=>{
      console.log("processing ", c);
      return (
        <GridCell phone={1} desktop={2} tablet={2}>
          <Card style={{ textAlign: 'left'}}>
            <NavLink to="/question-list" style={{textDecorationLine: 'none'}}>
            <CardPrimaryAction
              onClick={()=>this.setComponentProps(c)}
              >
              <CardMedia
                square
                style={{
                  backgroundImage: 'url(' + c.chapterImageUrl + ')'
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
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {c.chapterTitle}
                  </Typography>
                </CardMediaContent>
              </CardMedia>
            </CardPrimaryAction>
            </NavLink>
            <CardActions>
              <CardActionButtons>
                <CardActionButton onClick={()=>{this.onShowEdit("chapter",c)}}>Edit</CardActionButton>
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
                  this.renderChapter()
                }
              </GridRow>
            </GridCell>
          </GridRow>
        </Grid>
      </div>
    );
  }
}

export default Chapter;
