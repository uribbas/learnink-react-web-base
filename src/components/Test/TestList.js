import React from 'react';
import * as moment from 'moment';
import firebase, {db} from '../../provider/database';
import Categories from '../Categories/Categories';
import EditChapter from './EditChapter';
// material UI
import Left from '../../assets/icons/chevron_left-black-48dp.svg';
import Right from '../../assets/icons/chevron_right-black-48dp.svg';
import Add from '../../assets/icons/add-black-48dp.svg';
import Loader from '../../assets/icons/loader.gif';
import Logo from '../../assets/icons/learnink-logo_500.png';
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
import { Switch } from '@rmwc/switch';
import {CollapsibleList, SimpleListItem} from '@rmwc/list';
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
import '@rmwc/switch/styles';
import '@rmwc/list/styles';

class TestList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chapters:[],
      value: 0,
      editItem: null,
      showCardAction:  false,
      loader: false,
      tests: [],
    }
    this.generateTestList = this.generateTestList.bind(this);
    this.onchange = this.onchange.bind(this);
    this.onShowEdit = this.onShowEdit.bind(this);

  }

  componentDidMount(){
    this.getTests();
  }

  componentDidUpdate(prevProps){
    if(this.props.subject !== prevProps.subject){
      // this.setState({subject});
      this.getChapters();
    } else if(this.props.chapter !== prevProps.chapter){
      this.setState({editItem: this.props.chapter });
      // this.onShowEdit(this.props.chapter);
    }
  }

  getTests(){
    const {test} = this.state;
    const {showCardAction, userProfile} = this.props;
    if(!userProfile){
      // Do nothing wait for next props
    } else {
      this.setState({loader: true});
      let testRef = db.collection("tests");
      testRef
      .where("testDate",">=",new Date(moment().subtract(6,'months').format("YYYY-MM-DD")))
      .where("uid","==", userProfile.uid)
      .onSnapshot((querySnapshot)=>{
          let tests = [];
          querySnapshot.forEach((doc)=>{
              tests.push({...doc.data(), docId: doc.id});
          });
          console.log("Tests fetched: ", tests);
          this.setState({tests, showCardAction, loader: false});
      });
    }

  }

  getChapters(){
    const {showCardAction, subject, chapter, chapters} = this.props;
    this.setState({loader: true});
    if(chapters){
      this.setState({chapters,showCardAction, editItem: chapter, loader: false});
    } else {
      console.log("subject and chapter", subject, chapter);
      let subRef = db.collection("chapters");
      if(subject){
        subRef = subRef.where("gradeId","==", subject.gradeId)
                       .where("subjectId","==", subject.subjectId);
      }
      subRef
      .onSnapshot((querySnapshot)=>{
          let chapters = [];
          querySnapshot.forEach((doc)=>{
              chapters.push({...doc.data(), docId: doc.id});
          });
          console.log("chapters fetched: ", chapters);
          this.setState({chapters,showCardAction, editItem: chapter, loader: false});
      });
    }

  }

  onchange(value) {
    this.setState({ value });
  }

  generateTestList(){
    const {tests, chapters, editItem} = this.state;
    return (
          tests.map((t,i) => (
            <GridCell key={'grid'+t.docId} phone={2} tablet={4} desktop={3} style={{zoom: '0.65',MozTransform : 'scale(0.65)',}}>
              <EditChapter {...this.props} selectedTest={{...t}} onEditTest={()=>this.onShowEdit(t)}/>
            </GridCell>
          ))
    );
  }

  onShowEdit(editItem){

    // this.setState({editItem});

    if(this.props.onSelectTest){
      // alert("onSelectChapter");
      this.props.onSelectTest(editItem);
    }

  }

  render(){
    const {editItem, loader} = this.state;
    const {subject} = this.props;
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
          !editItem &&
          <GridRow>
            {
              this.generateTestList()
            }
          </GridRow>

        }
        {
          editItem &&
          <GridRow>
            <GridCell phone={4} tablet={8} desktop={6} style={{ padding: '0 0.5rem',}}>
              <EditChapter {...this.props} chapters={editItem} onAddChapter={this.onShowEdit}/>
            </GridCell>
            <GridCell phone={4} tablet={8} desktop={6} style={{ padding: '0rem 1rem',maxHeight: '27.5rem', overflowY: 'auto'}}>
              {
                this.generateTestList()
              }
            </GridCell>
          </GridRow>
        }
      </div>
    );
  }
}

export default TestList;
