import React from 'react';
import firebase, {storage, auth } from '../../provider/database';
import {replaceImageWithUrl} from '../../provider/question';
// import Latex from 'react-latex';
import Latex from '../../provider/latex';

import LatexBuilder from '../LatexBuilder/LatexBuilder';

import Upload from '../../assets/icons/publish-black-48dp.svg';
import closeIcon from '../../assets/icons/close-black-48dp.svg';
import Loader from '../../assets/icons/loader.gif';
import Logo from '../../assets/icons/learnink-logo_500.png';
import Hint from '../../assets/icons/live_help-black-48dp.svg';
import correctFeeddback from '../../assets/icons/grading-black-48dp.svg';
import wrongFeeddback from '../../assets/icons/feedback-black-48dp.svg';
import addQuestion from '../../assets/icons/add-black-48dp.svg';
import Delete from '../../assets/icons/remove-black-48dp.svg';


// material UI

import { Card, CardMedia, CardPrimaryAction, CardMediaContent, CardActions, CardActionButtons, CardActionButton } from '@rmwc/card';
import { Typography } from '@rmwc/typography';
import { Fab } from '@rmwc/fab';
import { Select } from '@rmwc/select';
import { Grid, GridCell, GridRow } from '@rmwc/grid';
import { TextField } from '@rmwc/textfield';
import { Button } from '@rmwc/button';
import { CircularProgress } from '@rmwc/circular-progress';
import { TabBar, Tab } from '@rmwc/tabs';
import {Icon} from '@rmwc/icon';
import { IconButton } from '@rmwc/icon-button';
import {List, ListDivider} from '@rmwc/list';

// material UI style
import '@rmwc/card/styles';
import '@rmwc/typography/styles';
import '@rmwc/fab/styles';
import '@rmwc/select/styles';
import '@rmwc/grid/styles';
import '@rmwc/textfield/styles';
import '@rmwc/button/styles';
import '@rmwc/circular-progress/styles';
import '@rmwc/tabs/styles';
import '@rmwc/icon/styles';
import '@rmwc/icon-button/styles';
import '@rmwc/list/styles';
// Katex css
import 'katex/dist/katex.min.css'

const db = firebase.firestore();

class QuestionAssistanceModerator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 0,
      activeAssistTab: 0,
      question: null,
      loader: false,
    }
    this.tref = null;
    this.mcqtref = null;
    this.hinttref = null;
    this.question = this.props.question;
    this.qdData = this.props.qdData;
    this.onClickClose = this.props.onClickClose;
    this.onClickCancel = this.props.onClickCancel;
    // this.addQuestion = this.addQuestion.bind(this);
    // this.replaceImageWithUrl = this.replaceImageWithUrl.bind(this);
  }
  componentDidMount() {
    // Typical usage (don't forget to compare props):
    console.log("EditStandardQuestion componentDidMount",this.props.question)
    this.question = this.props.question;
    this.qdData = this.props.qdData;
    this.setState({editMode: true , qdData: this.qdData, question: this.question ? {...this.question} : {}});
  }

  componentDidUpdate(prevProps){
    console.log("EditStandardQuestion componentDidUpdate")
    if(this.props.question !== prevProps.question){
      console.log("EditStandardQuestion componentDidUpdate inside if",this.props.question)
      this.question = this.props.question;
      this.qdData = this.props.qdData;
      this.setState({editMode: true , qdData: this.qdData, question: this.question ? {...this.question} : {}});
    }
  }

  // replaceImageWithUrl(text){
  //   const {question} = this.state;
  //   let preview = text;
  //   question.photos.forEach(p=>{
  //     let newImgTxt = p.url ? ("img src='" + p.url + "'") : ("img src='" + p.preview + "'");
  //     preview = preview.replace(new RegExp(p.name,'g'),newImgTxt );
  //     // console.log("Preview process ", p.name, newImgTxt, preview, preview=="<"+p.name+"\\/>");
  //   })
  //   return preview;
  // }

  removeStep = (e, index) =>{
    // TBA
    if(index>0){
      let {question} = this.state;
      delete question.assistance[index];
      Object.keys(question.assistance).forEach((k,i)=>{
          let h = {};
          if(k > index){
            h = {...question.assistance[k]};
            let newKey = (parseInt(k,10) - 1).toString();
            question.assistance[newKey] = h;
            delete question.assistance[k];
          } else {
            h = question.assistance[k];
          }
          // correct step check
          if(h.isCorrectStep == index)
          { h.isCorrectStep='';}
          else if(h.isCorrectStep > index)
          { h.isCorrectStep-=1;}
          // wrongStep check
          if(h.isWrongStep == index)
          { h.isWrongStep='';}
          else if(h.isWrongStep > index)
          { h.isWrongStep-=1;}
        });
      let lastStep = question.assistance[(Object.keys(question.assistance).length -1).toString()];
      lastStep.isCorrectStep=-1;
      lastStep.isWrongStep=-1;
      this.setState({question,activeAssistTab: 0});
    }
  }

  latexbuilderCallback(text ,ref){
    // console.log("Inside latexbuilder", ref);
    if (ref.selectionStart || ref.selectionStart == '0') {
        var startPos = ref.selectionStart;
        var endPos = ref.selectionEnd;
        ref.value = ref.value.substring(0, startPos)
            + text
            + ref.value.substring(endPos, ref.value.length);
        ref.selectionStart = startPos + text.length;
        ref.selectionEnd = ref.selectionStart;
    } else {
        ref.value += text;
    }
    // ref.start = ref.start +  text.length + 1;
    // ref.end = ref.start + 1;
    // field is reference so value should replace the value of the
    ref.focus();
    return ref.value;
  }

  renderAssistance(){
    const {question, focusField, loader} = this.state;
    console.log("view question", question, this.question);
    if(!question){
      return <></>
    }
    if(loader){
      return(
        <div style={{textAlign: 'center'}}>
            <img src={Loader} style={{padding: '15% 0'}}/>
        </div>);
    }
    return (
      <div>
          <GridRow>
            <GridCell phone={4} tablet={8} desktop={12}
              style={{paddingTop: '0.4rem', paddingBottom: '0.4rem', paddingRight: '0.5rem'}}
              >
              <TabBar
                activeTabIndex={this.state.activeAssistTab}
                onActivate={evt =>this.setState({activeAssistTab: evt.detail.index})}
                >
                  {
                    Object.keys(question.assistance).map(k=>{
                      return <Tab key={"Step" + k } type="button">{ k }</Tab>
                    })
                  }
              </TabBar>
              <GridRow>
                <GridCell phone={1} tablet={1} desktop={1}>
                  <Button disabled icon={Hint}/>
                </GridCell>
                <GridCell phone={3} tablet={7} desktop={11}>
                  <Typography use="caption" tag="div" style={{marginTop: '0.6rem', padding: '0.2rem 1rem', background: '#f5f5f56e', }}>
                    <TextField
                        disabled = {this.state.activeAssistTab==0}
                        textarea
                        // outlined
                        fullwidth
                        required
                        label="Hint..."
                        rows={2}
                        // maxLength={20}
                        characterCount
                        helpText={{
                          persistent: true,
                          validationMsg: true,
                          children: 'The field is required'
                        }}
                        inputRef={(inputRef)=>{this.hinttref=inputRef;}}
                        value={question.assistance[this.state.activeAssistTab].hint}
                        onFocus={(e)=>{
                          this.setState({focusField: 'hinttref'});
                        }}
                        onChange={(e)=>{
                          let {question} = this.state;
                          question.assistance[this.state.activeAssistTab].hint = e.target.value;
                          // let mcqtref = {value: e.target.value, start: e.target.selectionStart,end: e.target.selectionEnd};
                          this.setState({question,
                            // tref
                          });
                        }}
                      />
                      {
                        focusField == 'hinttref' &&
                        <LatexBuilder
                          question={question}
                          replaceTextHandler={(oldText,newText, question)=>{
                            if(!question){
                              let {question} = this.state;
                            }
                            let hint = question.assistance[this.state.activeAssistTab].hint;
                            hint = hint.replace(new RegExp(oldText,'g'),newText );
                            question.assistance[this.state.activeAssistTab].hint = hint;
                            // this.tref.focus();
                            this.setState({question});
                          }}
                          parentHandler={(text)=>{
                            let {question} = this.state;
                            let hint = this.latexbuilderCallback(text, this.hinttref);
                            question.assistance[this.state.activeAssistTab].hint = hint;
                            // this.mcqtref.focus();
                            this.setState({question});
                          }}
                        />
                      }
                    <Latex trust={true} >{replaceImageWithUrl(question.assistance[this.state.activeAssistTab].hint,
                                                              question.photos)}</Latex>
                  </Typography>
                  <Typography use="caption" tag="div" style={{marginTop: '0.6rem', padding: '0.2rem 1rem', background: '#f5f5f56e' }}>
                    <TextField
                        disabled = {this.state.activeAssistTab==0}
                        textarea
                        // outlined
                        fullwidth
                        required
                        label="Answer..."
                        rows={2}
                        // maxLength={20}
                        characterCount
                        helpText={{
                          persistent: true,
                          validationMsg: true,
                          children: 'The field is required'
                        }}
                        inputRef={(inputRef)=>{this.hintanstref=inputRef;}}
                        value={question.assistance[this.state.activeAssistTab].answer}
                        onFocus={(e)=>{
                          this.setState({focusField: 'hintanstref'});
                        }}
                        onChange={(e)=>{
                          let {question} = this.state;
                          question.assistance[this.state.activeAssistTab].answer = e.target.value;
                          // let mcqtref = {value: e.target.value, start: e.target.selectionStart,end: e.target.selectionEnd};
                          this.setState({question,
                            // tref
                          });
                        }}
                      />
                      {
                        focusField == 'hintanstref' &&
                        <LatexBuilder
                          question={question}
                          replaceTextHandler={(oldText,newText, question)=>{
                            if(!question){
                              let {question} = this.state;
                            }
                            let hint = question.assistance[this.state.activeAssistTab].hint;
                            hint = hint.replace(new RegExp(oldText,'g'),newText );
                            question.assistance[this.state.activeAssistTab].hint = hint;
                            // this.tref.focus();
                            this.setState({question});
                          }}
                          parentHandler={(text)=>{
                            let {question} = this.state;
                            let ans = this.latexbuilderCallback(text, this.hintanstref);
                            question.assistance[this.state.activeAssistTab].hint = ans;
                            // this.mcqtref.focus();
                            this.setState({question});
                          }}
                        />
                      }
                    <Latex trust={true} >{replaceImageWithUrl(question.assistance[this.state.activeAssistTab].answer,
                                                              question.photos)}</Latex>
                  </Typography>
                </GridCell>
                <GridCell phone={1} tablet={1} desktop={1}>
                  <Button disabled icon={correctFeeddback}/>
                  <TextField required label="Goto..." type="number"
                      disabled={this.state.activeAssistTab == Object.keys(question.assistance).length-1 }
                      style={{padding:'0', marginLeft:'0.3rem', marginRight: '-0.7rem'}}
                      value={question.assistance[this.state.activeAssistTab].isCorrectStep}
                      onChange={(e)=>{
                        let {question} = this.state;
                        question.assistance[this.state.activeAssistTab].isCorrectStep = e.target.value;
                        this.setState({question});
                      }}
                    />
                </GridCell>
                <GridCell phone={3} tablet={7} desktop={11}>
                  <Typography use="caption" tag="div" style={{padding: '0.2rem 1rem', background: '#f5f5f56e' }}>
                    <TextField
                        textarea
                        // outlined
                        fullwidth
                        required
                        label="Feedback for correct answer..."
                        rows={2}
                        // maxLength={20}
                        characterCount
                        helpText={{
                          persistent: true,
                          validationMsg: true,
                          children: 'The field is required'
                        }}
                        inputRef={(inputRef)=>{this.correctFeedbacktref=inputRef;}}
                        value={question.assistance[this.state.activeAssistTab].isCorrectFeedback}
                        onFocus={(e)=>{
                          this.setState({focusField: 'correctFeedbacktref'});
                        }}
                        onChange={(e)=>{
                          let {question} = this.state;
                          question.assistance[this.state.activeAssistTab].isCorrectFeedback = e.target.value;
                          // let mcqtref = {value: e.target.value, start: e.target.selectionStart,end: e.target.selectionEnd};
                          this.setState({question,
                            // tref
                          });
                        }}
                      />
                      {
                        focusField == 'correctFeedbacktref' &&
                        <LatexBuilder
                          question={question}
                          replaceTextHandler={(oldText,newText, question)=>{
                            if(!question){
                              let {question} = this.state;
                            }
                            let answer = question.assistance[this.state.activeAssistTab].isCorrectFeedback;
                            answer = answer.replace(new RegExp(oldText,'g'),newText );
                            question.assistance[this.state.activeAssistTab].isCorrectFeedback = answer;
                            // this.tref.focus();
                            this.setState({question});
                          }}
                          parentHandler={(text)=>{
                            let {question} = this.state;
                            let feedback = this.latexbuilderCallback(text, this.correctFeedbacktref);
                            question.assistance[this.state.activeAssistTab].isCorrectFeedback = feedback;
                            // this.mcqtref.focus();
                            this.setState({question});
                          }}
                        />
                      }
                    <Latex trust={true} >{replaceImageWithUrl(question.assistance[this.state.activeAssistTab].isCorrectFeedback,
                                                              question.photos)}</Latex>
                  </Typography>
                </GridCell>
                <GridCell phone={1} tablet={1} desktop={1}>
                  <Button disabled icon={wrongFeeddback}/>
                  <TextField required label="Goto..." type="number"
                      disabled={this.state.activeAssistTab == Object.keys(question.assistance).length-1 }
                      style={{padding:'0', marginLeft:'0.3rem', marginRight: '-0.7rem'}}
                      value={question.assistance[this.state.activeAssistTab].isWrongStep}
                      onChange={(e)=>{
                        let {question} = this.state;
                        question.assistance[this.state.activeAssistTab].isWrongStep = e.target.value;
                        this.setState({question});
                      }}
                    />
                </GridCell>
                <GridCell phone={3} tablet={7} desktop={11}>
                  <Typography use="caption" tag="div" style={{padding: '0.2rem 1rem', background: '#f5f5f56e' }}>
                    <TextField
                        textarea
                        // outlined
                        fullwidth
                        required
                        label="Feedback for wrong answer..."
                        rows={2}
                        // maxLength={20}
                        characterCount
                        helpText={{
                          persistent: true,
                          validationMsg: true,
                          children: 'The field is required'
                        }}
                        inputRef={(inputRef)=>{this.wrongFeedbacktref=inputRef;}}
                        value={question.assistance[this.state.activeAssistTab].isWrongFeedback}
                        onFocus={(e)=>{
                          this.setState({focusField: 'wrongFeedbacktref'});
                        }}
                        onChange={(e)=>{
                          let {question} = this.state;
                          question.assistance[this.state.activeAssistTab].isWrongFeedback = e.target.value;
                          // let mcqtref = {value: e.target.value, start: e.target.selectionStart,end: e.target.selectionEnd};
                          this.setState({question,
                            // tref
                          });
                        }}
                      />
                      {
                        focusField == 'wrongFeedbacktref' &&
                        <LatexBuilder
                          question={question}
                          replaceTextHandler={(oldText,newText, question)=>{
                            if(!question){
                              let {question} = this.state;
                            }
                            let answer = question.assistance[this.state.activeAssistTab].isWrongFeedback;
                            answer = answer.replace(new RegExp(oldText,'g'),newText );
                            question.assistance[this.state.activeAssistTab].isWrongFeedback = answer;
                            // this.tref.focus();
                            this.setState({question});
                          }}
                          parentHandler={(text)=>{
                            let {question} = this.state;
                            let feedback = this.latexbuilderCallback(text, this.wrongFeedbacktref);
                            question.assistance[this.state.activeAssistTab].isWrongFeedback = feedback;
                            // this.mcqtref.focus();
                            this.setState({question});
                          }}
                        />
                      }
                    <Latex trust={true} >{replaceImageWithUrl(question.assistance[this.state.activeAssistTab].isWrongFeedback,
                                                              question.photos)}</Latex>
                  </Typography>
                </GridCell>
              </GridRow>
            </GridCell>
          </GridRow>
        <CardActions>
          <CardActionButtons>
            <CardActionButton type="button"
              icon={addQuestion}
              onClick={()=>{
                let {question} = this.state;
                let presentlastStep = question.assistance[(Object.keys(question.assistance).length -1).toString()];
                presentlastStep.isCorrectStep=null;
                presentlastStep.isWrongStep=null;
                let assistance = {
                                  hint: '',
                                  answer: '',
                                  howToChekAnswer: null,
                                  isCorrectFeedback: '',
                                  isWrongFeedback: '',
                                  isCorrectStep:-1,
                                  isWrongStep:-1,
                                };
                let step = Object.keys(question.assistance).length;
                question.assistance[step.toString()]= assistance;
                this.setState({question});
              }}>Step</CardActionButton>
              <CardActionButton type="button"
                icon={Delete}
                disabled={this.state.activeAssistTab==0}
                onClick={(e)=>this.removeStep(e,this.state.activeAssistTab)}
              >Step</CardActionButton>
              {
                this.props.actions.map(a=>a)
              }
          </CardActionButtons>
        </CardActions>
      </div>
    );
  }

  render(){
    const {question} = this.state;
    console.log("renderAssistance Origin", this.props.origin);
    if(!question){
      return (<></>);
    }
    if(this.state.loader){
      return(
        <div style={{textAlign: 'center'}}>
          <img src={Loader} style={{padding: '10% 0'}}/>
        </div>);
    }
    return(
      <div>
        {
          this.renderAssistance()
        }
      </div>
    );
  }
}

export default QuestionAssistanceModerator;
