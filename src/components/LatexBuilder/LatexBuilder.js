import React from 'react';
// import Latex from 'react-latex';
import Latex from '../../provider/latex';
import * as moment from 'moment';
import Logo from '../../assets/icons/learnink-logo_500.png';
import AddPhoto from '../../assets/icons/add_photo_alternate-black-48dp.svg';
import ImageBuilder from './ImageBuilder';
// material UI
import {
Grid,
GridRow,
GridCell,
 } from '@rmwc/grid';
 import { Typography } from '@rmwc/typography';
 import { Button } from '@rmwc/button';
 import { IconButton } from '@rmwc/icon-button';
import { TopAppBar, TopAppBarRow, TopAppBarSection, TopAppBarNavigationIcon,
  TopAppBarTitle, TopAppBarActionItem, TopAppBarFixedAdjust } from '@rmwc/top-app-bar';

// material UI style
import '@rmwc/grid/styles';
import '@rmwc/typography/styles';
import '@rmwc/button/styles';
import '@rmwc/icon-button/styles';
import '@rmwc/top-app-bar/styles';
// Katex css
import 'katex/dist/katex.min.css'

class LatexBuilder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dummy: false,
      showPhotoFilter: false,
      selectedPhoto: null,
      question: null,
    }

    this.latexItems=[
      {name: ' \\times ', text: ' \\times '},
      {name: ' \\div ', text: ' \\div '},
      {name: ' + ', text: ' + '},
      {name: ' - ', text: ' - '},
      {name: ' = ', text: ' = '},
      {name: ' a + b\\over c ', text: ' \\over '},
      {name: ' x^{ y } ', text: ' ^{ expression } '},
      {name: ' \\sqrt {x} ', text: ' \\sqrt {expression} '},
      {name: ' x^{ \\circ } ', text: ' ^{ \\circ } '},
      {name: ' \\frac { x } { y } ', text: ' \\frac { numerator } { denominator } '},
      {name: ' X _{ n } ', text: ' _{ expression } '},
      {name: ' () ', text: ' ( expression ) '},
      {name: ' \\{\\} ', text: ' \{ expression \} '},
      {name: ' [] ', text: ' [ expression ] '},
      {name: ' ↵ ', text: ' $\\\\$ '},
      {name: ' fx ',text: ' $ expression $ '},
      // {name: '', icon: Logo, text: ' <img src=\"address\" width="20" \/> '}
    ];

    this.parentHandler = this.props.parentHandler;
    this.replaceTextHandler = this.props.replaceTextHandler;
    this.onUploadPhoto = this.onUploadPhoto.bind(this);
    this.onUpdateStatusPhoto = this.onUpdateStatusPhoto.bind(this);
    this.onInsertPhotoInQuestion = this.onInsertPhotoInQuestion.bind(this);
  }

  componentDidMount(){
    const { question } = this.props;
    this.setState({question});
  }

  componentDidUpdate(prevProps){
    if(this.props !== prevProps){
      const { question } = this.props;
      this.setState({question});
    }
  }

  onUploadPhoto(uploadData){
    let {question} = this.state;
    let imageID = 'IMAGE' + moment().valueOf().toString();
    question.photos.push({name: imageID , url: null, status: 'NEW', ...uploadData});
    this.setState({question});
  }
  onUpdateStatusPhoto(index, action){
    let {question} = this.state;
    question.photos[index].status = action;
    if(action=='DELETE'){
      let image = question.photos[index].name;
      let newImgTxt = '';
      // let oldText = "(<\s*" + image + "[^>]*)/\s*>";
      let oldText = "(\\\\\includegraphics)[^}]*" + image + "}";
      // console.log("oldText", oldText, question.question.replace(new RegExp(oldText,'g'),newImgTxt ));
      // // question.question = question.question.replace(new RegExp(oldText,'g'),newImgTxt );
      // console.log("oldText", oldText, question.question, );
      this.replaceTextHandler(oldText, newImgTxt,question);
    } else {
      // console.log("photos", question.photos);
      this.setState({question});
    }

  }

  onInsertPhotoInQuestion(image){
    // let text = "<" + image.name + " width=\"80\" \\/>"
    let text = "\\includegraphics[height=40px]{" + image.name + "}";
    this.parentHandler(text);
  }

  createLatexItems(){
    return this.latexItems.map(i=>{
      return(
        // <GridCell phone={1} tablet={1} desktop={1}>
          <Button
            key={i.name}
            outlined
            style={{
              margin: '0.1rem',
              textTransform: 'none',
              // zoom: '0.75',
              // '-moz-transform' : 'scale(0.75)',
            }}
            type="button"
            icon={ i.icon }
            label={<Latex>{"$ " + i.name + " $"}</Latex>}
            onClick={()=>{
              this.parentHandler(i.text)
            }}
          />
        // </GridCell>

      );
    })

  }

  render(){
    let {question} = this.state;
    const { showPhotoFilter, selectedPhoto } = this.state;
    if(!question){
      return <></>
    }
    return(
      <div style={{
        zoom: '0.75',
        MozTransform : 'scale(0.75)',
        textAlign: 'center'
      }}>
      <ImageBuilder
        title={''}
        defaultIcon={AddPhoto}
        items={question.photos}
        selectedItem={selectedPhoto}
        open={showPhotoFilter}
        onInsertPhotoInQuestion={this.onInsertPhotoInQuestion}
        onUploadPhoto={this.onUploadPhoto}
        onUpdateStatusPhoto={this.onUpdateStatusPhoto}
        onOpen={()=>this.setState({showPhotoFilter: true})}
        onClose={()=>this.setState({showPhotoFilter: false})}
        style={{
          margin: '0.1rem',
          textTransform: 'none',
          // zoom: '0.75',
          // '-moz-transform' : 'scale(0.75)',
        }}
      />
        {/* <GridRow> */}
          {
            this.createLatexItems()
          }
        {/* </GridRow> */}

      </div>
    );
  }
}

export default LatexBuilder;
