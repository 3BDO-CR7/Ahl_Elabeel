const INIT_STATE = { user: null , update : null };


export default ( state = INIT_STATE, action ) => {
    switch (action.type) {
        case ('profile_data'):
            return ({ ...state, user: action.data , update : 1 });
        case ('updateProfile'):
            return ({ ...state, user: action.data.user  , update :2});
        case ('logout'):
            return ({ ...state, user: null });
        default :
            return state;
    }}
