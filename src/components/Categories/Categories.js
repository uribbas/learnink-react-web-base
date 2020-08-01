import React from 'react';
import {
  NavLink,
} from "react-router-dom";
import firebase from '../../provider/database';


// material UI
import { Typography } from '@rmwc/typography';
import { Button } from '@rmwc/button';
import { IconButton } from '@rmwc/icon-button';
import {
  Grid,
  GridCell,
  GridRow,
 } from '@rmwc/grid';

// material UI style
import '@rmwc/typography/styles';
import '@rmwc/button/styles';
import '@rmwc/icon-button/styles';
import '@rmwc/grid/styles';


class Categories extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
    this.setComponentProps = this.props.setComponentProps;
  }

  componentDidMount(prevProps) {
    // Typical usage (don't forget to compare props):
    // if (this.props !== prevProps) {
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props !== prevProps) {
    }
  }

  render(){
    const { userAuth, userProfile, aphRef} = this.props;
    return(
      <GridRow>
        <GridCell phone={4} tablet={2} desktop={12}  style={{margin: '0.25rem 0', }}>
          <Typography use="headline5" tag="div">
            Categories
          </Typography>
        </GridCell>
        {/* <GridCell phone={1} tablet={8} desktop={10}  style={{margin: '-1rem 0', cursor: 'pointer'}}>
          <Typography use="body2" tag="p">
            <NavLink to="/" style={{textDecorationLine: 'none'}}>Home</NavLink>
          </Typography>
        </GridCell> */}
        <GridCell phone={1} tablet={8} desktop={10}  style={{margin: '-1rem 0', cursor: 'pointer'}}>
          <Typography use="body2" tag="p">
            <NavLink to="/grade" style={{textDecorationLine: 'none'}}>Grades</NavLink>
          </Typography>
        </GridCell>
        <GridCell phone={1} tablet={8} desktop={10} style={{margin: '-1rem 0', cursor: 'pointer'}}>
          <Typography use="body2" tag="p">
            <NavLink to="/subject" style={{textDecorationLine: 'none'}}>Subjects</NavLink>
          </Typography>
        </GridCell>
        <GridCell phone={1} tablet={8} desktop={10} style={{margin: '-1rem 0', cursor: 'pointer'}}>
          <Typography use="body2" tag="p">
            <NavLink to="/chapter" style={{textDecorationLine: 'none'}}>Chapters</NavLink>
          </Typography>
        </GridCell>
        {
          userProfile &&
          ["MODERATOR","REVIEWER","ADMIN"].includes(userProfile.role) &&
          <GridCell phone={1} tablet={8} desktop={10} style={{margin: '-1rem 0', cursor: 'pointer'}}>
            <Typography use="body2" tag="p">
              <NavLink to="/question" style={{textDecorationLine: 'none'}}>Questions</NavLink>
            </Typography>
          </GridCell>
        }
        {
          (!userProfile ||
          (userProfile &&
          !["MODERATOR","REVIEWER","ADMIN"].includes(userProfile.role) ) ) &&
          <GridCell phone={1} tablet={8} desktop={10} style={{margin: '-1rem 0', cursor: 'pointer'}}>
            <Typography use="body2" tag="p">
              <NavLink to="/practice" style={{textDecorationLine: 'none'}}>Practice</NavLink>
            </Typography>
          </GridCell>
        }

    </GridRow>
    );
  }
}

export default Categories;
