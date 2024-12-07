# Mobile Dictionary

Um aplicativo que permite listar, visualizar e gerenciar palavras em inglês, utilizando a [Free Dictionary API](https://dictionaryapi.dev/) como fonte de dados.

> This is a challenge by [Coodesh](https://coodesh.com/)

## Demonstração

### Parte I

https://github.com/user-attachments/assets/a5087965-b59a-4a48-bdd1-76b48c6b2b11

### Parte II

https://github.com/user-attachments/assets/7208c7c6-e022-4a50-b04a-7406efa1f0ee

## Índice 

- [Casos de Uso](#casos-de-uso)
- [Processo de Investigação](#processo-de-investigação)
- [Funcionalidades](#funcionalidades)
- [Tecnologias Usadas](#tecnologias-usadas)
- [Instalação](#instalação)

## Casos de Uso

O projeto foi desenvolvido com base nos seguintes casos de uso:

- **Como usuário, devo ser capaz de** visualizar uma lista de palavras com rolagem infinita.
- **Como usuário, devo ser capaz de** visualizar uma palavra, seus significados e a fonética.
- **Como usuário, devo ser capaz de** salvar uma palavra como favorito.
- **Como usuário, devo ser capaz de** remover uma palavra dos favoritos.
- **Como usuário, devo ser capaz de** visitar uma lista com as palavras que já vi anteriormente.

## Processo de Investigação

### Hipóteses Iniciais
- A API fornece uma exntensa lista de dados estruturados que pode gerar desafios na manipulação e exibição desses dados no aplicativo.
- Penso em usar o `AsyncStorage` para armazenamento local no dispositivo do usuário, pois seu uso é simples e já atende aos requisitos.

### Pesquisa sobre a API
- Endpoint utilizado: `/v1/entries/en/{word}`
- O retorno inclui definições, exemplos e outras informações detalhadas. Decidi usar apenas os campos mencionados e demonstrados no wireframe.

### Decisões Técnicas
- **Linguagem/Framework**: Escolhi React Native para o desenvolvimento pois tem a possiblidade de usar o poder da única base de código para gerar a aplicação para iOS e Android. Além disso, me permite usar conceitos e princípios que o React aplica, o que me permitirá reusar conceitos já conhecidos.
- **Gerenciamento de Estado**: Usei React Context API para compartilhar o estado entre componentes. Optei por ela pois é uma solução já nativa da tecnologia, o que me permite concentrar minhas forças em outras frentes.

## Funcionalidades

1. Login e registro de novos usuários (Firebase Authentication)
2. Efeitos de loading (UX)
3. Rolagem infinita
4. Visualizção da palavra, seu(s) significado(s), fonética e pronuncia
5. Tocador de áudio para palavras que possuem a pronuncia (mp3) disponível
6. Armazenamento local das palavras visitadas (histórico) e favoritadas

## Planejamento do Fluxo de Trabalho

1. Configuração inicial do projeto.
2. Criação de componentes auxiliares.
3. Uso de uma lista fixa de dados (10 itens).
4. Codificação com Expo Web.
5. Reorganização do código para uso no Android.
6. Integração com a API para buscar dados.
7. Implementação da listagem de palavras.
8. Armazenamento local das palavras visualizadas e favoritadas.

## Desafios e Soluções
- **Problema**: Excesso de informações no retorno da API.
  - **Solução**: Filtrei apenas os dados relevantes para o objetivo do projeto.

## Tecnologias Usadas

- **Linguagem**: JavaScript
- **Framework**: React Native
- **Outras Tecnologias**: 
  - React Navigation
  - AsyncStorage
  - Expo
  - Firebase
  - NativeWind
  - TypeScript
  - Prettier e ESLint

## Instalação

Siga as etapas abaixo para configurar e instalar o Mobile Dictionary em seu ambiente local:

1. Clone o repositório e acesse o diretório:

```bash
git clone git@github.com:brunohnsouza/mobile-dictionary.git
cd mobile-dictionary
```

2. Instale as dependências do projeto:

```bash
npm install
```

3. Inicie o servidor em modo de desenvolvimento:

```bash
npx expo start
```

Após iniciar o projeto, use o app `Expo Go` para escanear o QR Code presente no terminal ou pressione a tecla `w` para abrir seu projeto na web.
