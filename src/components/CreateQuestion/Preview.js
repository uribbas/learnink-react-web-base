import React from 'react';
import Latex from 'react-latex';
// import Latex from 'react-latex-next'
import firebase from '../../provider/database';
// material UI
import { List, ListItem, ListItemText, ListItemPrimaryText, ListItemSecondaryText, ListDivider } from '@rmwc/list';
import { Typography } from '@rmwc/typography';
// Material UI style
import '@rmwc/list/styles';
import '@rmwc/typography/styles';
// Katex css
import 'katex/dist/katex.min.css'

// var Latex = require('react-latex');

class Preview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // TBA
    };
    this.question = this.props.question;
    this.hints = this.props.hints;
  }

  generateHintPreview = (hint,step) =>{

    return (
      <div>
        <div>
          <Typography use="overline">{'Step ' + (step + 1)}</Typography>
          <br/>
          <Typography
            use="caption"
            // tag="div"
            theme="textSecondaryOnBackground"
          >
              <Latex>{ hint.hint }</Latex>
          </Typography>
          <div>
            <Typography use="overline">Answer</Typography>
            &nbsp;
            <Typography use="caption">{hint.answer}</Typography>
          </div>
          <div>
            <Typography use="overline">Correct</Typography>
            <br/>
            <Typography use="subtitle2">Next Step</Typography>
            &nbsp;
            <Typography use="caption">{hint.isCorrectStep}</Typography>
            &nbsp;
            <Typography use="subtitle2">Feedback</Typography>
            &nbsp;
            <Typography use="caption">{hint.isCorrectFeedback}</Typography>
          </div>
          <div>
            <Typography use="overline">Incorrect</Typography>
            <br/>
            <Typography use="subtitle2">Next Step</Typography>
            &nbsp;
            <Typography use="caption">{hint.isWrongStep}</Typography>
            &nbsp;
            <Typography use="subtitle2">Feedback</Typography>
            &nbsp;
            <Typography use="caption">{hint.isWrongFeedback}</Typography>
          </div>
        </div>
        <List>
          <ListDivider />
        </List>
      </div>
    );

  }
  render() {
    return(
      <div style={{ padding: '1rem 1rem 1rem 1rem', textAlign: 'left'}}>
        <div >
          <Typography use="overline">Question</Typography>
          <br/>
          <Typography
            use="body1"
            // tag="div"
            theme="textSecondaryOnBackground"
          >
              <Latex>{ this.question.question.text }</Latex>
          </Typography>
        </div>
        <List>
          <ListDivider />
        </List>
        <div>
          <Typography use="overline">Answer</Typography>
          <br/>
          <Typography
            use="caption"
            // tag="div"
            theme="textSecondaryOnBackground"
          >
              <Latex>{ this.question.answer.mcqA }</Latex>
          </Typography>
        </div>
        <List>
          <ListDivider />
        </List>
        {
          this.hints.map((h,i)=>this.generateHintPreview(h,i))
        }
      </div>



    )
  }
}
export default Preview;
