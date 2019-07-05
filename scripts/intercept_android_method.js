// https://11x256.github.io/Frida-hooking-android-part-1/
Java.perform(function x(){
    console.log("Inside java perform function");

    // Get a wrapper for the class containing the function in question
    var my_class = Java.use("sun.security.util.ObjectIdentifier");

    //replace the original implmenetation of the function "toString" with function in question and fill in the function with the correct number of
    //placeholder variables
    my_class.toString.overload = function(){
        //print the original arguments
        // console.log( "original call: fun("+ x +")");

        // Run the actual function and retrieve the return value
        var ret_value = this.fun();
        console.log("Return value: " + ret_val);
        return ret_value;
}});
