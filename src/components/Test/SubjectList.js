import React from 'react';
import firebase, {db} from '../../provider/database';
import Categories from '../Categories/Categories';
// import EditSubject from './EditSubject';
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

class SubjectList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subjects:[],
      value: 0,
      editItem: null,
      showCardAction:  false,
      loader: false,
    }
    this.generateSubjectList = this.generateSubjectList.bind(this);
    this.onSelectSubject = this.props.onSelectSubject;

  }

  componentDidMount(){
    const {subjects} = this.props;
    this.setState({subjects});
  }

  componentDidUpdate(prevProps){
    if(this.props.subjects !== prevProps.subjects ){
      // this.setState({grade});
      const {subjects} = this.props;
      this.setState({subjects});
    }
  }

  generateSubjectList(){
    const {subjects, editItem} = this.state;
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
          subjects.map((s,i) => (
            <ImageListItem key={s.docId} style={{ marginBottom: '0px'}}
              >
              <Card style={{ padding: '0rem 0rem',border: '1px solid rgb(0,0,0,0.1)'}}>
                <CardPrimaryAction
                  onClick={()=>{
                    let sub = {gradeId: s.gradeId, subjectId: s.subjectId,
                      name: s.subjectName, url: s.subjectImageUrl};
                    this.onSelectSubject(sub);
                    window.scrollTo({
                                      top: 120,
                                      left: 0,
                                      behavior: 'smooth'
                                    });
                  }}
                  >
                    <CardMedia
                      sixteenByNine={i%3==0}
                      square={i%3!=0}
                      style={{
                        backgroundImage: 'url('+ s.subjectImageUrl + ')',
                      }}
                    />
                  <div style={{ padding: '0 0.5rem ' }}>
                  <Typography use="body2" tag="h2">
                    {s.subjectName}
                  </Typography>
                </div>
                </CardPrimaryAction>
                {/* <ListDivider /> */}
                <ImageListLabel style={{fontSize: editItem ? '10px' : 'auto', padding: '0.25rem'}}>
                  {s.subjectDescription}
                </ImageListLabel>
              </Card>
              <br/>
            </ImageListItem>
          ))
        }
      </ImageList>
    );
  }

  render(){
    const {editItem, loader} = this.state;
    // if(!grade){
    //   return (<></>);
    // }
    if(this.state.loader){
      return(
        <div style={{textAlign: 'center'}}>
          <img src={Loader} style={{padding: '15% 0'}}/>
        </div>);
    }
    return(
      <div style={{ textAlign: 'left', padding: '0rem 0rem'}}>
        {
          this.generateSubjectList()
        }
      </div>
    );
  }
}

export default SubjectList;
