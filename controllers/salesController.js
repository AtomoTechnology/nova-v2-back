const factory = require('./factoryController');
const { Detail, Order, Product, User } = require('../models');
const catchAsync = require('../helpers/catchAsync');

exports.create = catchAsync(async (req, res, next) => {
  const order = await Order.create({
    UserId: req.user.uuid,
    status: 'En curso',
    total: req.body.total,
  });
  req.body.items.forEach(async (elem) => {
    await Detail.create({
      OrderId: order.uuid,
      ProductId: elem.product.uuid,
      quantity: elem.quantity,
      storage: elem.storage,
      colour: elem.colour,
    });
  });

  res.json({
    ok: true,
    status: 'success',
    message: 'Pedido realizado con exito',
    id: order.id.toString(),
  });

  // const doc = await model.create(filteredFields);
  // console.log(doc.dataValues);

  // if (action != null) {
  //   if (action.mail) {
  //     await new EmailContact(doc.dataValues).sendContact();
  //   }
  // }

  // res.status(201).json({
  //   status: 'success',
  //   data: {
  //     data: doc,
  //   },
  // });
});
exports.all = factory.all(Order, {
  include: [
    { model: User, attributes: ['name'] },
    {
      model: Detail,
      attributes: ['storage', 'colour', 'quantity'],
      include: [{ model: Product, attributes: ['id', 'uuid', 'trademark', 'model', 'price'] }],
    },
  ],
});
exports.delete = factory.delete(Detail);
exports.update = factory.update(Detail, ['quantity']);
exports.DeleteAll = factory.deleteAll(Detail);
