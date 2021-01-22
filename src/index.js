//npm init -y (in the folder) to start a node project
//npm install [package_name] -> npm install node-fetch
//documentation node-fetch -> https://www.npmjs.com/package/node-fetch
//fake request -> https://jsonplaceholder.typicode.com/
"use strict"

/* Requires */ 
const fs = require("fs")
const util = require("util")
const readFilePromise = util.promisify(fs.readFile)
const writeFilePromise = util.promisify(fs.writeFile)
const fetch = require("node-fetch")
const prompt = require("promise-prompt")

function parser(array, letter){
    let string = `Utenti con la lettera '${letter}' nel nome:\n\n`
    array.forEach(e => {
        string
            += (`- Utente con l'ID ${e.id}\n`) 
            + (`\t Nome: ${e.name}\n`) 
            + (`\t Email: ${e.email}\n`) 
            + (`\t Città: ${e.address.city}\n\n`)
    })
    string = string.slice(0, -2)
    return string
}

/* Code */
Promise.all([
    prompt("Inserisci una lettera: "),
    fetch("https://jsonplaceholder.typicode.com/users")
        .then(res => res.json())
]) 
    .then(data => {
        let letter = data[0].toLowerCase()
        let users = data[1]
        
        let usersFiltered = users.filter(e => e.name.toLowerCase().includes(letter))
        let output = parser(usersFiltered, letter)

        writeFilePromise("./output.txt", output)
        return [usersFiltered.length, letter]
    })
    .then((data) => {
        console.log("L'output è stato salvato correttamente")
        let nUsers = data[0]
        let letter = data[1]
        fetch(`https://reqres.in/api/users/${nUsers}`)
            .then(res => res.json())
            .then(users => {
                let output = `Essendo presenti ${nUsers} users con la lettera '${letter}' nel file 'output.txt', stamperò le credenziali dell'utente con ID ${nUsers}:\n\n`
                output += JSON.stringify(users)
                return writeFilePromise("./output2.txt", output)
            })
            .then(() => console.log("L'output 2 è stato salvato correttamente"))
            .catch(err => {
                if (err.code === "ENOENT"){
                    console.log(err.message)
                } else{
                    console.log(err)
                }
            })    
    })
    .catch(err => {
        if (err.code === "ENOENT"){
            console.log(err.message)
        } else{
            console.log(err)
        }
    })