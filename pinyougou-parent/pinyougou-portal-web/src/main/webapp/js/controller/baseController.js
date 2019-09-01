app.controller("baseController", function ($scope){
    //定义分页数据
    $scope.paginationConf = {
        currentPage:1,
        totalItems:10,
        itemsPerPage:5,
        perPageOptions:[10,20,30,40,50],
        onChange:function () {
            $scope.reloadList();
        }
    }

    //刷新页面数据
    $scope.reloadList=function(){
        $scope.search($scope.paginationConf.currentPage, $scope.paginationConf.itemsPerPage);
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

    //定义一个数组
    //[{"attributeName":"网络","attributeValue":["移动4G"]},{"attributeName":"屏幕尺寸","attributeValue":["5.5寸","4.5寸"]}]
    //这个数组中对象的格式为{"attributeName":"网络","attributeValue":["移动4G"]}
    //现在，页面传来一个对象obj，我遍历数组，拿obj.attributeName在数组中查，如果没查到，返回null，如果查到了，返回对象
    $scope.isKeyInList=function (list, key, value) {
        for (var i = 0; i < list.length; i++) {
            if(list[i][key]==value){
                return list[i];
            }
        }
        return  null;
    }



})