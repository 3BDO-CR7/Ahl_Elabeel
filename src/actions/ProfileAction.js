import axios from 'axios';
import CONST from '../consts'
import {Toast} from "native-base";
import {AsyncStorage} from "react-native";


export const profile = (userId) => {
    return (dispatch) => {
        axios({
            method      : 'POST',
            url         : CONST.url + 'userProfileDetailes',
            data        : {user_id: userId}
        }).then(response => {
            const data = response.data.data;
            dispatch({type: 'profile_data', data})
        })
    }
}


export const updateProfile = (data) => {

    console.log('updateProfile updateProfile ' , data);
    return (dispatch) => {
        axios({
            url         : CONST.url + 'updateProfile',
            method      : 'POST',
            data        : data
        }).then(response => {
            // if (response.data.status == 200) {
            //     const data = response.data.data;
            //     dispatch({type: 'updateProfile', data})
            // }

            if(response.data.success === true){
                 // this.setState({spinner: false});
                // this.props.navigation.navigate('profile');
                const data = response.data.data;
                dispatch({type: 'updateProfile', data})
            }

            Toast.show({
                text: response.data.message,
                type: response.data.success == true ? "success" : "danger",
                duration: 3000,
                textStyle   : { 
                  color       : "white",
                  fontFamily  : 'CairoRegular',
                  textAlign   : 'center' 
                } 
            });
        }).catch(() => {
            Toast.show({
                text: 'لم يتم التعديل بعد , الرجاء المحاوله مره اخري',
                type: "danger",
                duration: 3000,
                textStyle   : { 
                  color       : "white",
                  fontFamily  : 'CairoRegular',
                  textAlign   : 'center' 
                } 
            });
        })
    }
}


export const logout = (data) => {
    return (dispatch) => {
        AsyncStorage.clear();
        dispatch({type: 'logout'});
    }
};

