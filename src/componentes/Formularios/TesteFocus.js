import React, {useRef} from "react"
import {useForm} from "react-hook-form"

export default function App() {
    const {register, handleSubmit, errors} = useForm()
    const firstNameRef = useRef()
    const onSubmit = (data) => {
        alert(JSON.stringify(data))
        firstNameRef.current.focus();
    }

    return (
        <div className="container jumbotron">
            <form onSubmit={handleSubmit(onSubmit)}>

                <div className="row">
                    <div className="col-lg-4 mt-4">
                        <input name="firstName" className="form-control"
                               ref={(e) => {
                                   register(e, {required: true, maxLength:10})
                                   firstNameRef.current = e // you can still assign to ref
                               }}/>

                        {errors.firstName && errors.firstName.type === "required" && <span className="span_erro text-dark mt-1">Código EOL é obrigatório</span>}
                        {errors.firstName && errors.firstName.type === "maxLength" && <span className="span_erro text-dark mt-1">Permitido até 10 dígitos</span>}


                    </div>

                    <div className="col-lg-4 mt-4">
                        <input name="lastName" className="form-control"
                               ref={(e) => {
                                   // register's first argument is ref, and second is validation rules
                                   register(e, {required: true})
                               }}/>
                    </div>

                    <button>Submit</button>
                </div>
            </form>


        </div>
    );
}