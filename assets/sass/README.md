https://edrodrigues.com.br/blog/2-maneiras-mais-inteligentes-de-estruturar-o-sass/
# A ESTRUTURA PADRONIZADA 7-1

O nome desta estrutura vem de 7 pastas, 1 arquivo. Essa estrutura é utilizada por muitos, pois é considerada uma boa base para projetos de tamanhos maiores. Tudo o que você precisa fazer é organizar os parciais em 7 pastas diferentes, e um único arquivo (app.sass) deve ficar no nível raiz, tratando das importações. Exemplo abaixo:

# Exemplo de estrutura

sass/
|
|- abstracts/
|  |- _mixins             // Sass Mixins Folder
|  |- _variables.scss     // Sass Variables
|
|- core/
|  |- _reset.scss         // Reset
|  |- _typography.scss    // Typography Rules
|
|- components/
|  |- _buttons.scss       // Buttons
|  |- _carousel.scss      // Carousel
|  |- _slider.scss        // Slider
|
|- layout/
|  |- _navigation.scss    // Navigation
|  |- _header.scss        // Header
|  |- _footer.scss        // Footer
|  |- _sidebar.scss       // Sidebar
|  |- _grid.scss          // Grid
|
|- pages/
|  |- _home.scss          // Home styles
|  |- _about.scss         // About styles
|
|- sections/ (or blocks/)
|  |- _hero.scss          // Hero section
|  |- _cta.scss           // CTA section
|
|- vendors/ (if needed)
|  |- _bootstrap.scss     // Bootstrap
|
- app.scss                // Main Sass file

# ABSTRACTS
Na parcial ABSTRACTS , existe um arquivo com todas as variáveis, mixins e componentes semelhantes.

# COMPONENTES
A parcial de COMPONENTES contém estilos para todos os componentes que devem ser criados para um site, incluindo botões, carrosséis, guias, modais e outros semelhantes.

# CORE
A parcial do CORE contém arquivos como tipografia, redefinições e código clichê, usados ​​em todo o site. Depois de escrever esse código, não há mais sobregravação.

# LAYOUT
O LAYOUT parcial possui todos os estilos necessários para o layout do site, ou seja, cabeçalho, rodapé.

# PAGES
A parcial de PAGES contém os estilos de cada página individual. Quase todas as páginas precisam ter estilos específicos que devem ser usados ​​apenas para aquela página em particular.

# SECTIONS
Para que cada seção seja reutilizável e o código sass seja facilmente acessível, existe a parcial SECTIONS . Além disso, é importante ter essa parcial para que você não precise pesquisar se um código específico está nos arquivos home.sass ou about.sass na parcial Pages.

É uma boa ideia colocar cada seção em um arquivo .sass separado. Portanto, se você tiver duas seções hero diferentes, coloque o código no mesmo arquivo para saber que lá você pode encontrar o código para as duas seções. E se você seguir esse padrão, terá a maioria dos arquivos nesta pasta.

# VENDORS
A parcial de VENDORS destinada a frameworks de bootstrap, portanto, se você usar uma em seu projeto, crie esta parcial.

# all.scss, FILEs
Foi criado um arquivo all.sass em cada pasta. Cada arquivo all.sass deve conter todas as importações para aquela pasta.