(function() {

  function __on(channel, cb) {
    this.$el().on(channel, cb);
  }

  function MovimientosView() {
    var view = this;
    this.id = 'movimientos';
    this.$el = function() { return $('#'+this.id); }

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
    this.$el().find('button').click(function(e) {
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

  MovimientosView.prototype.render = function(cb) {
    var view = this;
    Insumos.get(function _render(data) {
      cb(data);
    });
  };

  MovimientosView.prototype.renderInsumos = function(data) {
    var view = this;

    if(data) {
      dust.render('movimientos', { insumos: data }, function(err, result) {
        view.$el().empty();
        view.$el().append($(result).html());
      });
    }

    var $select = this.$el().find('select');
    $select.chosen({ width: '95%' });
    $select.chosen().change(function(e, d) {
      view.__insumoId = d.selected;
    });
  };

  MovimientosView.prototype.on = __on;

  function InsumosView() {
    this.id = 'insumos';
    this.$el = function() { return $('#insumos') };

    var view = this;
    this.__data = [];
    // Modal Nuevo Insumo
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

      Insumos.create(data, function(res) {
        view.$el().trigger('create', [res]);
      });
    });
  }

  InsumosView.prototype.on = __on;

  InsumosView.prototype.render = function(cb) {
    var view = this;
    Insumos.get(function _render(data) {
      dust.render('insumos', { insumos: data, total: totalInsumo(data) }, function(err, result) {
        view.$el().empty();
        view.$el().append($(result).html());
      });
      cb(data);
    });
  };

  function Insumos() {}

  Insumos.get = function(cb) {
    $.getJSON('/api/insumos', cb);
  };

  Insumos.create = function(data, cb) {
    $.post('/api/insumos', data, cb);
  };

  Insumos.update = function() {
  };

  Insumos.delete = function() {};

  function totalInsumo(data) {
    return function(chunk, context, bodies, params) {
      var ctx = context.stack.index; // Should I be doing this?
      var r = data[ctx];
      return numeral(r.cantidad * r.costo).format('$0,0.00')
    };
  }

  // Start UI application
  (function App() {
    var movimientosView, insumosView;

    Insumos.get(function(data) {
      dust.render('inventarios', { insumos: data, total: totalInsumo(data) }, function(err, result) {
        $('[main-view]').append(result);

        insumosView = new InsumosView();
        insumosView.on('create', function(e) { refresh(); });

        movimientosView = new MovimientosView();
        movimientosView.renderInsumos();
        movimientosView.on('create', function() { refresh(); });
      });
    });

    function refresh() {
      insumosView.render(function(data) {
        movimientosView.renderInsumos(data);
      });
    }
  })();
})();