import * as React from 'react';
import * as ReactDom from 'react-dom';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import Powbi from './components/Powbi';
import { IPowbiProps } from './components/IPowbiProps';

export interface IPowbiWebPartProps {
  description: string;
}

export default class PowbiWebPart extends BaseClientSideWebPart<IPowbiWebPartProps> {



  public render(): void {
    const element: React.ReactElement<IPowbiProps> = React.createElement(
      Powbi,
      {
        description: this.properties.description,
        context: this.context, 

      }
    );

    ReactDom.render(element, this.domElement);
  }


}
