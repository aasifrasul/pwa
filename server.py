#!/usr/bin/env python3
import argparse
from http.server import HTTPServer, SimpleHTTPRequestHandler
import os

class CORSRequestHandler(SimpleHTTPRequestHandler):
    routes = {
        '/ModalPopup': 'ModalPopup.html',
        '/CustomButton': 'CustomButton.html',
        '/': 'index.html',
        # Add more routes here...
    }

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

    def do_GET(self):
        if self.path in self.routes:
            self.serve_specific_html(self.routes[self.path])
        else:
            super().do_GET()

    def serve_specific_html(self, filename):
        try:
            with open(filename, 'rb') as f:
                self.send_response(200)
                self.send_header('Content-type', 'text/html')
                self.end_headers()
                self.wfile.write(f.read())
        except FileNotFoundError:
            self.send_response(404)
            self.send_header('Content-type', 'text/plain')
            self.end_headers()
            self.wfile.write(b'File not found')
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'text/plain')
            self.end_headers()
            self.wfile.write(f'Internal server error: {e}'.encode())

def main():
    parser = argparse.ArgumentParser(description='Start a simple HTTP server with CORS enabled.')
    parser.add_argument('-p', '--port', type=int, default=8000, help='Port number to listen on.')
    args = parser.parse_args()

    try:
        httpd = HTTPServer(('0.0.0.0', args.port), CORSRequestHandler)
        print(f'Serving HTTP on port {args.port}...')
        httpd.serve_forever()
    except OSError as e:
        print(f"Error: Could not start server on port {args.port}: {e}")
    except KeyboardInterrupt:
        print("\nServer stopped.")

if __name__ == '__main__':
    main()