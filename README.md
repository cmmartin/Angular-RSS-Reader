# Angular RSS Reader

A responsive, client-side Angular.js sample application that implements a RSS Reader

Technologies:

  Angular.js
  Google Feed API
  Twitter Bootstrap

Project files:

  /app - application files
    index.html                  - project web root
    /assets                     - dist folder of concatenated styles and scripts
      app.css                   - all css files concatenated
      app.js                    - all javascript files concatenated
    /components                 - external libraries
      angular.js
      jquery.js
      moment.js                 - date formatting
    /scripts                    - javascript dev files
      app.js                    - angular config
      homePage.js               - homePage module (ctrl, services, directives, filters)
    /styles - css dev files
      app.css                   - application specific styles
      animation.css             - css animations
      bootstrap-theme.css       - my bootstrap overrides
      bootstrap.css             - Twitter Bootstrap
    /templates                  - ng-view templates
      home.html                 - homePage html template
  /test
    karma-unit.conf.js          - karma unit test config
    protractor.conf.js          - protractor e2e test config
    /unit - unit tests
      homePageSpec.js           - homePage module unit tests (16)
    /e2e
      homePageSpec.js           - homePage module e2e tests (TODO)


    test - test specs and configs

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
