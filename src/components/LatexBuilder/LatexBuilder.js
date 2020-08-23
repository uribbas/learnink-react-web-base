import React from 'react';
// import Latex from 'react-latex';
import Latex from '../../provider/latex';
import * as moment from 'moment';
import Logo from '../../assets/icons/learnink-logo_500.png';
import AddPhoto from '../../assets/icons/add_photo_alternate-black-48dp.svg';
import Loader from '../../assets/icons/loader.gif';
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
      showCoomonPhotoFilter: false,
      selectedCommonPhoto: null,
      question: null,
      commonasset: {photos:[]},
    }

    this.latexItems=[
      {name: ' \\times ', text: ' \\times '},
      {name: ' \\div ', text: ' \\div '},
      {name: ' + ', text: ' + '},
      {name: ' - ', text: ' - '},
      {name: ' = ', text: ' = '},
      {name: ' \\% ', text: ' \\% '},
      {name: ' a + b\\over c ', text: ' \\over '},
      {name: ' x^{ y } ', text: ' ^{ expression } '},
      {name: ' \\sqrt {x} ', text: ' \\sqrt {expression} '},
      {name: ' x^{ \\circ } ', text: ' ^{ \\circ } '},
      {name: ' \\angle ', text: ' \\angle '},
      {name: ' \\frac { x } { y } ', text: ' \\frac { numerator } { denominator } '},
      {name: ' X _{ n } ', text: ' _{ expression } '},
      {name: ' () ', text: ' ( expression ) '},
      {name: ' \\{\\} ', text: ' \{ expression \} '},
      {name: ' [] ', text: ' [ expression ] '},
      {name: ' \\color {red} Ab', text: ' \\color {red} '},
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
    const { question, commonasset } = this.props;
    this.setState({question, commonasset});
  }

  componentDidUpdate(prevProps){
    if(this.props !== prevProps){
      const { question, commonasset } = this.props;
      this.setState({question, commonasset});
    }
  }

  onUploadPhoto(uploadData, origin, description){
    let {question,commonasset} = this.state;
    let imageID = 'IMAGE' + moment().valueOf().toString();
    console.log("Origin photo description", origin, description);
    // question.photos.push({name: imageID , url: null, status: 'NEW', ...uploadData, origin, description});
    if(origin=='Common'){
      if(commonasset && commonasset.photos){
        commonasset.photos.push({name: imageID , url: null, status: 'NEW', ...uploadData, origin, description});
      } else {
        Object.assign(commonasset,{photos:[]});
        commonasset.photos.push({name: imageID , url: null, status: 'NEW', ...uploadData, origin, description});
      }
    } else {
      question.photos.push({name: imageID , url: null, status: 'NEW', ...uploadData, origin, description});
    }
    this.setState({question, commonasset});
  }

  // update the status based changes
  onUpdateStatusPhoto(index, action, origin){
    let {question, commonasset} = this.state;
    if(action=='DELETE'){
      let image = origin=='Common' ? commonasset.photos[index].name : question.photos[index].name;
      let newImgTxt = '';
      // let oldText = "(<\s*" + image + "[^>]*)/\s*>";
      let oldText = "(\\\\\includegraphics)[^}]*" + image + "}";
      // console.log("oldText", oldText, question.question.replace(new RegExp(oldText,'g'),newImgTxt ));
      // // question.question = question.question.replace(new RegExp(oldText,'g'),newImgTxt );
      // console.log("oldText", oldText, question.question, );
      this.replaceTextHandler(oldText, newImgTxt,question);
      if(origin=='Common'){
        let idx = question.photos.findIndex(p=>p.name==image);
        console.log("origin Common", idx, question.photos[idx]);
        if(idx !=-1){
          question.photos[idx].origin = 'Question';
          commonasset.photos.splice(index,1);
        }
      }
      this.setState({question, commonasset});
    } else {
      // console.log("photos", question.photos);
      question.photos[index].status = action;
      this.setState({question});
    }

  }

  onInsertPhotoInQuestion(image,origin){
    let {question} = this.state;
    // let text = "<" + image.name + " width=\"80\" \\/>"
    let text = "\\includegraphics[height=40px, alt=\"Loading...\"]{" + image.name + "}";
    // check if its from commonasset, whether its already added else add it to the list
    let idx = question.photos.findIndex(p=>p.name==image.name);
    if(idx == -1){
      question.photos.push({...image});
    }
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
    let {question, commonasset} = this.state;
    console.log("commonasset", commonasset);
    const { showPhotoFilter, selectedPhoto, showCoomonPhotoFilter, selectedCommonPhoto } = this.state;
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
        title={'Question'}
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
        {/* switching it off for the timebeing */}
        {/* <ImageBuilder
          title={'Common'}
          defaultIcon={Logo}
          isSearchable={true}
          items={commonasset.photos}
          selectedItem={selectedCommonPhoto}
          open={showCoomonPhotoFilter}
          onInsertPhotoInQuestion={this.onInsertPhotoInQuestion}
          onUploadPhoto={this.onUploadPhoto}
          onUpdateStatusPhoto={this.onUpdateStatusPhoto}
          onOpen={()=>this.setState({showCoomonPhotoFilter: true})}
          onClose={()=>this.setState({showCoomonPhotoFilter: false})}
          style={{
            margin: '0.1rem',
            textTransform: 'none',
            // zoom: '0.75',
            // '-moz-transform' : 'scale(0.75)',
          }}
        /> */}

      </div>
    );
  }
}

export default LatexBuilder;
