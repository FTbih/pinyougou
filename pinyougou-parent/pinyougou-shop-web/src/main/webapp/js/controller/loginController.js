app.controller("loginController", function ($scope, loginService) {
    $scope.showName=function () {
        loginService.showName().success(function (response) {
            $scope.name = response.name;
        })
    }
})