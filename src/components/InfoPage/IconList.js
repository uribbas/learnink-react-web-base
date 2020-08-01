import React from 'react';
import Exam from '../../assets/icons/exam.png';
import Choice from '../../assets/icons/choice.png';
import CreateTest from '../../assets/icons/create-test_500.png';
import DailyDose from '../../assets/icons/daily-dose_500.png';
import WildChices from '../../assets/icons/wild-choices_500.png';
import AssistiveInside from '../../assets/icons/assistive_500.png';
import TrulyAdaptive from '../../assets/icons/truely-adaptive_500.png';
import ProgressCard from '../../assets/icons/progress_card_500.png';
import Left from '../../assets/icons/chevron_left-black-48dp.svg';
import Right from '../../assets/icons/chevron_right-black-48dp.svg';
// material UI
import {
Grid,
GridCell,
GridRow,
 } from '@rmwc/grid';
import { Typography } from '@rmwc/typography';
import { Button } from '@rmwc/button';
import {
Card,
CardMedia,
CardMediaContent,
CardPrimaryAction,
CardActions } from '@rmwc/card';
import {ListDivider} from '@rmwc/list';
import Carousel, { Dots } from '@brainhubeu/react-carousel';
import { ImageList, ImageListItem, ImageListImage, ImageListSupporting, ImageListLabel,ImageListImageAspectContainer } from '@rmwc/image-list';
import { Icon } from '@rmwc/icon';

// material UI style
import '@rmwc/grid/styles';
import '@rmwc/typography/styles';
import '@rmwc/button/styles';
import '@rmwc/card/styles';
import '@rmwc/list/styles';
import '@rmwc/image-list/styles';
import '@rmwc/icon/styles';

import '@brainhubeu/react-carousel/lib/style.css';

class IconList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value:0,
      selectedItem: {
        imageSrc: WildChices,
        src: '../../assets/icons/wild-choices_500.png',
        primaryText: 'Wild Choices',
        secondaryText: 'Choose from large pool of options.\
                        You are in charge, utilise, practice and go through hints where required',
      },
    }
    this.listofInfoIcons =[
                            {
                              imageSrc: WildChices,
                              src: '../../assets/icons/wild-choices_500.png',
                              primaryText: 'Wild Choices',
                              secondaryText: 'Choose from large pool of options.\
                                              You are in charge, utilise, practice and go through hints where required',
                            },
                            {
                              imageSrc: TrulyAdaptive,
                              src: '../../assets/icons/truely-adaptive_2x3.png',
                              primaryText: 'Truly Adaptive',
                              secondaryText: 'Adapts to the needs, a personalised approach. \
                                              Truly helpful for kids Knowledge, \
                                              focuses on basics to build strong foundation',
                            },
                            {
                              imageSrc: AssistiveInside,
                              src: '../../assets/icons/assistive_500.png',
                              primaryText: 'Assistive Inside',
                              secondaryText: 'Assistive by design. Interestingly helpful, required guidence \
                                              according to the needs. Leading to a joyful learning experience',
                            },
                            {
                              imageSrc: DailyDose,
                              src: '../../assets/icons/daily-dose_500.png',
                              primaryText: 'Daily Dose',
                              secondaryText: 'Daily Knowledge bytes to enhance concepts.\
                                              Food for brain.\
                                              Targetted topics and content to help memorise relevant information',
                            },
                            {
                              imageSrc: CreateTest,
                              src: '../../assets/icons/create-test_500.png',
                              primaryText: 'Create Test',
                              secondaryText: 'Customise and create your tests the way you want.\
                                              Choose topics, set difficulty level\
                                              and define question distribution pattern',
                            },
                            {
                              imageSrc: ProgressCard,
                              src: '../../assets/icons/progress_card_500.png',
                              primaryText: 'Progress Card',
                              secondaryText: 'Know your kids progress, review the performnace, analyse past performances \
                              anytime anywhere, at your convenience',
                            }
                          ];
  this.onchange = this.onchange.bind(this);
  this.generateSlides = this.generateSlides.bind(this);
  }

  componentDidMount() {

  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props !== prevProps) {
      // Add code here
    }
  }

  onchange(value) {
    this.setState({ value });
  }

  generateSlides(){
    return this.listofInfoIcons.map((icon,i)=>{
      return(
        <GridCell>
          <Card className="card" style={{ margin: '0rem', padding: '0rem 0rem', boxShadow: 'none'}}>
            <CardPrimaryAction>
              <GridRow>
                <GridCell phone={2} tablet={4} desktop={6}>
                  <img src={icon.imageSrc} style={{maxHeight: 'auto', width: '100%',padding: '0.5rem 1rem 0rem'}}/>
                </GridCell>
                <GridCell phone={2} tablet={4} desktop={6}>
                  <div style={{ padding: '1rem 1rem 1rem 1rem' }}>
                    <Typography use="headline5" tag="h2">
                      {icon.primaryText}
                    </Typography>
                </div>
                </GridCell>
              </GridRow>
              <div style={{ padding: '1rem 1rem 3rem 1rem' }}>
                <Typography
                  use="body1"
                  tag="div"
                  theme="textSecondaryOnBackground"
                  style={{color: "grey"}}
                >
                  {icon.secondaryText}
                </Typography>
              </div>
            </CardPrimaryAction>
          </Card>
        </GridCell>

      );
    });
  }

  render(){

    return(
      <div>
        <GridRow>
          <GridCell phone={4} tablet={5} desktop={8}>
            <div>
              <Carousel
                keepDirectionWhenDragging
                // arrows
                arrowLeft={<Icon icon={{ icon: <img src={Left} style={{opacity: '0.3', cursor: 'pointer'}}/>, strategy: 'ligature' }} />}
                arrowLeftDisabled={<Icon icon={{ icon: <img src={Left} style={{opacity: '0.08', }}/>, strategy: 'ligature' }} />}
                arrowRight={<Icon icon={{ icon: <img src={Right} style={{opacity: '0.3', cursor: 'pointer'}}/>, strategy: 'ligature' }} />}
                arrowRightDisabled={<Icon icon={{ icon: <img src={Right} style={{opacity: '0.08',}}/>, strategy: 'ligature' }} />}
                addArrowClickHandler
                value={this.state.value}
                onChange={this.onchange}
                slides={ this.generateSlides() }
              />
            </div>
          </GridCell>
          <GridCell phone={4} tablet={3} desktop={4}>
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
                this.listofInfoIcons.map((src,i) => (
                  <ImageListItem key={src.src} style={{ marginBottom: '10px'}}
                    >
                    <Card style={{ padding: '0rem 0rem',border: '1px solid rgb(0,0,0,0.1)'}}>
                      <CardPrimaryAction
                        onClick={()=>{this.setState({ value: i })}}
                        >
                        <ImageListImage src={src.imageSrc}
                          style={{objectFit: 'cover', margin: 'auto',
                                  // height: [1,4].includes(i) ? 'auto' :'80px',
                                  padding: [1,2,5].includes(i) ? '1.0rem 0 3rem' : '0.02rem 0 1.5rem',
                                  // padding: [1,2,5].includes(i) ? '0.5rem 0 1rem' : '0',
                                  width: '100%', }}/>
                        <ImageListSupporting style={{backgroundColor: 'rgba(0,0,0,0)', color: '#000000', padding:'1rem .25rem 0'}}>
                          <ImageListLabel style={{fontSize: '10px', paddingLeft: '0px'}}>{src.primaryText}</ImageListLabel>
                        </ImageListSupporting>
                      </CardPrimaryAction>
                    </Card>
                  </ImageListItem>
                ))
              }
            </ImageList>
        </GridCell>
      </GridRow>
    </div>
    );
  }
}

export default IconList;
