import { resolve, relative } from 'path';
import { log, colors, PluginError } from 'gulp-util';
import jest from 'jest-cli';
import through2 from 'through2';

const PLUGIN_NAME = 'gulp-jest-cli';

const runCLI = (argv, rootDir, done) => {
  jest.runCLI(argv, rootDir, (result) => {
    if (result.numFailedTestSuites || result.numFailedTests) {
      const error = new PluginError(PLUGIN_NAME, 'Jest failed');
      error.jest = true;
      done(error);
      return;
    }

    done();
  });
};

const plugin = (options = {}) => {
  if (options.version) {
    throw new PluginError(PLUGIN_NAME, '`version` flag is not supported.');
  }

  let count = 0;
  function onceOrThrow(file, _, done) {
    count += 1;

    if (count > 1) {
      this.emit(
        'error',
        new PluginError(
          PLUGIN_NAME,
          '`gulp.src` replaces `rootDir`. Use of `glob`s in `gulp.src` is discouraged.',
        ),
      );
      return;
    }

    if (!file || !file.isDirectory() || !file.path) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'gulp.src should be set to Jest rootDir'));
      return;
    }

    const rootDir = file.path;

    const cwd = resolve(process.cwd(), '..');

    if (options.config && options.config.rootDir) {
      const configRootDir = relative(cwd, options.config.rootDir);
      const gulpSrcRootDir = relative(cwd, rootDir);

      if (configRootDir !== gulpSrcRootDir) {
        // TODO(jmurzy) Also print below warning if `rootDir` is set in an external config
        log(
          PLUGIN_NAME,
          colors.red('rootDir defined in `gulp.src` does not match Jest config:'),
          colors.magenta(gulpSrcRootDir),
          colors.red('!=='),
          colors.magenta(configRootDir),
        );
      }
    }

    const { config, ...rest } = options;

    let argv = rest;

    // `undefined` config will make jest parse package.json for its config.
    if (config) {
      argv = {
        ...argv,
        config,
      };
    }

    runCLI(argv, rootDir, done);
  }

  return through2.obj(onceOrThrow);
};

export default plugin;
