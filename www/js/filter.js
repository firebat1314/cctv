angular.module('starter.filter', [])
.filter('videoSize',function(){
	return function(str){
		if(str){
			return parseInt(str/1024)
		}else{
			return '--'
		}
		
	}
})