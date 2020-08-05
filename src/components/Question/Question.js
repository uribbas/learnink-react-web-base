import React from 'react';
import firebase, {db} from '../../provider/database';
import Categories from '../Categories/Categories';
import RadioFilter from '../RadioFilter/RadioFilter';
import QuestionList from './QuestionList';
import ChapterList from '../Chapter/ChapterList';
import EditStandardQuestion from '../StandardQuestion/EditStandardQuestion';
import EditMatchQuestion from '../MatchQuestion/EditMatchQuestion';
// material UI
import Left from '../../assets/icons/chevron_left-black-48dp.svg';
import Right from '../../assets/icons/chevron_right-black-48dp.svg';
import Add from '../../assets/icons/add-black-48dp.svg';
import Box from '../../assets/icons/widgets-black-48dp.svg';
import Idea from '../../assets/icons/perm_data_setting-black-48dp.svg'; //wb_incandescent-black-48dp.svg';
import SubjectIcon from '../../assets/icons/library_books-black-48dp.svg';
import ChapterIcon from '../../assets/icons/bookmarks-black-48dp.svg';

import Loader from '../../assets/icons/loader.gif';
// material UI
import {MenuSurfaceAnchor,MenuSurface} from '@rmwc/menu';
import {Radio} from '@rmwc/radio';
import {
Grid,
GridCell,
GridRow,
 } from '@rmwc/grid';
import { Card } from '@rmwc/card';
import { Typography } from '@rmwc/typography';
import { Button } from '@rmwc/button';

// material UI style
import '@rmwc/menu/styles';
import '@rmwc/radio/styles';
import '@rmwc/grid/styles';
import '@rmwc/card/styles';
import '@rmwc/typography/styles';
import '@rmwc/button/styles';

class Question extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      grades:[],
      subjects:[],
      chapters: [],
      gradevalue: 0,
      subjectvalue: 0,
      selectedGrade: null,
      selectedSubject: null,
      selectedChapter: null,
      showCardAction:  false,
      loader: false,
      showGradeFilter: false,
      showSubjectFilter: false,
      showChapterFilter: false,
      showQTypeFilter: false,
      showDifficultyFilter: false,
      qTypes: ["standard","match"],
      difficulties: ["easy", "moderate", "difficult"],
      selectedQType: {name : "standard", url: Box},
      selectedDifficulty: {name: "easy", url: Idea},
      addQuestion: null,
      qdData: null,
    }

    this.onSelectChapter = this.onSelectChapter.bind(this);

  }

  componentDidMount(){
    this.getGrades();
    // this.getSubjects();
  }

  getGrades(){
    const {showCardAction} = this.props;
    this.setState({loader: true});
    db.collection("grades")
    .onSnapshot((querySnapshot)=>{
        let grades = [];
        querySnapshot.forEach((doc)=>{
            grades.push(doc.data());
        });
        console.log("Grades fetched: ", grades);
        let selectedGrade = { gradeId: grades[0].gradeId, name: grades[0].name, url: grades[0].gradeImageUrl }
        this.setState({grades,showCardAction, selectedGrade, loader: false}, ()=>this.getSubjects());
    });
  }

  getSubjects(){
    const {showCardAction, selectedGrade} = this.state;
    this.setState({loader: true});
    console.log("chapter grade", selectedGrade);
    let subRef = db.collection("subjects");
    if(selectedGrade){
      subRef = subRef.where("gradeId","==", selectedGrade.gradeId);
    }
    subRef
    .onSnapshot((querySnapshot)=>{
        let subjects = [];
        querySnapshot.forEach((doc)=>{
            subjects.push({...doc.data(), docId: doc.id});
        });
        console.log("chapter getSubjects Subjects fetched: ", subjects);
        this.setState({subjects,showCardAction, loader: false});
    });
  }

  getChapters(){
    const {showCardAction, selectedSubject} = this.state;
    this.setState({loader: true});
    console.log("subject", selectedSubject);
    let subRef = db.collection("chapters");
    if(selectedSubject){
      subRef = subRef.where("gradeId","==", selectedSubject.gradeId)
                     .where("subjectId","==", selectedSubject.subjectId);
    }
    subRef
    .onSnapshot((querySnapshot)=>{
        let chapters = [];
        querySnapshot.forEach((doc)=>{
            chapters.push({...doc.data(), docId: doc.id});
        });
        console.log("chapters fetched: ", chapters);
        this.setState({chapters,showCardAction, loader: false});
    });
  }

  addNewQuestion(){
    let {qdData, selectedChapter, selectedQType, selectedDifficulty } = this.state;
    let addQuestion = {
        gradeId: selectedChapter.gradeId,
        subjectId: selectedChapter.subjectId,
        chapterId: selectedChapter.chapterId,
        type: selectedQType.name.toUpperCase(),
        difficulty: selectedDifficulty.name,
        question:'',
        answer: selectedQType.name.toUpperCase()=== 'STANDARD' ?
                { mcqA: '', mcqB: '', mcqC: '', mcqD: '',}
                :
                [{matchText:'',answerText:'',},{matchText:'',answerText:'',}],
        isFillInTheBlanks: false,
        timeTosolve: 30,
        allotedMarks: 1.0,
        stats:{ correctCount:0, wrongCount:0, skipCount:0},
        assistance:{
          '0':{
            hint:'This is the default entry to start assistive solving',
            answer:'not applicable',
            isCorrectFeedback:'',
            isWrongFeedback:'',
            isCorrectStep:-1,
            isWrongStep:-1
          }
        },
        photos:[],
      };
    this.setState({loader: true});
    if(!qdData || selectedChapter.gradeId != qdData.gradeId ||
       selectedChapter.subjectId != qdData.subjectId ||
       selectedChapter.chapterId != qdData.chapterId
     ){
       db.collection('questionDistribution')
         .where("gradeId","==", selectedChapter.gradeId)
         .where("subjectId","==", selectedChapter.subjectId)
         .where("chapterId","==", selectedChapter.chapterId)
         .get()
         .then((querySnapshot)=>{
             let qd = null;
             querySnapshot.forEach((doc)=>{
                 qd = {...doc.data(),docId: doc.id};
             });
             if(!qd){
               qd = {
                    gradeId: selectedChapter.gradeId,
                    subjectId: selectedChapter.subjectId,
                    chapterId: selectedChapter.chapterId,
                    easy: 0,
                    moderate: 0,
                    difficult: 0,
                    standard: 0,
                    match: 0,
                  };
              let qdId = [selectedChapter.gradeId, selectedChapter.subjectId, selectedChapter.chapterId].join('_');
               db.collection('questionDistribution').doc(qdId)
                .set(qd)
                .then((doc)=>{
                  Object.assign(qd,{docId: qdId});
                  this.setState({addQuestion, qdData: qd, loader: false});
                });
             } else {
               this.setState({addQuestion,qdData: qd, loader: false});
             }
         });
    } else {
      this.setState({addQuestion, loader: false});
    }

  }

  onSelectChapter(selectedChapter){
    this.setState({
        selectedChapter: {
          gradeId: selectedChapter.gradeId, subjectId: selectedChapter.subjectId,
          chapterId: selectedChapter.chapterId,
          name: selectedChapter.chapterTitle, url: selectedChapter.chapterImageUrl,
          chapter: selectedChapter,
        }
      });
  }

  render(){
    const {
            showGradeFilter, showSubjectFilter, showChapterFilter, showQTypeFilter, showDifficultyFilter,
            grades, subjects, chapters, qTypes, difficulties,
            selectedGrade, selectedSubject, selectedChapter, selectedQType, selectedDifficulty,
            addQuestion, qdData,
            loader} = this.state;
    console.log("addQuestion", addQuestion);
    if(this.state.loader){
      return(
        <div style={{textAlign: 'center'}}>
            <img src={Loader} style={{padding: '15% 0'}}/>
        </div>);
    }
    return(
      <div style={{ textAlign: 'left', padding: '0rem 0rem'}}>
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
                    Questions
                    <RadioFilter
                      style={{float:'right', margin:'0 !important'}}
                      anchorStyle={{border: 'none !important', background: 'transparent !important', fontSize: '10px'}}
                      title={'Question Types'}
                      items={qTypes.map(q=>{return(q ? {name: q, url: Box} : null)})}
                      selectedItem={selectedQType}
                      open={showQTypeFilter}
                      onChange={(selectedQType)=>this.setState({selectedQType, showQTypeFilter: false, addQuestion: null})}
                      onOpen={()=>this.setState({showQTypeFilter: true})}
                      onClose={()=>this.setState({showQTypeFilter: false})}
                    />
                    <RadioFilter
                      style={{float:'right', margin:'0 !important'}}
                      anchorStyle={{border: 'none !important', background: 'transparent !important', fontSize: '10px'}}
                      title={'Defficulty lavel'}
                      items={difficulties.map(d=>{return(d ? {name: d, url: Idea} : null)})}
                      selectedItem={selectedDifficulty}
                      open={showDifficultyFilter}
                      onChange={(selectedDifficulty)=>this.setState({selectedDifficulty, showDifficultyFilter: false})}
                      onOpen={()=>this.setState({showDifficultyFilter: true})}
                      onClose={()=>this.setState({showDifficultyFilter: false})}
                    />
                  </Typography>
                </Card>
              </GridCell>
              <GridRow>
                <GridCell phone={4} tablet={8} desktop={12} >
                  <RadioFilter
                    title={'Select Grade'}
                    items={grades.map(g=>{return(g ? {gradeId: g.gradeId, name: g.name, url: g.gradeImageUrl} : null)})}
                    selectedItem={selectedGrade}
                    open={showGradeFilter}
                    onChange={(selectedGrade)=>this.setState({selectedGrade, selectedSubject: null, selectedChapter: null, showGradeFilter: false},()=>this.getSubjects())}
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
                    onChange={(selectedSubject)=>this.setState({selectedSubject, selectedChapter: null, showSubjectFilter: false},()=>this.getChapters())}
                    onOpen={()=>this.setState({showSubjectFilter: true})}
                    onClose={()=>this.setState({showSubjectFilter: false})}
                  />
                  <RadioFilter
                    title={'Select chapter'}
                    defaultIcon={ChapterIcon}
                    items={chapters.map(c=>{return(c ?
                                                   {gradeId: c.gradeId, subjectId: c.subjectId,
                                                     chapterId: c.chapterId,
                                                     name: c.chapterTitle, url: c.chapterImageUrl,
                                                     chapter: c,
                                                   }
                                                     : null)})}
                    selectedItem={selectedChapter}
                    open={showChapterFilter}
                    onChange={(selectedChapter)=>this.setState({selectedChapter, showChapterFilter: false, addQuestion: false})}
                    onOpen={()=>this.setState({showChapterFilter: true})}
                    onClose={()=>this.setState({showChapterFilter: false})}
                  />
                  {
                    selectedGrade && selectedSubject && selectedChapter && !addQuestion &&
                    <Button
                      type="button"
                      label="Question"
                      icon={Add}
                      style={{ background: '#ffffff',
                               // fontSize: '10px'
                               border: '1px solid rgba(0,0,0,0.05)',
                               margin: '0.5rem',
                             }}
                      onClick={()=>this.addNewQuestion()}
                    />
                  }
                </GridCell>
              </GridRow>
              <GridCell phone={4} tablet={8} desktop={12} style={{ padding: '0.5rem 1rem',}}>
                {
                  selectedGrade && selectedSubject && chapters && !selectedChapter &&
                  <ChapterList
                    subject={selectedSubject}
                    chapter={selectedChapter ? selectedChapter.chapter : null}
                    chapters={chapters}
                    onSelectChapter={this.onSelectChapter}
                  />
                }
                {
                  selectedGrade && selectedSubject && selectedChapter && addQuestion &&
                  selectedQType.name.toUpperCase() == 'STANDARD' &&
                    <EditStandardQuestion
                      onClickClose={()=>{
                        this.setState({addQuestion: null});
                        console.log("click close of questions add question");
                      }}
                      onClickCancel={()=>{this.setState({addQuestion: null})}}
                      question={addQuestion}
                      qdData={qdData}
                      origin={"Questions"}
                    />
                }
                {
                  selectedGrade && selectedSubject && selectedChapter && addQuestion &&
                  selectedQType.name.toUpperCase() == 'MATCH' &&
                  <EditMatchQuestion
                    onClickClose={()=>{
                      this.setState({addQuestion: null});
                      console.log("click close of questions add question");
                    }}
                    onClickCancel={()=>{this.setState({addQuestion: null})}}
                    question={addQuestion}
                    qdData={qdData}
                    origin={"Questions"}
                  />
                }
                {
                  selectedGrade && selectedSubject && selectedChapter &&
                  // Since we have selected the
                  <QuestionList
                    subject={selectedSubject}
                    chapter={selectedChapter.chapter}
                    selectedQType={selectedQType}
                    selectedDifficulty={selectedDifficulty}
                  />
                }
              </GridCell>
            </GridCell>
          </GridRow>
        </Grid>
      </div>
    );
  }
}

export default Question;
