import React, { Component } from 'react';
import { StyleSheet,Text,View,Image,TouchableOpacity  } from 'react-native';
import {Container, Content, Title, Header, Body, Toast, Button, Icon} from 'native-base'


import { MapView, Location, Permissions } from 'expo';
import axios from 'axios';

import {connect} from "react-redux";

class DetailsAdv extends Component {

  constructor(props) {
    super(props);
    this.state = {
        city                      : '',
        mapRegion                 : null,
        hasLocationPermissions    : false,
        initMap                   : true,
        location                  : '',
    };
  }

  async componentWillMount() {

    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
        alert('صلاحيات تحديد موقعك الحالي ملغاه');
    }else {
        const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({});
        const userLocation = { latitude, longitude };
        this.setState({  
          initMap     : false, 
          mapRegion   : userLocation 
        });

    }

    let getCity = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=';
    getCity += this.state.mapRegion.latitude + ',' + this.state.mapRegion.longitude;
    getCity += '&key=AIzaSyCJTSwkdcdRpIXp2yG7DfSRKFWxKhQdYhQ&language=ar&sensor=true';

    try {
        const { data } = await axios.get(getCity);
        this.setState({ city: data.results[0].formatted_address });

    } catch (e) {
        console.log('e', e);
    }

    await Permissions.askAsync(Permissions.CAMERA);
    await Permissions.askAsync(Permissions.CAMERA_ROLL);
    const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({});
    const userLocation = { latitude, longitude };
    this.setState({  initMap: false, mapRegion: userLocation });

  }


    _getLocationAsync = async () => {
      let { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status !== 'granted') {
          this.setState({
              locationResult: 'Permission to access location was denied',
          });
      } else {
          this.setState({ hasLocationPermissions: true });
      }

      let location = await Location.getCurrentPositionAsync({});

      // Center the map on the location we just fetched.
      this.setState({mapRegion: { latitude: location.coords.latitude, longitude: location.coords.longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421 }});
    };

    _handleMapRegionChange  = async (mapRegion) =>  {
      this.setState({ mapRegion });

      let getCity = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=';
      getCity += mapRegion.latitude + ',' + mapRegion.longitude;
      getCity += '&key=AIzaSyCJTSwkdcdRpIXp2yG7DfSRKFWxKhQdYhQ&language=ar&sensor=true';

      try {
          const { data } = await axios.get(getCity);
          this.setState({ city: data.results[0].formatted_address });

      } catch (e) {
          console.log(e);
      }
    }

    getLocation(){

    if(this.state.city === null){
      Toast.show({ 
        text        : 'يرجي تحديد الموقع', 
        duration    : 2000,
        type        : "danger", 
        textStyle     : {  
            color       : "white",
            fontFamily  : 'CairoRegular',
            textAlign   :'center' 
          } 
        });
      }else{
        this.props.navigation.navigate('forme3lan', {
          city_name               : this.state.city,
          latitude                : this.state.mapRegion.latitude,
          longitude               : this.state.mapRegion.longitude,
        });
      }

    }
   
  render() {
    return (
      <Container>
      <Header style={styles.header}>
          <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon style={styles.icons} type="Entypo" name='chevron-thin-right' />
          </Button>
          <Body style={styles.bodyText}>
              <Title style={styles.Title}>الموقع علي الخريطه</Title>
          </Body>
      </Header>
        <Content contentContainerStyle={{ flexGrow: 1 }} style={styles.contentView}>

            {
              !this.state.initMap ? (
                  <MapView
                      style={styles.map}
                      initialRegion={{
                          latitude: this.state.mapRegion.latitude,
                          longitude: this.state.mapRegion.longitude,
                          latitudeDelta: 0.0922,
                          longitudeDelta: 0.0421,
                      }}>
                      <MapView.Marker draggable
                              coordinate={this.state.mapRegion}
                              onDragEnd={(e) =>  this._handleMapRegionChange(e.nativeEvent.coordinate)}>
                          <Image source={require('../../assets/marker.png')} resizeMode={'cover'} style={{ width: 35, height: 35 }}/>
                      </MapView.Marker>
                  </MapView>
              ) : (<View />)
            }

            <TouchableOpacity style={styles.clickFunction} onPress={() => this.getLocation()}>
              <Text style={styles.textFun}>تآكيد</Text>
            </TouchableOpacity>

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
    alignItems          : 'center',
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
  },
  clickFunction : {
    backgroundColor     : "#dba261",
    alignItems          : 'center',
    justifyContent      : 'center', 
    alignSelf           : 'center',
    borderRadius        : 10,
    padding             : 5,
    width               : 120,
    position            : 'absolute',
    bottom              : 10
  },
  textFun : {
    color               : "#fff",
    fontFamily          : "CairoRegular",
    fontSize            : 16,
  }
});


const mapStateToProps = ({ lang, profile  }) => {
	return {
		lang: lang.lang,
		user: profile.user,
	};
};

export default connect(mapStateToProps, {})(DetailsAdv);