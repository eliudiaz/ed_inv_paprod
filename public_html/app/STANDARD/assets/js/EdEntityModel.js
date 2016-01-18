/*****************************************************************************\
 author: edcracken
 options
 uri: {}      - key value paris of data to send in url/get/uri
 data: {}||'' - Object or string to be sent as JSON data in the body
 for methods that support body data
 dataType: '' - Data type that is being sent, by default application/json
 is used.  If you use anything but json|jsonp|application/json
 make sure your data is already encoded properly as a string
 
 Loader.get(uri, options, callback) - find all and filtering
 
 Loader.post(uri, options, callback) - create
 
 Loader.put(uri, options, callback) - update
 
 Loader.patch(uri, options, callback) 
 
 Loader.delete(uri, options, callback) - delete
 
 \*****************************************************************************/
({define: typeof define !== "undefined" ? define : function (deps, factory) {
        window.Loader = factory();
    }}).
        define([], function () {
            var Loader = {};
            var callhashlist = [], callbacks = [];
            Loader.dataTypes = {
                'json': 'application/json',
                'jsonp': 'application/json'
            };
            var addCallback = function (hash, callback) {
                var idx = callhashlist.indexOf(hash), found = idx > -1;
                if (!found) {
                    idx = callhashlist.length;
                    callhashlist[idx] = hash;
                    callbacks[idx] = [];
                }
                callbacks[idx].push(callback);
                return found;
            };
            var callCallbacks = function (hash, err, results) {
                var idx = callhashlist.indexOf(hash), cbs, i, l;
                if (idx > -1) {
                    cbs = (callbacks.splice(idx, 1) || [])[0] || [];
                    callhashlist.splice(idx, 1);
                    l = cbs.length;
                    for (i = 0; i < l; i++) {
                        cbs[i](err, results);
                    }
                }
                ;
            };
            var RemoteRequest = function () {
                if (window.ActiveXObject) {
                    var activexmodes = ["Msxml2.XMLHTTP", "Microsoft.XMLHTTP"];
                    for (var i = 0; i < activexmodes.length; i++) {
                        try {
                            return new ActiveXObject(activexmodes[i])
                        } catch (e) {
                            //suppress error
                        }
                    }
                }
                if (window.XMLHttpRequest) {
                    return new XMLHttpRequest()
                }
                return false
            };
            var encodeParams = function (args) {
                var key, s = [], i, l;
                var addParam = function (key, value) {
                    value = value instanceof Function ? value() : (value === null ? '' : value);
                    s[s.length] = encodeURIComponent(key) + '=' + encodeURIComponent(value);
                };
                if (args instanceof Array) {
                    l = args.length;
                    for (i = 0; i < l; i++) {
                        addParam(args[i].name, args[i].value);
                    }
                } else if (args) {
                    for (key in args) {
                        addParam(key, args[key]);
                    }
                }
                return s.join('&').replace(/%20/g, '+');
            };
            var defineMethod = function (HTTPMethod) {
                Loader[HTTPMethod] = function (resourceURI, options, callback) {
                    var getParams = '', requestData, callHash, url = resourceURI;
                    var requestObject, response, items, body, dataType;
                    if (typeof (options) === 'function') {
                        callback = options;
                        options = {};
                    }
                    callback = callback || function () {
                    };
                    options = options || {};
                    if (typeof (options.uri) === 'string') {
                        try {
                            options.uri = JSON.parse(options.uri);
                        } catch (e) {
                        }
                    }
                    options.uri = options.uri || {};
                    callHash = resourceURI + JSON.stringify(options.uri) + JSON.stringify(options.data);
                    if (!addCallback(callHash, callback)) {
//                        options.uri.ts = new Date();
                        url += ((url || '').indexOf('?') === -1 ? '?' : '&') + encodeParams(options.uri);
//                        url = url.indexOf('?') === url.length - 1 ? url.substring(0, url.length - 2) : url;
                        requestObject = new RemoteRequest();
                        requestObject.onreadystatechange = function () {
                            if (requestObject.readyState === 4) {
                                if (requestObject.status === 200 || window.location.href.indexOf("http") === -1) {
                                    try {
                                        response = JSON.parse(requestObject.responseText);
                                    } catch (e) {
                                        response = requestObject.responseText;
                                    }
                                    if (response.error || response.errors) {
                                        callCallbacks(callHash, response);
                                    } else {
                                        items = response[response.root];
                                        try {
                                            response = (items instanceof Array) ? {
                                                items: items,
                                                offset: response.offset,
                                                limit: response.limit,
                                                count: response.count || items.length,
                                                length: response.length || items.length
                                            } : items || response;
                                        } catch (e) {
                                        }
                                        callCallbacks(callHash, null, response);
                                    }
                                } else {
                                    var err = new Error(requestObject.statusText + ': ' + (requestObject.responseText || requestObject.response));
                                    err.type = requestObject.statusText;
                                    err.code = requestObject.status;
                                    err.requestObject = requestObject;
                                    callCallbacks(callHash, err);
                                }
                            }
                        };
                        requestObject.open(HTTPMethod.toUpperCase(), url, false);
                        if (options.data) {
                            dataType = Loader.dataTypes[options.dataType] || options.dataType || "application/json";
                            if (options.data instanceof FormData) {
                                body = options.data;
                            } else {
                                requestObject.setRequestHeader("Content-type", dataType);
                                try {
                                    body = JSON.stringify(options.data);
                                } catch (e) {
                                    body = options.body;
                                }
                            }
                            if (options.headers) {
                                (function () {
                                    var key;
                                    for (key in options.headers) {
                                        try {
                                            requestObject.setRequestHeader(key, options.headers[key]);
                                        } catch (e) {
                                        }
                                    }
                                })();
                            }
                            try {
                                requestObject.send(body);
                            } catch (e) {
                                callCallbacks(callHash, {message: 'Error de comunicacion!'});
                            }
                        } else {
                            try {
                                requestObject.send(null);
                            } catch (e) {
                                callCallbacks(callHash, {message: 'Error de comunicacion!'});
                            }
                        }
                    }
                };
            };
            Loader.form = function (method, form, callback) {
                var formData = new FormData(form);
                var callHash = form.action + (new Date()).getTime();
                if (!addCallback(callHash, callback)) {
                    var requestObject = new RemoteRequest();
                    requestObject.onreadystatechange = function () {
                        if (requestObject.readyState === 4) {
                            if (requestObject.status === 200 || window.location.href.indexOf("http") === -1) {
                                try {
                                    response = JSON.parse(requestObject.responseText);
                                } catch (e) {
                                    response = requestObject.responseText;
                                }
                                if (response.error || response.errors) {
                                    callCallbacks(callHash, response);
                                } else {
                                    items = response[response.root];
                                    try {
                                        response = (items instanceof Array) ? {
                                            items: items,
                                            offset: response.offset,
                                            limit: response.limit,
                                            count: response.count,
                                            length: items.length
                                        } : items || response;
                                    } catch (e) {
                                    }
                                    callCallbacks(callHash, null, response);
                                }
                            } else {
                                var err = new Error(requestObject.statusText + ': ' + (requestObject.responseText || requestObject.response));
                                err.type = requestObject.statusText;
                                err.code = requestObject.status;
                                err.requestObject = requestObject;
                                callCallbacks(callHash, err);
                            }
                        }
                    };
                    requestObject.open(method.toUpperCase(), form.action, true);
                    requestObject.send(formData);
                }
                return false;
            };
            Loader.postForm = function (form, callback) {
                Loader.form('POST', form, callback);
            };
            Loader.putForm = function (form, callback) {
                Loader.form('PUT', form, callback);
            };
            (function (methods, callback) {
                var i, l = methods.length;
                for (i = 0; i < l; i++) {
                    callback(methods[i]);
                }
            })(['get', 'post', 'put', 'patch', 'delete'], defineMethod);
            return Loader;
        });

/* 
 author: edcracken
 options
 uri: {}      - key value paris of data to send in url/get/uri
 data: {}||'' - Object or string to be sent as JSON data in the body
 for methods that support body data
 dataType: '' - Data type that is being sent, by default application/json
 is used.  If you use anything but json|jsonp|application/json
 make sure your data is already encoded properly as a string
 
 em.get(entity, options, callback) - find all and filtering
 
 em.post(entity, options, callback) - create
 
 em.put(entity, options, callback) - update
 
 em.delete(entity, options, callback) - delete
 
 */
var serverUrl = "http://localhost:81/pa/";
var edOps = angular.module('edOps', []);
edOps.factory('eReq', [function () {
        var me = this;
        var path;
        this.getInstance = function (urlContext) {
            path = urlContext;
            return me;
        };
        this.get = function (reqParams) {
            window.Loader.get(path + (reqParams !== null ? reqParams : ""), null, function (e, r) {
                me.response = r;
            });
            return me.response;
        };
        this.put = function (reqParams, data) {
            window.Loader.post(path + (reqParams !== null ? reqParams : ""), {data: data, dataType: window.Loader.dataTypes.json}, function (e, r) {
                me.response = r;
            });
            return me.response;
        };

        this.post = function (reqParams, data) {
            window.Loader.post(path + (reqParams !== null ? reqParams : ""), {data: data, dataType: window.Loader.dataTypes.json}, function (e, r) {
                me.response = r;
            });
            return me.response;
        };
        return {getInstance: me.getInstance};
    }]);
edOps.factory('eModel', [
    function () {
        var me = this;
        this.entity = null;
        this.response = null;

        this.setE = function (entity) {
            me.entity = entity;
        };
        this.getAll = function () {
            return me.get(me.entity, null);
        };
        this.get = function (id) {
            var path = serverUrl + me.entity;
            if (id !== null) {
                path = path + "/" + id;
            }
            window.Loader.get(path, null, function (e, r) {
                me.response = r;
            });
            return me.response;
        };
        this.put = function (id, req) {
            var path = serverUrl + me.entity;
            if (id !== null) {
                path = path + "/" + id;
            }
            window.Loader.put(path, {data: req, dataType: window.Loader.dataTypes.json}, function (e, r) {
                me.response = r;
            });
            return me.response;
        };
        this.post = function (req) {
            window.Loader.post(serverUrl + me.entity, {data: req, dataType: window.Loader.dataTypes.json}, function (e, r) {
                me.response = r;
            });
            return me.response;
        };
        this.delete = function (id) {
            window.Loader.delete(serverUrl + me.entity + '/' + id, null, function (e, r) {
                me.response = r;
            });
            return me.response;
        };
        return {get: me.get, getAll: me.getAll, put: me.put, post: me.post, delte: me.delete, setE: me.setE};
    }]);
