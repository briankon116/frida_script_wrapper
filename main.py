import frida, time, select, datetime
from sys import stdin
from sys import stdout
from argparse import ArgumentParser
from frida_js_generator import generate_js
from itertools import zip_longest

dataInputStill = True
seenMethods = []

def on_message(m, _data):
    global dataInputStill, seenMethods

    if m['type'] == 'send':
        print(m['payload'])
        if('called' in m['payload']):
            method = m['payload'].split(' ')[0]

            if(method in seenMethods):
                return

            seenMethods.append(method)

        outputFile = open('output.log', 'a+')
        outputFile.write('%s %s\n' % (str(datetime.datetime.now().isoformat()), m['payload']))
        outputFile.close()
        dataInputStill = True
    elif m['type'] == 'error':
        print(m)

def load_script(script):
    # Read our code file
    frida_code = None
    with open(script) as f:
        frida_code = f.read()

    return frida_code

def load_classes_file(classesFilePath):
    classesFile = open(classesFilePath, 'r')
    return [line.strip() for line in classesFile.readlines()]

def group_classes(classes, n):
    args = [iter(classes)] * n
    return list(zip_longest(*args, fillvalue=''))

def runScript(device, app_id, script):
    global dataInputStill
    pid = device.spawn([app_id])
    session = device.attach(pid)

    script = session.create_script(load_script(script))
    script.on('message', on_message)
    script.load()
    device.resume(app_id)
    time.sleep(7)

    # Use this while loop when running through classes file. This will terminate current hook session if no more new data is
    # seen every 5 seconds. If you want to play around with the device while a set of hooks are in place, then comment out
    # this block and uncomment stdin.read() to keep the output stream open until ctl-c is pressed
    while(True):
        time.sleep(5)
        if(not dataInputStill):
            break
        dataInputStill = False
    session.detach
    # stdin.read()

def main(device_id, app_id, script, classes=None):
    device = None
    while(True):
        try:
            device = frida.get_device(device_id)
        except:
            time.sleep(1)
            continue
        break

    if(classes):
        classesGroups = group_classes(load_classes_file(classes), 4)
        for group in classesGroups:
            # print('Running group: %s' % str(group))
            generate_js(group)
            runScript(device, app_id, 'currentHooks.js')
    else:
        runScript(device, app_id, script)

if __name__ == '__main__':
    parser = ArgumentParser()
    parser.add_argument('--app', help='app identifier "com.company.app"')
    parser.add_argument('--device', help='method name "Device serial number that you would like hooked')
    parser.add_argument('--script', help='Path to script', default=None)
    parser.add_argument('--classes', help='File containing the classes/method names for the application', default=None)
    args = parser.parse_args()
    main(args.device, args.app, args.script, args.classes)
