/*
 *
 * Find more about this plugin by visiting
 * http://alxgbsn.co.uk/
 *
 * Copyright (c) 2010-2012 Alex Gibson
 * Released under MIT license
 *
 */

/**
 * Expose `Shake`
 */

module.exports = Shake;

function Shake(threshold, minTimeDifference) {

  //feature detect
  this.hasDeviceMotion = 'ondevicemotion' in window;
  this.hasDeviceOrientation = window.hasOwnProperty('orientation');

  //default velocity for shake to register
  this.threshold = threshold || 15;

  //default minimum time difference since last shake for shake to register
  this.minTimeDifference = minTimeDifference || 1000;

  //use date to prevent multiple shakes firing	
  this.lastTime = new Date();

  //accelerometer values
  this.lastX = null;
  this.lastY = null;
  this.lastZ = null;

  //create custom event
  this.event = document.createEvent('Event');
  this.event.initEvent('shake', true, true);
}

//reset timer values
Shake.prototype.reset = function () {

  this.lastTime = new Date();
  this.lastX = null;
  this.lastY = null;
  this.lastZ = null;
};

//start listening for devicemotion
Shake.prototype.start = function () {

  this.reset();
  if (this.hasDeviceMotion) { window.addEventListener('devicemotion', this, false); }
  else if (this.hasDeviceOrientation) { window.addEventListener('deviceorientation', this, false); }
};

//stop listening for devicemotion
Shake.prototype.stop = function () {

  if (this.hasDeviceMotion) { window.removeEventListener('devicemotion', this, false); }
  else if (this.hasDeviceOrientation) { window.removeEventListener('deviceorientation', this, false); }
  this.reset();
};

Shake.prototype.deviceorientation = function(e) {
  var currentTime;
  var timeDifference;
  var deltaX = 0;
  var deltaY = 0;
  var deltaZ = 0;

  var threshold = 50;

  if ((this.lastX === null) && (this.lastY === null) && (this.lastZ === null)) {
    this.lastX = e.gamma;
    this.lastY = e.beta;
    this.lastZ = e.alpha;
    return;
  }

  deltaX = Math.abs(this.lastX - e.gamma);
  deltaY = Math.abs(this.lastY - e.beta);
  deltaZ = Math.abs(this.lastZ - e.alpha);


  if (((deltaX > threshold) && (deltaY > threshold)) || ((deltaX > threshold) && (deltaZ > threshold)) || ((deltaY > threshold) && (deltaZ > threshold))) {
    //calculate time in milliseconds since last shake registered
    currentTime = new Date();
    timeDifference = currentTime.getTime() - this.lastTime.getTime();
    
    if (timeDifference > 1000) {
      window.dispatchEvent(this.event);
      this.lastTime = new Date();
    }
  }
  
  this.lastX = e.gamma;
  this.lastY = e.beta;
  this.lastZ = e.alpha;

};

//calculates if shake did occur
Shake.prototype.devicemotion = function (e) {

  var current = e.acceleration,
    currentTime,
    timeDifference,
    deltaX = 0,
    deltaY = 0,
    deltaZ = 0;

  if ((this.lastX === null) && (this.lastY === null) && (this.lastZ === null)) {

    this.lastX = current.x;
    this.lastY = current.y;
    this.lastZ = current.z;
    return;
  }

  deltaX = Math.abs(this.lastX - current.x);
  deltaY = Math.abs(this.lastY - current.y);
  deltaZ = Math.abs(this.lastZ - current.z);

  if (((deltaX > this.threshold) && (deltaY > this.threshold)) || ((deltaX > this.threshold) && (deltaZ > this.threshold)) || ((deltaY > this.threshold) && (deltaZ > this.threshold))) {

    //calculate time in milliseconds since last shake registered
    currentTime = new Date();
    timeDifference = currentTime.getTime() - this.lastTime.getTime();

    if (timeDifference > this.minTimeDifference) {
      window.dispatchEvent(this.event);
      this.lastTime = new Date();
    }
  }
};

//event handler
Shake.prototype.handleEvent = function (e) {

  if (typeof (this[e.type]) === 'function') {
    return this[e.type](e);
  }
};
