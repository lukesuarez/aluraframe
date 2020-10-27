/*
Parametros a serem recebidos pelo bind:
                this._listaNegociacoes = new Bind(
     -> model       new ListaNegociacoes(),
     -> view        this._negociacoesView,
     -> props          'adiciona', 'esvazia')

*/
import {ProxyFactory} from '../services/ProxyFactory'

export class Bind {
    constructor(model, view, ...props){

        let proxy = ProxyFactory.create(model, props, model => 
            view.update(model));
        
        view.update(model);

        return proxy;
    }
}