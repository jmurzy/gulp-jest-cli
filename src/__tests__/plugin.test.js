import gulp from 'gulp';
import plugin from '../index';

const doFailUnlessJestError = done => (error) => {
  if (!error.jest) {
    fail('Jest should have contained failed tests');
  }
  done();
};

const doFail = done => () => {
  fail('Unexpected Jest result');
  done();
};

const doPass = done => () => {
  done();
};

describe('Gulp Plugin for Jest', () => {
  describe('Sanity check', () => {
    it('should pass', () => {
      expect(1).toBe(1);
    });
  });

  describe('`version` flag in options', () => {
    it('should throw', () => {
      expect(() => gulp
        .src(['src'])
        .pipe(plugin({
          version: true,
          config: {
            testRegex: '/__tests__/.*\\.(pass.fixture.js)$',
          },
        }))).toThrowError(/version/);
    });
  });

  describe('glob in gulp.src', () => {
    it('should throw', (done) => {
      gulp
        .src(['src/__tests__/*'])
        .pipe(plugin({
          config: {
            testRegex: '/__tests__/.*\\.(pass.fixture.js)$',
          },
        }))
        .on('error', doPass(done))
        .on('finish', doFail(done));
    });
  });

  describe('non-directory in gulp.src', () => {
    it('should throw', (done) => {
      gulp
        .src(['src/__tests__/plugin.test.js'])
        .pipe(plugin({
          config: {
            testRegex: '/__tests__/.*\\.(pass.fixture.js)$',
          },
        }))
        .on('error', doPass(done))
        .on('finish', doFail(done));
    });
  });

  describe('non-existent in gulp.src', () => {
    it('should pass', (done) => {
      gulp
        .src(['src/DOES_NOT_EXIST'])
        .pipe(plugin({
          config: {
            testRegex: '/__tests__/.*\\.(pass.fixture.js)$',
          },
        }))
        .on('error', doFail(done))
        .on('finish', doPass(done));
    });
  });

  describe('Passing fixtures', () => {
    it('should pass in Jest run without `rootDir`', (done) => {
      gulp
        .src('src')
        .pipe(plugin({
          config: {
            testRegex: '/__tests__/.*\\.(pass.fixture.js)$',
            testEnvironment: 'node',
          },
        }))
        .on('error', doFail(done))
        .on('finish', doPass(done));
    });

    it('should pass in Jest run for matching `rootDir`', (done) => {
      gulp
        .src('src')
        .pipe(plugin({
          config: {
            testRegex: '/__tests__/.*\\.(pass.fixture.js)$',
            testEnvironment: 'node',
            rootDir: 'src',
          },
        }))
        .on('error', doFail(done))
        .on('finish', doPass(done));
    });

    it('should pass in Jest run for non-matching `rootDir`', (done) => {
      gulp
        .src('src')
        .pipe(plugin({
          config: {
            testRegex: '/__tests__/.*\\.(pass.fixture.js)$',
            testEnvironment: 'node',
            rootDir: 'src/__test__/',
          },
        }))
        .on('error', doFail(done))
        .on('finish', doPass(done));
    });
  });

  describe('Failing fixtures', () => {
    it('should fail in Jest run (configured via external file)', (done) => {
      gulp
        .src('src')
        .pipe(plugin({
          config: 'src/__tests__/config.file',
        }))
        .on('error', doFailUnlessJestError(done))
        .on('finish', doFail(done));
    });

    it('should fail in Jest run', (done) => {
      gulp
        .src('src')
        .pipe(plugin({
          config: {
            testRegex: '/__tests__/.*\\.(fail.fixture.js)$',
          },
        }))
        .on('error', doFailUnlessJestError(done))
        .on('finish', doFail(done));
    });
  });
});
