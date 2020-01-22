import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Share, I18nManager } from 'react-native';
import { Container, Content, Icon, Button } from 'native-base'
import { DrawerItems } from 'react-navigation'

import { connect } from 'react-redux';
import { userLogin, profile , logout ,tempAuth} from '../actions'
class Mune extends Component {

  constructor(props) {
    super(props);
    this.state = {
      avatar                : '',
      name                  : '',
    };
  }

  async componentWillMount() {
    if(this.props.auth != null)
      this.props.profile(this.props.auth.data.user.id);

    I18nManager.forceRTL(true)

    // if(this.props.auth){

    //     this.setState       ({ 
    //       avatar   : this.props.user.avatar ,
    //       name     : this.props.user.name ,
    //     });

    // }else{

    //   this.setState       ({ 
    //     avatar   : '../../assets/profile.png' ,
    //     name     : 'زائر' ,
    //   });

    // }

  }

  filterItems(item){
    return item.routeName !== 'myadv' && item.routeName !== 'profile' && item.routeName !== 'favorite' && item.routeName !== 'commission' && item.routeName !== 'setting';
  }

  onShare = async () => {
    try {
      const result = await Share.share({
        message:
          'React Native | A framework for building native apps using React',
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  render() {
    let { user } = this.props; 
    console.log('fuck user_1', this.props.user); 
        if (user === null){
          user = {
            avatar: 'http://shams.arabsdesign.com/eBST-backend/images/users/default.png',
            name: 'guest'
          }  
        }

    return (
      <Container style={styles.contentView}>
        <Content contentContainerStyle = {{ flexGrow: 1 }}>
        <View style={styles.BG}></View>  
        <View style={styles.viewUser}>
            <View style={styles.imgUser}>
                <Image style={styles.img} source={{ uri: user.avatar }}/>
            </View>
            <TouchableOpacity style={styles.nameUser} onPress={() => this.props.navigation.navigate('profile')}>
                <Text style={styles.textUser}>{ user.name }</Text>
                <Icon style={styles.icon} type="AntDesign" name='edit'/>
            </TouchableOpacity>
        </View>
        <View style={styles.linkView}>
            <DrawerItems 
            {...this.props} 
            onItemPress={
            (route, focused) => {
              route.route.key === 'share' ? this.onShare() : this.props.navigation.navigate(route.route.key)
              }
            }

            items={this.props.auth !== null ? this.props.items : this.props.items.filter((item) =>  this.filterItems(item) ) }
            labelStyle = {{
                color               : "#fff",
                fontFamily          : "CairoRegular",
                fontSize            : 18
            }}/>               
        </View>
 
        {
            ( this.props.auth) ?
            <View style={styles.logOut}>
            <Button style={styles.clickLog} onPress={() => {

                this.props.logout({ token : this.props.auth.data.user.id});
                this.props.tempAuth();
                this.props.navigation.closeDrawer();
                this.props.navigation.navigate('login');

            }} >
                <Icon style={styles.icon} type="SimpleLineIcons" name='logout' />
            </Button>
         </View>

            :
            <View style={styles.logOut}>
            <Button style={styles.clickLog} onPress={() => {
                this.props.navigation.navigate('login');
            }} >
                <Icon style={styles.icon} type="SimpleLineIcons" name='login' />
            </Button>
         </View>

        }
       


        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
    contentView : {
      backgroundColor     : "#1313135e",
      flex                : 1
    },
    BG : {
      position            : "absolute",
      width               : 40,
      height              : "100%",
      backgroundColor     : "#dba261",
      left                : 0,
      top                 : 0
    },
    text : {
      color               : "#fff",
      position            : "relative",
      zIndex              : 99,
      fontFamily          : "CairoRegular",
      textAlign           : "center",
      fontSize            : 20
    },
    icon : {
      color               : '#fff',
      fontSize            : 16
    },
    textUser : {
      color               : "#fff",
      fontFamily          : "CairoRegular",
      textAlign           : "center",
      fontSize            : 17,
      marginHorizontal    : 10
    },
    viewUser : {
      position            : "relative",
      marginVertical      : 70,
      alignSelf           : 'flex-end',
    },
    imgUser : {
      position            : "absolute",
      left                : 10,
      top                 : -40,
      zIndex              : 99
    },
    img : {
      width               : 50,
      height              : 50,
      borderRadius        : 100
    },
    nameUser : {
      flexDirection       : "row",
      alignItems          : 'center',
      justifyContent      : 'center', 
      alignSelf           : 'flex-end',
      backgroundColor     : "#dba261",
      borderBottomLeftRadius  : 10,
      borderTopLeftRadius     : 10,
      padding             : 10
    },
    logOut : {
      position            : "absolute",
      right               : 0,
      bottom              : 10
    },
    clickLog : {
      backgroundColor     : "#dba261",
      width               : 50,
      borderBottomLeftRadius  : 10,
      borderTopLeftRadius     : 10,
      alignItems          : 'center',
      justifyContent      : 'center', 
      alignSelf           : 'center',
    }
    
});


const mapStateToProps = ({ auth, profile }) => {
  return {
      auth: auth.user,
      user: profile.user,
  };
};
export default connect(mapStateToProps, { userLogin, logout ,profile , tempAuth })(Mune);