import React from 'react';
import firebase, {db, auth} from '../../provider/database';
import Categories from '../Categories/Categories';
import EditGrade from './EditGrade';
import EditSubject from '../Subject/EditSubject';
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
import {List, ListDivider} from '@rmwc/list';
import { Card, CardMedia, CardPrimaryAction, CardMediaContent, CardActions, CardActionButtons, CardActionButton } from '@rmwc/card';
import { Typography } from '@rmwc/typography';
import { TextField } from '@rmwc/textfield';
import { Button } from '@rmwc/button';
import { IconButton } from '@rmwc/icon-button';
import Carousel, { Dots } from '@brainhubeu/react-carousel';
import { Icon } from '@rmwc/icon';

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

class Grade extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      grades:[],
      value: 0,
      editItem: null,
      subject: null,
      showCardAction:  false,
      loader: false,
    }
    this.generateSlides = this.generateSlides.bind(this);
    this.listofGrades = this.listofGrades.bind(this);
    this.onchange = this.onchange.bind(this);
    this.onShowEdit = this.onShowEdit.bind(this);
    this.onAddSubject = this.onAddSubject.bind(this);

  }

  componentDidMount(){
    this.getGrades();
  }

  getGrades(){
    const {showCardAction, grades} = this.props;
    let newShowCardAction = showCardAction ? showCardAction :
                            (auth.currentUser ? true : false);
    this.setState({loader: true});
    if(grades){
      this.setState({grades,showCardAction : newShowCardAction, loader: false});
    } else {
      db.collection("grades")
      .onSnapshot((querySnapshot)=>{
          let grades = [];
          querySnapshot.forEach((doc)=>{
              grades.push(doc.data());
          });
          console.log("Grades fetched: ", grades);
          this.setState({grades,showCardAction : newShowCardAction, loader: false});
      });
    }

  }

  onchange(value) {
    this.setState({ value });
  }

  generateSlides(){
    const { userAuth, userProfile, aphRef } = this.props;
    return this.state.grades.map((grade,i)=>{
      return(
        <div>
            <Card style={{ margin: '0', padding: '0rem 0rem',
                // boxShadow: 'none'
              }}>
              {/* <CardPrimaryAction > */}
                <div>

                <GridRow>
                  <GridCell phone={2} tablet={3} desktop={6}>
                    <Typography
                      use="subtitle1" //{ this.state.editItem ? "caption" : "subtitle1" }
                      tag="div"
                      style={{ padding: '0.5rem 1rem' }}
                      theme="textSecondaryOnBackground"
                    >
                      {grade.name}
                    </Typography>
                  </GridCell>
                  <GridCell phone={2} tablet={4} desktop={5}>
                    {/* <Card style={{ margin: '0rem', padding: '0.25rem 0.25rem',
                        boxShadow: 'none'
                      }}>
                      <CardMedia
                        square
                        style={{
                          backgroundImage: 'url('+ grade.gradeImageUrl +')',
                          // maxHeight: '60px'
                        }}
                      />
                    </Card> */}

                    <img src={grade.gradeImageUrl} loading="auto" style={{
                      // maxHeight: '60px',
                      // height: 'auto',
                      width: '100%',
                      // maxWidth: '60px',
                      margin: '1rem 0'}}/>
                  </GridCell>

                </GridRow>

                <List>
                  <ListDivider />
                </List>
                <div style={{ padding: '1rem 1rem 3rem 1rem' }}>
                  <Typography
                    use="body1" //{ this.state.editItem ? "caption" : "body1" }
                    tag="div"
                    theme="textSecondaryOnBackground"
                    style={{color: "grey",}}
                  >
                    <ul>
                      {

                          grade && grade.gradeDescription &&
                          grade.gradeDescription.split(/\r?\n/).map((t,i)=><li key={grade.gradeId + i.toString()}>{t}</li>)

                      }
                    </ul>
                    {/* <ul>
                      <li>Take a guided, problem solving-solving based approach to learning Chemistry.</li>
                      <li>These compilations provide unique perspectives and applications you won't find anywhere else.</li>
                    </ul> */}
                  </Typography>
                </div>
                </div>
              {/* </CardPrimaryAction> */}
              {
                userProfile &&
                ["MODERATOR","REVIEWER","ADMIN"].includes(userProfile.role) &&
                <CardActions>
                  <CardActionButtons>
                    <CardActionButton
                      onClick={()=>{
                        this.onShowEdit(grade);
                        window.scrollTo({
                                          top: 120,
                                          left: 0,
                                          behavior: 'smooth'
                                        });
                      }}
                      >Edit</CardActionButton>
                    <CardActionButton type="button" onClick={()=>{this.onAddSubject(grade);}}>Add Subject</CardActionButton>
                  </CardActionButtons>
                </CardActions>
              }
              {
                (!userProfile ||
                (userProfile &&
                !["MODERATOR","REVIEWER","ADMIN"].includes(userProfile.role) ) ) &&
                <CardActions>
                  <CardActionButtons>
                    <CardActionButton type="button"
                      onClick={()=>{
                        if(!userProfile){
                          aphRef.handleOpenSignIn(true);
                        } else {
                          // this.onAddToCart(grade);
                        }
                      }}>Add to Cart</CardActionButton>
                  </CardActionButtons>
                </CardActions>
              }
            </Card>
            <br/>
          </div>
      );
    });
  }

  listofGrades(){
    return(
      <div>
        <Carousel
          keepDirectionWhenDragging
          infinite
          // arrows
          // arrowLeft={<Icon icon={{ icon: <img src={Left} style={{opacity: '0.3', cursor: 'pointer'}}/>, strategy: 'ligature' }} />}
          // arrowLeftDisabled={<Icon icon={{ icon: <img src={Left} style={{opacity: '0.08', }}/>, strategy: 'ligature' }} />}
          // arrowRight={<Icon icon={{ icon: <img src={Right} style={{opacity: '0.3', cursor: 'pointer'}}/>, strategy: 'ligature' }} />}
          // arrowRightDisabled={<Icon icon={{ icon: <img src={Right} style={{opacity: '0.08',}}/>, strategy: 'ligature' }} />}
          // addArrowClickHandler
          value={this.state.value}
          onChange={this.onchange}
          slides={ this.generateSlides() }
          slidesPerPage={this.state.editItem || this.state.subject ? 2 : 4}
          // left
          // centered
          lazyLoad
          offset={15}
          breakpoints={{
            400: {
              slidesPerPage: 1.1,
              arrows: false,
            },
            599: {
              slidesPerPage: 1.3,
              arrows: false
            },
            840: {
              slidesPerPage: 2,
              arrows: false
            },
            1024: {
              slidesPerPage: this.state.editItem || this.state.subject ? 1.5 : 3,
              arrows: false
            },
            // 1024: {
            //   slidesPerPage: 2,
            //   arrows: false
            // }
          }}
        />
      </div>

    );
  }

  onShowEdit(grade){
    this.setState({editItem: grade});
  }

  onAddSubject(grade){
    this.setState({subject: grade ? {gradeId: grade.gradeId} : null});
  }

  render(){
    const {editItem, subject, loader} = this.state;
    const { userAuth, userProfile, aphRef} = this.props;
    console.log("grade userProfile", aphRef, userProfile, userProfile == undefined, !userProfile);
    // console.log("Profile value of user @grade page",userAuth, userProfile);
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
        <Grid>
          <GridRow>
            <GridCell phone={4} tablet={2} desktop={2}>
              <Categories {...this.props}/>
            </GridCell>
            <GridCell phone={4} tablet={6} desktop={10}>
                  <GridCell>
                    <Card style={{boxShadow: 'none', borderBottom: '1.25px solid rgba(0,0,0,0.1)', background: 'transparent'}}>
                      <Typography use="headline5"
                        style={{ textAlign: 'left', padding: '0rem 1rem 0.25rem' }}
                        >
                        Grades
                        {
                          userProfile &&
                          ["MODERATOR","REVIEWER","ADMIN"].includes(userProfile.role) && !this.state.editItem &&
                          <Icon icon={Add}
                            style={{float: 'right', margin: '0', cursor: 'pointer', border: '1px solid rgba(0,0,0,0.2)', borderRadius: '50%'}}
                            onClick={()=>this.onShowEdit({})}
                          />
                        }
                      </Typography>
                      {/* <ListDivider /> */}
                    </Card>
                    {/* <div style={{ textAlign: 'left', padding: '1rem 1rem 1rem 1rem' }}>
                      <Typography use="headline5">
                        Grades
                      </Typography>
                      <ListDivider/>
                    </div> */}
                  </GridCell>
                  {
                    (editItem || subject) &&
                    <GridRow>
                      <GridCell phone={4} tablet={6} desktop={5} style={{ padding: '1rem',}}>
                        {
                          editItem &&
                          <EditGrade grade={editItem} onShowEdit={this.onShowEdit}/>
                        }
                        {
                          subject &&
                          <EditSubject subject={subject} onAddSubject={this.onAddSubject}/>
                        }
                      </GridCell>
                      <GridCell phone={4} tablet={8} desktop={7} style={{ padding: '0.5rem 1rem',}}>
                        {
                          this.listofGrades()
                        }
                    </GridCell>
                    </GridRow>

                  }
                  <GridCell span={12} style={{ padding: '0.5rem 1rem',}}>
                    {
                      !editItem && !subject &&
                      this.listofGrades()
                    }
                </GridCell>
            </GridCell>
          </GridRow>
        </Grid>
      </div>
    );
  }
}

export default Grade;
