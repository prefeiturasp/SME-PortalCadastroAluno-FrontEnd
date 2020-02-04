import React, {Fragment} from "react";

export const BtnCustomizado = (parametros) =>{


    console.log(parametros)

    const {onClick, disable, type, classeCss, texto} = {...parametros}

    console.log("Ollyver ", onClick)


    return(
        <Fragment>
            <button onClick={onClick} disabled={disable} type={type} className={classeCss}>{texto}</button>
        </Fragment>
    )

}