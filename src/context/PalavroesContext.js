import React, {useState, createContext, useEffect} from "react";
import {buscarPalavrasImproprias} from "../services/ConectarApi";

export const PalavroesContext = createContext( {
    listaPalavroes: [],
    setListaPalavroes(){},
    getListaPalavroes(){},
});

export const PalavroesContextProvider = ({children}) => {

    const [listaPalavroes, setListaPalavroes] = useState([])

    useEffect( () => {
        buscarPalavrasImproprias()
        .then(listaPalavroes => {
            setListaPalavroes(listaPalavroes);
        })
    }, [])

    return (
            <PalavroesContext.Provider value={ { listaPalavroes, setListaPalavroes } }>
                {children}
            </PalavroesContext.Provider>
        )
}