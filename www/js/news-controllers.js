angular.module('news-controllers', [])

.controller('NewsCtrl', function($ionicHistory, $scope, $data, $rootScope, $state, $ionicLoading, $timeout, $stateParams, $ionicPopup, $ionicBackdrop, $ionicPopover, $window, $ionicScrollDelegate, $ionicPosition, $ionicSlideBoxDelegate, $ionicModal) {
		$scope.$on('$ionicView.afterEnter', function() {
			$data.getBanner().success(function(data) {
				// console.log(data);
				$scope.bannerList = data.data;
				if(data.status == '1'){
					$data.storeData('homeData_bannerIMG', data.data);
				}
				$ionicSlideBoxDelegate.update();
				$ionicSlideBoxDelegate.$getByHandle("slideboximgs").loop(true);
			}).error(function(){
				$scope.bannerList = $data.storeData('homeData_bannerIMG');
			});
		})
		/*判断详情链接*/
		$scope.goNewDetailPage = function(catid) {
			if (catid != undefined) {
				$state.go('tab.new-detail', {
					chatId: catid
				})
			}
		};
		/*下拉刷新*/
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
					$data.loadingShow('加载失败');
					$scope.items = $data.storeData('homeData');
				})
				.finally(function() {
					$timeout(function() {
						$scope.$broadcast('scroll.refreshComplete');
					}, 100)
				});
		};
		$scope.doRefresh();
		/*选项卡*/
		$scope.pageStatus = function(index) {
			$ionicSlideBoxDelegate.$getByHandle('importance').slide(index);
		};
		/*按钮状态*/
		$scope.slideHasChanged = function($index) {
			$('.button-list-wrap').children().eq($index).addClass('selected').siblings().removeClass('selected');
		};
		$scope.uploadMore = function() {
			var currentIndex = $ionicSlideBoxDelegate.$getByHandle('importance').currentIndex();
			switch (currentIndex) {
				case 0:
					$state.go('tab.news-importance');
					break;
				case 1:
					$state.go('tab.news-plan');
					break;
				case 2:
					$state.go('tab.news-interflow');
			}
		}
	})
	/*重要通知*/
	.controller('NewsImportanceCtrl', function($scope, $data, $state, $timeout, $stateParams, $ionicScrollDelegate) {
		var vm = $scope.vm = {
			moredata: true,
			items: [],
			keyValue:'',
			catid:'',
			pagination: {
				size: 10,
				page: 0
			},
			init: function(catid) {
				var that = this;
				that.catid = catid;
			},
			search:function(searchs){
				var that = this; 
				that.keyValue = searchs;
				that.pagination.page = 1;
				$data.getHomeDataList({
					size: that.pagination.size,
					page: that.pagination.page,
					kw:that.keyValue,
					catid:that.catid
				}).success(function(data) {
					console.log(data);
					that.items = data.data;
				})
			},
			doRefresh: function() {
				$timeout(function() {
					$scope.$broadcast('scroll.refreshComplete');
				}, 1000);
			},
			loadMore: function() {
				this.pagination.page += 1;
				var that = this;
				$data.getHomeDataList({
					size: that.pagination.size,
					page: that.pagination.page,
					kw:that.keyValue,
					catid:that.catid
				}).success(function(data) {
					console.log(data);
					that.items = that.items.concat(data.data);
					if (data.data.length < that.pagination.size) {
						that.moredata = false;
					};
					$scope.$broadcast('scroll.infiniteScrollComplete');
				})
			}
		}
		$scope.getDetails = function(searchs) {
			vm.search(searchs);
		};
		vm.init(3);
		/*跳转详情页面*/
		$scope.goNewDetailPage = function(catid) {
			if (catid != undefined) {
				$state.go('tab.new-detail', {
					chatId: catid
				})
			}
		};
		// /*滑动打开搜索栏*/
		// $scope.openSearch = function() {
		// 		if ($ionicScrollDelegate.getScrollPosition().top < -50) {
		// 			$(".search-place").css({
		// 				"top": "100px",
		// 				"-webkit-transition": "top 0.6s"
		// 			});
		// 		} else if ($ionicScrollDelegate.getScrollPosition().top > 1) {
		// 			$(".search-place").css({
		// 				"top": "44px",
		// 				"-webkit-transition": "top 0.6s"

		// 			})
		// 		}
		// 	}
		// 	/*点击打开搜索栏*/
		// $scope.searchClick = function() {
		// 	$(".search-place").css({
		// 		"top": "100px",
		// 		"-webkit-transition": "top 0.6s"
		// 	})
		// }
	})
	/*策划约稿*/
	.controller('NewsPlanCtrl', function($scope, $data, $state, $timeout, $stateParams, $ionicScrollDelegate) {
		var vm = $scope.vm = {
			moredata: true,
			items: [],
			keyValue:'',
			catid:'',
			pagination: {
				size: 10,
				page: 0
			},
			init: function(catid) {
				var that = this;
				that.catid = catid;
			},
			search:function(searchs){
				var that = this; 
				that.keyValue = searchs;
				that.pagination.page = 1;
				$data.getHomeDataList({
					size: that.pagination.size,
					page: that.pagination.page,
					kw:that.keyValue,
					catid:that.catid
				}).success(function(data) {
					console.log(data);
					that.items = data.data;
					that.pagination.page = 1;
				})
			},
			doRefresh: function() {
				$timeout(function() {
					$scope.$broadcast('scroll.refreshComplete');
				}, 1000);
			},
			loadMore: function() {
				this.pagination.page += 1;
				var that = this;
				$data.getHomeDataList({
					size: that.pagination.size,
					page: that.pagination.page,
					kw:that.keyValue,
					catid:that.catid
				}).success(function(data) {
					console.log(data);
					that.items = that.items.concat(data.data);
					if (data.data.length < that.pagination.size) {
						that.moredata = false;
					};
					$scope.$broadcast('scroll.infiniteScrollComplete');
				})
			}
		}
		$scope.getDetails = function(searchs) {
			vm.search(searchs);
		};
		vm.init(37);


		/*跳转详情页面*/
		$scope.goNewDetailPage = function(catid) {
			if (catid != undefined) {
				$state.go('tab.new-detail', {
					chatId: catid
				})
			}
		};
		
	})
	/*业务交流*/
	.controller('NewsInterflowCtrl', function($scope, $data, $state, $timeout, $stateParams, $ionicScrollDelegate) {
		var vm = $scope.vm = {
			moredata: true,
			items: [],
			keyValue:'',
			catid:'',
			pagination: {
				size: 10,
				page: 0
			},
			init: function(catid) {
				var that = this;
				that.catid = catid;
			},
			search:function(searchs){
				var that = this; 
				that.keyValue = searchs;
				that.pagination.page = 1;
				$data.getHomeDataList({
					size: that.pagination.size,
					page: that.pagination.page,
					kw:that.keyValue,
					catid:that.catid
				}).success(function(data) {
					console.log(data);
					that.items = data.data;
				})
			},
			doRefresh: function() {
				$timeout(function() {
					$scope.$broadcast('scroll.refreshComplete');
				}, 1000);
			},
			loadMore: function() {
				this.pagination.page += 1;
				var that = this;
				$data.getHomeDataList({
					size: that.pagination.size,
					page: that.pagination.page,
					kw:that.keyValue,
					catid:that.catid
				}).success(function(data) {
					console.log(data);
					that.items = that.items.concat(data.data);
					if (data.data.length < that.pagination.size) {
						that.moredata = false;
					};
					$scope.$broadcast('scroll.infiniteScrollComplete');
				})
			}
		}
		$scope.getDetails = function(searchs) {
			vm.search(searchs);
		};
		vm.init(9);
		/*跳转详情页面*/
		$scope.goNewDetailPage = function(catid) {
			if (catid != undefined) {
				$state.go('tab.new-detail', {
					chatId: catid
				})
			}
		};
		
	})
	/*新闻*/
	.controller('NewDetailCtrl', function($scope, $data, $rootScope, $state, $ionicLoading, $timeout, $stateParams, $ionicPopup, $ionicBackdrop, $ionicPopover, $window, $ionicScrollDelegate, $ionicPosition, $ionicHistory) {
		$scope.chatIdName = $stateParams.chatId;
		$data.getNewsDetails($scope.chatIdName).success(function(res) {
			// console.log(res);
			$scope.details = res;
		});
	})