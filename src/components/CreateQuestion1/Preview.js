import React from 'react';
// import Latex from 'react-latex';
import Latex from '../../provider/latex';
import firebase from '../../provider/database';
// material UI
import { List, ListItem, ListItemText, ListItemPrimaryText, ListItemSecondaryText, ListDivider } from '@rmwc/list';
import { Typography } from '@rmwc/typography';
import { Button } from '@rmwc/button';
// Material UI style
import '@rmwc/list/styles';
import '@rmwc/typography/styles';
import '@rmwc/button/styles';
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
            <Typography use="caption"><Latex>{hint.answer}</Latex></Typography>
          </div>
          <div>
            <Typography use="overline">Correct</Typography>
            <br/>
            <Typography use="subtitle2">Next Step</Typography>
            &nbsp;
            <Typography use="caption"><Latex>{hint.isCorrectStep}</Latex></Typography>
            &nbsp;
            <Typography use="subtitle2">Feedback</Typography>
            &nbsp;
            <Typography use="caption"><Latex>{hint.isCorrectFeedback}</Latex></Typography>
          </div>
          <div>
            <Typography use="overline">Incorrect</Typography>
            <br/>
            <Typography use="subtitle2">Next Step</Typography>
            &nbsp;
            <Typography use="caption"><Latex>{hint.isWrongStep}</Latex></Typography>
            &nbsp;
            <Typography use="subtitle2">Feedback</Typography>
            &nbsp;
            <Typography use="caption"><Latex>{hint.isWrongFeedback}</Latex></Typography>
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
              <Latex>{ this.question.question }</Latex>
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
        <div>
          <Button type="button" label="1"/>
          <Button type="button" label="2"/>
          <Button type="button" label="3"/>
          <Button type="button" label="4"/>
          <Button type="button" label="5"/>
          <Button type="button" label="6"/>
          <Button type="button" label="7"/>
          <Button type="button" label="8"/>
          <Button type="button" label="9"/>
          <Button type="button" label="10"/>
        </div>
      </div>



    )
  }
}
export default Preview;
