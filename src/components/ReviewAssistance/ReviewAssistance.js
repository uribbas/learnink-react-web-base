import React from 'react';
import firebase, {storage, auth } from '../../provider/database';
import { shuffleArray, getQuestions } from '../../provider/question';
import {replaceImageWithUrl} from '../../provider/question';
// import Latex from 'react-latex';
import Latex from '../../provider/latex';

import Upload from '../../assets/icons/publish-black-48dp.svg';
import closeIcon from '../../assets/icons/close-black-48dp.svg';
import Loader from '../../assets/icons/loader.gif';
import Send from '../../assets/icons/send-black-48dp.svg';
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

class ReviewAssistance extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      question: null,
      currentStep: 0,
      response: null,
      stepFeedback: null,
      loader: false,
    }
    this.answerarray = ['mcqA','mcqB','mcqC','mcqD'];
    this.question = this.props.question;
    this.onClickEdit = this.props.onClickEdit;
    this.onClickClose = this.props.onClickClose;
    this.generateStepcard = this.generateStepcard.bind(this);
  }

  componentDidMount() {
    const {question} = this.props;
    let s = question.assistance['0'];
    let registeredAnswer = question.answer[question.registeredAnswer];
    let stepFeedback = registeredAnswer == question.answer.mcqA ? s.isCorrectFeedback : s.isWrongFeedback;
    let currentStep =  registeredAnswer == question.answer.mcqA ? s.isCorrectStep : s.isWrongStep;
    this.setState({question: question, response: '', stepFeedback, currentStep});
  }

  componentDidUpdate= async (prevProps)=>{
    if(this.props.chapter !== prevProps.chapter){
      const {question} = this.props;
      let s = question.assistance['0'];
      let registeredAnswer = question.answer[question.registeredAnswer];
      let stepFeedback = registeredAnswer == question.answer.mcqA ? s.isCorrectFeedback : s.isWrongFeedback;
      let currentStep =  registeredAnswer == question.answer.mcqA ? s.isCorrectStep : s.isWrongStep;
      this.setState({question: question, response: '', stepFeedback, currentStep});
    }
  }

  generateStepcard(){
    const {question, currentStep,response, stepFeedback, loader } = this.state;
    if(loader){
      return(
        <div style={{textAlign: 'center'}}>
          <img src={Loader} style={{padding: '15% 0'}}/>
        </div>);
    } else {
      let s = question.assistance[currentStep.toString()];
      return (
        <form
          style={{

          }}
          >
          <GridRow>
            <GridCell phone={4} tablet={8} desktop={12}>
              <Typography use="button" tag="div"
                style={{
                  color: 'rgb(32, 150, 255)',
                  boxShadow: '0px 3px 1px -1px rgba(32, 150, 255, 0.2), 0px 1px 1px 0px rgba(32, 150, 255, 0.0), 0px 1px 3px 0px rgba(32, 150, 255, 0.0)'
                  }}
                >
                Let's review steps
              </Typography>
            </GridCell>
            <GridCell phone={4} tablet={8} desktop={12}>
              <Typography use="body1" tag="span">
                <Latex trust={true} >{replaceImageWithUrl(stepFeedback, question.photos)}</Latex>
              </Typography>
            </GridCell>
            {
              currentStep != -1 &&
              <GridCell phone={4} tablet={8} desktop={12}>
                <Typography use="body1" tag="span">
                  <Latex trust={true} >{replaceImageWithUrl(s.hint, question.photos)}</Latex>
                </Typography>
              </GridCell>
            }
            {
              currentStep != -1 &&
              <GridCell phone={4} tablet={8} desktop={12}>
                <Typography use="body1" tag="span">
                  <TextField label="Your response...."
                    reqired
                    helpText={{
                      persistent: true,
                      validationMsg: true,
                      children: 'Your response is required'
                    }}
                    value={response}
                    onChange={(e)=>{
                      this.setState({response: e.target.value})
                    }}
                    trailingIcon={{
                      icon: Send,
                      tabIndex: 0,
                      disabled: currentStep == -1 || !response,
                      required: true,
                      onClick: () => {
                        const {response} = this.state;
                        if(!response){
                          // Do nothing
                        } else {
                          let stepFeedback = s.answer == response ? s.isCorrectFeedback : s.isWrongFeedback;
                          let currentStep = s.answer == response ? s.isCorrectStep : s.isWrongStep;
                          this.setState({response: '', stepFeedback, currentStep});
                        }
                      }
                    }}
                  />
                </Typography>
              </GridCell>
            }
            {/* <CardActions>
              <CardActionButtons>
                <CardActionButton
                  type="button"
                  // outlined
                  icon={Send}
                  disabled={currentStep == -1 || !response}
                  onClick={()=>{
                    // TBA
                    const {response} = this.state;
                    let stepFeedback = s.answer == response ? s.isCorrectFeedback : s.isWrongFeedback;
                    let currentStep = s.answer == response ? s.isCorrectStep : s.isWrongStep;
                    this.setState({response: '', stepFeedback, currentStep});

                  }}
                  ></CardActionButton>
              </CardActionButtons>
            </CardActions> */}
          </GridRow>
        </form>

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
          this.generateStepcard()
        }
      </div>
    );
  }
}

export default ReviewAssistance;
