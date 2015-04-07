"""
web utils:
    1. download a page by url
    2. download an image by url
"""
import sys
import os
import requests
from PIL import Image


def download_page(url):
    # return the content of page
    if not url:
        return ''
    try:
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.57 Safari/537.36'}
        r = requests.get(url, timeout=5, headers=headers)
        if r.status_code == 200:
            return r.content
        else:
            return ''
    except Exception as e:
        print("download fail: %s\n" % e)
        return ''


def download_image(url, path, name):
    # download image
    try:
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.57 Safari/537.36'}
        r = requests.get(url, stream=True, timeout=5, headers=headers)
        file = os.path.join(path, name)
        
        with open(file, 'wb') as f:
            for chunk in r.iter_content(chunk_size=1024):
                f.write(chunk)
                
        img_p = Image.open(os.path.join(path, name)) # Creates an instance of PIL Image class - PIL does the verification of file
        img_type = img_p.format
        if img_type in ('GIF', 'JPEG', 'JPG', 'PNG'):
            try:
                img_p.verify()
            except:
                print("verify error")
                return False
        else:
            print("wrong img type")
            return False
    except Exception as e:
        print("download image fail: %s\n" % e)
        return False
    return True

if __name__ == "__main__":
    print(download_image("http://s3.zerochan.net/Yuigahama.Yui.240.1859089.jpg", './', 'baidu.jpg'))
