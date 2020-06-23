import React from 'react';
import {
  NavLink,
} from "react-router-dom";
import Latex from 'react-latex';

import firebase from '../../provider/database';
// material UI
import { Card, CardMedia, CardPrimaryAction, CardMediaContent, CardActions, CardActionButtons, CardActionButton } from '@rmwc/card';
import { Button } from '@rmwc/button';
import { Typography } from '@rmwc/typography';
import { Grid, GridCell, GridRow } from '@rmwc/grid';
// import { SimpleDialog } from '@rmwc/dialog';
// Material UI style
import '@rmwc/card/styles';
import '@rmwc/button/styles';
import '@rmwc/typography/styles';
import '@rmwc/grid/styles';
// import '@rmwc/dialog/styles';
// Katex css
import 'katex/dist/katex.min.css'

const db = firebase.firestore();

class QuestionList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // TBA
      questions:[],
    };
    this.gradeId = this.props.gradeId;
    this.subjectId = this.props.subjectId;
    this.chapterId = this.props.chapterId;
    this.setComponentProps=this.props.setComponentProps;
  };

  componentDidMount(){
    this.getChapters();
  }

  componentDidUpdate(){
    // this.getChapters();
  }



  getChapters(){
    console.log("questions fetched for : ", this.gradeId, this.subjectId, this.chapterId);
    db.collection("questions")
    .where("gradeId","==",this.gradeId)
    .where("subjectId","==",this.subjectId)
    .where("chapterId","==",this.chapterId)
    .onSnapshot((querySnapshot)=>{
        let questions = [];
        querySnapshot.forEach((doc)=>{
            let data = doc.data();
            let id = doc.id;
            questions.push({id,question: data});
        });
        console.log("questions fetched: ", questions);
        this.setState({questions});
    });
  }

  questionPreview(q){
    let {question} = q;
    return (
      <Card outlined>
        <Typography
          use="caption"
          tag="div"
          style={{ padding: '0.25rem 1rem' }}
          theme="textSecondaryOnBackground"
        >
          {question.type.toUpperCase() + '     ' +
           question.difficulty.toUpperCase()}
        </Typography>
        <NavLink to="/standard-question" style={{textDecorationLine: 'none'}}>
          <CardPrimaryAction
            onClick={()=>this.setComponentProps(q)}
            >
            <div style={{ padding: '0.2rem 1rem' }}>
              <Typography
                use="caption"
                // tag="div"
                theme="textSecondaryOnBackground"
              >
                  <Latex>{ question.question.text }</Latex>
              </Typography>
            </div>
          </CardPrimaryAction>
        </NavLink>
      </Card>
    );
  }

  render() {
    let {questions } = this.state;
    return (
      <div>
        <Grid>
          <GridRow>
            <GridCell span={1}>
              <NavLink to="/" style={{textDecorationLine: 'none'}}>
                <Button type="button" label="back"
                  onClick={()=>{
                        let gradeId = this.gradeId;
                        let subjectId = this.subjectId;
                        let chapterId = this.chapterId;
                        // let {gradeId,subjectId,chapterId} = this.state.questions;
                        this.setComponentProps({gradeId,subjectId,chapterId});
                      }
                    }
                  />
              </NavLink>
            </GridCell>
            <GridCell span={3}>
              <NavLink to="/standard-question" style={{textDecorationLine: 'none'}}>
                <Button type="button" outlined label="Create Question"
                  onClick={()=>{
                        let gradeId = this.gradeId;
                        let subjectId = this.subjectId;
                        let chapterId = this.chapterId;
                        let id=null;
                        let question = {id, question:{gradeId,subjectId,chapterId}}
                        // let {gradeId,subjectId,chapterId} = this.state.questions;
                        this.setComponentProps({...question});
                      }
                    }
                  />
              </NavLink>
            </GridCell>
          </GridRow>
        </Grid>

        <div style={{textAlign:'left', textOverflow: 'ellipsis'}}>
          {
            questions.map((q,i)=>this.questionPreview(q))
          }
        </div>
      </div>
      );
  }
}
export default QuestionList;
