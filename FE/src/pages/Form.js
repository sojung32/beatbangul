import React, { useContext } from 'react';
import FormItem from '../components/FormItem';
import { AuthContext } from '../context/auth-context';
import NeedLogin from './NeedLogin';

const Form = (props) => {
    const auth = useContext(AuthContext);

    if(auth.token){
        return (
            <FormItem/>
        )
    } else {
        return (
            <NeedLogin/>
        )
    }
}

export default Form;
