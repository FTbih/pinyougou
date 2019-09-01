app.service("contentService", function ($http) {

    this.findByCategoryId=function (id) {
        $http.get("../content/findByCategoryId?id="+id)
    }

})