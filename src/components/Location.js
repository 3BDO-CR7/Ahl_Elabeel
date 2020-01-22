import React, { Component } from 'react';
import { StyleSheet, I18nManager,  } from 'react-native';
import { Container, Content, Icon, Title, Header, Body, Button } from 'native-base'


import { MapView } from 'expo';

class DetailsAdv extends Component {

  constructor(props) {
    super(props);
    this.state = {
        map       : this.props.navigation.getParam('Location'),
    };
  }

  componentWillMount() {

  }

   
  render() {
    return (
      <Container>
        <Header style={styles.header}>
          <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon style={styles.icons} type="AntDesign" name='close' />
          </Button>
          <Body style={styles.bodyText}>
            <Title style={styles.Title}>الموقع</Title>
          </Body>
        </Header>
        <Content contentContainerStyle={{ flexGrow: 1 }} style={styles.contentView}>

            <MapView
                style={styles.map}
                initialRegion={{
                    latitude          : this.state.map.latitude,
                    longitude         : this.state.map.longitude,
                    latitudeDelta     : 0.0922,
                    longitudeDelta    : 0.0421,
                }}>
                <MapView.Marker
                            coordinate={{
                              latitude    : this.state.map.latitude,
                              longitude   : this.state.map.longitude
                            }}
                            title={'Location'}
                            image={require('../../assets/marker.png')}>
                </MapView.Marker>
            </MapView>

        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  header:{
    backgroundColor     : "rgba(255, 255, 255, 0.6)",
    borderBottomColor   : "rgba(255, 255, 255, 0.6)",
    paddingTop          : 10,
    alignItems          : 'center',
    justifyContent      : 'center', 
    alignSelf           : 'center',
      height : 90
  },
  bodyText : {
    alignItems          : 'flex-end',
    paddingHorizontal   : 10 
  },
  Title : {
    color               : "#58544f",
    fontFamily          : "CairoRegular",
    textAlign           : "center",
    fontSize            : 17,
  },
  icons : {
    color               : "#dbaa71",
    fontSize            : 20
  },
  map : {
    width               : '100%',
    height              : '100%',
    alignItems          : 'center',
    justifyContent      : 'center', 
    alignSelf           : 'center',
  }
});


export default DetailsAdv;