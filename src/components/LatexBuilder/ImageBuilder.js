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

import { Card, CardMedia, CardPrimaryAction, CardMediaContent, CardActions, CardActionButtons, CardActionButton } from '@rmwc/card';
import { Typography } from '@rmwc/typography';
import { TextField } from '@rmwc/textfield';
import { Button } from '@rmwc/button';

// material UI style
import '@rmwc/menu/styles';
import '@rmwc/radio/styles';
import '@rmwc/card/styles';
import '@rmwc/typography/styles';
import '@rmwc/button/styles';

class ImageBuilder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // TODO
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
  }

  handleImageAsFile = (e) => {
      const imageFile = e.target.files[0]
      // this.setState({imageFile});
      if (e.target.files.length) {
        this.onUploadPhoto({
                            preview: URL.createObjectURL(e.target.files[0]),
                            raw: e.target.files[0]
                        });
      }
  }

  generateFilterMenu(){
    const {title, items, selectedItem, open, style, anchorStyle, defaultIcon } = this.props;
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
                        }}>
              <Typography use="body1" tag="p">
                { title ? title : 'Photos...'}
              </Typography>
              <div style={{margin: '0.5rem 0'}}>
                <label htmlFor="upload-button">
                  <div style={{textAlign: 'right'}}>
                    <Typography use="body1" tag="p">
                      <img src={AddPhoto} style={{width: '20px', cursor: 'pointer'}}
                      /> &nbsp;Upload photo
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
                  id="upload-button"
                  style={{ display: "none" }}
                  onChange={this.handleImageAsFile}
                />
                {/* <Button type="button" icon={AddPhoto} label={ '' }
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
                items.map((e,i)=>
                        <div style={{margin: '0.5rem 0'}}>
                          <Button type="button"
                            disabled={e.status=='DELETE'}
                            icon={e.url ? e.url : e.preview ? e.preview : AddPhoto}
                            label={ '' }
                            style={{fontSize: '10px'}}
                            // type="button"
                            onClick={(evt)=>{
                              this.onInsertPhotoInQuestion(e)
                            }}
                          />
                          {
                            e.status!='DELETE' &&
                            <Button type="button"
                              icon={Delete} label={ '' }
                              style={{fontSize: '10px', background: 'rgba(255,1,1,0.1)'}}
                              // type="button"
                              onClick={(evt)=>this.onUpdateStatusPhoto(i,'DELETE')}
                            />
                          }
                          {
                            e.status=='DELETE' &&
                            <Button type="button"
                              icon={AddPhoto} label={ '' }
                              style={{fontSize: '10px', background: 'rgba(1,255,1,0.1)'}}
                              // type="button"
                              onClick={(evt)=>this.onUpdateStatusPhoto(i, e.url ? 'EXISTING' : 'NEW')}
                            />
                          }
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
