import React from 'react'
import CardWrapper from './card_wrapper'

const LoginForm = () => {
    return (
        <CardWrapper headerLabel='Bienvenido!'
            backButtonLabel='No tienes una cuenta?'
            backButtonHref='/register'
            showSocial
        >form_login</CardWrapper>
    )
}

export default LoginForm