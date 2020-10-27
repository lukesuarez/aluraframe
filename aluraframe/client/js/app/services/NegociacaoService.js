'use strict';

System.register(['./HttpService', '../services/ConnectionFactory', '../dao/NegociacaoDao', '../models/Negociacao'], function (_export, _context) {
  "use strict";

  var HttpService, ConnectionFactory, NegociacaoDao, Negociacao, _createClass, NegociacaoService;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_HttpService) {
      HttpService = _HttpService.HttpService;
    }, function (_servicesConnectionFactory) {
      ConnectionFactory = _servicesConnectionFactory.ConnectionFactory;
    }, function (_daoNegociacaoDao) {
      NegociacaoDao = _daoNegociacaoDao.NegociacaoDao;
    }, function (_modelsNegociacao) {
      Negociacao = _modelsNegociacao.Negociacao;
    }],
    execute: function () {
      _createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      }();

      _export('NegociacaoService', NegociacaoService = function () {
        function NegociacaoService() {
          _classCallCheck(this, NegociacaoService);

          this._http = new HttpService();
        }

        _createClass(NegociacaoService, [{
          key: 'obterNegociacoesDaSemana',
          value: function obterNegociacoesDaSemana() {
            var _this = this;

            return new Promise(function (resolve, reject) {

              _this._http.get('negociacoes/semana').then(function (negociacoes) {
                resolve(negociacoes.map(function (objeto) {
                  return new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor);
                }));
              }).catch(function (erro) {
                console.log(erro);
                reject('Não foi possível obter as negociacões da semana!');
              });
            });
          }
        }, {
          key: 'obterNegociacoesDaSemanaAnterior',
          value: function obterNegociacoesDaSemanaAnterior() {
            var _this2 = this;

            return new Promise(function (resolve, reject) {

              _this2._http.get('negociacoes/anterior').then(function (negociacoes) {
                resolve(negociacoes.map(function (objeto) {
                  return new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor);
                }));
              }).catch(function (erro) {
                console.log(erro);
                reject('Não foi possível obter as negociacões da semana anterior!');
              });
            });
          }
        }, {
          key: 'obterNegociacoesDaSemanaRetrasada',
          value: function obterNegociacoesDaSemanaRetrasada() {
            var _this3 = this;

            return new Promise(function (resolve, reject) {

              _this3._http.get('negociacoes/retrasada').then(function (negociacoes) {
                resolve(negociacoes.map(function (objeto) {
                  return new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor);
                }));
              }).catch(function (erro) {
                console.log(erro);
                reject('Não foi possível obter as negociacões da semana retrasada!');
              });
            });
          }
        }, {
          key: 'cadastrar',
          value: function cadastrar(negociacao) {

            return ConnectionFactory.getConnection().then(function (connection) {
              return new NegociacaoDao(connection);
            }).then(function (dao) {
              return dao.adiciona(negociacao);
            }).then(function () {
              return 'Negociação adicionada com sucesso';
            }).catch(function (erro) {
              console.log(erro);
              throw new Error('Não foi possível adicionar a negociação');
            });
          }
        }, {
          key: 'lista',
          value: function lista() {
            return ConnectionFactory.getConnection().then(function (connection) {
              return new NegociacaoDao(connection);
            }).then(function (dao) {
              return dao.listaTodos();
            }).catch(function (erro) {
              console.log(erro);
              throw new Error('Não foi possível obter as negociações');
            });
          }
        }, {
          key: 'apaga',
          value: function apaga() {
            return ConnectionFactory.getConnection().then(function (connection) {
              return new NegociacaoDao(connection);
            }).then(function (dao) {
              return dao.apagaTodos();
            }).then(function () {
              return 'Negociações apagadas com sucesso';
            }).catch(function (erro) {
              console.log(erro);
              throw new Error('Não foi possível apagar as negociações');
            });
          }
        }, {
          key: 'importa',
          value: function importa() {
            var _this4 = this;

            var service = this._service;

            Promise.all([service.obterNegociacoesDaSemana(), service.obterNegociacoesDaSemanaAnterior(), service.obterNegociacoesDaSemanaRetrasada()]).then(function (negociacoes) {
              negociacoes.reduce(function (arrayAchatado, array) {
                return arrayAchatado.concat(array);
              }, []).filter(function (negociacao) {
                return !_this4._listaNegociacoes.negociacoes.some(function (negociacaoExistente) {
                  return JSON.stringify(negociacao) == JSON.stringify(negociacaoExistente);
                });
              }).forEach(function (negociacao) {
                return _this4._listaNegociacoes.adiciona(negociacao);
              });
              _this4._mensagem.texto = 'Negociações do período importadas';
            }).catch(function (erro) {
              return _this4._mensagem.texto = erro;
            });
          }
        }]);

        return NegociacaoService;
      }());

      _export('NegociacaoService', NegociacaoService);
    }
  };
});
//# sourceMappingURL=NegociacaoService.js.map