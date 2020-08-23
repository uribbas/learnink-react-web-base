import React from 'react';
import firebase, { storage, auth } from '../../provider/database';
import * as moment from 'moment';
import { getTestQuestions } from '../../provider/test';
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
import { ImageList, ImageListItem, ImageListImage, ImageListSupporting, ImageListLabel,ImageListImageAspectContainer } from '@rmwc/image-list';
import { Switch } from '@rmwc/switch';
import {CollapsibleList, SimpleListItem} from '@rmwc/list';
// material UI style
import '@rmwc/card/styles';
import '@rmwc/typography/styles';
import '@rmwc/fab/styles';
import '@rmwc/select/styles';
import '@rmwc/grid/styles';
import '@rmwc/textfield/styles';
import '@rmwc/button/styles';
import '@rmwc/circular-progress/styles';
import '@rmwc/image-list/styles';
import '@rmwc/switch/styles';
import '@rmwc/list/styles';

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
      test:{
        uid: null,
        createdOn: null,
        categoryWeights:{
          easy: 33,
          moderate: 34,
          difficult: 33
        },
        totalQuestions: 30,
        isTimed: true,
        isAdaptive: false,
      },
    }
    this.chapters = this.props.chapters ? this.props.chapters : [];
    this.chapter = this.props.chapters ? this.props.chapters[0] : [];
    this.onAddChapter = this.props.onAddChapter;
    this.handleImageAsFile = this.handleImageAsFile.bind(this);
    this.renderChapters = this.renderChapters.bind(this);
  }
  componentDidMount() {
    // Typical usage (don't forget to compare props):
    if(this.props.selectedTest){
      this.test = this.props.selectedTest;
      this.chapters = this.test.chaptersCovered;
    } else {
      this.chapter = this.props.chapters[0];
      this.chapters = this.props.chapters;
      this.test = {
                    categoryWeights:{
                      easy: 33,
                      moderate: 34,
                      difficult: 33
                    },
                    totalQuestions: 30,
                    isTimed: true,
                    isAdaptive: false,
                  };
      this.test.gradeId = this.chapter.gradeId;
      this.test.gradeName = this.props.grade.name;
      this.test.subjectId = this.chapter.subjectId;
      this.test.subjectName = this.props.subject.name;
      this.test.chaptersCovered = [...this.chapters];
      this.test.subjectImageUrl = this.props.subject.url ?  this.props.subject.url : '';
      this.test.testImageUrl = this.chapters.length > 1 ? this.props.subject.url : this.chapter.chapterImageUrl;
    }

    this.setState({editMode: this.test.docId ? true : true , chapter: this.chapters ? [...this.chapters] : [],
                    test: this.test});
    // console.log("componentDidMount check", this.props.subject.url, this.chapters);
  }

  componentDidUpdate(prevProps){
    // console.log("componentDidUpdate check", this.props.subject.url, this.props.chapters,this.props.chapters.length,prevProps.chapters.length,this.props.chapter,prevProps.chapter);
    if(this.props.selectedTest !== prevProps.selectedTest){
      this.test = this.props.selectedTest;
      this.chapters = this.test.chaptersCovered;
      this.setState({editMode: this.test.docId ? true : true , chapter: this.chapters ? [...this.chapters] : [],
                      test: this.test});
    }
    if(this.props.chapters !== prevProps.chapters){
      this.chapter = this.props.chapters[0];
      this.chapters = this.props.chapters;
      let {test} = this.state;
      if(!this.props.selectedTest){
        this.test = test;
        this.test.gradeId = this.chapter.gradeId;
        this.test.gradeName = this.props.grade.name;
        this.test.subjectId = this.chapter.subjectId;
        this.test.subjectName = this.props.subject.name;
        this.test.chaptersCovered = [...this.chapters];
        this.test.subjectImageUrl = this.props.subject.url ?  this.props.subject.url : '';
        this.test.testImageUrl = this.chapters.length > 1 ? (this.props.subject.url ?  this.props.subject.url : this.chapter.chapterImageUrl ) : this.chapter.chapterImageUrl;
      } else {
        this.test.chaptersCovered = [...this.chapters];
        this.test.testImageUrl = this.chapters.length > 1 ? (this.test.subjectImageUrl ?  this.test.subjectImageUrl : this.chapter.chapterImageUrl ): this.chapter.chapterImageUrl;
      }

      this.setState({editMode: this.chapter.chapterId ? true : true , chapter: this.chapters ? [...this.chapters] : [],
                      test: this.test});

    }
  }

  onSubmit = e => {
    e.preventDefault();
    const db = firebase.firestore();
    let {test} = this.state;
    const { userAuth, userProfile, aphRef} = this.props;

    Object.assign(test,
      {
        uid: userProfile.uid,
        user: {
          uid: userProfile.uid,
          name: userProfile.name,
          email: userProfile.email,
          phoneNumber: userProfile.phoneNumber
        },
        createdOn: new Date(),
        testDate: new Date(),
      }
    );
    console.log("Final test docuemnt to be saved", test, this.props.subject);
    if(test.docId){
      let testDoc = test.docId;
      delete test.docId
      db.collection("tests")
      .doc(testDoc)
      .set(test)
      .then(() => {
        this.setState({loader: false, editMode: false});
        alert('Test has been updated successfully');
        console.log("chapter has been updated successfully"); // array of cities objects
        if(this.onAddChapter){
          this.onAddChapter(null,true);
        }
      })
      .catch((error)=>{
        this.setState({loader: false});
        alert('chapter coulnot be saved. Please check the error: ' + error.toString());
      });
    } else {
      db.collection("tests")
      .add(test)
      .then(() => {
        this.setState({loader: false, editMode: false});
        alert('Test has been created successfully');
        console.log("chapter has been created successfully"); // array of cities objects
        if(this.onAddChapter){
          this.onAddChapter(null,true);
        }
      })
      .catch((error)=>{
        this.setState({loader: false});
        alert('chapter coulnot be saved. Please check the error: ' + error.toString());
      });
    }

  }

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

  renderChapters(){
    const {test} = this.state;
    // console.log("test images",test,test.chaptersCovered);

    return (
      <ImageList>
        {
          test.chaptersCovered.map((src,i) => (
                <ImageListItem
                  key={moment().valueOf().toString()+i.toString()}
                  style={{ margin: '2px', width: 'calc(100% / 4 - 4.2px)',
                           // border: '1px solid rgba(0,0,0,0.2)',
                           boxShadow: '0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)',
                           borderRadius: '4px'
                         }}
                >
                  {
                    test.chaptersCovered.length > 1 &&
                    <Button
                      type="button"
                      label="remove"
                      style={{ color: 'red', zoom: '0.65',MozTransform : 'scale(0.65)',}}
                      onClick={(e)=>{
                        let {test} = this.state;
                        if(test.chaptersCovered.length > 1){
                          test.chaptersCovered.splice(i,1);
                        }
                        if(this.onAddChapter){
                          this.onAddChapter(test.chaptersCovered);
                        }
                        this.setState({test});
                      }}
                    />
                  }
                  <ImageListImageAspectContainer
                    style={{ paddingBottom: 'calc(100% / 1.5)' }}
                  >
                    <ImageListImage src={src.chapterImageUrl} style={{width: '100%', maxHeight: '3rem', objectFit: 'cover'}}/>
                  </ImageListImageAspectContainer>
                  <ImageListSupporting style={{padding: '0'}}>
                    <ImageListLabel style={{fontSize: '10px', padding: '0 0.25rem'}}>{src.chapterTitle}</ImageListLabel>
                  </ImageListSupporting>
                  {
                    test.chaptersCovered.length > 1 &&
                    // !test.isAdaptive &&
                    <TextField  label="% Weightage..."
                      required
                      outlined
                      disabled={test.isAdaptive}
                      style={{width: '100%', background: '#ffffff',zoom: '0.65',MozTransform : 'scale(0.65)',}}
                      type="number"
                      ref={(ref)=>this[src.chapterId]=ref}
                    value={src.chapterWeights}
                    onChange={(e)=>{
                      let {test} = this.state;
                      test.chaptersCovered[i].chapterWeights = parseInt(e.target.value);
                      this.setState({test},()=>{ this[src.chapterId].focus()});
                    }}
                    />
                  }
                </ImageListItem>
              ))
        }
      </ImageList>
    );
  }

  editChapter(){
    const {test, chapter} = this.state;
    console.log("edit chapter", test);

    return(
      <form onSubmit={this.onSubmit}>
      <Card style={{ padding: '0rem 0rem',border: '1px solid rgb(0,0,0,0.1)'}}>


            <label htmlFor="upload-button">
              <div style={{textAlign: 'right', margin: '0.5rem 0.5rem'}}>
                {/* <img src={Upload} style={{width: '20px', cursor: 'pointer'}}
                /> */}
                <img src={this.state.preview ? this.state.preview : (test.testImageUrl ? test.testImageUrl : Logo) }
                  alt="" style={{width: '100%', maxHeight: '5rem', objectFit: test.docId ? 'cover' : 'contain'}}/>
              </div>
            </label>
            {/* <input
              type="file"
              id="upload-button"
              style={{ display: "none" }}
              onChange={this.handleImageAsFile}
            /> */}
          <div style={{ padding: '0 1rem 1rem 1rem' }}>
            <TextField  label="Test Title"
              required
              style={{width: '100%', background: '#ffffff'}}
            value={test.testTitle}
            onChange={(e)=>{
              let {test} = this.state;
              test.testTitle = e.target.value;
              this.setState({test});
            }}
            />
        </div>
        <div style={{ padding: '0rem 1rem 0rem' }}>
          <TextField
            // outlined
            disabled
            required
            label={"Grade..." }
            style={{width: '100%', }}
            value={test.gradeName}
          />
        </div>
        <div style={{ padding: '0rem 1rem 0rem' }}>
          <TextField
            // outlined
            disabled
            required
            label={"Subject..." }
            style={{width: '100%', }}
            value={test.subjectName}
          />
        </div>
        <CollapsibleList
          handle={
            <SimpleListItem
              text="Chapters Included of the Test"
              graphic="bookmarks"
              metaIcon="chevron_right"
            />
          }
        >
          <div style={{ padding: '0.25rem 1rem 0rem' }}>
            {/* <Typography use="subtitle2" tag="h2">
              Chapters to include in the test
            </Typography> */}
            {
              this.renderChapters()
            }
          </div>
        </CollapsibleList>

          <CollapsibleList
            handle={
              <SimpleListItem
                text="Advanced Settings"
                graphic="settings"
                metaIcon="chevron_right"
              />
              // <GridCell phone={4} tablet={8} desktop={12}>
                // <div style={{ padding: '0rem 1rem 0rem' }}>
                //   <Typography use="subtitle2" tag="h2">
                //     Advanced Settings
                //   </Typography>
                // </div>
              // </GridCell>
            }
          >
          <GridRow>
          {/* <GridCell phone={4} tablet={8} desktop={12}>
            <div style={{ padding: '0rem 1rem 0rem' }}>
              <Typography use="subtitle2" tag="h2">
                Advanced Settings
              </Typography>
            </div>
          </GridCell> */}
          <GridCell phone={2} tablet={4} desktop={6}>
            <GridCell phone={4} tablet={8} desktop={12}>
              <div style={{ padding: '0rem 1rem 0rem' }}>
                <Typography use="body2" tag="h2">
                  Difficulty distribution (%)
                </Typography>
              </div>
            </GridCell>

              <GridCell phone={4} tablet={8} desktop={12}>
                <div style={{ padding: '0 1rem 1rem 1rem' }}>
                  <TextField  label="Easy..."
                    required
                    outlined
                    disabled={test.isAdaptive}
                    style={{width: '100%', background: '#ffffff'}}
                    type="number"
                  value={test.categoryWeights.easy}
                  onChange={(e)=>{
                    let {test} = this.state;
                    test.categoryWeights.easy = parseInt(e.target.value);
                    this.setState({test});
                  }}
                  />
                </div>
              </GridCell>
              <GridCell phone={4} tablet={8} desktop={12}>
                <div style={{ padding: '0 1rem 1rem 1rem' }}>
                  <TextField  label="Moderate..."
                    required
                    outlined
                    disabled={test.isAdaptive}
                    style={{width: '100%', background: '#ffffff'}}
                    type="number"
                  value={test.categoryWeights.moderate}
                  onChange={(e)=>{
                    let {test} = this.state;
                    test.categoryWeights.moderate = parseInt(e.target.value);
                    this.setState({test});
                  }}
                  />
                </div>
              </GridCell>
              <GridCell phone={4} tablet={8} desktop={12}>
                <div style={{ padding: '0 1rem 1rem 1rem' }}>
                  <TextField  label="Difficult..."
                    required
                    outlined
                    disabled={test.isAdaptive}
                    style={{width: '100%', background: '#ffffff'}}
                    type="number"
                  value={test.categoryWeights.difficult}
                  onChange={(e)=>{
                    let {test} = this.state;
                    test.categoryWeights.difficult = parseInt(e.target.value);
                    this.setState({test});
                  }}
                  />
                </div>
              </GridCell>
              {
                !test.isAdaptive &&
                test.categoryWeights.easy + test.categoryWeights.moderate + test.categoryWeights.difficult !=100 &&
                <GridCell phone={4} tablet={8} desktop={12}>
                  <div style={{ padding: '0rem 1rem 0rem', color: 'red' }}>
                    <Typography use="caption" tag="p">
                      Total distribution should be equal to 100%
                    </Typography>
                  </div>
                </GridCell>
              }
          </GridCell>
          <GridCell phone={2} tablet={4} desktop={6} >

              <GridCell phone={4} tablet={8} desktop={12} style={{margin: '1rem'}}>
                <Switch id={'adaptive'+(test.docId ? test.docId : moment().valueOf().toString())}
                  label="&nbsp; Adaptive"
                  checked={test.isAdaptive}
                  onChange={(e)=>{
                    let {test} = this.state;
                    test.isAdaptive = e.target.checked;
                    this.setState({test});
                  }}
                />
              </GridCell>
              <GridCell phone={4} tablet={8} desktop={12} style={{margin: '1rem'}}>
                <Switch id={'timebound'+(test.docId ? test.docId : moment().valueOf().toString())}
                  label="&nbsp; Timebound"
                  checked={test.isTimed}
                  onChange={(e)=>{
                    let {test} = this.state;
                    test.isTimed = e.target.checked;
                    this.setState({test});
                    console.log("test isTimed", test, test.isTimed, e.target.value);
                  }}
                />
              </GridCell>
              <GridCell phone={4} tablet={8} desktop={12}>
                <div style={{ padding: '0 1rem 1rem 1rem', marginRight: '0.5rem'}}>
                  <TextField  label="Total questions..."
                    required
                    outlined
                    style={{width: '100%', background: '#ffffff'}}
                    type="number"
                  value={test.totalQuestions}
                  onChange={(e)=>{
                    let {test} = this.state;
                    test.totalQuestions = e.target.value;
                    this.setState({test});
                  }}
                  />
                </div>
              </GridCell>
          </GridCell>
          </GridRow>
        </CollapsibleList>
        <CardActions>
          <CardActionButtons>
            {
              !this.props.onEditTest &&
              <CardActionButton type="button"
                onClick={()=>{
                  this.setState({editMode: false});
                  if(this.onAddChapter){
                    this.onAddChapter(null,true);
                  }
                }}>Cancel</CardActionButton>
            }
            {
              this.props.onEditTest &&
              <CardActionButton type="button"
                onClick={()=>{
                  this.props.onEditTest(test);
                }}>Edit</CardActionButton>
            }
            {
              !this.props.onEditTest &&
              <CardActionButton>Save Test</CardActionButton>
            }
            {
              this.props.onEditTest &&
              <CardActionButton type="button"
                onClick={async ()=>{
                  const {test} = this.state;
                  let questions = await getTestQuestions(test);
                  console.log("Run test set", questions);
                  // this.props.onStartTest(test);
                }}>Start Test</CardActionButton>
            }
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
      </div>


    );
  }
}

export default EditChapter;
