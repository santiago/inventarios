(function() {

  function __on(channel, cb) {
    this.$el.on(channel, cb);
  }

  function MovimientosView() {
    var view = this;
    this.id = 'movimientos';
    this.$el = $('#'+this.id);

    var cambio = this.__cambio = '+';
    this.__insumoId = '';

    // Radios in Movimientos
    $('.i-checks').iCheck({
      checkboxClass: 'icheckbox_square-green',
      radioClass: 'iradio_square-green'
    });

    $('.i-checks').on('ifChecked', function(e) {
      cambio = $(this).find('input').val();
    });

    // Agregar movimiento en click a OK
    this.$el.find('button').click(function(e) {
      e.preventDefault();
      var data = {
        insumoId: view.__insumoId,
        movimiento: parseFloat(cambio+$('.cantidad input').val())
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
    $.post('/api/movimientos', data, function(res) {
      view.$el.trigger('create');
      cb && cb(res);
    });
  };

  MovimientosView.prototype.renderInsumos = function(data) {
    var view = this;
    var $currentSelect = this.$el.find('select');
    var $newSelect = $currentSelect.clone();
    data.forEach(function(d) {
      var $option = $('<option/>');
      $option.text(d.nombre);
      $option.attr('value', d.id);
      $newSelect.append($option);
    });
    $currentSelect = $currentSelect.replaceWith($newSelect);
    $currentSelect = null;
    this.$el.find('.chosen-container').remove();
    $newSelect.chosen({ width: '95%' });
    $newSelect.chosen().change(function(e, d) {
      view.__insumoId = d.selected;
    });

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
    this.$el.find('tr:not(.layout)').remove();
    this.get(function _render(data) {
      cb && cb(data);
      data.forEach(function(r) {
        var $row = $layout.clone();
        $row.find('td:eq(0)').text(r.nombre);
        $row.find('td:eq(1)').text(r.cantidad);
        $row.find('td:eq(2)').text(numeral(r.cantidad * r.costo).format('$0,0.00'));
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
    var movimientosView = new MovimientosView();
    movimientosView.on('create', function() {
      renderInsumos();
    });

    var insumosView = new InsumosView();

    renderInsumos();

    insumosView.on('create', function(e) {
      renderInsumos();
    });

    function renderInsumos() {
      insumosView.render(function(data) {
        movimientosView.renderInsumos(data);
      });
    }
  })();


})();