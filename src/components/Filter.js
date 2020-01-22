import React, { Component } from 'react';
import { StyleSheet, Text, View, I18nManager, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Container, Content, Icon, Title, Header, Body, Button, Picker, Item } from 'native-base'

import * as Animatable from 'react-native-animatable';

class Filter extends Component {

  componentWillMount() {
    I18nManager.forceRTL(true)
  }

  constructor(props) {
    super(props);
    this.state = {
        selected2   : undefined,
    };
  }

  onValueChange(value) {
    this.setState({
      selected      : value
    });
  }

  render() {
    return (
      <Container>
        <Header style={styles.header}>
          <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon style={styles.icons} type="Entypo" name='chevron-thin-right' />
          </Button>
          <Body style={styles.bodyText}>
            <Title style={styles.Title}>الآبل</Title>
          </Body>
        </Header>
        <Content contentContainerStyle={{ flexGrow: 1 }} style={styles.contentView}>
        <View style={styles.upBlock}></View>
        <Image style={styles.curve} source={require('../../assets/white_curve.png')}/>
        <View style={styles.bgImage}>
            <View style={styles.bgDiv}>
                
                <Animatable.View animation="fadeInLeft" easing="ease-out" delay={1000}>
                  <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} style={[styles.scroll , styles.scrollRight]}>

                      <Button style={[styles.BTN , styles.Active]}>
                          <Text style={[styles.TextRight , styles.textActive]}>الكل</Text>
                      </Button>
                      <Button style={styles.BTN}>
                          <Text style={styles.TextRight}>فرديات</Text>
                      </Button>
                      <Button style={styles.BTN}>
                          <Text style={styles.TextRight}>مزاين</Text>
                      </Button>
                      <Button style={styles.BTN}>
                          <Text style={styles.TextRight}>قحول</Text>
                      </Button>
                      <Button style={styles.BTN}>
                          <Text style={styles.TextRight}>طيبه</Text>
                      </Button>
                      <Button style={styles.BTN}>
                          <Text style={styles.TextRight}>مزاين</Text>
                      </Button>
                      <Button style={styles.BTN}>
                          <Text style={styles.TextRight}>طيبه</Text>
                      </Button>
                      <Button style={styles.BTN}>
                          <Text style={styles.TextRight}>مزاين</Text>
                      </Button>

                  </ScrollView>
                </Animatable.View>   
                
                <Animatable.View animation="fadeInRight" easing="ease-out" delay={1000}>
                    <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} style={[styles.scroll , styles.scrollLeft]}>

                        <Button style={[styles.BTN , styles.Active]}>
                            <Text style={[styles.TextLeft , styles.textActive]}>الكل</Text>
                        </Button>
                        <Button style={styles.BTN}>
                            <Text style={styles.TextLeft}>بني غامق</Text>
                        </Button>
                        <Button style={styles.BTN}>
                            <Text style={styles.TextLeft}>اصفر</Text>
                        </Button>
                        <Button style={styles.BTN}>
                            <Text style={styles.TextLeft}>بيج</Text>
                        </Button>
                        <Button style={styles.BTN}>
                            <Text style={styles.TextLeft}>بني</Text>
                        </Button>
                        <Button style={styles.BTN}>
                            <Text style={styles.TextLeft}>اصفر</Text>
                        </Button>
                        <Button style={styles.BTN}>
                            <Text style={styles.TextLeft}>اسود</Text>
                        </Button>
                        <Button style={styles.BTN}>
                            <Text style={styles.TextLeft}>اخضر</Text>
                        </Button>

                    </ScrollView>
                </Animatable.View>


                <View style={styles.filter}>

                    <View style={styles.viewPiker}>
                        <Item style={styles.itemPiker} regular>
                            <Picker
                                mode="dropdown"
                                style={styles.Picker}
                                placeholderStyle={{ color: "#fff", writingDirection: 'rtl', width : '100%',fontFamily : 'CairoRegular', fontSize : 18 }}
                                selectedValue={this.state.selected}
                                onValueChange={this.onValueChange.bind(this)}
                                textStyle={{ color: "#fff",fontFamily : 'CairoRegular', writingDirection: 'rtl' }}
                                placeholder="البلد"
                                itemTextStyle={{ color: '#fff',fontFamily : 'CairoRegular', writingDirection: 'rtl' }}>
                                <Picker.Item label="السنبلاوين" value="pen0" />
                                <Picker.Item label="مصر" value="pen1" />
                                <Picker.Item label="السعوديه" value="pen2" />
                                <Picker.Item label="الكويت" value="pen3" />
                                <Picker.Item label="انجولا" value="pen4" />
                            </Picker>
                        </Item>
                        <Icon style={styles.iconPicker} type="AntDesign" name='down' />
                    </View>

                    <TouchableOpacity style={styles.clickFunction}>
                        <Text style={styles.textFun}>الآقرب</Text>
                        <Icon style={styles.iconFun} type="MaterialCommunityIcons" name='map-marker-outline' />
                    </TouchableOpacity>

                </View>

                <View style={styles.blockUp}>

                <Animatable.View animation="fadeInUp" easing="ease-out" delay={1000}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('detailsadv')}>
                        <View style={styles.blockItem}>
                            <View style={styles.overLay}></View>
                            <View style={styles.blockImg}>
                                <TouchableOpacity style={styles.clickFav}>
                                    <Icon style={styles.iconFun} type="SimpleLineIcons" name='heart' />
                                </TouchableOpacity>
                                <Image style={styles.Img} source={require('../../assets/animal.jpg')}/>
                            </View>
                            <View style={styles.blockInfo}>
                                <View style={styles.view}>
                                    <Text style={styles.textN}>آعلان شعوذه</Text>
                                </View>
                                <View style={styles.view}>
                                    <Icon style={styles.iconN} type="AntDesign" name='user' />
                                    <Text style={styles.textN}> شعوذه </Text>
                                </View>
                                <View style={styles.viewN}>
                                    <View style={styles.view}>
                                        <Icon style={styles.iconN} type="MaterialCommunityIcons" name='map-marker-outline' />
                                        <Text style={styles.textN}> الرياض </Text>
                                    </View>
                                    <Text style={styles.textN}>20/9/2020</Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                </Animatable.View>

                <Animatable.View animation="fadeInUp" easing="ease-out" delay={1000}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('detailsadv')}>
                        <View style={styles.blockItem}>
                            <View style={styles.overLay}></View>
                            <View style={styles.blockImg}>
                                <TouchableOpacity style={styles.clickFav}>
                                    <Icon style={styles.iconFun} type="SimpleLineIcons" name='heart' />
                                </TouchableOpacity>
                                <Image style={styles.Img} source={require('../../assets/animal.jpg')}/>
                            </View>
                            <View style={styles.blockInfo}>
                                <View style={styles.view}>
                                    <Text style={styles.textN}>آعلان شعوذه</Text>
                                </View>
                                <View style={styles.view}>
                                    <Icon style={styles.iconN} type="AntDesign" name='user' />
                                    <Text style={styles.textN}> شعوذه </Text>
                                </View>
                                <View style={styles.viewN}>
                                    <View style={styles.view}>
                                        <Icon style={styles.iconN} type="MaterialCommunityIcons" name='map-marker-outline' />
                                        <Text style={styles.textN}> الرياض </Text>
                                    </View>
                                    <Text style={styles.textN}>20/9/2020</Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                </Animatable.View>

                <Animatable.View animation="fadeInUp" easing="ease-out" delay={1000}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('detailsadv')}>
                        <View style={styles.blockItem}>
                            <View style={styles.overLay}></View>
                            <View style={styles.blockImg}>
                                <TouchableOpacity style={styles.clickFav}>
                                    <Icon style={styles.iconFun} type="SimpleLineIcons" name='heart' />
                                </TouchableOpacity>
                                <Image style={styles.Img} source={require('../../assets/animal.jpg')}/>
                            </View>
                            <View style={styles.blockInfo}>
                                <View style={styles.view}>
                                    <Text style={styles.textN}>آعلان شعوذه</Text>
                                </View>
                                <View style={styles.view}>
                                    <Icon style={styles.iconN} type="AntDesign" name='user' />
                                    <Text style={styles.textN}> شعوذه </Text>
                                </View>
                                <View style={styles.viewN}>
                                    <View style={styles.view}>
                                        <Icon style={styles.iconN} type="MaterialCommunityIcons" name='map-marker-outline' />
                                        <Text style={styles.textN}> الرياض </Text>
                                    </View>
                                    <Text style={styles.textN}>20/9/2020</Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                </Animatable.View>

                <Animatable.View animation="fadeInUp" easing="ease-out" delay={1000}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('detailsadv')}>
                        <View style={styles.blockItem}>
                            <View style={styles.overLay}></View>
                            <View style={styles.blockImg}>
                                <TouchableOpacity style={styles.clickFav}>
                                    <Icon style={styles.iconFun} type="SimpleLineIcons" name='heart' />
                                </TouchableOpacity>
                                <Image style={styles.Img} source={require('../../assets/animal.jpg')}/>
                            </View>
                            <View style={styles.blockInfo}>
                                <View style={styles.view}>
                                    <Text style={styles.textN}>آعلان شعوذه</Text>
                                </View>
                                <View style={styles.view}>
                                    <Icon style={styles.iconN} type="AntDesign" name='user' />
                                    <Text style={styles.textN}> شعوذه </Text>
                                </View>
                                <View style={styles.viewN}>
                                    <View style={styles.view}>
                                        <Icon style={styles.iconN} type="MaterialCommunityIcons" name='map-marker-outline' />
                                        <Text style={styles.textN}> الرياض </Text>
                                    </View>
                                    <Text style={styles.textN}>20/9/2020</Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                </Animatable.View>

                </View>

            </View>
        </View>
        </Content>

      </Container>
    );
  }
}

const styles = StyleSheet.create({
  header:{
    backgroundColor     : "#dba261",
    borderBottomColor   : "#dba261",
    paddingRight        : 0,
    paddingLeft         : 0,
    paddingTop          : 10,
    alignItems          : 'center',
    justifyContent      : 'center', 
    alignSelf           : 'center',
      height : 90
  },
  bodyText : {
    alignItems          : 'flex-end',
  },
  contentView : {
    backgroundColor     : '#dba261',
  },
  bgImage : {
    flex                : 1,
    backgroundColor     : '#fff',
    zIndex              : 99,
    position            : "relative",
    top                 : 0,
  },
  Title : {
    color               : "#fff",
    fontFamily          : "CairoRegular",
    textAlign           : "center",
    fontSize            : 17,
    backgroundColor     : "#504b45",
    width               : 150,
    paddingTop          : 5,
    paddingBottom       : 5,
    borderBottomRightRadius  : 10,
    borderTopRightRadius     : 10,
  },
  text : {
    color               : "#fff",
    position            : "relative",
    zIndex              : 99,
    fontFamily          : "CairoRegular",
    textAlign           : "center",
    fontSize            : 22
  },
  curve : {
    width               : '100%',
    height              : 80,
    zIndex              : -1,
    position            : 'absolute',
    top                 : 40,
  },
  upBlock : {
    minHeight           : 120,
  },
  bgDiv : {
    paddingRight        : 10,
    paddingLeft         : 10,
    top                 : -30
  },
  icon : {
    color               : "#FFF",
    fontSize            : 25,
    position            : "relative",
    left                : -7
  },
  icons : {
    color               : "#FFF",
    fontSize            : 25,
  },
  scroll: {
    flexDirection         : 'row',
    borderWidth           : 1,
    borderStyle           : 'solid',
    borderColor           : '#DDD',
    marginBottom          : 10,
    width                 : "100%",
    overflow              : "hidden",
    backgroundColor       : "rgba(255, 255, 255, 0.4)",
  },
  scrollRight : {
    position              : "relative",
    left                  : 10,
    borderBottomLeftRadius  : 10,
    borderTopLeftRadius     : 10,
  },
  scrollLeft : {
    position              : "relative",
    right                 : 10,
    borderBottomRightRadius  : 10,
    borderTopRightRadius     : 10,
    backgroundColor         : "rgba(0, 0, 0, 0.4)",
  },
  Active : {
    borderTopColor        : "#121212",
    borderTopWidth        : 1
  },
  textActive : {
    color                 : "#121212",
  },
  TextRight: {
    color                 : '#dba261',
    paddingHorizontal     : 15,
    fontFamily            : 'CairoRegular'
  },
  TextLeft : {
    color                 : '#fff',
    paddingHorizontal     : 15,
    fontFamily            : 'CairoRegular'
  },
  BTN : {
    backgroundColor       : "transparent",
    shadowColor           : "transparent",
    shadowOffset          : { width: 0,height: 0 },
    elevation             : 0,
    borderRadius          : 0
  },
  filter : {
    flexDirection       : "row",
    justifyContent      : "space-between",
    marginBottom        : 20
  },
  viewPiker : {
    position            : 'relative',
    marginTop           : 5,
    marginBottom        : 5,
    flexBasis           : "33%",
    alignItems          : 'center',
    justifyContent      : 'center', 
    alignSelf           : 'center',
    backgroundColor     : "#4c4640",
    borderRadius        : 5,
  },
  Picker : {
    width               : '100%', 
    writingDirection    : 'rtl',
    borderWidth         : 0,
    paddingLeft         : 0,
    fontSize            : 18,
    fontFamily          : 'CairoRegular',
    backgroundColor     : 'transparent',
    marginRight         : 0,
    borderRadius        : 10,
    height              : 40,
  },
  itemPiker : {
    borderWidth         : 0, 
    borderColor         : '#FFF',
    width               : '100%',
    position            : 'relative',
    fontSize            : 18,
    fontFamily          : 'CairoRegular',
    borderRadius        : 5,
    borderLeftWidth     : 0,
    borderBottomWidth   : 0,
    borderTopWidth      : 0,
    borderRightWidth    : 0
  },
  iconPicker : {
    position            : 'absolute',
    right               : 5,
    color               : "#fff",
    fontSize            : 16
  },
  clickFunction : {
    backgroundColor     : "#4c4640",
    alignItems          : 'center',
    justifyContent      : 'space-between', 
    alignSelf           : 'center',
    borderRadius        : 5,
    padding             : 8,
    flexBasis           : "33%",
    flexDirection       : "row"
  },
  textFun : {
    color               : "#fff",
    fontFamily          : "CairoRegular",
    fontSize            : 14,
  },
  iconFun : {
    color               : "#FFF",
    fontSize            : 16,
  },
  blockItem : {
    position            : "relative",
    flexDirection       : "row",
    justifyContent      : "space-between",
    alignItems          : "center",
    borderRadius        : 5,
    backgroundColor     : "rgba(255, 255, 255, 0.6)",
    borderWidth         : 1,
    borderColor         : "#DDD",
    padding             : 10,
    marginVertical      : 10
  },
  overLay : {
    width                 : '107%',
    height                : 95,
    borderWidth           : 1,
    borderColor           : "#DDD",
    borderRadius          : 5,
    backgroundColor       : "rgba(255, 255, 255, 0.6)",
    left                  : -7,
    top                   : -5,
    position              : "absolute",
    zIndex                : -1,
  },
  blockImg : {
    flexBasis             : "30%",
    position              : "relative",
    overflow              : "hidden"
  },
  clickFav : {
    position              : "absolute",
    left                  : 0,
    top                   : 3,
    backgroundColor       : "rgba(219, 162, 97, 0.7)",
    padding               : 5,
    borderTopRightRadius   : 5,
    borderBottomRightRadius: 5,
    zIndex                : 9
  },
  Img : {
    width                 : "100%",
    height                : 70,
    borderRadius          : 5
  },
  blockInfo : {
    flexBasis             : "70%",
    paddingHorizontal     : 10
  },
  view : {
    alignSelf             : 'flex-start',
    flexDirection         : "row",
    alignItems            : "center"
  },
  textN : {
    color                 : "#4c4640",
    fontFamily            : "CairoRegular",
    fontSize              : 14,
  },
  iconN : {
    color                 : "#4c4640",
    fontSize              : 12,
  },
  viewN : {
    flexDirection         : "row",
    justifyContent        : "space-between",
    alignItems            : "center"
  },
  
});


export default Filter;