app.controller("contentController", function ($scope, $controller, contentService) {

    $controller('baseController',{$scope:$scope});//继承

    //根据广告类别id查询广告


    $scope.contentsByCategoryId = [];
    $scope.findByCategoryId=function (id) {
        contentService.findByCategoryId(id).success(
            function (response) {
                //按照id分类存入广告数组中
                $scope.contentsByCategoryId[id] = response;
            }
        )
    }

})