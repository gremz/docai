use Rack::Static,
  :urls => ["/app/js/lib", "/app/js/app", "/app/css"]

run lambda { |env|
  [
    200,
    {
      'Content-Type'  => 'text/html',
      'Cache-Control' => 'public, max-age=86400'
    },
    File.open('app/index.html', File::RDONLY)
  ]
}
