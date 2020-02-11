import React, {useState, createContext, Fragment} from 'react'
import "./notificacao.scss"



export const NotificacaoContext = createContext({
    msg: "",
    setMsg(newMsg) {
    }
});

export const NotificacaoContextProvider = ({children}) => {
    // React Hooks
    // msg && Quer dizer Se existir msg - faça
    const [msg, setMsg] = useState("");

    debugger;

    return (

        <NotificacaoContext.Provider value={{msg, setMsg}}>
            {children}

            {msg && (
                /*<div className="notificacaoMsg" onAnimationEnd={() => setMsg("")}>
                    {msg}
                </div>*/


                <Fragment>
                    <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
                        Launch demo modal
                    </button>

                    <div class="modal fade show" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div class="modal-dialog" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div class="modal-body">
                                    ...
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                    <button type="button" class="btn btn-primary">Save changes</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Fragment>
            )}
        </NotificacaoContext.Provider>
    )
}
