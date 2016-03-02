var request = require('supertest');
var server = require('../server');

describe('GET /', function() {
  it('should return 200 OK', function(done) {
    request(server)
      .get('/')
      .expect(200, done);
  });
});

describe('POST /auth', function() {
  it('should respond with json', function(done) {
    request(server)
      .post('/auth')
      .set('Accept', 'application/json')
      .expect(200, {
        success: true
      }, done);
  });
});

describe('GET /random-url', function() {
  it('should return 404', function(done) {
    request(server)
      .get('/reset')
      .expect(404, done);
  });
});

describe('POST /register with no body', function() {
  it('should return 500 Internal Server Error', function(done) {
    request(server)
      .post('/register')
      .expect(500, done);
  });
});

describe('POST /login with no body', function() {
  it('should return 500 Internal Server Error', function(done) {
    request(server)
      .post('/login')
      .expect(500, done);
  });
});
