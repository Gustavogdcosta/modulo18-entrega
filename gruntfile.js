module.exports = function (grunt) { //declaração da função de grunt (obrigatória para rodar o grunt)
    grunt.initConfig({ //declaração da função inicial do grunt (obrigatória para rodar o grunt)
        pkg: grunt.file.readJSON('package.json'), //atribuição para que o grunt leia as informações no package.json

        //atribuição da função na qual o grunt vai ler o less e automatizar as funções de transformar os arquivos .less em .css e .min.css
        less: {
            development: { //função que irár ler o arquivo less de entrada e converter para arquivo.css de saída.
                files: {'dev/styles/main.css': 'src/styles/main.less'} //caminhos onde o grunt irá procurar os arquivos do less, o arquivo de saída(main.css) que será utilizado no ambiente
                // de desenvolvimento (o arquivo completo, sem estar minificado), e o arquivo de entrada (main.less) que será onde o desenvolvedor colocará todos os códigos, respectivamente.
            },
            production: { //funão que irá pegar o arquivo .less de entrada e converter em arquivo.min.css de saída para o ambiente de produção
                options: {
                    compressed: true,
                    removeComments: true,
                    collapseWhitespace: true},
                files: {'dist/styles/main.min.css': 'src/styles/main.less'}//caminhos onde o grunt irá salvar os arquivos que serão enviados para a produção (quando for fazer o site ficar online)
                // ou mesmo quando abrir o live server, o site irar ler os arquivos comprimidos do css e do html para ficar mais rapidos
            }
        },

        //função watch que atualize automático toda vez que houver midicações no arquivo less, html e JS 
        watch: {
            less: {
                files: ['src/styles/**/*.less'], //atribuição dos arquivos na qual o grunt vai observer
                tasks: ['less:development'] //Atribuição da tarefa que fará o de quando o watch vai ser acionado
            },
            html:{
                files: ['src/index.html'],
                tasks: ['replace:dev']
            },
            JS:{
                files: ['src/scripts/*.js'],
                tasks: ['replace:dev']
            }
        },


        //a função replace irá pegar um arquivo e criar uma cópia dele, e substituir as palavras indicadas.
        replace:{
            dev:{ //indicando que vai ser procurado dentro do ambiente de desenvolvimento
                options:{
                    patterns: [{ //irá procurar uma palavra no arquivo que for ser duplicado para ser substuída por outra
                        match: 'ENDEREÇO_DO_CSS',//palavra que o replace irá procurar dentro do documento a duplicado para ser substituída
                        replacement: './styles/main.css' //palavra na qual a palavra do match acima será substituída
                    }
                ]
                },
                files: [{ //indicar qual arquivo será duplicado e substituído os itens declarados no "patterns" -> [] são sinais de arrays
                    expand: true, //indicando que o arquivo será expandido
                    flatten: true, //indicando que o arquivo será comprimidol
                    src: ['src/index.html'], //arquvo no qual a função replace irá procurar para duplicar
                    dest: 'dev/' //destino no qual será colocado o arquivo duplicado
                }]
            },

            dist:{ //indicando que vai ser procurado dentro do ambiente de produção (dist)
                options:{
                    patterns: [{ //irá procurar uma palavra no arquivo que for ser duplicado para ser substuída por outra
                        match: 'ENDEREÇO_DO_CSS',//palavra que o replace irá procurar dentro do documento a duplicado para ser substituída
                        replacement: './styles/main.min.css' //palavra na qual a palavra do match acima será substituída
                    },
                    { //irá procurar uma palavra no arquivo que for ser duplicado para ser substuída por outra
                        match: 'ENDEREÇO_DO_JS',//palavra que o replace irá procurar dentro do documento a duplicado para ser substituída
                        replacement: 'dist/scripts/main.js' //palavra na qual a palavra do match acima será substituída
                    }
                ]
                },
                files: [{ //indicar qual arquivo será duplicado e substituído os itens declarados no "patterns" -> [] são sinais de arrays
                    expand: true, //indicando que o arquivo será expandido
                    flatten: true, //indicando que o arquivo será comprimido
                    src: ['prebuild/index.html'], //arquvo no qual a função replace irá procurar para duplicar
                    dest: 'dist/' //destino no qual será colocado o arquivo duplicado
                }
            ]
            }
        },


        //a função htmlmin serve para criar os arquivos minificados do html,  ele duplica o arquivo de referência e minimiza o conteúdo no arquivo duplicado
        htmlmin: {
            dist: { //indicação do ambiente de produção
                options: { //indicando que será feito a mimização do arquivo
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {'prebuild/index.html' : 'src/index.html'} //arquivo duplicado com as mudanças descritas no options : arquivo original que será duplicado, respectivamente
            }
        },
        clean: ['prebuild'],
        uglify: {
            target: {
                files: {'dist/scripts/main.min.js': 'src/scripts/main.js'}
            }
        }
    })


    grunt.loadNpmTasks('grunt-contrib-less'); //carregamento do plugin para que o grunt consiga ler arquivos less
    grunt.loadNpmTasks('grunt-contrib-watch'); //carregamento do plugin para que o grunt observer as mudanças nos arquivos atribuídos
    grunt.loadNpmTasks('grunt-replace');//Carregamento do plugin que fará o grunt substituir o arquivo original (sem ter minimizado), por um arquivo temporário, necessário para que
    //se possa "buildar" um arquivo minimizado. A ideia é construir o arquivo de dev -> transferir o conteúdo dele para um arquivo temporário -> minimiar o arquivo temporario -> 
    //transferir o conteúdo do arquivo temporário para o arquivo.min.css que será "buildado" -> excluir arquivo temporário
    grunt.loadNpmTasks('grunt-contrib-htmlmin');//caregamento do plugin para ser usado no grunt.initConfig, para transformar o arquivo temporário do hmtl em min.html
    grunt.loadNpmTasks('grunt-contrib-clean'); //carregamento do plugin para excluir arquivos temporários
    grunt.loadNpmTasks('grunt-contrib-uglify'); //carregamento do plugin para minimizar o JS


    //é preciso executar o Less ou o Sass antes de colocar o watch, para que ele crie os arquivos de saída do .css e do .min.css
    grunt.registerTask('default', ['watch']); //comando para fazer com que o grunt observe o arquivo e a tarefa declarada no grunt.initConfig.
    //colocou a watch como a default do grunt.

    //grunt.registerTask('default', ['less:development']); -> comando para fazer o npm run grunt (função default do grunt) executar o less:development, ou seja as tarefas que foram
    //o npm rum grunt executará, em série, as funções de dentro do cochete ['função 1', 'função 2:ambiente', ... 'função n'], no caso, somente a less:development 

    grunt.registerTask('build', ['less:production', 'htmlmin:dist', 'replace:dist', 'clean', 'uglify']); //comando para executar várias declarações e nos ambientes especificos da função grunt.initConfig
    //lembrar de colocar um comando no arquivo package.json assim > "grunt": "grunt build", em baixo de "scritps" e embaixo de grunt

}