import React, {Fragment} from "react";

export const InputCustomizado = (parametros) =>{
    const {mask, name, id, classeCss, defaultValue} = {...parametros}
    return(
        <Fragment>
            <input mask={mask} name={name} id={id} className={classeCss} defaultValue={defaultValue}/>
        </Fragment>
    )

}