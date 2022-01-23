import requests
import time
from threading import Thread
from multiprocessing import Process
def count(x, y):
    # 使程序完成50万计算
    c = 0
    while c < 500000:
        c += 1
        x += x
        y += y

def write():
    f = open("test.txt", "w")
    for x in range(5000000):
        f.write("testwrite\n")
    f.close()

def read():
    f = open("test.txt", "r")
    lines = f.readlines()
    f.close()

def io():
    write()
    read()

_head = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.116 Safari/537.36'}
url = "http://www.tieba.com"
def http_request():
    try:
        webPage = requests.get(url, headers=_head)
        html = webPage.text
        return {"context": html}
    except Exception as e:
        return {"error": e}

def test_single_process():
    # CPU密集操作
    t = time.time()
    for x in range(10):
        count(1, 1)
    print("Line cpu", time.time() - t)
    # IO密集操作
    t = time.time()
    for x in range(10):
        write()
        read()
    print("Line IO", time.time() - t)
    # 网络请求密集型操作
    t = time.time()
    for x in range(10):
        http_request()
    print("Line Http Request", time.time() - t)

def test_multithread_cpu():
    counts = []
    t = time.time()
    for x in range(10):
        thread = Thread(target=count, args=(1,1))
        counts.append(thread)
        thread.start()
    e = counts.__len__()
    while True:
        for th in counts:
            if not th.is_alive():
                e -= 1
        if e <= 0:
            break
    print("Multithread cpu", time.time() - t)

def test_multithread_io():
    t = time.time()
    ios = []
    for x in range(10):
        thread = Thread(target=io)
        ios.append(thread)
        thread.start()

    e = ios.__len__()
    while True:
        for th in ios:
            if not th.is_alive():
                e -= 1
        if e <= 0:
            break
    print("Multithread IO", time.time() - t)

def test_multithread_netio():
    ios = []
    t = time.time()
    for x in range(10):
        thread = Thread(target=http_request)
        ios.append(thread)
        thread.start()

    e = ios.__len__()
    while True:
        for th in ios:
            if not th.is_alive():
                e -= 1
        if e <= 0:
            break
    print("Multithread Http Request", time.time() - t)


def test_mp_cpu():
    counts = []
    t = time.time()
    for x in range(10):
        process = Process(target=count, args=(1, 1))
        counts.append(process)
        process.start()
    e = counts.__len__()
    while True:
        for th in counts:
            if not th.is_alive():
                e -= 1
        if e <= 0:
            break
    print("Multiprocess cpu", time.time() - t)

def test_mp_io():
    counts = []
    t = time.time()
    for x in range(10):
        process = Process(target=io)
        counts.append(process)
        process.start()
    e = counts.__len__()
    while True:
        for th in counts:
            if not th.is_alive():
                e -= 1
        if e <= 0:
            break
    print("Multiprocess IO", time.time() - t)

def test_mp_netio():
    httprs = []
    t = time.time()
    for x in range(10):
        process = Process(target=http_request)
        httprs.append(process)
        process.start()

    e = httprs.__len__()
    while True:
        for th in httprs:
            if not th.is_alive():
                e -= 1
        if e <= 0:
            break
    print("Multiprocess Http Request", time.time() - t)

def test_let_netio():
    import gevent
    from gevent import monkey
    monkey.patch_all()
    httprs = []
    t = time.time()
    httprs=[gevent.spawn(http_request) for i in range(10)]
    gevent.joinall(httprs)
    print("Gevent Http Request", time.time() - t)

if __name__ == '__main__':
    test_single_process()
    test_multithread_cpu()
    test_multithread_io()
    test_multithread_netio()
    test_mp_cpu()
    test_mp_io()
    test_mp_netio()
    test_let_netio()