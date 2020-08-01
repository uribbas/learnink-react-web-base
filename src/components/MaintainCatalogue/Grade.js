import React from 'react';
import firebase, {db} from '../../provider/database';

// material UI
import { Card, CardMedia, CardPrimaryAction, CardMediaContent, CardActions, CardActionButtons, CardActionButton } from '@rmwc/card';
import { Typography } from '@rmwc/typography';
import { Fab } from '@rmwc/fab';
import { Select } from '@rmwc/select';
import { Grid, GridCell, GridRow } from '@rmwc/grid';
import { TextField } from '@rmwc/textfield';
import { Button } from '@rmwc/button';
// material UI style
import '@rmwc/card/styles';
import '@rmwc/typography/styles';
import '@rmwc/fab/styles';
import '@rmwc/select/styles';
import '@rmwc/grid/styles';
import '@rmwc/textfield/styles';
import '@rmwc/button/styles';

class Grade extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      grades:[],
    }
    this.onSelectGrade = this.props.onSelectGrade;
    this.onShowEdit = this.props.onShowEdit;
    this.getGrades();
  }

  getGrades(){
    db.collection("grades")
    .onSnapshot((querySnapshot)=>{
        let grades = [];
        querySnapshot.forEach((doc)=>{
            grades.push(doc.data());
        });
        console.log("Grades fetched: ", grades);
        this.setState({grades});
    });
  }

  renderGrade(){
    return this.state.grades.map((g,i)=>{
      console.log("processing ", g);
      return (
        <GridCell phone={1} desktop={2} tablet={2}>
          <Card style={{ textAlign: 'left'}}
            >
            <CardPrimaryAction onClick={()=>this.onSelectGrade(g.gradeId)}>
              <CardMedia
                square
                style={{
                  backgroundImage: 'url(' + g.gradeImageUrl + ')'
                }}
              >
                <CardMediaContent>
                  <Typography
                    use="caption"
                    tag="div"
                    theme="textPrimaryOnDark"
                    style={{
                      padding: '0.25rem 0.25rem',
                      backgroundImage:
                        'linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.5) 100%)',
                      bottom: '0',
                      left: '0',
                      right: '0',
                      position: 'absolute'
                    }}
                  >
                    {g.name}
                  </Typography>
                </CardMediaContent>
              </CardMedia>
            </CardPrimaryAction>
            <CardActions>
              <CardActionButtons>
                <CardActionButton onClick={()=>{this.onShowEdit("grade",g)}}>Edit</CardActionButton>
              </CardActionButtons>
            </CardActions>
          </Card>
        </GridCell>
      );
    })
  }

  render(){
    return(
      <div>
        <Grid>
          <GridRow>
            <GridCell span={12}>
              <GridRow>
                {
                  this.renderGrade()
                }
              </GridRow>
            </GridCell>
          </GridRow>
        </Grid>
      </div>
    );
  }
}

export default Grade;
