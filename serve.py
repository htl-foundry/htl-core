import http.server

class HTLHardenedHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/':
            self.path = '/apps/htl-test/index.html'
        if not (self.path.startswith('/apps/') or self.path.startswith('/packages/')):
            self.send_error(404, 'HTL: zone interdite')
            return
        super().do_GET()

http.server.test(HandlerClass=HTLHardenedHandler, port=8080, bind='0.0.0.0')
