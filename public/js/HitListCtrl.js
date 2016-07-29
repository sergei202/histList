angular.module('hitList').controller('HitListCtrl', function($scope,$http,$uibModal) {
	function getHits() {								// getHits() will load the hits list from the server and set $scope.hits for us
		$http.get('/hits').then(function(response) {
			$scope.hits = response.data;
		});
	}
	getHits();											// Immediately load the hits list

	$scope.loadHit = function(hit) {					// loadHit() will open a modal with HitCtrl, pass 'hit', and then call getHits() after it closes
		hit = angular.copy(hit);
		var modalInstance = $uibModal.open({			// TODO: Comment without variable
			templateUrl: 'views/hit.html',
			controller: 'HitCtrl',
			resolve: {
				hitItem: function() {return hit;}		// Inject our 'hit' variable as 'hitItem'
			}
		});
		modalInstance.result.then(function() {			// This executes after $uibModalInstance.close() is called from HitCtrl
			getHits();
		});
	};

	$scope.addBid = function(hit) {					// addBid() will open a modal with BidCtrl, pass 'hit', and then call getHits() after it closes
		var modalInstance = $uibModal.open({
			templateUrl: 'views/bid.html',
			controller: 'BidCtrl',
			resolve: {
				hitItem: function() {return hit;}		// Inject our 'hit' variable as 'hitItem'
			}
		});
		modalInstance.result.then(function() {			// This executes after $uibModalInstance.close() is called from HitCtrl
			getHits();
		});
	};
});
