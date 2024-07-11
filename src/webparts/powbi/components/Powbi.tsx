import * as React from 'react';
import type { IPowbiProps } from './IPowbiProps';
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import styles from './Powbi.module.scss';
import axios from 'axios';
import { MYModal } from './MYModal';
import { TooltipHost } from '@fluentui/react/lib/Tooltip';


interface IState {
  hedeflerList: any[];
  aylikciroList: any[];
  siralamaList: any[]; 
  cirowebList: any[];
  dgList: any[];
  sayacList: any[]; 
  satisList: any[];
  toplusatisList: any[];
  magazaKodu: string;
  siraNo : number;
  modalOpen: boolean;
  modalOpen2: boolean;
  image: string;
}

export default class Powbi extends React.Component<IPowbiProps, IState> {
  constructor(props: IPowbiProps) {
    super(props);

    this.state = {
      hedeflerList: [],
      aylikciroList: [],
      siralamaList: [],
      cirowebList: [],
      sayacList: [],
      satisList: [],
      dgList: [],
      toplusatisList: [],
      magazaKodu: "",
      siraNo: 0,
      modalOpen: false,
      modalOpen2: false,
      image: "",
    };


  };

  componentDidMount(): void {
    this.dogumgunu();
    this.getData();
    this.getData2();
  };

  closeModal = () => {
    this.setState({ modalOpen: false });
  };
  closeModal2 = () => {
    this.setState({ modalOpen2: false });
  };
  getData = (): void => {
    const user = this.props.context.pageContext.user.email
    const listName = "Magazalar"; // Listenizin adını buraya ekleyin
    const columns = [
      "Mail",
      "Title"
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

              if (magazauser) {
                this.setState({ magazaKodu: magazauser.Title }, () => {

                  if (magazauser.Title !== "") {
                    this.aylikciro();
                    this.cirowebsiralama();
                    this.cirowebmagaza();
                    this.hedefler();
                    this.sayac();
                    this.satislar();
                    this.toplusatis();
                  }
                  else (
                    console.log("hata")
                  )

                });
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

  getData2 = (): void => {
    const listName = "Yemekhane"; // Listenizin adını buraya ekleyin
    const columns = ["src", "Created"]; // Created kolonunu da ekleyin
  
    this.props.context.spHttpClient
      .get(
        `${this.props.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('${listName}')/items?$select=${columns.join(",")}&$orderby=Created desc&$top=1`,
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
            if (responseJSON.value && responseJSON.value.length > 0) {
              const imageUrl = responseJSON.value[0].src; // 'src' kolonundaki URL'i çek
              console.log(imageUrl);
              this.setState({ image: imageUrl });
            } else {
              console.log("Resim bulunamadı, lütfen desteğe başvurunuz.");
            }
          });
        } else {
          console.log("Yanıt hatası: ", response.statusText);
        }
      })
      .catch((error: any) => {
        console.log("İstek hatası: ", error);
      });
  };
  


  dogumgunu = async (): Promise<void> => {
    try {
      const response = await axios.get(`https://satinalmaformu.com/dogumgunu`);
      if (response.status === 200) {
        this.setState({ dgList: response.data })

      } else {
        console.error(response.data);
        alert(`Bir terslik var.`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  toplusatis = async (): Promise<void> => {
    try {
      const response = await axios.get(`https://satinalmaformu.com/toplusatis`);
      if (response.status === 200) {
        this.setState({ toplusatisList: response.data })

      } else {
        console.error(response.data);
        alert(`Bir terslik var.`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  hedefler = async (): Promise<void> => {
    try {
      const response = await axios.get(`https://satinalmaformu.com/hedefler/${this.state.magazaKodu}/get`);
      if (response.status === 200) {

        this.setState({ hedeflerList: response.data })


      } else {

        alert(`Bir terslik var.`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  satislar = async (): Promise<void> => {
    try {
      const response = await axios.get(`https://satinalmaformu.com/satis/${this.state.magazaKodu}/get`);
      if (response.status === 200) {

        this.setState({ satisList: response.data })


      } else {

        alert(`Bir terslik var.`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  aylikciro = async (): Promise<void> => {
    try {
      const response = await axios.get(`https://satinalmaformu.com/aylikciro/${this.state.magazaKodu}/get`);
      if (response.status === 200) {
        this.setState({ aylikciroList: response.data })


      } else {
        alert(`Bir terslik var.`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  cirowebmagaza = async (): Promise<void> => {
    try {
      const response = await axios.get(`https://satinalmaformu.com/cirowebmagazakodu/${this.state.magazaKodu}/get`);
      if (response.status === 200) {
        this.setState({ cirowebList: response.data });
        this.setState({siraNo : response.data[0].SiraNo}); 

      } else {
        alert(`Bir terslik var.`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  cirowebsiralama = async (): Promise<void> => {
    try {
      const response = await axios.get(`https://satinalmaformu.com/ciroweb`);
      if (response.status === 200) {
        this.setState({ siralamaList: response.data })



      } else {
        alert(`Bir terslik var.`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  sayac = async (): Promise<void> => {
    try {
      const response = await axios.get(`https://satinalmaformu.com/sayac/${this.state.magazaKodu}/get`);
      if (response.status === 200) {
        this.setState({ sayacList: response.data })
      } else {
        alert(`Bir terslik var.`);
      }
    } catch (error) {
      console.error(error);
    }
  };
  resmibuyut  = () => {

  };


  public render(): React.ReactElement<IPowbiProps> {
  
    let sayaccomponent = (
      <div>
        <table className={styles.table3}>
          <thead>
            <tr>
              <th >Saat Aralığı</th>
              <th>Trafik</th>
            </tr>
          </thead>
          <tbody>
            {this.state.sayacList.map((kayit, index) => (
              <tr key={index}>
                <td >{kayit.CurrentHour} - {kayit.CurrentHour + 1}</td>
                <td >{kayit.InVisitorCount}</td>

              </tr>
            ))}
          </tbody>
        </table>

      </div>
    )
    const hedeflerList = this.state.hedeflerList.map(item => parseFloat(item.TurnoverTarget));
    const aylikciroList = this.state.aylikciroList.map(item => parseFloat(item.KdvsizCiro));

    const sonuc = hedeflerList.map((item, index) => item - aylikciroList[index]);
    const nihaisonuc = sonuc.map(item => item < 0 ? `ciro hedefini aştınız \n + ${Math.abs(item).toLocaleString("tr")}` : item.toLocaleString("tr"));

    let reportComponent = null;



    if (this.state.magazaKodu === "") { 
      reportComponent = (
        <div>
        <div className={styles.header}>Hoş Geldiniz <br></br> {this.props.context.pageContext.user.displayName}
        </div>
        <div className={`${styles.header} image-container`}> 
          {this.state.image ? (
            <button onClick={() => this.setState({ modalOpen2: true })}
             >
            <img src={this.state.image} width={350} alt="Küçük Resim" />   
          </button> 
          ) : (
            <p>Resim yükleniyor...</p>   
          )}
        </div>
      </div>);
    } else {

      reportComponent = (

        <div>
          <div className={styles.usercontainer}>

            <table className={styles.table}>

              <tr>
                <td>
                  <div className={styles.header}>Hoş Geldiniz <br></br> {this.props.context.pageContext.user.displayName}</div>
                </td>
              </tr>

              <tr>
                <td>
                  <button className={styles.card} onClick={() => this.setState({ modalOpen: true })}>
                    <div className={styles['card-header']}>
                      Aylık Ciro
                    </div>
                    <div className={styles['card-content']}>
                      {this.state.aylikciroList.map(item => item && item.KdvsizCiro ? item.KdvsizCiro.toLocaleString("tr") : '0').join(', ') + " ₺"}
                    </div>
                  </button>
                </td>
              </tr>

              {this.state.cirowebList.some(item => item.KdvsizCiro !== null) && (
                <tr>
                  <td>
                    <div className={styles.card}>
                      <div className={styles['card-header']}>
                        Günlük Ciro
                      </div>
                      <div className={styles['card-content']}>
                        {this.state.cirowebList.map(item => item && item.KdvsizCiro ? item.KdvsizCiro.toLocaleString("tr") : 0).join(', ') + " ₺"}
                      </div>
                    </div>
                  </td>
                </tr>
              )}

              {this.state.cirowebList.some(item => item.PosetOrtalama !== null) && (
                <tr>
                  <td>
                    <div className={styles.card}>
                      <div className={styles['card-header']}>
                        Poşet Ortalama
                      </div>
                      <div className={styles['card-content']}>
                        {this.state.cirowebList.map(item => item && item.PosetOrtalama ? item.PosetOrtalama.toLocaleString("tr") : '-').join(', ') || "Boş"}
                      </div>
                    </div>
                  </td>
                </tr>
              )}

              {this.state.cirowebList.some(item => item.SatisAdedi !== null) && (
                <tr>
                  <td >
                    <div className={styles.card}>
                      <div className={styles['card-header']}>
                        Satış Adedi
                      </div>
                      <div className={styles['card-content']}>
                        {this.state.cirowebList.map(item => item && item.SatisAdedi ? item.SatisAdedi.toLocaleString("tr") : '-').join(', ')}
                      </div>
                    </div>
                  </td>
                </tr>
              )}

              {this.state.cirowebList.some(item => item.ConvercationRate !== null) && (
                <tr>
                  <td >
                    <div className={styles.card}>
                      <div className={styles['card-header']}>
                        Dönüşüm Oranı
                      </div>
                      <div className={styles['card-content']}>
                        {"%" + this.state.cirowebList.map(item => item && item.ConversationRate ? item.ConversationRate.toLocaleString("tr") : '0').join(', ')}
                      </div>
                    </div>
                  </td>
                </tr>
              )}

              {this.state.cirowebList.some(item => item.InVisitorCount !== null) && (
                <tr>
                  <td >
                    <TooltipHost
                      content={sayaccomponent}
                      id={"sayac"}
                    >
                      <div className={styles.card}>
                        <div className={styles['card-header']}>
                          Günlük Ziyaretçi Sayısı
                        </div>
                        <div className={styles['card-content']}>
                          {this.state.cirowebList.map(item => item && item.InVisitorCount ? item.InVisitorCount.toLocaleString("tr") : '-').join(', ')}

                        </div>
                      </div>
                    </TooltipHost>
                  </td>
                </tr>
              )}

              <tr>
                <td>
                  <div className={styles.card}>
                    <div className={styles['card-header']}>
                      Bu Ayın Hedefi
                    </div>
                    <div className={styles['card-content']}>
                      {this.state.hedeflerList.map(item => item && item.TurnoverTarget ? item.TurnoverTarget.toLocaleString("tr") : '0').join(', ') + " ₺"}
                    </div>
                  </div>
                </td>
              </tr>

              <tr>

                <td >
                  <div className={styles.card}>
                    <div className={styles['card-header']}>
                      Kalan Hedef
                    </div>
                    <div className={styles['card-content']}>
                      {nihaisonuc + " ₺" || 0} 
                    </div>
                  </div>
                </td>
              </tr>

              <div className={styles.divider}></div>

              {this.state.satisList.some(item => item.FirstLastName !== null) && (
                <div>
                  <tr>
                    <th className={styles.header}>Mağazamızın Yıldızları</th>
                  </tr>
                  <tr>

                    <td>
                      {this.state.satisList.map((kayit, index) => (
                        <div className={styles.card2}>
                          <div className={styles.icon}>
                            🛍️
                          </div>
                          <div className={styles.info}>
                            <div className={styles.name}>{kayit.FirstLastName}</div>
                            <div className={styles.department}>Miktar :{kayit.Miktar}</div>
                            <div className={styles.title}>Tutar :{kayit.Tutar.toLocaleString("tr")}</div>
                          </div>
                        </div>
                      ))}
                    </td>

                  </tr>
                </div>
              )}

<div className={styles.divider}></div>

              {this.state.toplusatisList.some(item => item.FirstLastName !== null) && (
                <div>
                  <tr>
                    <th className={styles.header}> Toplu Satışlar</th>
                  </tr>


                  <tr>

                    <td>
                      {this.state.toplusatisList.map((kayit, index) => (
                        <div className={styles.card2}>
                          <div className={styles.icon}>
                            🛒
                          </div>
                          <div className={styles.info}>
                            <div className={styles.name}>{kayit.FirstLastName}</div>
                            <div className={styles.department}>{kayit.CurrAccDescription}</div>
                            <div className={styles.title}>Miktar : {kayit.Qty} - Tutar : {kayit.NetAmount.toLocaleString("tr")}</div>
                          </div>
                        </div>
                      ))}
                    </td>

                  </tr>

                  <div className={styles.divider}></div>
                </div>
              )}


            </table>
          </div>

          {this.state.modalOpen && (
            <MYModal handler={this.closeModal}>
              <div >
                <table className={styles.table2}>
                  <thead>
                    <tr>
                      <th colSpan={9}>
                        Ciro Sıralama Tablosu
                      </th>
                    </tr>
                    <tr>
                      <th >Sıra No</th>
                      <th>Mağaza Kodu</th>
                      <th colSpan={3}>Mağaza</th>
                      <th>İşlem Adedi</th>
                      <th>Satış Adeti</th>
                      <th>Poşet Ortalama</th>
                      <th>Dönüşüm Oranı </th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.siralamaList.map((kayit, index) => (
                      <tr style={{ backgroundColor: index + 1 ===  this.state.siraNo ? 'yellow' : 'transparent' }} key={index}> 
                        <td >{kayit.SiraNo}</td>
                        <td >{kayit.MagazaKodu}</td>
                        <td colSpan={3}>{kayit.Magaza}</td>  
                        <td>{kayit.NetIslemAdedi}</td>
                        <td>{kayit.SatisAdedi}</td>
                        <td>{kayit.PosetOrtalama}</td>
                        <td>{kayit.ConversationRate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

              </div>
            </MYModal>
          )}
        </div>
      )
    };
    return (
      <div>
        {reportComponent}
        {this.state.dgList.some(item => item.Ad !== null) && (
          <table>
            <div>
              <tr>
                <th className={styles.header}> Doğum Gününüz Kutlu Olsun !</th>
              </tr>
              <tr>
                <td>
                  {this.state.dgList.map((kayit, index) => (
                    <div className={styles.card2}>
                      <div className={styles.icon}>
                        🎉
                      </div>
                      <div className={styles.info}> 
                        <div className={styles.name}>{kayit.Ad}</div>
                        <div className={styles.department}>{kayit.Departman}</div>
                        <div className={styles.title}>{kayit.Unvan}</div>
                      </div>
                    </div>
                  ))}
                </td>
              </tr>
            </div>
          </table>
        )}

{this.state.modalOpen2 && (
            <MYModal handler={this.closeModal2}>
              <div >
              <img src={this.state.image} width={800} alt="Küçük Resim" /> 
              </div>
            </MYModal>
          )}

      </div>
    )

  }
}
