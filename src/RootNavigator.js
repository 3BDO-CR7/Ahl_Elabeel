import React from "react";
import { Dimensions } from "react-native";
import { createAppContainer, createDrawerNavigator, createStackNavigator } from "react-navigation";

// Screens

import Login                from './components/Login'
import About                from './components/About'
import Home                 from './components/Home'
import ForgetPassword       from './components/ForgetPassword'
import NewPassword          from './components/NewPassword'
import Register             from './components/Register'
import ActiveAcount         from './components/ActiveAcount'
import Chat                 from './components/Chat'
import ChatRoom             from './components/ChatRoom'
import Notification         from './components/Notification'
import Terms                from './components/Terms'
import Contact              from './components/Contact'
import Profile              from './components/Profile'
import EditProfile          from './components/EditProfile'
import Mune                 from './components/Mune'
import Commission           from './components/Commission'
import BankTransfer         from './components/BankTransfer'
import FormE3lan            from './components/FormE3lan'
import Categories           from './components/Categories'
import Advertisements       from './components/Advertisements'
import Filter               from './components/Filter'
import DetailsAdv           from './components/DetailsAdv'
import Location             from './components/Location'
import Favorite             from './components/Favorite'
import Setting              from './components/Setting'
import ChangePassword       from './components/ChangePassword'
import MapLocation          from './components/MapLocation'
import Share                from './components/Share'
import MyAdv                from './components/MyAdv'


// DrawerNavigator

const width = Dimensions.get('window').width;
const CustomDrawerContentComponent = (props) => (<Mune { ...props }/>);

const DrawerNavigator       = createDrawerNavigator({
    home                    : Home,
    favorite                : Favorite,
    myadv                   : MyAdv,
    about                   : About,
    terms                   : Terms,
    commission              : Commission,
    setting                 : Setting,
    contact                 : Contact,
    share                   : Share,
    chat                    : Chat,
    profile                 : Profile,
    adv                     : Advertisements,
}, 
{
    nitialRouteName         : 'home',
    drawerPosition          : 'right',
    contentComponent        : CustomDrawerContentComponent,
    drawerOpenRoute         : 'DrawerOpen',
    drawerCloseRoute        : 'DrawerClose',
    gesturesEnabled         : false,
    drawerToggleRoute       : 'DrawerToggle',
    drawerBackgroundColor   : '#1313135e',
    drawerWidth             : width
});

// MainNavigator  

const MainNavigator = createStackNavigator({
    DrawerNavigator: {
        screen: DrawerNavigator,
        navigationOptions: {
            header: null,
            gesturesEnabled: false
        }
    },
    detailsadv : {
        screen : DetailsAdv,
        navigationOptions: {
            header: null
        }
    },
    adv : {
        screen : Advertisements,
        navigationOptions: {
            header: null
        }
    },
    forme3lan : {
        screen : FormE3lan,
        navigationOptions: {
            header: null
        }
    },
    profile : {
        screen : Profile,
        navigationOptions: {
            header: null
        }
    },
    myadv : {
        screen : MyAdv,
        navigationOptions: {
            header: null
        }
    },
    chat : {
        screen : Chat,
        navigationOptions: {
            header: null
        }
    },
    share : {
        screen : Share,
        navigationOptions: {
            header: null
        }
    },
    login : {
        screen : Login,
        navigationOptions: {
            header: null
        }
    },
    categories : {
        screen : Categories,
        navigationOptions: {
            header: null
        }
    },
 
    notification : {
        screen : Notification,
        navigationOptions: {
            header: null
        }
    },
    setting : {
        screen : Setting,
        navigationOptions: {
            header: null
        }
    },
    map : {
        screen : MapLocation,
        navigationOptions: {
            header: null
        }
    },
    editprofile : {
        screen : EditProfile,
        navigationOptions: {
            header: null
        }
    },
    chatroom : {
        screen : ChatRoom,
        navigationOptions: {
            header: null
        }
    },
    commission : {
        screen : Commission,
        navigationOptions: {
            header: null
        }
    },
    banktransfer : {
        screen : BankTransfer,
        navigationOptions: {
            header: null
        }
    },
    register : {
        screen : Register,
        navigationOptions: {
            header: null
        }
    },
    forgetpassword : {
        screen : ForgetPassword,
        navigationOptions: {
            header: null
        }
    },
    newpassword : {
        screen : NewPassword,
        navigationOptions: {
            header: null
        }
    },
    home : {
        screen : Home,
        navigationOptions: {
            header: null
        }
    },
    contact : {
        screen : Contact,
        navigationOptions: {
            header: null
        }
    },
    favorite : {
        screen : Favorite,
        navigationOptions: {
            header: null
        }
    },
    terms : {
        screen : Terms,
        navigationOptions: {
            header: null
        }
    },
    about : {
        screen : About,
        navigationOptions: {
            header: null
        }
    },
    filter : {
        screen : Filter,
        navigationOptions: {
            header: null
        }
    },
    location : {
        screen : Location,
        navigationOptions: {
            header: null
        }
    },
    changepassword : {
        screen : ChangePassword,
        navigationOptions: {
            header: null
        }
    },
    activeacount : {
        screen : ActiveAcount,
        navigationOptions: {
            header: null
        }
    },
},
{
    navigationOptions: {
        headerStyle: {
            backgroundColor: 'transparent'
        },
    }

});

export default createAppContainer(MainNavigator);