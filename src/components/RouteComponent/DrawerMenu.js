import React from 'react';
import {
  NavLink,
  HashRouter
} from "react-router-dom";
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
    // this.onClickMenu = this.props.onClickMenu;
  }

  onClickListItem(componentProps){
    // this.onClickMenu(componentProps);
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
                <NavLink to="/" style={{textDecorationLine: 'none'}}><ListItem onClick={()=>this.onClickListItem('Maintain Catalogue')}>Maintain Catalogue</ListItem></NavLink>
                <NavLink to="/standard-question" style={{textDecorationLine: 'none'}}><ListItem onClick={()=>this.onClickListItem('Standard question')}>Standard question</ListItem></NavLink>
                <NavLink to="/match-sides" style={{textDecorationLine: 'none'}}><ListItem onClick={()=>this.onClickListItem('Match Sides')}>Match Sides</ListItem></NavLink>
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
