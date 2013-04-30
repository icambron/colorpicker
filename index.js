
/**
 * dependencies
 */

var emitter = require('emitter')
  , events = require('events')
  , merge = require('merge');

/**
 * export `Picker`
 */

module.exports = Picker;

/**
 * Initialize new `Picker` with `el`.
 * 
 * @param {Element} el
 */

function Picker(el){
  if (!(this instanceof Picker)) return new Picker(el);
  if (!el) throw new TypeError('colorpicker() requires an element');
  this._color = {};
  this.el = el;
  this.bind();
  this.refresh();
  this.color({
    hue: 180,
    sat: 50,
    lit: 50
  });
}

/**
 * mixins.
 */

emitter(Picker.prototype);

/**
 * Bind events.
 * 
 * @return {Picker}
 */

Picker.prototype.bind = function(){
  this.events = events(this.el, this);
  this.events.bind('mousemove');
  this.events.bind('mousewheel');
  this.events.bind('mouseout');
  this.events.bind('click');
  return this;
};

/**
 * on-click.
 */

Picker.prototype.onclick = function(e){
  e.preventDefault();
  this.abort = 1000 + new Date().getTime();
  this.emit('pick');
};

/**
 * on-mousemove.
 */

Picker.prototype.onmousemove = function(e){
  var abort = this.abort && this.abort > new Date();
  if (abort) return;
  this.abort = null;
  this.move(e.pageY, e.pageX);
};

/**
 * on-mousewheel
 */

Picker.prototype.onmousewheel = function(e){
  e.preventDefault();
  var delta = e.wheelDelta;
  delta += (this.prev || 0);
  if (-500 > delta) return;
  if (500 < delta) return;
  var sat = delta + 500;
  this.color({ sat: sat / 1000 * 100 });
  this.prev = delta;
};

/**
 * on-mouseout
 */

Picker.prototype.onmouseout = function(){
  this.abort = null;
};

/**
 * Refresh.
 * 
 * the method should be called every
 * time the `el` changes height or width.
 * 
 * @return {Picker}
 */

Picker.prototype.refresh = function(){
  this.rect = this.el.getBoundingClientRect();
  return this;
};

/**
 * Pick a color where `y`, `x`.
 * 
 * @param {Number} y
 * @param {Number} x
 * @return {Picker}
 */

Picker.prototype.move = function(y, x){
  y = Math.max(0, y - this.rect.top);
  x = Math.max(0, x - this.rect.left);
  y /= this.rect.height;
  x /= this.rect.width;
  return this.color({
    hue: x * 360,
    lit: y * 100
  });
};

/**
 * Set / get color to `obj`.
 * 
 * @param {Object} obj
 * @return {Object|Picker}
 */

Picker.prototype.color = function(obj){
  if (!obj) return this._color;
  obj = merge(this.color(), obj);
  this.el.style.background = 'hsla('
    + obj.hue + ', '
    + obj.sat + '%, '
    + obj.lit + '%, '
    + 1 + ')';
  return this;
};
