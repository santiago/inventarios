(function() {

  function __on(channel, cb) {
    this.$el.on(channel, cb);
  }

  function MovimientosView() {
    this.id = 'movimientos';
    this.$el = $('#'+this.id);

    // Agregar movimiento en click a OK
    $(this.id+' button').click(function(e) {
      e.preventDefault();
      var data = {
        insumoId: $('.chosen-select').chosen(),
        movimiento: parseFloat($('.cantidad input').val())
      };

      if(!data.insumoId) { console.error('falta insumoId'); return; }
      if(!data.movimiento) { console.error('falta movimiento'); return; }
      view.create(data);
    });
  }

  MovimientosView.prototype.get = function(cb) {
    $.get('/movimientos', function(res) { cb && cb(res); });
  };

  MovimientosView.prototype.create = function(data, cb) {
    var view = this;
    $.post('/movimientos', data, function(res) {
      view.$el.trigger('create', [res]);
      cb && cb(res);
    });
  };

  MovimientosView.prototype.renderInsumos = function(data) {
    var $currentSelect = this.$el.find('select');
    var $newSelect = $currentSelect.clone();
    console.log($newSelect.get(0));
    $currentSelect = $currentSelect.replaceWith($newSelect);
    $currentSelect = null;
    data.forEach(function(d) {
      var $option = $('<option/>');
      $option.text(d.nombre);
      $option.attr('value', d.id);
      console.log($option.get(0));
      $newSelect.append($option);
    });
    $newSelect.chosen({ width: '95%' });
  };

  MovimientosView.prototype.on = __on;

  function InsumosView() {
    this.id = 'inventarios';
    this.$el = $('#inventarios');

    var view = this;
    this.__data = [];
    $('#modal-form form button').click(function(e) {
      e.preventDefault();
      var $form = $(this).closest('form');
      var data = {
        nombre: $form.find('[name=nombre]').val(),
        marca: $form.find('[name=marca]').val(),
        unidad: $form.find('[name=unidad]').val(),
        costo: $form.find('[name=costo]').val(),
        cantidad: $form.find('[name=cantidad]').val()
      };
      if(!data.nombre) { return; }
      if(!data.unidad) { return; }
      if(!data.costo) { return; }

      view.create(data, function() {

      });
    });
  }

  InsumosView.prototype.on = __on;

  InsumosView.prototype.render = function(cb) {
    var $layout = $('#inventarios table tr.layout').clone();
    $layout.removeClass('layout');
    this.get(function _render(data) {
      cb && cb(data);
      data.forEach(function(r) {
        var $row = $layout.clone();
        $row.find('td:eq(0)').text(r.nombre);
        $row.find('td:eq(1)').text(r.cantidad);
        $row.find('td:eq(2)').text('$'+(r.cantidad * r.costo));
        $('#inventarios table').append($row);
      });
    });
  };

  InsumosView.prototype.get = function(cb) {
    var view = this;
    $.getJSON('/api/insumos', function(res) {
      view.__data = res;
      cb && cb(res);
    });
  };

  InsumosView.prototype.create = function(data, cb) {
    var view = this;
    $.post('/api/insumos', data, function(res) {
      view.$el.trigger('create', [res]);
      cb && cb(res);
    });
  };
  InsumosView.prototype.update = function() {};
  InsumosView.prototype.delete = function() {};

  // Start UI application
  (function App() {
    // Chosen select in Movimientos
    // $('.chosen-select').chosen({ width: '95%' });

    // Radios in Movimientos
    $('.i-checks').iCheck({
      checkboxClass: 'icheckbox_square-green',
      radioClass: 'iradio_square-green'
    });

    var movimientosView = new MovimientosView();
    movimientosView.on('create', function() {
      console.log('created');
    });

    var insumosView = new InsumosView();
    insumosView.render(function(data) {
      movimientosView.renderInsumos(data);
    });
    insumosView.on('create', function(e, d) {
      movimientosView.renderInsumos(d);
    });
  })();


})();