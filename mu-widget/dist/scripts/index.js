// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (modules, entry, mainEntry, parcelRequireName, globalName) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        this
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      var res = localRequire.resolve(x);
      return res === false ? {} : newRequire(res);
    }

    function resolve(x) {
      var id = modules[name][1][x];
      return id != null ? id : x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  Object.defineProperty(newRequire, 'root', {
    get: function () {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"dsFIN":[function(require,module,exports) {
var _muWidget = require("mu-widget/lib/MuWidget");
(0, _muWidget.MuWidget).registerAll(require("./Widgets"));
(0, _muWidget.MuWidget).startup();

},{"mu-widget/lib/MuWidget":"6ehWG","./Widgets":"50XPX"}],"6ehWG":[function(require,module,exports) {
"use strict";
/*	This file is part of MuWidget.

    MuWidget is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    MuWidget is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with MuWidget.  If not, see <https://www.gnu.org/licenses/>. */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SetAttributes = exports.MuWidget = void 0;
const MuBinder_1 = require("./MuBinder");
class MuWidget {
    constructor(container){
        this.ui = {}; //Record<string, AnyElementA> = {};
        this.muOpts = {};
        this.muWidgetEventHandlers = {};
        this.muIndexOpts = null;
        this.muSubWidgets = [];
        this.muNamedWidget = {}; // Record<string, MuWidget> = {};
        this.muRoot = this;
        this.muParent = null;
        this.muTemplates = {};
        this.muTemplateParents = {};
        this.muOnAfterIndex = [];
        this.muBindOpts = {};
        this.container = container;
    }
    muWidgetFromTemplate(templateName, container, params = null, position = "last", ref = null) {
        let finalContainer;
        if (typeof container == "string") {
            var containerName = container;
            finalContainer = this.ui[container];
            if (!finalContainer) throw new Error("Container with mu-id='" + containerName + "' not exists.");
        } else finalContainer = container;
        var tmpElemementType = "div";
        var tmpTemplate = this.muFindTemplate(templateName);
        if (!tmpTemplate) throw "No template named '" + templateName + "'.";
        tmpTemplate = tmpTemplate.toLowerCase();
        if (tmpTemplate.startsWith("<tr")) tmpElemementType = "tbody";
        if (tmpTemplate.startsWith("<td") || tmpTemplate.startsWith("<th")) tmpElemementType = "tr";
        if (tmpTemplate.startsWith("<tbody")) tmpElemementType = "table";
        var element = document.createElementNS(finalContainer.namespaceURI, tmpElemementType);
        element.innerHTML = this.muTemplates[templateName];
        element = element.firstElementChild;
        // if (params) element.setAttribute('mu-params', JSON.stringify(params));
        switch(position){
            case "first":
                if (finalContainer.firstElementChild) finalContainer.insertBefore(element, finalContainer.firstElementChild);
                else finalContainer.appendChild(element);
                break;
            case "before":
                finalContainer.insertBefore(element, ref);
                break;
            case "after":
                if (ref.nextElementSibling) finalContainer.insertBefore(element, ref.nextElementSibling);
                else finalContainer.appendChild(element);
                break;
            case "last":
                finalContainer.appendChild(element);
                break;
        }
        let widget = this.muActivateWidget(element, null, params || {});
        let opts = this.muGetElementOpts(element);
        if (!opts.id) opts.id = templateName;
        this.muAddEvents(opts, element, widget);
        return widget;
    }
    createElementFromHTML(src, container) {
        let lSrc = src.toLowerCase();
        let tmpElemementType = "div";
        if (lSrc.startsWith("<tr")) tmpElemementType = "tbody";
        if (lSrc.startsWith("<td") || lSrc.startsWith("<th")) tmpElemementType = "tr";
        if (lSrc.startsWith("<tbody") || lSrc.startsWith("<thead")) tmpElemementType = "table";
        let element = document.createElementNS(container.namespaceURI, tmpElemementType);
        element.innerHTML = src;
        element = element.firstElementChild;
        return element;
    }
    muRemoveSelf() {
        this.container.parentNode.removeChild(this.container);
    }
    muGetChildWidgets(container) {
        return MuWidget.getChildWidgets(typeof container === "string" ? this.ui[container] : container);
    }
    muBindList(list, templateName, container, commonParams = null, finalCalback = null) {}
    muVisible(state, control) {
        if (Array.isArray(control)) for (const controlItem of control)this.muVisible(state, controlItem);
        else {
            let neg = false;
            if (typeof control === "string") {
                if (control.startsWith("!")) {
                    neg = true;
                    control = control.substring(1);
                }
                if (!(control in this.ui)) throw new Error("Control with mu-id='" + control + "' not found.");
                control = this.ui[control];
            }
            control.style.display = state !== neg ? null : "none";
        }
    }
    muBindData(srcData) {
        MuBinder_1.MuBinder.bindData(this.muBindOpts, srcData, this);
        this.muAfterBindData();
    }
    muFetchData() {
        return MuBinder_1.MuBinder.fetchData(this.muBindOpts, this);
    }
    // protected muRegisterEvent(...args) { }
    // public addEventListener(name : string, handler : (...args)=>void) { }
    // public muEventNames() : string[] { return []; }
    muAfterBindData() {}
    // public constructor(container : AnyElement)
    muInit(container) {
        this.muOnAfterIndex = [];
        this.ui = {};
        this.muOpts = {
            attributePrefix: "mu-",
            bindEvents: [
                "click",
                "dblclick",
                "mouseenter",
                "mouseleave",
                "mousemove",
                "mouseout",
                "mouseover",
                "mouseup",
                "blur",
                "change",
                "focus",
                "select",
                "submit",
                "keyup",
                "keydown",
                "keypress",
                "scroll",
                "drag",
                "dragstart",
                "dragend",
                "dragover",
                "dragenter",
                "dragleave",
                "drop",
                "input"
            ],
            autoMethodNameSeparator: "_"
        };
        /*	opts ? opts : {}
        );*/ this.container = container;
        this.container.widget = this;
        this.muSubWidgets = [];
        this.muNamedWidget = {};
        this.muTemplates = {};
        this.muTemplateParents = {};
        this.muRoot = this;
        this.muWidgetEventHandlers = {};
        this.beforeIndex();
        this.muAddEvents({
            id: "container"
        }, this.container);
        this.muIndexTree(container, true);
    }
    beforeIndex() {}
    muDispatchEvent(name, ...args) {
        if (!(name in this.muWidgetEventHandlers)) throw new Error("Unknown event '" + name + "' on class '" + this.constructor.name + "'.");
        if (this.muWidgetEventHandlers[name]) {
            // const args = Array.from(arguments);
            // args[0] = <MuEvent>{
            const ev = {
                sender: this,
                originalEvent: event,
                args: Array.from(arguments).slice(1)
            };
            //console.log(args, arguments);
            /* for(const handler of this.muWidgetEventHandlers[name])
                handler.apply(this, args); */ for(let i = 0, l = this.muWidgetEventHandlers[name].length; i < l; i++){
                const handler = this.muWidgetEventHandlers[name][i];
                handler.call(this, ev);
            }
        }
    }
    muRegisterEvent(...args) {
        // for(var i = 0; i < arguments.length; i++) this.muWidgetEventHandlers[arguments[i]] = [];
        for (const eventName of args)this.muWidgetEventHandlers[eventName] = [];
    }
    addEventListener(name, handler) {
        if (!(name in this.muWidgetEventHandlers)) throw new Error("Unknown event '" + name + "' on class '" + this.constructor.name + "'.");
        this.muWidgetEventHandlers[name].push(handler);
    }
    muEventNames() {
        return Object.keys(this.muWidgetEventHandlers);
    }
    muActivateWidget(element, opts, extraParams = {}) {
        if (!opts) opts = this.muGetElementOpts(element);
        const widgetName = opts.widget;
        const c = MuWidget.widgetClasses[widgetName] || window[widgetName];
        if (!c) throw "Class '" + opts.widget + "' is not defined.";
        const widget = new c(element, opts);
        if (!(widget instanceof MuWidget)) console.error("Widget '" + widgetName + "' is not a descendant of the MuWidget class.");
        widget.muParent = this;
        widget.muRoot = this.muRoot || this;
        if (opts.params) {
            const params = JSON.parse(opts.params);
            for(const k in params)widget[k] = params[k];
        }
        if (extraParams) for(const k in extraParams)widget[k] = extraParams[k];
        // MuWidget.extendPrototype(widget);
        this.muSubWidgets.push(widget);
        if (opts.id) this.muNamedWidget[opts.id] = widget;
        // MuWidget.call(widget, element, /*opts.opts || this.muOpts */);
        widget.muInit(element);
        return widget;
    }
    muGetElementOpts(element) {
        var res = {};
        for(var i = 0, attributes = element.attributes, n = attributes.length, arr = []; i < n; i++){
            var name = attributes[i].nodeName;
            if (name.startsWith(this.muOpts.attributePrefix)) {
                var optName = name.substr(this.muOpts.attributePrefix.length);
                res[optName] = attributes[i].nodeValue;
            }
        }
        return res;
    }
    muFindTemplate(templateName) {
        let tmpTemplate = null;
        if (templateName.startsWith("ancestor:")) {
            let aTemplateName = templateName.substr(9);
            let w = this;
            while(w){
                if (w.muTemplates[aTemplateName]) {
                    tmpTemplate = w.muTemplates[aTemplateName];
                    break;
                }
                w = w.muParent;
            }
        } else tmpTemplate = this.muTemplates[templateName];
        return tmpTemplate;
    }
    muIndexTree(element, indexWidget, useName = null) {
        var _a;
        var ev = {
            element: element,
            widget: this,
            opts: this.muGetElementOpts(element)
        };
        //TODO: MuBinder
        // this.muCallPlugin("indexPrepareElement", ev);
        if (!ev.element) return;
        element = ev.element;
        var opts = ev.opts;
        if (opts.usetemplate) {
            var src = this.muFindTemplate(opts.usetemplate);
            // element.outerHTML = src;
            if (typeof src === "undefined") throw new Error("Template '" + opts.usetemplate + "' not exists.");
            var newElement = this.createElementFromHTML(src, element.parentNode);
            element.parentNode.insertBefore(newElement, element);
            element.parentNode.removeChild(element);
            element = newElement;
            if (opts.id) element.setAttribute(this.muOpts.attributePrefix + "id", opts.id);
            if (opts.params) element.setAttribute(this.muOpts.attributePrefix + "params", opts.params);
            if (opts.widget) element.setAttribute(this.muOpts.attributePrefix + "widget", opts.widget);
            if (opts.template) element.setAttribute(this.muOpts.attributePrefix + "template", opts.template);
            opts = this.muGetElementOpts(element);
        }
        if (opts.preproc) this.preproc(element, opts.preproc);
        this.muIndexOpts = opts;
        useName = useName || opts.usename;
        if (useName) {
            const n = (_a = element.attributes.getNamedItem("name")) === null || _a === void 0 ? void 0 : _a.value;
            if (n) opts.id = n;
        }
        if (opts.noindex) return;
        if (opts.template) {
            element.removeAttribute(this.muOpts.attributePrefix + "template");
            if (opts.template in this.muTemplates) console.error("The widget already contains template '" + opts.template + "'.");
            this.muTemplates[opts.template] = element.outerHTML;
            this.muTemplateParents[opts.template] = element.parentNode;
            if (element.parentNode) element.parentNode.removeChild(element);
            return;
        }
        if (opts.id) this.muAddUi(opts.id, element);
        // if (opts.bind) this.muParseBinds(opts.bind, element);
        ev.opts = opts;
        this.muCallPlugin("beforeIndexElement", ev);
        if ((!opts.widget || indexWidget) && !opts.nocontent && element.children) {
            // Index children
            var elements = [];
            // Create copy, template modify children
            for (const el of element.children)elements.push(el);
            for (const el1 of elements)// if (elements[i])
            this.muIndexTree(el1, false, useName);
        }
        var widget = null;
        if (opts.widget && !indexWidget) // Initialize widget
        widget = this.muActivateWidget(element, opts);
        this.muAddEvents(opts, element, widget);
        if (indexWidget) {
            this.afterIndex();
            for(var i = 0, l = this.muOnAfterIndex.length; i < l; i++)this.muOnAfterIndex[i](this);
        }
    }
    muAddUi(id, element) {
        if (id in this.ui) console.error("The widget already contains an element with mu-id '" + id + "'.");
        this.ui[id] = element;
    }
    muCallPlugin(eventName, eventArgs) {
        for (var plugin of MuWidget.plugIns)if (plugin[eventName]) plugin[eventName](eventArgs);
    }
    afterIndex() {}
    preproc(element, preproc) {
        var p = preproc.indexOf(" ");
        var name = preproc;
        var paramsStr = "";
        if (p >= 0) {
            var name = preproc.substr(0, p);
            var paramsStr = preproc.substr(p);
        }
        if (!(name in MuWidget.preproc)) throw new Error("Preproc '" + name + '" not defined.');
        var pp = MuWidget.preproc[name];
        const mode = pp.prototype.preproc ? "class" : "function";
        if (mode === "function") paramsStr = "[" + paramsStr + "]";
        else paramsStr = "{" + paramsStr + "}";
        try {
            var params = paramsStr ? JSON.parse(paramsStr) : null;
        } catch (exc) {
            throw new Error(exc.toString() + "\n" + paramsStr);
        }
        if (mode === "function") {
            params.unshift(element);
            pp.call(null, params);
        } else {
            var inst = new pp();
            for(var k in params)inst[k] = params[k];
            inst.preproc(element);
        }
    }
    muAddEvents(opts, element, widget = null) {
        var autoMethodName;
        var eventNames = [
            ...this.muOpts.bindEvents
        ];
        var wEvents = [];
        if (widget) {
            wEvents = widget.muEventNames();
            eventNames = [
                ...eventNames,
                ...wEvents
            ];
        }
        var tags = opts.tag ? opts.tag.split(" ") : null;
        for(var i = 0, l = eventNames.length; i < l; i++){
            const eventName = eventNames[i];
            const eventTarget = widget && wEvents.indexOf(eventName) >= 0 ? widget : element;
            let methodName = opts[eventName];
            if (methodName === undefined) {
                if (opts.id) {
                    autoMethodName = opts.id + this.muOpts.autoMethodNameSeparator + eventName;
                    if (autoMethodName in this) methodName = autoMethodName;
                }
            }
            if (methodName) this.muAddEvent(eventName, eventTarget, this.muGetMethodCallback(methodName));
            if (tags) for(var i1 = 0, l1 = tags.length; i1 < l1; i1++){
                autoMethodName = tags[i1] + this.muOpts.autoMethodNameSeparator + eventName;
                if (autoMethodName in this) this.muAddEvent(eventName, eventTarget, this.muGetMethodCallback(autoMethodName));
            }
        }
        // init
        if (tags) {
            const eventTarget = element;
            for(var i = 0, l = tags.length; i < l; i++){
                autoMethodName = tags[i] + this.muOpts.autoMethodNameSeparator + "init";
                if (autoMethodName in this) this.muGetMethodCallback(autoMethodName)(eventTarget);
            }
        }
    }
    muFindMethod(name, context) {
        var obj = context || this;
        //todo: blbne
        while(name.startsWith("parent.")){
            if (!obj.muParent) throw "Widget of class '" + obj.constructor.name + "' has not parent.";
            obj = obj.muParent;
            name = name.substr(7);
        }
        var params = [];
        var p = null;
        if (-1 != (p = name.indexOf(":"))) {
            params = JSON.parse("[" + name.substr(p + 1) + "]");
            name = name.substr(0, p);
        }
        var method = obj[name];
        if (method === undefined) throw "Undefined method '" + name + "' in class '" + obj.constructor.name + "'.";
        return {
            method: method,
            args: params,
            context: obj
        };
    }
    muGetMethodCallback(name, context = null) {
        const methodInfo = this.muFindMethod(name, context);
        return (ev /* , event : Event */ )=>{
            /* const callparams = [<MuEvent>{
                sender: event?.target,
                source: source,
                originalEvent: event
            }, ...methodInfo.args, ...Array.from(arguments).slice(1)]; */ const callparams = [
                ev,
                ...methodInfo.args,
                ...ev.args || []
            ];
            return methodInfo.method.apply(methodInfo.context, callparams);
        };
    }
    muAddEvent(eventName, element, callback) {
        element.addEventListener(eventName, callback);
    /* (element as any).addEventListener(eventName, (/*ev : Event* /) => {
            // return callback(this, ev);
            // return callback.apply(null, arguments);
            console.log("muAddEvent:wrapper", arguments);
            return callback(...Array.from(arguments));
            // return callback.apply(null, [this].concat(Array.from(arguments)));
        }); */ }
    static getChildWidgets(container) {
        const ls = [];
        for (const item of container.children)if (item.widget) ls.push(item.widget);
        return ls;
    }
    static registerAll() {
        for(var i = 0; i < arguments.length; i++){
            var classes = arguments[i];
            for(var k in classes)MuWidget.widgetClasses[k] = classes[k];
        }
    }
    static registerAs(c, n) {
        MuWidget.widgetClasses[n] = c;
    }
    static startup(startElement = null, onSucces = null, onBefore = null) {
        var fn = window.addEventListener || window.attachEvent || function(type, listener) {
            if (window.onload) {
                var curronload = window.onload;
                var newonload = function(evt) {
                    curronload(evt);
                    listener(evt);
                };
                window.onload = newonload;
            } else window.onload = listener;
        };
        fn("load", function() {
            if (onBefore) onBefore();
            var element = startElement || document.documentElement;
            var muRoot = new MuWidget(element);
            muRoot.muInit(element);
            MuWidget.root = muRoot;
            if (onSucces) onSucces(muRoot);
        });
    }
}
exports.MuWidget = MuWidget;
// statics
MuWidget.widgetClasses = {};
MuWidget.plugIns = [];
MuWidget.eventLegacy = false;
function SetAttributes(element, attrs) {
    for(const n in attrs)element.setAttribute(n, attrs[n].toString());
}
exports.SetAttributes = SetAttributes;

},{"./MuBinder":"l8fje"}],"l8fje":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MuBinder = void 0;
const StrParser_1 = require("./StrParser");
class MuBinder {
    static parse(src, element) {
        /*
        source
        source:target
        source::target
        source;target
        sourcer|filter():target
        */ let mode = "source";
        const optsList = [];
        const sp1 = new StrParser_1.StrParser(src);
        let p;
        let lastP = 0;
        function parseFetchBind(chunk, opts) {
            switch(chunk){
                case ":":
                case "::":
                case "^":
                    opts.forBind = chunk != "^";
                    opts.forFetch = chunk != ":";
                    return true;
                case ";":
                    mode = "complete";
                    opts.forBind = true;
                    opts.forFetch = false;
                    return true;
                default:
                    return false;
            }
        }
        function parseFilter(sp, bindPart, opts) {
            p = sp.findNext([
                "::",
                ":",
                "|",
                "^",
                ";",
                "("
            ]);
            let filter = {
                methodName: sp.substring(lastP, p).trim(),
                args: []
            };
            if (!p) mode = "end";
            else if (p.chunk === ";") {
                mode = "complete";
                sp.toEndChunk();
            } else {
                sp.toEndChunk();
                lastP = sp.position;
                if (p.chunk === "(") {
                    const argStart = sp.pos();
                    while(true){
                        p = sp.findNext([
                            ")",
                            '"'
                        ]);
                        if (p === null) throw "missing ')' after argument(s) '" + src + "'";
                        if (p.chunk == ")") {
                            sp.toEndChunk();
                            lastP = sp.position;
                            break;
                        }
                        // skoč na konec stringu
                        sp.toEndChunk();
                        do {
                            p = sp.findNext([
                                '\\"',
                                '"'
                            ]);
                            if (p === null) throw "unterminated string '" + src + "'";
                            sp.toEndChunk();
                        }while (p.chunk === '\\"');
                    }
                    const sArgs = sp.substring(argStart, p);
                    try {
                        filter.args = JSON.parse("[" + sArgs + "]");
                    } catch (exc) {
                        throw "Invalid arguments - " + exc.toString() + " '" + sArgs + "'";
                    }
                }
                mode = parseFetchBind(p.chunk, opts) ? "target" : bindPart ? "bindFilter" : "fetchFilter";
                // sp.toEndChunk();
                lastP = sp.position;
            }
            return filter.methodName ? filter : null;
        }
        //@ts-ignore
        while(!sp1.isEnd() && mode != "end"){
            mode = "source";
            const opts = {
                element: element,
                source: null,
                target: null,
                bindFilters: [],
                fetchFilters: [],
                forBind: null,
                forFetch: null
            };
            // sp.debugMode = true;
            while(mode != "complete" && mode != "end")switch(mode){
                case "source":
                    p = sp1.findNext([
                        "::",
                        ":",
                        "|",
                        ";",
                        "^"
                    ]);
                    opts.source = sp1.substring(lastP, p).trim();
                    if (!p) mode = "end";
                    else if (p.chunk == ";") mode = "complete";
                    else {
                        mode = parseFetchBind(p.chunk, opts) ? "target" : "bindFilter";
                        sp1.toEndChunk();
                        lastP = sp1.position;
                    }
                    break;
                case "target":
                    p = sp1.findNext([
                        "|",
                        ";"
                    ]);
                    opts.target = sp1.substring(lastP, p).trim();
                    if (!p) mode = "end";
                    else if (p.chunk == ";") mode = "complete";
                    else {
                        mode = "fetchFilter";
                        sp1.toEndChunk();
                        lastP = sp1.position;
                    }
                    break;
                case "bindFilter":
                    var f = parseFilter(sp1, true, opts);
                    if (f) opts.bindFilters.push(f);
                    break;
                case "fetchFilter":
                    f = parseFilter(sp1, false, opts);
                    if (f) opts.fetchFilters.push(f);
                    break;
            }
            optsList.push(opts);
            sp1.toEndChunk();
            lastP = sp1.position;
        }
        return optsList;
    }
    static setDefaults(mbo) {
        const defaults = {};
        // mbo.element.hasAttribute("mu-widget")
        if (mbo.element.hasAttribute("mu-widget")) {
            defaults.forBind = true;
            defaults.forFetch = true;
            defaults.target = "@widget";
        } else if (mbo.element instanceof HTMLInputElement || mbo.element instanceof HTMLTextAreaElement || mbo.element instanceof HTMLSelectElement) {
            if (mbo.element.type === "file") {
                defaults.forBind = false;
                defaults.forFetch = true;
                defaults.target = "files";
            } else {
                defaults.forBind = true;
                defaults.forFetch = true;
                if (mbo.element.type === "checkbox") defaults.target = "checked";
                else defaults.target = "value";
            }
        } else if (mbo.element instanceof HTMLImageElement || mbo.element instanceof HTMLAudioElement || mbo.element instanceof HTMLVideoElement) {
            defaults.forBind = true;
            defaults.forFetch = false;
            defaults.target = "src";
        } else {
            defaults.forBind = true;
            defaults.forFetch = false;
            defaults.target = "text";
        }
        for(const k in defaults)if (mbo[k] === null) mbo[k] = defaults[k];
        const targetAlias = {
            text: "innerText",
            html: "innerHTML"
        };
        if (targetAlias[mbo.target]) mbo.target = targetAlias[mbo.target];
    }
    static beforeIndexElement(ev) {
        if (ev.opts.bind) {
            const bindSrc = ev.opts.bind;
            for (var mbo of MuBinder.parse(bindSrc, ev.element)){
                MuBinder.setDefaults(mbo);
                if (!ev.widget.muBindOpts) ev.widget.muBindOpts = {};
                if (!ev.widget.muBindOpts[mbo.source]) ev.widget.muBindOpts[mbo.source] = [];
                ev.widget.muBindOpts[mbo.source].push(mbo);
            }
        }
    }
    static register(muWidget) {
        // @ts-ignore
        muWidget.plugIns.push({
            beforeIndexElement: MuBinder.beforeIndexElement
        });
    }
    static bindData(bindOpts, srcData, widget) {
        for(const k in srcData)if (bindOpts[k]) {
            for (const mbo of bindOpts[k])if (mbo.forBind) {
                let val = MuBinder.UseFilters(srcData[k], mbo.bindFilters, widget);
                MuBinder.setValue(val, mbo.target, mbo.element, widget);
            }
        }
    }
    static fetchData(bindOpts, widget) {
        const resData = {};
        for(const k in bindOpts){
            for (const mbo of bindOpts[k])if (mbo.forFetch) /* resData[k] = mbo.element[mbo.target];
                    let val = MuBinder.UseFilters(srcData[k], mbo.bindFilters, widget);
                    ; */ resData[k] = MuBinder.UseFilters(MuBinder.GetValue(mbo.target, mbo.element, widget), mbo.fetchFilters, widget);
        }
        return resData;
    }
    static UseFilters(val, filters, widget) {
        var _a, _b, _c;
        for (const filter of filters){
            let obj = null;
            let fn;
            if (filter.methodName in widget) obj = widget; // fn = <MuBindFilterCallback>widget[filter.methodName];
            else if (widget.muParent && filter.methodName in widget.muParent) obj = widget.muParent; // fn = <MuBindFilterCallback>widget.muParent[filter.methodName];
            else if (filter.methodName in MuBinder.filters) obj = MuBinder.filters; //fn = MuBinder.filters[filter.methodName];
            else {
                // Parent widgets
                let w = (_a = widget.muParent) === null || _a === void 0 ? void 0 : _a.muParent;
                while(w){
                    if (filter.methodName in w) {
                        obj = w;
                        break;
                    }
                    w = w.muParent;
                }
            }
            if (!obj) throw new Error("Unknown filter '" + filter.methodName + "'. Source widget: '" + ((_c = (_b = widget) === null || _b === void 0 ? void 0 : _b.costructor) === null || _c === void 0 ? void 0 : _c.name) + "'");
            fn = obj[filter.methodName];
            val = fn.call(obj, val, {}, ...filter.args);
        }
        return val;
    }
    static setValue(val1, target, element, widget) {
        if (target === "@widget") element["widget"].muBindData(val1);
        else if (target === "foreach" || target === "@foreach") {
            element.innerHTML = "";
            for(const k in widget.muTemplateParents)if (element === widget.muTemplateParents[k]) {
                let arr = [];
                if (!Array.isArray(val1)) for(const k in val1)arr.push({
                    key: k,
                    value: val1[k]
                });
                else arr = val1;
                for (const data of arr){
                    const widgetParams = {};
                    for(const k1 in data)if (k1.startsWith(".")) widgetParams[k1.substr(1)] = data[k1];
                    const itemWidget = widget.muWidgetFromTemplate(k, element, widgetParams);
                    itemWidget.muBindData(data);
                    if ("AferBind" in itemWidget) itemWidget.AferBind();
                }
                break;
            }
        } else if (target.startsWith(".")) this.setDeep(val1, element["widget"], target.substr(1));
        else if (target.startsWith("@attr.")) element.setAttribute(target.substr(6), val1);
        else if (target == "@visible") element.style.display = val1 ? "" : "none";
        else if (target == "@options") {
            const addOpt = function(val, text) {
                const opt = document.createElement("option");
                opt.text = text;
                opt.value = val;
                element.add(opt);
            };
            element.innerHTML = "";
            if (Array.isArray(val1)) {
                for (const item of val1)if (typeof item === "string") addOpt(item, item);
                else addOpt(item.value, item.text);
            } else if (typeof val1 === "object") for(const v in val1)addOpt(v, val1[v]);
        } else this.setDeep(val1, element, target); // element[target] = val;
    }
    static setDeep(value, object, path) {
        let obj = object;
        const fields = path.split(".");
        const lastI = fields.length - 1;
        let i = 0;
        for (const f of fields){
            if (i < lastI) obj = obj[f];
            else obj[f] = value;
            if (!obj) throw "Can not set value to path'" + path + "'";
            i++;
        }
    }
    static getDeep(object, path) {
        let obj = object;
        const fields = path.split(".");
        for (const f of fields){
            if (!(f in obj)) return undefined;
            obj = obj[f];
        }
        return obj;
    }
    static GetValue(target, element, widget) {
        switch(target){
            case "@widget":
                return element["widget"].muFetchData();
            case "foreach":
            case "@foreach":
                return widget.muGetChildWidgets(element).map((itemWidget)=>itemWidget.muFetchData());
            default:
                if (target.startsWith(".")) return this.getDeep(element["widget"], target.substr(1));
                else if (target.startsWith("@attr.")) return element.getAttribute(target.substr(6));
                else if (target == "@visible") return element.style.display != "none";
                else return this.getDeep(element, target); // element[target] = val;
                break;
        }
    }
}
exports.MuBinder = MuBinder;
MuBinder.filters = {
    toLower: (val)=>{
        return val === null || val === void 0 ? void 0 : val.toString().toLocaleLowerCase();
    },
    toUpper: (val)=>val === null || val === void 0 ? void 0 : val.toString().toLocaleUpperCase(),
    short: (val, ev, maxLen, sufix = "...")=>{
        let str = val.toString();
        if (str.length >= maxLen - sufix.length) str = str.substr(0, maxLen) + sufix;
        return str;
    },
    tern: (val, ev, onTrue, onFalse)=>val ? onTrue : onFalse,
    prepend: (val, ev, prefix, ifAny = false)=>!ifAny || val ? prefix + val : val,
    append: (val, ev, prefix, ifAny = false)=>!ifAny || val ? val + prefix : val,
    map: (val, ev, map)=>map[val]
};

},{"./StrParser":"eWXZB"}],"eWXZB":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.StrParser = void 0;
class StrParser {
    constructor(str){
        this.position = 0;
        this.lastMark = null;
        this.debugMode = false;
        this._onEndChunk = false;
        this.str = str;
    }
    findNext(chunk, skipChunk = false) {
        if (typeof chunk === "string") chunk = [
            chunk
        ];
        // let firstPos : number|null = null;
        let firstPos = null;
        let firstChunk = null;
        let firstChunkNum = 0;
        let i = 0;
        for (const ch of chunk){
            const pos = this.str.indexOf(ch, this.position);
            if (pos > 0 && (firstPos === null || pos < firstPos)) {
                firstPos = pos;
                firstChunk = ch;
                firstChunkNum = i;
            }
            i++;
        }
        if (firstChunk) {
            if (skipChunk) firstPos += firstChunk.length;
            this.position = firstPos;
            this.lastMark = {
                chunk: firstChunk,
                chunkNum: firstChunkNum,
                position: firstPos
            };
            this._onEndChunk = false;
            this.debug("findNext(" + chunk.join('", "') + ") > '" + firstChunk + "', " + this.position);
            return this.lastMark;
        } else {
            this.debug("findNext(" + chunk.join('", "') + ") not found " + this.position);
            return null;
        }
    }
    substring(start = null, stop = null) {
        if (start === null) start = this.position;
        else if (typeof start !== "number") start = start.position;
        if (stop === null) stop = this.str.length;
        else if (typeof stop !== "number") stop = stop.position;
        const res = this.str.substring(start, stop);
        this.debug("substr " + start + ":" + stop + " > " + res);
        return res;
    }
    moverel(mov) {
        const newPos = this.position + mov;
        this.position = Math.min(this.str.length, Math.max(0, newPos));
        return {
            position: this.position
        };
    }
    pos() {
        return {
            position: this.position
        };
    }
    toEndChunk() {
        var _a, _b;
        const l = this._onEndChunk ? 0 : ((_b = (_a = this.lastMark) === null || _a === void 0 ? void 0 : _a.chunk) === null || _b === void 0 ? void 0 : _b.length) || 0;
        this.moverel(l);
        this._onEndChunk = true;
        this.debug("toEndChunk +" + l.toString());
    }
    debug(msg) {
        if (this.debugMode) console.log(msg + "\n		%c" + this.str.substring(0, this.position) + "%c" + this.str.substring(this.position), "background: green; color: white", "color: blue");
    }
    isEnd() {
        return this.position >= this.str.length;
    }
}
exports.StrParser = StrParser;

},{}],"50XPX":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "CopyBlock", ()=>CopyBlock);
var _muWidget = require("mu-widget/lib/MuWidget");
class CopyBlock extends (0, _muWidget.MuWidget) {
    beforeIndex() {
        this.container.innerHTML = '<span mu-id="content" class="copy-block__content">' + this.container.innerHTML + '</span><span mu-id="btCopy" class="copy-block__bt-copy"></span>';
    }
    btCopy_click() {
        this.ui.content.contentEditable = "true";
        this.ui.content.setAttribute("contenteditable", "true");
        this.ui.content.focus();
        document.execCommand("selectAll");
        document.execCommand("copy");
        this.ui.content.contentEditable = "false";
        this.ui.content.setAttribute("contenteditable", "false");
    }
}

},{"mu-widget/lib/MuWidget":"6ehWG","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"gkKU3":[function(require,module,exports) {
exports.interopDefault = function(a) {
    return a && a.__esModule ? a : {
        default: a
    };
};
exports.defineInteropFlag = function(a) {
    Object.defineProperty(a, "__esModule", {
        value: true
    });
};
exports.exportAll = function(source, dest) {
    Object.keys(source).forEach(function(key) {
        if (key === "default" || key === "__esModule" || dest.hasOwnProperty(key)) return;
        Object.defineProperty(dest, key, {
            enumerable: true,
            get: function() {
                return source[key];
            }
        });
    });
    return dest;
};
exports.export = function(dest, destName, get) {
    Object.defineProperty(dest, destName, {
        enumerable: true,
        get: get
    });
};

},{}]},["dsFIN"], "dsFIN", "parcelRequire0de5")

//# sourceMappingURL=index.js.map
