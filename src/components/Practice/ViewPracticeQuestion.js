import React from 'react';
import firebase, {storage, auth } from '../../provider/database';
import { shuffleArray, getQuestions } from '../../provider/question';
import Latex from 'react-latex';

import Upload from '../../assets/icons/publish-black-48dp.svg';
import closeIcon from '../../assets/icons/close-black-48dp.svg';
import Loader from '../../assets/icons/loader.gif';
import Logo from '../../assets/icons/learnink-logo_500.png';
import Hint from '../../assets/icons/live_help-black-48dp.svg';
import correctFeeddback from '../../assets/icons/grading-black-48dp.svg';
import wrongFeeddback from '../../assets/icons/feedback-black-48dp.svg';
import Left from '../../assets/icons/chevron_left-black-48dp.svg';
import Right from '../../assets/icons/chevron_right-black-48dp.svg';

// material UI

import { Card, CardMedia, CardPrimaryAction, CardMediaContent, CardActions, CardActionButtons, CardActionButton } from '@rmwc/card';
import { Typography } from '@rmwc/typography';
import { Fab } from '@rmwc/fab';
import { Select } from '@rmwc/select';
import { Grid, GridCell, GridRow } from '@rmwc/grid';
import { TextField } from '@rmwc/textfield';
import { Button } from '@rmwc/button';
import { CircularProgress } from '@rmwc/circular-progress';
import { TabBar, Tab } from '@rmwc/tabs';
import {Icon} from '@rmwc/icon';
import { Radio } from '@rmwc/radio';
import Carousel, { Dots } from '@brainhubeu/react-carousel';

// material UI style
import '@rmwc/card/styles';
import '@rmwc/typography/styles';
import '@rmwc/fab/styles';
import '@rmwc/select/styles';
import '@rmwc/grid/styles';
import '@rmwc/textfield/styles';
import '@rmwc/button/styles';
import '@rmwc/circular-progress/styles';
import '@rmwc/tabs/styles';
import '@rmwc/icon/styles';
import '@rmwc/radio/styles';
import '@brainhubeu/react-carousel/lib/style.css';
// Katex css
import 'katex/dist/katex.min.css'

const db = firebase.firestore();

class ViewPracticeQuestion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 0,
      activeAssistTab: 0,
      question: [],
      answer: null,
      value: 0,
      loader: false,
    }
    this.answerarray = ['mcqA','mcqB','mcqC','mcqD'];
    this.question = this.props.question;
    this.onClickEdit = this.props.onClickEdit;
    this.onClickClose = this.props.onClickClose;
    this.generateQuestioncard = this.generateQuestioncard.bind(this);
    this.onchange = this.onchange.bind(this);
  }

  componentDidMount = async ()=> {
    // Typical usage (don't forget to compare props):
    this.setState({loader: true});
    let question = await getQuestions(this.props, true);
    console.log("componentDidMount getQuestions", question);
    this.setState({loader: false, editMode: false , question: question ? question : []});
  }

  componentDidUpdate= async (prevProps)=>{
    if(this.props.chapter !== prevProps.chapter){
      // console.log("componentDidUpdate view practice question", this.props.question.questionSequenceId)
      this.setState({loader: true});
      let question = await getQuestions(this.props, true);
      console.log("componentDidUpdate getQuestions", question);
      this.setState({loader: false,editMode: false , question: question ? question : []});
    }
  }

  onchange(value) {
    this.setState({ value });
  }

  generateQuestioncard(){
    const {question, value, loader} = this.state;
    const {chapter} = this.props;
    console.log("view question", question, this.question);
    if(loader){
      return(
        <div style={{textAlign: 'center'}}>
          <img src={Loader} style={{padding: '15% 0'}}/>
        </div>);
    } else if(!question || question.length == 0){
      return (
        <>
          <GridRow>
            <GridCell phone={4} tablet={8} desktop={12}
              style={{
                background: 'url('+chapter.chapterImageUrl+')',
                backgroundPosition: 'center',
                }}
                >
              <Typography use="subtitle2" tap="span"
                style={{
                  padding: '0.4rem 1rem',
                  // background: '#FFFFFF',
                  // borderTopLeftRadius: '4px',
                  // borderTopRightRadius: '4px',
                  }}
                >
                {''}
              </Typography>
            </GridCell>
            <GridCell phone={4} tablet={8} desktop={12} style={{padding: '0.4rem 1rem'}}>
              <Typography use="body1" tag="span">
                <Latex>No questions found for the selected chapter</Latex>
              </Typography>
            </GridCell>
          </GridRow>
        </>
      );
    } else {
      let q = question[value];
      return (
          <Card style={{ padding: '0rem 0rem',border: '1px solid rgb(0,0,0,0.1)'}}>
            {/* <CardPrimaryAction
              onClick={()=>{}}
              > */}
                <GridRow>
                  <GridCell phone={4} tablet={8} desktop={12}
                    style={{
                      background: 'url('+chapter.chapterImageUrl+')',
                      backgroundPosition: 'center',
                      }}
                      >
                    <Typography use="subtitle2" tap="span"
                      style={{
                        padding: '0.4rem 1rem',
                        background: '#FFFFFF',
                        borderTopLeftRadius: '4px',
                        borderTopRightRadius: '4px',
                        }}
                      >
                      {q.questionSequenceId}
                    </Typography>
                  </GridCell>
                  <GridCell phone={4} tablet={8} desktop={6} style={{padding: '0.4rem 1rem'}}>
                    <Typography use="body1" tag="span">
                      <Latex>{q.question}</Latex>
                    </Typography>
                  </GridCell>
                  <GridCell phone={4} tablet={8} desktop={5} style={{padding: '0.4rem 0.5rem'}}>
                    <GridRow>
                      {
                        q.answerArrays.map(k=>{
                          return (
                            <GridCell key={k} phone={4} tablet={8} desktop={12}>
                              <Radio
                                value={q.answer[k]}
                                checked={this.state.answer === q.answer[k]}
                                onChange={evt => this.setState({answer: evt.currentTarget.value})}
                              >
                                <Latex>{q.answer[k]}</Latex>
                              </Radio>
                            </GridCell>
                          );
                        })
                      }
                    </GridRow>
                  </GridCell>
                </GridRow>
            <CardActions>
              <CardActionButtons>
                <CardActionButton type="button"
                  icon={Logo}
                  disabled={value == 0 }
                  onClick={()=>{
                    // TBA
                    this.onchange(0);
                  }}></CardActionButton>
                <CardActionButton type="button"
                  icon={Left}
                  disabled={value == 0 }
                  onClick={()=>{
                    // TBA
                    this.onchange(value-1);
                  }}></CardActionButton>
                <CardActionButton type="button"
                  icon={Right}
                  disabled={value == question.length -1 }
                  onClick={()=>{
                    // TBA
                    this.onchange(value+1);
                  }}></CardActionButton>
              </CardActionButtons>
              <CardActionButton type="button" onClick={()=>{}}>Submit</CardActionButton>
            </CardActions>
          </Card>
        );
    }

  }


  render(){
    const {question} = this.state;
    if(!question){
      return (<></>);
    }
    if(this.state.loader){
      return(
        <div style={{textAlign: 'center'}}>
          <img src={Loader} style={{padding: '10% 0'}}/>
        </div>);
    }
    return(
      <div>
        {
          this.generateQuestioncard()
        }
      </div>
    );
  }
}

export default ViewPracticeQuestion;