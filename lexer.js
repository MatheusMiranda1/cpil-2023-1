const fs = require('fs')

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
    let pos                 // Posição sendo processada
    const symbolsTable = [] // Tabela de simbolos

    // Acrescenta uma quebra de linha ao final do código fonte
    // para possibilitar o processamento do ultimo lexema
    source += '\n'

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
                symbolsTable.push({lexeme, token: 'plus'})
                break

            case 6.2:   // minus
                symbolsTable.push({lexeme, token: 'minus'})
                break

            case 6.3:   // times
                symbolsTable.push({lexeme, token: 'times'})
                break

            case 6.4:   // div
                symbolsTable.push({lexeme, token: 'div'})
                break

            case 6.5:   // lparen
                symbolsTable.push({lexeme, token: 'lparen'})
                break

            case 6.6:   // rparen
                symbolsTable.push({lexeme, token: 'rparen'})
                break

            case 6.7:   // keyword read e write
                symbolsTable.push({lexeme, token: 'keyword', value: lexeme})
                break

            case 6.8:   // identifier
                symbolsTable.push({lexeme, token: 'identifier', value: lexeme})
                break

            case 6.9:   // number
                symbolsTable.push({lexeme, token: 'number', value: lexeme})
                break

            case 6.10:  // assign
                symbolsTable.push({lexeme, token: 'assign'})
                break

        }

        // Reseta estado e lexema
        state = 0
        lexema = ''
    }

    const displayError = () => {
        console.error(`ERROR: unexpected char ${char} at ${pos} (state ${state}).`)
        // Quando houver erro, termina o programa
        process.exit(1)
    }

    // percorre todo o código-fonte, caractere a caractere
    for(pos = 0; pos < source.length; pos++) {

        // lê um caractere do código-fonte
        char = source.charAt(pos)

        switch(state) {
            case 0:

                if(char === 'r') advanceTo(1)

                else if(char === 'w') advanceTo(7)

                else if(char.match(/0-9/)) advanceTo(13)

                else if(char === '.') advanceTo(14)

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

                else displayError()

                break

            case 1:

                if(char === 'e') advanceTo(2)
                else if(char.match(/a-zA-Z0-9/)) advanceTo(5)
                else displayError()
                break

            case 2:

                if(char === 'a') advanceTo(3)
                else if(char.match(/a-zA-Z0-9/)) advanceTo(5)
                else displayError()
                break

            case 3:

                if(char === 'd') advanceTo(4)
                else if(char.match(/a-zA-Z0-9/)) advanceTo(5)
                else displayError()
                break
            
            case 4:

                if(char.match(/a-zA-Z0-9/)) advanceTo(5)
                else if(blanks.includes(char)) terminate(6.7)
                else displayError()
                break

            case 5:

                if(char.match(/a-zA-Z0-9/)) advanceTo(5)
                else if(blanks.includes(char)) terminate(6.8)
                else displayError()
                break

            case 7: 
                if(char === 'r') advanceTo(8)            
                else if(char.match(/a-zA-Z0-9/)) advanceTo(5)
                else if(blanks.includes(char)) terminate(6.8)
                else displayError()
                break

            case 8: 
                if(char === 'i') advanceTo(9)            
                else if(char.match(/a-zA-Z0-9/)) advanceTo(5)
                else if(blanks.includes(char)) terminate(6.8)
                else displayError()
                break

            case 9: 
                if(char === 't') advanceTo(10)            
                else if(char.match(/a-zA-Z0-9/)) advanceTo(5)
                else if(blanks.includes(char)) terminate(6.8)
                else displayError()
                break

            case 10: 
                if(char === 'e') advanceTo(11)            
                else if(char.match(/a-zA-Z0-9/)) advanceTo(5)
                else if(blanks.includes(char)) terminate(6.8)
                else displayError()
                break

            case 11:
                if(char.match(/a-zA-Z0-9/)) advanceTo(5)
                else if(blanks.includes(char)) terminate(6.7)
                else displayError()
                break

            case 13:
                if(char.match(/0-9/)) advanceTo(13)
                else if(char === '.') advanceTo(14)
                else if(blanks.includes(char)) terminate(6.9)
                else displayError()
                break

            case 14:
                if(char.match(/0-9/)) advanceTo(14)
                else if(blanks.includes(char)) terminate(6.9)
                else displayError()
                break

            case 17:
                if(char === '=') terminate(6.10)
                else displayError()
                break 


        }
    }

    // exibe a tabela de símbolos
    console.log('----------------TABELA DE SÍMBOLOS----------------')
    console.log(symbolsTable)
}

const source = openFile()
analyze(source)