import React from 'react';
import { Drawer, DrawerHeader, DrawerTitle, DrawerSubtitle, DrawerContent } from '@rmwc/drawer';
import { List, ListItem } from '@rmwc/list';
import { IconButton } from '@rmwc/icon-button';

import menuBar from '../../assets/icons/menu-white.svg';

import '@rmwc/drawer/styles';
import '@rmwc/list/styles';
import '@rmwc/icon-button/styles';

import '../../App.css';

class DrawerMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // TODO
      open: false,
    };
    this.onClickQuestion = this.props.onClickQuestion;
  }

  onClickListItem(questionType){
    this.onClickQuestion(questionType);
    this.setState({open: false});
  }

  render(){
    return (
      <div style={{left: '0', top: '0', position: 'absolute', textAlign: 'left'}}>
        <>
          {/** Make the drawer appear right-to-left */}
          <Drawer
            dir="ltr"
            modal
            open={this.state.open}
            onClose={() => this.setState({open: false})}
          >
            {/** Set the content back to left-to-right */}
            <DrawerHeader dir="ltr">
              <DrawerTitle>Learnink Menu</DrawerTitle>
              <DrawerSubtitle>endless possibilities</DrawerSubtitle>
            </DrawerHeader>

            <DrawerContent dir="ltr">
              <List>
                <ListItem onClick={()=>this.onClickListItem('Standard question')}>Standard question</ListItem>
                <ListItem onClick={()=>this.onClickListItem('Match Sides')}>Match Sides</ListItem>
                <ListItem >Fill in the blanks</ListItem>
              </List>
            </DrawerContent>
          </Drawer>

          <div  style={{left: '0', top: '0', position: 'absolute'}}>
            <IconButton icon={menuBar} onClick={() => this.setState({open: !this.state.open})} />
          </div>

        </>
      </div>
    );
  }

}

export default DrawerMenu;
