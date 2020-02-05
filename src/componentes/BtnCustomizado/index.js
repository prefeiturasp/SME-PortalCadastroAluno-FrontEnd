import React, {Fragment} from "react";

export const BtnCustomizado = (parametros) =>{
    const {onClick, disable, type, classeCss, texto} = {...parametros}
    return(
        <Fragment>
            <button onClick={onClick} disabled={disable} type={type} className={classeCss}>{texto}</button>
        </Fragment>
    )

}