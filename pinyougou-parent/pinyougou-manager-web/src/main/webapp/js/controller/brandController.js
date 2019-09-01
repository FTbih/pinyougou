//定义控制器
app.controller("brandController", function ($scope, $http, brandService, $controller) {
    //继承父控制器
    $controller("baseController", {$scope:$scope})

    //定义静态页面调用的方法
    $scope.findAll=function () {
        //请求服务
        brandService.findAll().success(function (response) {
            $scope.list=response;
        })
    }
    //定义静态页面调用的方法
    // $scope.findPage=function (pageNum, pageSize) {
    //     //请求服务
    //     brandService.findPage(pageNum,pageSize,$scope.searchEntity).success(
    //         function (response) {
    //             $scope.list = response.rows;
    //             $scope.paginationConf.totalItems = response.total;
    //         }
    //     )
    // }
    //定义变量
    $scope.searchEntity={};
    $scope.search=function(page,rows){
        brandService.findPage(page,rows,$scope.searchEntity).success(
            function(response){
                $scope.list=response.rows;
                $scope.paginationConf.totalItems=response.total;//更新总记录数
            }
        );
    }
    //定义静态页面调用的方法
    $scope.addBrand=function () {
        var service = null;
        if($scope.entity.id == null){
            service = brandService.addBrand($scope.entity);
        }else{
            service = brandService.updateById($scope.entity);
        }
        //请求服务
        service.success(
            function (response) {
                if(response.success){
                    $scope.reloadList();
                }else{
                    alert(response.message);
                }
            }
        )
    }

    // 定义静态页面调用的方法
    $scope.findOne=function (id) {
        //请求服务
        brandService.findOne(id).success(
            function (response) {
                $scope.entity = response;
            }
        )
    }
    // //定义变量
    // $scope.selectIds = [];

    //定义静态页面调用的方法
    $scope.delById=function () {
        //请求服务
        brandService.delById($scope.selectIds).success(
            function (response) {
                if(response.success){
                    $scope.reloadList();
                }else{
                    alert(response.message);
                }
            }
        )
    }

})