const factory = require('./factoryController');
const { Detail, Order, Product, User, sequelize } = require('../models');
const catchAsync = require('../helpers/catchAsync');

exports.create = catchAsync(async (req, res, next) => {
  const { items } = req.body;
  const result = await sequelize.transaction(async (t) => {
    const order = await Order.create(
      {
        UserId: req.user.uuid,
        status: 'En curso',
        total: req.body.total,
      },
      { transaction: t }
    );

    for (let i = 0; i < items.length; i++) {
      await Detail.create(
        {
          OrderId: order.uuid,
          ProductId: items[i].product.uuid,
          quantity: items[i].quantity,
          storage: items[i].storage,
          colour: items[i].colour,
        },
        { transaction: t }
      );
      const pro = await Product.findOne({ where: { id: items[i].product.id } }, { transaction: t });
      pro.stock = pro.stock - items[i].quantity;
      await pro.save();
    }

    return res.json({
      ok: true,
      status: 'success',
      message: 'Pedido realizado con exito',
      id: order.id.toString(),
    });
  });

  // try {
  //   const result = await sequelize.transaction(async (t) => {
  //     const order = await Order.create(
  //       {
  //         UserId: req.user.uuid,
  //         status: 'En curso',
  //         total: req.body.total,
  //       },
  //       { transaction: t }
  //     );
  //     req.body.items.forEach(async (elem) => {
  //       await Detail.create(
  //         {
  //           OrderId: order.uuid,
  //           ProductId: elem.product.uuid,
  //           quantity: elem.quantity,
  //           storage: elem.storage,
  //           colour: elem.colour,
  //         },
  //         { transaction: t }
  //       );
  //       const pro = await Product.findOne({ where: { id: elem.product.id } }, { transaction: t });
  //       pro.stock = pro.stock - elem.quantity;
  //       await pro.save({ transaction: t });
  //     });

  //     return res.json({
  //       ok: true,
  //       status: 'success',
  //       message: 'Pedido realizado con exito',
  //       id: order.id.toString(),
  //     });
  //   });
  // } catch (error) {
  //   res.json({
  //     ok: false,
  //     status: 'fail',
  //     message: 'No se ha podido realizar el pedido . Intente otra vez. ',
  //   });
  // }
});
exports.all = factory.all(Order, {
  include: [
    { model: User, attributes: ['name'] },
    {
      model: Detail,
      attributes: ['storage', 'colour', 'quantity'],
      include: [{ model: Product, attributes: ['id', 'uuid', 'trademark', 'model', 'price', 'photos'] }],
    },
  ],
});
exports.delete = factory.delete(Order);
exports.update = factory.update(Order, ['status']);
exports.DeleteAll = factory.deleteAll(Order);
