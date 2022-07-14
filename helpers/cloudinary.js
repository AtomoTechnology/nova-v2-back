const  cloudinary = require('cloudinary').v2;
cloudinary.config({ 
    cloud_name: 'draxircbk', 
    api_key: '416875141135778', 
    api_secret: 'ZJOJeLBR_75qTwdmxBcAcGO6w3I' 
  });

module.exports = {cloudinary}