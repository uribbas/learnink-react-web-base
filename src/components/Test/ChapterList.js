import React from 'react';
import firebase, {db} from '../../provider/database';
import Categories from '../Categories/Categories';
import EditChapter from './EditChapter';
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

class Question extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chapters:[],
      value: 0,
      selectedChapters: null,
      showCardAction:  false,
      loader: false,
    }
    this.generateSubjectList = this.generateSubjectList.bind(this);
    this.onShowEdit = this.onShowEdit.bind(this);

  }

  componentDidMount(){
    this.getChapters();
  }

  componentDidUpdate(prevProps){
    if(this.props.subject !== prevProps.subject || this.props.selectedTest != prevProps.selectedTest){
      // this.setState({subject});
      this.getChapters();
    }
  }

  getChapters(){
    let {showCardAction, grade, subject, selectedTest } = this.props;
    let selectedChapters = [];
    this.setState({loader: true});
    if(selectedTest){
      subject = { gradeId: selectedTest.gradeId, subjectId: selectedTest.subjectId, };
      selectedChapters = [...selectedTest.chaptersCovered];
    }

    // console.log("subject and chapter", subject, chapter);
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

        this.setState({chapters,showCardAction,
                       selectedChapters: selectedTest ? selectedChapters : null,
                       loader: false});
    });

  }

  generateSubjectList(){
    const {chapters, selectedChapters} = this.state;
    console.log("generateSubjectList", chapters, selectedChapters);
    return (
      <ImageList
        masonry
        withTextProtection
        style={{
          columnCount: 3,
          columnGap: '10px',
          maxWidth: '100%',
          // margin: '10px',
        }}
      >
        {
          chapters.map((s,i) => (
            <ImageListItem key={s.docId}
              style={{ marginBottom: '0px',
                       opacity:
                            selectedChapters &&
                            selectedChapters.findIndex(c=>s.gradeId==c.gradeId &&
                                                          s.subjectId==c.subjectId &&
                                                          c.chapterId==s.chapterId)!=-1
                            ? '0.2' : '1'}}
              >
              <Card style={{ padding: '0rem 0rem',border: '1px solid rgb(0,0,0,0.1)'}}>
                <CardPrimaryAction
                  onClick={()=>{
                    let {selectedChapters} = this.state;
                    if(selectedChapters &&
                      selectedChapters.findIndex(c=>s.gradeId==c.gradeId &&
                                                    s.subjectId==c.subjectId &&
                                                    c.chapterId==s.chapterId)==-1
                      ) {
                      selectedChapters.push(s);
                    } else if(!selectedChapters){
                      selectedChapters = [s,]
                    }
                    // spead operator is used to facilitate the prevProps and this.props check in EditChapter
                    // for changes and populate values accordingly
                    this.setState({ value: i, selectedChapters: [...selectedChapters] });
                    if(this.props.onSelectChapter){
                      // alert("onSelectChapter");
                      this.props.onSelectChapter(s);
                    }
                    // window.scrollTo(0,200);
                    window.scrollTo({
                                      top: 150,
                                      left: 0,
                                      behavior: 'smooth'
                                    });
                  }}
                  >
                    <CardMedia
                      sixteenByNine={i%3==0}
                      square={i%3!=0}
                      style={{
                        backgroundImage: 'url('+ s.chapterImageUrl + ')',
                      }}
                    />
                  <div style={{ padding: '0 0.5rem ' }}>
                  <Typography use="body2" tag="h2">
                    {s.chapterTitle}
                  </Typography>
                </div>
                </CardPrimaryAction>
                {/* <ListDivider /> */}
                <ImageListLabel style={{fontSize: selectedChapters ? '10px' : 'auto', padding: '0.25rem'}}>
                  {s.chapterDescription}
                </ImageListLabel>
              </Card>
              <br/>
            </ImageListItem>
          ))
        }
      </ImageList>
    );
  }

  onShowEdit(selectedChapters, resetSelectChapters){

    this.setState({selectedChapters});

    if(this.props.onSelectChapter && resetSelectChapters){
      // alert("onSelectChapter");
      this.props.onSelectChapter();
    }

  }

  render(){
    const {selectedChapters, loader} = this.state;
    const {subject} = this.props;
    console.log("chapter details list", this.props.test, selectedChapters);
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
          !selectedChapters &&
          this.generateSubjectList()
        }
        {
          selectedChapters &&
          <GridRow>
            <GridCell phone={4} tablet={8} desktop={6} style={{ padding: '0 0.5rem',}}>
              <EditChapter {...this.props} chapters={selectedChapters} onAddChapter={this.onShowEdit}/>
            </GridCell>
            <GridCell phone={4} tablet={8} desktop={6} style={{ padding: '0rem 1rem',maxHeight: '27.5rem', overflowY: 'auto'}}>
              {
                this.generateSubjectList()
              }
            </GridCell>
          </GridRow>
        }
      </div>
    );
  }
}

export default Question;
