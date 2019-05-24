/*
 Created by Johnpaul Chukwu @ $
*/
function saveRequest(Model,validatedRequest,res){
  let productModel = new Model(validatedRequest);
  productModel.save(function (err) {
    if (err) {
      res.status(500).json({
        success: false,
        message: 'An error occurred',
        error: err
      });
    } else {
      res.status(200).json({
        success: true,
        message: 'Product has been created'
      });
    }
  });
}

module.exports = saveRequest;
