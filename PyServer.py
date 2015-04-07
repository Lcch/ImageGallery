import sys
import os
import re
import webutils
import socket
import http.server
import socketserver
import urllib
import datetime
from http.server import BaseHTTPRequestHandler
from bs4 import BeautifulSoup

def fix_url(url, im_url):
    if im_url[0] == '/' and im_url[1] == '/':
        return 'http:' + im_url
    if im_url[0:4] != "http":
        if url[-1] != '/':
            url += '/'
        if im_url[0] == '/':
            im_url = url + im_url[1:]
        else:
            im_url = '/'.join(url.split('/')[0:3]) + '/' + im_url
    return im_url

def search_all_image_url(url):
    img_url_list = set()
    page = webutils.download_page(url) 
    pg = BeautifulSoup(page)
    for im in pg.findAll('img'):
        img_url = im.get('src')
        if img_url is None:
            continue
        img_name = img_url.split('/')[-1]
        suffix = img_name.split('.')[-1]
        if suffix == 'gif' or suffix == 'png' or suffix == 'jpg':
            img_url_list.add(fix_url(url, img_url))
            # print(img_url)

    for im in pg.findAll('a'):
        img_url = im.get('href')
        if img_url is None:
            continue
        img_name = img_url.split('/')[-1]
        suffix = img_name.split('.')[-1]
        if suffix == 'gif' or suffix == 'png' or suffix == 'jpg':
            img_url_list.add(fix_url(url, img_url))

    return img_url_list 

def download_all_images(img_set):
    for img_url in img_set:
        img_name = img_url.split('/')[-1]
        webutils.download_image(img_url, './images/', img_name)

def go(url):
    print(url)
    img_set = search_all_image_url(url)
    # download_all_images(img_set)
    return img_set

class myHandle(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.end_headers()

        url = self.path
        url = url[1:]
        img_name = url.split('/')[-1]
        img_name = img_name.lower() + str(datetime.datetime.now())
        new_name = ""
        for ch in img_name:
            if ch.isalnum():
                new_name += ch
            else:
                new_name += '-'
        img_name = new_name

        message = ""
        if webutils.download_image(url, './public/uploads', img_name):
            message = img_name
            print("DONE: ", message)
        else:
            print("FAIL: ", message)

        self.wfile.write(message.encode('utf-8'))
        return

def main():
  PORT = 8000
  Handler = http.server.SimpleHTTPRequestHandler
  httpd = socketserver.TCPServer(("localhost", PORT), myHandle)
  print("serving at port", PORT)
  httpd.serve_forever()

if __name__ == "__main__":
    main()
