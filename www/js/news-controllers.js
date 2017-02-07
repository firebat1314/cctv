angular.module('news-controllers', [])

.controller('NewsCtrl', function($ionicHistory, $scope, $data, $rootScope, $state, $ionicLoading, $timeout, $stateParams, $ionicPopup, $ionicBackdrop, $ionicPopover, $window, $ionicScrollDelegate, $ionicPosition, $ionicSlideBoxDelegate,$ionicModal) {
	$scope.$on('$ionicView.afterEnter',function(){
		$data.getBanner().success(function(data) {
			// console.log(data);
			$scope.bannerList = data.data;
			$ionicSlideBoxDelegate.update();
			$ionicSlideBoxDelegate.$getByHandle("slideboximgs").loop(true);
		});	 	
	})
	
	$scope.goNewDetailPage = function(catid) {
		if (catid != undefined) {
			$state.go('tab.new-detail', {
				chatId: catid
			})
		}
	};

	$scope.doRefresh = function() {
		$data.getHomeData()
			.success(function(newItems) {
				// console.log(newItems);
				if (newItems.status == '1') {
					$scope.items = newItems;
					$data.storeData('homeData', newItems);
				}
			})
			.error(function() {
				$data.loadingShow('更新失败');
				$scope.items = $data.storeData('homeData');
			})
			.finally(function() {
				$timeout(function() {
					$scope.$broadcast('scroll.refreshComplete');
				}, 100)
			});
	};
	$scope.doRefresh();
	
	$scope.pageStatus = function(index) {
		$ionicSlideBoxDelegate.$getByHandle('importance').slide(index);
	};
	$scope.slideHasChanged = function($index) {
		$('.button-list-wrap').children().eq($index).addClass('selected').siblings().removeClass('selected');
	};
	$scope.uploadMore = function(){
		var currentIndex = $ionicSlideBoxDelegate.$getByHandle('importance').currentIndex();
		switch(currentIndex){
			case 0:$state.go('tab.news-importance');break;
			case 1:$state.go('tab.news-plan');break;
			case 2:$state.go('tab.news-interflow');
		}
	}
})
/*重要通知*/
.controller('NewsImportanceCtrl',function($scope,$data, $state,$timeout, $stateParams,$ionicScrollDelegate){
	$scope.newValue;//搜索关键字
	$scope.getDetails = function(searchs) {
		$scope.noMore = true;
		$scope.newValue = searchs;
		$data.getHomeDataList({
			kw:$scope.newValue,
			catid:3
		}).success(function(data) {
			// console.log(data);
			$scope.items = data.data;
			$scope.page = 1;
		})
	};
	$scope.getDetails('');

	$scope.size = 10;
	$scope.page =1;
	$scope.items = [];
	$scope.loadMore = function() {
		$scope.page ++;
		$data.getHomeDataList({
			catid:3,
			kw:$scope.newValue,
			size: $scope.size,
			page: $scope.page
		}).success(function(data){
			// console.log(data);
			$scope.noMore = $data.isNoMore(data,$scope.size);
			Array.prototype.push.apply($scope.items, data.data);
		}).finally(function() {
				$timeout(function(){
					$scope.$broadcast('scroll.infiniteScrollComplete');		 	
				},100)
		});
	};
	/*跳转详情页面*/
	$scope.goNewDetailPage = function(catid) {
		if (catid != undefined) {
			$state.go('tab.new-detail', {
				chatId: catid
			})
		}
	};
	/*滑动打开搜索栏*/
	$scope.openSearch = function(){
		if ($ionicScrollDelegate.getScrollPosition().top < -50) {
		    $(".search-place").css({
		        "top": "100px",
		        "-webkit-transition": "top 0.6s"
		    });
		} else if ($ionicScrollDelegate.getScrollPosition().top > 1) {
		    $(".search-place").css({
		        "top": "44px",
		        "-webkit-transition": "top 0.6s"

		    })
		}
	}
	/*点击打开搜索栏*/
	$scope.searchClick = function(){
	    $(".search-place").css({
	        "top": "100px",
	        "-webkit-transition": "top 0.6s"
	    })
	}
})
/*策划约稿*/
.controller('NewsPlanCtrl',function($scope,$data, $state,$timeout, $stateParams,$ionicScrollDelegate){
	$scope.newValue;//搜索关键字
	$scope.getDetails = function(searchs) {
		$scope.noMore = true;
		$scope.newValue = searchs;
		$data.getHomeDataList({
			kw:$scope.newValue,
			catid:37
		}).success(function(data) {
			// console.log(data);
			$scope.items = data.data;
			$scope.page = 1;
		})
	};
	$scope.getDetails('');
	
	$scope.size = 10;
	$scope.page =1;
	$scope.items = [];
	$scope.loadMore = function() {
		$scope.page ++;
		$data.getHomeDataList({
			catid:37,
			kw:$scope.newValue,
			size: $scope.size,
			page: $scope.page
		}).success(function(data){
			// console.log(data);
			$scope.noMore = $data.isNoMore(data,$scope.size);
			Array.prototype.push.apply($scope.items, data.data);
		}).finally(function() {
			$timeout(function(){
				$scope.$broadcast('scroll.infiniteScrollComplete');		 	
			},100)
			
		});
	};
	/*跳转详情页面*/
	$scope.goNewDetailPage = function(catid) {
		if (catid != undefined) {
			$state.go('tab.new-detail', {
				chatId: catid
			})
		}
	};
	/*滑动打开搜索栏*/
	$scope.openSearch = function(){
		if ($ionicScrollDelegate.getScrollPosition().top < -50) {
		    $(".search-place").css({
		        "top": "100px",
		        "-webkit-transition": "top 0.6s"
		    });
		} else if ($ionicScrollDelegate.getScrollPosition().top > 1) {
		    $(".search-place").css({
		        "top": "44px",
		        "-webkit-transition": "top 0.6s"

		    })
		}
	}
	/*点击打开搜索栏*/
	$scope.searchClick = function(){
	    $(".search-place").css({
	        "top": "100px",
	        "-webkit-transition": "top 0.6s"
	    })
	}
})
/*业务交流*/
.controller('NewsInterflowCtrl',function($scope,$data, $state,$timeout, $stateParams,$ionicScrollDelegate){
	$scope.newValue;//搜索关键字
	$scope.getDetails = function(searchs) {
		$scope.noMore = true;
		$scope.newValue = searchs;
		$data.getHomeDataList({
			kw:$scope.newValue,
			catid:9
		}).success(function(data) {
			// console.log(data);
			$scope.items = data.data;
			$scope.page = 1;
		})
	};
	$scope.getDetails('');

	$scope.size = 10;
	$scope.page =1;
	$scope.items = [];
	$scope.loadMore = function() {
		$scope.page ++;
		$data.getHomeDataList({
			catid:9,
			kw:$scope.newValue,
			size: $scope.size,
			page: $scope.page
		}).success(function(data){
			// console.log(data);
			$scope.noMore = $data.isNoMore(data,$scope.size);
			Array.prototype.push.apply($scope.items, data.data);
		}).finally(function() {
			$timeout(function(){
				$scope.$broadcast('scroll.infiniteScrollComplete');		 	
			},100)
			
		});
	};
	/*跳转详情页面*/
	$scope.goNewDetailPage = function(catid) {
		if (catid != undefined) {
			$state.go('tab.new-detail', {
				chatId: catid
			})
		}
	};
	/*滑动打开搜索栏*/
	$scope.openSearch = function(){
		if ($ionicScrollDelegate.getScrollPosition().top < -50) {
		    $(".search-place").css({
		        "top": "100px",
		        "-webkit-transition": "top 0.6s"
		    });
		} else if ($ionicScrollDelegate.getScrollPosition().top > 1) {
		    $(".search-place").css({
		        "top": "44px",
		        "-webkit-transition": "top 0.6s"

		    })
		}
	}
	/*点击打开搜索栏*/
	$scope.searchClick = function(){
	    $(".search-place").css({
	        "top": "100px",
	        "-webkit-transition": "top 0.6s"
	    })
	}
})
/*新闻*/
.controller('NewDetailCtrl', function($scope, $data, $rootScope, $state, $ionicLoading, $timeout, $stateParams, $ionicPopup, $ionicBackdrop, $ionicPopover, $window, $ionicScrollDelegate, $ionicPosition, $ionicHistory) {
	$scope.chatIdName = $stateParams.chatId;
	$data.getNewsDetails($scope.chatIdName).success(function(res) {
		// console.log(res);
		$scope.details = res;
	});
})