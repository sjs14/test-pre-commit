import shell from 'shelljs'


const res = shell.exec('git diff --cached --name-only')

console.log(res);