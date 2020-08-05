import React from 'react';
import firebase, {storage, auth } from '../../provider/database';
import {putStorageItem, removeStorageItem, replaceImageWithUrl} from '../../provider/question';
// import Latex from 'react-latex';
import Latex from '../../provider/latex';

import LatexBuilder from '../LatexBuilder/LatexBuilder';
import QuestionAssistanceModerator from '../QuestionAssistance/QuestionAssistanceModerator';

import Upload from '../../assets/icons/publish-black-48dp.svg';
import closeIcon from '../../assets/icons/close-black-48dp.svg';
import Loader from '../../assets/icons/loader.gif';
import Logo from '../../assets/icons/learnink-logo_500.png';
import Hint from '../../assets/icons/live_help-black-48dp.svg';
import correctFeeddback from '../../assets/icons/grading-black-48dp.svg';
import wrongFeeddback from '../../assets/icons/feedback-black-48dp.svg';
import Add from '../../assets/icons/add-black-48dp.svg';
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
import { Checkbox } from '@rmwc/checkbox';

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
import '@rmwc/checkbox/styles';
// Katex css
import 'katex/dist/katex.min.css'

const db = firebase.firestore();

class EditMatchQuestion extends React.Component {
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
    this.addQuestion = this.addQuestion.bind(this);
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

  removeMatch = (e, index) =>{
    // TBA
    if(index>1){
      let {question} = this.state;
      question.answer.splice(index,1);
      this.setState({question,activeTab: index - 1});
    }
  }

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

  addQuestion = async (e) => {
    e.preventDefault();
    const db = firebase.firestore();

    let {question} = this.state;
    this.setState({loader: true});
    // create the question
    let newPhotos = question.photos.filter(p=>p.status=='NEW' && !p.url);
    await Promise.all(newPhotos.map(np=>{
                        // check whether photo is changed
                        let fileExtn = np.raw.name.split('.')[1];
                        // console.log("Raw file name", raw.name, fileExtn, `/images/grade/${grade.gradeId}/gradeImage.${fileExtn}`);
                        let path = `/images/grade/${question.gradeId}/${question.subjectId}/${question.chapterId}/${question.docId}/${np.name}.${fileExtn}`;
                        return putStorageItem(path,np.raw, np);
                  }));
    console.log("new upload photos", newPhotos);
    newPhotos.forEach(np=>{
      let idx =  question.photos.findIndex(ph=>ph.name==np.name);
      let photo = question.photos[idx];
      delete photo.raw;
      delete photo.preview;
      photo.url = np.url;
      photo.status = "EXISTING";
    });
    let deletePhotos = question.photos.filter(p=>p.status=='DELETE' && p.url);

    await Promise.all(deletePhotos.map(np=>{
                        return removeStorageItem(np.url);
                  }));
    deletePhotos.forEach(np=>{
        let idx =  question.photos.findIndex(ph=>ph.name==np.name);
        question.photos.splice(idx,1);
    })
    console.log("Deleted photos", deletePhotos);

    if(question.docId){
      await db.collection("questions").doc(question.docId)
      .set(question)
      .then(()=>{
        this.setState({loader: false});
        this.onClickClose();
        // alert('Question has been updated successfully');
      })
      .catch((error)=>{
        this.setState({loader: false});
        alert('Question coulnot be saved. Please check the error: ' + error.toString());
      });
    } else {
      // New question being added
      // Check whether question ditrubution
      let {qdData} = this.state;
      let sfDocRef = db.collection('questionDistribution').doc(qdData.docId);

      await db.runTransaction((transaction)=> {
            return transaction.get(sfDocRef).then((sfDoc)=> {
                if (!sfDoc.exists) {
                    throw "Document does not exist!";
                }

                let qsequence = sfDoc.data()[question.difficulty] + 1;

                let newQuestiondocId = [question.gradeId, question.subjectId, question.chapterId,question.difficulty,qsequence].join('_');
                let qRef =  db.collection("questions").doc(newQuestiondocId);
                Object.assign(question,{'questionSequenceId': qsequence});
                transaction.set(qRef,question);
                transaction.update(sfDocRef, { [question.difficulty]: qsequence });
                // return true;
                console.log("transaction for add question" );
            });
        }).then(()=>{
            console.log("questionSequenceId increased" );
            this.setState({loader: false});
            this.onClickClose();
        }).catch((err)=> {
            // This will be an "population is too big" error.
            this.setState({loader: false});
            console.error(err);
        });

    }
  };

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

  selectedQuestion(){
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
    <form onSubmit={this.addQuestion}>
      <Card style={{ margin: '0.4rem 0 1rem', padding: '0rem 0rem',border: '1px solid rgb(0,0,0,0.1)',
      // background: 'linear-gradient(40deg, rgb(32, 150, 255), rgb(5, 255, 163))', color: '#ffffff !important'
      }}>
        {/* <CardPrimaryAction
          onClick={()=>{}}
          > */}
            <GridRow>
              <GridCell phone={1} tablet={2} desktop={1}>
                <Typography use="headline6" tap="span" style={{padding: '1rem'}}>
                  {question.questionSequenceId ? question.questionSequenceId : <Button icon={Add} disabled style={{marginLeft: '-1rem'}}/>}
                </Typography>
              </GridCell>
              <GridCell phone={4} tablet={6} desktop={6} style={{marginTop: '1rem', padding: '0.0rem', background: '#f5f5f56e' }}>
                  <TextField
                      textarea
                      // outlined
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
                      inputRef={(inputRef)=>{this.tref=inputRef;}}
                      value={question.question}
                      onFocus={(e)=>{
                        this.setState({focusField: 'tref'});
                      }}
                      onChange={(e)=>{
                        let {question} = this.state;
                        question.question = e.target.value;
                        // let tref = {value: e.target.value, start: e.target.selectionStart,end: e.target.selectionEnd};
                        this.setState({question,
                          // tref
                        });
                      }}
                    />
                    {
                      focusField == 'tref' &&
                      <LatexBuilder
                        question={question}
                        replaceTextHandler={(oldText,newText, question)=>{
                          if(!question){
                            let {question} = this.state;
                          }
                          question.question = question.question.replace(new RegExp(oldText,'g'),newText );
                          // this.tref.focus();
                          this.setState({question});
                        }}
                        parentHandler={(text)=>{
                          let {question} = this.state;
                          let newQuestion = this.latexbuilderCallback(text, this.tref);
                          question.question = newQuestion;
                          // this.tref.focus();
                          this.setState({question});
                        }}
                      />
                    }
                  <Latex trust={true} >{replaceImageWithUrl(question.question, question.photos)}</Latex>
              </GridCell>
              <GridCell phone={4} tablet={8} desktop={5} style={{paddingTop: '0.4rem', paddingBottom: '0.4rem', paddingRight: '0.5rem'}}>
                <TabBar
                  activeTabIndex={this.state.activeTab}
                  onActivate={evt => this.setState({activeTab: evt.detail.index})}
                  >
                    {
                      question.answer.map((k,i)=>{
                        return(
                        <Tab key={"MatchOption" + i } type="button">
                          {"M" + i }
                        </Tab>
                        )
                      })
                    }
                </TabBar>
                <Typography use="caption" tag="div" style={{padding: '1rem 1rem', background: '#f5f5f56e' }}>
                  <TextField
                      textarea
                      // outlined
                      fullwidth
                      required
                      label={'Text ' + this.state.activeTab + "..."}
                      rows={2}
                      // maxLength={20}
                      characterCount
                      helpText={{
                        persistent: true,
                        validationMsg: true,
                        children: 'The field is required'
                      }}
                      inputRef={(inputRef)=>{this.matchTextRef=inputRef;}}
                      value={question.answer[this.state.activeTab].matchText}
                      onFocus={(e)=>{
                        this.setState({focusField: 'matchTextRef'});
                      }}
                      onChange={(e)=>{
                        let {question} = this.state;
                        question.answer[this.state.activeTab].matchText = e.target.value;
                        // let mcqtref = {value: e.target.value, start: e.target.selectionStart,end: e.target.selectionEnd};
                        this.setState({question,
                          // tref
                        });
                      }}
                    />
                    {
                      focusField == 'matchTextRef' &&
                      <LatexBuilder
                        question={question}
                        replaceTextHandler={(oldText,newText, question)=>{
                          if(!question){
                            let {question} = this.state;
                          }
                          let matchText = question.answer[this.state.activeTab].matchText;
                          matchText = matchText.replace(new RegExp(oldText,'g'),newText );
                          question.answer[this.state.activeTab].matchText = matchText;
                          // this.tref.focus();
                          this.setState({question});
                        }}
                        parentHandler={(text)=>{
                          let {question} = this.state;
                          let answer = this.latexbuilderCallback(text, this.matchTextRef);
                          question.answer[this.state.activeTab].matchText = answer;
                          // this.mcqtref.focus();
                          this.setState({question});
                        }}
                      />
                    }
                  <Latex trust={true} >{replaceImageWithUrl(question.answer[this.state.activeTab].matchText, question.photos)}</Latex>
                </Typography>
                <Typography use="caption" tag="div" style={{marginTop: '0.5rem', padding: '1rem 1rem', background: '#f5f5f56e' }}>
                  <TextField
                      textarea
                      // outlined
                      fullwidth
                      required
                      label={'Answer ' + this.state.activeTab + "..."}
                      rows={2}
                      // maxLength={20}
                      characterCount
                      helpText={{
                        persistent: true,
                        validationMsg: true,
                        children: 'The field is required'
                      }}
                      inputRef={(inputRef)=>{this.answerTextRef=inputRef;}}
                      value={question.answer[this.state.activeTab].answerText}
                      onFocus={(e)=>{
                        this.setState({focusField: 'answerTextRef'});
                      }}
                      onChange={(e)=>{
                        let {question} = this.state;
                        question.answer[this.state.activeTab].answerText = e.target.value;
                        // let mcqtref = {value: e.target.value, start: e.target.selectionStart,end: e.target.selectionEnd};
                        this.setState({question,
                          // tref
                        });
                      }}
                    />
                    {
                      focusField == 'answerTextRef' &&
                      <LatexBuilder
                        question={question}
                        replaceTextHandler={(oldText,newText, question)=>{
                          if(!question){
                            let {question} = this.state;
                          }
                          let answer = question.answer[this.state.activeTab].answerText;
                          answer = answer.replace(new RegExp(oldText,'g'),newText );
                          question.answer[this.state.activeTab].answerText = answer;
                          // this.tref.focus();
                          this.setState({question});
                        }}
                        parentHandler={(text)=>{
                          let {question} = this.state;
                          let answer = this.latexbuilderCallback(text, this.answerTextRef);
                          question.answer[this.state.activeTab].answerText = answer;
                          // this.mcqtref.focus();
                          this.setState({question});
                        }}
                      />
                    }
                  <Latex trust={true} >{replaceImageWithUrl(question.answer[this.state.activeTab].answerText, question.photos)}</Latex>
                </Typography>
                <CardActions>
                  <CardActionButtons>

                    <CardActionButton type="button"
                      icon={Add}
                      onClick={()=>{
                        let {question} = this.state;
                        question.answer.push({matchText:'',answerText:'',});
                        this.setState({question});
                      }}>Match</CardActionButton>
                    </CardActionButtons>
                    <CardActionButton type="button"
                        icon={Delete}
                        disabled={this.state.activeTab < 2}
                        onClick={(e)=>this.removeMatch(e,this.state.activeTab)}
                      >Match</CardActionButton>
                  </CardActions>
              </GridCell>
              <GridCell phone={4} tablet={8} desktop={1}>
              </GridCell>
              <GridCell phone={2} tablet={2} desktop={2} style={{margin: '0rem 0.5rem', padding: '0rem',  }}>
                <TextField
                    // outlined
                    // fullwidth
                    required
                    label="Marks..."
                    maxLength={2}
                    characterCount
                    value={question.allotedMarks}
                    onChange={(e)=>{
                      let {question} = this.state;
                      question.allotedMarks = e.target.value;
                      this.setState({question});
                    }}
                  />
              </GridCell>
              <GridCell phone={2} tablet={2} desktop={2} style={{margin: '0rem 0.5rem', padding: '0rem',  }}>
                <TextField
                    // outlined
                    // fullwidth
                    required
                    label="Time(sec)..."
                    maxLength={2}
                    characterCount
                    value={question.timeToSolve}
                    onChange={(e)=>{
                      let {question} = this.state;
                      question.timeToSolve = e.target.value;
                      this.setState({question});
                    }}
                  />
              </GridCell>
              <GridCell phone={4} tablet={4} desktop={6} style={{margin: '0rem 0.5rem', padding:'0rem'}}>
                <Checkbox
                  label="Can be a fill in the blanks question"
                  checked = {question.isFillInTheBlanks}
                  onChange={(e) => {
                                let {question} = this.state;
                                question.isFillInTheBlanks = !!e.currentTarget.checked;
                                this.setState({question});
                              }
                            }
                />
              </GridCell>
            </GridRow>
            <QuestionAssistanceModerator
              {...this.props}
              actions={[
                <CardActionButton type="button" onClick={()=>{this.onClickCancel();}}>Cancel</CardActionButton>,
                  <CardActionButton type="submit"
                    raised
                    >Save</CardActionButton>
              ]}
            />
      </Card>
    </form>
    );
  }

  render(){
    const {question} = this.state;
    console.log("Origin", this.props.origin);
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
          this.selectedQuestion()
        }
      </div>
    );
  }
}

export default EditMatchQuestion;
