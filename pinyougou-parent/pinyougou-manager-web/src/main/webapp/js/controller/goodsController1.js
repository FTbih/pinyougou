//控制层
app.controller('goodsController1' ,function($scope,$controller,$location   ,goodsService, uploadService, itemCatService, typeTemplateService){

    $controller('baseController',{$scope:$scope});//继承

    //读取列表数据绑定到表单中
    $scope.findAll=function(){
        goodsService.findAll().success(
            function(response){
                $scope.list=response;
            }
        );
    }

    //分页
    $scope.findPage=function(page,rows){
        goodsService.findPage(page,rows).success(
            function(response){
                $scope.list=response.rows;
                $scope.paginationConf.totalItems=response.total;//更新总记录数
            }
        );
    }

    //查询实体
    $scope.findOne=function(id){
        var id = $location.search()["id"];
        if(id == null){
            return;
        }
        goodsService.findOne(id).success(
            function(response){
                $scope.entity= response;
                editor.html(response.goodsDesc.introduction);
                $scope.entity.goodsDesc.itemImages = JSON.parse(response.goodsDesc.itemImages);
                $scope.entity.goodsDesc.customAttributeItems = JSON.parse($scope.entity.goodsDesc.customAttributeItems);
                $scope.entity.goodsDesc.specificationItems = JSON.parse($scope.entity.goodsDesc.specificationItems);
                for (var i = 0; i < response.itemList.length; i++) {
                    $scope.entity.itemList[i].spec = JSON.parse(response.itemList[i].spec);
                }
            }
        );
    }

    //保存
    $scope.add=function(){
        $scope.entity.goodsDesc.introduction=editor.html();
        if($scope.entity.goods.id!=null){
            goodsService.update($scope.entity).success(
                function (response) {
                    if(response.success){
                        alert("修改成功");
                        location.href="goods.html";
                        // $scope.entity={};
                        // editor.html("");
                    }else{
                        alert(response.message);
                    }
                }
            )
        }else{
            goodsService.add($scope.entity).success(
                function(response){
                    if(response.success){
                        alert("新增成功");
                        $scope.entity={};
                        editor.html("");
                    }else{
                        alert(response.message);
                    }
                }
            );
        }

    }


    //批量删除
    $scope.dele=function(){
        //获取选中的复选框
        goodsService.dele( $scope.selectIds ).success(
            function(response){
                if(response.success){
                    $scope.reloadList();//刷新列表
                    $scope.selectIds=[];
                }
            }
        );
    }

    $scope.searchEntity={};//定义搜索对象
    $scope.auditStatus=['未审核', '审核通过', '审核未通过', '已关闭'];

    //搜索
    $scope.search=function(page,rows){
        goodsService.search(page,rows,$scope.searchEntity).success(
            function(response){
                $scope.list=response.rows;
                $scope.paginationConf.totalItems=response.total;//更新总记录数
            }
        );
    }

    //上传文件
    //给上传商品图片的界面绑定数据，这个数据存储一个对象，这个对象对应entity.goodsDesc.itemImages,我们新建一个对象image_entity
    //点击上传通过formData.append("file", file.files[0]);自动获取文件
    //entity.goodsDesc.itemImages这个字段对应一个对象，格式为{"color":"颜色","url":"图片在fastDFS上的存储地址"}
    //首先entity是一个组合实体类，里面存储的数据对应两张表，一张表时goods，一张表是goodsDesc
    //

    $scope.uploadFile=function () {
        uploadService.uploadFile().success(
            function (response) {
                if(response.success){
                    //response.message内容是fastDFS上图片的url，将这个url赋值给entity.goodsDesc.itemImages.url
                    //同时，这个$scope.entity.goodsDesc.itemImages.url通过ng-model绑定给了上传界面的img标签上
                    //当这个有值时，那边会立刻显示出来图片
                    $scope.image_entity.url = response.message;
                }else{
                    alert(response.message);
                }
            }
        )
    }

    $scope.entity={goods:{}, goodsDesc:{itemImages:[], customAttributeItems:[{text:{}, value:{}}]}};
    $scope.addImages=function () {

        $scope.entity.goodsDesc.itemImages.push($scope.image_entity);

    }

    $scope.deleImage=function (index) {
        $scope.entity.goodsDesc.itemImages.splice(index, 1);
    }

    $scope.findItemList1=function(){
        itemCatService.findByParentId(0).success(
            function (response) {
                $scope.itemsList1 = response;
            })
    }


    $scope.$watch("entity.goods.category1Id", function (newValue, oldValue) {
        if(newValue) {
            itemCatService.findByParentId(newValue).success(
                function (response) {
                    $scope.itemsList2 = response;
                    $scope.itemsList3 = null;
                })
        }
    })

    $scope.$watch("entity.goods.category2Id", function (newValue, oldValue) {
        if(newValue) {
            itemCatService.findByParentId(newValue).success(
                function (response) {
                    $scope.itemsList3 = response;
                })
        }
    })

    $scope.$watch("entity.goods.category3Id", function (newValue, oldValue) {
        if(newValue){
            itemCatService.findOne(newValue).success(
                function(response){
                    $scope.entity.goods.typeTemplateId=response.typeId; //更新模板ID
                }
            );}


    })

    //监视entity.goods.category3Id，一旦发生改变，就查询type_template表数据
    $scope.$watch("entity.goods.typeTemplateId", function (newValue, oldValue) {
        if(newValue){
            typeTemplateService.findOne(newValue).success(
                function (response) {
                    $scope.typeTemplateIds = JSON.parse(response.brandIds);
                    if($location.search()["id"]==null) {
                        $scope.entity.goodsDesc.customAttributeItems = JSON.parse(response.customAttributeItems);
                    }
                }
            )

            typeTemplateService.findSpecList(newValue).success(

                function (response) {

                    $scope.specList=response;
                }
            )
        }

    })
    // {"attributeName":{}, "attributeValue":[]}
    $scope.entity={goods:{}, goodsDesc:{specificationItems:[],itemImages:[], customAttributeItems:[{text:{}, value:{}}]}};
    $scope.Axx=function (event, key, value) {
        var obj = $scope.isKeyInList($scope.entity.goodsDesc.specificationItems, "attributeName", key);
        if(obj){
            if(event.target.checked){
                obj.attributeValue.push(value);
            }else{
                obj.attributeValue.splice(obj.attributeValue.indexOf(value), 1);
                if(obj.attributeValue.length==0){
                    $scope.entity.goodsDesc.specificationItems.splice($scope.entity.goodsDesc.specificationItems.indexOf(obj), 1);
                }
            }

        }else{
            $scope.entity.goodsDesc.specificationItems.push({"attributeName":key, "attributeValue":[value]})
        }

    }


    //创建SKU列表
    $scope.createItemList=function(){
        $scope.entity.itemList=[{spec:{},price:0,num:99999,status:'0',isDefault:'0' } ];//初始
        var items = $scope.entity.goodsDesc.specificationItems;
        //需要将items中的元素相互组合，所以需要遍历items
        for (var i = 0; i < items.length; i++) {
            var columnName = items[i].attributeName;//网络；机身内存
            var columnValues = items[i].attributeValue; //数组，需要遍历 ["移动3G","移动4G"];["16G","32G"]
            $scope.entity.itemList = addColumn($scope.entity.itemList, columnName, columnValues);
        }
    }

    addColumn=function (list, columnName, columnValues) {
        var newList = []; //数组，本质就是$scope.entity.itemList
        for (var i = 0; i < list.length; i++) { //遍历传递进来的list，为什么遍历这个list，原因在于attributeName有两个值
            var oldRow = list[i]; //不能直接修改list[i]
            for (var j = 0; j < columnValues.length; j++) { //遍历["移动3G","移动4G"]
                var newRow = JSON.parse(JSON.stringify(oldRow));
                newRow.spec[columnName] = columnValues[j];
                newList.push(newRow);
            }
        }
        return newList;
    }

    $scope.itemLists=[];
    //查询itemcat的所有数据
    $scope.findAllItems=function () {
        itemCatService.findAll().success(
            function (response) {

                for (var i = 0; i < response.length; i++) {
                    $scope.itemLists[response[i].id] = response[i].name;
                }
            }
        )
    }

//添加列值
    $scope.checkAttributeValue=function (opName, opValue) {
        var spItems = $scope.entity.goodsDesc.specificationItems;
        var obj = $scope.isKeyInList(spItems, "attributeName", opName);
        if(obj){
            if(obj.attributeValue.indexOf(opValue)>=0){
                return true;
            }else{
                return false;
            }

        }else{
            return false;
        }

    }
});
