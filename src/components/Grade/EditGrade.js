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

class EditGrade extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      grade: {},
      preview: null,
      raw: null,
      loader: false,
    }
    this.grade = this.props.grade;
    this.onShowEdit = this.props.onShowEdit;
    this.handleImageAsFile = this.handleImageAsFile.bind(this);
  }
  componentDidMount() {
    // Typical usage (don't forget to compare props):
    this.setState({grade: this.grade ? {...this.grade} : {}});
  }

  componentDidUpdate(prevProps){
    if(this.props.grade !== prevProps.grade){
      this.grade = this.props.grade;
      this.setState({grade: this.grade ? {...this.grade} : {}});
    }
  }

  onSubmit = e => {
    e.preventDefault();
    const db = firebase.firestore();

    let {grade, raw, loader} = this.state;
    if(raw){
      this.setState({loader: true});
      // check whether photo is changed
      let fileExtn = raw.name.split('.')[1];
      // console.log("Raw file name", raw.name, fileExtn, `/images/grade/${grade.gradeId}/gradeImage.${fileExtn}`);
      const uploadTask = storage.ref(`/images/grade/${grade.gradeId}/gradeImage.${fileExtn}`).put(raw);

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
           Object.assign(grade, {gradeImageUrl: fireBaseUrl,updatedOn: new Date(), updatedBy: {uid, email, phoneNumber}});
           // create the question
           db.collection("grades")
           .doc(grade.gradeId)
           .set(grade)
           .then(() => {
             this.setState({loader: false});
             alert('Grade has been created/updated successfully');
             console.log("Grade has been created/updated successfully"); // array of cities objects
             this.onShowEdit();
           })
           .catch((error)=>{
             this.setState({loader: false});
             alert('Grade coulnot be saved. Please check the error: ' + error.toString());
           });
         })
      })
    } else {
      const {uid, email, phoneNumber}=auth.currentUser;
      Object.assign(grade, {updatedOn: new Date(), updatedBy: {uid, email, phoneNumber}});
      // create the question
      db.collection("grades")
      .doc(grade.gradeId)
      .set(grade)
      .then(() => {
        this.setState({loader: false});
        alert('Grade has been created/updated successfully');
        console.log("Grade has been created/updated successfully"); // array of cities objects
        this.onShowEdit();
      })
      .catch((error)=>{
        this.setState({loader: false});
        alert('Grade coulnot be saved. Please check the error: ' + error.toString());
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

  render(){
    const {grade} = this.state;
    console.log("Grade", this.state.grade, this.grade);
    if(!grade){
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
      <form onSubmit={this.onSubmit}>
      <Card style={{ padding: '0rem 0rem',border: '1px solid rgb(0,0,0,0.1)'}}>
          <label htmlFor="upload-button">
            <div style={{textAlign: 'right'}}>
              <img src={Upload} style={{width: '20px', cursor: 'pointer'}}
              />
              <img src={this.state.preview ? this.state.preview : (grade.gradeImageUrl ? grade.gradeImageUrl : Logo) }
                alt="" style={{width: '100%', maxHeight: '5rem', objectFit: 'contain'}}/>
            </div>
          </label>
          <input
            type="file"
            id="upload-button"
            style={{ display: "none" }}
            onChange={this.handleImageAsFile}
          />
          <div>

            <div style={{ padding: '0 1rem 1rem 1rem' }}>
              <TextField label="Grade Id"
                required
                style={{width: '100%', background: '#ffffff'}}
              disabled={this.grade && this.grade.gradeId }
              value={grade ? grade.gradeId :'' }
              onChange={(e)=>{
                let {grade} = this.state;
                grade.gradeId = e.target.value;
                this.setState({grade});
              }}
              />
            </div>
            <div style={{ padding: '0 1rem 1rem 1rem' }}>
              <TextField  label="Name"
                required
                style={{width: '100%', background: '#ffffff'}}
              value={grade ? grade.name : ''}
              onChange={(e)=>{
                let {grade} = this.state;
                grade.name = e.target.value;
                this.setState({grade});
              }}
              />
            </div>
            <div style={{ padding: '1rem 1rem 3rem 1rem' }}>
              <TextField
                // outlined
                textarea
                rows={6}
                maxLength={200}
                required
                label={"Grade Description " }
                style={{width: '100%', }}
              value={grade ? grade.gradeDescription : ''}
              onChange={(e)=>{
                let {grade} = this.state;
                grade.gradeDescription = e.target.value;
                this.setState({grade});
              }}
              />
            </div>
          </div>
        {/* </CardPrimaryAction> */}
        {
          // this.state.showCardAction &&
          <CardActions>
            <CardActionButtons>
              <CardActionButton type="button" onClick={()=>{this.onShowEdit();}}>Cancel</CardActionButton>
              <CardActionButton>Submit</CardActionButton>
            </CardActionButtons>
          </CardActions>
        }
      </Card>
    </form>
    );
  }
}

export default EditGrade;
