var should = chai.should();

describe("Application", function() {
  it("creates a global variable for the name space", function () {
    should.exist(app);
  })
});

describe("Persistence", function() {
  beforeEach(function() {
    this.video = new app.Video();
    this.save_stub = sinon.stub(this.video, "save");
  })
  afterEach(function() {
    this.save_stub.restore();
  })
  it("should update server when title is changed", function() {
    this.video.set("title", "New Title");
    this.save_stub.should.have.been.calledOnce;
  })
  it("should update server when yt_id is changed", function() {
    this.video.set('yt_id',true);
    this.save_stub.should.have.been.calledOnce;
  })
    it("should update server when url is changed", function() {
    this.video.set('url',true);
    this.save_stub.should.have.been.calledOnce;
  })
  it("should update server when thumbnail is changed", function() {
    this.video.set('thumbnail',true);
    this.save_stub.should.have.been.calledOnce;
  })
    it("should update server when status is changed", function() {
    this.video.set('complete',true);
    this.save_stub.should.have.been.calledOnce;
  })
})