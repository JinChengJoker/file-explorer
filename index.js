var fs = require('fs')
var stdin = process.stdin
var stdout = process.stdout
var dirpath = process.cwd()
// 储存当前目录下所有文件stat信息,用于判断文件/文件夹
var file_stats = []

function readDir() {
    fs.readdir(dirpath, function(err, files) {
        console.log('')

        if(!files.length) {
            return console.log('\033[31m 这是一个空的文件夹！ \033[39m \n')
        }

        console.log(' 当前位置 \033[33m' + dirpath + ': \n \033[39m')

        // 清空当前目录下所有文件stat信息
        file_stats = []

        // 列出文件
        forFiles(0)

        function forFiles(i) {
            var filename = files[i]
            fs.stat(`${dirpath}/${filename}`, function(err, stat) {
                file_stats.push(stat)
                if(stat.isDirectory()) {
                    console.log('  ' + i + ' \033[36m' + filename + '/ \033[39m')
                } else {
                    console.log('  ' + i + ' \033[90m' + filename + '\033[39m')
                }
                i++
                if(i > files.length-1) {
                    console.log('')
                    stdout.write('\033[33m 等待输入：\033[39m')
                    stdin.resume()
                    stdin.setEncoding('utf8')
                    // 监听输入，读取相应文件
                    stdin.on('data', readFile)
                } else {
                    forFiles(i)
                }
            })
        }

        function readFile(data) {
            var filename = files[Number(data)]
            var stat = file_stats[Number(data)]
            if(!filename) {
                stdout.write('\033[31m 等待输入：\033[39m')
            } else {
                if(stat.isDirectory()) {
                    dirpath = `${dirpath}\\${filename}`
                    stdin.removeListener('data', readFile)
                    readDir()
                } else {
                    // fs.readFile(`${dirpath}/${filename}`, 'utf8', function(err, data) {
                    //     console.log(data)
                    // })
                }
            }
        }
    })
}

readDir()

// fs.readdir(process.cwd(), function(err, files) {
//     console.log('')

//     if(!files.length) {
//         return console.log('\033[31m No files to show! \033[39m \n')
//     }

//     console.log(' Select which file or directory you want to see \n')

//     file(0)

//     var stats = []

//     function file(i) {
//         var filename = files[i]
//         fs.stat(process.cwd() + '/' + filename, function(err, stat) {
//             stats[i] = stat
//             if(stat.isDirectory()) {
//                 console.log(' ' + i + ' \033[36m' + filename + '/\033[39m')
//             } else {
//                 console.log(' ' + i + ' \033[90m' + filename + '\033[39m')
//             }
//             i++
//             if(i > files.length-1) {
//                 console.log('')
//                 stdout.write('\033[33m Enter your choice: \033[39m')
//                 stdin.resume()
//                 stdin.setEncoding('utf8')
//                 stdin.on('data', read)
//             } else {
//                 file(i)
//             }
//         })
//     }

//     function read(data) {
//         var filename = files[Number(data)]
//         if(!filename) {
//             stdout.write('\033[31m Enter your choice: \033[39m')
//         } else {
//             stdin.pause()
//             if(stats[Number(data)].isDirectory()) {
//                 fs.readdir(process.cwd() + '/' + filename, function(err, files) {
//                     console.log('')
//                     console.log(' (' + files.length + ' files)')
//                     files.forEach(function(file) {
//                         console.log(' - ' + file)
//                     })
//                     console.log('')
//                 })
//             } else {
//                 fs.readFile(process.cwd() + '/' + filename, 'utf8', function(err, data) {
//                     console.log('')
//                     console.log(data)
//                     console.log('')
//                 })
//             }
//         }
//     }
// })