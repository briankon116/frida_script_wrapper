/*
 * raptor_frida_android_enum.js - Java class/method enumerator
 * Copyright (c) 2017 Marco Ivaldi <raptor@0xdeadbeef.info>
 *
 * Frida.re JS functions to enumerate Java classes and methods
 * declared in an iOS app. See https://www.frida.re/ and
 * https://codeshare.frida.re/ for further information on this
 * powerful tool.
 *
 * "We want to help others achieve interop through reverse
 * engineering" -- @oleavr
 *
 * Example usage:
 * # frida -U -f com.target.app -l raptor_frida_android_enum.js --no-pause
 *
 * Get the latest version at:
 * https://github.com/0xdea/frida-scripts/
 */

// enumerate all Java classes
function enumAllClasses()
{
	var allClasses = [];
	var classes = Java.enumerateLoadedClassesSync();

	classes.forEach(function(aClass) {
		try {
			var className = aClass.match(/[L](.*);/)[1].replace(/\//g, ".");
		}
		catch(err) {} // avoid TypeError: cannot read property 1 of null
		allClasses.push(className);
	});

	return allClasses;
}

// find all Java classes that match a pattern
function findClasses(pattern)
{
	var allClasses = enumAllClasses();
	var foundClasses = [];

	allClasses.forEach(function(aClass) {
		try {
			if (aClass.match(pattern)) {
				foundClasses.push(aClass);
			}
		}
		catch(err) {} // avoid TypeError: cannot read property 'match' of undefined
	});

	return foundClasses;
}

// enumerate all methods declared in a Java class
function enumMethods(targetClass)
{
	var hook = Java.use(targetClass);
	var ownMethods = hook.class.getDeclaredMethods();
	hook.$dispose;

	return ownMethods;
}

/*
 * The following functions were not implemented because deemed impractical:
 *
 * enumAllMethods() - enumerate all methods declared in all Java classes
 * findMethods(pattern) - find all Java methods that match a pattern
 *
 * See raptor_frida_ios_enum.js for a couple of ObjC implementation examples.
 */

// usage examples
setTimeout(function() { // avoid java.lang.ClassNotFoundException

	Java.perform(function() {

		// enumerate all classes
		var a = enumAllClasses();
		a.forEach(function(s) {
            if(s != null){
                try{
                    var b = enumMethods(s)
                    b.forEach(function(c) {
                        methodLine = String(c);
                        elements = methodLine.split(' ');
                        className = elements[elements.length - 1];
                        console.log(className);
                        //console.log(s + ":" + c);
                        send(className);
                   });
                }catch(e){
                    //console.log(e);
                }
            }
        });
	});
}, 0);
