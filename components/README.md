# ESTRUTURA DE PASTAS PARA COMPONENTES
Essa estrutura oferece uma organização modular e escalável, facilitando a localização, a manutenção e a reutilização de componentes em projetos maiores. Ela também promove a separação de responsabilidades e ajuda a manter um código limpo e bem organizado.

Nesta estrutura, os componentes são agrupados de acordo com suas funcionalidades e responsabilidades. Algumas sugestões incluem:

# COMMON
A pasta COMMON contém componentes reutilizáveis, organizados por tipo ou categoria. Por exemplo, os componentes de botão estão em uma pasta separada chamada Button, enquanto os componentes de formulário estão agrupados em uma pasta Form. Isso facilita a localização e a reutilização de componentes específicos.

# LAYOUT
A pasta LAYOPUT contém layouts personalizados, como DefaultLayout.vue para a maioria das páginas e AdminLayout.vue para páginas do painel de administração.

# PAGES
A pasta PAGES contém os componentes específicos de cada página do site. Cada página tem sua própria pasta com seus respectivos componentes.

# SHARED
A pasta SHARED contém código compartilhado, como utilitários, constantes e serviços. Isso inclui arquivos de utilidade, como api.js para lidar com chamadas de API, validation.js para funções de validação, bem como serviços para comunicação com o servidor, como authService.js e productService.js.

# EXEMPLO

components/
|--- layout/
|    |--- DefaultLayout.vue
|    |--- AdminLayout.vue
|
|--- common/
|    |--- Button/
|    |    |--- Button.vue
|    |    |--- ButtonIcon.vue
|    |
|    |--- Form/
|    |    |--- Input.vue
|    |    |--- TextArea.vue
|    |    |--- Select.vue
|    |
|    |--- Modal/
|    |    |--- Modal.vue
|    |    |--- ModalHeader.vue
|    |    |--- ModalBody.vue
|    |    |--- ModalFooter.vue
|    |
|    |--- ...
|
|--- pages/
|    |--- Home/
|    |    |--- Banner.vue
|    |    |--- FeaturedProducts.vue
|    |    |--- ...
|    |
|    |--- About/
|    |    |--- Team.vue
|    |    |--- Testimonials.vue
|    |    |--- ...
|    |
|    |--- Admin/
|    |    |--- AdminDashboard.vue
|    |    |--- AdminProducts.vue
|    |    |--- ...
|    |
|    |--- ...
|
|--- shared/
|    |--- utils/
|    |    |--- api.js
|    |    |--- validation.js
|    |
|    |--- constants/
|    |    |--- routes.js
|    |    |--- ...
|    |
|    |--- services/
|    |    |--- authService.js
|    |    |--- productService.js
|    |    |--- ...
