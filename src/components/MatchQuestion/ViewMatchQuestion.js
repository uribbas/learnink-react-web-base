import React from 'react';
import firebase, {storage, auth } from '../../provider/database';
import {replaceImageWithUrl} from '../../provider/question';
// import Latex from 'react-latex';
import Latex from '../../provider/latex';

import Upload from '../../assets/icons/publish-black-48dp.svg';
import closeIcon from '../../assets/icons/close-black-48dp.svg';
import Loader from '../../assets/icons/loader.gif';
import Logo from '../../assets/icons/learnink-logo_500.png';
import Hint from '../../assets/icons/live_help-black-48dp.svg';
import correctFeeddback from '../../assets/icons/grading-black-48dp.svg';
import wrongFeeddback from '../../assets/icons/feedback-black-48dp.svg';

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
// Katex css
import 'katex/dist/katex.min.css'

const db = firebase.firestore();

class ViewStandardQuestion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 0,
      activeAssistTab: 0,
      question: null,
    }
    this.question = this.props.question;
    this.onClickEdit = this.props.onClickEdit;
    this.onClickClose = this.props.onClickClose;
  }
  componentDidMount() {
    // Typical usage (don't forget to compare props):
    this.question = this.props.question;
    this.setState({editMode: this.question.questionSequenceId ? false : true , question: this.question ? {...this.question} : {}});
  }

  componentDidUpdate(prevProps){
    if(this.props.question !== prevProps.question){
      this.question = this.props.question;
      this.setState({editMode: this.question.questionSequenceId ? false : true , question: this.question ? {...this.question} : {}});
    }
  }

  selectedQuestion(){
    const {question} = this.state;
    console.log("view question", question, this.question);
    if(!question){
      return <></>
    }
    return (
      <Card style={{ padding: '0rem 0rem',border: '1px solid rgb(0,0,0,0.1)'}}>
        {/* <CardPrimaryAction
          onClick={()=>{}}
          > */}
            <GridRow>
              <GridCell phone={1} tablet={2} desktop={1}>
                <Typography use="headline6" tap="span" style={{padding: '0.4rem 1rem'}}>
                  {question.questionSequenceId}
                </Typography>
              </GridCell>
              <GridCell phone={3} tablet={6} desktop={6} style={{paddingTop: '0.4rem', paddingBottom: '0.4rem', paddingRight: '0.5rem'}}>
                <Typography use="body2" tag="span">
                  <Latex trust={true} >{replaceImageWithUrl(question.question,question.photos)}</Latex>
                </Typography>
              </GridCell>
              <GridCell phone={4} tablet={8} desktop={5} style={{paddingTop: '0.4rem', paddingBottom: '0.4rem', paddingRight: '0.5rem'}}>
                {/* <div style={{ padding: '0 1rem 1rem 1rem' }}> */}
                <TabBar
                  activeTabIndex={this.state.activeTab}
                  onActivate={evt => this.setState({activeTab: evt.detail.index})}
                  >
                    {
                      question.answer.map((k,i)=>{
                        return(
                        <Tab key={"MatchOption" + i } type="button">
                          { "M" + i }
                        </Tab>
                        )
                      })
                    }
                </TabBar>
                <Typography use="caption" tag="div" style={{marginTop: '0.5rem',padding: '0.2rem 1rem', background: '#f5f5f56e'}}>
                  <Latex trust={true} >{replaceImageWithUrl(question.answer[this.state.activeTab].matchText,
                                                            question.photos)}</Latex>
                </Typography>
                <Typography use="caption" tag="div" style={{marginTop: '0.5rem', padding: '0.2rem 1rem', background: '#f5f5f56e'}}>
                  <Latex trust={true} >{replaceImageWithUrl(question.answer[this.state.activeTab].answerText,
                                                            question.photos)}</Latex>
                </Typography>
              </GridCell>
              <GridCell phone={4} tablet={8} desktop={12}
                style={{paddingTop: '0.4rem', paddingBottom: '0.4rem', paddingRight: '0.5rem'}}
                >
                <TabBar
                  activeTabIndex={this.state.activeAssistTab}
                  onActivate={evt => this.setState({activeAssistTab: evt.detail.index})}
                  >
                    {
                      Object.keys(question.assistance).map(k=>{
                        return <Tab key={"Step " + k}>{ k }</Tab>
                      })
                    }
                </TabBar>
                <GridRow>
                  <GridCell phone={1} tablet={1} desktop={1}>
                    <Button disabled icon={Hint}/>
                  </GridCell>
                  <GridCell phone={3} tablet={7} desktop={11}>
                    <Typography use="caption" tag="p" style={{padding: '0.2rem 1rem', background: '#f5f5f56e'}}>
                      <Latex trust={true} >{replaceImageWithUrl(question.assistance[this.state.activeAssistTab].hint,
                                                                question.photos)}</Latex>
                    </Typography>
                    <Typography use="caption" tag="p" style={{padding: '0.2rem 1rem', background: '#f5f5f56e'}}>
                      <Latex trust={true} >{"Answer: " + replaceImageWithUrl(question.assistance[this.state.activeAssistTab].answer,
                                                                            question.photos)}</Latex>
                    </Typography>
                  </GridCell>
                  <GridCell phone={1} tablet={1} desktop={1}>
                    <Button disabled icon={correctFeeddback}/>
                    <Typography use="caption" tag="p" style={{textAlign: 'center',padding: '0.2rem 0.5rem'}}>
                      {"Goto " + question.assistance[this.state.activeAssistTab].isCorrectStep}
                    </Typography>
                  </GridCell>
                  <GridCell phone={3} tablet={7} desktop={11}>
                    <Typography use="caption" tag="div" style={{padding: '0.2rem 1rem', background: '#f5f5f56e'}}>
                      <Latex trust={true} >{replaceImageWithUrl(question.assistance[this.state.activeAssistTab].isCorrectFeedback,
                                                                question.photos)}</Latex>
                    </Typography>
                  </GridCell>
                  <GridCell phone={1} tablet={1} desktop={1}>
                    <Button disabled icon={wrongFeeddback}/>
                    <Typography use="caption" tag="p" style={{textAlign: 'center',padding: '0.2rem 0.5rem'}}>
                      {"Goto " + question.assistance[this.state.activeAssistTab].isWrongStep}
                    </Typography>
                    {/* <Button disabled label={"Goto " + question.assistance[this.state.activeAssistTab].isWrongStep}/> */}
                  </GridCell>
                  <GridCell phone={3} tablet={7} desktop={11}>
                    <Typography use="caption" tag="div" style={{padding: '0.2rem 1rem', background: '#f5f5f56e'}}>
                      <Latex trust={true} >{replaceImageWithUrl(question.assistance[this.state.activeAssistTab].isWrongFeedback,
                                                                question.photos)}</Latex>
                    </Typography>
                  </GridCell>
                </GridRow>
              </GridCell>
            </GridRow>
        <CardActions>
          <CardActionButtons>
            <CardActionButton onClick={()=>{this.onClickEdit();}}>Edit</CardActionButton>
            {/* <CardActionButton onClick={()=>{}}>Add question</CardActionButton> */}
            <CardActionButton type="button"
              onClick={()=>{
                this.onClickClose();
              }}>Close</CardActionButton>
          </CardActionButtons>
        </CardActions>
      </Card>
    );
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
          this.selectedQuestion()
        }
      </div>
    );
  }
}

export default ViewStandardQuestion;
