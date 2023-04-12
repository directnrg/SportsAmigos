const email = new RegExp('^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$');

const password = new RegExp('^(?=.*[0-9])(?=.*[^a-zA-Z0-9])(?!.*\\s)[^\\s]+$') //a string is not null, doesn't contain any spaces, and has at least one number and special character:

const name = new RegExp('^[A-Za-z]+$')//a string is not null, doesn't contain spaces, numbers or special characters:

const path = new RegExp('^(\/[a-zA-Z0-9_-]+)+$') //a string is in the form of a directory path

const fullName = new RegExp('^[A-Za-z]+(?:\s+[A-Za-z]+)*$/');

const validation = {

    email: email,
    password: password,
    name: name,
    path:path,
    fullName:fullName
}

export {validation}
