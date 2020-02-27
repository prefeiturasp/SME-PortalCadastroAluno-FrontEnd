import React, {useState, createContext, Fragment} from "react";

export const LoadingContext = createContext({
    loading: "",
    setLoading() {
    },
});

export const LoadingContextProvider = ({children}) => {

    const [loading, setLoading] = useState("");

    return (
        <LoadingContext.Provider value={{loading, setLoading}}>
            {children}
            {loading && (
                <Fragment>
                    <h1>Estou aqui</h1>
                </Fragment>
            )}
        </LoadingContext.Provider>
    )
}


