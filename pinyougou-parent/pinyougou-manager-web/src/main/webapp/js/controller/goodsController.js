 //控制层 
app.controller('goodsController' ,function($scope,$controller   ,goodsService, itemCatService){
	
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
	$scope.save=function(){				
		var serviceObject;//服务层对象  				
		if($scope.entity.id!=null){//如果有ID
			serviceObject=goodsService.update( $scope.entity ); //修改  
		}else{
			serviceObject=goodsService.add( $scope.entity  );//增加 
		}				
		serviceObject.success(
			function(response){
				if(response.success){
					//重新查询 
		        	$scope.reloadList();//重新加载
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
	$scope.statusList=["未审核", "审核已通过", "审核未通过", "已驳回"];
	//搜索
	$scope.search=function(page,rows){			
		goodsService.search(page,rows,$scope.searchEntity).success(
			function(response){
				$scope.list=response.rows;	
				$scope.paginationConf.totalItems=response.total;//更新总记录数
			}			
		);
	}

	/*
	查询所有itemCat数据
	 */
	$scope.itemsCatList=[];
	$scope.searchItems=function () {
		itemCatService.findAll().success(
			function (response) {
				for (var i = 0; i < response.length; i++) {
					$scope.itemsCatList[i] = response[i];
				}
			}
		)
	}

	/*
	判断用户点击的是哪个修改状态的按钮
	 */
	$scope.statusFun=function(goodsStatus){
		$scope.goodStatus = goodsStatus;//给状态赋值
		updateStatus();


	}

	/*
	获取checkbox 的id集合
	 */
	updateStatus=function () { //将选中的产品与状态传递给后台
		goodsService.updateStatus($scope.selectIds, $scope.goodStatus).success(
			function (response) {
				if(response.success){
					//重新查询
					$scope.reloadList();//重新加载
					$scope.selectIds=[];
				}else{
					alert(response.message);
				}
			}
		)
	}

	//商品详情页数据回显
	//1 根据页面Id去后台查询商品数据
	// $scope.findOne=function(id){
	// 	var id = $location.search()["id"];
	// 	if(id == null){
	// 		return;
	// 	}
	// 	goodsService.findOne(id).success(
	// 		function(response){
	// 			$scope.entity= response;
	// 			editor.html(response.goodsDesc.introduction);
	// 			$scope.entity.goodsDesc.itemImages = JSON.parse(response.goodsDesc.itemImages);
	// 			$scope.entity.goodsDesc.customAttributeItems = JSON.parse($scope.entity.goodsDesc.customAttributeItems);
	// 			$scope.entity.goodsDesc.specificationItems = JSON.parse($scope.entity.goodsDesc.specificationItems);
	// 			for (var i = 0; i < response.itemList.length; i++) {
	// 				$scope.entity.itemList[i].spec = JSON.parse(response.itemList[i].spec);
	// 			}
	// 		}
	// 	);
	// }

});	
