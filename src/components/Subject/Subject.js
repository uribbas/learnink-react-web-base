import React from 'react';
import firebase, {db} from '../../provider/database';
import Categories from '../Categories/Categories';
import RadioFilter from '../RadioFilter/RadioFilter';
import EditGrade from './EditSubject';
import SubjectList from './SubjectList';
// material UI
import Left from '../../assets/icons/chevron_left-black-48dp.svg';
import Right from '../../assets/icons/chevron_right-black-48dp.svg';
import Add from '../../assets/icons/add-black-48dp.svg';
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

class Subject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      grades:[],
      value: 0,
      selectedGrade: null,
      showFilter: false,
      showCardAction:  false,
      loader: false,
    }

  }

  componentDidMount(){
    this.getGrades();
  }

  getGrades(){
    const {showCardAction} = this.props;
    this.setState({loader: true});
    db.collection("grades")
    .onSnapshot((querySnapshot)=>{
        let grades = [null,];
        querySnapshot.forEach((doc)=>{
            grades.push(doc.data());
        });
        console.log("Grades fetched: ", grades);
        this.setState({grades,showCardAction, loader: false});
    });
  }

  render(){
    const {selectedGrade, grades, loader, showFilter} = this.state;

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
                        Subjects
                      </Typography>
                      {/* <ListDivider /> */}
                    </Card>
                  </GridCell>
                  <GridRow>
                    <GridCell span={12} style={{ padding: '0.5rem 1rem',}}>
                      {
                        <RadioFilter
                          title={'Select grade'}
                          items={grades.map(g=>{return(g ? {gradeId: g.gradeId, name: g.name, url: g.gradeImageUrl} : null)})}
                          selectedItem={selectedGrade}
                          open={showFilter}
                          onChange={(selectedGrade)=>this.setState({selectedGrade, showFilter: false})}
                          onOpen={()=>this.setState({showFilter: true})}
                          onClose={()=>this.setState({showFilter: false})}
                        />
                      }
                    </GridCell>
                  </GridRow>
                <GridCell phone={4} tablet={8} desktop={12} style={{ padding: '0.5rem 1rem',}}>
                  <SubjectList grade={selectedGrade} />
                </GridCell>
            </GridCell>
          </GridRow>
        </Grid>
      </div>
    );
  }
}

export default Subject;
