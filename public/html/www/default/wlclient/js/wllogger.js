
/* JavaScript content from wlclient/js/wllogger.js in Common Resources */
/*
 * Licensed Materials - Property of IBM
 * 5725-G92 (C) Copyright IBM Corp. 2006, 2013. All Rights Reserved.
 * US Government Users Restricted Rights - Use, duplication or
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */
/*globals WL, printStackTrace, air, worklight, cordova, WLJQ*/
/*jshint expr:true, strict:false, maxdepth:4*/

WL.Logger = (function (jQuery) {

  var $ = jQuery;

  var priorities = {
    debug : 500,
    log   : 400,
    info  : 300,
    warn  : 200,
    error : 100
  };

  var LEFT_BRACKET = '[';
  var RIGHT_BRACKET = '] '; //There's a space at the end.

  var state = {
    enabled : true,
    stringify : true,
    pretty: false,
    stacktrace : false,
    ismsie : !!(document.all && document.querySelector && !document.addEventListener),
    callback : '',
    tag : {level: false, pkg: true},
    pkg : '',
    whitelist : [],
    blacklist : [],
    level : [],
    metadata: {}
  };

  var deviceReady = false;
  var queue = [];

  // use StoragePlugin so no upgraders are required in service releases
  var CDV_PLUGIN_LOGGER = 'StoragePlugin';
  var CDV_ACTION_LOG = 'log';
  var CDV_ACTION_SET_NATIVE_OPTIONS = 'setNativeOptions';
  var CDV_ACTION_SEND = 'send';

  // we want to pass log messages to cordova, which may not be ready,
  // so we listen for deviceready event, and queue until event occurs
  var __onDeviceReady = function() {
    if (deviceReady) {
      return;
    }

    var noop = function () {};
    deviceReady = true;

    for (var i = 0; i < queue.length; i++) {
      var current = queue[i];
      if ($.isArray(current)) {
        cordova.exec(null, null, CDV_PLUGIN_LOGGER, CDV_ACTION_LOG, current);
      } else if (typeof current === 'object') {

        current.dfd = current.dfd || {};
        cordova.exec(current.dfd.resolve || noop,
            current.dfd.reject || noop,
            CDV_PLUGIN_LOGGER, CDV_ACTION_SET_NATIVE_OPTIONS, [current]);
      }
    }

    queue = null;
  };

  var __getLogArgArray= function (args, priority, pkg) {

    var msgStr = __stringifyArguments(args);
    var meta = $.extend(true, {'$src': 'js', '$arguments': args}, state.metadata); //clone obj
    state.metadata = {}; //clear metadata obj

    for (var i = 0; i < args.length; i++) {

      if (args[i] instanceof Error) {
        args[i] = {'$name': args[i].toString(), '$stacktrace': printStackTrace({e: args[i]})};
      }
    }

    return [priority.toUpperCase(), pkg, msgStr, meta, (new Date()).getTime()];
  };

  var __checkNativeEnvironment = function () {
    var env = WL.StaticAppProps.ENVIRONMENT;

    return (env === 'android' ||
        env === 'iphone' ||
        env === 'ipad');
  };
  
  if (__checkNativeEnvironment()) {
    var interval = setInterval(function() {
	  if (!deviceReady && typeof window.cordova === 'object' 
		  && typeof window.cordova.exec === 'function') {
		  setTimeout(function(){
			  __onDeviceReady();
		  },0);
		  clearInterval(interval);
	  }
    }, 500);
  }
  
  var __insideArray = function (needle, haystack) {

    return haystack.indexOf(needle) !== -1;
  };

  var __getKeys = function (obj) {
    var arr = [];

    for (var key in obj) {
      if(obj.hasOwnProperty(key)){
        arr.push(key);
      }
    }
    return arr;
  };

  var __setState = function (options) {

    state = {
        enabled : typeof options.enabled === 'boolean' ? options.enabled : true,
        stringify : typeof options.stringify === 'boolean' ? options.stringify : true,
        pretty: typeof options.pretty === 'boolean' ? options.pretty : false,
        stacktrace : typeof options.stacktrace === 'boolean' ? options.stacktrace : false,
        ismsie : typeof options.ismsie === 'boolean' ? options.ismsie : !!(document.all && document.querySelector && !document.addEventListener),
        callback : options.callback || '',
        tag : $.extend({level: false, pkg: true}, options.tag || {}),
        pkg : options.pkg || '',
        whitelist : options.whitelist || [],
        blacklist : options.blacklist || [],
        level : options.level || [],
        metadata: options.metadata || {}
      };
  };

  var __stringify = function (input) {

    if (input instanceof Error) {

      return (state.stacktrace) ? printStackTrace({e: input}).join('\n') : input.toString();
    }

    else if (typeof input === 'object' && JSON && JSON.stringify) {

      try {
        return (state.pretty) ? JSON.stringify(input, null, ' ') : JSON.stringify(input);
      }
      catch (e) {
        return 'Stringify Failed: ' + e;
      }

    } else {
      return (typeof input === 'undefined') ? 'undefined' : input.toString();
    }
  };

  var __stringifyArguments = function (args) {

    var len = args.length,
    i = 0,
    res = [];

    for (; i < len ; i++) {
      res.push(__stringify(args[i]));
    }

    return res.join(' ');
  };

  //currentPriority is the priority linked to the current log msg
  //stateLevel can be an Array (whitelist of levels), a string (e.g. 'warn') or a number (200)
  var __checkLevel = function (currentPriority, stateLevel) {

    if ($.isArray(stateLevel)) {

      return  (//Check if current is whitelisted (state)
          stateLevel.length > 0 &&
          !__insideArray(currentPriority, stateLevel)
      );

    } else if (typeof stateLevel === 'string') {

      stateLevel = stateLevel.toLowerCase();//Handle WARN, wArN, etc instead of just warn

      return  (//Get numeric value and compare current with state
          typeof (priorities[currentPriority]) === 'number' &&
          typeof (priorities[stateLevel]) === 'number' &&
          (priorities[currentPriority]  > priorities[stateLevel])
      );

    } else if (typeof stateLevel === 'number') {

      return (//Compare current with state
          typeof (priorities[currentPriority]) === 'number' &&
          (priorities[currentPriority]  > stateLevel)
      );
    }

    return true; //Bail out, level is some unknown type
  };

  var __checkLists = function (pkg, whitelistArr, blacklistArr) {

    return (//Package inside Whitelist
        ($.isArray(whitelistArr) && whitelistArr.length > 0 && !__insideArray(pkg, whitelistArr)) ||

        //Package inside Blacklist
        ($.isArray(blacklistArr) && blacklistArr.length > 0 && __insideArray(pkg, blacklistArr))
    );
  };

  var __log = function (args, priority) {

    var str = '',
    pkg = state.pkg;

    state.pkg = ''; //clear pkg from state obj

    if (!state.enabled ||
        __checkLists(pkg, state.whitelist, state.blacklist) ||
        __checkLevel(priority, state.level)) {

      return;
    }

    if (state.stringify) {
      str = __stringifyArguments(args);
    }

    //Apply Package Tag
    if (state.tag.pkg && typeof pkg === 'string' && pkg.length > 0) {
      str = LEFT_BRACKET + pkg + RIGHT_BRACKET + str;
    }

    //Apply Level Tag
    if (state.tag.level) {
      str = LEFT_BRACKET + priority.toUpperCase() + RIGHT_BRACKET + str;
    }

    if (!state.stringify && str.length > 0) {
      args.unshift(str);
    }

    if (!__checkNativeEnvironment()) {

      //Log to the console
      if (typeof console === 'object') {

        if (typeof console[priority] === 'function') {
          (state.stringify) ? console[priority](str) : console[priority].apply(console, args);

        } else if (typeof console.log === 'function') {
          (state.stringify) ? console.log(str) : console.log.apply(console, args);

        } else if (state.ismsie && typeof console.log === 'object') {
          (state.stringify) ? console.log(str) : console.log.apply(console, args);
        }

      } else {

        //Special case for Adobe Air apps in debug mode
        if (typeof air === 'object' && air.Introspector && air.Introspector.Console) {

          if (typeof air.Introspector.Console[priority] === 'function') {
            (state.stringify) ? air.Introspector.Console[priority](str) : air.Introspector.Console[priority].apply(air, args);

          } else if (typeof air.Introspector.Console.log === 'function') {
            (state.stringify) ? air.Introspector.Console.log(str) : air.Introspector.Console.log.apply(air, args);
          }
        }

        //Special case for BlackBerry
        else if (typeof worklight === 'object' && worklight.utils && typeof worklight.utils.log === 'function') {

          str = (!state.stringify) ? __stringifyArguments(args) : str;

          worklight.utils.log(str, priority);
        }
      }

    } else {

      if (!deviceReady) {

        try {
          queue.push(__getLogArgArray(args, priority, pkg));
        } catch (e) {
          console.log('[wl.logger] ' + e.toString());
        }

      } else if (typeof cordova === 'object' && cordova.exec) {

        cordova.exec(null, null, CDV_PLUGIN_LOGGER, CDV_ACTION_LOG, __getLogArgArray(args, priority, pkg));
      }

    }

    //The default value of state.callback is an empty string (not a function)
    //and to prevent infinite loops when calling WL.Analytics.log we exclude the wl.analytics pkg
    if (typeof state.callback === 'function' && pkg !== 'wl.analytics') {
      if (!state.stringify) {
        str = args;
      }
      state.callback(str, priority, pkg);
    }

  };

  var LogInstance = function (ops) {
    this.options = ops || {};
  };

  //Add .debug(), .log(), etc. to LogInstances
  $.each(__getKeys(priorities), function (idx, priority) {
    LogInstance.prototype[priority] = function () {
      WL.Logger.ctx(this.options)[priority].apply(this, arguments);
    };
  });

  var _create = function (options) {
    return new LogInstance(options);
  };

  var _on = function (options) {
    __setState($.extend({enabled: true}, options || {}));
    return this;
  };

  var _off = function () {
    __setState({enabled: false});
    return this;
  };

  var _status = function () {
    return state;
  };

  var _ctx = function (options) {
    $.extend(state, options || {});
    return this;
  };

  var _send = function () {

    var dfd = $.Deferred();

    setTimeout(function () {
      cordova.exec(dfd.resolve, dfd.reject, CDV_PLUGIN_LOGGER, CDV_ACTION_SEND, []);
    }, 0);

    return dfd.promise();
  };

  var _metadata = function (obj) {

    if (typeof obj === 'object') {
      state.metadata = obj;
    }

    return this;
  };

  var _setNativeOptions = function (options) {

    var dfd = $.Deferred();

    if (typeof options !== 'object') {

      setTimeout(function () {
        dfd.reject({src: 'setNativeOptions', msg: 'You must pass an object to WL.Logger.setNativeOptions'});
      }, 1);

      return dfd.promise();
    }

    if (!__checkNativeEnvironment()) {

      setTimeout(function () {
        dfd.reject({src: 'setNativeOptions', msg: 'WL.Logger.setNativeOptions only works on Android and iOS environments, current environment is: '+
          __checkNativeEnvironment()});
      }, 1);

      return dfd.promise();
    }

    var ops = {};

    //Check if maxFileSize is an integer (e.g. 1, not 1.1)
    if (Math.floor(options.maxFileSize) === options.maxFileSize && $.isNumeric(options.maxFileSize)) {
      ops.maxFileSize = options.maxFileSize;
    }

    //Level is 'debug', 'log', 'info', 'warn' or 'error'
    //Why Up/Low case? __getKeys will return lower case strings and native expects upper cased strings.
    if (typeof options.level === 'string' && __insideArray(options.level.toLowerCase(), __getKeys(priorities))) {
      ops.level = options.level.toUpperCase();
    }

    if (typeof options.capture === 'boolean') {
      ops.capture = options.capture;
    }

    if (!deviceReady) {
      //Queue the operation until the bridge to native is active
      ops.dfd = dfd;
      try {
        queue.push(ops);
      } catch (e) {
        console.log('[wl.logger] ' + e.toString());
      }
    } else {
      cordova.exec(dfd.resolve, dfd.reject, CDV_PLUGIN_LOGGER, CDV_ACTION_SET_NATIVE_OPTIONS, [ops]);
    }

    return dfd.promise();
  };

  var PUBLIC_API = {
    create : _create,
    on : _on,
    off : _off,
    status : _status,
    ctx : _ctx,
    send: _send,
    metadata: _metadata,
    setNativeOptions : _setNativeOptions,
    // for testing:
    __onDeviceReady : __onDeviceReady,
    __deviceReady : deviceReady
  };

  //Add .debug(), .log(), etc. to WL.Logger's public API
  $.each(__getKeys(priorities), function (idx, priority) {
    PUBLIC_API[priority] = function () {
      __log([].slice.call(arguments), priority);
    };
  });

  return PUBLIC_API;

}(WLJQ)); //WL.Logger