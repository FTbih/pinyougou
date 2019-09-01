app.controller("baseController", function ($scope){
    //定义分页数据
    $scope.paginationConf = {
        currentPage:1,
        totalItems:100,
        itemsPerPage:10,
        perPageOptions:[10,20,30,40,50],
        onChange:function () {
            $scope.reloadList();
        }
    }

    //刷新页面数据
    $scope.reloadList=function(){
        // $scope.findAll();
        $scope.search($scope.paginationConf.currentPage, $scope.paginationConf.itemsPerPage);

    }

    $scope.selectIds=[];
    //勾选checkbox的方法
    $scope.updateSelection=function ($event, id) {
        if($event.target.checked){
            if($scope.selectIds.indexOf(id)<0){
                $scope.selectIds.push(id);
            }

        }else{
            var number = $scope.selectIds.indexOf(id);
            $scope.selectIds.splice(number, 1);
        }
    }

    $scope.jcBox=function(id){
        for (var i = 0; i < $scope.selectIds.length; i++) {
            if($scope.selectIds[i]==id){
                return true
            }
        }
        return false;
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