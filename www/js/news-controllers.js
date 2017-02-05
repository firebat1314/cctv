angular.module('news-controllers', [])

.controller('NewsCtrl', function($ionicHistory, $scope, $data, $rootScope, $state, $ionicLoading, $timeout, $stateParams, $ionicPopup, $ionicBackdrop, $ionicPopover, $window, $ionicScrollDelegate, $ionicPosition, $ionicSlideBoxDelegate,$ionicModal) {

	$data.getBanner().success(function(data) {
		console.log(data);
		$scope.bannerList = data.data;
		$ionicSlideBoxDelegate.update();
		$ionicSlideBoxDelegate.$getByHandle("slideboximgs").loop(true);
	});
	
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
				console.log(newItems);
				if (newItems.status == '1') {
					$scope.Items = newItems;
					$data.storeData('homeData', newItems);
				}
			})
			.error(function() {
				$data.loadingShow('更新失败');
				$scope.Items = $data.storeData('homeData');
			})
			.finally(function() {
				$timeout(function() {
					$scope.$broadcast('scroll.refreshComplete');
				}, 100)
			});
	};
	$scope.doRefresh();
	
	var getHomeData = function(catid){
		this.data = $data.getHomeData({catid:catid})
			.success(function(newItems) {
				console.log(newItems);
				if (newItems.status == '1') {
					return newItems;
				}
			})
	}
	
	$scope.pageStatus = function(index) {
		$ionicSlideBoxDelegate.$getByHandle('importance').slide(index);
	};
	$scope.slideHasChanged = function($index) {
		$('.button-list-wrap').children().eq($index).addClass('selected').siblings().removeClass('selected');
	};

	$scope.importance = function(){
		$data.getHomeDataList(37).success(function(data){
			return data
		});	 	
	}
	console.log($scope.importance);
	// $scope.swipeUp = function(data){
	// 	$scope.currentIndex = $ionicSlideBoxDelegate.$getByHandle('importance').currentIndex();
	// 	var catid;
	// 	switch($scope.currentIndex){
	// 		case 0:catid=3;break;
	// 		case 1:catid=37;break;
	// 		case 2:catid=9;
	// 	}
	// 	$data.getHomeDataList({
	// 		catid: catid
	// 	}).success(function(data) {
	// 		console.log(data);
	// 		$scope.newsList = data.data;
	// 	})
	// 	console.log('触发上滑事件');
	// 	$scope.openModal();
	// };
	// $ionicModal.fromTemplateUrl('my-modal.html', {
	// 	scope: $scope,
	// 	animation: 'slide-in-up'
	// }).then(function(modal) {
	// 	$scope.modal = modal;
	// });
	// $scope.openModal = function() {
	// 	$scope.modal.show();
	// };
	// $scope.closeModal = function() {
	// 	$scope.modal.hide();
	// };
	// //Cleanup the modal when we're done with it!
	// $scope.$on('$destroy', function() {
	// 	$scope.modal.remove();
	// });
	// // Execute action on hide modal
	// $scope.$on('modal.hidden', function() {
	// 	// Execute action
	// });
	// // Execute action on remove modal
	// $scope.$on('modal.removed', function() {
	// 	// Execute action
	// });
})

.controller('NewDetailCtrl', function($scope, $data, $rootScope, $state, $ionicLoading, $timeout, $stateParams, $ionicPopup, $ionicBackdrop, $ionicPopover, $window, $ionicScrollDelegate, $ionicPosition, $ionicHistory) {
	$scope.chatIdName = $stateParams.chatId;
	$data.getNewsDetails($scope.chatIdName).success(function(res) {
		console.log(res);
		$scope.details = res;
	});
	$scope.goBack = function() {
		$ionicHistory.goBack();
	}
})