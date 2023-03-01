const fs = require('fs')

const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

const blanks = [' ', '\t', '\n', '\r']

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
    let state = 0           // Estado do automato
    let lexeme = ''         // Lexemas sendo lido
    let char = ''           // Caractere sendo lido
    const symbolsTable = [] // Tabela de simbolos

    // Função que guarda o caractere atual no lexema
    // e avança para o próximo estado
    const advanceTo = nextState => {
        lexeme += char
        state = nextState
    }

    // acaba de ler um lexema em um estado terminal
    const terminate = finalState => {

        // Só acrescenta o caractere ao lexema se não for um branco
        if(! blanks.includes(char)) lexeme += char
        state = finalState

        // insere o lexema na tabela de simbolos,
        // de acordo com o estado atual
        switch(state) {
            case 6.1:   // plus
                symbolsTable.append({lexeme, token: 'plus'})
                break

            case 6.2:   // minus
                symbolsTable.append({lexeme, token: 'minus'})
                break

            case 6.3:   // times
                symbolsTable.append({lexeme, token: 'times'})
                break

            case 6.4:   // div
                symbolsTable.append({lexeme, token: 'div'})
                break

            case 6.5:   // lparen
                symbolsTable.append({lexeme, token: 'lparen'})
                break

            case 6.6:   // rparen
                symbolsTable.append({lexeme, token: 'rparen'})
                break

            case 6.7:   // keyword read
                symbolsTable.append({lexeme, token: 'keyword', value: lexeme})
                break

            case 6.8:   // identifier
                symbolsTable.append({lexeme, token: 'identifier', value: lexeme})
                break

        }

        // Reseta estado e lexema
        state = 0
        lexema = ''
    }

    // percorre todo o código-fonte, caractere a caractere
    for(let pos = 0; pos < source.length; pos++) {

        // lê um caractere do código-fonte
        char = source.charAt(pos)

        switch(state) {
            case 0:

                if(char === 'r') advanceTo(1)

                else if(char === 'w') advanceTo(7)

                else if(digits.includes(char)) advanceTo(13)

                else if(char === '.') advanceTo(15)

                else if(char === ':') advanceTo(17)

                // Qualquer letra, exceto "r" e "w", já processadas acima
                else if (char.match(/a-zA-Z/)) advanceTo(5)

                else if (char === '+') terminate(6.1)

                else if (char === '-') terminate(6.2)

                else if (char === '*') terminate(6.3)

                else if (char === '/') terminate(6.4)

                else if (char === '(') terminate(6.5)

                else if (char === ')') terminate(6.6)

                // Ignora caracteres em branco
                else if (blanks.includes(char)) continue

                else console.error(`ERROR: unexpected char ${char} at ${pos}.`)

                break

            case 1:

                if(char === 'e') advanceTo(2)
                else if(char.match(/a-zA-Z0-9/)) advanceTo(5)
                else console.error(`ERROR: unexpected char ${char} at ${pos}.`)

                break

            case 2:

                if(char === 'a') advanceTo(3)
                else if(char.match(/a-zA-Z0-9/)) advanceTo(5)
                else console.error(`ERROR: unexpected char ${char} at ${pos}.`)

                break

            case 3:

                if(char === 'd') advanceTo(4)
                else if(char.match(/a-zA-Z0-9/)) advanceTo(5)
                else console.error(`ERROR: unexpected char ${char} at ${pos}.`)

                break
            
            case 4:

                if(char.match(/a-zA-Z0-9/)) advanceTo(5)
                else if(blanks.includes(char)) terminate(6.7)
                else console.error(`ERROR: unexpected char ${char} at ${pos}.`)

                break

            case 5:

                if(char.match(/a-zA-Z0-9/)) advanceTo(5)
                else if(blanks.includes(char)) terminate(6.8)
                else console.error(`ERROR: unexpected char ${char} at ${pos}.`)

                break

        }
    }
}

const source = openFile()
analyze(source)