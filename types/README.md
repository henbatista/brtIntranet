# ESTRUTURA DE PASTAS PARA TYPES

Essa estrutura oferece uma organização modular e escalável, facilitando a localização, a manutenção das interfaces para definição de tipos. O objetivo é centraliza, padronizar, evitar a duplicação de código e facilitar a manutenção. Ela também promove a separação de responsabilidades e ajuda a manter um código limpo e bem organizado.

Nesta estrutura, os componentes são agrupados de acordo com suas funcionalidades e responsabilidades. Algumas sugestões incluem:

# BACKEND

A pasta BACKEND contém definição das interfaces dos objetos / classes que serão buscadas pelo front no back, basicamente serão utilizadas estas definições na variáveis ou funções que retornarão dados do backend.

## Exemplo

export interface MetApiResults {
benchmark: number
status: 'success' | 'failure'
query: MetApiQuery
paginate?: MetApiPaginate
data: unknown
}

export interface MetApiPaginate {
current_page: number
first_item: number
last_item: number
last_page: number
pages: Array<number>
per_page: number
total: number
}

# FRONTEND

A pasta FRONTEND contém definição das interfaces dos objetos / classes que serão utilizados pelo front nos diversos componentes e páginas de nossa aplicação.

## Exemplo

export interface UserLogin {
token: string
user: models.User
provider: string
error?: string
action?: LoginAction
}

# MODELS

A pasta MODELS contém definição das interfaces dos objetos que foram modelados no back (somente o objeto). Difere da pasta backend pois não deve conter propriedades como paginação, status de erro ou algo semelhante.

## Exemplo

    export interface Provider {
      // columns
      id: number
      user_id: number
      avatar: string|null
      name: string
      payload: string[]
      created_at: Date|null
      updated_at: Date|null
    }
