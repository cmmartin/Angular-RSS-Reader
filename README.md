# Angular RSS Reader

A responsive, client-side Angular.js sample application that implements a RSS Reader

LIVE DEMO: http://cmmartin.github.io/Angular-RSS-Reader/#/

Technologies:

    Angular.js
    Google Feed API
    Twitter Bootstrap

Project files:

    /app
      index.html                  - project web root
      /assets
        app.css                   - all css files concatenated
        app.js                    - all javascript files concatenated
      /components
        angular.js
        jquery.js
        moment.js                 - date formatting
      /scripts
        app.js                    - angular config
        homePage.js               - homePage module (ctrl, services, directives, filters)
      /styles
        app.css                   - application specific styles
        animation.css             - css animations
        bootstrap-theme.css       - my bootstrap overrides
        bootstrap.css             - Twitter Bootstrap
      /templates
        home.html                 - homePage html template
    /test
      karma-unit.conf.js          - karma unit test config
      protractor.conf.js          - protractor e2e test config
      /unit
        homePageSpec.js           - homePage module unit tests (16)
      /e2e
        homePageSpec.js           - homePage module e2e tests (TODO)

## Installation

1. `npm install -g grunt-cli`
2. `npm install`
3. `grunt install`

## Development

1. `grunt dev`
2. Go to: `http://localhost:8888`

## Testing

### Run all tests with
`grunt test` 

### Unit Testing

#### Single run tests
`grunt test:unit` 

#### Auto watching tests
`grunt autotest:unit`

### End to End Testing (Protractor)

#### Single run tests
`grunt test:e2e` 

#### Auto watching tests
`grunt autotest:e2e`

### Coverage Testing

`grunt coverage`
