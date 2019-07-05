/*
 *  Use this script to read and/or modify the arguments and return values of native functions. Currently it is reading the buffers passed into read, however
 *  this works just as well with proprietary libraries such as libpuffin.so. Use native_module_exports.js to get a list of the native functions loaded by a
 *  particular application
 * */
Java.perform(function(){
    send(Module.findExportByName('libc.so','read'));
    Interceptor.attach(Module.findExportByName('libc.so', 'read'), {
      onEnter: function (args) {
        // Read the string at the memory location specified by argument 1
        console.log(Memory.readCString(args[1]));
      },
      onLeave: function (retval) {
        console.log(retval);
        // console.log(Memory.readCString(args[1]))
      }
    });
});
