'use strict';

System.register([], function (_export, _context) {
    "use strict";

    var _createClass, stores, version, dbName, connection, close, ConnnectionFactory;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    return {
        setters: [],
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

            stores = ['negociacoes'];
            version = 4;
            dbName = 'aluraframe';
            connection = null;
            close = null;

            _export('ConnnectionFactory', ConnnectionFactory = function () {
                function ConnnectionFactory() {
                    _classCallCheck(this, ConnnectionFactory);

                    throw new Error('Não é possivel criar instancias de ConnectionFactory');
                }

                _createClass(ConnnectionFactory, null, [{
                    key: 'getConnection',
                    value: function getConnection() {
                        return new Promise(function (resolve, reject) {

                            var openRequest = window.indexedDB.open(dbName, version);

                            openRequest.onupgradeneeded = function (e) {
                                ConnnectionFactory._createStores(e.target.result);
                            };

                            openRequest.onsuccess = function (e) {
                                if (!connection) {
                                    connection = e.target.result;
                                    close = connection.close.bind(connection);
                                    connection.close = function () {
                                        throw new Error('Voce nao pode fechar diretamente a conexão');
                                    };
                                }
                                resolve(connection);
                            };

                            openRequest.onerror = function (e) {
                                console.log(e.target.error.name);
                            };
                        });
                    }
                }, {
                    key: '_createStores',
                    value: function _createStores(connection) {
                        stores.forEach(function (store) {
                            if (connection.objectStoreNames.contains(store)) {
                                connection.deleteObjectStore(store);
                            }
                            connection.createObjectStore(store, { autoIncrement: true });
                        });
                    }
                }, {
                    key: 'closeConnection',
                    value: function closeConnection() {

                        if (connection) {
                            close();
                            connection = null;
                        }
                    }
                }]);

                return ConnnectionFactory;
            }());

            _export('ConnnectionFactory', ConnnectionFactory);
        }
    };
});
//# sourceMappingURL=ConnectionFactory.js.map