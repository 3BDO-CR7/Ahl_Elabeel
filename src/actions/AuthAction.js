import axios from 'axios';
import { AsyncStorage } from 'react-native';
import CONST from '../consts';

export const userLogin = ({phone, password, token}) => {
    return (dispatch) => {
        dispatch({type: 'user_login'});

             axios({
                url       : `${CONST.url}auth/login`,
                method    : 'POST',
                data :{
                    phone, password, 
                    device_id   : token
                }
            }).then(response => {
               
                  handelLogin(dispatch, response.data)
               
            }).catch(err => {

                console.warn(  'error Login'  , err)

            });
    };
};


export const tempAuth = () => {
    return (dispatch) => {
        dispatch({type: 'temp_auth'});
    };
};


const handelLogin = (dispatch, data) => {

    if (data.success === false){
        loginFailed(dispatch, data)
    }else{
        loginSuccess(dispatch, data)
    }
};


const loginSuccess = (dispatch, data) => {
    AsyncStorage.setItem('token', JSON.stringify(data))
        .then(() => dispatch({type: 'login_success', data }));

    dispatch({type: 'login_success', data});
};

const loginFailed = (dispatch, error) => {
    dispatch({type: 'login_failed', error});
};
