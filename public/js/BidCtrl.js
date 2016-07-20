angular.module('hitList').controller('BidCtrl', function($scope,$uibModal,$uibModalInstance,$http, hitItem) {		// Inject our dependencies and hitItem (the item we are editing)
	console.log('BidCtrl hitItem=', hitItem);
	$scope.save = function() {
		hitItem.bids.push($scope.bid);									// Push the current bid onto the bids array in hitItem
		$http.post('/hits', hitItem).then(function(response) {			// Post hitItem to our /hits POST route and then...
			console.log('post /hits: ', response.data);
			$uibModalInstance.close();
		});
	};

	$scope.cancel = function() {
		$uibModalInstance.dismiss();
	};
});
