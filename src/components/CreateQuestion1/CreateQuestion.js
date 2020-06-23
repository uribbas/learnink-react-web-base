import React from 'react';
import {
  NavLink,
} from "react-router-dom";
import Latex from 'react-latex';

import firebase from '../../provider/database';
import QuestionAssistance from './QuestionAssistance';
import Preview from './Preview';
// material UI
import { Select } from '@rmwc/select';
import { Grid, GridCell, GridRow } from '@rmwc/grid';
import { TextField } from '@rmwc/textfield';
import { Button } from '@rmwc/button';
import { Typography } from '@rmwc/typography';
// import { SimpleDialog } from '@rmwc/dialog';
// Material UI style
import '@rmwc/select/styles';
import '@rmwc/grid/styles';
import '@rmwc/textfield/styles';
import '@rmwc/button/styles';
import '@rmwc/typography/styles';
// import '@rmwc/dialog/styles';
// Katex css
import 'katex/dist/katex.min.css'

class CreateQuestion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // TBA
      savedSuccessfully: false,
      showPreview: false,
      id: null,
      question:{
        gradeId: '',
        subjectId: '',
        chapterId: '',
        difficulty: '',
        type: 'STANDARD',
        question:{text:''},
        answer: { mcqA: '', mcqB: '', mcqC: '', mcqD: '',},
        timeTosolve: 30,
        allotedMarks: 1.0,
        stats:{ correctCount:0, wrongCount:0, skipCount:0},
        assistance:{},
      },
      hints:[
        {
          hint:'This is the default entry to start assistive solving',
          answer:'not applicable',
          isCorrectFeedback:'',
          isWrongFeedback:'',
          isCorrectStep:'',
          isWrongStep:''
        },
      ],
    };
    console.log("State and props", this.props, this.state);
    this.setComponentProps = this.props.setComponentProps;

  }

  componentDidMount(){
    this.populateQuestionFields(this.props.question, this.props.id);
  }

  addHint = e =>{
    // TBA
    let {hints} = this.state;
    hints.push({hint:'',answer:'',isCorrectFeedback:'',isWrongFeedback:'',isCorrectStep:'',isWrongStep:''});
    this.setState({hints});
    console.log("hints", this.state.hints);
  }

  removeHint = (e, index) =>{
    // TBA
    if(index>0){
      let {hints} = this.state;
      hints.splice(index,1);
      hints=hints.map((h,i)=>{
          if(h.isCorrectStep > index){ h.isCorrectStep-=1;}
          if(h.isWrongStep > index){ h.isWrongStep-=1;}
          return h;
        });
      this.setState({hints},
        ()=>{console.log("Revised hints", this.state.hints)});
    }

    console.log("ouside hints", this.state.hints);
  }

  togglePreview = e => {
    e.preventDefault();
    let {showPreview} = this.state;
    showPreview=!showPreview;
    this.setState({showPreview});
    console.log("Data of the state", this.state.question.question.text);
  }
  onFieldChange = (e, fieldName, index) =>{
    let {hints} = this.state;
    hints[index][fieldName] = e.target.value;
    this.setState(hints);
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

  populateQuestionFields(q,id){
    let {question, hints} = this.state;
    Object.assign(question,q);
    if(q.assistance) {
      hints=[];
      Object.keys(question.assistance).forEach((h,i)=>{
                hints.push({...question.assistance[h]});
              });
    }

    console.log("hints",hints);
    this.setState({hints,question,id});
  }

  addQuestion = e => {
    e.preventDefault();
    const db = firebase.firestore();

    let {hints, question, id} = this.state;
    hints.forEach((h,i)=>{
              question.assistance[i.toString()] = {...h};
            });
    // Object.assign(question, chapter);
    console.log("final structure of question", question);
    // create the question
    if(id){
      db.collection("questions").doc(id)
      .set(question)
      .then(()=>{
        this.setState({showPreview: false, savedSuccessfully: true});
        // alert('Question has been updated successfully');
      })
      .catch((error)=>{
        alert('Question coulnot be saved. Please check the error: ' + error.toString());
      });
    } else {
      db.collection("questions")
      .add(question)
      .then(() => {
          let showPreview = false;
          let savedSuccessfully = true;
          let question = {
            gradeId: this.state.question.gradeId,
            subjectId: this.state.question.subjectId,
            chapterId: this.state.question.chapterId,
            difficulty: '',
            type: 'STANDARD',
            question:{text:''},
            answer: { mcqA: '', mcqB: '', mcqC: '', mcqD: '',},
            timeTosolve: 30,
            allotedMarks: 1.0,
            stats:{ correctCount:0, wrongCount:0, skipCount:0},
            assistance:{},
          };
          let hints = [
            {
              hint:'This is the default entry to start assistive solving',
              answer:'not applicable',
              isCorrectFeedback:'',
              isWrongFeedback:'',
              isCorrectStep:'',
              isWrongStep:''
            },
          ];
        // reset entire form
        this.setState({showPreview, question, hints, savedSuccessfully});
        // alert('Question has been created successfully');
        console.log("Question has been created successfully"); // array of cities objects
      })
      .catch((error)=>{
        alert('Question coulnot be saved. Please check the error: ' + error.toString());
      });
    }
  };
  render() {
    let {question} = this.state;
    return (
      <div >
        {
          !this.state.showPreview && !this.state.savedSuccessfully &&
          <form  onSubmit={this.togglePreview}>
            <GridRow>
              <GridCell span={1}>
                <NavLink to="/question-list" style={{textDecorationLine: 'none'}}>
                  <Button type="button" label="back"
                    onClick={()=>{
                          let {gradeId,subjectId,chapterId} = this.state.question;
                          this.setComponentProps({gradeId,subjectId,chapterId});
                        }
                      }
                    />
                </NavLink>
              </GridCell>
            </GridRow>
            <div>
              <br/>
              <span>This is a standard question page</span>
            </div>
            <div style={{padding: '1rem'}}>
              <Grid>
                <GridRow>
                  <GridCell span={2}>
                    <TextField
                      label="Grade"
                      required
                      disabled
                      // enhanced
                      // options={{'3': 'Grade 3','4': 'Grade 4','5': 'Grade 5','6': 'Grade 6'}}
                      value={question.gradeId}
                      // onChange={(e)=>{
                      //   let {question} = this.state;
                      //   question.gradeId = e.target.value;
                      //   this.setState({question});
                      // }}
                    />
                  </GridCell>
                  <GridCell span={2}>
                    <TextField
                      label="Subject"
                      required
                      disabled
                      // enhanced
                      // options={{'EVS': 'EVS','EngLang': 'English Language','Maths': 'Mathematics','Science': 'Science'}}
                      value={question.subjectId}
                      // onChange={(e)=>{
                      //   let {question} = this.state;
                      //   question.subjectId = e.target.value;
                      //   this.setState({question});
                      // }}
                    />
                  </GridCell>
                  <GridCell span={2}>
                    <TextField
                      label="Chapter"
                      required
                      disabled
                      // enhanced
                      // options={{'1': 'Chapter 1','2': 'Chapter 2','3': 'Chapter 3','4': 'Chapter 4','5': 'Chapter 5'}}
                      value={question.chapterId}
                      // onChange={(e)=>{
                      //   let {question} = this.state;
                      //   question.chapterId = e.target.value;
                      //   this.setState({question});
                      // }}
                    />
                  </GridCell>
                  <GridCell span={2}>
                    <Select
                      label="Difficulty Level"
                      required
                      // enhanced
                      options={{'easy': 'Easy','moderate': 'Moderate','difficult': 'Difficult','exceptional': 'Exceptional'}}
                      value={question.difficulty}
                      onChange={(e)=>{
                        let {question} = this.state;
                        question.difficulty = e.target.value;
                        this.setState({question});
                      }}
                    />
                  </GridCell>
                </GridRow>
                <GridRow><div> <br/></div></GridRow>
                <GridRow>
                  <GridCell span={12}>
                    <TextField
                        textarea
                        outlined
                        fullwidth
                        required
                        label="Question..."
                        rows={4}
                        // maxLength={20}
                        characterCount
                        helpText={{
                          persistent: true,
                          validationMsg: true,
                          children: 'The field is required'
                        }}
                        value={question.question.text}
                        onChange={(e)=>{
                          let {question} = this.state;
                          question.question.text = e.target.value;
                          this.setState({question});
                        }}
                      />
                    </GridCell>
                    <GridCell span={12} style={{textAlign:'left'}}>
                    {
                      question.question.text &&
                      this.textFieldPreview(question.question.text)
                    }
                    </GridCell>
                  </GridRow>
                  <GridRow><div> <br/></div></GridRow>
                  <GridRow>
                    <GridCell span={2}>
                      <TextField required label="Answer..."
                        value={question.answer.mcqA}
                        onChange={(e)=>{
                          let {question} = this.state;
                          question.answer.mcqA=e.target.value;
                          this.setState({question});
                        }}
                      />
                    </GridCell>
                    <GridCell span={2}>
                      <TextField label="mcq option2..."
                        value={question.answer.mcqB}
                        onChange={(e)=>{
                          let {question} = this.state;
                          question.answer.mcqB=e.target.value;
                          this.setState({question});
                        }}
                      />
                    </GridCell>
                    <GridCell span={2}>
                      <TextField label="mcq option3..."
                        value={question.answer.mcqC}
                        onChange={(e)=>{
                          let {question} = this.state;
                          question.answer.mcqC=e.target.value;
                          this.setState({question});
                        }}
                      />
                    </GridCell>
                    <GridCell span={2}>
                      <TextField label="mcq opton4..."
                        value={question.answer.mcqD}
                        onChange={(e)=>{
                          let {question} = this.state;
                          question.answer.mcqD=e.target.value;
                          this.setState({question});
                        }}
                      />
                    </GridCell>
                </GridRow>
              </Grid>
            </div>
            <div> <br/></div>
            <QuestionAssistance
              hints={this.state.hints}
              addHint={this.addHint}
              onFieldChange={this.onFieldChange}
              removeHint={this.removeHint}
            />
            <Button type="submit" label="preview" unelevated />
            <div><br/></div>
            {/* <button type="submit">Submit</button> */}
          </form>
        }
        {
          this.state.showPreview && !this.state.savedSuccessfully &&
          <div>
            <Preview
              question={this.state.question}
              hints={this.state.hints}
            />
            <div >
              <Button type="button" label="back" onClick={this.togglePreview}/>
              <Button type="button" label="Submit question" unelevated onClick={this.addQuestion}/>
              <div><br/></div>
            </div>
          </div>
        }
        {
          this.state.savedSuccessfully &&
          <Grid>
            <GridRow>
              <GridCell span={12}>
                <Typography
                  use="headline6"
                  // tag="div"
                  theme="textSecondaryOnBackground"
                >
                    Question saved successfully.
                </Typography>
              </GridCell>
              <GridCell span={12}>
                <NavLink to="/question-list" style={{textDecorationLine: 'none'}}>
                  <Button type="button" label="back"
                    onClick={()=>{
                          let {gradeId,subjectId,chapterId} = this.state.question;
                          this.setComponentProps({gradeId,subjectId,chapterId});
                        }
                      }
                    />
                </NavLink>
              </GridCell>
              <div><br/></div>
            </GridRow>
          </Grid>
        }
      </div>
        );
      }
}
export default CreateQuestion;
