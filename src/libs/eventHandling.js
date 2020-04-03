// Will contain data about registered events by skrollr.
const _registeredEvents = [];

const addEvent = (element, namesString, callback) => {
  const intermediate = (e = window.event) => {
    if (!e.target) {
      e.target = e.srcElement;
    }

    if (!e.preventDefault) {
      e.preventDefault = () => {
        e.returnValue = false;
        e.defaultPrevented = true;
      };
    }

    return callback.call(this, e);
  };

  const names = namesString.split(" ");

  let name;
  let nameCounter = 0;
  const namesLength = names.length;

  for (; nameCounter < namesLength; nameCounter++) {
    name = names[nameCounter];

    if (element.addEventListener) {
      element.addEventListener(name, callback, false);
    } else {
      element.attachEvent(`on${name}`, intermediate);
    }

    // Remember the events to be able to flush them later.
    _registeredEvents.push({
      element,
      name,
      listener: callback,
    });
  }
};

const removeEvent = (element, namesString, callback) => {
  const names = namesString.split(" ");

  let nameCounter = 0;
  const namesLength = names.length;

  for (; nameCounter < namesLength; nameCounter++) {
    if (element.removeEventListener) {
      element.removeEventListener(names[nameCounter], callback, false);
    } else {
      element.detachEvent(`on${names[nameCounter]}`, callback);
    }
  }
};

const removeAllEvents = () => {
  let eventData;
  let eventCounter = 0;
  const eventsLength = _registeredEvents.length;

  for (; eventCounter < eventsLength; eventCounter++) {
    eventData = _registeredEvents[eventCounter];

    _removeEvent(eventData.element, eventData.name, eventData.listener);
  }

  _registeredEvents = [];
};

const emitEvent = (element, name, direction) => {
  if (_listeners.keyframe) {
    _listeners.keyframe.call(_instance, element, name, direction);
  }
};

export { addEvent, removeEvent, removeAllEvents, emitEvent };
