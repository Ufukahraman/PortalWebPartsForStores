// News.tsx
import * as React from 'react';
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import type { INewsProps } from './INewsProps';


interface NewsState {
  link: string;
}

export default class News extends React.Component<INewsProps, NewsState> {
  constructor(props: INewsProps) {
    super(props);

    this.state = {
      link: ``, 
    };
  }

  componentDidMount(): void {
    this.getData();
  }

  formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0'); // Günü al ve 2 basamaklı olacak şekilde biçimlendir
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Ayı al ve 2 basamaklı olacak şekilde biçimlendir (0-indeksi unutmayın)
    const year = date.getFullYear(); // Yılı al 

    return `${day}/${month}/${year}`; // Tarihi dd/mm/yyyy biçiminde döndür
  }

  getData = (): void => {
    const user = this.props.context.pageContext.user.email
    const listName = "Magazalar"; // Listenizin adını buraya ekleyin
    const columns = [
      "Mail",
      "Link"
    ];

    this.props.context.spHttpClient
      .get(
        `${this.props.context.pageContext.web.absoluteUrl
        }/_api/web/lists/getbytitle('${listName}')/items?$select=${columns.join(
          ","
        )}`,
        SPHttpClient.configurations.v1,
        {
          headers: {
            Accept: "application/json;odata=nometadata",
            "Content-type": "application/json;odata=nometadata",
            "odata-version": "", 
          },
        }
      )
      .then((response: SPHttpClientResponse) => {
        if (response.ok) {
          response.json().then((responseJSON) => {
            if (responseJSON.value) { // 'value' özelliğinin var olduğunu kontrol et


              const magazauser = responseJSON.value.find((item: any) => {
                return item.Mail === user;
              });
              const merkezuser = responseJSON.value.find((item: any) => {   
                return item.Mail === 'merkezuser';
              });



              if (magazauser) {  
                this.setState({ link: magazauser.Link });   
              } 
              else { 
                this.setState({ link: merkezuser.Link }); 
              }


            } else {

              console.log("kullanıcı bulunamadı lütfen desteğe başvurunuz"); 
            }
          });
        } 
      })
      .catch((error: any) => { 
        console.log(error);
      });
  };

  public render(): React.ReactElement<INewsProps> {
    return (
      <div>

        <div style={{ position: 'relative', overflow: 'hidden' }}>


          <iframe src={this.state.link}
            width="1000" height="500"  allowFullScreen={true} style={{ position: 'relative' }}>  
          </iframe>

        </div>  

      </div>

    );

  }
}
