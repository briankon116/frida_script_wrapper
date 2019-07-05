from argparse import ArgumentParser

def generate_js(classes):

    scriptFile = open('currentHooks.js', 'w')
    scriptFile.write('setTimeout(function(){\n')
    scriptFile.write('Java.perform(function(){\n')

    # for line in classesFile:
    for line in classes:
        if('(' not in line):
            continue

        currentClassAndMethod = line.split('(')[0].split('.')
        currentClass = '.'.join(currentClassAndMethod[:-1])
        currentMethod = currentClassAndMethod[-1]
        currentArguments = line.strip().split('(')[1].split(')')[0]

        if(currentMethod[0] == '-'):
            continue

        if(currentArguments != ''):
            scriptFile.write('Java.use("%s").%s.overload("%s")' % (currentClass,currentMethod,currentArguments))
        else:
            scriptFile.write('Java.use("%s").%s' % (currentClass,currentMethod))
        scriptFile.write('.implementation=function(){send("%s.%s called")}\n' % (currentClass, currentMethod))

    scriptFile.write('});}, 0);')
    scriptFile.close()
