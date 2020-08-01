import React from 'react';
import Latex from 'react-latex';
import Logo from '../../assets/icons/learnink-logo_500.png';
// material UI
import {
Grid,
GridRow,
GridCell,
 } from '@rmwc/grid';
 import { Typography } from '@rmwc/typography';
 import { Button } from '@rmwc/button';
 import { IconButton } from '@rmwc/icon-button';
import { TopAppBar, TopAppBarRow, TopAppBarSection, TopAppBarNavigationIcon,
  TopAppBarTitle, TopAppBarActionItem, TopAppBarFixedAdjust } from '@rmwc/top-app-bar';

// material UI style
import '@rmwc/grid/styles';
import '@rmwc/typography/styles';
import '@rmwc/button/styles';
import '@rmwc/icon-button/styles';
import '@rmwc/top-app-bar/styles';
// Katex css
import 'katex/dist/katex.min.css'

class LatexBuilder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dummy: false,
    }

    this.latexItems=[
      {name: ' \\times ', text: ' \\times '},
      {name: ' \\div ', text: ' \\div '},
      {name: ' + ', text: ' + '},
      {name: ' - ', text: ' - '},
      {name: ' = ', text: ' = '},
      {name: ' a + b\\over c ', text: ' \\over '},
      {name: ' x^{ y } ', text: ' ^{ expression } '},
      {name: ' \\sqrt {x} ', text: ' \\sqrt {expression} '},
      {name: ' x^{ \\circ } ', text: ' ^{ \\circ } '},
      {name: ' \\frac { x } { y } ', text: ' \\frac { numerator } { denominator } '},
      {name: ' X _{ n } ', text: ' _{ expression } '},
      {name: ' () ', text: ' ( expression ) '},
      {name: ' \\{\\} ', text: ' \{ expression \} '},
      {name: ' [] ', text: ' [ expression ] '},
      {name: ' ↵ ', text: ' $\\\\$ '},
      {name: ' fx ',text: ' $ expression $ '},
      // {name: '', icon: Logo, text: ' <img src=\"address\" width="20" \/> '}
    ];

    this.parentHandler = this.props.parentHandler;
  }


  createLatexItems(){
    return this.latexItems.map(i=>{
      return(
        // <GridCell phone={1} tablet={1} desktop={1}>
          <Button
            key={i.name}
            outlined
            style={{
              margin: '0.1rem',
              textTransform: 'none',
              // zoom: '0.75',
              // '-moz-transform' : 'scale(0.75)',
            }}
            type="button"
            icon={ i.icon }
            label={<Latex>{"$ " + i.name + " $"}</Latex>}
            onClick={()=>{
              this.parentHandler(i.text)
            }}
          />
        // </GridCell>

      );
    })

  }

  render(){
    return(
      <div style={{
        zoom: '0.75',
        MozTransform : 'scale(0.75)',
        textAlign: 'center'
      }}>
        {/* <GridRow> */}
          {
            this.createLatexItems()
          }
        {/* </GridRow> */}

      </div>
    );
  }
}

export default LatexBuilder;
