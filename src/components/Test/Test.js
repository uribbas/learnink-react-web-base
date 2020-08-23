import React from 'react';
import * as moment from 'moment';
import firebase, {db} from '../../provider/database';
import Categories from '../Categories/Categories';
import RadioFilter from '../RadioFilter/RadioFilter';
import SubjectList from './SubjectList';
import ChapterList from './ChapterList';
import TestList from './TestList';
// material UI
import Left from '../../assets/icons/chevron_left-black-48dp.svg';
import Right from '../../assets/icons/chevron_right-black-48dp.svg';
import Add from '../../assets/icons/add-black-48dp.svg';
import QType from '../../assets/icons/widgets-black-48dp.svg';
import SubjectIcon from '../../assets/icons/library_books-black-48dp.svg';
import Loader from '../../assets/icons/loader.gif';
// material UI
import {
Grid,
GridCell,
GridRow,
 } from '@rmwc/grid';
import { Card } from '@rmwc/card';
import { Typography } from '@rmwc/typography';
import { Button } from '@rmwc/button';
import { Snackbar, SnackbarAction } from '@rmwc/snackbar';

// material UI style
import '@rmwc/grid/styles';
import '@rmwc/card/styles';
import '@rmwc/typography/styles';
import '@rmwc/button/styles';
import '@rmwc/snackbar/styles';

class Test extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gradeIds:[],
      subjectIds: [],
      grades:[],
      subjects:[],
      selectedGrade: null,
      selectedSubject: null,
      selectedChapter: null,
      showCardAction:  false,
      loader: false,
      showGradeFilter: false,
      showSubjectFilter: false,
      openSnackBar: false,
      snackBarMsg: "",
      selectedTest: null,
    };

    this.onSelectSubject = this.onSelectSubject.bind(this);
    this.onSelectTest = this.onSelectTest.bind(this);

  }

  componentDidMount(){
    this.getSubscriptions();
    // this.getSubjects();
  }

  getSubscriptions(){
    const {showCardAction, userProfile} = this.props;
    // console.log("User profile ", userProfile);
    if(!userProfile){
      // Do nothing wait for next props
    } else {
      this.setState({loader: true});
      let gradeIds = [];
      let subjectIds = [];
      db.collection("subscriptions")
      .where("endDate",">=",new Date(moment().format("YYYY-MM-DD")))
      .where("uid","==", userProfile.uid)
      .onSnapshot((querySnapshot)=>{
          querySnapshot.forEach((doc)=>{
              let data = doc.data();
              console.log("Subscription Data is ", data, gradeIds);
              if(!gradeIds.includes(data.gradeId)){gradeIds.push(data.gradeId);}
              let idxs = subjectIds.findIndex(s=>s.gradeId==data.gradeId && s.subjectId==data.subjectId);
              if(idxs==-1){subjectIds.push({gradeId: data.gradeId, subjectId: data.subjectId});}
          });
          this.setState(
              {gradeIds,subjectIds,showCardAction, selectedGrade: null, selectedChapter: null, loader: false},
              ()=>{
                    console.log("post setState gradeIds",gradeIds,gradeIds.length);
                    if(gradeIds.length > 0) {
                      this.getGrades();
                    }
                  }
                );
      });
    }

  }

  getGrades(){
    const {gradeIds, showCardAction} = this.state;
    console.log("gradeIds", gradeIds);
    this.setState({loader: true});
    db.collection("grades")
    .where("gradeId","in",gradeIds)
    .onSnapshot((querySnapshot)=>{
        let grades = [];
        querySnapshot.forEach((doc)=>{
            grades.push(doc.data());
        });
        console.log("Grades fetched: ", grades);
        let selectedGrade = null; //{ gradeId: grades[0].gradeId, name: grades[0].name, url: grades[0].gradeImageUrl }
        this.setState({grades,showCardAction, selectedGrade, loader: false});
    });
  }

  getSubjects(){
    const {showCardAction, selectedGrade, subjectIds} = this.state;
    // this.setState({loader: true});
    let subjectIdList = subjectIds.map(s=>{if(s.gradeId==selectedGrade.gradeId){return s.subjectId;}});
    console.log("chapter grade", selectedGrade, subjectIdList);
    let subRef = db.collection("subjects");
    // if(selectedGrade){
    //   subRef = subRef.where("gradeId","==", selectedGrade.gradeId);
    // }
    subRef
    .where("gradeId","==", selectedGrade.gradeId)
    .where("subjectId","in",subjectIdList)
    .onSnapshot((querySnapshot)=>{
        let subjects = [];
        querySnapshot.forEach((doc)=>{
            subjects.push({...doc.data(), docId: doc.id});
        });
        console.log("chapter getSubjects Subjects fetched: ", subjects);
        this.setState({subjects,showCardAction, loader: false});
    });
  }


  onchange(value,type) {
    if(type=="grade"){
      this.setState({ gradevalue: value, selectedSubject: null,showSubjectFilter: null });
    } else {
      this.setState({ subjectvalue: value, selectedSubject: null,showSubjectFilter: null });
    }

  }
  onSelectSubject = (selectedSubject)=>{
    console.log("selectedSubject from onSelectSubject",selectedSubject);
    // this.setState({selectedSubject, selectedChapter: null, showSubjectFilter: false});
    this.setState({selectedSubject, selectedTest: null, showSubjectFilter: false, selectedChapter: null,})
  }
  onSelectChapter = (selectedChapter)=>{
    console.log("selectedSubject from onSelectSubject",selectedChapter);
    if(selectedChapter){
      this.setState({selectedChapter});
    } else {
      this.setState({selectedChapter, selectedSubject: null, selectedGrade: null, selectedTest: null});
    }

  }

  onSelectTest(selectedTest){
    console.log("onSelectTest", selectedTest);
    // let selectedGrade={gradeId: test.gradeId, name: test.gradeName, url: '' };
    // let selectedSubject={gradeId: test.gradeId, subjectId: test.subjectId, name: test.subjectName, url: '' };
    // let selectedChapter = {...test.chaptersCovered[0]};
    // this.setState({selectedGrade, selectedSubject, selectedChapter,test});
    this.setState({selectedTest, selectedGrade: null, selectedSubject: null, selectedChapter: null});
    window.scrollTo({
                      top: 150,
                      left: 0,
                      behavior: 'smooth'
                    });
  }

  render(){
    const { userAuth, userProfile, aphRef} = this.props;
    const {showGradeFilter, showSubjectFilter, grades, subjects, selectedGrade, selectedSubject, selectedChapter, loader, selectedTest} = this.state;
    console.log("test",showGradeFilter, showSubjectFilter, grades, subjects, selectedGrade, selectedSubject, selectedChapter, loader, selectedTest);
    // if(!grade){
    //   return (<></>);
    // }
    if(this.state.loader){
      return(
        <div style={{textAlign: 'center'}}>
            <img src={Loader} style={{padding: '15% 0'}}/>
        </div>);
    }
    return(
      <div style={{ textAlign: 'left', padding: '0rem 0rem'}}>
        <Snackbar
          open={this.state.openSnackBar}
          onClose={evt => this.setState({openSnackBar: false})}
          message={this.state.snackBarMsg}
          dismissesOnAction
          action={
            <SnackbarAction
              label="Dismiss"
              onClick={() => console.log('Click Me')}
            />
          }
        />
        <Grid>
          <GridRow>
            <GridCell phone={4} tablet={2} desktop={2}>
              <Categories {...this.props}/>
            </GridCell>
            <GridCell phone={4} tablet={6} desktop={10}>
                  <GridCell>
                    <Card style={{boxShadow: 'none', borderBottom: '1.25px solid rgba(0,0,0,0.1)', background: 'transparent'}}>
                      <Typography use="headline5"
                        style={{ textAlign: 'left', padding: '0rem 1rem 0.25rem' }}
                        >
                        Tests
                      </Typography>
                      {/* <ListDivider /> */}
                    </Card>
                  </GridCell>
                  <GridRow>
                    <GridCell phone={4} tablet={8} desktop={12} style={{ padding: '0.5rem 0.5rem',}}>
                      <GridRow>
                      {
                        (!selectedSubject || !selectedChapter) && !selectedTest &&
                          <GridCell phone={4} tablet={8} desktop={6} >
                            <Card style={{margin: '1rem'}}>
                              <div style={{ padding: '1rem 1rem 1rem 1rem', }}>
                                <Typography use="headline4" >
                                  Practice
                                </Typography>
                                <br/>
                                <Typography use="headline6">
                                  makes a man &nbsp;
                                </Typography>
                                {/* <br/>
                                <Typography use="headline6">
                                  a man
                                </Typography> */}
                                {/* <br/> */}
                                <Typography use="headline4">
                                  Perfect
                                </Typography>
                                <br/>
                                <Typography use="headline6">
                                  and &nbsp;
                                </Typography>
                                <Typography use="headline4">
                                  Tests &nbsp;
                                </Typography>
                                {/* <br/> */}
                                <Typography use="headline6">
                                  make practice easy
                                </Typography>
                                <br/>
                                <div style={{ padding: '1rem 0rem 2rem 1rem' }}>
                                  <Typography
                                    use="body1" //{ this.state.editItem ? "caption" : "body1" }
                                    tag="div"
                                    theme="textSecondaryOnBackground"
                                    style={{color: "grey",}}
                                  >
                                    <ul>
                                      <li>There is no alternative to hard work and success</li>
                                      <li>Choose subjects to practice through regular tests</li>
                                      <li>Practice at your own pace and customise tests as per your requirement</li>
                                      <li>Review feedback of each responses of the tests</li>
                                    </ul>
                                  </Typography>
                                </div>
                                <GridRow>
                                  <GridCell phone={4} tablet={8} desktop={12}>
                                    <Button raised
                                      label={!selectedGrade ?
                                              "Let's create test"
                                              :
                                              !selectedSubject ?
                                              "Continue by selecting Subject"
                                              :
                                              "Get started selecting a Chapter"}
                                      style={{height: '30px', fontSize: '12px', marginTop: '10px', fontWeight: 'bold'}}
                                      onClick={()=>{
                                        // aphRef for AppHeader open and close function call
                                        // this.props.aphRef.handleOpenSignIn(true);
                                        if(!selectedGrade) {
                                          this.setState({showGradeFilter: true});
                                        } else if(!selectedSubject) {
                                          this.setState({showSubjectFilter: true});
                                        } else {
                                          //Do nothing
                                          this.setState({openSnackBar: true, snackBarMsg: "Please select a chapter from the list of chapters to start."});
                                        }
                                        // console.log("aphRef", this.props.aphRef)
                                      }}
                                      >
                                    </Button>
                                  </GridCell>
                                </GridRow>
                              </div>
                            </Card>
                          </GridCell>
                      }
                        <GridCell phone={4} tablet={ 8 } desktop={!selectedChapter && !selectedTest ? 6 : 12} >
                          <GridRow>
                            <GridCell phone={4} tablet={ 8 } desktop={12} >
                              <div style={{ padding: '1rem 1rem 0rem 0rem', }}>
                                <RadioFilter
                                  title={'Select Grade'}
                                  items={grades.map(g=>{return(g ? {gradeId: g.gradeId, name: g.name, url: g.gradeImageUrl} : null)})}
                                  selectedItem={selectedGrade}
                                  open={showGradeFilter}
                                  onChange={(selectedGrade)=>this.setState({selectedGrade, selectedTest: null, selectedSubject: null, selectedChapter: null,showGradeFilter: false},()=>this.getSubjects())}
                                  onOpen={()=>this.setState({showGradeFilter: true})}
                                  onClose={()=>this.setState({showGradeFilter: false})}
                                />
                                <RadioFilter
                                  title={'Select subject'}
                                  defaultIcon={SubjectIcon}
                                  items={subjects.map(s=>{return(s ?
                                                                 {gradeId: s.gradeId, subjectId: s.subjectId,
                                                                   name: s.subjectName, url: s.subjectImageUrl}
                                                                   : null)})}
                                  selectedItem={selectedSubject}
                                  open={showSubjectFilter}
                                  onChange={(selectedSubject)=>this.setState({selectedSubject, selectedTest: null, showSubjectFilter: false, selectedChapter: null,})}
                                  onOpen={()=>this.setState({showSubjectFilter: true})}
                                  onClose={()=>this.setState({showSubjectFilter: false})}
                                />
                              </div>
                            </GridCell>
                            <GridCell phone={4} tablet={8} desktop={12}
                              style={(!selectedChapter || !selectedSubject) && !selectedTest ?
                                     { padding: '0.5rem 1rem', maxHeight: '20rem', overflowY: 'auto'}
                                     :
                                     {}
                                   }>
                              {
                                selectedGrade && subjects && !selectedSubject && !selectedTest &&
                                <SubjectList
                                  {...this.props}
                                  grade={selectedGrade}
                                  subjects={subjects}
                                  onSelectSubject={this.onSelectSubject}
                                />
                              }
                              {
                                ((selectedGrade && selectedSubject) ||
                                selectedTest ) &&
                                <ChapterList
                                  {...this.props}
                                  grade={selectedGrade}
                                  subject={selectedSubject}
                                  onSelectChapter={this.onSelectChapter}
                                  selectedTest={selectedTest}
                                />
                              }
                            </GridCell>
                        </GridRow>
                      </GridCell>
                      <GridCell phone={4} tablet={8} desktop={12}>
                        <TestList
                          {...this.props}
                          // grade={selectedGrade}
                          // subject={selectedSubject}
                          onSelectTest={this.onSelectTest}
                        />
                      </GridCell>
                    </GridRow>
                  </GridCell>
                </GridRow>
            </GridCell>
          </GridRow>
        </Grid>
      </div>
    );
  }
}

export default Test;
