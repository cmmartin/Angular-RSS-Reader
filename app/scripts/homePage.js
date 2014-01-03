angular.module('app.homePage', ['ngResource', 'ngAnimate'])

/*
 * HomeCtrl controller
 * it should attach feeds to the scope
 * it should set the selected entry on ENTRY_SELECTED event
 * it should set the selected entry to null on ENTRY_DESELECTED event
 */
.controller('HomeCtrl', function($scope, Feeds) {

  $scope.selectedEntry = null;

  Feeds.get().then(function(feeds) {
    $scope.feeds = feeds;
  }, function(error) {
    console.log(error);
  });

  $scope.$on('ENTRY_SELECTED', function(event, entry) {
    $scope.selectedEntry = entry;
  });

  $scope.$on('ENTRY_DESELECTED', function() {
    $scope.selectedEntry = null;
  });
})

/*
 * FeedSources service
 * it should return an array of absolute urls
 */
.factory('FeedSources', function () {
  return [
    {url: 'http://feeds.feedburner.com/TechCrunch/'},
    {url: 'http://feeds.arstechnica.com/arstechnica/index'},
    {url: 'http://feeds.feedburner.com/GoogleEarthBlog'},
    {url: 'http://feeds.gawker.com/gizmodo/full'}
  ];
})

/*
 * FeedLoader service
 * it should send JSONP requests to Google Feed API
 */
.factory('FeedLoader', function ($resource) {
  return $resource('http://ajax.googleapis.com/ajax/services/feed/load', {}, {
    fetch: { method: 'JSONP', params: {v: '1.0', callback: 'JSON_CALLBACK'} }
  });
})

/*
 * Feeds service
 * it should call FeedLoader.fetch on all FeedSources and return the result promise
 */
.service('Feeds', function ($rootScope, FeedLoader, FeedSources, $q) {

  var feeds = [];

  this.get = function() {

    var deferred = $q.defer();

    function getFeed(feed) {
      return FeedLoader.fetch({q: feed.url, num: 10}, {}).$promise;
    }

    function handleResponse(response) {
      feeds.push(response.responseData.feed);
      if (feeds.length === FeedSources.length) {
        deferred.resolve(feeds); // all feeds fetched
      }
    }

    for (var i = 0, ii = FeedSources.length; i < ii; i++) {
      getFeed(FeedSources[i]).then(handleResponse);
    }

    return deferred.promise;
  };
})

/*
 * feed directive
 * it should display the feed title
 * it should display multiple entries
 */
.directive('feed', function () {
  return {
    restrict: 'E',
    template: '<div>' +
                '<h5 class="feed-title">{{model.title}}</h5>' +
                '<div class="feed">' +
                  '<div class="entries" ng-repeat="entry in model.entries">' +
                    '<entry model="entry"></entry>' +
                  '</div>' +
                '</div>' +
              '</div>',
    replace: true,
    scope: {
      model: '='
    }
  };
})

/*
 * entry directive
 * it should display the title and content of the entry
 * it should set the background image
 * it should not set a background image with an invalid file extension
 */
.directive('entry', function () {
  return {
    restrict: 'E',
    replace: true,
    template: '<div ng-click="select()" class="entry">' +
                '<div class="entry-inner">' +
                  '<h3 class="entry-title">{{model.title}}</h3>' +
                  '<p class="entry-preview">{{model.contentSnippet}}</p>' +
                  '<p>posted {{model.publishedDate |  timeago}}</p>' +
                '</div>' +
              '</div>',
    scope: {
      model: '='
    },
    link: function(scope, element) {

      var imgUrl,
          fileExtension,
          allowedExtensions = ['jpg', 'png', 'gif', 'jpeg'];

      scope.select = function() {
        scope.$emit('ENTRY_SELECTED', scope.model);
      };

      /* The below code is only necessary due to the inconsistencies in providing
       * image urls in RSS entries. First, we look for a designated image url, if none, we
       * pull the first image's src from the entry's (html) content. Finally, we check
       * if the src has a valid image file extension to avoid displaying an ad
       */
      if (scope.model.mediaGroups) {
        imgUrl = scope.model.mediaGroups[0].contents[0].url;
      } else {
        imgUrl = $(scope.model.content).find('img')[0].src;
      }

      fileExtension = imgUrl.split('.').pop();

      if (allowedExtensions.indexOf(fileExtension)) {
        $(element).css('background', 'url(' + imgUrl + ') center center');
      }
    }
  };
})

/*
 * modal directive
 * it should be hidden when there is no selected entry
 * it should be shown when an entry is selected
 * it should display the title and content of the entry
 */
.directive('modal', function () {
  return {
    restrict: 'C',
    replace: true,
    template: '<div ng-show="model">' +
                '<div class="modal-dialog">' +
                  '<div class="modal-content">' +
                    '<div class="modal-header">' +
                      '<button type="button" class="close" ng-click="deselect()" aria-hidden="true">&times;</button>' +
                      '<h3 class="modal-title"><a ng-href="{{model.link}}" target="_blank">{{model.title}}</a></h3>' +
                      '<p><small>{{model.publishedDate | formattedFullDate}}<small></p>' +
                    '</div>' +
                    '<div class="modal-body"></div>' +
                  '</div>' +
                '</div>' +
              '</div>',
    scope: {
      model: '='
    },
    link: function(scope, element) {

      scope.$watch('model', function() {
        if (scope.model) {
          // render entry content as html
          element.find('.modal-body').html(scope.model.content);
        }
      });

      scope.deselect = function() {
        scope.$emit('ENTRY_DESELECTED');
      };
    }
  };
})

.directive('fullscreen', function () {
  return {
    restrict: 'A',
    link: function(scope, element) {
      element.bind('click', function() {
        var el = document.documentElement,
            request = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen;
        request.call(el);
      });
    }
  };
})

/*
 * formattedFullDate Filter
 * it should covert a full datetime to human format
 */
.filter('formattedFullDate', function() {
  return function(d) {
    return d ? moment(d).format('MMMM Do YYYY, h:mm a') : '';
  };
})

/*
 * timeago Filter
 * it should convert a date to the amount of time from now
 */
.filter('timeago', function() {
  return function(d) {
    return d ? moment(d).fromNow() : '';
  };
});