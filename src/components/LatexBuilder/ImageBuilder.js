import React from 'react';

// ICONs
import QType from '../../assets/icons/widgets-black-48dp.svg';
import AddPhoto from '../../assets/icons/add_photo_alternate-black-48dp.svg';
import Delete from '../../assets/icons/remove-black-48dp.svg';
import Upload from '../../assets/icons/publish-black-48dp.svg';
import closeIcon from '../../assets/icons/close-black-48dp.svg';

import Loader from '../../assets/icons/loader.gif';
// material UI
import {MenuSurfaceAnchor,MenuSurface} from '@rmwc/menu';
import {Radio} from '@rmwc/radio';
import {Checkbox} from '@rmwc/checkbox';

import { Card, CardMedia, CardPrimaryAction, CardMediaContent, CardActions, CardActionButtons, CardActionButton } from '@rmwc/card';
import { Typography } from '@rmwc/typography';
import { TextField } from '@rmwc/textfield';
import { Button } from '@rmwc/button';

// material UI style
import '@rmwc/menu/styles';
import '@rmwc/radio/styles';
import '@rmwc/checkbox/styles';
import '@rmwc/card/styles';
import '@rmwc/typography/styles';
import '@rmwc/button/styles';

class ImageBuilder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // TODO
      matchAll: false,
      photoDesc: '',
      searchText: '',
    }
    // prop values
    this.title = this.props.title; // title of the item list
    this.open = this.props.open;
    this.items = this.props.items; // this should have {name, url(optional)}
    this.selectedItem = this.props.selectedItem; // this should be of same data structure like items
    this.style = this.props.style;
    this.anchorStyle = this.props.anchorStyle;
    this.defaultIcon = this.props.defaultIcon;
    this.handleImageAsFile = this.handleImageAsFile.bind(this);
    // prop methods
    this.onInsertPhotoInQuestion = this.props.onInsertPhotoInQuestion;
    this.onUploadPhoto = this.props.onUploadPhoto;
    this.onUpdateStatusPhoto = this.props.onUpdateStatusPhoto;
    this.onOpen = this.props.onOpen;
    this.onClose = this.props.onClose;

  }

  componentDidMount(){
    // Nothing to do here
    // this.setState({title: this.props.title, matchAll: false, photoDesc: null,})
  }

  componentDidUpdate(prevProps){
    // if(prevProps.title!=this.props.title){
    //   this.setState({title: this.props.title, matchAll: false, photoDesc: null,});
    // }
  }

  handleImageAsFile = (e) => {
      const imageFile = e.target.files[0]
      // this.setState({imageFile});
      const {photoDesc} = this.state;
      if (e.target.files.length) {
        this.onUploadPhoto(
                        {
                            preview: URL.createObjectURL(e.target.files[0]),
                            raw: e.target.files[0]
                        },
                        this.props.title,
                        photoDesc,
                      );
        this.setState({photoDesc: ''});
      }
  }

  filterPhoto=()=>{

    const {searchText}= this.state;
    const {items} = this.props;
    // split and sort the searchtext
    // let searchArr = searchText.toLowerCase().split(' ');
    let matchedItems = items.filter((p,i)=>{
                              // let description = p.description.toLowerCase().split(' ');
                              // const result = searchArr.every(val => description.includes(val));
                              // return result;
                              return !searchText ? i <= 5 : p.description.match(new RegExp(searchText,'g'));
                            });
    return matchedItems;

  }

  generateFilterMenu(){
    const {title, items, selectedItem, open, style, anchorStyle, defaultIcon, isSearchable } = this.props;
    let {matchAll, photoDesc, searchText}= this.state;
    return(
      <div style={{
        float: 'left',
        margin: '0.5rem', cursor: 'pointer', ...style}}>
        <MenuSurfaceAnchor>
          <MenuSurface
            open={open}
            onClose={evt => this.onClose()}>
            <div style={{ padding: '1rem', minWidth: '10rem', width: 'auto',
                          // maxHeight: 'auto', overflowY: 'auto'
                          cursor: 'auto',
                        }}>
              <Typography use="body1" tag="p">
                { title + ' Photos...'}
              </Typography>
              <div style={{margin: '0.5rem 0'}}>
                {
                    title=='Common' &&
                    <TextField label="Photo description.."
                      required
                      value={photoDesc}
                      onChange={(e)=>{
                        this.setState({photoDesc: e.target.value});
                      }}
                    />
                }
                {
                  (title!='Common' || photoDesc) &&
                  <div>
                    <label htmlFor={"upload-button-"+title}>
                      <div style={{textAlign: 'right', cursor: 'pointer'}}>
                        <Typography use="body1" tag="p">
                          <img src={AddPhoto} style={{width: '20px', cursor: 'pointer'}}
                          />&nbsp;Upload photo
                        </Typography>
                        {/* <Button type="button" icon={AddPhoto} label={ 'Upload' }
                          style={{fontSize: '10px'}}
                          // type="button"
                          // onClick={(evt)=>{this.onUploadPhoto()}}
                        /> */}
                        {/* <img src={this.state.preview ? this.state.preview : (grade.gradeImageUrl ? grade.gradeImageUrl : Logo) }
                          alt="" style={{width: '100%', maxHeight: '5rem', objectFit: 'contain'}}/> */}
                      </div>
                    </label>
                    <input
                      type="file"
                      id={"upload-button-"+title}
                      style={{ display: "none" }}
                      onChange={this.handleImageAsFile}
                    />
                  </div>
                }
                {
                  !(title!='Common' || photoDesc) &&
                  <div style={{textAlign: 'right', cursor: 'auto', opacity: '0.3'}}>
                    <Typography use="body1" tag="p">
                      <img src={AddPhoto} style={{width: '20px',}}
                      />&nbsp;Upload photo
                    </Typography>
                    {/* <Button type="button" icon={AddPhoto} label={ 'Upload' }
                      style={{fontSize: '10px'}}
                      // type="button"
                      // onClick={(evt)=>{this.onUploadPhoto()}}
                    /> */}
                    {/* <img src={this.state.preview ? this.state.preview : (grade.gradeImageUrl ? grade.gradeImageUrl : Logo) }
                      alt="" style={{width: '100%', maxHeight: '5rem', objectFit: 'contain'}}/> */}
                  </div>
                }
                {/* <Button type="button" icon={AdonInsertPhotoInQuestiondPhoto} label={ '' }
                  style={{fontSize: '10px'}}
                  // type="button"
                  onClick={(evt)=>{this.onUploadPhoto()}}
                />
                <Button type="button" icon={Upload} label={ '' }
                  style={{fontSize: '10px'}}
                  // type="button"
                  onClick={(evt)=>{this.onUploadPhoto()}}
                /> */}
              </div>
              {
                isSearchable &&
                <div style={{margin: '0.5rem 0'}}>
                  <TextField label="Search photo.."
                    value={searchText}
                    onChange={(e)=>this.setState({searchText: e.target.value})}
                  />
                  {/* <Checkbox
                    // key={ (e ? e.name : 'allitems') + i.toString()}
                    label={"Match All"}
                    // value={matchAll}
                    checked={matchAll}
                    onChange={(e)=>{
                        // console.log("Radio value",e.target.value, '<=>' ,matchAll)
                        this.setState({matchAll: !matchAll});
                      }}
                  /> */}
                </div>
              }
              {
                this.filterPhoto().map((e,i)=>
                        <div style={{margin: '0.5rem 0', cursor: 'auto'}}>
                          {/* <Button type="button"
                            disabled={e.status=='DELETE'}
                            icon={e.url ? e.url : e.preview ? e.preview : AddPhoto}
                            label={ '' }
                            style={{fontSize: '10px'}}
                            // type="button"
                            onClick={(evt)=>{
                              this.onInsertPhotoInQuestion(e)
                            }}
                          /> */}

                            <span>
                              <img src={e.url ? e.url : e.preview ? e.preview : AddPhoto}
                                style={{height: '40px', cursor: 'pointer', margin: '-1rem 1rem', verticalAlign: 'middle'}}
                                onClick={(evt)=>{
                                  this.onInsertPhotoInQuestion(e, title)
                                }}
                              />
                            </span>

                          {/* <img type="button"
                            disabled={e.status=='DELETE'}
                            src={e.url ? e.url : e.preview ? e.preview : AddPhoto}
                            style={{cursor: 'pointer', width:'40px', margin: '-1em'}}
                            // type="button"
                            onClick={(evt)=>{
                              this.onInsertPhotoInQuestion(e)
                            }}
                          /> */}
                          {
                            (title!='Common' || (e.status!='DELETE' && !e.url)) &&
                            <Button type="button"
                              icon={Delete} label={ '' }
                              style={{fontSize: '10px', background: 'rgba(255,1,1,0.1)'}}
                              // type="button"
                              onClick={(evt)=>this.onUpdateStatusPhoto(i,'DELETE',title)}
                            />
                          }
                          {/* {
                            e.status=='DELETE' &&
                            <Button type="button"
                              icon={AddPhoto} label={ '' }
                              style={{fontSize: '10px', background: 'rgba(1,255,1,0.1)'}}
                              // type="button"
                              onClick={(evt)=>this.onUpdateStatusPhoto(i, e.url ? 'EXISTING' : 'NEW')}
                            />
                          } */}
                        </div>
                )
              }
            </div>
          </MenuSurface>
            {/* <Card style={{marginRight: '1rem'}}> */}
              <Button
                type="button"
                icon={defaultIcon ? defaultIcon : AddPhoto}
                label={''}
                // outlined
                style={{ background: '#ffffff',
                         // fontSize: '10px'
                         border: '1px solid rgba(0,0,0,0.05)',
                         // marginRight: '1rem',
                       ...anchorStyle}}
                onClick={evt => this.onOpen()} />
            {/* </Card> */}
        </MenuSurfaceAnchor>
      </div>
    )
  }

  render(){
    return(
      <>
        {
          this.generateFilterMenu()
        }
      </>
    );
  }
}

export default ImageBuilder;
