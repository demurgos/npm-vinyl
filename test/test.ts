
import File = require('vinyl');
import * as Stream from 'stream';
import * as fs from 'fs';

new File({
  cwd: '/',
  base: '/test/',
  path: '/test/file.ts',
  contents: new Buffer('test = 123')
});

let fakeStream: NodeJS.ReadWriteStream;

describe('File', () => {

    describe('constructor()', () => {

        it('should default cwd to process.cwd', done => {
            const file = new File();
            file.cwd.should.equal(process.cwd());
            done();
        });

        it('should default base to cwd', done => {
            const cwd = '/';
            const file = new File({ cwd: cwd });
            file.basename.should.equal(cwd);
            done();
        });

        it('should default base to cwd even when none is given', done => {
            const file = new File();
            file.basename.should.equal(process.cwd());
            done();
        });

        it('should default path to null', done => {
            const file = new File();
            should.not.exist(file.path);
            done();
        });

        it('should default stat to null', done => {
            const file = new File();
            should.not.exist(file.stat);
            done();
        });

        it('should default contents to null', done => {
            const file = new File();
            should.not.exist(file.contents);
            done();
        });

        it('should set base to given value', done => {
            const val = '/';
            const file = new File({ base: val });
            file.basename.should.equal(val);
            done();
        });

        it('should set cwd to given value', done => {
            const val = '/';
            const file = new File({ cwd: val });
            file.cwd.should.equal(val);
            done();
        });

        it('should set path to given value', done => {
            const val = '/test.coffee';
            const file = new File({ path: val });
            file.path.should.equal(val);
            done();
        });

        it('should set stat to given value', done => {
            const val = {};
            const file = new File(<fs.Stats><any>{ stat: val });
            file.stat.should.equal(val);
            done();
        });

        it('should set contents to given value', done => {
            const val = new Buffer('test');
            const file = new File({ contents: val });
            file.contents.should.equal(val);
            done();
        });

        it('should default basename to cwd', done => {
            const cwd = '/';
            const file = new File({ cwd: cwd });
            file.basename.should.equal(cwd);
            done();
        });

        it('should default basename to cwd even when none is given', done => {
            const file = new File();
            file.basename.should.equal(process.cwd());
            done();
        });

        it('should set basename to given value', done => {
            const val = '/';
            const file = new File({ base: val });
            file.basename.should.equal(val);
            done();
        });

        it('should default extname to null', done => {
            const cwd = '/';
            const file = new File({ cwd: cwd });
            should.not.exist(file.path);
            done();
        });

        it('should default dirname to null', done => {
            const cwd = '/';
            const file = new File({ cwd: cwd });
            should.not.exist(file.dirname);
            done();
        });

    });

    describe('isBuffer()', () => {
        it('should return true when the contents are a Buffer', done => {
            const val = new Buffer('test');
            const file = new File({ contents: val });
            file.isBuffer().should.equal(true);
            done();
        });

        it('should return false when the contents are a Stream', done => {
            const file = new File({ contents: fakeStream });
            file.isBuffer().should.equal(false);
            done();
        });

        it('should return false when the contents are a null', done => {
            const file = new File({ contents: null });
            file.isBuffer().should.equal(false);
            done();
        });
    });

    describe('isStream()', () => {
        it('should return false when the contents are a Buffer', done => {
            const val = new Buffer('test');
            const file = new File({ contents: val });
            file.isStream().should.equal(false);
            done();
        });

        it('should return true when the contents are a Stream', done => {
            const file = new File({ contents: fakeStream });
            file.isStream().should.equal(true);
            done();
        });

        it('should return false when the contents are a null', done => {
            const file = new File({ contents: null });
            file.isStream().should.equal(false);
            done();
        });
    });

    describe('isNull()', () => {
        it('should return false when the contents are a Buffer', done => {
            const val = new Buffer('test');
            const file = new File({ contents: val });
            file.isNull().should.equal(false);
            done();
        });

        it('should return false when the contents are a Stream', done => {
            const file = new File({ contents: fakeStream });
            file.isNull().should.equal(false);
            done();
        });

        it('should return true when the contents are a null', done => {
            const file = new File({ contents: null });
            file.isNull().should.equal(true);
            done();
        });
    });

    describe('clone()', () => {
        it('should copy all attributes over with Buffer', done => {
            const options = {
                cwd: '/',
                base: '/test/',
                path: '/test/test.coffee',
                contents: new Buffer('test')
            };
            const file = new File(options);
            const file2 = file.clone();

            file2.should.not.equal(file, 'refs should be different');
            file2.cwd.should.equal(file.cwd);
            file2.basename.should.equal(file.basename);
            file2.path.should.equal(file.path);

            let fileContents = file.contents;
            let file2Contents = file2.contents;

            file2Contents.should.not.equal(fileContents, 'buffer ref should be different');

            let fileUtf8Contents = fileContents instanceof Buffer ?
                fileContents.toString('utf8') :
                (<NodeJS.ReadableStream>fileContents).toString();
            let file2Utf8Contents = file2Contents instanceof Buffer ?
                file2Contents.toString('utf8') :
                (<NodeJS.ReadableStream>file2Contents).toString();

            file2Utf8Contents.should.equal(fileUtf8Contents);
            done();
        });

        it('should copy all attributes over with Stream', done => {
            const options = {
                cwd: '/',
                base: '/test/',
                path: '/test/test.coffee',
                contents: fakeStream
            };
            const file = new File(options);
            const file2 = file.clone();

            file2.should.not.equal(file, 'refs should be different');
            file2.cwd.should.equal(file.cwd);
            file2.basename.should.equal(file.basename);
            file2.path.should.equal(file.path);
            file2.contents.should.equal(file.contents, 'stream ref should be the same');
            done();
        });

        it('should copy all attributes over with null', done => {
            const options = {
                cwd: '/',
                base: '/test/',
                path: '/test/test.coffee',
                contents: fakeStream
            };
            const file = new File(options);
            const file2 = file.clone();

            file2.should.not.equal(file, 'refs should be different');
            file2.cwd.should.equal(file.cwd);
            file2.basename.should.equal(file.basename);
            file2.path.should.equal(file.path);
            should.not.exist(file2.contents);
            done();
        });

        it('should properly clone the `stat` property', done => {
            const options = {
                cwd: '/',
                base: '/test/',
                path: '/test/test.js',
                contents: new Buffer('test'),
                stat: fs.statSync(__filename)
            };

            const file = new File(options);
            const copy = file.clone();

            // ReSharper disable WrongExpressionStatement
            copy.stat.isFile().should.be.true;
            // ReSharper restore WrongExpressionStatement

            done();
        });
    });

    describe('pipe()', () => {
        it('should write to stream with Buffer', done => {
            const options = {
                cwd: '/',
                base: '/test/',
                path: '/test/test.coffee',
                contents: new Buffer('test')
            };
            const file = new File(options);
            const stream = new Stream.PassThrough();
            stream.on('data', (chunk: any) => {
                should.exist(chunk);
                (chunk instanceof Buffer).should.equal(true, 'should write as a buffer');
                chunk.toString('utf8').should.equal(options.contents.toString('utf8'));
            });
            stream.on('end', () => {
                done();
            });
            const ret = file.pipe(stream);
            ret.should.equal(stream, 'should return the stream');
        });

        it('should pipe to stream with Stream', done => {
            const testChunk = new Buffer('test');
            const options = {
                cwd: '/',
                base: '/test/',
                path: '/test/test.coffee',
                contents: new Stream.PassThrough()
            };
            const file = new File(options);
            const stream = new Stream.PassThrough();
            stream.on('data', (chunk: any) => {
                should.exist(chunk);
                (chunk instanceof Buffer).should.equal(true, 'should write as a buffer');
                chunk.toString('utf8').should.equal(testChunk.toString('utf8'));
                done();
            });
            const ret = file.pipe(stream);
            ret.should.equal(stream, 'should return the stream');

            let fileContents = file.contents;
            if (fileContents instanceof Buffer) {
                fileContents.write(testChunk.toString());
            }
        });

        it('should do nothing with null', done => {
            const options = {
                cwd: '/',
                base: '/test/',
                path: '/test/test.coffee',
                contents: fakeStream
            };
            const file = new File(options);
            const stream = new Stream.PassThrough();
            stream.on('data', () => {
                throw new Error('should not write');
            });
            stream.on('end', () => {
                done();
            });
            const ret = file.pipe(stream);
            ret.should.equal(stream, 'should return the stream');
        });

        it('should write to stream with Buffer', done => {
            const options = {
                cwd: '/',
                base: '/test/',
                path: '/test/test.coffee',
                contents: new Buffer('test')
            };
            const file = new File(options);
            const stream = new Stream.PassThrough();
            stream.on('data', (chunk: any) => {
                should.exist(chunk);
                (chunk instanceof Buffer).should.equal(true, 'should write as a buffer');
                chunk.toString('utf8').should.equal(options.contents.toString('utf8'));
                done();
            });
            stream.on('end', () => {
                throw new Error('should not end');
            });
            const ret = file.pipe(stream, { end: false });
            ret.should.equal(stream, 'should return the stream');
        });

        it('should pipe to stream with Stream', done => {
            const testChunk = new Buffer('test');
            const options = {
                cwd: '/',
                base: '/test/',
                path: '/test/test.coffee',
                contents: new Stream.PassThrough()
            };
            const file = new File(options);
            const stream = new Stream.PassThrough();
            stream.on('data', (chunk: any) => {
                should.exist(chunk);
                (chunk instanceof Buffer).should.equal(true, 'should write as a buffer');
                chunk.toString('utf8').should.equal(testChunk.toString('utf8'));
                done();
            });
            stream.on('end', () => {
                throw new Error('should not end');
            });
            const ret = file.pipe(stream, { end: false });
            ret.should.equal(stream, 'should return the stream');

            let fileContents = file.contents;
            if (fileContents instanceof Buffer) {
                fileContents.write(testChunk.toString());
            }
        });

        it('should do nothing with null', done => {
            const options = {
                cwd: '/',
                base: '/test/',
                path: '/test/test.coffee',
                contents: fakeStream
            };
            const file = new File(options);
            const stream = new Stream.PassThrough();
            stream.on('data', () => {
                throw new Error('should not write');
            });
            stream.on('end', () => {
                throw new Error('should not end');
            });
            const ret = file.pipe(stream, { end: false });
            ret.should.equal(stream, 'should return the stream');
            process.nextTick(done);
        });
    });

    describe('inspect()', () => {
        it('should return correct format when no contents and no path', done => {
            const file = new File();
            file.inspect().should.equal('<File >');
            done();
        });

        it('should return correct format when Buffer and no path', done => {
            const val = new Buffer('test');
            const file = new File({
                contents: val
            });
            file.inspect().should.equal('<File <Buffer 74 65 73 74>>');
            done();
        });

        it('should return correct format when Buffer and relative path', done => {
            const val = new Buffer('test');
            const file = new File({
                cwd: '/',
                base: '/test/',
                path: '/test/test.coffee',
                contents: val
            });
            file.inspect().should.equal('<File "test.coffee" <Buffer 74 65 73 74>>');
            done();
        });

        it('should return correct format when Buffer and only path and no base', done => {
            const val = new Buffer('test');
            const file = new File({
                cwd: '/',
                path: '/test/test.coffee',
                contents: val
            });
            delete file.basename;
            file.inspect().should.equal('<File "/test/test.coffee" <Buffer 74 65 73 74>>');
            done();
        });

        it('should return correct format when Stream and relative path', done => {
            const file = new File({
                cwd: '/',
                base: '/test/',
                path: '/test/test.coffee',
                contents: new Stream.PassThrough()
            });
            file.inspect().should.equal('<File "test.coffee" <PassThroughStream>>');
            done();
        });

        it('should return correct format when null and relative path', done => {
            const file = new File({
                cwd: '/',
                base: '/test/',
                path: '/test/test.coffee',
                contents: null
            });
            file.inspect().should.equal('<File "test.coffee">');
            done();
        });
    });

    describe('contents get/set', () => {
        it('should work with Buffer', done => {
            const val = new Buffer('test');
            const file = new File();
            file.contents = val;
            file.contents.should.equal(val);
            done();
        });

        it('should work with Stream', done => {
            const val = new Stream.PassThrough();
            const file = new File();
            file.contents = val;
            file.contents.should.equal(val);
            done();
        });

        it('should work with null', done => {
            const file = new File();
            file.contents = null;
            (file.contents === null).should.equal(true);
            done();
        });

        it('should not work with string', done => {
            const val = 'test';
            const file = new File();
            try {
                file.contents = new Buffer(val);
            } catch (err) {
                should.exist(err);
                done();
            }
        });
    });

    describe('relative get/set', () => {
        it('should error on set', done => {
            const file = new File();
            try {
                file.relative = 'test';
            } catch (err) {
                should.exist(err);
                done();
            }
        });

        it('should error on get when no base', done => {
            let a: string;
            const file = new File();
            delete file.basename;
            try {
                // ReSharper disable once AssignedValueIsNeverUsed
                a = file.relative;
            } catch (err) {
                should.exist(err);
                done();
            }
        });

        it('should error on get when no path', done => {
            let a: string;
            const file = new File();
            try {
                // ReSharper disable once AssignedValueIsNeverUsed
                a = file.relative;
            } catch (err) {
                should.exist(err);
                done();
            }
        });

        it('should return a relative path from base', done => {
            const file = new File({
                cwd: '/',
                base: '/test/',
                path: '/test/test.coffee'
            });
            file.relative.should.equal('test.coffee');
            done();
        });

        it('should return a relative path from cwd', done => {
            const file = new File({
                cwd: '/',
                path: '/test/test.coffee'
            });
            file.relative.should.equal('test/test.coffee');
            done();
        });
    });

    describe('path get/set', () => {

        it('should return an absolute path', done => {
            const file = new File({
                cwd: '/',
                base: '/test/',
                path: '/test/test.coffee'
            });
            file.path.should.equal('/test/test.coffee');
            done();
        });

    });

    describe('history get', () => {
        it('should error on set', done => {
            const file = new File();
            try {
                file.history = [];
            } catch (err) {
                should.exist(err);
                done();
            }
        });

        it('should return an history', done => {
            const file = new File({
                cwd: '/',
                base: '/test/',
                path: '/test/test.coffee'
            });
            file.history.should.equal(['/test/test.coffee']);
            done();
        });

    });

    describe('dirname get', () => {

        it('should return an dirname', done => {
            const file = new File({
                cwd: '/',
                base: '/test/',
                path: '/test/test.coffee'
            });
            file.dirname.should.equal('test');
            done();
        });

        it('should set dirname to given value', done => {
            const file = new File();
            file.dirname = '.ext';
            file.dirname.should.equal('.ext');
            done();
        });

        it('should set dirname to null', done => {
            const file = new File();
            file.dirname = null;
            should.not.exist(file.dirname);
            done();
        });
    });

    describe('extname get/set', () => {

        it('should return an extname', done => {
            const file = new File({
                cwd: '/',
                base: '/test/',
                path: '/test/test.coffee'
            });
            file.dirname.should.equal('.coffee');
            done();
        });

        it('should set extname to given value', done => {
            const file = new File();
            file.extname = '.ext';
            file.extname.should.equal('.ext');
            done();
        });

        it('should set extname to null', done => {
            const file = new File();
            file.extname = null;
            should.not.exist(file.extname);
            done();
        });
    });

});
