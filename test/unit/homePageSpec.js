/*
 * HomeCtrl controller
 * it should attach feeds to the scope
 * it should set the selected entry on ENTRY_SELECTED event
 * it should set the selected entry to null on ENTRY_DESELECTED event
 */
describe('Controller: HomeCtrl', function() {

  var scope,
      ctrl,
      $httpBackend,
      sampleEntry = {sample: 'entry'};

  var MockFeedsService = function() {
    this.get = function() {
      return {
        then: function(callback) {
          return callback(sampleEntry); // simulate promise resolution
        }
      };
    }
  }

  beforeEach(function(){
    module('app.homePage', function ($provide) {
      $provide.value('Feeds', new MockFeedsService());
    });
    inject(function($rootScope, $controller) {
      scope = $rootScope.$new();
      ctrl = $controller('HomeCtrl', {$scope: scope});
    });

  });

  it('should attach feeds to the scope', function() {
    expect(scope.feeds).toBe(sampleEntry);
  });

  it('should set the selected entry on ENTRY_SELECTED event', function() {
    scope.selectedEntry = null;
    scope.$broadcast('ENTRY_SELECTED', sampleEntry);
    expect(scope.selectedEntry).toBe(sampleEntry);
  });

  it('should set the selected entry to null on ENTRY_DESELECTED event', function() {
    scope.selectedEntry = sampleEntry;
    scope.$broadcast('ENTRY_DESELECTED');
    expect(scope.selectedEntry).toBe(null);
  });
});

/*
 * FeedSources service
 * it should return an array of absolute urls
 */
describe('Service: FeedSources', function() {
  beforeEach(function () {
    module('app.homePage');
  });

   it('should return an array of absolute urls', inject(function (FeedSources) {
    expect(FeedSources[0].url).toContain('http');
  }));
});

/*
 * FeedLoader service
 * it should send JSONP requests to Google Feed API
 */
describe('Service: FeedLoader', function() {

  var feedUrl = 'TEST',
      requestUrl = 'http://ajax.googleapis.com/ajax/services/feed/load?callback=JSON_CALLBACK&num=10&q=' + feedUrl + '&v=1.0',
      mockResponse = {'responseData': {'feed': 'sample feed'}};

  beforeEach(module('app.homePage'));

  it('should send JSONP requests to Google Feed API', inject(function(FeedLoader, $httpBackend) {

    $httpBackend.expectJSONP(requestUrl).respond(200, mockResponse);

    FeedLoader.fetch({q: feedUrl, num: 10}, {}, function(response) {
      expect(response.responseData.feed).toBe(mockResponse.responseData.feed);
    });

    $httpBackend.flush();
  }));
});

/*
 * Feeds service
 * it should call FeedLoader.fetch on all FeedSources and return the result promise
 */
describe('Service: Feeds', function() {

  var mockResponse = {
    responseData: {
      feed: {'sample': 'feed'}
    }
  };

  var MockFeedLoaderService = function() {
    this.fetch = function() {
      return {
        $promise: {
          then: function(callback) {
            return callback(mockResponse); // mock promise resolution
          }
        }
      };
    }
  };

  beforeEach(function() {
    module('app.homePage', function ($provide) {
      $provide.value('FeedLoader', new MockFeedLoaderService());
    });
  });

  it('should call FeedLoader.fetch on all FeedSources and return the result promise', inject(function(Feeds, FeedSources) {

    Feeds.get().then(function(response) {
      expect(response.length).toBe(FeedSources.length);
    });

  }));
});

/*
 * feed directive
 * it should display the feed title
 * it should display multiple entries
 */
describe('Directive: feed', function() {
  var element, scope;

  beforeEach(module('app.homePage'));

  beforeEach(inject(function($compile, $rootScope){
    scope = $rootScope.$new();
    scope.feed = {
      title: 'title', 
      entries:[
      {
        mediaGroups: [
          {
            contents: [
              {url: 'http://sample.com/picture.png'}
            ]
          }
        ]
      },
      { 
        mediaGroups: [
          {
            contents: [
              {url: 'http://sample.com/picture.png'}
            ]
          }
        ]
      }
    ]};
    element = $compile('<feed model="feed"></feed>')(scope);
    scope.$digest();
  }));

  it('should display the feed title', function() {
    expect(element.find('.feed-title').html()).toBe('title');
  });

  it('should display multiple entries', function() {
    expect(element.find('.entries').children.length).toEqual(2);
  });
});

/*
 * entry directive
 * it should display the title and content of the entry
 * it should set the background image
 * it should not set a background image with an invalid file extension
 */
describe('Directive: entry', function() {
  var element, scope;

  var mockEntry = {
    title: 'Sample',
    contentSnippet: 'preview',
    publishedDate: 'Sat, 28 Dec 2013 14:38:11 -0800',
    mediaGroups: [
      {
        contents: [
          {url: 'http://sample.com/picture.jpeg'}
        ]
      }
    ]
  };

  beforeEach(module('app.homePage'));

  beforeEach(inject(function($compile, $rootScope){
    scope = $rootScope.$new();
    scope.entry = mockEntry;
    element = $compile('<entry model="entry"></entry>')(scope);
    scope.$digest();
  }));

  it('should display the title and content of the entry', function() {
    expect(element.find('.entry-title').html()).toBe('Sample');
    expect(element.find('.entry-preview').html()).toBe('preview');
  });

  it('should set the background image', function() {
    expect(element.css('background')).toContain('http://sample.com/picture.jpeg');
  });

  it('should not set a background image with an invalid file extension', function() {
    scope.entry.mediaGroups[0].contents[0].url = 'http://sample.com/notanimage';
    scope.$digest();
    expect(element.css('background')).not.toContain('http://sample.com/notanimage');
  });
});

/*
 * modal directive
 * it should be hidden when there is no selected entry
 * it should be shown when an entry is selected
 * it should display the title and content of the entry
 */
describe('Directive: modal', function() {
  var element, scope;

  beforeEach(module('app.homePage'));

  beforeEach(inject(function($compile, $rootScope){
    scope = $rootScope.$new();
    element = $compile('<div class="modal" model="selectedEntry"></div>')(scope);
    scope.$digest();
  }));
  
  it('should be hidden when there is no selected entry', function() {
    expect(element.hasClass('ng-hide')).toBe(true);
  });

  it('should be shown when an entry is selected', function() {
    scope.selectedEntry = 'anything truthy';
    scope.$digest();
    expect(element.hasClass('ng-hide')).not.toBe(true);
  });

  it('should display the title and content of the entry', function() {
    scope.selectedEntry = {title: 'title', content: 'some content'};
    scope.$digest();
    expect(element.find('div.modal-header').html()).toContain('title');
    expect(element.find('.modal-body').html()).toBe('some content');
  });
});

/*
 * formattedFullDate Filter
 * it should covert a full datetime to human format
 */
describe('Filter: formattedFullDate', function () {
  var filter;
  beforeEach(function () {
    module('app.homePage');
    inject(function ($filter) {
      filter = $filter('formattedFullDate');
    });
  });

  it('should covert a full datetime to human format', function () {
    expect(filter('Sat, 28 Dec 2013 14:38:11 -0800')).toBe('December 28th 2013, 5:38 pm');
  });
});

/*
 * timeago Filter
 * it should convert a date to the amount of time from now
 */
describe('Filter: timeago', function () {
  var filter;
  beforeEach(function () {
    module('app.homePage');
    inject(function ($filter) {
      filter = $filter('timeago');
    });
  });

  it('should convert a date to the amount of time from now', function () {
    expect(filter('Sat, 28 Dec 2013 14:38:11 -0800')).toContain('ago');
  });
});