/**
 * Recursively merge properties of two objects
 *
 * @param {Object} defaults Default settings
 * @param {Object} options User options
 * @returns {Object} Merged values of defaults and options
 */
function extend(defaults, options) {
  function copy(obj1, obj2, prop) {
    try {
      if (obj2[prop].constructor === Object) {
        obj1[prop] = extend(obj1[prop] || {}, obj2[prop]);
      } else {
        obj1[prop] = obj2[prop];
      }
    } catch (error) {
      obj1[prop] = obj2[prop];
    }
    return obj1;
  }

  var extended = {};
  var prop;
  for (prop in defaults) {
    if (Object.prototype.hasOwnProperty.call(defaults, prop)) {
      copy(extended, defaults, prop);
    }
  }
  for (prop in options) {
    if (Object.prototype.hasOwnProperty.call(options, prop)) {
      copy(extended, options, prop);
    }
  }
  return extended;
}

/**
 * An XHR implementation that returns a Promise.
 *
 * Options:
 * <code>
 *  {
 *    method: 'GET',
 *    async: true,
 *
 *    // The expected return data-type
 *    type: 'json',
 *
 *    // The post data to send. The following types are allowed:
 *    // ArrayBufferView, Blob, Document, DOMString, FormData, URLSearchParams
 *    data: '',
 *
 *    // A list of additional HTTP request header to be set.
 *    header: {},
 *
 *    // Possible event handlers for XMLHttpRequest.
 *    // By default the load, error & abort event handlers are used to resolve or reject the promise.
 *    // Each callback receives the promise handling functions as arguments.
 *    // `this` is set to the XHR object inside each callback.
 *    callbacks: {
 *
 *      // Progress has begun. Executed Once, at first.
 *      loadstart: function( resolve, reject ) {  },
 *
 *      // In progress. Executed Zero or more, after loadstart has been dispatched.
 *      progress: function( resolve, reject ) {  },
 *
 *      // Progression is successful. Executed Zero or once.
 *      load: function( resolve, reject ) {  },
 *
 *      // Progression failed. Executed Zero or once, after the last progress has been dispatched, or after loadstart has been dispatched if progress has not been dispatched.
 *      error: function( resolve, reject ) {  },
 *
 *      // Progression is terminated. Executed Zero or once.
 *      abort: function( resolve, reject ) {  },
 *
 *      // Progress has stopped. Executed Once, after one of error, abort, or load has been dispatched.
 *      loadend: function( resolve, reject ) {  }
 *    },
 *
 *    // The same events can also be used to monitor the upload status.
 *    uploadCallbacks: {}
 *  }
 *  </code>
 *
 *  Examples:
 *  <code>
 xhr( "/my/api/shopping-cart" )
 .then( cartdata => {
            // display a mini cart dropdown using cartdata JSON
        } );

 xhr( "someTemplate.mustache", {type: "text"} )
 .then( template => {
            // use plain text template here
        } );
 *  </code>
 *
 * @param {String} url
 * @param {Object} userOptions
 * @returns {Promise}
 */
function xhr(url, userOptions) {
  return new Promise(function (resolve, reject) {
    var options = {
      method: "GET",
      async: true,
      type: "json",
      data: "",
      header: {},
      callbacks: {
        load: function () {
          if (this.status !== 200) {
            reject(new Error("HTTP " + this.status + " " + this.statusText));
            return;
          }

          if (!this.response) {
            reject(new Error("Response is empty."));
          } else {
            resolve(this.response);
          }
        },
        error: function () {
          reject(new Error("Request failed."));
        },
        abort: function () {
          reject(new Error("Request stopped."));
        }
      },
      uploadCallbacks: {}
    };

    options = extend(options, userOptions);

    var request = new XMLHttpRequest();
    request.open(options.method, url, options.async);

    request.responseType = options.type;

    /* Set request header */
    for (let header in options.header) {
      request.setRequestHeader(header, options.header[header]);
    }

    /* Add callbacks */
    for (let eventType in options.callbacks) {
      if (options.callbacks.hasOwnProperty(eventType)) {
        /* Using IIFE with anonymous function to scope eventHandler for each event listener */
        request.addEventListener(
          eventType,
          (function () {
            var eventHandler = options.callbacks[eventType];
            return function (event) {
              eventHandler.call(event.target, resolve, reject);
            };
          })(),
          false
        );
      }
    }

    for (let uploadEventType in options.uploadCallbacks) {
      if (options.uploadCallbacks.hasOwnProperty(uploadEventType)) {
        /* Using IIFE with anonymous function to scope eventHandler for each event listener */
        request.upload.addEventListener(
          uploadEventType,
          (function () {
            var eventHandler = options.uploadCallbacks[uploadEventType];
            return function (event) {
              eventHandler.call(event.target, resolve, reject);
            };
          })(),
          false
        );
      }
    }

    request.send(options.data);
  });
}

export { extend, xhr };
