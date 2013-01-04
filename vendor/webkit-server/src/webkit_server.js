window.WebKitServer = {
  nodes         : {},
  nextIndex     : 0,
  attachedFiles : [],

  invoke: function() {
    return this[WebKitServerInvocation.functionName].apply(this, WebKitServerInvocation.arguments);
  },

  find: function(selector) {
    return this.findRelativeTo(document, selector);
  },

  currentUrl: function() {
    return window.location.toString();
  },

  findWithin: function(index, selector) {
    return this.findRelativeTo(this.nodes[index], selector);
  },

  findRelativeTo: function(parent, selector) {
    var results  = [],
        elements = parent.querySelectorAll(selector);

    for (var index = 0, length = elements.length; index < length; index++) {
      this.nodes[results.push(++this.nextIndex)] = elements[index];
    }

    return results.join(",");
  },

  isAttached: function(index) {
    return document.evaluate("ancestor-or-self::html", this.nodes[index], null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue != null;
  },

  text: function(index) {
    var node = this.nodes[index],
        type = (node.type || node.tagName).toLowerCase();

    if (type == "textarea") {
      return node.innerHTML;
    } else {
      return node.innerText;
    }
  },

  attribute: function(index, name) {
    var node = this.nodes[index];

    switch(name) {
      case "checked":  return node.checked;
      case "disabled": return node.disabled;
      case "multiple": return node.multiple;
      default:         return node.getAttribute(name);
    }
  },

  hasAttribtue: function(index, name) {
    return this.nodes[index].hasAttribute(name);
  },

  tagName: function(index) {
    return this.nodes[index].tagName.toLowerCase();
  },

  submit: function(index) {
    return this.nodes[index].submit();
  },

  mousedown: function(index) {
    var mousedownEvent = document.createEvent("MouseEvents");
    mousedownEvent.initMouseEvent("mousedown", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    this.nodes[index].dispatchEvent(mousedownEvent);
  },

  mouseup: function(index) {
    var mouseupEvent = document.createEvent("MouseEvents");
    mouseupEvent.initMouseEvent("mouseup", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    this.nodes[index].dispatchEvent(mouseupEvent);
  },

  click: function(index) {
    this.mousedown(index);
    this.focus(index);
    this.mouseup(index);

    var clickEvent = document.createEvent("MouseEvents");
    clickEvent.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    this.nodes[index].dispatchEvent(clickEvent);
  },

  trigger: function(index, eventName) {
    var eventObject = document.createEvent("HTMLEvents");
    eventObject.initEvent(eventName, true, true);
    this.nodes[index].dispatchEvent(eventObject);
  },

  keypress: function(index, altKey, ctrlKey, shiftKey, metaKey, keyCode, charCode) {
    var eventObject = document.createEvent("Events");
    eventObject.initEvent("keypress", true, true);
    eventObject.window = window;
    eventObject.altKey = altKey;
    eventObject.ctrlKey = ctrlKey;
    eventObject.shiftKey = shiftKey;
    eventObject.metaKey = metaKey;
    eventObject.keyCode = keyCode;
    eventObject.charCode = charCode;
    eventObject.which = keyCode;
    this.nodes[index].dispatchEvent(eventObject);
  },

  keyupdown: function(index, eventName, keyCode) {
    var eventObject = document.createEvent("HTMLEvents");
    eventObject.initEvent(eventName, true, true);
    eventObject.keyCode = keyCode;
    eventObject.which = keyCode;
    eventObject.charCode = 0;
    this.nodes[index].dispatchEvent(eventObject);
  },

  visible: function(index) {
    var element = this.nodes[index];

    while (element) {
      var style = element.ownerDocument.defaultView.getComputedStyle(element, null);

      if (style.getPropertyValue("display") == "none" || style.getPropertyValue("visibility") == "hidden") {
        return false;
      }

      element = element.parentElement;
    }

    return true;
  },

  selected: function(index) {
    return this.nodes[index].selected;
  },

  value: function(index) {
    return this.nodes[index].value;
  },

  getInnerHTML: function(index) {
    return this.nodes[index].innerHTML;
  },

  setInnerHTML: function(index, value) {
    this.nodes[index].innerHTML = value;
    return true;
  },

  characterToKeyCode: function(character) {
    var code = character.toUpperCase().charCodeAt(0);
    var specialKeys = {
      96:  192, //`
      45:  189, //-
      61:  187, //=
      91:  219, //[
      93:  221, //]
      92:  220, //\
      59:  186, //;
      39:  222, //'
      44:  188, //,
      46:  190, //.
      47:  191, ///
      127: 46,  //delete
      126: 192, //~
      33:  49,  //!
      64:  50,  //@
      35:  51,  //#
      36:  52,  //$
      37:  53,  //%
      94:  54,  //^
      38:  55,  //&
      42:  56,  //*
      40:  57,  //(
      41:  48,  //)
      95:  189, //_
      43:  187, //+
      123: 219, //{
      125: 221, //}
      124: 220, //|
      58:  186, //:
      34:  222, //"
      60:  188, //<
      62:  190, //>
      63:  191  //?
    };

    if (specialKeys[code]) {
      code = specialKeys[code];
    }

    return code;
  },

  set: function(index, value) {
    var node = this.nodes[index],
        type = (node.type || node.tagName).toLowerCase(),
        textTypes = ["email", "number", "password", "search", "tel", "text", "textarea", "url"];

    if (textTypes.indexOf(type) !== -1) {
      this.focus(index);

      node.value = "";

      var length    = value.length,
          maxLength = this.attribute(index, "maxlength");

      if (maxLength && value.length > maxLength) {
        length = maxLength;
      }

      for (var offset = 0; offset < length; offset++) {
        node.value += value[offset];

        var keyCode = this.characterToKeyCode(value[strindex]);
        this.keyupdown(index, "keydown", keyCode);
        this.keypress(index, false, false, false, false, value.charCodeAt(strindex), value.charCodeAt(strindex));
        this.keyupdown(index, "keyup", keyCode);
        this.trigger(index, "input");
      }

      this.trigger(index, "change");
    } else if (type === "checkbox" || type === "radio") {
      if (node.checked != (value === "true")) {
        this.click(index);
      }
    } else if (type === "file") {
      this.attachedFiles = Array.prototype.slice.call(arguments, 1);
      this.click(index);
    } else {
      node.value = value;
    }
  },

  focus: function(index) {
    this.index[index].focus();
  },

  selectOption: function(index) {
    this.nodes[index].selected = true;
    this.trigger(index, "change");
  },

  unselectOption: function(index) {
    this.nodes[index].selected = false;
    this.trigger(index, "change");
  },

  centerPostion: function(element) {
    this.reflow(element);

    var rect     = element.getBoundingClientRect(),
        position = {
          x: rect.width / 2,
          y: rect.height / 2
        };

    do {
      position.x += element.offsetLeft;
      position.y += element.offsetTop;
    } while ((element = element.offsetParent));

    position.x = Math.floor(position.x);
    position.y = Math.floor(position.y);

    return position;
  },

  reflow: function(element, force) {
    if (force || element.offsetWidth === 0) {
      var property,
          oldStyle = {},
        newStyle = {
          display    : "block",
          position   : "absolute",
          visibility : "hidden",
        };

      for (property in newStyle)  {
        oldStyle[property]      = element.style[property];
        element.style[property] = newStyle[property];
      }

      element.offsetWidth;
      element.offsetHeight;

      for (property in oldStyle) {
        element.style[property] = oldStyle[property];
      }
    }
  },

  dragTo: function(index, targetIndex) {
    var element  = this.nodes[index],
        target   = this.nodes[targetIndex],
        position = this.centerPostion(element),
        options  = {
          clientX: position.x,
          clientY: position.y
        },
        mouseTrigger = function(eventName, options) {
          var eventObject = document.createEvent("MouseEvents");
          eventObject.initMouseEvent(eventName, true, true, window, 0, 0, 0, options.clientX || 0, options.clientY || 0, false, false, false, false, 0, null);
          element.dispatchEvent(eventObject);
        };

    mouseTrigger("mousedown", options);

    options.clientX += 1;
    options.clientY += 1;

    mouseTrigger("mousemove", options);

    position = this.centerPostion(target);
    options  = {
      clientX: position.x,
      clientY: position.y
    };

    mouseTrigger("mousemove", options);
    mouseTrigger("mouseup", options);
  },

  equals: function(index, targetIndex) {
    return this.nodes[index] === this.nodes[targetIndex];
  }
};
