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

class EditChapter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chapter: {},
    }
    this.gradeId = this.props.gradeId;
    this.subjectId = this.props.subjectId;
    this.chapter = this.props.chapter;
    this.onShowEdit = this.props.onShowEdit;
  }
  componentDidMount() {
    // Typical usage (don't forget to compare props):
    this.setState({chapter: this.chapter ? this.chapter : {}});
  }

  onSubmit = e => {
    e.preventDefault();
    const db = firebase.firestore();

    let {chapter} = this.state;
    Object.assign(chapter,{gradeId: this.gradeId, subjectId: this.subjectId})
    // create the question
    db.collection("chapters")
    .doc(chapter.gradeId + "_" + chapter.subjectId + "_" + chapter.chapterId)
    .set(chapter)
    .then(() => {
      alert('Chapter has been created/updated successfully');
      console.log("Chapter has been created/updated successfully"); // array of cities objects
      this.onShowEdit();
    })
    .catch((error)=>{
      alert('Chapter coulnot be saved. Please check the error: ' + error.toString());
    });

  };

  render(){
    let chapter = this.state.chapter;
    console.log("chapter", this.state.chapter, this.chapter);
    return(
      <div>
        <Typography use="overline">chapter</Typography>
        <form onSubmit={this.onSubmit}>
          <Grid>
            <GridRow>
              <GridCell span={12}>
                <TextField required label="chapter Id" style={{width: '33%'}}
                disabled={this.chapter}
                value={chapter ? chapter.chapterId :'' }
                onChange={(e)=>{
                  let {chapter} = this.state;
                  chapter.chapterId = e.target.value;
                  this.setState({chapter});
                }}
                />
              </GridCell>
              <GridCell span={12}>
                <TextField  required label="Title" style={{width: '100%'}}
                value={chapter ? chapter.chapterTitle : ''}
                onChange={(e)=>{
                  let {chapter} = this.state;
                  chapter.chapterTitle = e.target.value;
                  this.setState({chapter});
                }}
                />
              </GridCell>
              <GridCell span={12}>
                <TextField  required textarea rows={5} outlined label="Description" style={{width: '100%'}}
                value={chapter ? chapter.chapterDescription : ''}
                onChange={(e)=>{
                  let {chapter} = this.state;
                  chapter.chapterDescription = e.target.value;
                  this.setState({chapter});
                }}
                />
              </GridCell>
              <GridCell span={12}>
                <TextField required label="chapter ImageUrl" style={{width: '100%'}}
                value={chapter ? chapter.chapterImageUrl :''}
                onChange={(e)=>{
                  let {chapter} = this.state;
                  chapter.chapterImageUrl = e.target.value;
                  this.setState({chapter});
                }}
                />
              </GridCell>
                <CardMedia
                  square
                  style={{
                    backgroundImage: 'url(' + chapter.chapterImageUrl + ')'
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

export default EditChapter;
