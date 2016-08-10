// 文件名称: upload_taskschedule
//
// 创 建 人: chenshy
// 创建日期: 2015/1/21 15:14
// 描    述: 上传的任务调度器
define([
    'common/services/task/upload_task',
    'common/services/task/upload_voice_task'
],function(UploadTask, VoiceUploadTask) {
    var uploadTaskSchedule = {
        tasks : [],
        failTask : [],
        isFinish : true,
        _timer : null,
        currentTask : null,
        _count : 0,
        addTask : function(task){
            this.tasks.push(task);
//            console.log("len:" + this.tasks.length);
            if(this.isFinish){
//                console.log("len:" + this.tasks.length);
                this.currentTask = this.tasks.shift();
                task.upload();
                this._count = 0;
                this.isFinish = false;
                this._timer = window.setInterval(this.__timerHandle,1000);
            }
        },

        addUploadTask : function(uploadData,cb,param){
            var task = new UploadTask(uploadData,cb,param);
            this.addTask(task);
        },

        addVoiceUploadTask : function(file, cb_ok, param){
            var task = new VoiceUploadTask(file, cb_ok, param);
            this.addTask(task);
        },

        hasTask : function(uploadData){
            if(this.currentTask && this.currentTask._data == uploadData){
                return true;
            }
            var i, tk, len;
            len = this.tasks.length;
            for(i=0; i<len; i++){
                tk = this.tasks[i];
                if(tk._data == uploadData){
                    return true;
                }
            }
            len = this.failTask.length;
            for(i=0; i<len; i++){
                tk = this.failTask[i];
                if(tk._data == uploadData){
                    return true;
                }
            }

            return false;
        },

        _timerHandle : function(){
//            console.log(this.tasks.length);
            if((this.currentTask && this.currentTask.isFinish) || (this.currentTask._isUploadFail) || this._count >= 360){

                if(this.currentTask._isUploadFail){
                    this.currentTask._isUploadFail = false;
                    this.failTask.push(this.currentTask);
                }

                if(this.tasks.length == 0){
                    this.isFinish = true;
                    window.clearInterval(this._timer);
                    this._timer = null;
                    this._count = 0;
                    this.currentTask = null;
                    topEvent.trigger("upload_taskschedule_finished");
//                    console.log("ttttttttttttt");
                }else{
                    this.currentTask = this.tasks.shift();
                    this._count = 0;
                    this.currentTask.upload();
                }
            }
//            else if(this.currentTask._isUploadFail){
//                this.failTask.push(this.currentTask);
//                this._count = 0;
//            }
            this._count++;
        },

        isUploadSuccess : function(){
            return this.tasks.length == 0 && this.failTask.length == 0;
        },

        uploadFailTask : function(){
            while(this.failTask.length > 0){
                this.addTask(this.failTask.pop());
            }
        },

        clear : function(){
            this.isFinish = true;
            this._count = 0;
            this.tasks.length = 0;
            this.failTask.length = 0;
            if(this._timer){
                window.clearInterval(this._timer);
                this._timer = null;
                this.currentTask = null;
            }
        },

        __timerHandle : null,

        init : function(){
            this.__timerHandle = this._timerHandle.bind(this)
        }
    };

    uploadTaskSchedule.init();

    return uploadTaskSchedule;
});