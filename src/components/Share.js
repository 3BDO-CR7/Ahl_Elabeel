import React, { Component } from 'react';
import { StyleSheet, I18nManager} from 'react-native';
import { Container, Content, Text, Icon } from 'native-base'

class Share extends Component {

    constructor(props) {
        super(props);
    }

    async componentWillMount() {
   
        I18nManager.forceRTL(true)

    }

    static navigationOptions = () => ({
        header      : null,
        drawerLabel : ( <Text style={styles.textLabel}>مشاركه التطبيق</Text> ) ,
        drawerIcon  : ( <Icon style={styles.icon} type="MaterialCommunityIcons" name="share-variant" /> )
    });


  render() {

    return false
  }
}

const styles = StyleSheet.create({
    textLabel : {
        color               : "#fff",
        fontFamily          : "CairoRegular",
        fontSize            : 18,
        marginVertical      : 8
    },
    icon : {
        color               : "#FFF",
        fontSize            : 23,
        position            : "relative",
        left                : -7
    },
});


export default Share;