(function($) {
  var _events = ['click', 'mousemove', 'mousewheel', 'mouseout'];

  function Picker(el){
    this._color = {};
    this.el = el;
    this.freeze(1000);
    this.refresh();
    this.bind();
    this.color({
      hue: 180,
      sat: 50,
      lit: 50
    });
  }

  Picker.prototype.bind = function(){
    var that = this
        event;

    $.each(_events, function(i, event) {
      event = _events[i];
      that.el.bind(event, function(){
        that['on' + event].apply(that, arguments);
      });
    });

    return this;
  };

  Picker.prototype.unbind = function(){

    for (var i in _events) {
      //this unbinds *all* the handlers, which isn't actually right
      this.el.unbind(_events['on' + i]);
    }
    return this;
  };

  Picker.prototype.onclick = function(e){
    e.preventDefault();
    this.await = this.freeze() + new Date().getTime();
    this.el.trigger('pick', this.el);
  };

  Picker.prototype.onmousemove = function(e){
    var await = this.await && this.await > new Date();
    if (await) return;
    this.await = null;
    this.move(e.pageY, e.pageX);
  };

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

  Picker.prototype.onmouseout = function(){
    this.abort = null;
  };

  Picker.prototype.freeze = function(ms){
    if (!ms) return this._freeze;
    this._freeze = ms;
    return this;
  };

  Picker.prototype.refresh = function(){
    this.rect = this.el.get(0).getBoundingClientRect();
    return this;
  };

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

  Picker.prototype.color = function(obj){
    if (!obj) return this._color;
    obj = $.extend(this.color(), obj);
    this.el.css('background', this.hsla(obj));
    return this;
  };

  Picker.prototype.hsla = function(obj) {
    return 'hsla('
      + obj.hue + ', '
      + obj.sat + '%, '
      + obj.lit + '%, '
      + 1 + ')';
  };

  $.fn.colorPicker = function(input) {
    return this.each(function(i, el) {
      var picker;
      var $el = $(el);
      if (typeof input === 'string') {
        picker = $el.data('colorPicker');
        if (picker[input]) {
          picker[input].apply(picker, Array.prototype.slice.call(arguments, 1))
        }
      }
      picker = new Picker($el);
      $el.data('colorPicker', picker);
      return this;
    });
  }

})(jQuery);
