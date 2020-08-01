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
      editItem: null,
      showCardAction:  false,
      loader: false,
    }
    this.generateSubjectList = this.generateSubjectList.bind(this);
    this.onchange = this.onchange.bind(this);
    this.onShowEdit = this.onShowEdit.bind(this);
    this.selectedSubject = this.selectedSubject.bind(this);

  }

  componentDidMount(){
    this.getChapters();
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

  selectedSubject(){
    const {editItem} = this.state;
    return (
      <Card style={{ padding: '0rem 0rem',border: '1px solid rgb(0,0,0,0.1)'}}>
        <CardPrimaryAction
          onClick={()=>{}}
          >
            <CardMedia
              sixteenByNine//={i%3==0}
              // square//={i%3!=0}
              style={{
                backgroundImage: 'url('+ editItem.chapterImageUrl + ')',
              }}
            />
          {/* <ImageListImage src={s.subjectImageUrl}
            style={{objectFit: 'cover', margin: 'auto',
                    // height: [1,4].includes(i) ? 'auto' :'80px',
                    // padding: [1,2,5].includes(i) ? '1.0rem 0 3rem' : '0.02rem 0 1.5rem',
                    padding: i%3==0 ? '1.0rem 0 3rem' : '0.02rem 0 1.5rem',
                    // padding: [1,2,5].includes(i) ? '0.5rem 0 1rem' : '0',
                    // background: 'grey',
                    width: '100%',
                  }}/> */}
          {/* <ImageListSupporting style={{backgroundColor: 'rgba(0,0,0,0)', color: '#000000', padding:'1rem .25rem 0'}}>
            <ImageListLabel style={{fontSize: editItem ? '10px' : 'auto', paddingTop: '0.5rem'}}>
                {s.subjectName}
            </ImageListLabel>
          </ImageListSupporting> */}
          <div style={{ padding: '0 1rem 1rem 1rem' }}>
          <Typography use="headline6" tag="h2">
            {editItem.chapterTitle}
          </Typography>
        </div>
        </CardPrimaryAction>
        {/* <ListDivider /> */}
        <div style={{ padding: '1rem 1rem 3rem 1rem' }}>
          <Typography
            use="body1"
            tag="div"
            theme="textSecondaryOnBackground"
            style={{
              color: "grey",
            }}
          >
            {editItem.chapterDescription}
          </Typography>
        </div>
        <CardActions>
          <CardActionButtons>
            <CardActionButton>Edit</CardActionButton>
            {/* <CardActionButton>Manage Chapters</CardActionButton> */}
            <Typography use="subtitle2" tag="p" style={{padding: '1rem',
              // border: '1px solid #018786',
              color: '#dd0074'}}>
              800 Questions
            </Typography>
          </CardActionButtons>
        </CardActions>
      </Card>
    );
  }

  generateSubjectList(){
    const {chapters, editItem} = this.state;
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
            <ImageListItem key={s.docId} style={{ marginBottom: '0px'}}
              >
              <Card style={{ padding: '0rem 0rem',border: '1px solid rgb(0,0,0,0.1)'}}>
                <CardPrimaryAction
                  onClick={()=>{
                    this.setState({ value: i, editItem: s });
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
                  {/* <ImageListImage src={s.subjectImageUrl}
                    style={{objectFit: 'cover', margin: 'auto',
                            // height: [1,4].includes(i) ? 'auto' :'80px',
                            // padding: [1,2,5].includes(i) ? '1.0rem 0 3rem' : '0.02rem 0 1.5rem',
                            padding: i%3==0 ? '1.0rem 0 3rem' : '0.02rem 0 1.5rem',
                            // padding: [1,2,5].includes(i) ? '0.5rem 0 1rem' : '0',
                            // background: 'grey',
                            width: '100%',
                          }}/> */}
                  {/* <ImageListSupporting style={{backgroundColor: 'rgba(0,0,0,0)', color: '#000000', padding:'1rem .25rem 0'}}>
                    <ImageListLabel style={{fontSize: editItem ? '10px' : 'auto', paddingTop: '0.5rem'}}>
                        {s.subjectName}
                    </ImageListLabel>
                  </ImageListSupporting> */}
                  <div style={{ padding: '0 0.5rem ' }}>
                  <Typography use="body2" tag="h2">
                    {s.chapterTitle}
                  </Typography>
                </div>
                </CardPrimaryAction>
                {/* <ListDivider /> */}
                <ImageListLabel style={{fontSize: editItem ? '10px' : 'auto', padding: '0.25rem'}}>
                  {s.chapterDescription}
                </ImageListLabel>
                {/* <div style={{ padding: '1rem 1rem 3rem 1rem' }}>
                  <Typography
                    use={ editItem ? "caption" : "body1"}
                    tag="div"
                    theme="textSecondaryOnBackground"
                    style={{
                      color: "grey",
                      maxLines: editItem ? "2" : "5",
                    }}
                  >
                    {s.subjectDescription}
                  </Typography>
                </div> */}
              </Card>
              <br/>
            </ImageListItem>
          ))
        }
      </ImageList>
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
          !editItem &&
          this.generateSubjectList()
        }
        {
          editItem &&
          <GridRow>
            <GridCell phone={4} tablet={4} desktop={6} style={{ padding: '0.5rem',}}>
              <EditChapter chapter={editItem} onAddChapter={this.onShowEdit}/>
            </GridCell>
            <GridCell phone={4} tablet={4} desktop={6} style={{ padding: '0.5rem 1rem',maxHeight: '30rem', overflowY: 'auto'}}>
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
