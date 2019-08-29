app.service("uploadService", function ($http) {
    this.uploadFile=function () {
        //
        var formData = new FormData();
        //
        formData.append("file", file.files[0]);

        return $http({
            url:"../myUpload.do",

            method:"POST",

            data:formData,
            //文件会自动转化我json，此句可以上传的文件转化为multipart/form-data.
            headers:{'Content-Type':undefined},
            //
            transformRequest:angular.identity
        })
    }

    /*
    this.uploadFile = function(){
        //表单数据
        var formData = new FormData();

        formData.append("upload",document.getElementById("file").files[0]);

        return $http({
           url:"../upload.do",
           method:"post",
           data:formData,
            //multipart/form-data
           headers:{"Content-Type":undefined},
            transformRequest:angular.identify
        });
    }
     */

})