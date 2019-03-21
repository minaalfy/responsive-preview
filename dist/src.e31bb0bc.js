// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
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

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
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
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../node_modules/preact/dist/preact.mjs":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createElement = exports.h = h;
exports.cloneElement = cloneElement;
exports.createRef = createRef;
exports.Component = Component;
exports.render = render;
exports.rerender = rerender;
exports.options = exports.default = void 0;

var VNode = function VNode() {};

var options = {};
exports.options = options;
var stack = [];
var EMPTY_CHILDREN = [];

function h(nodeName, attributes) {
  var children = EMPTY_CHILDREN,
      lastSimple,
      child,
      simple,
      i;

  for (i = arguments.length; i-- > 2;) {
    stack.push(arguments[i]);
  }

  if (attributes && attributes.children != null) {
    if (!stack.length) stack.push(attributes.children);
    delete attributes.children;
  }

  while (stack.length) {
    if ((child = stack.pop()) && child.pop !== undefined) {
      for (i = child.length; i--;) {
        stack.push(child[i]);
      }
    } else {
      if (typeof child === 'boolean') child = null;

      if (simple = typeof nodeName !== 'function') {
        if (child == null) child = '';else if (typeof child === 'number') child = String(child);else if (typeof child !== 'string') simple = false;
      }

      if (simple && lastSimple) {
        children[children.length - 1] += child;
      } else if (children === EMPTY_CHILDREN) {
        children = [child];
      } else {
        children.push(child);
      }

      lastSimple = simple;
    }
  }

  var p = new VNode();
  p.nodeName = nodeName;
  p.children = children;
  p.attributes = attributes == null ? undefined : attributes;
  p.key = attributes == null ? undefined : attributes.key;
  if (options.vnode !== undefined) options.vnode(p);
  return p;
}

function extend(obj, props) {
  for (var i in props) {
    obj[i] = props[i];
  }

  return obj;
}

function applyRef(ref, value) {
  if (ref != null) {
    if (typeof ref == 'function') ref(value);else ref.current = value;
  }
}

var defer = typeof Promise == 'function' ? Promise.resolve().then.bind(Promise.resolve()) : setTimeout;

function cloneElement(vnode, props) {
  return h(vnode.nodeName, extend(extend({}, vnode.attributes), props), arguments.length > 2 ? [].slice.call(arguments, 2) : vnode.children);
}

var IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i;
var items = [];

function enqueueRender(component) {
  if (!component._dirty && (component._dirty = true) && items.push(component) == 1) {
    (options.debounceRendering || defer)(rerender);
  }
}

function rerender() {
  var p;

  while (p = items.pop()) {
    if (p._dirty) renderComponent(p);
  }
}

function isSameNodeType(node, vnode, hydrating) {
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    return node.splitText !== undefined;
  }

  if (typeof vnode.nodeName === 'string') {
    return !node._componentConstructor && isNamedNode(node, vnode.nodeName);
  }

  return hydrating || node._componentConstructor === vnode.nodeName;
}

function isNamedNode(node, nodeName) {
  return node.normalizedNodeName === nodeName || node.nodeName.toLowerCase() === nodeName.toLowerCase();
}

function getNodeProps(vnode) {
  var props = extend({}, vnode.attributes);
  props.children = vnode.children;
  var defaultProps = vnode.nodeName.defaultProps;

  if (defaultProps !== undefined) {
    for (var i in defaultProps) {
      if (props[i] === undefined) {
        props[i] = defaultProps[i];
      }
    }
  }

  return props;
}

function createNode(nodeName, isSvg) {
  var node = isSvg ? document.createElementNS('http://www.w3.org/2000/svg', nodeName) : document.createElement(nodeName);
  node.normalizedNodeName = nodeName;
  return node;
}

function removeNode(node) {
  var parentNode = node.parentNode;
  if (parentNode) parentNode.removeChild(node);
}

function setAccessor(node, name, old, value, isSvg) {
  if (name === 'className') name = 'class';

  if (name === 'key') {} else if (name === 'ref') {
    applyRef(old, null);
    applyRef(value, node);
  } else if (name === 'class' && !isSvg) {
    node.className = value || '';
  } else if (name === 'style') {
    if (!value || typeof value === 'string' || typeof old === 'string') {
      node.style.cssText = value || '';
    }

    if (value && typeof value === 'object') {
      if (typeof old !== 'string') {
        for (var i in old) {
          if (!(i in value)) node.style[i] = '';
        }
      }

      for (var i in value) {
        node.style[i] = typeof value[i] === 'number' && IS_NON_DIMENSIONAL.test(i) === false ? value[i] + 'px' : value[i];
      }
    }
  } else if (name === 'dangerouslySetInnerHTML') {
    if (value) node.innerHTML = value.__html || '';
  } else if (name[0] == 'o' && name[1] == 'n') {
    var useCapture = name !== (name = name.replace(/Capture$/, ''));
    name = name.toLowerCase().substring(2);

    if (value) {
      if (!old) node.addEventListener(name, eventProxy, useCapture);
    } else {
      node.removeEventListener(name, eventProxy, useCapture);
    }

    (node._listeners || (node._listeners = {}))[name] = value;
  } else if (name !== 'list' && name !== 'type' && !isSvg && name in node) {
    try {
      node[name] = value == null ? '' : value;
    } catch (e) {}

    if ((value == null || value === false) && name != 'spellcheck') node.removeAttribute(name);
  } else {
    var ns = isSvg && name !== (name = name.replace(/^xlink:?/, ''));

    if (value == null || value === false) {
      if (ns) node.removeAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase());else node.removeAttribute(name);
    } else if (typeof value !== 'function') {
      if (ns) node.setAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase(), value);else node.setAttribute(name, value);
    }
  }
}

function eventProxy(e) {
  return this._listeners[e.type](options.event && options.event(e) || e);
}

var mounts = [];
var diffLevel = 0;
var isSvgMode = false;
var hydrating = false;

function flushMounts() {
  var c;

  while (c = mounts.shift()) {
    if (options.afterMount) options.afterMount(c);
    if (c.componentDidMount) c.componentDidMount();
  }
}

function diff(dom, vnode, context, mountAll, parent, componentRoot) {
  if (!diffLevel++) {
    isSvgMode = parent != null && parent.ownerSVGElement !== undefined;
    hydrating = dom != null && !('__preactattr_' in dom);
  }

  var ret = idiff(dom, vnode, context, mountAll, componentRoot);
  if (parent && ret.parentNode !== parent) parent.appendChild(ret);

  if (! --diffLevel) {
    hydrating = false;
    if (!componentRoot) flushMounts();
  }

  return ret;
}

function idiff(dom, vnode, context, mountAll, componentRoot) {
  var out = dom,
      prevSvgMode = isSvgMode;
  if (vnode == null || typeof vnode === 'boolean') vnode = '';

  if (typeof vnode === 'string' || typeof vnode === 'number') {
    if (dom && dom.splitText !== undefined && dom.parentNode && (!dom._component || componentRoot)) {
      if (dom.nodeValue != vnode) {
        dom.nodeValue = vnode;
      }
    } else {
      out = document.createTextNode(vnode);

      if (dom) {
        if (dom.parentNode) dom.parentNode.replaceChild(out, dom);
        recollectNodeTree(dom, true);
      }
    }

    out['__preactattr_'] = true;
    return out;
  }

  var vnodeName = vnode.nodeName;

  if (typeof vnodeName === 'function') {
    return buildComponentFromVNode(dom, vnode, context, mountAll);
  }

  isSvgMode = vnodeName === 'svg' ? true : vnodeName === 'foreignObject' ? false : isSvgMode;
  vnodeName = String(vnodeName);

  if (!dom || !isNamedNode(dom, vnodeName)) {
    out = createNode(vnodeName, isSvgMode);

    if (dom) {
      while (dom.firstChild) {
        out.appendChild(dom.firstChild);
      }

      if (dom.parentNode) dom.parentNode.replaceChild(out, dom);
      recollectNodeTree(dom, true);
    }
  }

  var fc = out.firstChild,
      props = out['__preactattr_'],
      vchildren = vnode.children;

  if (props == null) {
    props = out['__preactattr_'] = {};

    for (var a = out.attributes, i = a.length; i--;) {
      props[a[i].name] = a[i].value;
    }
  }

  if (!hydrating && vchildren && vchildren.length === 1 && typeof vchildren[0] === 'string' && fc != null && fc.splitText !== undefined && fc.nextSibling == null) {
    if (fc.nodeValue != vchildren[0]) {
      fc.nodeValue = vchildren[0];
    }
  } else if (vchildren && vchildren.length || fc != null) {
    innerDiffNode(out, vchildren, context, mountAll, hydrating || props.dangerouslySetInnerHTML != null);
  }

  diffAttributes(out, vnode.attributes, props);
  isSvgMode = prevSvgMode;
  return out;
}

function innerDiffNode(dom, vchildren, context, mountAll, isHydrating) {
  var originalChildren = dom.childNodes,
      children = [],
      keyed = {},
      keyedLen = 0,
      min = 0,
      len = originalChildren.length,
      childrenLen = 0,
      vlen = vchildren ? vchildren.length : 0,
      j,
      c,
      f,
      vchild,
      child;

  if (len !== 0) {
    for (var i = 0; i < len; i++) {
      var _child = originalChildren[i],
          props = _child['__preactattr_'],
          key = vlen && props ? _child._component ? _child._component.__key : props.key : null;

      if (key != null) {
        keyedLen++;
        keyed[key] = _child;
      } else if (props || (_child.splitText !== undefined ? isHydrating ? _child.nodeValue.trim() : true : isHydrating)) {
        children[childrenLen++] = _child;
      }
    }
  }

  if (vlen !== 0) {
    for (var i = 0; i < vlen; i++) {
      vchild = vchildren[i];
      child = null;
      var key = vchild.key;

      if (key != null) {
        if (keyedLen && keyed[key] !== undefined) {
          child = keyed[key];
          keyed[key] = undefined;
          keyedLen--;
        }
      } else if (min < childrenLen) {
        for (j = min; j < childrenLen; j++) {
          if (children[j] !== undefined && isSameNodeType(c = children[j], vchild, isHydrating)) {
            child = c;
            children[j] = undefined;
            if (j === childrenLen - 1) childrenLen--;
            if (j === min) min++;
            break;
          }
        }
      }

      child = idiff(child, vchild, context, mountAll);
      f = originalChildren[i];

      if (child && child !== dom && child !== f) {
        if (f == null) {
          dom.appendChild(child);
        } else if (child === f.nextSibling) {
          removeNode(f);
        } else {
          dom.insertBefore(child, f);
        }
      }
    }
  }

  if (keyedLen) {
    for (var i in keyed) {
      if (keyed[i] !== undefined) recollectNodeTree(keyed[i], false);
    }
  }

  while (min <= childrenLen) {
    if ((child = children[childrenLen--]) !== undefined) recollectNodeTree(child, false);
  }
}

function recollectNodeTree(node, unmountOnly) {
  var component = node._component;

  if (component) {
    unmountComponent(component);
  } else {
    if (node['__preactattr_'] != null) applyRef(node['__preactattr_'].ref, null);

    if (unmountOnly === false || node['__preactattr_'] == null) {
      removeNode(node);
    }

    removeChildren(node);
  }
}

function removeChildren(node) {
  node = node.lastChild;

  while (node) {
    var next = node.previousSibling;
    recollectNodeTree(node, true);
    node = next;
  }
}

function diffAttributes(dom, attrs, old) {
  var name;

  for (name in old) {
    if (!(attrs && attrs[name] != null) && old[name] != null) {
      setAccessor(dom, name, old[name], old[name] = undefined, isSvgMode);
    }
  }

  for (name in attrs) {
    if (name !== 'children' && name !== 'innerHTML' && (!(name in old) || attrs[name] !== (name === 'value' || name === 'checked' ? dom[name] : old[name]))) {
      setAccessor(dom, name, old[name], old[name] = attrs[name], isSvgMode);
    }
  }
}

var recyclerComponents = [];

function createComponent(Ctor, props, context) {
  var inst,
      i = recyclerComponents.length;

  if (Ctor.prototype && Ctor.prototype.render) {
    inst = new Ctor(props, context);
    Component.call(inst, props, context);
  } else {
    inst = new Component(props, context);
    inst.constructor = Ctor;
    inst.render = doRender;
  }

  while (i--) {
    if (recyclerComponents[i].constructor === Ctor) {
      inst.nextBase = recyclerComponents[i].nextBase;
      recyclerComponents.splice(i, 1);
      return inst;
    }
  }

  return inst;
}

function doRender(props, state, context) {
  return this.constructor(props, context);
}

function setComponentProps(component, props, renderMode, context, mountAll) {
  if (component._disable) return;
  component._disable = true;
  component.__ref = props.ref;
  component.__key = props.key;
  delete props.ref;
  delete props.key;

  if (typeof component.constructor.getDerivedStateFromProps === 'undefined') {
    if (!component.base || mountAll) {
      if (component.componentWillMount) component.componentWillMount();
    } else if (component.componentWillReceiveProps) {
      component.componentWillReceiveProps(props, context);
    }
  }

  if (context && context !== component.context) {
    if (!component.prevContext) component.prevContext = component.context;
    component.context = context;
  }

  if (!component.prevProps) component.prevProps = component.props;
  component.props = props;
  component._disable = false;

  if (renderMode !== 0) {
    if (renderMode === 1 || options.syncComponentUpdates !== false || !component.base) {
      renderComponent(component, 1, mountAll);
    } else {
      enqueueRender(component);
    }
  }

  applyRef(component.__ref, component);
}

function renderComponent(component, renderMode, mountAll, isChild) {
  if (component._disable) return;
  var props = component.props,
      state = component.state,
      context = component.context,
      previousProps = component.prevProps || props,
      previousState = component.prevState || state,
      previousContext = component.prevContext || context,
      isUpdate = component.base,
      nextBase = component.nextBase,
      initialBase = isUpdate || nextBase,
      initialChildComponent = component._component,
      skip = false,
      snapshot = previousContext,
      rendered,
      inst,
      cbase;

  if (component.constructor.getDerivedStateFromProps) {
    state = extend(extend({}, state), component.constructor.getDerivedStateFromProps(props, state));
    component.state = state;
  }

  if (isUpdate) {
    component.props = previousProps;
    component.state = previousState;
    component.context = previousContext;

    if (renderMode !== 2 && component.shouldComponentUpdate && component.shouldComponentUpdate(props, state, context) === false) {
      skip = true;
    } else if (component.componentWillUpdate) {
      component.componentWillUpdate(props, state, context);
    }

    component.props = props;
    component.state = state;
    component.context = context;
  }

  component.prevProps = component.prevState = component.prevContext = component.nextBase = null;
  component._dirty = false;

  if (!skip) {
    rendered = component.render(props, state, context);

    if (component.getChildContext) {
      context = extend(extend({}, context), component.getChildContext());
    }

    if (isUpdate && component.getSnapshotBeforeUpdate) {
      snapshot = component.getSnapshotBeforeUpdate(previousProps, previousState);
    }

    var childComponent = rendered && rendered.nodeName,
        toUnmount,
        base;

    if (typeof childComponent === 'function') {
      var childProps = getNodeProps(rendered);
      inst = initialChildComponent;

      if (inst && inst.constructor === childComponent && childProps.key == inst.__key) {
        setComponentProps(inst, childProps, 1, context, false);
      } else {
        toUnmount = inst;
        component._component = inst = createComponent(childComponent, childProps, context);
        inst.nextBase = inst.nextBase || nextBase;
        inst._parentComponent = component;
        setComponentProps(inst, childProps, 0, context, false);
        renderComponent(inst, 1, mountAll, true);
      }

      base = inst.base;
    } else {
      cbase = initialBase;
      toUnmount = initialChildComponent;

      if (toUnmount) {
        cbase = component._component = null;
      }

      if (initialBase || renderMode === 1) {
        if (cbase) cbase._component = null;
        base = diff(cbase, rendered, context, mountAll || !isUpdate, initialBase && initialBase.parentNode, true);
      }
    }

    if (initialBase && base !== initialBase && inst !== initialChildComponent) {
      var baseParent = initialBase.parentNode;

      if (baseParent && base !== baseParent) {
        baseParent.replaceChild(base, initialBase);

        if (!toUnmount) {
          initialBase._component = null;
          recollectNodeTree(initialBase, false);
        }
      }
    }

    if (toUnmount) {
      unmountComponent(toUnmount);
    }

    component.base = base;

    if (base && !isChild) {
      var componentRef = component,
          t = component;

      while (t = t._parentComponent) {
        (componentRef = t).base = base;
      }

      base._component = componentRef;
      base._componentConstructor = componentRef.constructor;
    }
  }

  if (!isUpdate || mountAll) {
    mounts.push(component);
  } else if (!skip) {
    if (component.componentDidUpdate) {
      component.componentDidUpdate(previousProps, previousState, snapshot);
    }

    if (options.afterUpdate) options.afterUpdate(component);
  }

  while (component._renderCallbacks.length) {
    component._renderCallbacks.pop().call(component);
  }

  if (!diffLevel && !isChild) flushMounts();
}

function buildComponentFromVNode(dom, vnode, context, mountAll) {
  var c = dom && dom._component,
      originalComponent = c,
      oldDom = dom,
      isDirectOwner = c && dom._componentConstructor === vnode.nodeName,
      isOwner = isDirectOwner,
      props = getNodeProps(vnode);

  while (c && !isOwner && (c = c._parentComponent)) {
    isOwner = c.constructor === vnode.nodeName;
  }

  if (c && isOwner && (!mountAll || c._component)) {
    setComponentProps(c, props, 3, context, mountAll);
    dom = c.base;
  } else {
    if (originalComponent && !isDirectOwner) {
      unmountComponent(originalComponent);
      dom = oldDom = null;
    }

    c = createComponent(vnode.nodeName, props, context);

    if (dom && !c.nextBase) {
      c.nextBase = dom;
      oldDom = null;
    }

    setComponentProps(c, props, 1, context, mountAll);
    dom = c.base;

    if (oldDom && dom !== oldDom) {
      oldDom._component = null;
      recollectNodeTree(oldDom, false);
    }
  }

  return dom;
}

function unmountComponent(component) {
  if (options.beforeUnmount) options.beforeUnmount(component);
  var base = component.base;
  component._disable = true;
  if (component.componentWillUnmount) component.componentWillUnmount();
  component.base = null;
  var inner = component._component;

  if (inner) {
    unmountComponent(inner);
  } else if (base) {
    if (base['__preactattr_'] != null) applyRef(base['__preactattr_'].ref, null);
    component.nextBase = base;
    removeNode(base);
    recyclerComponents.push(component);
    removeChildren(base);
  }

  applyRef(component.__ref, null);
}

function Component(props, context) {
  this._dirty = true;
  this.context = context;
  this.props = props;
  this.state = this.state || {};
  this._renderCallbacks = [];
}

extend(Component.prototype, {
  setState: function setState(state, callback) {
    if (!this.prevState) this.prevState = this.state;
    this.state = extend(extend({}, this.state), typeof state === 'function' ? state(this.state, this.props) : state);
    if (callback) this._renderCallbacks.push(callback);
    enqueueRender(this);
  },
  forceUpdate: function forceUpdate(callback) {
    if (callback) this._renderCallbacks.push(callback);
    renderComponent(this, 2);
  },
  render: function render() {}
});

function render(vnode, parent, merge) {
  return diff(merge, vnode, {}, false, parent, false);
}

function createRef() {
  return {};
}

var preact = {
  h: h,
  createElement: h,
  cloneElement: cloneElement,
  createRef: createRef,
  Component: Component,
  render: render,
  rerender: rerender,
  options: options
};
var _default = preact; //# sourceMappingURL=preact.mjs.map

exports.default = _default;
},{}],"../node_modules/preact-habitat/dist/preact-habitat.es.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _preact = _interopRequireDefault(require("preact"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Removes `-` fron a string and capetalize the letter after
 * example: data-props-hello-world =>  dataPropsHelloWorld
 * Used for props passed from host DOM element
 * @param  {String} str string
 * @return {String} Capetalized string
 */
var camelcasize = function (str) {
  return str.replace(/-([a-z])/gi, function (all, letter) {
    return letter.toUpperCase();
  });
};
/**
 * [getExecutedScript internal widget to provide the currently executed script]
 * @param  {document} document [Browser document object]
 * @return {HTMLElement}     [script Element]
 */


var getExecutedScript = function () {
  return document.currentScript || function () {
    var scripts = document.getElementsByTagName("script");
    return scripts[scripts.length - 1];
  }();
};
/**
 * Get the props from a host element's data attributes
 * @param  {Element} tag The host element
 * @return {Object}  props object to be passed to the component
 */


var collectPropsFromElement = function (element, defaultProps) {
  if (defaultProps === void 0) defaultProps = {};
  var attrs = element.attributes;
  var props = Object.assign({}, defaultProps); // collect from element

  Object.keys(attrs).forEach(function (key) {
    if (attrs.hasOwnProperty(key)) {
      var dataAttrName = attrs[key].name;

      if (!dataAttrName || typeof dataAttrName !== "string") {
        return false;
      }

      var propName = dataAttrName.split(/(data-props?-)/).pop() || '';
      propName = camelcasize(propName);

      if (dataAttrName !== propName) {
        var propValue = attrs[key].nodeValue;
        props[propName] = propValue;
      }
    }
  }); // check for child script text/props

  [].forEach.call(element.getElementsByTagName('script'), function (scrp) {
    var propsObj = {};

    if (scrp.hasAttribute('type')) {
      if (scrp.getAttribute('type') !== 'text/props') {
        return;
      }

      try {
        propsObj = JSON.parse(scrp.innerHTML);
      } catch (e) {
        throw new Error(e);
      }

      Object.assign(props, propsObj);
    }
  });
  return props;
};

var getHabitatSelectorFromClient = function (currentScript) {
  var scriptTagAttrs = currentScript.attributes;
  var selector = null; // check for another props attached to the tag

  Object.keys(scriptTagAttrs).forEach(function (key) {
    if (scriptTagAttrs.hasOwnProperty(key)) {
      var dataAttrName = scriptTagAttrs[key].name;

      if (dataAttrName === 'data-mount-in') {
        selector = scriptTagAttrs[key].nodeValue;
      }
    }
  });
  return selector;
};
/**
 * Return array of 0 or more elements that will host our widget
 * @param  {id} attrId the data widget id attribute the host should have
 * @param  {document} scope  Docuemnt object or DOM Element as a scope
 * @return {Array}        Array of matching habitats
 */


var widgetDOMHostElements = function (ref) {
  var selector = ref.selector;
  var inline = ref.inline;
  var clientSpecified = ref.clientSpecified;
  var hostNodes = [];
  var currentScript = getExecutedScript();

  if (inline === true) {
    var parentNode = currentScript.parentNode;
    hostNodes.push(parentNode);
  }

  if (clientSpecified === true && !selector) {
    // user did not specify where to mount - get it from script tag attributes
    selector = getHabitatSelectorFromClient(currentScript);
  }

  if (selector) {
    [].forEach.call(document.querySelectorAll(selector), function (queriedTag) {
      hostNodes.push(queriedTag);
    });
  }

  return hostNodes;
};
/**
 * preact render function that will be queued if the DOM is not ready
 * and executed immeidatly if DOM is ready
 */


var preactRender = function (widget, hostElements, root, cleanRoot, defaultProps) {
  hostElements.forEach(function (elm) {
    var hostNode = elm;

    if (hostNode._habitat) {
      return;
    }

    hostNode._habitat = true;
    var props = collectPropsFromElement(elm, defaultProps) || defaultProps;

    if (cleanRoot) {
      hostNode.innerHTML = "";
    }

    return _preact.default.render(_preact.default.h(widget, props), hostNode, root);
  });
};

var habitat = function (Widget) {
  // Widget represents the Preact component we need to mount
  var widget = Widget; // preact root render helper

  var root = null;

  var render = function (ref) {
    if (ref === void 0) ref = {};
    var selector = ref.selector;
    if (selector === void 0) selector = null;
    var inline = ref.inline;
    if (inline === void 0) inline = false;
    var clean = ref.clean;
    if (clean === void 0) clean = false;
    var clientSpecified = ref.clientSpecified;
    if (clientSpecified === void 0) clientSpecified = false;
    var defaultProps = ref.defaultProps;
    if (defaultProps === void 0) defaultProps = {};
    var elements = widgetDOMHostElements({
      selector: selector,
      inline: inline,
      clientSpecified: clientSpecified
    });

    var loaded = function () {
      if (elements.length > 0) {
        var elements$1 = widgetDOMHostElements({
          selector: selector,
          inline: inline,
          clientSpecified: clientSpecified
        });
        return preactRender(widget, elements$1, root, clean, defaultProps);
      }
    };

    loaded();
    document.addEventListener("DOMContentLoaded", loaded);
    document.addEventListener("load", loaded);
  };

  return {
    render: render
  };
};

var _default = habitat; //# sourceMappingURL=preact-habitat.es.js.map

exports.default = _default;
},{"preact":"../node_modules/preact/dist/preact.mjs"}],"components/toolbar.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Toolbar = void 0;

var _preact = require("preact");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Toolbar =
/*#__PURE__*/
function (_Component) {
  _inherits(Toolbar, _Component);

  function Toolbar(props) {
    var _this;

    _classCallCheck(this, Toolbar);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Toolbar).call(this, props));
    _this.deviceChange = _this.deviceChange.bind(_assertThisInitialized(_this));
    _this.zoomChange = _this.zoomChange.bind(_assertThisInitialized(_this));
    _this.state = {
      device: props.devices[0],
      deviceId: props.devices[0].id,
      zoom: 100,
      landscape: false,
      showDevice: true,
      color: " "
    };
    return _this;
  }

  _createClass(Toolbar, [{
    key: "deviceChange",
    value: function deviceChange(event) {
      var device = this.props.devices.find(function (o) {
        return o.id === parseInt(event.target.value);
      });
      this.setState({
        device: device,
        deviceId: event.target.value
      });
      this.props.updateParent('device', this.state.device.value);
      this.props.frameHeightCalc();
    }
  }, {
    key: "zoomChange",
    value: function zoomChange(z) {
      this.setState({
        zoom: parseInt(z.target.value)
      });
      this.props.updateParent('zoom', this.state.zoom);
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      this.setState({
        zoom: nextProps.zoom
      });
    }
  }, {
    key: "render",
    value: function render(props, state) {
      var _this2 = this;

      return (0, _preact.h)("header", null, (0, _preact.h)("select", {
        value: this.state.deviceId,
        onChange: this.deviceChange
      }, props.devices.map(function (device) {
        return (0, _preact.h)("option", {
          value: device.id
        }, device.name);
      })), (0, _preact.h)("div", {
        id: "deviceColors"
      }, state.device.colors.map(function (color) {
        return (0, _preact.h)("button", {
          onClick: function onClick() {
            _this2.setState({
              color: color
            });

            props.updateParent('color', color);
          },
          value: color,
          style: {
            background: color
          }
        });
      })), (0, _preact.h)("span", null, "|"), (0, _preact.h)("div", null, (0, _preact.h)("label", null, "Dimensions"), (0, _preact.h)("input", {
        type: "text",
        value: state.landscape ? state.device.height : state.device.width,
        readonly: true
      }), (0, _preact.h)("span", null, "X"), (0, _preact.h)("input", {
        type: "text",
        value: state.landscape ? state.device.width : state.device.height,
        readonly: true
      })), (0, _preact.h)("span", null, "|"), (0, _preact.h)("button", {
        className: "frameless",
        onClick: function onClick() {
          _this2.setState({
            landscape: !state.landscape
          });

          props.updateParent('landscape', _this2.state.landscape);
          props.frameHeightCalc();
        },
        title: "rotate"
      }, (0, _preact.h)("svg", {
        version: "1.1",
        width: "14px",
        height: "14px",
        viewBox: "0 0 612 612",
        xmlSpace: "preserve",
        style: {
          fill: state.landscape ? "red" : "black"
        },
        xmlns: "http://www.w3.org/2000/svg"
      }, (0, _preact.h)("path", {
        d: "m419.48 63.75c84.15 38.25 142.8 119.85 153 216.75h38.25c-15.3-158.1-145.35-280.5-306-280.5h-17.85l96.9 96.9 35.7-33.15zm-160.65-20.4c-15.3-15.3-38.25-15.3-53.55 0l-163.2 163.2c-15.3 15.3-15.3 38.25 0 53.55l306 306c15.301 15.301 38.25 15.301 53.551 0l163.2-163.2c15.301-15.301 15.301-38.25 0-53.551l-306-306zm117.3 497.25-306-306 163.2-163.2 306 306-163.2 163.2zm-186.15 7.65c-84.15-38.25-142.8-119.85-153-216.75h-35.7c12.75 158.1 142.8 280.5 303.45 280.5h17.85l-96.899-96.9-35.701 33.15z"
      }))), (0, _preact.h)("span", null, "|"), (0, _preact.h)("button", {
        className: "frameless",
        onClick: function onClick() {
          _this2.setState({
            showDevice: !state.showDevice
          });

          props.updateParent('showDevice', _this2.state.showDevice);
          props.frameHeightCalc();
        },
        title: "toggle frames"
      }, (0, _preact.h)("svg", {
        version: "1.1",
        width: "20px",
        height: "14px",
        viewBox: "0 0 480.1 480.1",
        xmlSpace: "preserve",
        style: {
          fill: state.showDevice ? "red" : "black"
        },
        xmlns: "http://www.w3.org/2000/svg"
      }, (0, _preact.h)("path", {
        d: "m206.76 332.99h-167.53c-3.894 0-7.065-3.173-7.065-7.067v-272.57c0-3.893 3.172-7.065 7.065-7.065h401.63c3.895 0 7.065 3.172 7.065 7.065v59.696c11.763 1.389 22.785 5.244 32.159 11.581v-71.277c0-21.63-17.602-39.225-39.225-39.225h-401.63c-21.623 0-39.225 17.594-39.225 39.225v272.57c0 21.631 17.602 39.227 39.225 39.227h134.62v52.581h-21.229c-13.316 0-24.12 10.796-24.12 24.12s10.804 24.12 24.12 24.12h67.71c-8.463-11.902-13.566-26.35-13.566-42.037v-90.943z"
      }), (0, _preact.h)("path", {
        d: "m341.74 441.64v-34.742h-70.662v-221.9c0-4.681 3.8-8.489 8.479-8.489h159.89c4.679 0 8.478 3.808 8.478 8.489v68.676h12.046c7.364 0 14.179 2.127 20.113 5.597v-74.273c0-22.417-18.23-40.648-40.638-40.648h-159.89c-22.407 0-40.638 18.231-40.638 40.648v238.93c0 22.417 18.23 40.647 40.638 40.647h69.438c-4.428-6.359-7.255-15.22-7.255-22.934z"
      }), (0, _preact.h)("path", {
        d: "m459.97 273.78h-77.996c-11.104 0-20.132 9.037-20.132 20.138v147.73c0 11.101 9.028 20.131 20.132 20.131h77.996c11.102 0 20.13-9.03 20.13-20.131v-147.73c0-11.101-9.029-20.137-20.13-20.137zm-74.009 24.119h70.019v127.7h-70.019v-127.7zm35.019 154.1c-2.215 0-4.193-0.896-5.7-2.277-1.713-1.555-2.812-3.739-2.812-6.228 0-4.694 3.801-8.495 8.512-8.495 4.679 0 8.479 3.801 8.479 8.495 0 2.489-1.1 4.672-2.795 6.228-1.509 1.382-3.487 2.277-5.684 2.277z"
      }))), (0, _preact.h)("span", null, "|"), (0, _preact.h)("select", {
        id: "zoomLevel",
        value: state.zoom,
        onChange: this.zoomChange
      }, (0, _preact.h)("option", {
        value: props.fitOption
      }, "Fit to window ", props.fitOption, " %"), (0, _preact.h)("option", {
        value: "50"
      }, "50%"), (0, _preact.h)("option", {
        value: "75"
      }, "75%"), (0, _preact.h)("option", {
        value: "100"
      }, "100%"), (0, _preact.h)("option", {
        value: "125"
      }, "125%"), (0, _preact.h)("option", {
        value: "150"
      }, "150%")));
    }
  }]);

  return Toolbar;
}(_preact.Component);

exports.Toolbar = Toolbar;
},{"preact":"../node_modules/preact/dist/preact.mjs"}],"../../../../../../usr/local/lib/node_modules/parcel-bundler/node_modules/process/browser.js":[function(require,module,exports) {

// shim for using process in browser
var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}

function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}

(function () {
  try {
    if (typeof setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }

  try {
    if (typeof clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();

function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  } // if setTimeout wasn't available but was latter defined


  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}

function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  } // if clearTimeout wasn't available but was latter defined


  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}

var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }

  draining = false;

  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }

  if (queue.length) {
    drainQueue();
  }
}

function drainQueue() {
  if (draining) {
    return;
  }

  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;

  while (len) {
    currentQueue = queue;
    queue = [];

    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }

    queueIndex = -1;
    len = queue.length;
  }

  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}

process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);

  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }

  queue.push(new Item(fun, args));

  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
}; // v8 likes predictible objects


function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}

Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};

process.title = 'browser';
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
  return [];
};

process.binding = function (name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function () {
  return '/';
};

process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};

process.umask = function () {
  return 0;
};
},{}],"../node_modules/performance-now/lib/performance-now.js":[function(require,module,exports) {
var process = require("process");
// Generated by CoffeeScript 1.12.2
(function() {
  var getNanoSeconds, hrtime, loadTime, moduleLoadTime, nodeLoadTime, upTime;

  if ((typeof performance !== "undefined" && performance !== null) && performance.now) {
    module.exports = function() {
      return performance.now();
    };
  } else if ((typeof process !== "undefined" && process !== null) && process.hrtime) {
    module.exports = function() {
      return (getNanoSeconds() - nodeLoadTime) / 1e6;
    };
    hrtime = process.hrtime;
    getNanoSeconds = function() {
      var hr;
      hr = hrtime();
      return hr[0] * 1e9 + hr[1];
    };
    moduleLoadTime = getNanoSeconds();
    upTime = process.uptime() * 1e9;
    nodeLoadTime = moduleLoadTime - upTime;
  } else if (Date.now) {
    module.exports = function() {
      return Date.now() - loadTime;
    };
    loadTime = Date.now();
  } else {
    module.exports = function() {
      return new Date().getTime() - loadTime;
    };
    loadTime = new Date().getTime();
  }

}).call(this);

//# sourceMappingURL=performance-now.js.map

},{"process":"../../../../../../usr/local/lib/node_modules/parcel-bundler/node_modules/process/browser.js"}],"../node_modules/raf/index.js":[function(require,module,exports) {
var global = arguments[3];
var now = require('performance-now')
  , root = typeof window === 'undefined' ? global : window
  , vendors = ['moz', 'webkit']
  , suffix = 'AnimationFrame'
  , raf = root['request' + suffix]
  , caf = root['cancel' + suffix] || root['cancelRequest' + suffix]

for(var i = 0; !raf && i < vendors.length; i++) {
  raf = root[vendors[i] + 'Request' + suffix]
  caf = root[vendors[i] + 'Cancel' + suffix]
      || root[vendors[i] + 'CancelRequest' + suffix]
}

// Some versions of FF have rAF but not cAF
if(!raf || !caf) {
  var last = 0
    , id = 0
    , queue = []
    , frameDuration = 1000 / 60

  raf = function(callback) {
    if(queue.length === 0) {
      var _now = now()
        , next = Math.max(0, frameDuration - (_now - last))
      last = next + _now
      setTimeout(function() {
        var cp = queue.slice(0)
        // Clear queue here to prevent
        // callbacks from appending listeners
        // to the current frame's queue
        queue.length = 0
        for(var i = 0; i < cp.length; i++) {
          if(!cp[i].cancelled) {
            try{
              cp[i].callback(last)
            } catch(e) {
              setTimeout(function() { throw e }, 0)
            }
          }
        }
      }, Math.round(next))
    }
    queue.push({
      handle: ++id,
      callback: callback,
      cancelled: false
    })
    return id
  }

  caf = function(handle) {
    for(var i = 0; i < queue.length; i++) {
      if(queue[i].handle === handle) {
        queue[i].cancelled = true
      }
    }
  }
}

module.exports = function(fn) {
  // Wrap in a new function to prevent
  // `cancel` potentially being assigned
  // to the native rAF function
  return raf.call(root, fn)
}
module.exports.cancel = function() {
  caf.apply(root, arguments)
}
module.exports.polyfill = function(object) {
  if (!object) {
    object = root;
  }
  object.requestAnimationFrame = raf
  object.cancelAnimationFrame = caf
}

},{"performance-now":"../node_modules/performance-now/lib/performance-now.js"}],"../node_modules/prefix-style/index.js":[function(require,module,exports) {
var div = null
var prefixes = [ 'Webkit', 'Moz', 'O', 'ms' ]

module.exports = function prefixStyle (prop) {
  // re-use a dummy div
  if (!div) {
    div = document.createElement('div')
  }

  var style = div.style

  // prop exists without prefix
  if (prop in style) {
    return prop
  }

  // borderRadius -> BorderRadius
  var titleCase = prop.charAt(0).toUpperCase() + prop.slice(1)

  // find the vendor-prefixed prop
  for (var i = prefixes.length; i >= 0; i--) {
    var name = prefixes[i] + titleCase
    // e.g. WebkitBorderRadius or webkitBorderRadius
    if (name in style) {
      return name
    }
  }

  return false
}

},{}],"../node_modules/to-no-case/index.js":[function(require,module,exports) {

/**
 * Export.
 */

module.exports = toNoCase

/**
 * Test whether a string is camel-case.
 */

var hasSpace = /\s/
var hasSeparator = /(_|-|\.|:)/
var hasCamel = /([a-z][A-Z]|[A-Z][a-z])/

/**
 * Remove any starting case from a `string`, like camel or snake, but keep
 * spaces and punctuation that may be important otherwise.
 *
 * @param {String} string
 * @return {String}
 */

function toNoCase(string) {
  if (hasSpace.test(string)) return string.toLowerCase()
  if (hasSeparator.test(string)) return (unseparate(string) || string).toLowerCase()
  if (hasCamel.test(string)) return uncamelize(string).toLowerCase()
  return string.toLowerCase()
}

/**
 * Separator splitter.
 */

var separatorSplitter = /[\W_]+(.|$)/g

/**
 * Un-separate a `string`.
 *
 * @param {String} string
 * @return {String}
 */

function unseparate(string) {
  return string.replace(separatorSplitter, function (m, next) {
    return next ? ' ' + next : ''
  })
}

/**
 * Camelcase splitter.
 */

var camelSplitter = /(.)([A-Z]+)/g

/**
 * Un-camelcase a `string`.
 *
 * @param {String} string
 * @return {String}
 */

function uncamelize(string) {
  return string.replace(camelSplitter, function (m, previous, uppers) {
    return previous + ' ' + uppers.toLowerCase().split('').join(' ')
  })
}

},{}],"../node_modules/to-space-case/index.js":[function(require,module,exports) {

var clean = require('to-no-case')

/**
 * Export.
 */

module.exports = toSpaceCase

/**
 * Convert a `string` to space case.
 *
 * @param {String} string
 * @return {String}
 */

function toSpaceCase(string) {
  return clean(string).replace(/[\W_]+(.|$)/g, function (matches, match) {
    return match ? ' ' + match : ''
  }).trim()
}

},{"to-no-case":"../node_modules/to-no-case/index.js"}],"../node_modules/to-camel-case/index.js":[function(require,module,exports) {

var space = require('to-space-case')

/**
 * Export.
 */

module.exports = toCamelCase

/**
 * Convert a `string` to camel case.
 *
 * @param {String} string
 * @return {String}
 */

function toCamelCase(string) {
  return space(string).replace(/\s(\w)/g, function (matches, letter) {
    return letter.toUpperCase()
  })
}

},{"to-space-case":"../node_modules/to-space-case/index.js"}],"../node_modules/add-px-to-style/index.js":[function(require,module,exports) {
/* The following list is defined in React's core */
var IS_UNITLESS = {
  animationIterationCount: true,
  boxFlex: true,
  boxFlexGroup: true,
  boxOrdinalGroup: true,
  columnCount: true,
  flex: true,
  flexGrow: true,
  flexPositive: true,
  flexShrink: true,
  flexNegative: true,
  flexOrder: true,
  gridRow: true,
  gridColumn: true,
  fontWeight: true,
  lineClamp: true,
  lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  tabSize: true,
  widows: true,
  zIndex: true,
  zoom: true,

  // SVG-related properties
  fillOpacity: true,
  stopOpacity: true,
  strokeDashoffset: true,
  strokeOpacity: true,
  strokeWidth: true
};

module.exports = function(name, value) {
  if(typeof value === 'number' && !IS_UNITLESS[ name ]) {
    return value + 'px';
  } else {
    return value;
  }
};
},{}],"../node_modules/dom-css/index.js":[function(require,module,exports) {
var prefix = require('prefix-style')
var toCamelCase = require('to-camel-case')
var cache = { 'float': 'cssFloat' }
var addPxToStyle = require('add-px-to-style')

function style (element, property, value) {
  var camel = cache[property]
  if (typeof camel === 'undefined') {
    camel = detect(property)
  }

  // may be false if CSS prop is unsupported
  if (camel) {
    if (value === undefined) {
      return element.style[camel]
    }

    element.style[camel] = addPxToStyle(camel, value)
  }
}

function each (element, properties) {
  for (var k in properties) {
    if (properties.hasOwnProperty(k)) {
      style(element, k, properties[k])
    }
  }
}

function detect (cssProp) {
  var camel = toCamelCase(cssProp)
  var result = prefix(camel)
  cache[camel] = cache[cssProp] = cache[result] = result
  return result
}

function set () {
  if (arguments.length === 2) {
    if (typeof arguments[1] === 'string') {
      arguments[0].style.cssText = arguments[1]
    } else {
      each(arguments[0], arguments[1])
    }
  } else {
    style(arguments[0], arguments[1], arguments[2])
  }
}

module.exports = set
module.exports.set = set

module.exports.get = function (element, properties) {
  if (Array.isArray(properties)) {
    return properties.reduce(function (obj, prop) {
      obj[prop] = style(element, prop || '')
      return obj
    }, {})
  } else {
    return style(element, properties || '')
  }
}

},{"prefix-style":"../node_modules/prefix-style/index.js","to-camel-case":"../node_modules/to-camel-case/index.js","add-px-to-style":"../node_modules/add-px-to-style/index.js"}],"../node_modules/preact-custom-scrollbars/lib/utils/isString.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = isString;
function isString(maybe) {
  return typeof maybe === 'string';
}
},{}],"../node_modules/preact-custom-scrollbars/lib/utils/getScrollbarWidth.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = getScrollbarWidth;

var _domCss = require('dom-css');

var _domCss2 = _interopRequireDefault(_domCss);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var scrollbarWidth = false;

function getScrollbarWidth() {
  if (scrollbarWidth !== false) return scrollbarWidth;
  /* istanbul ignore else */
  if (typeof document !== 'undefined') {
    var div = document.createElement('div');
    (0, _domCss2["default"])(div, {
      width: 100,
      height: 100,
      position: 'absolute',
      top: -9999,
      overflow: 'scroll',
      MsOverflowStyle: 'scrollbar'
    });
    document.body.appendChild(div);
    scrollbarWidth = div.offsetWidth - div.clientWidth;
    document.body.removeChild(div);
  } else {
    scrollbarWidth = 0;
  }
  return scrollbarWidth || 0;
}
},{"dom-css":"../node_modules/dom-css/index.js"}],"../node_modules/preact-custom-scrollbars/lib/utils/returnFalse.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = returnFalse;
function returnFalse() {
  return false;
}
},{}],"../node_modules/preact-custom-scrollbars/lib/utils/getInnerWidth.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = getInnerWidth;
function getInnerWidth(el) {
  var clientWidth = el.clientWidth;

  var _window$getComputedSt = window.getComputedStyle(el),
      paddingLeft = _window$getComputedSt.paddingLeft,
      paddingRight = _window$getComputedSt.paddingRight;

  return clientWidth - parseFloat(paddingLeft) - parseFloat(paddingRight);
}
},{}],"../node_modules/preact-custom-scrollbars/lib/utils/getInnerHeight.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = getInnerHeight;
function getInnerHeight(el) {
  var clientHeight = el.clientHeight;

  var _window$getComputedSt = window.getComputedStyle(el),
      paddingTop = _window$getComputedSt.paddingTop,
      paddingBottom = _window$getComputedSt.paddingBottom;

  return clientHeight - parseFloat(paddingTop) - parseFloat(paddingBottom);
}
},{}],"../node_modules/preact-custom-scrollbars/lib/Scrollbars/styles.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var containerStyleDefault = exports.containerStyleDefault = {
  position: 'relative',
  overflow: 'hidden',
  width: '100%',
  height: '100%'
};

// Overrides containerStyleDefault properties
var containerStyleAutoHeight = exports.containerStyleAutoHeight = {
  height: 'auto'
};

var viewStyleDefault = exports.viewStyleDefault = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  overflow: 'scroll',
  WebkitOverflowScrolling: 'touch'
};

// Overrides viewStyleDefault properties
var viewStyleAutoHeight = exports.viewStyleAutoHeight = {
  position: 'relative',
  top: undefined,
  left: undefined,
  right: undefined,
  bottom: undefined
};

var viewStyleUniversalInitial = exports.viewStyleUniversalInitial = {
  overflow: 'hidden',
  marginRight: 0,
  marginBottom: 0
};

var trackHorizontalStyleDefault = exports.trackHorizontalStyleDefault = {
  position: 'absolute',
  height: 6
};

var trackVerticalStyleDefault = exports.trackVerticalStyleDefault = {
  position: 'absolute',
  width: 6
};

var thumbHorizontalStyleDefault = exports.thumbHorizontalStyleDefault = {
  position: 'relative',
  display: 'block',
  height: '100%'
};

var thumbVerticalStyleDefault = exports.thumbVerticalStyleDefault = {
  position: 'relative',
  display: 'block',
  width: '100%'
};

var disableSelectStyle = exports.disableSelectStyle = {
  userSelect: 'none'
};

var disableSelectStyleReset = exports.disableSelectStyleReset = {
  userSelect: ''
};
},{}],"../node_modules/preact-custom-scrollbars/lib/Scrollbars/defaultRenderElements.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.renderViewDefault = renderViewDefault;
exports.renderTrackHorizontalDefault = renderTrackHorizontalDefault;
exports.renderTrackVerticalDefault = renderTrackVerticalDefault;
exports.renderThumbHorizontalDefault = renderThumbHorizontalDefault;
exports.renderThumbVerticalDefault = renderThumbVerticalDefault;

var _preact = require('preact');

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function renderViewDefault(props) {
  return (0, _preact.h)('div', props);
}

function renderTrackHorizontalDefault(_ref) {
  var style = _ref.style,
      props = _objectWithoutProperties(_ref, ['style']);

  var finalStyle = _extends({}, style, {
    right: 2,
    bottom: 2,
    left: 2,
    borderRadius: 3
  });
  return (0, _preact.h)('div', _extends({ style: finalStyle }, props));
}

function renderTrackVerticalDefault(_ref2) {
  var style = _ref2.style,
      props = _objectWithoutProperties(_ref2, ['style']);

  var finalStyle = _extends({}, style, {
    right: 2,
    bottom: 2,
    top: 2,
    borderRadius: 3
  });
  return (0, _preact.h)('div', _extends({ style: finalStyle }, props));
}

function renderThumbHorizontalDefault(_ref3) {
  var style = _ref3.style,
      props = _objectWithoutProperties(_ref3, ['style']);

  var finalStyle = _extends({}, style, {
    cursor: 'pointer',
    borderRadius: 'inherit',
    backgroundColor: 'rgba(0,0,0,.2)'
  });
  return (0, _preact.h)('div', _extends({ style: finalStyle }, props));
}

function renderThumbVerticalDefault(_ref4) {
  var style = _ref4.style,
      props = _objectWithoutProperties(_ref4, ['style']);

  var finalStyle = _extends({}, style, {
    cursor: 'pointer',
    borderRadius: 'inherit',
    backgroundColor: 'rgba(0,0,0,.2)'
  });
  return (0, _preact.h)('div', _extends({ style: finalStyle }, props));
}
},{"preact":"../node_modules/preact/dist/preact.mjs"}],"../node_modules/preact-custom-scrollbars/lib/Scrollbars/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _raf = require('raf');

var _raf2 = _interopRequireDefault(_raf);

var _domCss = require('dom-css');

var _domCss2 = _interopRequireDefault(_domCss);

var _preact = require('preact');

var _isString = require('../utils/isString');

var _isString2 = _interopRequireDefault(_isString);

var _getScrollbarWidth = require('../utils/getScrollbarWidth');

var _getScrollbarWidth2 = _interopRequireDefault(_getScrollbarWidth);

var _returnFalse = require('../utils/returnFalse');

var _returnFalse2 = _interopRequireDefault(_returnFalse);

var _getInnerWidth = require('../utils/getInnerWidth');

var _getInnerWidth2 = _interopRequireDefault(_getInnerWidth);

var _getInnerHeight = require('../utils/getInnerHeight');

var _getInnerHeight2 = _interopRequireDefault(_getInnerHeight);

var _styles = require('./styles');

var _defaultRenderElements = require('./defaultRenderElements');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Scrollbars = function (_Component) {
  _inherits(Scrollbars, _Component);

  function Scrollbars() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Scrollbars);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Scrollbars.__proto__ || Object.getPrototypeOf(Scrollbars)).call.apply(_ref, [this].concat(args))), _this), _this.refs = {}, _this.state = {
      didMountUniversal: false
    }, _this.componentDidMount = function () {
      _this.addListeners();
      _this.update();
      _this.componentDidMountUniversal();
    }, _this.componentDidUpdate = function () {
      _this.update();
    }, _this.componentWillUnmount = function () {
      _this.unsetDomStyles();
      _this.removeListeners();
      (0, _raf.cancel)(_this.requestFrame);
      clearTimeout(_this.hideTracksTimeout);
      clearInterval(_this.detectScrollingInterval);
    }, _this.getScrollLeft = function () {
      var view = _this.refs.view;

      return view.scrollLeft;
    }, _this.getScrollTop = function () {
      var view = _this.refs.view;

      return view.scrollTop;
    }, _this.getScrollWidth = function () {
      var view = _this.refs.view;

      return view.scrollWidth;
    }, _this.getScrollHeight = function () {
      var view = _this.refs.view;

      return view.scrollHeight;
    }, _this.getClientWidth = function () {
      var view = _this.refs.view;

      return view.clientWidth;
    }, _this.getClientHeight = function () {
      var view = _this.refs.view;

      return view.clientHeight;
    }, _this.getValues = function () {
      var view = _this.refs.view;
      var scrollLeft = view.scrollLeft,
          scrollTop = view.scrollTop,
          scrollWidth = view.scrollWidth,
          scrollHeight = view.scrollHeight,
          clientWidth = view.clientWidth,
          clientHeight = view.clientHeight;


      return {
        left: scrollLeft / (scrollWidth - clientWidth) || 0,
        top: scrollTop / (scrollHeight - clientHeight) || 0,
        scrollLeft: scrollLeft,
        scrollTop: scrollTop,
        scrollWidth: scrollWidth,
        scrollHeight: scrollHeight,
        clientWidth: clientWidth,
        clientHeight: clientHeight
      };
    }, _this.getThumbHorizontalWidth = function () {
      var _this$props = _this.props,
          thumbSize = _this$props.thumbSize,
          thumbMinSize = _this$props.thumbMinSize;
      var _this$refs = _this.refs,
          view = _this$refs.view,
          trackHorizontal = _this$refs.trackHorizontal;
      var scrollWidth = view.scrollWidth,
          clientWidth = view.clientWidth;

      var trackWidth = (0, _getInnerWidth2["default"])(trackHorizontal);
      var width = Math.ceil(clientWidth / scrollWidth * trackWidth);
      if (trackWidth === width) return 0;
      if (thumbSize) return thumbSize;
      return Math.max(width, thumbMinSize);
    }, _this.getThumbVerticalHeight = function () {
      var _this$props2 = _this.props,
          thumbSize = _this$props2.thumbSize,
          thumbMinSize = _this$props2.thumbMinSize;
      var _this$refs2 = _this.refs,
          view = _this$refs2.view,
          trackVertical = _this$refs2.trackVertical;
      var scrollHeight = view.scrollHeight,
          clientHeight = view.clientHeight;

      var trackHeight = (0, _getInnerHeight2["default"])(trackVertical);
      var height = Math.ceil(clientHeight / scrollHeight * trackHeight);
      if (trackHeight === height) return 0;
      if (thumbSize) return thumbSize;
      return Math.max(height, thumbMinSize);
    }, _this.getScrollLeftForOffset = function (offset) {
      var _this$refs3 = _this.refs,
          view = _this$refs3.view,
          trackHorizontal = _this$refs3.trackHorizontal;
      var scrollWidth = view.scrollWidth,
          clientWidth = view.clientWidth;

      var trackWidth = (0, _getInnerWidth2["default"])(trackHorizontal);
      var thumbWidth = _this.getThumbHorizontalWidth();
      return offset / (trackWidth - thumbWidth) * (scrollWidth - clientWidth);
    }, _this.getScrollTopForOffset = function (offset) {
      var _this$refs4 = _this.refs,
          view = _this$refs4.view,
          trackVertical = _this$refs4.trackVertical;
      var scrollHeight = view.scrollHeight,
          clientHeight = view.clientHeight;

      var trackHeight = (0, _getInnerHeight2["default"])(trackVertical);
      var thumbHeight = _this.getThumbVerticalHeight();
      return offset / (trackHeight - thumbHeight) * (scrollHeight - clientHeight);
    }, _this.scrollLeft = function () {
      var left = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var view = _this.refs.view;

      view.scrollLeft = left;
    }, _this.scrollTop = function () {
      var top = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var view = _this.refs.view;

      view.scrollTop = top;
    }, _this.scrollToLeft = function () {
      var view = _this.refs.view;

      view.scrollLeft = 0;
    }, _this.scrollToTop = function () {
      var view = _this.refs.view;

      view.scrollTop = 0;
    }, _this.scrollToRight = function () {
      var view = _this.refs.view;

      view.scrollLeft = view.scrollWidth;
    }, _this.scrollToBottom = function () {
      var view = _this.refs.view;

      view.scrollTop = view.scrollHeight;
    }, _this.addListeners = function () {
      /* istanbul ignore if */
      if (typeof document === 'undefined') return;
      var _this$refs5 = _this.refs,
          view = _this$refs5.view,
          trackHorizontal = _this$refs5.trackHorizontal,
          trackVertical = _this$refs5.trackVertical,
          thumbHorizontal = _this$refs5.thumbHorizontal,
          thumbVertical = _this$refs5.thumbVertical;

      view.addEventListener('scroll', _this.handleScroll);
      if (!(0, _getScrollbarWidth2["default"])()) return;
      trackHorizontal.addEventListener('mouseenter', _this.handleTrackMouseEnter);
      trackHorizontal.addEventListener('mouseleave', _this.handleTrackMouseLeave);
      trackHorizontal.addEventListener('mousedown', _this.handleHorizontalTrackMouseDown);
      trackVertical.addEventListener('mouseenter', _this.handleTrackMouseEnter);
      trackVertical.addEventListener('mouseleave', _this.handleTrackMouseLeave);
      trackVertical.addEventListener('mousedown', _this.handleVerticalTrackMouseDown);
      thumbHorizontal.addEventListener('mousedown', _this.handleHorizontalThumbMouseDown);
      thumbVertical.addEventListener('mousedown', _this.handleVerticalThumbMouseDown);
      window.addEventListener('resize', _this.handleWindowResize);
    }, _this.removeListeners = function () {
      /* istanbul ignore if */
      if (typeof document === 'undefined') return;
      var _this$refs6 = _this.refs,
          view = _this$refs6.view,
          trackHorizontal = _this$refs6.trackHorizontal,
          trackVertical = _this$refs6.trackVertical,
          thumbHorizontal = _this$refs6.thumbHorizontal,
          thumbVertical = _this$refs6.thumbVertical;

      view.removeEventListener('scroll', _this.handleScroll);
      if (!(0, _getScrollbarWidth2["default"])()) return;
      trackHorizontal.removeEventListener('mouseenter', _this.handleTrackMouseEnter);
      trackHorizontal.removeEventListener('mouseleave', _this.handleTrackMouseLeave);
      trackHorizontal.removeEventListener('mousedown', _this.handleHorizontalTrackMouseDown);
      trackVertical.removeEventListener('mouseenter', _this.handleTrackMouseEnter);
      trackVertical.removeEventListener('mouseleave', _this.handleTrackMouseLeave);
      trackVertical.removeEventListener('mousedown', _this.handleVerticalTrackMouseDown);
      thumbHorizontal.removeEventListener('mousedown', _this.handleHorizontalThumbMouseDown);
      thumbVertical.removeEventListener('mousedown', _this.handleVerticalThumbMouseDown);
      window.removeEventListener('resize', _this.handleWindowResize);
      // Possibly setup by `handleDragStart`
      _this.teardownDragging();
    }, _this.handleScroll = function (event) {
      var _this$props3 = _this.props,
          onScroll = _this$props3.onScroll,
          onScrollFrame = _this$props3.onScrollFrame;

      if (onScroll) onScroll(event);
      _this.update(function (values) {
        var scrollLeft = values.scrollLeft,
            scrollTop = values.scrollTop;

        _this.viewScrollLeft = scrollLeft;
        _this.viewScrollTop = scrollTop;
        if (onScrollFrame) onScrollFrame(values);
      });
      _this.detectScrolling();
    }, _this.handleScrollStart = function () {
      var onScrollStart = _this.props.onScrollStart;

      if (onScrollStart) onScrollStart();
      _this.handleScrollStartAutoHide();
    }, _this.handleScrollStartAutoHide = function () {
      var autoHide = _this.props.autoHide;

      if (!autoHide) return;
      _this.showTracks();
    }, _this.handleScrollStop = function () {
      var onScrollStop = _this.props.onScrollStop;

      if (onScrollStop) onScrollStop();
      _this.handleScrollStopAutoHide();
    }, _this.handleScrollStopAutoHide = function () {
      var autoHide = _this.props.autoHide;

      if (!autoHide) return;
      _this.hideTracks();
    }, _this.handleWindowResize = function () {
      _this.update();
    }, _this.handleHorizontalTrackMouseDown = function (event) {
      event.preventDefault();
      var view = _this.refs.view;
      var target = event.target,
          clientX = event.clientX;

      var _target$getBoundingCl = target.getBoundingClientRect(),
          targetLeft = _target$getBoundingCl.left;

      var thumbWidth = _this.getThumbHorizontalWidth();
      var offset = Math.abs(targetLeft - clientX) - thumbWidth / 2;
      view.scrollLeft = _this.getScrollLeftForOffset(offset);
    }, _this.handleVerticalTrackMouseDown = function (event) {
      event.preventDefault();
      var view = _this.refs.view;
      var target = event.target,
          clientY = event.clientY;

      var _target$getBoundingCl2 = target.getBoundingClientRect(),
          targetTop = _target$getBoundingCl2.top;

      var thumbHeight = _this.getThumbVerticalHeight();
      var offset = Math.abs(targetTop - clientY) - thumbHeight / 2;
      view.scrollTop = _this.getScrollTopForOffset(offset);
    }, _this.handleHorizontalThumbMouseDown = function (event) {
      event.preventDefault();
      _this.handleDragStart(event);
      var target = event.target,
          clientX = event.clientX;
      var offsetWidth = target.offsetWidth;

      var _target$getBoundingCl3 = target.getBoundingClientRect(),
          left = _target$getBoundingCl3.left;

      _this.prevPageX = offsetWidth - (clientX - left);
    }, _this.handleVerticalThumbMouseDown = function (event) {
      event.preventDefault();
      _this.handleDragStart(event);
      var target = event.target,
          clientY = event.clientY;
      var offsetHeight = target.offsetHeight;

      var _target$getBoundingCl4 = target.getBoundingClientRect(),
          top = _target$getBoundingCl4.top;

      _this.prevPageY = offsetHeight - (clientY - top);
    }, _this.setupDragging = function () {
      (0, _domCss2["default"])(document.body, _styles.disableSelectStyle);
      document.addEventListener('mousemove', _this.handleDrag);
      document.addEventListener('mouseup', _this.handleDragEnd);
      document.onselectstart = _returnFalse2["default"];
    }, _this.teardownDragging = function () {
      (0, _domCss2["default"])(document.body, _styles.disableSelectStyleReset);
      document.removeEventListener('mousemove', _this.handleDrag);
      document.removeEventListener('mouseup', _this.handleDragEnd);
      document.onselectstart = undefined;
    }, _this.handleDragStart = function (event) {
      _this.dragging = true;
      event.stopImmediatePropagation();
      _this.setupDragging();
    }, _this.handleDrag = function (event) {
      if (_this.prevPageX) {
        var clientX = event.clientX;
        var _this$refs7 = _this.refs,
            view = _this$refs7.view,
            trackHorizontal = _this$refs7.trackHorizontal;

        var _trackHorizontal$getB = trackHorizontal.getBoundingClientRect(),
            trackLeft = _trackHorizontal$getB.left;

        var thumbWidth = _this.getThumbHorizontalWidth();
        var clickPosition = thumbWidth - _this.prevPageX;
        var offset = -trackLeft + clientX - clickPosition;
        view.scrollLeft = _this.getScrollLeftForOffset(offset);
      }
      if (_this.prevPageY) {
        var clientY = event.clientY;
        var _this$refs8 = _this.refs,
            _view = _this$refs8.view,
            trackVertical = _this$refs8.trackVertical;

        var _trackVertical$getBou = trackVertical.getBoundingClientRect(),
            trackTop = _trackVertical$getBou.top;

        var thumbHeight = _this.getThumbVerticalHeight();
        var _clickPosition = thumbHeight - _this.prevPageY;
        var _offset = -trackTop + clientY - _clickPosition;
        _view.scrollTop = _this.getScrollTopForOffset(_offset);
      }
      return false;
    }, _this.handleDragEnd = function () {
      _this.dragging = false;
      _this.prevPageX = _this.prevPageY = 0;
      _this.teardownDragging();
      _this.handleDragEndAutoHide();
    }, _this.handleDragEndAutoHide = function () {
      var autoHide = _this.props.autoHide;

      if (!autoHide) return;
      _this.hideTracks();
    }, _this.handleTrackMouseEnter = function () {
      _this.trackMouseOver = true;
      _this.handleTrackMouseEnterAutoHide();
    }, _this.handleTrackMouseEnterAutoHide = function () {
      var autoHide = _this.props.autoHide;

      if (!autoHide) return;
      _this.showTracks();
    }, _this.handleTrackMouseLeave = function () {
      _this.trackMouseOver = false;
      _this.handleTrackMouseLeaveAutoHide();
    }, _this.handleTrackMouseLeaveAutoHide = function () {
      var autoHide = _this.props.autoHide;

      if (!autoHide) return;
      _this.hideTracks();
    }, _this.showTracks = function () {
      var _this$refs9 = _this.refs,
          trackHorizontal = _this$refs9.trackHorizontal,
          trackVertical = _this$refs9.trackVertical;

      clearTimeout(_this.hideTracksTimeout);
      (0, _domCss2["default"])(trackHorizontal, { opacity: 1 });
      (0, _domCss2["default"])(trackVertical, { opacity: 1 });
    }, _this.hideTracks = function () {
      if (_this.dragging) return;
      if (_this.scrolling) return;
      if (_this.trackMouseOver) return;
      var autoHideTimeout = _this.props.autoHideTimeout;
      var _this$refs10 = _this.refs,
          trackHorizontal = _this$refs10.trackHorizontal,
          trackVertical = _this$refs10.trackVertical;

      clearTimeout(_this.hideTracksTimeout);
      _this.hideTracksTimeout = setTimeout(function () {
        (0, _domCss2["default"])(trackHorizontal, { opacity: 0 });
        (0, _domCss2["default"])(trackVertical, { opacity: 0 });
      }, autoHideTimeout);
    }, _this.detectScrolling = function () {
      if (_this.scrolling) return;
      _this.scrolling = true;
      _this.handleScrollStart();
      _this.detectScrollingInterval = setInterval(function () {
        if (_this.lastViewScrollLeft === _this.viewScrollLeft && _this.lastViewScrollTop === _this.viewScrollTop) {
          clearInterval(_this.detectScrollingInterval);
          _this.scrolling = false;
          _this.handleScrollStop();
        }
        _this.lastViewScrollLeft = _this.viewScrollLeft;
        _this.lastViewScrollTop = _this.viewScrollTop;
      }, 100);
    }, _this.raf = function (callback) {
      if (_this.requestFrame) _raf2["default"].cancel(_this.requestFrame);
      _this.requestFrame = (0, _raf2["default"])(function () {
        _this.requestFrame = undefined;
        callback();
      });
    }, _this.update = function (callback) {
      _this.raf(function () {
        return _this._update(callback);
      });
    }, _this._update = function (callback) {
      var _this$props4 = _this.props,
          onUpdate = _this$props4.onUpdate,
          hideTracksWhenNotNeeded = _this$props4.hideTracksWhenNotNeeded;

      var values = _this.getValues();
      if ((0, _getScrollbarWidth2["default"])()) {
        var _this$refs11 = _this.refs,
            thumbHorizontal = _this$refs11.thumbHorizontal,
            thumbVertical = _this$refs11.thumbVertical,
            trackHorizontal = _this$refs11.trackHorizontal,
            trackVertical = _this$refs11.trackVertical;
        var scrollLeft = values.scrollLeft,
            clientWidth = values.clientWidth,
            scrollWidth = values.scrollWidth;

        var trackHorizontalWidth = (0, _getInnerWidth2["default"])(trackHorizontal);
        var thumbHorizontalWidth = _this.getThumbHorizontalWidth();
        var thumbHorizontalX = scrollLeft / (scrollWidth - clientWidth) * (trackHorizontalWidth - thumbHorizontalWidth);
        var thumbHorizontalStyle = {
          width: thumbHorizontalWidth,
          transform: 'translateX(' + thumbHorizontalX + 'px)'
        };
        var scrollTop = values.scrollTop,
            clientHeight = values.clientHeight,
            scrollHeight = values.scrollHeight;

        var trackVerticalHeight = (0, _getInnerHeight2["default"])(trackVertical);
        var thumbVerticalHeight = _this.getThumbVerticalHeight();
        var thumbVerticalY = scrollTop / (scrollHeight - clientHeight) * (trackVerticalHeight - thumbVerticalHeight);
        var thumbVerticalStyle = {
          height: thumbVerticalHeight,
          transform: 'translateY(' + thumbVerticalY + 'px)'
        };
        if (hideTracksWhenNotNeeded) {
          var trackHorizontalStyle = {
            visibility: scrollWidth > clientWidth ? 'visible' : 'hidden'
          };
          var trackVerticalStyle = {
            visibility: scrollHeight > clientHeight ? 'visible' : 'hidden'
          };
          (0, _domCss2["default"])(trackHorizontal, trackHorizontalStyle);
          (0, _domCss2["default"])(trackVertical, trackVerticalStyle);
        }
        (0, _domCss2["default"])(thumbHorizontal, thumbHorizontalStyle);
        (0, _domCss2["default"])(thumbVertical, thumbVerticalStyle);
      }
      if (onUpdate) onUpdate(values);
      if (typeof callback !== 'function') return;
      callback(values);
    }, _this.render = function () {
      var scrollbarWidth = (0, _getScrollbarWidth2["default"])();
      /* eslint-disable no-unused-vars */

      var _this$props5 = _this.props,
          onScroll = _this$props5.onScroll,
          onScrollFrame = _this$props5.onScrollFrame,
          onScrollStart = _this$props5.onScrollStart,
          onScrollStop = _this$props5.onScrollStop,
          onUpdate = _this$props5.onUpdate,
          renderView = _this$props5.renderView,
          renderTrackHorizontal = _this$props5.renderTrackHorizontal,
          renderTrackVertical = _this$props5.renderTrackVertical,
          renderThumbHorizontal = _this$props5.renderThumbHorizontal,
          renderThumbVertical = _this$props5.renderThumbVertical,
          tagName = _this$props5.tagName,
          hideTracksWhenNotNeeded = _this$props5.hideTracksWhenNotNeeded,
          autoHide = _this$props5.autoHide,
          autoHideTimeout = _this$props5.autoHideTimeout,
          autoHideDuration = _this$props5.autoHideDuration,
          thumbSize = _this$props5.thumbSize,
          thumbMinSize = _this$props5.thumbMinSize,
          universal = _this$props5.universal,
          autoHeight = _this$props5.autoHeight,
          autoHeightMin = _this$props5.autoHeightMin,
          autoHeightMax = _this$props5.autoHeightMax,
          style = _this$props5.style,
          children = _this$props5.children,
          props = _objectWithoutProperties(_this$props5, ['onScroll', 'onScrollFrame', 'onScrollStart', 'onScrollStop', 'onUpdate', 'renderView', 'renderTrackHorizontal', 'renderTrackVertical', 'renderThumbHorizontal', 'renderThumbVertical', 'tagName', 'hideTracksWhenNotNeeded', 'autoHide', 'autoHideTimeout', 'autoHideDuration', 'thumbSize', 'thumbMinSize', 'universal', 'autoHeight', 'autoHeightMin', 'autoHeightMax', 'style', 'children']);
      /* eslint-enable no-unused-vars */

      var didMountUniversal = _this.state.didMountUniversal;


      var containerStyle = _extends({}, _styles.containerStyleDefault, autoHeight && _extends({}, _styles.containerStyleAutoHeight, {
        minHeight: autoHeightMin,
        maxHeight: autoHeightMax
      }), style);

      var viewStyle = _extends({}, _styles.viewStyleDefault, {
        // Hide scrollbars by setting a negative margin
        marginRight: scrollbarWidth ? -scrollbarWidth : 0,
        marginBottom: scrollbarWidth ? -scrollbarWidth : 0
      }, autoHeight && _extends({}, _styles.viewStyleAutoHeight, {
        // Add scrollbarWidth to autoHeight in order to compensate negative margins
        minHeight: (0, _isString2["default"])(autoHeightMin) ? 'calc(' + autoHeightMin + ' + ' + scrollbarWidth + 'px)' : autoHeightMin + scrollbarWidth,
        maxHeight: (0, _isString2["default"])(autoHeightMax) ? 'calc(' + autoHeightMax + ' + ' + scrollbarWidth + 'px)' : autoHeightMax + scrollbarWidth
      }), autoHeight && universal && !didMountUniversal && {
        minHeight: autoHeightMin,
        maxHeight: autoHeightMax
      }, universal && !didMountUniversal && _styles.viewStyleUniversalInitial);

      var trackAutoHeightStyle = {
        transition: 'opacity ' + autoHideDuration + 'ms',
        opacity: 0
      };

      var trackHorizontalStyle = _extends({}, _styles.trackHorizontalStyleDefault, autoHide && trackAutoHeightStyle, (!scrollbarWidth || universal && !didMountUniversal) && {
        display: 'none'
      });

      var trackVerticalStyle = _extends({}, _styles.trackVerticalStyleDefault, autoHide && trackAutoHeightStyle, (!scrollbarWidth || universal && !didMountUniversal) && {
        display: 'none'
      });

      return (0, _preact.h)(tagName, _extends({}, props, { style: containerStyle, ref: function ref(r) {
          _this.refs.container = r;
        } }), [(0, _preact.cloneElement)(renderView({ style: viewStyle }), { key: 'view', ref: function ref(r) {
          _this.refs.view = r;
        } }, children), (0, _preact.cloneElement)(renderTrackHorizontal({ style: trackHorizontalStyle }), { key: 'trackHorizontal', ref: function ref(r) {
          _this.refs.trackHorizontal = r;
        } }, (0, _preact.cloneElement)(renderThumbHorizontal({ style: _styles.thumbHorizontalStyleDefault }), { ref: function ref(r) {
          _this.refs.thumbHorizontal = r;
        } })), (0, _preact.cloneElement)(renderTrackVertical({ style: trackVerticalStyle }), { key: 'trackVertical', ref: function ref(r) {
          _this.refs.trackVertical = r;
        } }, (0, _preact.cloneElement)(renderThumbVertical({ style: _styles.thumbVerticalStyleDefault }), { ref: function ref(r) {
          _this.refs.thumbVertical = r;
        } }))]);
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Scrollbars, [{
    key: 'componentDidMountUniversal',
    value: function componentDidMountUniversal() {
      // eslint-disable-line react/sort-comp
      var universal = this.props.universal;

      if (!universal) return;
      this.setState({ didMountUniversal: true });
    }
  }, {
    key: 'unsetDomStyles',
    value: function unsetDomStyles() {
      var _refs = this.refs,
          thumbHorizontal = _refs.thumbHorizontal,
          thumbVertical = _refs.thumbVertical,
          trackHorizontal = _refs.trackHorizontal,
          trackVertical = _refs.trackVertical;

      var stylesReset = {
        width: '',
        height: '',
        transform: '',
        opacity: '',
        visibility: ''
      };
      (0, _domCss2["default"])(thumbVertical, stylesReset);
      (0, _domCss2["default"])(thumbHorizontal, stylesReset);
      (0, _domCss2["default"])(trackVertical, stylesReset);
      (0, _domCss2["default"])(trackHorizontal, stylesReset);
    }
  }]);

  return Scrollbars;
}(_preact.Component);

Scrollbars.defaultProps = {
  renderView: _defaultRenderElements.renderViewDefault,
  renderTrackHorizontal: _defaultRenderElements.renderTrackHorizontalDefault,
  renderTrackVertical: _defaultRenderElements.renderTrackVerticalDefault,
  renderThumbHorizontal: _defaultRenderElements.renderThumbHorizontalDefault,
  renderThumbVertical: _defaultRenderElements.renderThumbVerticalDefault,
  tagName: 'div',
  thumbMinSize: 30,
  hideTracksWhenNotNeeded: false,
  autoHide: false,
  autoHideTimeout: 1000,
  autoHideDuration: 200,
  autoHeight: false,
  autoHeightMin: 0,
  autoHeightMax: 200,
  universal: false
};
exports["default"] = Scrollbars;
},{"raf":"../node_modules/raf/index.js","dom-css":"../node_modules/dom-css/index.js","preact":"../node_modules/preact/dist/preact.mjs","../utils/isString":"../node_modules/preact-custom-scrollbars/lib/utils/isString.js","../utils/getScrollbarWidth":"../node_modules/preact-custom-scrollbars/lib/utils/getScrollbarWidth.js","../utils/returnFalse":"../node_modules/preact-custom-scrollbars/lib/utils/returnFalse.js","../utils/getInnerWidth":"../node_modules/preact-custom-scrollbars/lib/utils/getInnerWidth.js","../utils/getInnerHeight":"../node_modules/preact-custom-scrollbars/lib/utils/getInnerHeight.js","./styles":"../node_modules/preact-custom-scrollbars/lib/Scrollbars/styles.js","./defaultRenderElements":"../node_modules/preact-custom-scrollbars/lib/Scrollbars/defaultRenderElements.js"}],"../node_modules/preact-custom-scrollbars/lib/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Scrollbars = undefined;

var _Scrollbars = require('./Scrollbars');

var _Scrollbars2 = _interopRequireDefault(_Scrollbars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

exports["default"] = _Scrollbars2["default"];
exports.Scrollbars = _Scrollbars2["default"];
},{"./Scrollbars":"../node_modules/preact-custom-scrollbars/lib/Scrollbars/index.js"}],"components/iframeHeight.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getComputedBodyStyle = getComputedBodyStyle;
exports.default = getIFrameHeight;

function getComputedBodyStyle(prop, contentWindow) {
  var el = contentWindow.document.body,
      retVal = 0;

  if (contentWindow.document.defaultView && contentWindow.document.defaultView.getComputedStyle) {
    retVal = contentWindow.document.defaultView.getComputedStyle(el, null)[prop];
  }

  return parseInt(retVal, 10);
}

function getIFrameHeight(contentWindow) {
  return contentWindow.document.body.offsetHeight + getComputedBodyStyle('marginTop', contentWindow) + getComputedBodyStyle('marginBottom', contentWindow);
}
},{}],"components/device.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Device = void 0;

var _preact = require("preact");

var _preactCustomScrollbars = require("preact-custom-scrollbars");

var _iframeHeight = _interopRequireDefault(require("./iframeHeight"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Device =
/*#__PURE__*/
function (_Component) {
  _inherits(Device, _Component);

  function Device(props) {
    var _this;

    _classCallCheck(this, Device);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Device).call(this, props));
    _this.frameLoad = _this.frameLoad.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(Device, [{
    key: "frameLoad",
    value: function frameLoad() {
      this.setState({
        frameHeight: (0, _iframeHeight.default)(this.iframe.contentWindow) + "px"
      });
      this.scaleIt();
    }
  }, {
    key: "scaleIt",
    value: function scaleIt() {
      var scale = Math.min(this.wrapper.offsetWidth / this.viewport.offsetWidth, this.wrapper.offsetHeight / this.viewport.offsetHeight);
      var fitOption = Math.round(scale * 100);
      this.props.updateParent('fitOption', fitOption);

      if (scale < 1) {
        this.wrapper.classList.add("scaled");
        this.props.updateParent('zoom', Math.round(scale * 100));
      } else {
        this.wrapper.classList.remove("scaled");
        this.props.updateParent('zoom', 100);
      }
    }
  }, {
    key: "renderClassName",
    value: function renderClassName() {
      var noframe = this.props.showDevice ? " " : "no-device ";
      var landscape = this.props.landscape ? "landscape " : "";
      return "viewport marvel-device " + noframe + landscape + " " + this.props.color + " " + this.props.device;
    }
  }, {
    key: "render",
    value: function render(props, state) {
      var _this2 = this;

      return (0, _preact.h)("div", {
        className: "wrapper",
        ref: function ref(wrapper) {
          return _this2.wrapper = wrapper;
        }
      }, (0, _preact.h)("div", {
        className: this.renderClassName(),
        style: {
          transform: "translate(-50%, -50%) " + "scale(" + props.zoom / 100 + ")"
        },
        ref: function ref(viewport) {
          return _this2.viewport = viewport;
        }
      }, (0, _preact.h)("div", {
        className: "notch"
      }, (0, _preact.h)("div", {
        className: "camera"
      }), (0, _preact.h)("div", {
        className: "speaker"
      })), (0, _preact.h)("div", {
        className: "top-bar"
      }), (0, _preact.h)("div", {
        className: "sleep"
      }), (0, _preact.h)("div", {
        className: "volume"
      }), (0, _preact.h)("div", {
        className: "overflow"
      }, (0, _preact.h)("div", {
        className: "shadow shadow--tr"
      }), (0, _preact.h)("div", {
        className: "shadow shadow--tl"
      }), (0, _preact.h)("div", {
        className: "shadow shadow--br"
      }), (0, _preact.h)("div", {
        className: "shadow shadow--bl"
      })), (0, _preact.h)("div", {
        className: "inner-shadow"
      }), (0, _preact.h)("div", {
        className: "sensors"
      }), (0, _preact.h)("div", {
        className: "more-sensors"
      }), (0, _preact.h)("div", {
        className: "inner"
      }), (0, _preact.h)("div", {
        className: "camera"
      }), (0, _preact.h)("div", {
        className: "sensor"
      }), (0, _preact.h)("div", {
        className: "speaker"
      }), (0, _preact.h)("div", {
        className: "screen",
        id: "screen",
        ref: function ref(screen) {
          return _this2.screen = screen;
        }
      }, (0, _preact.h)(_preactCustomScrollbars.Scrollbars, {
        autoHide: true
      }, (0, _preact.h)("iframe", {
        src: props.frame,
        onLoad: this.frameLoad,
        style: {
          height: state.frameHeight
        },
        ref: function ref(iframe) {
          return _this2.iframe = iframe;
        }
      }))), (0, _preact.h)("div", {
        className: "home"
      }), (0, _preact.h)("div", {
        className: "bottom-bar"
      })));
    }
  }]);

  return Device;
}(_preact.Component);

exports.Device = Device;
},{"preact":"../node_modules/preact/dist/preact.mjs","preact-custom-scrollbars":"../node_modules/preact-custom-scrollbars/lib/index.js","./iframeHeight":"components/iframeHeight.js"}],"components/devices.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Devices = void 0;
var Devices = [{
  id: 1,
  name: "Desktop",
  value: "macbook",
  width: 960,
  height: 600,
  colors: []
}, {
  id: 2,
  name: "HTC One",
  value: "htc-one",
  width: 320,
  height: 568,
  colors: []
}, {
  id: 3,
  name: "Galaxy S5",
  value: "s5",
  width: 320,
  height: 568,
  colors: ["white", "black"]
}, {
  id: 4,
  name: "iPhone 4s",
  value: "iphone4s",
  width: 320,
  height: 480,
  colors: ["silver", "black"]
}, {
  id: 5,
  name: "iPhone 5C",
  value: "iphone5c",
  width: 320,
  height: 568,
  colors: ["white", "red", "yellow", "green", "blue"]
}, {
  id: 6,
  name: "iPhone 5s",
  value: "iphone5s",
  width: 320,
  height: 568,
  colors: ["silver", "gold", "black"]
}, {
  id: 7,
  name: "iPhone 8",
  value: "iphone8",
  width: 375,
  height: 667,
  colors: ["silver", "gold", "black"]
}, {
  id: 8,
  name: "iPhone 8 plus",
  value: "iphone8plus",
  width: 414,
  height: 736,
  colors: ["silver", "gold", "black"]
}, {
  id: 9,
  name: "iPhone-X",
  value: "iphone-x",
  width: 375,
  height: 812,
  colors: []
}, {
  id: 10,
  name: "iPad Mini",
  value: "ipad",
  width: 576,
  height: 768,
  colors: ["silver", "black"]
}, {
  id: 11,
  name: "Galaxy note 8",
  value: "note8",
  width: 400,
  height: 822,
  colors: []
}, {
  id: 12,
  name: "Nexus 5",
  value: "nexus5",
  width: 320,
  height: 568,
  colors: []
}, {
  id: 13,
  name: "Lumia 920",
  value: "lumia920",
  width: 320,
  height: 533,
  colors: ["yellow", "blue", "red", "white", "black"]
}];
exports.Devices = Devices;
},{}],"components/previewer.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _preact = require("preact");

var _toolbar = require("./toolbar");

var _device = require("./device");

var _devices = require("./devices");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Previewer =
/*#__PURE__*/
function (_Component) {
  _inherits(Previewer, _Component);

  function Previewer(props) {
    var _this2;

    _classCallCheck(this, Previewer);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(Previewer).call(this, props));
    _this2.state = {
      zoom: 100,
      landscape: false,
      showDevice: true,
      fitOption: 100,
      device: _devices.Devices[0].value,
      color: " "
    };
    return _this2;
  }

  _createClass(Previewer, [{
    key: "updateParent",
    value: function updateParent(name, val) {
      this.setState(_defineProperty({}, name, val));
    }
  }, {
    key: "frameHeightCalc",
    value: function frameHeightCalc(name, val) {
      var _this = this; // wait for css animation 400ms


      setTimeout(function () {
        _this.Device.frameLoad();
      }, 401);
    }
  }, {
    key: "render",
    value: function render(props, state) {
      var _this3 = this;

      return (0, _preact.h)("div", null, (0, _preact.h)(_toolbar.Toolbar, {
        devices: _devices.Devices,
        updateParent: this.updateParent.bind(this),
        fitOption: state.fitOption,
        zoom: state.zoom,
        frameHeightCalc: this.frameHeightCalc.bind(this)
      }), (0, _preact.h)(_device.Device, {
        ref: function ref(Device) {
          return _this3.Device = Device;
        },
        frame: props.app,
        zoom: state.zoom,
        landscape: state.landscape,
        showDevice: state.showDevice,
        color: state.color,
        device: state.device,
        updateParent: this.updateParent.bind(this)
      }));
    }
  }]);

  return Previewer;
}(_preact.Component);

exports.default = Previewer;
},{"preact":"../node_modules/preact/dist/preact.mjs","./toolbar":"components/toolbar.js","./device":"components/device.js","./devices":"components/devices.js"}],"../../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"../../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();

  newLink.onload = function () {
    link.remove();
  };

  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;

function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');

    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":"../../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"../node_modules/Devices.css/assets/devices.min.css":[function(require,module,exports) {

        var reloadCSS = require('_css_loader');
        module.hot.dispose(reloadCSS);
        module.hot.accept(reloadCSS);
      
},{"_css_loader":"../../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/css-loader.js"}],"index.css":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"../../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/css-loader.js"}],"index.js":[function(require,module,exports) {
"use strict";

var _preactHabitat = _interopRequireDefault(require("preact-habitat"));

var _preact = require("preact");

var _previewer = _interopRequireDefault(require("./components/previewer"));

require("Devices.css/assets/devices.min.css");

require("./index.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _habitat = (0, _preactHabitat.default)(_previewer.default),
    render = _habitat.render;

render({
  selector: '.responsive-preview',
  inline: false,
  clean: false,
  clientSpecified: false
});
},{"preact-habitat":"../node_modules/preact-habitat/dist/preact-habitat.es.js","preact":"../node_modules/preact/dist/preact.mjs","./components/previewer":"components/previewer.js","Devices.css/assets/devices.min.css":"../node_modules/Devices.css/assets/devices.min.css","./index.css":"index.css"}],"../../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "57427" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)