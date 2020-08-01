import React from 'react';
import firebase, {storage, auth } from '../../provider/database';
import Upload from '../../assets/icons/publish-black-48dp.svg';
import closeIcon from '../../assets/icons/close-black-48dp.svg';
import Loader from '../../assets/icons/loader.gif';
import Logo from '../../assets/icons/learnink-logo_500.png';

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

class EditChapter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chapter: {},
      preview: null,
      raw: null,
      loader: false,
      editMode: false,
    }
    this.chapter = this.props.chapter;
    this.onAddChapter = this.props.onAddChapter;
    this.handleImageAsFile = this.handleImageAsFile.bind(this);
  }
  componentDidMount() {
    // Typical usage (don't forget to compare props):
    this.chapter = this.props.chapter;
    this.setState({editMode: this.chapter.chapterId ? false : true , chapter: this.chapter ? {...this.chapter} : {}});
  }

  componentDidUpdate(prevProps){
    if(this.props.chapter !== prevProps.chapter){
      this.chapter = this.props.chapter;
      this.setState({editMode: this.chapter.chapterId ? false : true , chapter: this.chapter ? {...this.chapter} : {}});
    }
  }

  onSubmit = e => {
    e.preventDefault();
    const db = firebase.firestore();

    let {chapter, raw, loader} = this.state;
    if(raw){
      this.setState({loader: true});
      // check whether photo is changed
      let fileExtn = raw.name.split('.')[1];
      // console.log("Raw file name", raw.name, fileExtn, `/images/chapter/${grade.gradeId}/gradeImage.${fileExtn}`);
      const uploadTask = storage.ref(`/images/grade/${chapter.gradeId}/${chapter.subjectId}/${chapter.chapterId}/chapterImage.${fileExtn}`).put(raw);

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
           Object.assign(chapter, {chapterImageUrl: fireBaseUrl,updatedOn: new Date(), updatedBy: {uid, email, phoneNumber}});
           // create the question
           db.collection("chapters")
           .doc(chapter.docId ? chapter.docId : chapter.gradeId + '_' + chapter.subjectId + '_' + chapter.chapterId)
           .set(chapter)
           .then(() => {
             this.setState({loader: false, editMode: false});
             alert('chapter has been created/updated successfully');
             console.log("chapter has been created/updated successfully"); // array of cities objects
             if(this.onAddChapter){
               this.onAddChapter();
             }
           })
           .catch((error)=>{
             this.setState({loader: false});
             alert('chapter coulnot be saved. Please check the error: ' + error.toString());
           });
         })
      })
    } else {
      const {uid, email, phoneNumber}=auth.currentUser;
      Object.assign(chapter, {updatedOn: new Date(), updatedBy: {uid, email, phoneNumber}});
      // create the question
      db.collection("chapters")
      .doc(chapter.docId ? chapter.docId : chapter.gradeId + '_' + chapter.subjectId + '_' + chapter.chapterId)
      .set(chapter)
      .then(() => {
        this.setState({loader: false, editMode: false});
        alert('chapter has been created/updated successfully');
        console.log("chapter has been created/updated successfully"); // array of cities objects
        if(this.onAddChapter){
          this.onAddChapter();
        }
      })
      .catch((error)=>{
        this.setState({loader: false});
        alert('chapter coulnot be saved. Please check the error: ' + error.toString());
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

  selectedChapter(){
    const {chapter} = this.state;
    return (
      <Card style={{ padding: '0rem 0rem',border: '1px solid rgb(0,0,0,0.1)'}}>
        <CardPrimaryAction
          onClick={()=>{}}
          >
            <CardMedia
              sixteenByNine//={i%3==0}
              // square//={i%3!=0}
              style={{
                backgroundImage: 'url('+ chapter.chapterImageUrl + ')',
              }}
            />
          <div style={{ padding: '0 1rem 1rem 1rem' }}>
          <Typography use="headline6" tag="h2">
            {chapter.chapterTitle}
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
            {chapter.chapterDescription}
          </Typography>
        </div>
        <div>
          <Typography use="subtitle2" tag="span" style={{padding: '1rem',
            // border: '1px solid #018786',
            color: '#dd0074'}}>
            800 Questions
          </Typography>
        </div>

        <CardActions>
          <CardActionButtons>
            <CardActionButton onClick={()=>{this.setState({editMode: true})}}>Edit</CardActionButton>
            {/* <CardActionButton onClick={()=>{}}>Add Chapter</CardActionButton> */}
            <CardActionButton type="button"
              onClick={()=>{
                this.setState({editMode: false});
                if(this.onAddChapter){
                  this.onAddChapter();
                }
              }}>Close</CardActionButton>
            <CardActionButton type="button"
              onClick={()=>{
                this.setState({editMode: false});
                if(this.onAddChapter){
                  this.onAddChapter();
                }
              }}>Questions</CardActionButton>
          </CardActionButtons>
        </CardActions>
      </Card>
    );
  }

  editChapter(){
    const {chapter} = this.state;
    return(
      <form onSubmit={this.onSubmit}>
      <Card style={{ padding: '0rem 0rem',border: '1px solid rgb(0,0,0,0.1)'}}>


            <label htmlFor="upload-button">
              <div style={{textAlign: 'right'}}>
                <img src={Upload} style={{width: '20px', cursor: 'pointer'}}
                />
                <img src={this.state.preview ? this.state.preview : (chapter.chapterImageUrl ? chapter.chapterImageUrl : Logo) }
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
              <TextField  label="Chapter Id"
                required
                disabled={this.chapter && this.chapter.chapterId }
                style={{width: '100%', background: '#ffffff'}}
              value={chapter ? chapter.chapterId : ''}
              onChange={(e)=>{
                let {chapter} = this.state;
                chapter.chapterId = e.target.value;
                this.setState({chapter});
              }}
              />
            </div>
          <div style={{ padding: '0 1rem 1rem 1rem' }}>
            <TextField  label="Chapter Title"
              required
              style={{width: '100%', background: '#ffffff'}}
            value={chapter ? chapter.chapterTitle : ''}
            onChange={(e)=>{
              let {chapter} = this.state;
              chapter.chapterTitle = e.target.value;
              this.setState({chapter});
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
            label={"Chapter Description " }
            style={{width: '100%', }}
          value={chapter ? chapter.chapterDescription : ''}
          onChange={(e)=>{
            let {chapter} = this.state;
            chapter.chapterDescription = e.target.value;
            this.setState({chapter});
          }}
          />
        </div>
        <CardActions>
          <CardActionButtons>
            <CardActionButton type="button"
              onClick={()=>{
                this.setState({editMode: false});
                if(this.onAddChapter){
                  this.onAddChapter();
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
    const {chapter, editMode} = this.state;
    console.log("chapter", this.state.chapter, this.chapter);
    if(!chapter){
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
          editMode &&
          this.editChapter()
        }
        {
          !editMode &&
          this.selectedChapter()
        }

      </div>


    );
  }
}

export default EditChapter;
