 //控制层 
app.controller('goodsController' ,function($scope,$controller   ,goodsService, uploadService, itemCatService, typeTemplateService){
	
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
		goodsService.findOne(id).success(
			function(response){
				$scope.entity= response;					
			}
		);				
	}

	//保存 
	$scope.add=function(){
		$scope.entity.goodsDesc.introduction=editor.html();
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
					$scope.entity.goodsDesc.customAttributeItems=JSON.parse(response.customAttributeItems);
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






});	
