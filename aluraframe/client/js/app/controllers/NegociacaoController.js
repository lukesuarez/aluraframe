'use strict';

System.register(['../models/ListaNegociacoes', '../models/Mensagem', '../models/Negociacao', '../views/NegociacoesView', '../views/MensagemView', '../services/NegociacaoService', '../helpers/DateHelper', '../helpers/Bind'], function (_export, _context) {
    "use strict";

    var ListaNegociacoes, Mensagem, Negociacao, NegociacoesView, MensagemView, NegociacaoService, DateHelper, Bind, _createClass, NegociacaoController;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    return {
        setters: [function (_modelsListaNegociacoes) {
            ListaNegociacoes = _modelsListaNegociacoes.ListaNegociacoes;
        }, function (_modelsMensagem) {
            Mensagem = _modelsMensagem.Mensagem;
        }, function (_modelsNegociacao) {
            Negociacao = _modelsNegociacao.Negociacao;
        }, function (_viewsNegociacoesView) {
            NegociacoesView = _viewsNegociacoesView.NegociacoesView;
        }, function (_viewsMensagemView) {
            MensagemView = _viewsMensagemView.MensagemView;
        }, function (_servicesNegociacaoService) {
            NegociacaoService = _servicesNegociacaoService.NegociacaoService;
        }, function (_helpersDateHelper) {
            DateHelper = _helpersDateHelper.DateHelper;
        }, function (_helpersBind) {
            Bind = _helpersBind.Bind;
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

            _export('NegociacaoController', NegociacaoController = function () {
                function NegociacaoController() {
                    _classCallCheck(this, NegociacaoController);

                    //essa forma seria algo parecido com jquery, porém é preciso usar o método bind() para fazer 
                    //com que a referencia do query selector seja document
                    var $ = document.querySelector.bind(document);
                    this._inputData = $('#data');
                    this._inputQuantidade = $('#quantidade');
                    this._inputValor = $('#valor');
                    this._ordemAtual = '';
                    this._service = new NegociacaoService();
                    this._init();

                    this._listaNegociacoes = new Bind(new ListaNegociacoes(), new NegociacoesView($('#negociacoesView')), 'adiciona', 'esvazia', 'ordena', ' inverteOrdem');

                    this._MensagemView = new MensagemView($('#mensagemView'));

                    this._mensagem = new Bind(new Mensagem(), new MensagemView($('#mensagemView')), 'texto');
                }

                _createClass(NegociacaoController, [{
                    key: '_init',
                    value: function _init() {
                        var _this = this;

                        this._service.lista().then(function (negociacoes) {
                            return negociacoes.forEach(function (negociacao) {
                                return _this._listaNegociacoes.adiciona(negociacao);
                            });
                        }).catch(function (erro) {
                            return _this._mensagem.texto = erro;
                        });

                        setInterval(function () {
                            _this.importaNegociacoes();
                        }, 3000);
                    }
                }, {
                    key: 'adiciona',
                    value: function adiciona(event) {
                        var _this2 = this;

                        event.preventDefault();

                        var negociacao = this._criaNegociacao();

                        this._service.cadastrar(negociacao).then(function (mensagem) {
                            _this2._listaNegociacoes.adiciona(negociacao);
                            _this2._mensagem.texto = mensagem;
                            _this2._limpaFormulario();
                        }).catch(function (erro) {
                            return _this2._mensagem.texto = erro;
                        });
                    }
                }, {
                    key: 'importaNegociacoes',
                    value: function importaNegociacoes() {
                        var _this3 = this;

                        var service = this._service;

                        Promise.all([service.obterNegociacoesDaSemana(), service.obterNegociacoesDaSemanaAnterior(), service.obterNegociacoesDaSemanaRetrasada()]).then(function (negociacoes) {
                            negociacoes.reduce(function (arrayAchatado, array) {
                                return arrayAchatado.concat(array);
                            }, []).filter(function (negociacao) {
                                return !_this3._listaNegociacoes.negociacoes.some(function (negociacaoExistente) {
                                    return JSON.stringify(negociacao) == JSON.stringify(negociacaoExistente);
                                });
                            }).forEach(function (negociacao) {
                                return _this3._listaNegociacoes.adiciona(negociacao);
                            });
                            _this3._mensagem.texto = 'Negociações do período importadas';
                        }).catch(function (erro) {
                            return _this3._mensagem.texto = erro;
                        });

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
                }, {
                    key: 'apaga',
                    value: function apaga() {
                        var _this4 = this;

                        this._service.apaga().then(function (mensagem) {
                            _this4._mensagem.texto = mensagem;
                            _this4._listaNegociacoes.esvazia();
                        }).catch(function (erro) {
                            return _this4._mensagem.texto = erro;
                        });
                    }
                }, {
                    key: '_criaNegociacao',
                    value: function _criaNegociacao() {

                        return new Negociacao(DateHelper.textoParaData(this._inputData.value), parseInt(this._inputQuantidade.value), parseFloat(this._inputValor.value));
                    }
                }, {
                    key: '_limpaFormulario',
                    value: function _limpaFormulario() {

                        this._inputData.value = "", this._inputQuantidade.value = 1, this._inputValor.value = 0.0;

                        this._inputData.focus();
                    }
                }, {
                    key: 'ordena',
                    value: function ordena(coluna) {
                        if (this._ordemAtual == coluna) {
                            this._listaNegociacoes.inverteOrdem();
                        } else {
                            this._listaNegociacoes.ordena(function (a, b) {
                                return a[coluna] - b[coluna];
                            });
                        }
                        this._ordemAtual = coluna;
                    }
                }]);

                return NegociacaoController;
            }());

            _export('NegociacaoController', NegociacaoController);
        }
    };
});
//# sourceMappingURL=NegociacaoController.js.map