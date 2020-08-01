import React from 'react';
import firebase, {storage, auth } from '../../provider/database';
import Upload from '../../assets/icons/publish-black-48dp.svg';
import closeIcon from '../../assets/icons/close-black-48dp.svg';
import Loader from '../../assets/icons/loader.gif';
import Logo from '../../assets/icons/learnink-logo_500.png';
import EditChapter from '../Chapter/EditChapter';

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

class EditSubject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subject: {},
      preview: null,
      raw: null,
      loader: false,
      editMode: false,
      addChapter: false,
    }
    this.subject = this.props.subject;
    this.onAddSubject = this.props.onAddSubject;
    this.handleImageAsFile = this.handleImageAsFile.bind(this);
    this.addNewChapter = this.addNewChapter.bind(this);
    this.onAddChapter = this.onAddChapter.bind(this);
  }
  componentDidMount() {
    // Typical usage (don't forget to compare props):
    this.subject = this.props.subject;
    this.setState({editMode: this.subject.subjectId ? false : true , subject: this.subject ? {...this.subject} : {}});
  }

  componentDidUpdate(prevProps){
    if(this.props.subject !== prevProps.subject){
      this.subject = this.props.subject;
      this.setState({editMode: this.subject.subjectId ? false : true , subject: this.subject ? {...this.subject} : {}});
    }
  }

  onSubmit = e => {
    e.preventDefault();
    const db = firebase.firestore();

    let {subject, raw, loader} = this.state;
    if(raw){
      this.setState({loader: true});
      // check whether photo is changed
      let fileExtn = raw.name.split('.')[1];
      // console.log("Raw file name", raw.name, fileExtn, `/images/subject/${grade.gradeId}/gradeImage.${fileExtn}`);
      const uploadTask = storage.ref(`/images/grade/${subject.gradeId}/${subject.subjectId}/subjectImage.${fileExtn}`).put(raw);

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
           Object.assign(subject, {subjectImageUrl: fireBaseUrl,updatedOn: new Date(), updatedBy: {uid, email, phoneNumber}});
           // create the question
           db.collection("subjects")
           .doc(subject.gradeId + '_' + subject.subjectId)
           .set(subject)
           .then(() => {
             this.setState({loader: false, editMode: false, addChapter: false});
             alert('subject has been created/updated successfully');
             console.log("subject has been created/updated successfully"); // array of cities objects
             if(this.onAddSubject){
               this.onAddSubject();
             }
           })
           .catch((error)=>{
             this.setState({loader: false});
             alert('subject coulnot be saved. Please check the error: ' + error.toString());
           });
         })
      })
    } else {
      const {uid, email, phoneNumber}=auth.currentUser;
      Object.assign(subject, {updatedOn: new Date(), updatedBy: {uid, email, phoneNumber}});
      // create the question
      db.collection("subjects")
      .doc(subject.gradeId+ '_' + subject.subjectId)
      .set(subject)
      .then(() => {
        this.setState({loader: false, editMode: false, addChapter: false});
        alert('subject has been created/updated successfully');
        console.log("subject has been created/updated successfully"); // array of cities objects
        if(this.onAddSubject){
          this.onAddSubject();
        }
      })
      .catch((error)=>{
        this.setState({loader: false});
        alert('subject coulnot be saved. Please check the error: ' + error.toString());
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

  selectedSubject(){
    const {subject} = this.state;
    return (
      <Card style={{ padding: '0rem 0rem',border: '1px solid rgb(0,0,0,0.1)'}}>
        <CardPrimaryAction
          onClick={()=>{}}
          >
            <CardMedia
              sixteenByNine//={i%3==0}
              // square//={i%3!=0}
              style={{
                backgroundImage: 'url('+ subject.subjectImageUrl + ')',
              }}
            />
          <div style={{ padding: '0 1rem 1rem 1rem' }}>
          <Typography use="headline6" tag="h2">
            {subject.subjectName}
          </Typography>
        </div>
        </CardPrimaryAction>
        {/* <ListDivider /> */}
        <div style={{ padding: '1rem 1rem 3rem 1rem' }}>
          <Typography
            use="body1"
            tag="div"
            theme="textSecondaryOnBackground"
            style={{
              color: "grey",
            }}
          >
            {subject.subjectDescription}
          </Typography>
        </div>
        <div>
          <Typography use="subtitle2" tag="span" style={{padding: '1rem',
            // border: '1px solid #018786',
            color: '#018786'}}>
            12 Chapters
          </Typography>
          <Typography use="subtitle2" tag="span" style={{padding: '1rem',
            // border: '1px solid #018786',
            color: '#dd0074'}}>
            800 Questions
          </Typography>
        </div>

        <CardActions>
          <CardActionButtons>
            <CardActionButton onClick={()=>{this.setState({editMode: true, addChapter: false})}}>Edit</CardActionButton>
            <CardActionButton
              onClick={()=>{
                this.setState({editMode: false, addChapter: true});
                window.scrollTo({
                                  top: 150,
                                  left: 0,
                                  behavior: 'smooth'
                                });
              }}>Add Chapter</CardActionButton>
            <CardActionButton type="button"
              onClick={()=>{
                this.setState({editMode: false, addChapter: false});
                if(this.onAddSubject){
                  this.onAddSubject();
                }
              }}>Close</CardActionButton>
          </CardActionButtons>
        </CardActions>
      </Card>
    );
  }

  editSubject(){
    const {subject} = this.state;
    return(
      <form onSubmit={this.onSubmit}>
      <Card style={{ padding: '0rem 0rem',border: '1px solid rgb(0,0,0,0.1)'}}>


            <label htmlFor="upload-button">
              <div style={{textAlign: 'right'}}>
                <img src={Upload} style={{width: '20px', cursor: 'pointer'}}
                />
                <img src={this.state.preview ? this.state.preview : (subject.subjectImageUrl ? subject.subjectImageUrl : Logo) }
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
              <TextField  label="Subject Id"
                required
                disabled={this.subject && this.subject.subjectId }
                style={{width: '100%', background: '#ffffff'}}
              value={subject ? subject.subjectId : ''}
              onChange={(e)=>{
                let {subject} = this.state;
                subject.subjectId = e.target.value;
                this.setState({subject});
              }}
              />
            </div>
          <div style={{ padding: '0 1rem 1rem 1rem' }}>
            <TextField  label="Name"
              required
              style={{width: '100%', background: '#ffffff'}}
            value={subject ? subject.subjectName : ''}
            onChange={(e)=>{
              let {subject} = this.state;
              subject.subjectName = e.target.value;
              this.setState({subject});
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
            label={"Subject Description " }
            style={{width: '100%', }}
          value={subject ? subject.subjectDescription : ''}
          onChange={(e)=>{
            let {subject} = this.state;
            subject.subjectDescription = e.target.value;
            this.setState({subject});
          }}
          />
        </div>
        <div style={{ padding: '0 1rem 1rem 1rem' }}>
          <TextField  label="Price(Rs.)"
            required
            type="number"
            style={{width: '45%', background: '#ffffff', marginRight: '10%'}}
          value={subject && subject.price ? subject.price.inr : 0}
          onChange={(e)=>{
            let {subject} = this.state;
            Object.assign(subject,{price:{inr: +e.target.value, usd: subject && subject.price ? subject.price.usd : 0}});
            this.setState({subject});
          }}
          />
          <TextField  label="Price($)"
            required
            type="number"
            style={{width: '45%', background: '#ffffff'}}
          value={subject && subject.price ? subject.price.usd : 0}
          onChange={(e)=>{
            let {subject} = this.state;
            Object.assign(subject,{price: {usd: +e.target.value , inr: subject && subject.price ? subject.price.inr : 0}});
            this.setState({subject});
          }}
          />
      </div>
      <div style={{ padding: '0 1rem 1rem 1rem' }}>
        <TextField  label="Validity Period"
          type="number"
          required
          style={{width: '100%', background: '#ffffff'}}
        value={subject ? subject.validityPeriod : 365}
        onChange={(e)=>{
          let {subject} = this.state;
          subject.validityPeriod = e.target.value ? e.target.value : 365;
          this.setState({subject});
        }}
        />
    </div>
        <CardActions>
          <CardActionButtons>
            <CardActionButton type="button"
              onClick={()=>{
                this.setState({editMode: false, addChapter: false});
                if(this.onAddSubject){
                  this.onAddSubject();
                }
              }}>Back</CardActionButton>
            <CardActionButton>Submit</CardActionButton>
          </CardActionButtons>
        </CardActions>
      </Card>
    </form>
  );
  }

  addNewChapter(){
    let {addChapter, subject } = this.state;
    let chapter = { gradeId: subject. gradeId, subjectId: subject.subjectId};
    return(
      <EditChapter chapter={chapter} onAddChapter={this.onAddChapter}/>
    )
  }

  onAddChapter(){
    this.setState({addChapter: false});
  }

  render(){
    const {subject, editMode, addChapter} = this.state;
    console.log("subject", this.state.subject, this.subject);
    if(!subject){
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
          addChapter &&
          <div>
            {
              this.addNewChapter()
            }
            <br/>
          </div>
        }
        {
          editMode &&
          this.editSubject()
        }
        {
          !editMode &&
          this.selectedSubject()
        }
      </div>


    );
  }
}

export default EditSubject;
