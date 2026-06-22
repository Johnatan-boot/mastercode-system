import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const DB_FILE = path.join(process.cwd(), "db.json");

function loadDB() {
  let data;
  if (!fs.existsSync(DB_FILE)) {
    data = {
      users: [
        { 
          id: 1, 
          email: 'neo@mastercode.io', 
          password: bcrypt.hashSync('redpill', 10), 
          name: 'Neo', 
          role: 'student',
          xp: 1250,
          level: 12,
          streak: 5,
          subscription: 'premium',
          status: 'active',
          lastActivity: new Date().toISOString()
        },
        { 
          id: 2, 
          email: 'architect@mastercode.io', 
          password: bcrypt.hashSync('matrix', 10), 
          name: 'The Architect', 
          role: 'admin',
          xp: 9999,
          level: 99,
          streak: 365,
          subscription: 'lifetime',
          status: 'active',
          lastActivity: new Date().toISOString()
        }
      ],
      courses: [
        { id: 'matrix-mastery', title: "Curso de HTML5", description: "HTML5 é o padrão universal para estruturação e apresentação de conteúdo na Web. Domine o desenvolvimento de páginas robustas com elements semânticos, de acordo com o W3Schools.", category: 'Frontend', image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGG0QaJVkViJZHIhrcVli45Ksmkq6SIBfFN8WnzFMDNQ&s=10", totalLessons: 12, duration: "20h" },
        { id: 'css-mastery', title: "Curso de CSS3", description: "CSS3 define toda a estética de estilo, posicionamento comercial, layouts dinâmicos Flexbox/Grid e animações de interface web de acordo com a documentação W3Schools.", category: 'Frontend', image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7J6l5SdqgHW3ZS8t1rBuzUmMtAFJrNJJIAwKo-Bhe3w&s=10", totalLessons: 10, duration: "15h" },
        { id: 'js-mastery', title: "Curso de JavaScript", description: "O JavaScript é a linguagem mais utilizada do mundo. Domine variáveis, funções, objetos, DOM, APIs, Async/Await e manipulações assíncronas de acordo com a documentação W3Schools.", category: 'Frontend', image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQc_dfw8pbzQGsEeuiWw3Zm1RgIAsGvnePn46bKV25Rqw&s=10", totalLessons: 10, duration: "12h" }
      ],
      modules: [
        { id: 'html5-mod-1', courseId: 'matrix-mastery', title: 'Módulo 1: Fundamentos & Estrutura Semântica', order: 1 },
        { id: 'html5-mod-2', courseId: 'matrix-mastery', title: 'Módulo 2: Conteúdo, Links & Tabelas', order: 2 },
        { id: 'html5-mod-3', courseId: 'matrix-mastery', title: 'Módulo 3: Formulários & Interatividade', order: 3 },
        { id: 'html5-mod-4', courseId: 'matrix-mastery', title: 'Módulo 4: Elementos de Mídia & APIs Modernas', order: 4 },
        { id: 'css-mod-1', courseId: 'css-mastery', title: 'Módulo 1: Sintaxe, Seletores e Cores', order: 1 },
        { id: 'css-mod-2', courseId: 'css-mastery', title: 'Módulo 2: O Box Model e Tipografia', order: 2 },
        { id: 'css-mod-3', courseId: 'css-mastery', title: 'Módulo 3: Flexbox, Grid & Responsividade', order: 3 },
        { id: 'css-mod-4', courseId: 'css-mastery', title: 'Módulo 4: Efeitos, Transições & Animações', order: 4 }
      ],
      lessons: [
        {
          id: 'html5-les-1',
          moduleId: 'html5-mod-1',
          title: 'HTML5 Introdução & Sintaxe',
          videoUrl: 'https://www.youtube.com/embed/gTMas0oiaEU',
          content: '### O que é o HTML5?\nHTML5 é a versão mais recente do padrão HTML (HyperText Markup Language), o bloco de construção básico da World Wide Web. Ele define como os navegadores da Web interpretam e exibem o conteúdo de páginas, de acordo com o padrão internacional da W3Schools.\n\n### Estrutura Básica de Uma Página HTML5\nNo HTML5, a declaração do tipo de documento (`<!DOCTYPE html>`) foi extremamente simplificada. Toda página HTML5 válida deve conter a seguinte estrutura básica:\n\n```html\n<!DOCTYPE html>\n<html lang="pt-BR">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Minha Primeira Página HTML5</title>\n</head>\n<body>\n    <h1>Olá, Mundo!</h1>\n    <p>Esta é uma estrutura básica em HTML5.</p>\n</body>\n</html>\n```\n\n### Principais Novidades do HTML5\n- **Design Semântico**: Tags mais claras que indicam ao navegador o significado real do conteúdo.\n- **Mídia Nativa**: Suporte integrado para áudio, vídeo e animação vetorial (com `<canvas>` e SVG), sem a necessidade de instalar players externos.\n- **APIs Modernas**: Armazenamento offline inteligente (LocalStorage), geolocalização e processamento local.',
          duration: '15:00',
          order: 1
        },
        {
          id: 'html5-les-2',
          moduleId: 'html5-mod-1',
          title: 'Elementos Semânticos & SEO',
          videoUrl: 'https://www.youtube.com/embed/T63mSdfS_Hk',
          content: '### O que são Elementos Semânticos?\nUm elemento semântico descreve claramente seu significado para o navegador e para o desenvolvedor.\n- Elementos **não semânticos** (`<div>` e `<span>`): dizem nada sobre seu conteúdo.\n- Elementos **semânticos** (`<form>`, `<table>`, `<article>`): definem claramente o conteúdo.\n\n### Principais Tags Semânticas do HTML5\n- `<header>`: Cabeçalho com identidade visual, logo e links de navegação principal.\n- `<nav>`: Define um conjunto de links de navegação.\n- `<section>`: Define uma seção temática geral em um documento.\n- `<article>`: Define conteúdo independente e autônomo (ex: posts de blog, artigos de notícias).\n- `<aside>`: Define conteúdo lateral marginal de apoio (ex: sidebar, anúncios).\n- `<footer>`: Rodapé da página, direitos autorais, dados de contato.\n\n```html\n<header>\n  <h1>Meu Portal de Notícias</h1>\n  <nav>\n    <a href="#home">Início</a> | <a href="#tecnologia">Tecnologia</a>\n  </nav>\n</header>\n```\n\n### Impacto no SEO\nO uso de tags semânticas permite que os rastreadores do Google entendam com precisão qual é a informação principal do seu site, melhorando expressivamente seu posicionamento orgânico.',
          duration: '22:00',
          order: 2
        },
        {
          id: 'html5-les-3',
          moduleId: 'html5-mod-1',
          title: 'Cabeçalhos, Parágrafos & Formatação',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          content: '### Organização Tipográfica\nA Web é feita para leitura de conteúdo escrito. Estruturar a hierarquia da sua informação de maneira límpida guia os olhos do seu visitante de ponta a ponta.\n\n### Cabeçalhos (`<h1>` a `<h6>`)\nHTML define seis níveis de cabeçalhos. O `<h1>` representa o assunto principal e deve aparecer apenas uma vez por página para manter as boas práticas de usabilidade e indexação. Os cabeçalhos menores (`<h2>`, `<h3>`...) dividem os subtemas subsequentes.\n\n```html\n<h1>Notícias do Dia</h1>\n<h2>Tecnologia e Inovação</h2>\n<h3>Lançamento do HTML5</h3>\n```\n\n### Parágrafos (`<p>`)\nSempre englobe blocos de texto corrido em elementos `<p>`. Evite múltiplos quebras de linha inline com `<br>` quando quiser separar ideias, pois isso é uma responsabilidade de margem (CSS) do layout.\n\n### Formatação Básica\n- `<strong>` ou `<b>`: Usado para dar ênfase visual ou semântica de relevância ao texto.\n- `<em>` ou `<i>`: Destaca termos em itálico para jargões ou títulos de obras.\n- `<mark>`: Destaca trechos do elemento com uma marcação de plano de fundo amarela por padrão.',
          duration: '18:00',
          order: 3
        },
        {
          id: 'html5-les-4',
          moduleId: 'html5-mod-1',
          title: 'Listas Ordenadas & Não Ordenadas',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          content: '### Estruturando Listas no HTML5\nAs listas permitem agrupar itens relacionados de maneira organizada. O HTML5 nos oferece três maneiras de montar essas estruturas.\n\n### Listas Não Ordenadas (`<ul>`)\nUsadas quando a ordem cronológica ou sequencial dos itens não importa. Os itens são representados por marcadores de bolinhas.\n\n```html\n<ul>\n  <li>Aprender HTML5</li>\n  <li>Dominar CSS3</li>\n  <li>Programar JavaScript</li>\n</ul>\n```\n\n### Listas Ordenadas (`<ol>`)\nIdeais para listar tutoriais passo a passo ou receitas, onde a ordem sequencial direta é restrita e essencial.\n\n```html\n<ol>\n  <li>Abra o editor de código</li>\n  <li>Crie um arquivo index.html</li>\n  <li>Escreva o doctype e execute</li>\n</ol>\n```\n\n### Listas de Descrição (`<dl>`)\nCompostas por termos e suas descrições. Perfeitas para glossários, listas de perguntas frequentes (FAQ) ou metadados de especificações.\n\n```html\n<dl>\n  <dt>W3C</dt>\n  <dd>World Wide Web Consortium - Órgão que padroniza a Web.</dd>\n  <dt>HTML5</dt>\n  <dd>Linguagem de marcação de hipertexto de quinta geração.</dd>\n</dl>\n```',
          duration: '12:00',
          order: 4
        },
        {
          id: 'html5-les-5',
          moduleId: 'html5-mod-2',
          title: 'Hiperlinks & Âncoras de Navegação',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          content: '### A alma da Web: Hiperlinks\nA capacidade de conectar arquivos ao redor do planeta através de links é o que define a internet. Sem o hiperlink, a Web não existiria.\n\n### A Tag `<a>` (Anchor)\nPara criar conexões, usamos o elemento `<a>` informando o link absoluto ou relativo no atributo `href` (Hypertext Reference).\n\n```html\n<a href="https://www.w3schools.com" target="_blank" rel="noopener">Acesse o W3Schools</a>\n```\n\n### Atributos Importantes\n- `target="_blank"`: Abre o link em uma nova aba do navegador.\n- `rel="noopener noreferrer"`: Evita vulnerabilidades de segurança e acessibilidade ao carregar links externos secundários.\n\n### Âncoras Internas (Scroll)\nVocê pode enviar os usuários para partes de uma mesma página identificando as seções por um atributo `id` exclusivo.\n\n```html\n<a href="#secao-formulario">Ir para Formulário</a>\n<!-- ... -->\n<div id="secao-formulario">Formulário de Contato</div>\n```',
          duration: '20:00',
          order: 1
        },
        {
          id: 'html5-les-6',
          moduleId: 'html5-mod-2',
          title: 'Imagens, Figuras & Responsividade',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          content: '### Renderizando Mídia Visual Dinâmica\nAs imagens tornam a experiência das nossas páginas muito mais ricas e amigáveis.\n\n### A Tag `<img>` e boas práticas\nSempre defina o atributo `src` e inclua uma descrição alternativa no elemento `alt` para acessibilidade de leitores de tela e robôs SEO.\n\n```html\n<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGG0QaJVkViJZHIhrcVli45Ksmkq6SIBfFN8WnzFMDNQ&s=10" alt="Logotipo do HTML5 padrão W3Schools" width="120" />\n```\n\n### Tag `<picture>` para Responsividade\nComo desenvolvedores frontend modernos, frequentemente precisamos carregar imagens diferentes baseadas nas dimensões da tela do usuário. O elemento `<picture>` faz essa triagem nativamente:\n\n```html\n<picture>\n  <source media="(min-width: 800px)" srcset="imagem-desktop.jpg">\n  <source media="(min-width: 480px)" srcset="imagem-tablet.jpg">\n  <img src="imagem-mobile.jpg" alt="Apresentação responsiva">\n</picture>\n```\n\n### Figuras Semânticas com `<figure>`\nAgrupa uma ilustração associada e sua legenda explícita em um só bloco estrutural:\n\n```html\n<figure>\n  <img src="html5-banner.png" alt="HTML5">\n  <figcaption>Fig.1 - Logo oficial do HTML5 aprovado pela W3C.</figcaption>\n</figure>\n```',
          duration: '25:00',
          order: 2
        },
        {
          id: 'html5-les-7',
          moduleId: 'html5-mod-2',
          title: 'Criação de Tabelas Completas',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          content: '### Exibindo Dados com Tabelas no HTML5\nAs tabelas devem ser usadas estritamente para exibir dados tabulares (estruturados em linhas e colunas) e **nunca** para desenhar o layout de páginas de design.\n\n### Estrutura Semântica Avançada de Tabelas\nAbaixo está a estrutura robusta integrada de uma tabela no HTML5:\n\n```html\n<table>\n  <caption>Tabela 1 - Comparativo de Frameworks</caption>\n  <thead>\n    <tr>\n      <th>Linguagem / Framework</th>\n      <th>Criado em</th>\n      <th>Licença</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>HTML5 Nativo</td>\n      <td>2014</td>\n      <td>W3C Open</td>\n    </tr>\n    <tr>\n      <td>React JS</td>\n      <td>2013</td>\n      <td>MIT License</td>\n    </tr>\n  </tbody>\n  <tfoot>\n    <tr>\n      <td colspan="3">Fonte de dados: W3Schools Oficinal</td>\n    </tr>\n  </tbody>\n</table>\n```\n\n### Atributos Cruciais\n- `colspan`: Permite que uma célula ocupe múltiplas colunas horizontais.\n- `rowspan`: Permite que uma célula ocupe múltiplas linhas de altura verticais.',
          duration: '19:00',
          order: 3
        },
        {
          id: 'html5-les-8',
          moduleId: 'html5-mod-3',
          title: 'Formulários e Input Types',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          content: '### Capturando Dados dos Usuários\nFormulários coletam dados estruturados que enviamos ao nosso servidor. Com o advento do HTML5, ganhamos diversos novos tipos de inputs inteligentes para facilitar a vida nos dispositivos mobile.\n\n### Elementos de Formulários\n- `<form>`: Declara a área receptora e o método HTTP (GET/POST).\n- `<label>`: Rótulo de texto associado a um input via atributo `for` e `id`.\n- `<textarea>`: Caixa de texto de múltiplas linhas para parágrafos mais longos.\n- `<select>` e `<option>`: Menus suspensos drop-down.\n\n```html\n<form action="/login" method="POST">\n  <label for="user-email">Endereço de E-mail</label>\n  <input type="email" id="user-email" required>\n  <button type="submit">Enviar</button>\n</form>\n```\n\n### Novos Tipos de Cor, Data e Telefone\nAo invés de programar componentes complexos em Javascript, você pode usar os novos tipos nativos do HTML5:\n- `type="color"`: Selecionador de paleta de cores hexadecimal.\n- `type="date"`: Calendário nativo do dispositivo do usuário.\n- `type="range"`: Controle deslizante (slider).\n- `type="number"`: Caixa numérica otimizada.',
          duration: '28:00',
          order: 1
        },
        {
          id: 'html5-les-9',
          moduleId: 'html5-mod-3',
          title: 'Atributos Globais & Validações',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          content: '### Validação Nativa de Dados no HTML5\nAntigamente, precisávamos de dezenas de linhas em JavaScript para validar se um campo de e-mail continha uma arroba, ou se um campo numérico estava dentro de limites aceitáveis. O HTML5 resolve isso nativamente.\n\n### Atributos de Validação Declarativa\n- `required`: Torna o preenchimento do campo obrigatório antes do envio.\n- `placeholder`: Escreve uma dica visual temporária dentro do campo.\n- `pattern`: Aceita expressões regulares (regex) para conferir formatos complexos.\n- `min` e `max`: Configura os limites numéricos aceitos.\n- `step`: Controla o intervalo de acréscimo de valores numéricos.\n\n```html\n<input type="number" name="idade" min="18" max="120" required>\n<input type="text" name="codigo" pattern="[A-Z]{3}-[0-9]{4}" placeholder="ABC-1234">\n```\n\n### Atributos Globais Essenciais\nAlguns atributos podem ser aplicados em **qualquer** tag HTML5 de sua escolha:\n- `class` e `id`: Seletores CSS e de script.\n- `contenteditable`: Transforma qualquer parágrafo ou título da tela em algo editável pelo próprio usuário clicando diretamente!\n- `draggable`: Permite acionar eventos de arrastar e soltar (drag and drop) de forma nativa.',
          duration: '21:00',
          order: 2
        },
        {
          id: 'html5-les-10',
          moduleId: 'html5-mod-3',
          title: 'Elementos de Mídia Nativos (Vídeo e Áudio)',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          content: '### A revolução das Mídias Ricas no HTML5\nAté o lançamento do HTML5 em 2014, assistir a vídeos ou escutar gravações na Web exigia plugins pesados e inseguros de terceiros (como QuickTime, Silverlight ou Flash). Atualmente, tudo isso é resolvido com tags nativas de alto desempenho.\n\n### A Tag `<video>`\nInsira transmissão nativas completas com controle de reprodução nativo do navegador.\n\n```html\n<video width="640" height="360" controls poster="capa.jpg">\n  <source src="aula.mp4" type="video/mp4">\n  <source src="aula.webm" type="video/webm">\n  Seu navegador não oferece suporte para reprodução de vídeo nativo.\n</video>\n```\n\n### A Tag `<audio>`\nIdeal para streamings de som, músicas ou podcasts.\n\n```html\n<audio controls autoplay loop>\n  <source src="aula.mp3" type="audio/mpeg">\n  Seu navegador não oferece suporte para áudio nativo HTML5.\n</audio>\n```\n\n### Atributos Atalhos de Mídia\n- `controls`: Mostra a barra nativa com play, pause, controle de volume e tela cheia.\n- `autoplay`: Inicia a reprodução automaticamente (muitos navegadores exigem que o áudio esteja mudo para aceitar).\n- `poster`: Exibe uma imagem como capa protetora antes de clicar em play.',
          duration: '16:00',
          order: 3
        },
        {
          id: 'html5-les-11',
          moduleId: 'html5-mod-4',
          title: 'Gráficos com SVG e Canvas',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          content: '### Criação Gráfica Direto nas Telas\nO HTML5 introduziu duas formas robustas para designers e desenvolvedores criarem e manipularem desenhos diretamente na renderização web.\n\n### SVG (Scalable Vector Graphics)\n- Desenhos baseados em vetores matemáticos informados por codificação XML.\n- Não perdem qualidade técnica quando aumentados de tamanho (resolução impecável).\n- Estilizáveis via classes CSS normais e interativos por JavaScript.\n\n```html\n<svg width="100" height="100">\n  <circle cx="50" cy="50" r="40" stroke="green" stroke-width="4" fill="yellow" />\n</svg>\n```\n\n### Canvas do HTML5\n- Uma área limpa de renderização baseada em pixels de bitmap de tela.\n- Desenhada em tempo de execução dinamicamente utilizando comandos diretos de JavaScript.\n- Altamente performática para desenvolvimento de jogos Web 2D/3D ou dashboards interativos pesados.\n\n```html\n<canvas id="meuCanvas" width="200" height="100" style="border:1px solid #000000;"></canvas>\n<script>\n  const c = document.getElementById("meuCanvas");\n  const ctx = c.getContext("2d");\n  ctx.fillStyle = "#FF0000";\n  ctx.fillRect(0, 0, 150, 75);\n</script>\n```',
          duration: '23:00',
          order: 1
        },
        {
          id: 'html5-les-12',
          moduleId: 'html5-mod-4',
          title: 'Web APIs Modernas (Geolocalização & Storages)',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          content: '### Integração nativa com Recursos do Dispositivo\nHTML5 é muito mais do que apenas tags estruturais; é um ambiente robusto integrado de APIs de JavaScript que estendem o poder do aplicativo web de forma surpreendente.\n\n### API de Geolocalização\nPermite consultar a latitude e longitude física exata do visitante do seu site ou aplicativo (sempre sob livre confirmação de permissão de segurança do usuário).\n\n```javascript\nnavigator.geolocation.getCurrentPosition((position) => {\n  console.log("Latitude:", position.coords.latitude);\n  console.log("Longitude:", position.coords.longitude);\n});\n```\n\n### Web Storages: LocalStorage & SessionStorage\nChega de depender de cookies HTTP pesados e redundantes! O HTML5 permite guardar até 5MB a 10MB de dados de forma duradoura no navegador:\n- **LocalStorage**: Salva dados persistentemente por tempo indefinido, sobrevivendo ao encerramento de abas ou recarregamento total.\n- **SessionStorage**: Mantém os dados temporariamente apenas enquanto a respectiva aba permanecer aberta.\n\n```javascript\n// Salvar item\nlocalStorage.setItem("username", "Johnatan Quenes");\n// Recuperar item\nconst nome = localStorage.getItem("username");\n```',
          duration: '31:00',
          order: 2
        }
      ],
      userProgress: [],
      orders: [],
      posts: [
        { id: '1', userId: 2, userName: 'The Architect', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Architect', content: 'Bem-vindos à MasterCode. O código é a única verdade.', likes: 42, comments: 2, timestamp: new Date().toISOString(), tags: ['welcome', 'matrix'] }
      ],
      certificates: []
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } else {
    data = JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
  }
  if (data && data.courses) {
    const mainCourse = data.courses.find((c: any) => c.id === 'matrix-mastery');
    if (mainCourse) {
      mainCourse.title = "Curso de HTML5";
      mainCourse.description = "HTML5 é o padrão universal para estruturação e apresentação de conteúdo na Web. Domine o desenvolvimento de páginas robustas com elementos semânticos, de acordo com o W3Schools.";
      mainCourse.image = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGG0QaJVkViJZHIhrcVli45Ksmkq6SIBfFN8WnzFMDNQ&s=10";
      mainCourse.totalLessons = 12;
      mainCourse.duration = "20h";
    }

    const cssCourseIndex = data.courses.findIndex((c: any) => c.id === 'css-mastery' || c.id === 'stark-protocols');
    const cssCourse = {
      id: 'css-mastery',
      title: "Curso de CSS3",
      description: "CSS3 define toda a estética de estilo, posicionamento comercial, layouts dinâmicos Flexbox/Grid e animações de interface web de acordo com a documentação W3Schools.",
      category: 'Frontend',
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7J6l5SdqgHW3ZS8t1rBuzUmMtAFJrNJJIAwKo-Bhe3w&s=10",
      totalLessons: 10,
      duration: "15h"
    };
    if (cssCourseIndex !== -1) {
      data.courses[cssCourseIndex] = cssCourse;
    } else {
      data.courses.push(cssCourse);
    }

    const jsCourseIndex = data.courses.findIndex((c: any) => c.id === 'js-mastery' || c.id === 'oracle-wisdom');
    const jsCourse = {
      id: 'js-mastery',
      title: "Curso de JavaScript",
      description: "O JavaScript é a linguagem mais utilizada do mundo. Domine variáveis, funções, objetos, DOM, APIs, Async/Await e manipulações assíncronas de acordo com a documentação W3Schools.",
      category: 'Frontend',
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQc_dfw8pbzQGsEeuiWw3Zm1RgIAsGvnePn46bKV25Rqw&s=10",
      totalLessons: 10,
      duration: "12h"
    };
    if (jsCourseIndex !== -1) {
      data.courses[jsCourseIndex] = jsCourse;
    } else {
      data.courses.push(jsCourse);
    }

    // Filter to ensure only our three core courses are active
    data.courses = data.courses.filter((c: any) => c.id === 'matrix-mastery' || c.id === 'css-mastery' || c.id === 'js-mastery');

    // Also overwrite modules/lessons to preserve consistency in case db.json exists
    data.modules = [
      { id: 'html5-mod-1', courseId: 'matrix-mastery', title: 'Módulo 1: Fundamentos & Estrutura Semântica', order: 1 },
      { id: 'html5-mod-2', courseId: 'matrix-mastery', title: 'Módulo 2: Conteúdo, Links & Tabelas', order: 2 },
      { id: 'html5-mod-3', courseId: 'matrix-mastery', title: 'Módulo 3: Formulários & Interatividade', order: 3 },
      { id: 'html5-mod-4', courseId: 'matrix-mastery', title: 'Módulo 4: Elementos de Mídia & APIs Modernas', order: 4 },
      { id: 'css-mod-1', courseId: 'css-mastery', title: 'Módulo 1: Sintaxe, Seletores e Cores', order: 1 },
      { id: 'css-mod-2', courseId: 'css-mastery', title: 'Módulo 2: O Box Model e Tipografia', order: 2 },
      { id: 'css-mod-3', courseId: 'css-mastery', title: 'Módulo 3: Flexbox, Grid & Responsividade', order: 3 },
      { id: 'css-mod-4', courseId: 'css-mastery', title: 'Módulo 4: Efeitos, Transições & Animações', order: 4 },
      { id: 'js-mod-1', courseId: 'js-mastery', title: 'Módulo 1: Conceitos Iniciais & Variáveis', order: 1 },
      { id: 'js-mod-2', courseId: 'js-mastery', title: 'Módulo 2: Estruturas de Controle & Funções', order: 2 },
      { id: 'js-mod-3', courseId: 'js-mastery', title: 'Módulo 3: Orientação a Objetos & DOM', order: 3 },
      { id: 'js-mod-4', courseId: 'js-mastery', title: 'Módulo 4: Async/Await & APIs com Fetch', order: 4 },
      ...(data.modules || []).filter((m: any) => m.courseId !== 'matrix-mastery' && m.courseId !== 'css-mastery' && m.courseId !== 'js-mastery' && m.courseId !== 'stark-protocols' && m.courseId !== 'oracle-wisdom')
    ];

    // Create complete W3Schools based lessons list
    const html5Lessons = [
      {
        id: 'html5-les-1',
        moduleId: 'html5-mod-1',
        title: 'HTML5 Introdução & Sintaxe',
        videoUrl: 'https://www.youtube.com/embed/gTMas0oiaEU',
        content: '### O que é o HTML5?\nHTML5 é a versão mais recente do padrão HTML (HyperText Markup Language), o bloco de construção básico da World Wide Web. Ele define como os navegadores da Web interpretam e exibem o conteúdo de páginas, de acordo com o padrão internacional da W3Schools.\n\n### Estrutura Básica de Uma Página HTML5\nNo HTML5, a declaração do tipo de documento (`<!DOCTYPE html>`) foi extremamente simplificada. Toda página HTML5 válida deve conter a seguinte estrutura básica:\n\n```html\n<!DOCTYPE html>\n<html lang="pt-BR">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Minha Primeira Página HTML5</title>\n</head>\n<body>\n    <h1>Olá, Mundo!</h1>\n    <p>Esta é uma estrutura básica em HTML5.</p>\n</body>\n</html>\n```\n\n### Principais Novidades do HTML5\n- **Design Semântico**: Tags mais claras que indicam ao navegador o significado real do conteúdo.\n- **Mídia Nativa**: Suporte integrado para áudio, vídeo e animação vetorial (com `<canvas>` e SVG), sem a necessidade de instalar players externos.\n- **APIs Modernas**: Armazenamento offline inteligente (LocalStorage), geolocalização e processamento local.',
        duration: '15:00',
        order: 1
      },
      {
        id: 'html5-les-2',
        moduleId: 'html5-mod-1',
        title: 'Elementos Semânticos & SEO',
        videoUrl: 'https://www.youtube.com/embed/T63mSdfS_Hk',
        content: '### O que são Elementos Semânticos?\nUm elemento semântico descreve claramente seu significado para o navegador e para o desenvolvedor.\n- Elementos **não semânticos** (`<div>` e `<span>`): dizem nada sobre seu conteúdo.\n- Elementos **semânticos** (`<form>`, `<table>`, `<article>`): definem claramente o conteúdo.\n\n### Principais Tags Semânticas do HTML5\n- `<header>`: Cabeçalho com identidade visual, logo e links de navegação principal.\n- `<nav>`: Define um conjunto de links de navegação.\n- `<section>`: Define uma seção temática geral em um documento.\n- `<article>`: Define conteúdo independente e autônomo (ex: posts de blog, artigos de notícias).\n- `<aside>`: Define conteúdo lateral marginal de apoio (ex: sidebar, anúncios).\n- `<footer>`: Rodapé da página, direitos autorais, dados de contato.\n\n```html\n<header>\n  <h1>Meu Portal de Notícias</h1>\n  <nav>\n    <a href="#home">Início</a> | <a href="#tecnologia">Tecnologia</a>\n  </nav>\n</header>\n```\n\n### Impacto no SEO\nO uso de tags semânticas permite que os rastreadores do Google entendam com precisão qual é a informação principal do seu site, melhorando expressivamente seu posicionamento orgânico.',
        duration: '22:00',
        order: 2
      },
      {
        id: 'html5-les-3',
        moduleId: 'html5-mod-1',
        title: 'Cabeçalhos, Parágrafos & Formatação',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        content: '### Organização Tipográfica\nA Web é feita para leitura de conteúdo escrito. Estruturar a hierarquia da sua informação de maneira límpida guia os olhos do seu visitante de ponta a ponta.\n\n### Cabeçalhos (`<h1>` a `<h6>`)\nHTML define seis níveis de cabeçalhos. O `<h1>` representa o assunto principal e deve aparecer apenas uma vez por página para manter as boas práticas de usabilidade e indexação. Os cabeçalhos menores (`<h2>`, `<h3>`...) dividem os subtemas subsequentes.\n\n```html\n<h1>Notícias do Dia</h1>\n<h2>Tecnologia e Inovação</h2>\n<h3>Lançamento do HTML5</h3>\n```\n\n### Parágrafos (`<p>`)\nSempre englobe blocos de texto corrido em elementos `<p>`. Evite múltiplos quebras de linha inline com `<br>` quando quiser separar ideias, pois isso é uma responsabilidade de margem (CSS) do layout.\n\n### Formatação Básica\n- `<strong>` ou `<b>`: Usado para dar ênfase visual ou semântica de relevância ao texto.\n- `<em>` ou `<i>`: Destaca termos em itálico para jargões ou títulos de obras.\n- `<mark>`: Destaca trechos do elemento com uma marcação de plano de fundo amarela por padrão.',
        duration: '18:00',
        order: 3
      },
      {
        id: 'html5-les-4',
        moduleId: 'html5-mod-1',
        title: 'Listas Ordenadas & Não Ordenadas',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        content: '### Estruturando Listas no HTML5\nAs listas permitem agrupar itens relacionados de maneira organizada. O HTML5 nos oferece três maneiras de montar essas estruturas.\n\n### Listas Não Ordenadas (`<ul>`)\nUsadas quando a ordem cronológica ou sequencial dos itens não importa. Os itens são representados por marcadores de bolinhas.\n\n```html\n<ul>\n  <li>Aprender HTML5</li>\n  <li>Dominar CSS3</li>\n  <li>Programar JavaScript</li>\n</ul>\n```\n\n### Listas Ordenadas (`<ol>`)\nIdeais para listar tutoriais passo a passo ou receitas, onde a ordem sequencial direta é restrita e essencial.\n\n```html\n<ol>\n  <li>Abra o editor de código</li>\n  <li>Crie um arquivo index.html</li>\n  <li>Escreva o doctype e execute</li>\n</ol>\n```\n\n### Listas de Descrição (`<dl>`)\nCompostas por termos e suas descrições. Perfeitas para glossários, listas de perguntas frequentes (FAQ) ou metadados de especificações.\n\n```html\n<dl>\n  <dt>W3C</dt>\n  <dd>World Wide Web Consortium - Órgão que padroniza a Web.</dd>\n  <dt>HTML5</dt>\n  <dd>Linguagem de marcação de hipertexto de quinta geração.</dd>\n</dl>\n```',
        duration: '12:00',
        order: 4
      },
      {
        id: 'html5-les-5',
        moduleId: 'html5-mod-2',
        title: 'Hiperlinks & Âncoras de Navegação',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        content: '### A alma da Web: Hiperlinks\nA capacidade de conectar arquivos ao redor do planeta através de links é o que define a internet. Sem o hiperlink, a Web não existiria.\n\n### A Tag `<a>` (Anchor)\nPara criar conexões, usamos o elemento `<a>` informando o link absoluto ou relativo no atributo `href` (Hypertext Reference).\n\n```html\n<a href="https://www.w3schools.com" target="_blank" rel="noopener">Acesse o W3Schools</a>\n```\n\n### Atributos Importantes\n- `target="_blank"`: Abre o link em uma nova aba do navegador.\n- `rel="noopener noreferrer"`: Evita vulnerabilidades de segurança e acessibilidade ao carregar links externos secundários.\n\n### Âncoras Internas (Scroll)\nVocê pode enviar os usuários para partes de uma mesma página identificando as seções por um atributo `id` exclusivo.\n\n```html\n<a href="#secao-formulario">Ir para Formulário</a>\n<!-- ... -->\n<div id="secao-formulario">Formulário de Contato</div>\n```',
        duration: '20:00',
        order: 1
      },
      {
        id: 'html5-les-6',
        moduleId: 'html5-mod-2',
        title: 'Imagens, Figuras & Responsividade',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        content: '### Renderizando Mídia Visual Dinâmica\nAs imagens tornam a experiência das nossas páginas muito mais ricas e amigáveis.\n\n### A Tag `<img>` e boas práticas\nSempre defina o atributo `src` e inclua uma descrição alternativa no elemento `alt` para acessibilidade de leitores de tela e robôs SEO.\n\n```html\n<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGG0QaJVkViJZHIhrcVli45Ksmkq6SIBfFN8WnzFMDNQ&s=10" alt="Logotipo do HTML5 padrão W3Schools" width="120" />\n```\n\n### Tag `<picture>` para Responsividade\nComo desenvolvedores frontend modernos, frequentemente precisamos carregar imagens diferentes baseadas nas dimensões da tela do usuário. O elemento `<picture>` faz essa triagem nativamente:\n\n```html\n<picture>\n  <source media="(min-width: 800px)" srcset="imagem-desktop.jpg">\n  <source media="(min-width: 480px)" srcset="imagem-tablet.jpg">\n  <img src="imagem-mobile.jpg" alt="Apresentação responsiva">\n</picture>\n```\n\n### Figuras Semânticas com `<figure>`\nAgrupa uma ilustração associada e sua legenda explícita em um só bloco estrutural:\n\n```html\n<figure>\n  <img src="html5-banner.png" alt="HTML5">\n  <figcaption>Fig.1 - Logo oficial do HTML5 aprovado pela W3C.</figcaption>\n</figure>\n```',
        duration: '25:00',
        order: 2
      },
      {
        id: 'html5-les-7',
        moduleId: 'html5-mod-2',
        title: 'Criação de Tabelas Completas',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        content: '### Exibindo Dados com Tabelas no HTML5\nAs tabelas devem ser usadas estritamente para exibir dados tabulares (estruturados em linhas e colunas) e **nunca** para desenhar o layout de páginas de design.\n\n### Estrutura Semântica Avançada de Tabelas\nAbaixo está a estrutura robusta integrada de uma tabela no HTML5:\n\n```html\n<table>\n  <caption>Tabela 1 - Comparativo de Frameworks</caption>\n  <thead>\n    <tr>\n      <th>Linguagem / Framework</th>\n      <th>Criado em</th>\n      <th>Licença</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>HTML5 Nativo</td>\n      <td>2014</td>\n      <td>W3C Open</td>\n    </tr>\n    <tr>\n      <td>React JS</td>\n      <td>2013</td>\n      <td>MIT License</td>\n    </tr>\n  </tbody>\n  <tfoot>\n    <tr>\n      <td colspan="3">Fonte de dados: W3Schools Oficial</td>\n    </tr>\n  </tbody>\n</table>\n```\n\n### Atributos Cruciais\n- `colspan`: Permite que uma célula ocupe múltiplas colunas horizontais.\n- `rowspan`: Permite que uma célula ocupe múltiplas linhas de altura verticais.',
        duration: '19:00',
        order: 3
      },
      {
        id: 'html5-les-8',
        moduleId: 'html5-mod-3',
        title: 'Formulários e Input Types',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        content: '### Capturando Dados dos Usuários\nFormulários coletam dados estruturados que enviamos ao nosso servidor. Com o advento do HTML5, ganhamos diversos novos tipos de inputs inteligentes para facilitar a vida nos dispositivos mobile.\n\n### Elementos de Formulários\n- `<form>`: Declara a área receptora e o método HTTP (GET/POST).\n- `<label>`: Rótulo de texto associado a um input via atributo `for` e `id`.\n- `<textarea>`: Caixa de texto de múltiplas linhas para parágrafos mais longos.\n- `<select>` e `<option>`: Menus suspensos drop-down.\n\n```html\n<form action="/login" method="POST">\n  <label for="user-email">Endereço de E-mail</label>\n  <input type="email" id="user-email" required>\n  <button type="submit">Enviar</button>\n</form>\n```\n\n### Novos Tipos de Cor, Data e Telefone\nAo invés de programar componentes complexos em Javascript, você pode usar os novos tipos nativos do HTML5:\n- `type="color"`: Selecionador de paleta de cores hexadecimal.\n- `type="date"`: Calendário nativo do dispositivo do usuário.\n- `type="range"`: Controle deslizante (slider).\n- `type="number"`: Caixa numérica otimizada.',
        duration: '28:00',
        order: 1
      },
      {
        id: 'html5-les-9',
        moduleId: 'html5-mod-3',
        title: 'Atributos Globais & Validações',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        content: '### Validação Nativa de Dados no HTML5\nAntigamente, precisávamos de dezenas de linhas em JavaScript para validar se um campo de e-mail continha uma arroba, ou se um campo numérico estava dentro de limites aceitáveis. O HTML5 resolve isso nativamente.\n\n### Atributos de Validação Declarativa\n- `required`: Torna o preenchimento do campo obrigatório antes do envio.\n- `placeholder`: Escreve uma dica visual temporária dentro do campo.\n- `pattern`: Aceita expressões regulares (regex) para conferir formatos complexos.\n- `min` e `max`: Configura os limites numéricos aceitos.\n- `step`: Controla o intervalo de acréscimo de valores numéricos.\n\n```html\n<input type="number" name="idade" min="18" max="120" required>\n<input type="text" name="codigo" pattern="[A-Z]{3}-[0-9]{4}" placeholder="ABC-1234">\n```\n\n### Atributos Globais Essenciais\nAlguns atributos podem ser aplicados em **qualquer** tag HTML5 de sua escolha:\n- `class` e `id`: Seletores CSS e de script.\n- `contenteditable`: Transforma qualquer parágrafo ou título da tela em algo editável pelo próprio usuário clicando diretamente!\n- `draggable`: Permite acionar eventos de arrastar e soltar (drag and drop) de forma nativa.',
        duration: '21:00',
        order: 2
      },
      {
        id: 'html5-les-10',
        moduleId: 'html5-mod-3',
        title: 'Elementos de Mídia Nativos (Vídeo e Áudio)',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        content: '### A revolução das Mídias Ricas no HTML5\nAté o lançamento do HTML5 em 2014, assistir a vídeos ou escutar gravações na Web exigia plugins pesados e inseguros de terceiros (como QuickTime, Silverlight ou Flash). Atualmente, tudo isso é resolvido com tags nativas de alto desempenho.\n\n### A Tag `<video>`\nInsira transmissão nativas completas com controle de reprodução nativo do navegador.\n\n```html\n<video width="640" height="360" controls poster="capa.jpg">\n  <source src="aula.mp4" type="video/mp4">\n  <source src="aula.webm" type="video/webm">\n  Seu navegador não oferece suporte para reprodução de vídeo nativo.\n</video>\n```\n\n### A Tag `<audio>`\nIdeal para streamings de som, músicas ou podcasts.\n\n```html\n<audio controls autoplay loop>\n  <source src="aula.mp3" type="audio/mpeg">\n  Seu navegador não oferece suporte para áudio nativo HTML5.\n</audio>\n```\n\n### Atributos Chaves de Mídia\n- `controls`: Mostra a barra nativa com play, pause, controle de volume e tela cheia.\n- `autoplay`: Inicia a reprodução automaticamente (muitos navegadores exigem que o áudio esteja mudo para aceitar).\n- `poster`: Exibe uma imagem como capa protetora antes de clicar em play.',
        duration: '16:00',
        order: 3
      },
      {
        id: 'html5-les-11',
        moduleId: 'html5-mod-4',
        title: 'Gráficos com SVG e Canvas',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        content: '### Criação Gráfica Direto nas Telas\nO HTML5 introduziu duas formas robustas para designers e desenvolvedores criarem e manipularem desenhos diretamente na renderização web.\n\n### SVG (Scalable Vector Graphics)\n- Desenhos baseados em vetores matemáticos informados por codificação XML.\n- Não perdem qualidade técnica quando aumentados de tamanho (resolução impecável).\n- Estilizáveis via classes CSS normais e interativos por JavaScript.\n\n```html\n<svg width="100" height="100">\n  <circle cx="50" cy="50" r="40" stroke="green" stroke-width="4" fill="yellow" />\n</svg>\n```\n\n### Canvas do HTML5\n- Uma área limpa de renderização baseada em pixels de bitmap de tela.\n- Desenhada em tempo de execução dinamicamente utilizando comandos diretos de JavaScript.\n- Altamente performática para desenvolvimento de jogos Web 2D/3D ou dashboards interativos pesados.\n\n```html\n<canvas id="meuCanvas" width="200" height="100" style="border:1px solid #000000;"></canvas>\n<script>\n  const c = document.getElementById("meuCanvas");\n  const ctx = c.getContext("2d");\n  ctx.fillStyle = "#FF0000";\n  ctx.fillRect(0, 0, 150, 75);\n</script>\n```',
        duration: '23:00',
        order: 1
      },
      {
        id: 'html5-les-12',
        moduleId: 'html5-mod-4',
        title: 'Web APIs Modernas (Geolocalização & Storages)',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        content: '### Integração nativa com Recursos do Dispositivo\nHTML5 é muito mais do que apenas tags estruturais; é um ambiente robusto integrado de APIs de JavaScript que estendem o poder do aplicativo web de forma surpreendente.\n\n### API de Geolocalização\nPermite consultar a latitude e longitude física exata do visitante do seu site ou aplicativo (sempre sob livre confirmação de permissão de segurança do usuário).\n\n```javascript\nnavigator.geolocation.getCurrentPosition((position) => {\n  console.log("Latitude:", position.coords.latitude);\n  console.log("Longitude:", position.coords.longitude);\n});\n```\n\n### Web Storages: LocalStorage & SessionStorage\nChega de depender de cookies HTTP pesados e redundantes! O HTML5 permite guardar até 5MB a 10MB de dados de forma duradoura no navegador:\n- **LocalStorage**: Salva dados persistentemente por tempo indefinido, sobrevivendo ao encerramento de abas ou recarregamento total.\n- **SessionStorage**: Mantém os dados temporariamente apenas enquanto a respectiva aba permanecer aberta.\n\n```javascript\n// Salvar item\nlocalStorage.setItem("username", "Johnatan Quenes");\n// Recuperar item\nconst nome = localStorage.getItem("username");\n```',
        duration: '31:00',
        order: 2
      }
    ];

    const cssLessons = [
      {
        id: 'css-les-1',
        moduleId: 'css-mod-1',
        title: 'Introdução, Sintaxe & Como Inserir CSS',
        videoUrl: 'https://www.youtube.com/embed/w7ejDZ8dBh8',
        content: '### O que é CSS?\nCSS (Cascading Style Sheets) é o padrão de estilo oficial da Web utilizado para ditar a apresentação visual (esquema de cores, fontes, layouts) de um documento HTML.\n\n### Como Inserir o CSS em uma Página\nExistem três maneiras fundamentais recomendadas pela W3Schools para anexar regras de folha de estilo aos seus elementos HTML:\n\n1. **CSS Externo (Altamente Recomendado)**:\nDefine todos os seus estilos em um arquivo `.css` autônomo e o importa dentro da tag `<head>` via elemento `<link>`:\n```html\n<head>\n  <link rel="stylesheet" href="styles.css">\n</head>\n```\n\n2. **CSS Interno**:\nIdeal para estilizar regras exclusivas a um só arquivo individual de forma contida. Declarado dentro da tag `<style>` no cabeçalho do documento:\n```html\n<style>\n  body {\n    background-color: #0f172a;\n    color: #f8fafc;\n  }\n</style>\n```\n\n3. **CSS Inline**:\nInjetado diretamente dentro do atributo style de um determinado elemento singular. Deve ser usado com parcimônia, pois mistura design e conteúdo e reduz a reusabilidade:\n```html\n<h1 style="color: dodgerblue; text-align: center;">Olá, CSS!</h1>\n```\n\n### Sintaxe Básica do CSS\numa regra CSS é composta por um **Seletor** (o alvo que você quer estilizar) e um **Bloco de Declarações** contendo propriedade(s) e valor(es):\n```css\n/* Seletor { Propriedade: Valor; } */\np {\n  color: #10b981;\n  font-size: 16px;\n\n}\n```',
        duration: '14:00',
        order: 1
      },
      {
        id: 'css-les-2',
        moduleId: 'css-mod-1',
        title: 'Seletores CSS Completos & Pseudo-classes',
        videoUrl: 'https://www.youtube.com/embed/w7ejDZ8dBh8',
        content: '### Encontrando alvos com Seletores CSS\nCom o CSS, você pode focar em elementos por nome, classe, ID, atributos, estados ou relações hierárquicas.\n\n### 1. Seletores Básicos\n- **Seletor de Elemento**: Aplica o estilo a todas as tags correspondentes.\n  ```css\n  h2 { color: #f43f5e; }\n  ```\n- **Seletor de Classe (`.`)**: Aplica-se a qualquer elemento que declare a classe no atributo HTML. Altamente reusável.\n  ```css\n  .destaque { font-weight: bold; }\n  ```\n- **Seletor de ID (`#`)**: Aplica-se a um elemento estritamente exclusivo. Possui alta especificidade.\n  ```css\n  #cabecalho-principal { font-size: 32px; }\n  ```\n\n### 2. Seletores Combinados e Hierárquicos\n- **Seletor Descendente (espaco)**: Seleciona todos os filhos `p` que estejam aninhados sob uma `div`.\n  ```css\n  div p { color: #94a3b8; }\n  ```\n- **Seletor de Filho Direto (`>`)**: Foca estritamente nos filhos de primeiro nível.\n  ```css\n  article > p { line-height: 1.6; }\n  ```\n\n### 3. Pseudo-classes\nPseudo-classes definem estados especiais e interações de elementos:\n- `:hover`: Estiliza o elemento quando o cursor do mouse passa sobre ele.\n- `:focus`: Ativado quando o elemento está selecionado (como inputs do teclado).\n- `:nth-child(n)`: Aplica o estilo baseado na ordem sequencial dos irmãos (excelente para zebrar tabelas!).\n\n```css\nbutton:hover {\n  background-color: #059669;\n  transform: translateY(-2px);\n}\nli:nth-child(even) {\n  background-color: #f8fafc;\n}\n```',
        duration: '22:00',
        order: 2
      },
      {
        id: 'css-les-3',
        moduleId: 'css-mod-1',
        title: 'Cores, Gradientes, Fundos & Bordas',
        videoUrl: 'https://www.youtube.com/embed/w7ejDZ8dBh8',
        content: '### Estilização Estética: Cores e Fundos\n\n### 1. Formas de Definir Cores no CSS\nCSS suporta cores usando:\n- **Nomes de Cores**: `red`, `tomato`, `dodgerblue`...\n- **Valores Hexadecimais**: `#00FF41` ou `#3b82f6`\n- **Valores RGB/RGBA**: Composto de componentes Vermelho, Verde e Azul. O `A` controla o canal Alpha de opacidade (0 a 1).\n  ```css\n  p { color: rgba(59, 130, 246, 0.85); }\n  ```\n\n### 2. Gradientes de Cor CSS (Gradients)\nGradientes exibem transições suaves entre duas ou mais cores.\n- **Linear Gradient**:\n  ```css\n  .banner-linear {\n    background: linear-gradient(to right, #0d1117, #161b22);\n  }\n  ```\n- **Radial Gradient**: transições em círculos concêntricos centrados.\n\n### 3. Estilizando Bordas Avançadas\nUma borda precisa de espessura, estilo (solid, dashed, dotted) e cor. Além disso, use `border-radius` para suavizar cantos tornando-os arredondados:\n```css\n.card-estilizado {\n  border: 1px solid #334155;\n  border-radius: 12px;\n  background-color: #0f172a;\n}\n.foto-circular {\n  border-radius: 50%; /* Torna imagens quadradas perfeitamente redondas */\n}\n```',
        duration: '18:00',
        order: 3
      },
      {
        id: 'css-les-4',
        moduleId: 'css-mod-2',
        title: 'O Modelo de Caixa do CSS (Box Model)',
        videoUrl: 'https://www.youtube.com/embed/w7ejDZ8dBh8',
        content: '### Entendendo a anatomia de cada página: O Box Model\nNo CSS, cada componente visual é tratado essencialmente como uma caixa retangular tridimensional. Compreender como essa caixa é empilhada é a lição mais crucial de todo desenvolvedor web frontend.\n\n![W3Schools CSS Box Model](https://www.w3schools.com/css/boxmodel.gif)\n\n### Componentes do Box Model\n1. **Content (Conteúdo)**: Onde o texto principal, parágrafos ou imagens da caixa estão renderizados.\n2. **Padding (Espaçamento Interno)**: A área limpa de folga ao redor do conteúdo, dentro dos limites da borda. Ele herda a cor do fundo da caixa.\n3. **Border (Borda)**: O contorno protetor que envolve o espaçamento interno e o conteúdo.\n4. **Margin (Margem)**: O espaçamento externo fora da borda. É transparente e serve para afastar e organizar a distância entre os elementos vizinhos.\n\n### O Problema do Tamanho Real e `box-sizing: border-box`\nPor padrão, se você der uma largura de 300px a um elemento, e adicionar padding de 20px e borda de 5px das laterais, a largura final dele na tela na verdade se torna 350px (`300 + 20*2 + 5*2`). Isso frequentemente corrompe os grids de layout!\n\nPara remediar isso de forma definitiva em seus projetos, configure todos os elementos para usar o modelo de dimensionamento intuitivo:\n```css\n* {\n  box-sizing: border-box; /* Inclui padding e borda no cálculo final das dimensões de width/height */\n  margin: 0;\n  padding: 0;\n}\n```',
        duration: '25:00',
        order: 1
      },
      {
        id: 'css-les-5',
        moduleId: 'css-mod-2',
        title: 'Propriedades de Texto & Tipografia Moderna',
        videoUrl: 'https://www.youtube.com/embed/w7ejDZ8dBh8',
        content: '### Estilizando Textos e Fontes com Precisão\nSua tipografia determina a legibilidade de todo o conteúdo para as mentes humanas. O CSS nos permite formatar de forma limpa cada detalhe das palavras.\n\n### 1. Propriedades de Fontes (Font Properties)\n- `font-family`: Define a família tipográfica. Defina sempre alternativas fallback (como `sans-serif` ou `serif`).\n- `font-size`: Dimensiona o tamanho dos caracteres. Prefira unidades relativas como `rem` ou `em` em substituição a pixels (`px`) fixos para melhorar a acessibilidade de zoom e telas.\n- `font-weight`: Altera o peso da escrita (`normal`, `medium`, `bold` ou valores numéricos como `400`, `700`).\n\n```css\nbody {\n  font-family: \'Inter\', system-ui, sans-serif;\n  font-size: 1rem; /* 16px da base padrão do navegador */\n  font-weight: 400;\n}\n```\n\n### 2. Formatação de Alinhamento e Espaço\n- `text-align`: Alinha o documento nas horizontais (`left`, `center`, `right`, `justify`).\n- `line-height`: Controla a altura da linha de texto (essencial para evitar que as linhas fiquem coladas verticalmente!).\n- `letter-spacing`: Controla o espaçamento de rastreamento entre as letras individuais.\n\n```css\nh1 {\n  font-family: "Space Grotesk", sans-serif;\n  font-size: 2.25rem;\n  letter-spacing: -0.025em; /* visual elegante e moderno */\n  line-height: 1.25;\n}\n```',
        duration: '17:00',
        order: 2
      },
      {
        id: 'css-les-6',
        moduleId: 'css-mod-2',
        title: 'Posicionamento com CSS: De Static a Sticky',
        videoUrl: 'https://www.youtube.com/embed/w7ejDZ8dBh8',
        content: '### Controlando e quebrando o fluxo com "position"\nPor padrão, os elementos ocupam espaço em uma ordem sequencial de box natural (fluxo normal). A propriedade `position` permite ditar novas regras de coordenadas específicas para a tela.\n\n### Modos de Posicionamento principais:\n- **static (Padrão)**: Segue o fluxo normal. Propriedades como `top`, `right`, `bottom`, `left` não fazem efeito.\n- **relative**: O elemento mantém o espaço ocupado no fluxo original, mas aceita deslocamentos visuais em relação a si mesmo.\n- **absolute**: O elemento é removido por completo do fluxo da página. Ele passa a ser posicionado em relação ao **parente posicionado mais próximo** (ou seja, qualquer parente que possua `position: relative`, `absolute`, ou `fixed`).\n- **fixed**: Fixa o elemento em relação à **janela de visualização do navegador** (viewport). Perfeito para barras de progresso fixadas no topo ou botões flutuantes!\n- **sticky**: Um híbrido! Segue o fluxo natural até atingir um ponto limite de scroll definido, momento em que se comporta como fixed no monitor.\n\n### Exemplo de Menu Flutuante e Indicador:\n```css\n.header-principal {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  z-index: 50; /* Garante que este card flutue acima de tudo */\n  background: rgba(15, 23, 42, 0.8);\n}\n```',
        duration: '23:00',
        order: 3
      },
      {
        id: 'css-les-7',
        moduleId: 'css-mod-3',
        title: 'Layout Unidimensional com Flexbox',
        videoUrl: 'https://www.youtube.com/embed/w7ejDZ8dBh8',
        content: '### O poder da flexibilidade unidimensional\nAntes do surgimento do CSS Flexbox, organizar grades de menus, centralizar elementos em duas direções ou distribuir cards de forma equilibrada nas telas requeria truques sujos como `float: left` ou `display: inline-block`. O Flexbox resolveu tudo com elegância e dinamismo.\n\n### Como Ativar o Flexbox\nO Flexbox se apoia em uma relação estreita entre o elemento **Container Pai** (Flex Container) e seus elementos **Filhos Diretos** (Flex Items):\n```css\n.menu-pai {\n  display: flex; /* Ativa o fluxo Flex para todos os filhos de primeiro nível */\n  flex-direction: row; /* Alinha os filhos na horizontal. Use "column" para empilhar verticalmente */\n  gap: 1.5rem; /* Adiciona espaçamento uniforme entre os filhos sem precisar de margem lateral manual */\n}\n```\n\n### Alinhamentos nos Eixos Principal & Cruzado\n- **justify-content**: Distribui os filhos ao longo do eixo principal.\n  - `flex-start`: Alinha no início (esquerda por padrão).\n  - `center`: Centraliza todos os blocos na horizontal.\n  - `space-between`: Envia os extremos para os cantos e distribui igualmente o espaço restante entre eles.\n- **align-items**: Ajusta os filhos na vertical do eixo cruzado.\n  - `center`: Um dos maiores milagres do CSS! Centraliza elementos verticalmente com apenas uma linha de código.\n  - `stretch`: Estica os filhos para ocupar toda a altura do parent.\n\n```css\n/* Centralização Absoluta Perfeita de Um Card na Página */\n.container-centralizado {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100vh;\n}\n```',
        duration: '26:00',
        order: 1
      },
      {
        id: 'css-les-8',
        moduleId: 'css-mod-3',
        title: 'Layout Bidimensional com CSS Grid',
        videoUrl: 'https://www.youtube.com/embed/w7ejDZ8dBh8',
        content: '### Desenhando em Linhas e Colunas Simultaneamente\nSe o Flexbox é feito para layouts de uma única direção de cada vez (seja horizontal ou vertical), o CSS Grid é a tecnologia nativa definitiva da W3Schools para projetar páginas bidimensionais simultâneas.\n\n### Estrutura Básica de CSS Grid\nAo ativar `display: grid`, você ganha acesso a comandos incríveis para detalhar o design da sua grade:\n\n```css\n.galeria-grid {\n  display: grid;\n  /* Cria uma grade tridimensional com 3 colunas de larguras iguais */\n  grid-template-columns: repeat(3, 1fr); \n  /* Adiciona espaçamento horizontal e vertical uniforme */\n  gap: 20px;\n}\n```\n\n### Unidade Flexível Fracionada (`1fr`)\nA unidade `fr` representa uma fração do espaço disponível livre no container do grid. Se você definir `grid-template-columns: 1fr 2fr 1fr;`, a coluna do meio ocupará o dobro do tamanho das suas colunas adjacentes laterais de forma 100% responsiva conforme a tela varia.\n\n### Alinhamentos e Áreas customizadas:\nVocê pode também fundir e mesclar colunas e linhas usando o atalho `grid-column` em um filho:\n```css\n.banner-destaque-grid {\n  grid-column: span 3; /* O card de destaque ocupará as 3 colunas horizontais do grid pai */\n}\n```',
        duration: '24:00',
        order: 2
      },
      {
        id: 'css-les-9',
        moduleId: 'css-mod-3',
        title: 'Responsividade Dinâmica com Media Queries',
        videoUrl: 'https://www.youtube.com/embed/w7ejDZ8dBh8',
        content: '### Uma Única Web para Todas as Dimensões\nAtualmente, as pessoas leem suas páginas em relógios inteligentes, celulares de 5 polegadas, tablets e monitores ultra-wide de cinema de alta definição. O CSS nos permite adaptar o layout instantaneamente de acordo com o tamanho disponível.\n\n### O Poder das Media Queries\nMedia queries aplicam conjuntos de estilos CSS condicionais apenas se o tamanho da tela do visitante e outros metadados atenderem a uma regra específica de viewport:\n\n```css\n/* Estilo base (Padrão recomendado: Mobile-First) */\n.grade-produtos {\n  display: grid;\n  grid-template-columns: 1fr; /* Desenha apenas uma coluna em telas de celulares */\n}\n\n/* Telas médias (Tablets a partir de 768px de largura) */\n@media (min-width: 768px) {\n  .grade-produtos {\n    grid-template-columns: repeat(2, 1fr); /* Divide em 2 colunas */\n  }\n}\n\n/* Telas grandes (Laptops e Desktops a partir de 1024px de largura) */\n@media (min-width: 1024px) {\n  .grade-produtos {\n    grid-template-columns: repeat(4, 1fr); /* Estende para 4 colunas horizontais */\n  }\n}\n```\n\n### Meta do Viewport\nPara garantir que sua folha de estilo de pontos de interrupção (breakpoints) funcione nos smartphones móveis de forma responsiva nativa, você deve sempre incluir esta diretiva no seu documento HTML5:\n```html\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n```',
        duration: '21:00',
        order: 3
      },
      {
        id: 'css-les-10',
        moduleId: 'css-mod-4',
        title: 'Transições, Transformações & Animações Modernas',
        videoUrl: 'https://www.youtube.com/embed/w7ejDZ8dBh8',
        content: '### Tornando Tudo Humano: Efeitos de Animação CSS\nA adição de micro-interações elegantes, acelerações naturais de toque e mudanças dinâmicas de estados tira o ar engessado e artificial das páginas e as transforma em interfaces fluidas e imersivas.\n\n### 1. Transições Suaves (Transitions)\nTransitions permitem animar suavemente a mudança de uma propriedade CSS selecionada (ex: cor, tamanho) de um valor inicial para um valor final no decorrer do tempo:\n```css\n.btn-interativo {\n  background-color: #3b82f6;\n  /* Transiciona o fundo e o efeito de mover em 0.3 segundos com aceleração linear */\n  transition: background-color 0.3s ease-in-out, transform 0.3s ease;\n}\n.btn-interativo:hover {\n  background-color: #1d4ed8;\n  transform: translateY(-3px); /* Move levemente o botão para cima */\n}\n```\n\n### 2. Transformações 2D/3D (Transform)\nAllows you to translate, scale, rotate, or skew elements:\n- `transform: scale(1.1)`: Aumenta o tamanho do card em 10% de forma proporcional impecável.\n- `transform: rotate(45deg)`: Rotaciona o elemento em 45 graus.\n\n### 3. Animações Customizadas de Quadro-Chave (`@keyframes`)\nCrie sequências complexas de animação que rodam sozinhas de forma contínua ou temporizada definindo estados em porcentagens (`0%` a `100%`):\n\n```css\n/* Define a coreografia da luz pulsando */\n@keyframes pulsar-luz {\n  0% {\n    transform: scale(0.95);\n    box-shadow: 0 0 0 0 rgba(0, 255, 65, 0.4);\n  }\n  70% {\n    transform: scale(1.05);\n    box-shadow: 0 0 15px 5px rgba(0, 255, 65, 0.2);\n  }\n  100% {\n    transform: scale(0.95);\n    box-shadow: 0 0 0 0 rgba(0, 255, 65, 0);\n  }\n}\n\n/* Aplica a cronologia da animação no elemento de LED */\n.led-indicador {\n  width: 10px;\n  height: 10px;\n  background-color: #00ff41;\n  border-radius: 50%;\n  animation: pulsar-luz 2s infinite ease-in-out; /* roda continuamente */\n}\n```',
        duration: '28:00',
        order: 1
      }
    ];

    const jsLessons = [
      {
        id: 'js-les-1',
        moduleId: 'js-mod-1',
        title: 'Introdução ao JavaScript & Sintaxe',
        videoUrl: 'https://www.youtube.com/embed/Ptbk2XFNxs8',
        content: '### O que é o JavaScript?\nJavaScript (JS) é uma linguagem de programação leve, interpretada e orientada a objetos (com funções de primeira classe) mais conhecida como a linguagem de script para páginas Web de acordo com a documentação W3Schools.\n\n### Como Incluir JS no HTML5\nAssim como o CSS, você possui três maneiras fundamentais de embutir código de script JS:\n\n1. **JS Externo (Melhor Prática)**:\n```html\n<script src="script.js" defer></script>\n```\n2. **JS Interno**:\n```html\n<script>\n  console.log("Executando internamente!");\n</script>\n```\n3. **Inline (Evitar)**:\n```html\n<button onclick="alert(\'Olá!\')">Clique-me</button>\n```\n\n### Sintaxe Básica do JS\nJavaScript usa valores estáticos (literais) e valores dinâmicos (variáveis). Instruções terminam opcionalmente com ponto e vírgula (`;`).',
        duration: '15:00',
        order: 1
      },
      {
        id: 'js-les-2',
        moduleId: 'js-mod-1',
        title: 'Variáveis (var, let e const) & Tipificados',
        videoUrl: 'https://www.youtube.com/embed/Ptbk2XFNxs8',
        content: '### Declarando Variáveis no JS Moderno\nO JavaScript moderno (ES6) nos entrega três palavras-chaves de declaração com escopos diferentes:\n\n- **var**: Escopo de função global. Pode ser redeclarada e atualizada. Evite o seu uso por riscos de vazamento de escopo (hoisting).\n- **let**: Escopo de bloco. Altamente recomendada para variáveis que mudarão de valor de forma dinâmica.\n- **const**: Escopo de bloco. Ideal para declarar constantes imutáveis que não podem receber uma nova atribuição posterior.\n\n### Tipos de Dados Primitivos\n- **String**: Cadeia de texto (`"Neo"`).\n- **Number**: Inteiros ou decimais (`42`, `3.14`).\n- **Boolean**: Valores lógicos (`true` ou `false`).\n- **Undefined**: Variável declarada mas sem valor atribuído.\n- **Null**: Representação proposital de ausência de valor.',
        duration: '18:00',
        order: 2
      },
      {
        id: 'js-les-3',
        moduleId: 'js-mod-1',
        title: 'Operadores & Saídas de Dados',
        videoUrl: 'https://www.youtube.com/embed/Ptbk2XFNxs8',
        content: '### Exibindo Saídas no JS\nJavaScript possui métodos eficientes para exibir ou imprimir valores na tela:\n1. `console.log(valor)`: Imprime mensagens no console do desenvolvedor.\n2. `document.getElementById("id").innerHTML = valor`: Modifica elementos gráficos do documento HTML.\n3. `window.alert(valor)`: Dispara um modal nativo para visualização.\n\n### Operadores Cruciais\n- **Aritméticos**: `+`, `-`, `*`, `/`, `%` (módulo).\n- **Atribuição**: `=`, `+=`, `-=`.\n- **Comparação**: `==` (compara valor), `===` (compara valor e tipo - estrito!), `!=`, `!==`.\n- **Lógicos**: `&&` (E), `||` (OU), `!` (NÃO).',
        duration: '12:00',
        order: 3
      },
      {
        id: 'js-les-4',
        moduleId: 'js-mod-2',
        title: 'Estruturas Condicionais (if, else & switch)',
        videoUrl: 'https://www.youtube.com/embed/Ptbk2XFNxs8',
        content: '### Tomada de Decisão na Programação\nPara executar blocos de código com base em condições lógicas específicas, usamos operadores condicionais.\n\n### A Instrução `if / else if / else`\n```javascript\nconst hora = 14;\n\nif (hora < 12) {\n  console.log("Bom dia!");\n} else if (hora < 18) {\n  console.log("Boa tarde!");\n} else {\n  console.log("Boa noite!");\n}\n```\n\n### Operador Ternário (Condicional Curto)\n```javascript\nconst statusAcesso = (idade >= 18) ? "Aprovado" : "Negado";\n```\n\n### A Instrução `switch`\nUse switch para selecionar um de muitos blocos de código a serem executados com base no valor de uma expressão específica de forma limpa:\n```javascript\nswitch (cor) {\n  case "verde":\n    console.log("Siga!");\n    break;\n  case "vermelho":\n    console.log("Aguarde!");\n    break;\n  default:\n    console.log("Cor inválida.");\n}\n```',
        duration: '20:00',
        order: 1
      },
      {
        id: 'js-les-5',
        moduleId: 'js-mod-2',
        title: 'Laços de Repetição (for e while)',
        videoUrl: 'https://www.youtube.com/embed/Ptbk2XFNxs8',
        content: '### Automatizando Processos Repetitivos\nLaços (Loops) são úteis para rodar o mesmo trecho de código consecutivamente, com valores diferentes a cada repetição.\n\n### O Laço `for` Tradicional\n```javascript\nfor (let i = 0; i < 5; i++) {\n  console.log("Número: " + i);\n}\n```\n\n### Laços `while` e `do...while`\n- **while**: Testa a condição e depois executa o bloco interno.\n- **do...while**: Executa o bloco de código ao menos uma vez antes de testar a condição lógica.\n\n```javascript\nlet i = 0;\nwhile (i < 5) {\n  console.log(i);\n  i++;\n}\n```',
        duration: '16:00',
        order: 2
      },
      {
        id: 'js-les-6',
        moduleId: 'js-mod-2',
        title: 'Funções Avançadas & Arrow Functions',
        videoUrl: 'https://www.youtube.com/embed/Ptbk2XFNxs8',
        content: '### Escrevendo Código Modular com Funções\nUma função é um bloco isolado de código projetado para realizar uma tarefa específica. Ela é executada quando algo a invoca (chama).\n\n### Declaração de Função Tradicional\n```javascript\nfunction somar(a, b) {\n  return a + b;\n}\nconst resultado = somar(10, 5); // Retorna 15\n```\n\n### Expressões de Funções e Arrow Functions (ES6)\nArrow Functions nos dão uma sintaxe limpa e curta de escrita, além de herdor o escopo lexical do objeto pai de forma estável:\n```javascript\nconst somarArrow = (a, b) => a + b;\nconst elevarQuadrado = x => x * x;\n```',
        duration: '22:00',
        order: 3
      },
      {
        id: 'js-les-7',
        moduleId: 'js-mod-3',
        title: 'Manipulação de Arrays & Estrutura de Objetos',
        videoUrl: 'https://www.youtube.com/embed/Ptbk2XFNxs8',
        content: '### Armazenando Múltiplos Dados Regulados\n\n### 1. Criando e Manipulando Arrays (Vetores)\nArrays in Javascript aceitam tipos mistos simultaneamente:\n```javascript\nconst frameworks = ["React", "Vue", "Angular"];\nframeworks.push("Svelte"); // Adiciona no fim\nconsole.log(frameworks[0]); // Saída: "React"\n```\n\n### Métodos Avançados de Iteração de Arrays\n- **map()**: Cria um novo array alterando iterativamente cada item.\n- **filter()**: Retorna subconjuntos de itens baseados em filtros lógicos.\n- **reduce()**: Reduz todo o array a um único valor totalizador.\n\n### 2. Objetos Literais\nModelam propriedades complexas agrupando chaves e valores:\n```javascript\nconst aluno = {\n  nome: "Nathalie",\n  xp: 1500,\n  saudar: function() {\n    return `Olá, meu nome é ${this.nome}`;\n  }\n};\nconsole.log(aluno.nome); // Dot Notation\nconsole.log(aluno["xp"]); // Bracket Notation\n```',
        duration: '25:00',
        order: 1
      },
      {
        id: 'js-les-8',
        moduleId: 'js-mod-3',
        title: 'Manipulação de DOM & Eventos Gráficos',
        videoUrl: 'https://www.youtube.com/embed/Ptbk2XFNxs8',
        content: '### DOM: Document Object Model\nQuando uma página web é carregada, o navegador cria o modelo estrutural HTML mapeado em nós de objetos (DOM).\n\n### Selecionando Nódos do DOM com JavaScript\n- `document.getElementById("id")`: Seleciona via id do elemento.\n- `document.querySelector(".classe")`: Sintaxe CSS moderna. Seleciona o primeiro elemento compatível.\n- `document.querySelectorAll(".classe")`: Retorna uma lista de todos os elementos compatíveis.\n\n### Escutando Interações do Usuário (Event Listeners)\nPara disparar comportamentos interativos nas páginas, adicionamos escutadores de eventos na tela:\n```javascript\nconst botao = document.querySelector("#btn-enviar");\n\nbotao.addEventListener("click", (event) => {\n  event.preventDefault(); // Impede o envio HTTP padrão\n  console.log("Botão clicado manualmente!");\n});\n```',
        duration: '24:00',
        order: 2
      },
      {
        id: 'js-les-9',
        moduleId: 'js-mod-4',
        title: 'Programação Assíncrona & Promises',
        videoUrl: 'https://www.youtube.com/embed/Ptbk2XFNxs8',
        content: '### A Natureza não bloqueante do JavaScript\nJavaScript é single-threaded (executa uma instrução por vez no fluxo principal). Para evitar o travamento da interface durante downloads pesados ou requisições, usamos código assíncrono.\n\n### Entendendo "Promises" (Promessas)\nUma Promise representa a eventual conclusão (ou falha) de uma operação de rede assíncrona:\n- **Pending (Pendente)**: Estado de espera inicial.\n- **Fulfilled (Cumprida)**: Ação concluída com sucesso.\n- **Rejected (Rejeitada)**: Operação falhou com erro.\n\n```javascript\nconst carregarDados = () => {\n  return new Promise((resolve, reject) => {\n    let sucesso = true;\n    setTimeout(() => {\n      if (sucesso) resolve("Dados carregados!");\n      else reject("Falha da rede.");\n    }, 2000);\n  });\n};\n\ncarregarDados()\n  .then(res => console.log(res))\n  .catch(err => console.error(err));\n```',
        duration: '21:00',
        order: 1
      },
      {
        id: 'js-les-10',
        moduleId: 'js-mod-4',
        title: 'Consumo de APIs Modernas: Fetch & Async/Await',
        videoUrl: 'https://www.youtube.com/embed/Ptbk2XFNxs8',
        content: '### Consumindo APIs Remotas com Fetch\nA API Fetch fornece um poder nativo limpo para buscar recursos através da rede sem a necessidade de instalar bibliotecas de terceiros (como Axios) de acordo com as especificações W3Schools.\n\n### Sintaxe de Async / Await\nAsync/Await permite que escrevamos requisições assíncronas com uma sintaxe sequencial extremamente legível, semelhante ao código síncrono tradicional:\n\n```javascript\nasync function buscarNodosZion() {\n  try {\n    const response = await fetch("https://api.mastercode.io/nodos");\n    const dados = await response.json();\n    console.log(dados);\n  } catch (erro) {\n    console.error("Erro durante busca:", erro);\n  }\n}\nbuscarNodosZion();\n```\n\n### Tratamento de Falhas com Try/Catch\nAo programar fluxos assíncronas, sempre envolva suas instruções em um bloco try...catch defensivo para capturar instabilidades de rede instantaneamente.',
        duration: '28:00',
        order: 2
      }
    ];

    data.lessons = [
      ...html5Lessons,
      ...cssLessons,
      ...jsLessons,
      ...(data.lessons || []).filter((l: any) => !l.id.startsWith('html5-') && !l.id.startsWith('css-') && !l.id.startsWith('js-') && l.moduleId !== 'mod-1' && l.moduleId !== 'mod-2')
    ];
    // Auto-save the updated state to the file for immediate sync
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  }
  return data;
}

function saveDB(data: any) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

const JWT_SECRET = process.env.JWT_SECRET || "matrix-reloaded-secret";

// Middleware to authenticate JWT token
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Acesso negado. Token não fornecido.' });

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ error: 'Token inválido ou expirado.' });
    req.user = user;
    next();
  });
};

// Middleware to check if user is admin
const isAdmin = (req: any, res: any, next: any) => {
  const db = loadDB();
  const user = db.users.find((u: any) => u.id === req.user.userId);
  if (user && user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Acesso restrito a administradores.' });
  }
};

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Initialize DB
  let db = loadDB();

  const products = [
    { id: 1, name: 'Mastering React Microfrontends', price: 199, category: 'Course', image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&q=80' },
    { id: 2, name: 'Stark Security Protocol Kit', price: 499, category: 'Bundle', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&q=80' },
    { id: 3, name: 'J-New AI Assistant Pro', price: 29, category: 'Subscription', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&q=80' },
    { id: 4, name: 'Matrix Rain Mechanical Keyboard', price: 159, category: 'Hardware', image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=400&q=80' }
  ];

  // API Routes
  app.get("/api/courses", (req, res) => {
    res.json(db.courses);
  });

  app.get("/api/courses/:courseId/modules", (req, res) => {
    const { courseId } = req.params;
    let modules = db.modules.filter((m: any) => m.courseId === courseId);
    if (modules.length === 0) {
      modules = [
        { id: `mod-1-${courseId}`, courseId, title: 'Módulo de Introdução', order: 1 }
      ];
    }
    res.json(modules);
  });

  app.get("/api/courses/:courseId/lessons", (req, res) => {
    const { courseId } = req.params;
    // Load fresh DB in case it was written to
    const currentDb = loadDB();
    const courseModules = currentDb.modules.filter((m: any) => m.courseId === courseId);
    const moduleIds = courseModules.map((m: any) => m.id);
    const courseLessons = currentDb.lessons.filter((l: any) => moduleIds.includes(l.moduleId));
    res.json(courseLessons);
  });

  app.get("/api/modules/:moduleId/lessons", (req, res) => {
    const { moduleId } = req.params;
    let lessons = db.lessons.filter((l: any) => l.moduleId === moduleId);
    if (lessons.length === 0) {
      lessons = [
        { id: `les-1-${moduleId}`, moduleId, title: 'Aula Inaugural', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', content: 'Aula gerada automaticamente.', duration: '15:00', order: 1 }
      ];
    }
    res.json(lessons);
  });

  app.post("/api/progress", authenticateToken, (req: any, res) => {
    const { lessonId } = req.body;
    const userId = req.user.userId;
    
    const progress = { userId, lessonId, completedAt: new Date().toISOString() };
    
    // Check if progress already exists
    const exists = db.userProgress.find((p: any) => p.userId === userId && p.lessonId === lessonId);
    if (!exists) {
      db.userProgress.push(progress);
      
      // Update Streak Logic
      const user = db.users.find((u: any) => u.id === userId);
      if (user) {
        const lastActivity = new Date(user.lastActivity || 0);
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - lastActivity.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          user.streak += 1;
        } else if (diffDays > 1) {
          user.streak = 1;
        } else if (user.streak === 0) {
          user.streak = 1;
        }
        user.lastActivity = today.toISOString();
      }
      
      saveDB(db);
    }
    res.json({ success: true });
  });

  app.get("/api/progress/:userId", authenticateToken, (req: any, res) => {
    const { userId } = req.params;
    const progress = db.userProgress.filter((p: any) => p.userId === parseInt(userId));
    res.json(progress);
  });

  app.post("/api/auth/register", async (req, res) => {
    const { email, password, name } = req.body;
    
    if (db.users.find((u: any) => u.email === email)) {
      return res.status(400).json({ error: "Este e-mail já está em uso." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { 
      id: Date.now(), 
      email, 
      password: hashedPassword, 
      name, 
      role: 'student',
      xp: 0,
      level: 1,
      streak: 0,
      subscription: 'free',
      status: 'active',
      lastActivity: new Date().toISOString()
    };
    db.users.push(user);
    saveDB(db);
    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET);
    res.json({ token, user: { id: user.id, email, name, role: user.role, xp: user.xp, level: user.level, streak: user.streak, subscription: user.subscription, status: user.status } });
  });

  app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    const user = db.users.find((u: any) => u.email === email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET);
    res.json({ token, user: { id: user.id, email, name: user.name, role: user.role, xp: user.xp, level: user.level, streak: user.streak, subscription: user.subscription, status: user.status } });
  });

  app.post("/api/user/xp", authenticateToken, (req: any, res) => {
    const { amount } = req.body;
    const userId = req.user.userId;
    const user = db.users.find((u: any) => u.id === userId);
    if (user) {
      user.xp += amount;
      // Level logic: floor(sqrt(xp / 100)) + 1
      user.level = Math.floor(Math.sqrt(user.xp / 100)) + 1;
      saveDB(db);
      return res.json({ xp: user.xp, level: user.level });
    }
    res.status(404).json({ error: "User not found" });
  });

  // Community Endpoints
  app.get("/api/community/posts", (req, res) => {
    res.json(db.posts || []);
  });

  app.post("/api/community/posts", authenticateToken, (req: any, res) => {
    const { content, tags } = req.body;
    const user = db.users.find((u: any) => u.id === req.user.userId);
    
    const newPost = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      userAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`,
      content,
      likes: 0,
      comments: 0,
      timestamp: new Date().toISOString(),
      tags: tags || []
    };

    if (!db.posts) db.posts = [];
    db.posts.unshift(newPost);
    saveDB(db);
    res.json(newPost);
  });

  app.post("/api/inspector/analyze", authenticateToken, async (req: any, res) => {
    try {
      const { InMemoryInspectionRepository } = await import('./src/core/ai-inspector/scanner/infra/database/InMemoryInspectionRepository');
      const { InMemoryReportRepository } = await import('./src/core/ai-inspector/reporting/infra/database/InMemoryReportRepository');
      const { GeminiScannerEngine } = await import('./src/core/ai-inspector/scanner/infra/ai/GeminiScannerEngine');
      const { RunInspectionUseCase } = await import('./src/core/ai-inspector/scanner/application/useCases/RunInspectionUseCase');
      
      const inspectionRepository = new InMemoryInspectionRepository();
      const reportRepository = new InMemoryReportRepository();
      const scannerEngine = new GeminiScannerEngine();
      const runInspectionUseCase = new RunInspectionUseCase(inspectionRepository, reportRepository, scannerEngine);

      const { codeSnippet } = req.body;
      const userId = String(req.user.userId);
      
      if (!codeSnippet) {
        return res.status(400).json({ error: "O trecho de código (codeSnippet) é obrigatório." });
      }

      const result = await runInspectionUseCase.execute({ userId, codeSnippet });
      res.json({
        inspectionDetails: result.inspection,
        score: {
          totalScore: result.report.totalScore,
          securityScore: result.report.securityScore,
          performanceScore: result.report.performanceScore,
          maintainabilityScore: result.report.maintainabilityScore,
          architectureScore: result.report.architectureScore
        },
        issues: result.issues
      });
    } catch (error: any) {
      console.error("[Inspector Error]", error.message || error);
      res.status(500).json({ error: "Falha na análise estrutural: " + (error.message || error) });
    }
  });

  // Certificate Endpoints
  app.get("/api/certificates", authenticateToken, (req: any, res) => {
    const certificates = (db.certificates || []).filter((c: any) => c.userId === req.user.userId);
    res.json(certificates);
  });

  app.post("/api/certificates/generate", authenticateToken, (req: any, res) => {
    const { courseId } = req.body;
    const user = db.users.find((u: any) => u.id === req.user.userId);
    const course = db.courses.find((c: any) => c.id === courseId);

    if (!course) return res.status(404).json({ error: 'Curso não encontrado.' });

    const newCertificate = {
      id: Date.now().toString(),
      userId: user.id,
      courseId,
      courseTitle: course.title,
      issuedAt: new Date().toISOString(),
      code: Math.random().toString(36).substring(2, 15).toUpperCase()
    };

    if (!db.certificates) db.certificates = [];
    db.certificates.push(newCertificate);
    saveDB(db);
    res.json(newCertificate);
  });

  app.get("/api/dashboard/kpis", (req, res) => {
    // Mock KPIs
    res.json({
      courseEfficiency: 85,
      activeUsers: db.users.length,
      revenue: 45000 + db.orders.reduce((acc: any, o: any) => acc + o.total, 0),
      completionRate: 72
    });
  });

  // E-commerce & Payments
  app.get("/api/products", (req, res) => {
    res.json(products);
  });

  app.post("/api/orders", (req, res) => {
    const { userId, items, total, paymentMethod } = req.body;
    const order = {
      id: `ORD-${Date.now()}`,
      userId,
      items,
      total,
      paymentMethod,
      status: 'completed',
      date: new Date().toISOString()
    };
    db.orders.push(order);
    saveDB(db);
    res.json({ success: true, order });
  });

  // Superadmin Endpoints
  app.get("/api/admin/stats", authenticateToken, isAdmin, (req: any, res) => {
    // Mock data for charts
    const monthlyRevenue = [
      { name: 'Jan', value: 4000 },
      { name: 'Feb', value: 3000 },
      { name: 'Mar', value: 2000 },
      { name: 'Apr', value: 2780 },
      { name: 'May', value: 1890 },
      { name: 'Jun', value: 2390 },
      { name: 'Jul', value: 3490 },
    ];

    const userGrowth = [
      { name: 'Jan', value: 100 },
      { name: 'Feb', value: 250 },
      { name: 'Mar', value: 400 },
      { name: 'Apr', value: 600 },
      { name: 'May', value: 850 },
      { name: 'Jun', value: 1100 },
      { name: 'Jul', value: db.users.length },
    ];

    const rankings = [...db.users]
      .sort((a, b) => b.xp - a.xp)
      .slice(0, 5)
      .map(u => ({ name: u.name, xp: u.xp, level: u.level }));

    res.json({ monthlyRevenue, userGrowth, rankings });
  });

  app.get("/api/admin/users", authenticateToken, isAdmin, (req: any, res) => {
    res.json(db.users.map((u: any) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      subscription: u.subscription || 'none',
      status: u.status || 'inactive',
      xp: u.xp,
      level: u.level
    })));
  });

  app.post("/api/admin/courses", authenticateToken, isAdmin, (req: any, res) => {
    const course = { id: `course-${Date.now()}`, ...req.body };
    db.courses.push(course);
    saveDB(db);
    res.json(course);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`MasterCode Server running on http://localhost:${PORT}`);
  });
}

startServer();
