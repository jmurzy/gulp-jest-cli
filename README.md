# Gulp Jest CLI [![CircleCI](https://img.shields.io/circleci/project/jmurzy/gulp-jest-cli/master.svg?style=flat-square)](https://circleci.com/gh/jmurzy/gulp-jest-cli) [![npm version](https://img.shields.io/npm/v/gulp-jest-cli.svg?style=flat-square)](https://www.npmjs.com/package/gulp-jest-cli) [![npm](https://img.shields.io/npm/l/gulp-jest-cli.svg?style=flat-square)](https://github.com/jmurzy/gulp-jest-cli/blob/master/LICENSE.md)

[Gulp](https://github.com/gulpjs/gulp) plugin for [Jest](http://facebook.github.io/jest/).

### Installation

#### Using npm:

```sh
$ npm install gulp-jest-cli jest-cli --save-dev
```

#### Using yarn:

```sh
$ yarn add gulp-jest-cli jest-cli --dev
```

### Usage

```js
import plugin from 'gulp-jest-cli';

gulp.task('jest', () => gulp
  /*
   * Jest's `rootDir` will be set to the directory specified in `gulp.src`
   * unless a `rootDir` is explicitly configured via configuration options
   */
  .src('src')
  .pipe(plugin({
    config: {
      /* Configuration options */
      {
        coverageReporters: [
          'text',
          'text-summary',
          'json',
          'lcov',
        ],
        collectCoverageFrom: [
          '**/*.js',
          '!**/*test*',
        ]
      }
    },
    /* CLI options*/
    coverage: true,
    onlyChanged: true,
  }))
);
```

Jest docs for configuration options can be found [here](http://facebook.github.io/jest/docs/configuration.html#configuration-options-configuration).


#### Configuration options via external file

```js
import plugin from 'gulp-jest-cli';

gulp.task('jest', () => gulp
  .src('src')
  .pipe(plugin({
    config: '.jestrc',
    /* CLI options */
    coverage: true,
    onlyChanged: true,
  }))
);
```

#### Configuration options via package.json
```js
import plugin from 'gulp-jest-cli';

gulp.task('jest', () => gulp
  .src('src')
  .pipe(plugin({
    /* Jest will fallback to package.json for configuration when `config` is omitted */
    /* CLI options */
    coverage: true,
    onlyChanged: true,
  }))
);
```

#### Questions?
Feel free to reach out to me on Twitter [@jmurzy](https://twitter.com/jmurzy).

### Contributing
Contributions are very welcome: bug fixes, features, documentation, tests. Just make sure the CI is 👌.

<a name="hacking"/>

<a name="license"/>
#### License
All pull requests that get merged will be made available under [the MIT license](https://github.com/jmurzy/gulp-jest-cli/blob/master/LICENSE.md), as the rest of the repository.
