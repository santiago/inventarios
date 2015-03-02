(function() {

  (function App() {
    // Chosen select in Movimientos
    $('.chosen-select').chosen({ width: '95%' });

    // Radios in Movimientos
    $('.i-checks').iCheck({
      checkboxClass: 'icheckbox_square-green',
      radioClass: 'iradio_square-green'
    });

    var movimientosView = new MovimientosView();
    var insumosView = new InsumosView();
  })();

  function MovimientosView() {
    $('#movimientos button').click(function(e) {
      e.preventDefault();
      console.log('hola');
    });
  }

  MovimientosView.prototype.get = function() {
    $.get('/movimientos', function(res) {

    });
  };

  MovimientosView.prototype.create = function() {
    $.post('/movimientos', data, function(res) {

    });
  };


  function InsumosView() {
  }

  InsumosView.prototype.get = function() {};
  InsumosView.prototype.create = function() {};
  InsumosView.prototype.update = function() {};
  InsumosView.prototype.delete = function() {};

})();