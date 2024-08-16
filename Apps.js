(function () {
    'use strict';

    angular.module('MenuApp', [])
        .controller('MenuController', MenuController)
        .service('MenuService', MenuService)
        .constant('ApiBasePath', "https://davids-restaurant.herokuapp.com");

    MenuController.$inject = ['MenuService'];
    function MenuController(MenuService) {
        var menuCtrl = this;

        menuCtrl.searchTerm = "";
        menuCtrl.found = [];
        menuCtrl.message = "";

        menuCtrl.narrowDown = function () {
            if (menuCtrl.searchTerm.trim() === "") {
                menuCtrl.message = "Nothing found";
                menuCtrl.found = [];
                return;
            }

            MenuService.getMenuItems().then(function (result) {
                var foundItems = [];
                var items = result.data.menu_items;

                for (var i = 0; i < items.length; i++) {
                    var description = items[i].description;
                    if (description.toLowerCase().indexOf(menuCtrl.searchTerm.toLowerCase()) !== -1) {
                        foundItems.push(items[i]);
                    }
                }

                if (foundItems.length > 0) {
                    menuCtrl.found = foundItems;
                    menuCtrl.message = "";
                } else {
                    menuCtrl.message = "Nothing found";
                    menuCtrl.found = [];
                }
            });
        };

        menuCtrl.removeItem = function (index) {
            menuCtrl.found.splice(index, 1);
        };
    }

    MenuService.$inject = ['$http', 'ApiBasePath'];
    function MenuService($http, ApiBasePath) {
        var service = this;

        service.getMenuItems = function () {
            var response = $http({
                method: "GET",
                url: (ApiBasePath + "/menu_items.json")
            });

            return response;
        };
    }

})();
