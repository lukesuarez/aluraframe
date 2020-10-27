import {ListaNegociacoes} from '../models/ListaNegociacoes';
import {Mensagem} from '../models/Mensagem';
import{Negociacao} from '../models/Negociacao';

import{NegociacoesView} from '../views/NegociacoesView';
import{MensagemView} from '../views/MensagemView';

import{NegociacaoService} from '../services/NegociacaoService';

import{DateHelper} from '../helpers/DateHelper';
import{Bind} from '../helpers/Bind';

export class NegociacaoController {

    constructor(){
        
        //essa forma seria algo parecido com jquery, porém é preciso usar o método bind() para fazer 
        //com que a referencia do query selector seja document
        let $ = document.querySelector.bind(document);
        this._inputData = $('#data');
        this._inputQuantidade = $('#quantidade');
        this._inputValor = $('#valor');
        this._ordemAtual = '';
        this._service = new NegociacaoService();
        this._init();


        this._listaNegociacoes = new Bind(
          new ListaNegociacoes(),
          new NegociacoesView($('#negociacoesView')),
          'adiciona', 'esvazia', 'ordena', ' inverteOrdem');
      
              
        this._MensagemView = new MensagemView($('#mensagemView'));

        this._mensagem = new Bind(
          new Mensagem(),
          new MensagemView($('#mensagemView')),
          'texto');
        
          
          
          
        }
        
        _init(){

          this._service
              .lista()
              .then(negociacoes =>
                  negociacoes.forEach(negociacao =>
                      this._listaNegociacoes.adiciona(negociacao)))
              .catch(erro => this._mensagem.texto = erro);


              setInterval(() => {
                  this.importaNegociacoes();
              }, 3000);

          }

    adiciona(event) {

      event.preventDefault();

      let negociacao = this._criaNegociacao();

      this._service
        .cadastrar(negociacao)
        .then((mensagem) => {
            this._listaNegociacoes.adiciona(negociacao);
            this._mensagem.texto = mensagem;
            this._limpaFormulario();
        })
        .catch(erro => this._mensagem.texto = erro);

            
          }

    importaNegociacoes(){


      
      let service = this._service;

          Promise.all([
            service.obterNegociacoesDaSemana(),
            service.obterNegociacoesDaSemanaAnterior(),
            service.obterNegociacoesDaSemanaRetrasada()]
        ).then(negociacoes => {
            negociacoes
            .reduce((arrayAchatado, array) => arrayAchatado.concat(array), [])
            .filter(negociacao => 
                !this._listaNegociacoes.negociacoes.some(negociacaoExistente => 
                    JSON.stringify(negociacao) == JSON.stringify(negociacaoExistente)))
            .forEach(negociacao => this._listaNegociacoes.adiciona(negociacao));
            this._mensagem.texto = 'Negociações do período importadas';
        })
        .catch(erro => this._mensagem.texto = erro); 
     

      // Promise.all([
      //   service.obterNegociacoesDaSemana(), 
      //   service.obterNegociacoesDaSemanaAnterior(),
      //   service.obterNegociacoesDaSemanaRetrasada()]
      //   )
      //   .then(negociacoes => 
      //     negociacoes.filter(negociacao => 
      //       !this._listaNegociacoes.negociacoes.some(negociacaoExistente => 
      //       JSON.stringify(negociacao) == JSON.stringify(negociacaoExistente)))
      //   )       
      //   .then(negociacoes => {
      //     negociacoes
      //       .reduce((arrayAchatado, array) => arrayAchatado.concat(array), [])
      //       .forEach(negociacao => this._listaNegociacoes.adiciona(negociacao));
      //     this._mensagem.texto = 'Negociacoes importadas com sucesso!';
      //   })
      //   .catch(erro => this._mensagem.texto = erro)


      /*
      service.obterNegociacoesDaSemana()
        .then(negociacoes => {
          negociacoes.forEach(negociacao => this._listaNegociacoes.adiciona(negociacao));
          this._mensagem.texto = 'Negociações da semana obtidas com sucesso';
      })
      .catch(erro => this._mensagem.texto = erro);
  
      service.obterNegociacoesDaSemanaAnterior()
        .then(negociacoes => {
          negociacoes.forEach(negociacao => this._listaNegociacoes.adiciona(negociacao));
          this._mensagem.texto = 'Negociações da semana obtidas com sucesso';
      })
      .catch(erro => this._mensagem.texto = erro);
  
      service.obterNegociacoesDaSemanaRetrasada()
        .then(negociacoes => {
          negociacoes.forEach(negociacao => this._listaNegociacoes.adiciona(negociacao));
          this._mensagem.texto = 'Negociações da semana obtidas com sucesso';
      })
      .catch(erro => this._mensagem.texto = erro);
      */

      /*
      service.obterNegociacoesDaSemana((erro, negociacoes) => {
            if(erro){
              this._mensagem.texto = erro;
              return;
            } 

            negociacoes.forEach(negociacao => this._listaNegociacoes.adiciona(negociacao));

        service.obterNegociacoesDaSemanaAnterior((erro, negociacoes) => {
              if(erro){
                this._mensagem.texto = erro;
                return;
              } 
        
              negociacoes.forEach(negociacao => this._listaNegociacoes.adiciona(negociacao));

                  service.obterNegociacoesDaSemanaRetrasada((erro, negociacoes) => {
                    if(erro){
                      this._mensagem.texto = erro;
                      return;
                    } 
            
                    negociacoes.forEach(negociacao => this._listaNegociacoes.adiciona(negociacao));
                    this._mensagem.texto = 'Negociações importadas com sucesso!';
                  });
              });
          });
          */



        }      

    apaga(){

    this._service
        .apaga()
        .then(mensagem => {
            this._mensagem.texto = mensagem;
            this._listaNegociacoes.esvazia();
        })
        .catch(erro => this._mensagem.texto = erro);
    }

    _criaNegociacao(){

      return new Negociacao(
        DateHelper.textoParaData(this._inputData.value),
        parseInt(this._inputQuantidade.value),
        parseFloat(this._inputValor.value));

    }

    _limpaFormulario(){
          
        this._inputData.value = "",
        this._inputQuantidade.value = 1,
        this._inputValor.value = 0.0;

        this._inputData.focus();
    }
    
    ordena(coluna) {
      if(this._ordemAtual == coluna) {
          this._listaNegociacoes.inverteOrdem();
      } else {
          this._listaNegociacoes.ordena((a, b) => a[coluna] - b[coluna]);
      }
      this._ordemAtual = coluna;
  }

  }