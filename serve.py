import http.server,socketserver,os
os.chdir('/workspaces/htl-core-')
class H(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        p=self.path.split('?')[0]
        if not(p=='/'or p.startswith('/apps/')or p.startswith('/packages/')):
            self.send_error(404,'HTL: zone interdite');return
        return super().do_GET()
socketserver.TCPServer.allow_reuse_address=True
with socketserver.TCPServer(('',8080),H) as s:
    s.serve_forever()
