import React from 'react';
import firebase, {storage, auth } from '../../provider/database';
import Upload from '../../assets/icons/publish-black-48dp.svg';
import closeIcon from '../../assets/icons/close-black-48dp.svg';
import Loader from '../../assets/icons/loader.gif';
import Logo from '../../assets/icons/learnink-logo_500.png';

import ViewStandardQuestion from './ViewStandardQuestion';
import EditStandardQuestion from './EditStandardQuestion';

// material UI

import { Card, CardMedia, CardPrimaryAction, CardMediaContent, CardActions, CardActionButtons, CardActionButton } from '@rmwc/card';
import { Typography } from '@rmwc/typography';
import { Fab } from '@rmwc/fab';
import { Select } from '@rmwc/select';
import { Grid, GridCell, GridRow } from '@rmwc/grid';
import { TextField } from '@rmwc/textfield';
import { Button } from '@rmwc/button';
import { CircularProgress } from '@rmwc/circular-progress';
// material UI style
import '@rmwc/card/styles';
import '@rmwc/typography/styles';
import '@rmwc/fab/styles';
import '@rmwc/select/styles';
import '@rmwc/grid/styles';
import '@rmwc/textfield/styles';
import '@rmwc/button/styles';
import '@rmwc/circular-progress/styles';

const db = firebase.firestore();

class StandardQuestion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      question: null,
      preview: null,
      raw: null,
      loader: false,
      editMode: false,
    }
    this.question = this.props.question;
    this.onAddQuestion = this.props.onAddQuestion;
    this.handleImageAsFile = this.handleImageAsFile.bind(this);
    this.backToQlist = this.props.backToQlist;
  }
  componentDidMount() {
    // Typical usage (don't forget to compare props):
    this.question = this.props.question;
    this.setState({editMode: false , question: this.question ? {...this.question} : {}});
  }

  componentDidUpdate(prevProps){
    if(this.props.question !== prevProps.question){
      this.question = this.props.question;
      this.setState({editMode: false , question: this.question ? {...this.question} : {}});
    }
  }

  onSubmit = e => {
    e.preventDefault();
    const db = firebase.firestore();

    let {question, raw, loader} = this.state;
    if(raw){
      this.setState({loader: true});
      // check whether photo is changed
      let fileExtn = raw.name.split('.')[1];
      // console.log("Raw file name", raw.name, fileExtn, `/images/question/${grade.gradeId}/gradeImage.${fileExtn}`);
      const uploadTask = storage.ref(`/images/grade/${question.gradeId}/${question.subjectId}/${question.chapterId}/${question.type}${question.difficulty}${question.questionSequenceId}.${fileExtn}`).put(raw);

      //initiates the firebase side uploading
      uploadTask.on('state_changed',
      (snapShot) => {
        //takes a snap shot of the process as it is happening
        console.log(snapShot)
      }, (err) => {
        //catches the errors
        console.log(err)
        this.setState({loader: false});
      }, () => {
        // gets the functions from storage refences the image storage in firebase by the children
        // gets the download url then sets the image from firebase as the value for the imgUrl key:
        uploadTask.snapshot.ref.getDownloadURL()
         .then(fireBaseUrl => {
           // grade.gradeImageUrl = fireBaseUrl;
           const {uid, email, phoneNumber}=auth.currentUser;
           Object.assign(question, {questionImageUrl: fireBaseUrl,updatedOn: new Date(), updatedBy: {uid, email, phoneNumber}});
           // create the question
           db.collection("questions")
           .doc(question.docId ? question.docId : question.gradeId + '_' + question.subjectId + '_' + question.questionId)
           .set(question)
           .then(() => {
             this.setState({loader: false, editMode: false});
             alert('question has been created/updated successfully');
             console.log("question has been created/updated successfully"); // array of cities objects
             if(this.onAddQuestion){
               this.onAddQuestion();
             }
           })
           .catch((error)=>{
             this.setState({loader: false});
             alert('question coulnot be saved. Please check the error: ' + error.toString());
           });
         })
      })
    } else {
      const {uid, email, phoneNumber}=auth.currentUser;
      Object.assign(question, {updatedOn: new Date(), updatedBy: {uid, email, phoneNumber}});
      // create the question
      db.collection("questions")
      .doc(question.docId ? question.docId : question.gradeId + '_' + question.subjectId + '_' + question.questionId)
      .set(question)
      .then(() => {
        this.setState({loader: false, editMode: false});
        alert('question has been created/updated successfully');
        console.log("question has been created/updated successfully"); // array of cities objects
        if(this.onAddQuestion){
          this.onAddQuestion();
        }
      })
      .catch((error)=>{
        this.setState({loader: false});
        alert('question coulnot be saved. Please check the error: ' + error.toString());
      });
    }

  };

  handleImageAsFile = (e) => {
      const imageFile = e.target.files[0]
      // this.setState({imageFile});
      if (e.target.files.length) {
        this.setState({
          preview: URL.createObjectURL(e.target.files[0]),
          raw: e.target.files[0]
      });
    }
  }

  editQuestion(){
    const {question} = this.state;
    return(
      <form onSubmit={this.onSubmit}>
      <Card style={{ padding: '0rem 0rem',border: '1px solid rgb(0,0,0,0.1)'}}>


            <label htmlFor="upload-button">
              <div style={{textAlign: 'right'}}>
                <img src={Upload} style={{width: '20px', cursor: 'pointer'}}
                />
                <img src={this.state.preview ? this.state.preview : (question.questionImageUrl ? question.questionImageUrl : Logo) }
                  alt="" style={{width: '100%', maxHeight: '5rem', objectFit: 'contain'}}/>
              </div>
            </label>
            <input
              type="file"
              id="upload-button"
              style={{ display: "none" }}
              onChange={this.handleImageAsFile}
            />
            <div style={{ padding: '0 1rem 1rem 1rem' }}>
              <TextField  label="question Id"
                required
                disabled={this.question && this.question.questionId }
                style={{width: '100%', background: '#ffffff'}}
              value={question ? question.questionId : ''}
              onChange={(e)=>{
                let {question} = this.state;
                question.questionId = e.target.value;
                this.setState({question});
              }}
              />
            </div>
          <div style={{ padding: '0 1rem 1rem 1rem' }}>
            <TextField  label="question Title"
              required
              style={{width: '100%', background: '#ffffff'}}
            value={question ? question.questionTitle : ''}
            onChange={(e)=>{
              let {question} = this.state;
              question.questionTitle = e.target.value;
              this.setState({question});
            }}
            />
        </div>
        <div style={{ padding: '1rem 1rem 3rem 1rem' }}>
          <TextField
            // outlined
            textarea
            rows={5}
            maxLength={200}
            required
            label={"question Description " }
            style={{width: '100%', }}
          value={question ? question.questionDescription : ''}
          onChange={(e)=>{
            let {question} = this.state;
            question.questionDescription = e.target.value;
            this.setState({question});
          }}
          />
        </div>
        <CardActions>
          <CardActionButtons>
            <CardActionButton type="button"
              onClick={()=>{
                this.setState({editMode: false});
                if(this.onAddquestion){
                  this.onAddquestion();
                }
              }}>Back</CardActionButton>
            <CardActionButton>Submit</CardActionButton>
          </CardActionButtons>
        </CardActions>
      </Card>
    </form>
  );
  }

  render(){
    const {question, editMode} = this.state;
    console.log("question", this.state.question, this.question);
    if(!question){
      return (<></>);
    }
    if(this.state.loader){
      return(
        <div style={{textAlign: 'center'}}>

                  {/* <CircularProgress size="xlarge" style={{padding: '25% 40%'}}/> */}
                  <img src={Loader} style={{padding: '10% 0'}}/>

          </div>);
    }
    return(
      <div>
        {
          !editMode &&
          <ViewStandardQuestion
            question={question}
            onClickEdit={()=>this.setState({editMode: true})}
            onClickClose={()=>this.backToQlist()}
          />
        }
        {
          editMode &&
          <EditStandardQuestion
            onClickCancel={()=>this.setState({editMode: false})}
            onClickClose={()=>this.backToQlist()}
            question={question}
            origin={"StandardQuestion"}
          />
        }
      </div>


    );
  }
}

export default StandardQuestion;
