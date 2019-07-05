// Use this script to generate a list of functions exported by a particular native module of an application
setTimeout(function(){
Java.perform(function() {
    Process.enumerateModulesSync()
    .filter(function(m){ return m['path'].toLowerCase().indexOf('app') !=-1 ; })
    .forEach(function(m) {

        // Enter name of module here
        if(m.name == 'libffmpeg.so'){
            send(JSON.stringify(m, null, '  '));
            // to list exports use Module.enumerateExportsSync(m.name)
            Module.enumerateExportsSync(m.name)
            .forEach(function(e){
                try{
                    exportAddress = Module.findExportByName(m.name, e.name);
                    if(exportAddress){
                        send("Export address: " + exportAddress + " name: " + e.name);
                        Interceptor.attach(Module.findExportByName(m.name, e.name), {
                            onEnter: function(args) {
                                console.log(m.name + "#'" + e.name + "'");
                            }
                        });
                    }
                }catch(err){}
            });
        }
    });
});}, 0);
