import React from 'react';
import firebase from '../../provider/database';
import Grade from './Grade';
import Subject from './Subject';
import Chapter from './Chapter';
import EditGrade from './EditGrade';
import EditSubject from './EditSubject';
import EditChapter from './EditChapter';
import AppHeader from '../AppHeader/AppHeader';

// material UI
import { Typography } from '@rmwc/typography';
import { Button } from '@rmwc/button';
import { IconButton } from '@rmwc/icon-button';

// material UI style
import '@rmwc/typography/styles';
import '@rmwc/button/styles';
import '@rmwc/icon-button/styles';

class MaintainCatalogue extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expandGrades: true,
      expandSubjects: true,
      showEdit: false,
      selectedItem: null,
      gradeId: '',
      subjectId: '',
      chapterId: '',
    }
    // this.setComponentProps = this.props.setComponentProps;
    this.onSelectGrade = this.onSelectGrade.bind(this);
    this.onSelectSubject = this.onSelectSubject.bind(this);
    this.onSelectChapter = this.onSelectChapter.bind(this);
    this.onShowEdit = this.onShowEdit.bind(this);
  }

  componentDidMount(prevProps) {
    // Typical usage (don't forget to compare props):
    // if (this.props !== prevProps) {
      let {gradeId, subjectId, chapterId } = this.props;
      console.log("componentDidMount props received", gradeId, subjectId, chapterId);
      // force re-render the DOM
      this.setState({gradeId, subjectId, chapterId });
    // }
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props !== prevProps) {
      let {gradeId, subjectId, chapterId } = this.props;
      console.log("componentDidUpdate props received", gradeId, subjectId, chapterId);
      // force re-render the DOM
      this.setState({gradeId, subjectId, chapterId });
    }
  }

  onSelectGrade(gradeId){
    this.setState({gradeId: gradeId, subjectId: '', chapterId: '', expandSubjects: true})
  }
  onSelectSubject(subjectId){
    this.setState({subjectId: subjectId, chapterId: ''})
  }
  onSelectChapter(chapterId){
    this.setState({chapterId: chapterId})
  }

  onShowEdit(editType,selectedItem){
    console.log("selected item", selectedItem);
    this.setState({
      showEdit: editType ? editType : false,
      selectedItem: selectedItem,
    });
  }

  render(){
    return(
      <>
        {/* <AppHeader {...this.props}/> */}
        <div style={{ textAlign: 'left', padding: '0.5rem 1rem'}} style={{height: '20% !important'}}>
          {
            !this.state.showEdit &&
            <div>
              <Typography use="overline">Grades</Typography>
              <Button label="Add" outlined style={{margin: '0.5rem'}}
                onClick={()=>this.onShowEdit("grade")}
              />
              <Typography use="caption"
                onClick={()=>this.setState({expandGrades: !this.state.expandGrades})}
              >
                {this.state.expandGrades ? "Hide" : "Expand" }
              </Typography>
              {
                this.state.expandGrades &&
                <Grade
                  onSelectGrade={this.onSelectGrade}
                  onShowEdit={this.onShowEdit}
                />
              }
            </div>
          }
          {
            !this.state.showEdit && this.state.gradeId &&
            <div>
              <Typography use="overline">{this.state.gradeId ?
                                          'Subjects for Grade ' + this.state.gradeId
                                          :
                                          'Subjects'
                                        }
              </Typography>
              <Button label="Add" outlined style={{margin: '0.5rem'}}
                onClick={()=>this.onShowEdit("subject")}
              />
              <Typography use="caption"
                onClick={()=>this.setState({expandSubjects: !this.state.expandSubjects})}
              >
                {this.state.expandSubjects ? "Hide" : "Expand" }
              </Typography>
              {
                 this.state.expandSubjects &&
                 <Subject
                   gradeId={this.state.gradeId}
                   onSelectSubject={this.onSelectSubject}
                   onShowEdit={this.onShowEdit}
                 />
              }
            </div>
          }
          {
            !this.state.showEdit && this.state.subjectId &&
            <div>
              <Typography use="overline">{this.state.subjectId ?
                                          'Chapters for grade ' +  this.state.gradeId + ' Subject ' + this.state.subjectId
                                          :
                                          'Chapters'
                                        }
              </Typography>
              <Button label="Add" outlined style={{margin: '0.5rem'}}
                onClick={()=>this.onShowEdit("chapter")}
              />
              <Chapter
                gradeId={this.state.gradeId}
                subjectId={this.state.subjectId}
                onSelectChapter={this.onSelectChapter}
                onShowEdit={this.onShowEdit}
                setComponentProps={this.setComponentProps}
              />
            </div>
          }
          {
            this.state.showEdit == "grade" &&
            <EditGrade
              grade={this.state.selectedItem}
              onShowEdit={this.onShowEdit}
            />
          }
          {
            this.state.showEdit == "subject" &&
            <EditSubject
              gradeId={this.state.gradeId}
              subject={this.state.selectedItem}
              onShowEdit={this.onShowEdit}
            />
          }
          {
            this.state.showEdit == "chapter" &&
            <EditChapter
              gradeId={this.state.gradeId}
              subjectId={this.state.subjectId}
              chapter={this.state.selectedItem}
              onShowEdit={this.onShowEdit}
            />
          }
        </div>
      </>


    );
  }
}

export default MaintainCatalogue;
