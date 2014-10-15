var Dat = require('dat')
var log = require('single-line-log').stdout

var dat = Dat('./test', function() {
  var inserts = 0
  var updates = 0
  var schemaUpdates = 0
  var changes = 0
  var bytes = 0
  var deletes = 0 

  dat.createChangesReadStream({live:true, data:true})
    .on('data', function(data) {
      changes++
      if (data.value) bytes += data.value.length

      // this is a schema update
      if (data.key === 'schema') {
        schemaUpdates++
      } else if (data.from === 0 && data.to !== 0) {
        // this is an insert
        inserts++
      } else if (data.from !== 0 && data.to !== 0) {
        // this is an update
        updates++
      } else if (data.from !== 0 && data.to !== 0) {
        // this is a delete
        updates--
      } 


      log(
        'Received bytes: '+bytes+'\n'+
        'Total changes: '+changes+'\n'+
        'Schema updates: '+schemaUpdates+'\n'+
        'Inserts: '+inserts+'\n'+
        'Updates: '+updates+'\n'+
        'Delete:  '+deletes+'\n'
      )

    })
    .on('end', function() {
      console.log('no more changes')
    })

  dat.pull('http://npm.dathub.org')
})