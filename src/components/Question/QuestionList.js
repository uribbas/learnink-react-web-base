import React from 'react';
import firebase, {db} from '../../provider/database';
import Categories from '../Categories/Categories';
import StandardQuestion from '../StandardQuestion/StandardQuestion';
import MatchQuestion from '../MatchQuestion/MatchQuestion';

import Latex from 'react-latex';

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
import {ListDivider} from '@rmwc/list';
import { Card, CardMedia, CardPrimaryAction, CardMediaContent, CardActions, CardActionButtons, CardActionButton } from '@rmwc/card';
import { Typography } from '@rmwc/typography';
import { TextField } from '@rmwc/textfield';
import { Button } from '@rmwc/button';
import { IconButton } from '@rmwc/icon-button';
import Carousel, { Dots } from '@brainhubeu/react-carousel';
import { Icon } from '@rmwc/icon';
import { ImageList, ImageListItem, ImageListImage, ImageListSupporting, ImageListLabel,ImageListImageAspectContainer } from '@rmwc/image-list';
import { Badge } from '@rmwc/badge';
// material UI style
import '@rmwc/grid/styles';
import '@rmwc/list/styles';
import '@rmwc/card/styles';
import '@rmwc/typography/styles';
import '@rmwc/textfield/styles';
import '@rmwc/button/styles';
import '@rmwc/icon-button/styles';
import '@brainhubeu/react-carousel/lib/style.css';
import '@rmwc/icon/styles';
import '@rmwc/image-list/styles';
import '@rmwc/badge/styles';

// Katex css
import 'katex/dist/katex.min.css'

class QuestionList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      questions:[],
      value: 0,
      editItem: null,
      showCardAction:  false,
      loader: false,
    }
    this.generateSubjectList = this.generateSubjectList.bind(this);
    this.onchange = this.onchange.bind(this);
    this.onShowEdit = this.onShowEdit.bind(this);

  }

  componentDidMount(){
    this.getQuestions();
  }

  componentDidUpdate(prevProps){
    console.log("componentDidUpdate QuestionList");
    if(this.props.chapter !== prevProps.chapter ||
       this.props.selectedDifficulty !== prevProps.selectedDifficulty ||
       this.props.selectedQType !== prevProps.selectedQType ){
      // this.setState({subject});
      this.getQuestions();
    }
  }

  getQuestions(){
    const {showCardAction, subject, chapter, selectedDifficulty, selectedQType} = this.props;
    this.setState({loader: true});
    console.log("subject", chapter, selectedQType,selectedDifficulty);
    let questionRef = db.collection("questions")
                     .where("gradeId","==", chapter.gradeId)
                     .where("subjectId","==", chapter.subjectId)
                     .where("chapterId","==", chapter.chapterId)
                     .where("difficulty","==",selectedDifficulty.name)
                     .where("type","==",selectedQType.name.toUpperCase())
                     .orderBy("questionSequenceId",'asc')
                     .limit(20);

    questionRef
    .onSnapshot((querySnapshot)=>{
        let questions = [];
        querySnapshot.forEach((doc)=>{
            questions.push({...doc.data(), docId: doc.id});
        });
        console.log("questions fetched: ", questions);
        this.setState({questions,showCardAction, editItem: null, loader: false});
    });
  }

  onchange(value) {
    this.setState({ value });
  }

  generateSubjectList(){
    const {questions, editItem} = this.state;
    return (
      <div>
        {
          questions.map((q,i) => (
              <Card key={q.docId} style={{ margin: '0.4rem 0', padding: '0',border: '1px solid rgb(0,0,0,0)'}}>
                <CardPrimaryAction
                  onClick={()=>{
                    this.setState({ value: i, editItem: q });
                    // window.scrollTo(0,200);
                    window.scrollTo({
                                      top: 100,
                                      left: 0,
                                      behavior: 'smooth'
                                    });
                  }}
                  >
                    <div>
                      <GridRow>
                        <GridCell phone={1} tablet={2} desktop={2}>
                          <Typography use="headline6" tap="span" style={{padding: '0.4rem 1rem'}}>
                            {q.questionSequenceId}
                          </Typography>
                        </GridCell>
                        <GridCell phone={3} tablet={6} desktop={10} style={{paddingTop: '0.4rem', paddingBottom: '0.4rem', paddingRight: '0.5rem'}}>
                          <Typography use="body2" tag="span">
                            <Latex>{q.question}</Latex>
                          </Typography>
                        </GridCell>
                        <GridCell phone={1} tablet={2} desktop={2} style={{padding: '0 0 1rem'}}>
                        </GridCell>
                        <GridCell phone={3} tablet={6} desktop={10} style={{padding: '0 0 1rem'}}>
                          <Badge align="inline"
                            style={{margin: '-1rem', color: '#ffffff', background: 'linear-gradient(40deg, #ff6e7f, #bfe9ff)'}}
                          />
                          <Typography use="body2" tap="span" style={{padding: '0.5rem 1rem'}}>
                            Steps {q.assistance ? Object.keys(q.assistance).length : 0}
                          </Typography>
                        {/* </GridCell>
                        <GridCell phone={1} tablet={3} desktop={3}> */}
                          <Badge align="inline"
                            style={{margin: '-1rem', color: '#ffffff', background: 'linear-gradient(40deg, #403B4A, #E7E9BB)'}}
                          />
                          <Typography use="body2" tap="span" style={{padding: '0.5rem 1rem'}}>
                            { q.isFillInTheBlanks ? 'Both' : 'MCQ' }
                          </Typography>
                        </GridCell>
                      </GridRow>
                    </div>
                    {/* <CardActions>

                    </CardActions> */}
                </CardPrimaryAction>
              </Card>
          ))
        }
      </div>
    );
  }

  onShowEdit(subject){
    this.setState({editItem: subject});
  }

  render(){
    const {editItem, loader} = this.state;
    // if(!grade){
    //   return (<></>);
    // }
    if(this.state.loader){
      return(
        <div style={{textAlign: 'center'}}>

                  {/* <CircularProgress size="xlarge" style={{padding: '25% 40%'}}/> */}
                  <img src={Loader} style={{padding: '15% 0'}}/>

          </div>);
    }
    return(
      <div style={{ textAlign: 'left', padding: '0rem 0rem'}}>
        {
          editItem &&
          <GridRow style={{
            background: '#fff', //'linear-gradient(90deg,#EDE574,#E1F5C4)',
            borderRadius: '3px'
          }}>
            <GridCell phone={4} tablet={8} desktop={12} style={{ padding: '0 0',}}>
              {
                editItem.type === 'STANDARD' &&
                <StandardQuestion
                  backToQlist={()=>this.setState({editItem: null})}
                  question={editItem}
                />
              }
              {
                editItem.type == 'MATCH' &&
                <MatchQuestion
                  backToQlist={()=>this.setState({editItem: null})}
                  question={editItem}
                />
              }
            </GridCell>
          </GridRow>
        }
        <GridCell phone={4} tablet={8} desktop={4} style={{ margin: '1rem 0 ', maxHeight: window.innerHeight, overflowY: 'auto'}}>
        {
          // !editItem &&
          this.generateSubjectList()
        }
        </GridCell>
      </div>
    );
  }
}

export default QuestionList;
