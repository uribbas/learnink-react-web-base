import React from 'react';
import firebase from '../../provider/database';
import QuestionAssistance from './QuestionAssistance';
import Preview from './Preview';
// material UI
import { Select } from '@rmwc/select';
import { Grid, GridCell, GridRow } from '@rmwc/grid';
import { TextField } from '@rmwc/textfield';
import { Button } from '@rmwc/button';
// import { SimpleDialog } from '@rmwc/dialog';
// Material UI style
import '@rmwc/select/styles';
import '@rmwc/grid/styles';
import '@rmwc/textfield/styles';
import '@rmwc/button/styles';
// import '@rmwc/dialog/styles';

class CreateQuestion extends React.Component {
  constructor() {
    super();
    this.state = {
      // TBA
      showPreview: false,
      chapter:{
        gradeId: '',
        subjectId: '',
        chapterId: '',
        // summary: { easy: 0, moderate: 0, difficult: 0, exceptional: 0},
      },
      question:{
        difficulty: '',
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

  addQuestion = e => {
    e.preventDefault();
    const db = firebase.firestore();

    let {hints, chapter, question} = this.state;
    hints.forEach((h,i)=>{
              question.assistance[i.toString()] = {...h};
            });
    Object.assign(question, chapter);
    console.log("final structure of question", question);
    // create the question
    db.collection("questions")
    .add(question)
    .then(() => {
        let showPreview = false;
        let chapter = {
          gradeId: '',
          subjectId: '',
          chapterId: '',
          // summary: { easy: 0, moderate: 0, difficult: 0, exceptional: 0},
        };
        let question = {
          difficulty: '',
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
      this.setState({showPreview, chapter, question, hints});
      alert('Question has been created successfully');
      console.log("Question has been created successfully"); // array of cities objects
    })
    .catch((error)=>{
      alert('Question coulnot be saved. Please check the error: ' + error.toString());
    });

  };
  render() {
    let {question, chapter} = this.state;
    return (
      <div >
        {
          !this.state.showPreview &&
          <form  onSubmit={this.togglePreview}>
            <div>
              <br/>
              <span>This is a simple create question page</span>
            </div>
            <div style={{padding: '1rem'}}>
              <Grid>
                <GridRow>
                  <GridCell span={2}>
                    <Select
                      label="Grade"
                      required
                      // enhanced
                      options={{'3': 'Grade 3','4': 'Grade 4','5': 'Grade 5','6': 'Grade 6'}}
                      value={chapter.gradeId}
                      onChange={(e)=>{
                        let {chapter} = this.state;
                        chapter.gradeId = e.target.value;
                        this.setState({chapter});
                      }}
                    />
                  </GridCell>
                  <GridCell span={2}>
                    <Select
                      label="Subject"
                      required
                      // enhanced
                      options={{'EVS': 'EVS','EngLang': 'English Language','Maths': 'Mathematics','Science': 'Science'}}
                      value={chapter.subjectId}
                      onChange={(e)=>{
                        let {chapter} = this.state;
                        chapter.subjectId = e.target.value;
                        this.setState({chapter});
                      }}
                    />
                  </GridCell>
                  <GridCell span={2}>
                    <Select
                      label="Chapter"
                      required
                      // enhanced
                      options={{'1': 'Chapter 1','2': 'Chapter 2','3': 'Chapter 3','4': 'Chapter 4','5': 'Chapter 5'}}
                      value={chapter.chapterId}
                      onChange={(e)=>{
                        let {chapter} = this.state;
                        chapter.chapterId = e.target.value;
                        this.setState({chapter});
                      }}
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
          this.state.showPreview &&
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
      </div>
        );
      }
}
export default CreateQuestion;
