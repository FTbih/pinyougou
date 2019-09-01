app.service("brandService", function ($http) {

    this.findAll=function () {
        return $http.get("../brand/findAll.do");
    }

    this.findPage=function (pageNum,pageSize,searchEntity) {
        return $http.post("../brand/findByPage.do?pageNum="+pageNum+"&pageSize="+pageSize+"",searchEntity);
    }

    this.addBrand=function (entity) {
        return $http.post("../brand/addBrand.do", entity);
    }

    this.updateById=function (entity) {
        return $http.post("../brand/updateById.do", entity);
    }

    this.findOne=function (id) {
        return $http.get("../brand/findOne.do?id="+id+"");
    }

    this.delById=function (ids) {
        return $http.post("../brand/deleteById.do", ids);
    }

    this.findOptionList=function () {
        return $http.get("../brand/selectOptionList.do");
    }
    //搜索
    this.search=function(page,rows,searchEntity){
        return $http.post('../brand/search.do?page='+page+"&rows="+rows, searchEntity);
    }

})