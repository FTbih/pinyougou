app.controller("baseController", function ($scope){
    //定义分页数据
    $scope.paginationConf = {
        currentPage:1,
        totalItems:100,
        itemsPerPage:5,
        perPageOptions:[10,20,30,40,50],
        onChange:function () {
            $scope.reloadList();
        }
    }

    //刷新页面数据
    $scope.reloadList=function(){
        $scope.findPage($scope.paginationConf.currentPage, $scope.paginationConf.itemsPerPage);
    }

    $scope.selectIds=[];
    //勾选checkbox的方法
    $scope.updateSelection=function ($event, id) {
        if($event.target.checked){
            $scope.selectIds.push(id);
        }else{
            var number = $scope.selectIds.indexOf(id);
            $scope.selectIds.splice(number, 1);
        }
    }

    $scope.jsonToString=function (jsonString, key) {
        var parse = JSON.parse(jsonString);
        var value = "";
        for (var i = 0; i < parse.length; i++) {
            if(i>0){
                value += ", ";
            }
            value += parse[i][key];
        }
        return value;
    }
})