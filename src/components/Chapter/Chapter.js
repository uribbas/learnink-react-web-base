import React from 'react';
import firebase, {db} from '../../provider/database';
import Categories from '../Categories/Categories';
import RadioFilter from '../RadioFilter/RadioFilter';
import SubjectList from '../Subject/SubjectList';
import ChapterList from './ChapterList';
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

// material UI style
import '@rmwc/grid/styles';
import '@rmwc/card/styles';
import '@rmwc/typography/styles';

class Chapter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      grades:[],
      subjects:[],
      selectedGrade: null,
      selectedSubject: null,
      showCardAction:  false,
      loader: false,
      showGradeFilter: false,
      showSubjectFilter: false,
    }

  }

  componentDidMount(){
    this.getGrades();
    this.getSubjects();
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

  onchange(value,type) {
    if(type=="grade"){
      this.setState({ gradevalue: value });
    } else {
      this.setState({ subjectvalue: value });
    }

  }

  render(){
    const {showGradeFilter, showSubjectFilter, grades, subjects, selectedGrade, selectedSubject, loader} = this.state;
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
                        Chapters
                      </Typography>
                      {/* <ListDivider /> */}
                    </Card>
                  </GridCell>
                  <GridRow>
                    <GridCell phone={4} tablet={8} desktop={12} style={{ padding: '0.5rem 0.5rem',}}>
                      <RadioFilter
                        title={'Select Grade'}
                        items={grades.map(g=>{return(g ? {gradeId: g.gradeId, name: g.name, url: g.gradeImageUrl} : null)})}
                        selectedItem={selectedGrade}
                        open={showGradeFilter}
                        onChange={(selectedGrade)=>this.setState({selectedGrade, selectedSubject: null, showGradeFilter: false},()=>this.getSubjects())}
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
                        onChange={(selectedSubject)=>this.setState({selectedSubject, showSubjectFilter: false})}
                        onOpen={()=>this.setState({showSubjectFilter: true})}
                        onClose={()=>this.setState({showSubjectFilter: false})}
                      />
                    </GridCell>
                  </GridRow>
                <GridCell phone={4} tablet={8} desktop={12} style={{ padding: '0.5rem 1rem',}}>
                  {
                    selectedGrade && subjects && !selectedSubject &&
                    <SubjectList
                      grade={selectedGrade}
                      subjects={subjects}
                    />
                  }
                  {
                    selectedGrade && selectedSubject &&
                    <ChapterList subject={selectedSubject} />
                  }
                </GridCell>
            </GridCell>
          </GridRow>
        </Grid>
      </div>
    );
  }
}

export default Chapter;
