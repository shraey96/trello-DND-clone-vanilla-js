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
})({"scripts/utils.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.itemOnDragStart = exports.itemOnDragEnd = exports.isEmpty = exports.insertItemInList = exports.getTaskToInsertAbove = exports.attachCloseBtnEventListener = exports.attachAddBtnListener = exports.addEventListenersToElements = void 0;
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
var addEventListenersToElements = function addEventListenersToElements() {
  var _Array$from;
  var elements = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var eventName = arguments.length > 1 ? arguments[1] : undefined;
  var callback = arguments.length > 2 ? arguments[2] : undefined;
  (_Array$from = Array.from(elements)) === null || _Array$from === void 0 ? void 0 : _Array$from.forEach(function (element) {
    element.addEventListener(eventName, callback);
  });
};
exports.addEventListenersToElements = addEventListenersToElements;
var isEmpty = function isEmpty(value) {
  if (typeof value === "undefined" || value === null) return true;
  if (Array.isArray(value) && value.length === 0) return true;
  if (_typeof(value) === "object" && Object.keys(value).length === 0) return true;
  if (typeof value === "string" && value === "") return true;
  return false;
};
exports.isEmpty = isEmpty;
var itemOnDragStart = function itemOnDragStart(element) {
  return element.classList.add("task-item--is-dragging");
};
exports.itemOnDragStart = itemOnDragStart;
var itemOnDragEnd = function itemOnDragEnd(element) {
  return element.classList.remove("task-item--is-dragging");
};
exports.itemOnDragEnd = itemOnDragEnd;
var getTaskToInsertAbove = function getTaskToInsertAbove(listItem, clientY) {
  var nonDraggingTasksForList = listItem.querySelectorAll(".task-item:not(.task-item--is-dragging)");
  var closestTask = null;
  var closestOffset = Number.NEGATIVE_INFINITY;
  Array.from(nonDraggingTasksForList).forEach(function (nonDraggingTask) {
    var boundingRects = nonDraggingTask.getBoundingClientRect();
    var offset = clientY - boundingRects.top;
    if (offset < 0 && offset > closestOffset) {
      closestOffset = offset;
      closestTask = nonDraggingTask;
    }
  });
  return closestTask;
};
exports.getTaskToInsertAbove = getTaskToInsertAbove;
var insertItemInList = function insertItemInList(e) {
  e.preventDefault();
  var listItem = e.currentTarget;
  var taskToInsertAbove = getTaskToInsertAbove(listItem, e.clientY);
  var currentDraggingTask = document.querySelector(".task-item--is-dragging");
  if (taskToInsertAbove) {
    listItem === null || listItem === void 0 ? void 0 : listItem.insertBefore(currentDraggingTask, taskToInsertAbove);
  } else {
    listItem === null || listItem === void 0 ? void 0 : listItem.appendChild(currentDraggingTask);
  }
};
exports.insertItemInList = insertItemInList;
var attachCloseBtnEventListener = function attachCloseBtnEventListener() {
  var nodes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  addEventListenersToElements(nodes, "click", function (e) {
    var isListClose = e.target.dataset.closeType === "list";
    var isTaskClose = e.target.dataset.closeType === "task";
    if (isListClose) {
      var _e$target$closest;
      (_e$target$closest = e.target.closest(".list-item")) === null || _e$target$closest === void 0 ? void 0 : _e$target$closest.remove();
    }
    if (isTaskClose) {
      var _e$target$closest2;
      (_e$target$closest2 = e.target.closest(".task-item")) === null || _e$target$closest2 === void 0 ? void 0 : _e$target$closest2.remove();
    }
  });
};
exports.attachCloseBtnEventListener = attachCloseBtnEventListener;
var attachAddBtnListener = function attachAddBtnListener() {
  var nodes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  addEventListenersToElements(nodes, "click", function (e) {
    var _e$target$dataset;
    var closestList = e.target.closest(".list-item");
    var taskForm = document.querySelector("form");
    if (closestList) {
      taskForm.setAttribute("data-form-list", closestList.getAttribute("data-list-type"));
    }
    var addType = (_e$target$dataset = e.target.dataset) === null || _e$target$dataset === void 0 ? void 0 : _e$target$dataset.addType;
    taskForm.setAttribute("data-form-type", addType);
    document.querySelector(".task-form-container").classList.add("task-form-container--visible");
    if (addType === "task") {
      document.querySelector("#task-title-input").focus();
    }
    if (addType === "list") {
      document.querySelector("#list-title-input").focus();
    }
  });
};
exports.attachAddBtnListener = attachAddBtnListener;
},{}],"scripts/board.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAndAddTask = exports.createAndAddList = void 0;
var _utils = require("./utils.js");
var LOCAL_STORAGE_KEY = "lists_and_tasks";
var createAndAddTask = function createAndAddTask() {
  var payload = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var list = arguments.length > 1 ? arguments[1] : undefined;
  var elementToInsertTaskTo = document.querySelector(".list-item[data-list-type=\"".concat(list, "\"]")) || document.querySelector(".list-item");
  var taskDiv = document.createElement("div");
  taskDiv.classList.add("task-item");
  taskDiv.setAttribute("draggable", true);
  var taskHeader = document.createElement("p");
  taskHeader.innerText = payload.taskTitle;
  taskHeader.classList.add("task-item__title");
  var taskDesc = document.createElement("p");
  taskDesc.innerText = payload.taskDesc;
  taskDesc.classList.add("task-item__desc");
  var taskCloseBtn = document.createElement("span");
  taskCloseBtn.innerText = "x";
  taskCloseBtn.classList.add("close-btn");
  taskCloseBtn.setAttribute("data-close-type", "task");
  taskDiv.appendChild(taskHeader);
  taskDiv.appendChild(taskDesc);
  taskDiv.appendChild(taskCloseBtn);
  (0, _utils.addEventListenersToElements)([taskDiv], "dragstart", function (e) {
    return (0, _utils.itemOnDragStart)(e.target);
  });
  (0, _utils.addEventListenersToElements)([taskDiv], "dragend", function (e) {
    return (0, _utils.itemOnDragEnd)(e.target);
  });
  (0, _utils.attachCloseBtnEventListener)([taskCloseBtn]);
  elementToInsertTaskTo.appendChild(taskDiv);
};
exports.createAndAddTask = createAndAddTask;
var createAndAddList = function createAndAddList(title) {
  var escapedListTitle = title.replaceAll(" ", "");
  var listItemDiv = document.createElement("div");
  listItemDiv.classList.add("list-item");
  listItemDiv.setAttribute("data-list-type", escapedListTitle);
  var listHeader = document.createElement("h3");
  listHeader.classList.add("list-item__heading");
  listHeader.innerText = title;
  var addBtn = document.createElement("button");
  addBtn.classList.add("add-btn", "list-item__add-task-btn");
  addBtn.setAttribute("data-add-type", "task");
  addBtn.innerText = "+";
  var listCloseBtn = document.createElement("span");
  listCloseBtn.innerText = "x";
  listCloseBtn.classList.add("close-btn");
  listCloseBtn.setAttribute("data-close-type", "list");
  listItemDiv.appendChild(listHeader);
  listItemDiv.appendChild(addBtn);
  listItemDiv.appendChild(listCloseBtn);
  document.querySelector(".lists-container").appendChild(listItemDiv);
  (0, _utils.attachCloseBtnEventListener)([listCloseBtn]);
  (0, _utils.attachAddBtnListener)([addBtn]);
  (0, _utils.addEventListenersToElements)([listItemDiv], "dragover", _utils.insertItemInList);
};
exports.createAndAddList = createAndAddList;
(0, _utils.addEventListenersToElements)([window], "beforeunload", function () {
  var storagePayload = [];
  Array.from(document.querySelectorAll(".list-item")).forEach(function (listItem) {
    var data = {
      items: []
    };
    var listName = listItem.querySelector(".list-item__heading");
    data.listName = listName.innerText;
    var taskItems = listItem.querySelectorAll(".task-item");
    taskItems.forEach(function (taskItem) {
      var _data$listName;
      var task = {
        title: taskItem.querySelector(".task-item__title").innerText,
        desc: taskItem.querySelector(".task-item__desc").innerText,
        listId: (_data$listName = data.listName) === null || _data$listName === void 0 ? void 0 : _data$listName.replaceAll(" ", "")
      };
      data.items.push(task);
    });
    storagePayload.push(data);
  });
  if (!(0, _utils.isEmpty)(storagePayload)) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(storagePayload));
  } else {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }
});
window.onload = function () {
  var listsFromLocalStorage = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
  listsFromLocalStorage.forEach(function (listItem) {
    createAndAddList(listItem.listName);
    if (!(0, _utils.isEmpty)(listItem.items)) {
      listItem.items.forEach(function (item) {
        createAndAddTask({
          taskTitle: item.title,
          taskDesc: item.desc
        }, item.listId);
      });
    }
  });
};
},{"./utils.js":"scripts/utils.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "57293" + '/');
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
      });

      // Enable HMR for CSS by default.
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
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
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
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
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
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","scripts/board.js"], null)
//# sourceMappingURL=/board.af0aecb3.js.map