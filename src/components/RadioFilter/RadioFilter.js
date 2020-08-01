import React from 'react';

// ICONs
import QType from '../../assets/icons/widgets-black-48dp.svg';
import Idea from '../../assets/icons/wb_incandescent-black-48dp.svg';

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

class RadioFilter extends React.Component {
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
    // prop methods
    this.onChange = this.props.onChange;
    this.onOpen = this.props.onOpen;
    this.onClose = this.props.onClose;

  }

  componentDidMount(){
    // Nothing to do here
  }

  generateFilterMenu(){
    const {title, items, selectedItem, open, style, anchorStyle, defaultIcon } = this.props;
    return(
      <div style={{ float: 'left', margin: '0.5rem', cursor: 'pointer', ...style}}>
        <MenuSurfaceAnchor>
          <MenuSurface
            open={open}
            onClose={evt => this.onClose()}>
            <div style={{ padding: '1rem', minWidth: '10rem', width: 'auto',
                          // maxHeight: 'auto', overflowY: 'auto'
                        }}>
              <Typography use="body1" tag="p">
                { title ? title : 'Select an option'}
              </Typography>
              {
                items.map((e,i)=>
                  <Radio
                    key={ (e ? e.name : 'allitems') + i.toString()}
                    value={e}
                    checked={JSON.stringify(selectedItem) === JSON.stringify(e)
                      //selectedItem && selectedItem.gradeId == e.gradeId && (type!='grade' ? selectedItem.subjectId == e.subjectId : true)
                    }
                    onChange={()=>this.onChange(e)}
                  >
                    {/* <Card style={{ margin: '0rem', padding: '0rem 0rem',
                        // boxShadow: 'none'
                      }}> */}
                        <div>
                          {
                            e &&
                            <Button icon={e.url ? e.url : defaultIcon ? defaultIcon : Idea} label={ e.name }
                              style={{fontSize: '10px'}}
                              // type="button"
                              onClick={()=>this.onChange(e)}
                            />

                          }
                          {
                            !e &&
                            <Button icon={defaultIcon ? defaultIcon : Idea} label={ 'All' }
                              style={{fontSize: '10px'}}
                              // type="button"
                              onClick={()=>this.onChange(e)}
                            />

                          }
                        </div>
                    {/* </Card> */}
                  </Radio>
                )
              }
            </div>
          </MenuSurface>
            {/* <Card style={{marginRight: '1rem'}}> */}
              <Button
                icon={selectedItem ? selectedItem.url : defaultIcon ? defaultIcon : QType}
                label={selectedItem ? selectedItem.name : title}
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

export default RadioFilter;
