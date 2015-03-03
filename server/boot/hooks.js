module.exports = function(app) {
  app.models.Movimiento.beforeValidate = function(next) {
    this.fecha = new Date();
    next();
  };

  app.models.Movimiento.afterSave = function(next) {
    var mov = this;
    app.models.Insumo.findById(this.insumoId, function(err, insumo) {
      insumo.cantidad += mov.movimiento;
      insumo.save(next);
    });
  };
}
