import * as React from 'react';
import * as ReactDom from 'react-dom';

import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import News from './components/News';

import { INewsProps } from './components/INewsProps';
 

export interface INewsWebPartProps {
  description: string;
}


export default class NewsWebPart extends BaseClientSideWebPart<INewsWebPartProps> {


  public render(): void {
    const element: React.ReactElement<INewsProps> = React.createElement(
      News,
      {
        description: this.properties.description,
        context: this.context, 
      }
    );


    ReactDom.render(element, this.domElement); 

  }


}
