import{HttpService} from './HttpService';
import{ConnectionFactory} from '../services/ConnectionFactory';
import{NegociacaoDao} from '../dao/NegociacaoDao';
import{Negociacao} from '../models/Negociacao';

export class NegociacaoService {

    constructor(){
      this._http = new HttpService;
    }

    obterNegociacoesDaSemana(){

        return new Promise((resolve, reject ) => {

          this._http
            .get('negociacoes/semana')
            .then(negociacoes => {
              resolve(negociacoes.map(objeto => new Negociacao(new Date(objeto.data) , objeto.quantidade , objeto.valor)))
            })
            .catch(erro => {
              console.log(erro);
              reject('Não foi possível obter as negociacões da semana!')
            });
            
          });             
                
    }


    obterNegociacoesDaSemanaAnterior(){
      
      return new Promise((resolve, reject ) => {

        this._http
          .get('negociacoes/anterior')
          .then(negociacoes => {
            resolve(negociacoes.map(objeto => new Negociacao(new Date(objeto.data) , objeto.quantidade , objeto.valor)))
          })
          .catch(erro => {
            console.log(erro);
            reject('Não foi possível obter as negociacões da semana anterior!')
          });
          
        });             

  }

  obterNegociacoesDaSemanaRetrasada(){

    return new Promise((resolve, reject ) => {

      this._http
        .get('negociacoes/retrasada')
        .then(negociacoes => {
          resolve(negociacoes.map(objeto => new Negociacao(new Date(objeto.data) , objeto.quantidade , objeto.valor)))
        })
        .catch(erro => {
          console.log(erro);
          reject('Não foi possível obter as negociacões da semana retrasada!')
        });
        
      });             
    }

    cadastrar(negociacao){

      return ConnectionFactory
          .getConnection()
          .then(connection => new NegociacaoDao(connection))
          .then(dao => dao.adiciona(negociacao ))
          .then(() => 'Negociação adicionada com sucesso')
          .catch(erro  => {
            console.log(erro);
            throw new Error ('Não foi possível adicionar a negociação')
          });

    }

    lista(){
      return ConnectionFactory
          .getConnection()
          .then(connection => new NegociacaoDao(connection))
          .then(dao => dao.listaTodos())
          .catch(erro => {
              console.log(erro);
              throw new Error('Não foi possível obter as negociações')
            })
    }

    apaga(){
          return ConnectionFactory
            .getConnection()
            .then(connection => new NegociacaoDao(connection))
            .then(dao => dao.apagaTodos())
            .then(() => 'Negociações apagadas com sucesso')
            .catch(erro => {
                  console.log(erro);
                  throw new Error('Não foi possível apagar as negociações')
            });
    }

    importa(){

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

    }
}

 