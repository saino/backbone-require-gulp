// 文件名称: upload_task
//
// 创 建 人: chenshy
// 创建日期: 2015/1/21 15:32
// 描    述: upload_task
define([
],function() {
    var UploadTask = function(data,cb,param){
        this.isFinish = false;
        this._data = data;
        this.callback = cb;
        this._isUploadFail = false;
        this.param = param;

        this._tryCount = 3;
    };

    UploadTask.prototype.upload = function(){
        var self = this;
        var data = this._data;
        if(ms.isBase64(this._data)){
            data = data.substring(data.indexOf(",") + 1);
//            debug.log("upload");
            fmacloud.save_image('.jpg',data, function(file){
//                console.log("uploaded");
                self.isFinish = true;
                if(self.callback){
//                    console.log
                    var param = {};
                    param.format = "jpg";
                    file._url = utils.changeURLImageSize(file.get("url"), param);
                    self.callback(self.param,file);
                    self.callback = null;
                }

            }, function(error){
                  if(self._tryCount > 0){
                      self._tryCount --;
                      self.upload();
                  }else{
                      self._tryCount = 3;
                      self._isUploadFail = true;
                  }

//                if(self.callback){
//                    self.callback = null;
//                }


//                self.isFinish = true;
            });
        }else{
            if(self.callback){
                self.callback(self.param,null);
                self.callback = null;
            }
            self.isFinish = true;
        }
    };

    return UploadTask;
});