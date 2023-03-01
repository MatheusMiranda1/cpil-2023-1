const fs = require('fs')

const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

/* abre o arquivo que será analisado */
const openFile = () => {

    // pega o terceiro parâmetro da linha de comando
    const filename = process.argv[2]

    // se houver o terceiro parâmetro
    if(filename) {
        try {
            const fileContent = fs.readFileSync(filename, 'utf-8')
            return fileContent
        }
        catch(error) {
            console.error(error)
            return null
        }
    }
    else {
        console.log('Usage: node lexer.js <filename>')
        console.log('No filename provided.')
        process.exit(-1)    // termina o script com erro
    }
}

const analyze = source => {
    let state = 0

    // percorre todo o código-fonte, caractere a caractere
    for(let pos = 0; pos < source.length; pos++) {

        // lê um caractere do código-fonte
        const char = source.charAt(pos)

        switch(state) {
            case 0:

                if(char === 'r') state = 1

                else if(char === 'w') state = 7

                else if(digits.includes(char)) state = 13
        }
    }
}

const source = openFile()
analyze(source)