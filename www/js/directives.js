angular.module('starter.directives', [])
.directive('hideTabs', function($rootScope) {
    return {
        restrict: 'A',
        link: function(scope, element, attributes) {
            scope.$on('$ionicView.beforeEnter', function() {
                scope.$watch(attributes.hideTabs, function(value){
                    $rootScope.hideTabs = value;
                });
            });

            scope.$on('$ionicView.beforeLeave', function() {
                $rootScope.hideTabs = false;
            });
        }
    };

})
.directive("getFocus", function() {
    return {
        restrict: "A",
        link: function(scope, elem, attrs) {
            var clicked = true;
            $(elem).click(function() {
                if (clicked) {
                    $(this).select();
                    clicked = false;
                }
            });
        }
    }
})
.directive("delText", function() {
    return {
        restrict: "A",
        link: function(scope, elem, attrs) {
            $(elem).click(function() {
                $(elem).siblings('input').eq(0).val('');
                $(elem).siblings('input').eq(0).focus();
            });
        }
    }
})
.directive("noPass", function() {
    return {
        restrict: "A",
        link: function(scope, elem, attrs) {
            $(elem).click(function() {
                $(this).toggleClass('active');
                Array.prototype.indexOf = function(val) {
                    for (var i = 0; i < this.length; i++) {
                        if (this[i] == val) return i;
                    }
                    return -1;
                };
                Array.prototype.remove = function(val) {
                    var index = this.indexOf(val);
                    if (index > -1) {
                        this.splice(index, 1);
                    }
                };
                if($(this).hasClass('active')){
                    scope.arr.push($(this)[0].dataset.id);
                }else{
                    if($(this)[0].dataset.id){
                        scope.arr.remove($(this)[0].dataset.id);
                    }
                }
                console.log(scope.arr);
            });
        }
    }
})
.directive('getHref',function(){
    return {
        restrict:'A',
        link:function(scope,elem,attrs){
            $(elem).on('click','a',function(e){
                 window.open(this.href, '_system', 'location=yes');
            })
        }
    }
})
