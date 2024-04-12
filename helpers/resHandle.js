module.exports = function (res, status, data) {
    if(status){
        res.status(200).send({
            success: true,
            data: data
          })
    }else{
        res.status(400).send({
            success: false,
            data: data
          })
    }
}