import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

const INITIAL_POSTS = [
  {
    title: 'Criação de Design Systems - Frontend',
    content: `
Um design system no contexto do frontend é uma abordagem estruturada e sistemática para projetar e desenvolver interfaces de usuário consistentes em um aplicativo ou site. 

### Origem do Design System
Grandes empresas, como Google, Airbnb e Salesforce, começaram a desenvolver suas próprias soluções internas para lidar com a complexidade e a falta de consistência em seus projetos.

### Benefícios
- **Consistência**: Garante aparência unificada.
- **Eficiência**: Reutilização de componentes.
- **Colaboração**: Facilita trabalho entre times.
`,
    excerpt: 'Um design system no contexto do frontend é uma abordagem estruturada...',
    author: 'Johnatan Quenes',
    authorRole: 'Senior Developer',
    type: 'article',
    image: 'https://images.unsplash.com/photo-1587560699334-bea5356ac8ce?auto=format&fit=crop&q=80&w=1200',
    tags: ['Design Systems', 'Frontend'],
    likes: 124,
    comments: 18,
    createdAt: new Date().toISOString()
  },
  {
    title: 'Micro Front-end: Implementando Web Components com Angular',
    content: `
Implementando Micro Frontends utilizando Angular Elements para transformar componentes em Custom Elements.

### Angular Elements
Angular Elements é a solução nativa do Angular para transformar os componentes em Custom Elements.

\`\`\`bash
ng add @angular/elements
\`\`\`
`,
    excerpt: 'Essa é a segunda parte de uma série de artigos sobre Micro Front-ends...',
    author: 'Johnatan Quenes dos Santos',
    authorRole: 'Tech Lead',
    type: 'article',
    image: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=1200',
    tags: ['Micro Front-end', 'Angular'],
    likes: 85,
    comments: 12,
    createdAt: new Date().toISOString()
  },
  {
    title: 'Web Components: O Poder da Reutilização Nativa',
    content: `
Web Components é uma suíte de tecnologias que permite a criação de elementos customizados reutilizáveis.

### Tecnologias Principais
1. **Elementos Customizados**: APIs JS para definir elementos.
2. **Shadow DOM**: Encapsulamento de estilos.
3. **Templates HTML**: Marcação não exibida.
`,
    excerpt: 'Web Components buscam resolver problemas de reutilização de código...',
    author: 'Johnatan Quenes',
    authorRole: 'Senior Developer',
    type: 'article',
    image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&q=80&w=1200',
    tags: ['Web Components', 'Frontend'],
    likes: 92,
    comments: 7,
    createdAt: new Date().toISOString()
  },
  {
    title: 'O Futuro do Microfrontends',
    content: 'Entenda como o module federation está revolucionando o ecosistema javascript no ecossistema corporativo. Quais os prós e contras e para onde estamos caminhando.',
    excerpt: 'Entenda como o module federation está revolucionando o ecosistema javascript...',
    author: 'Admin',
    authorRole: 'System',
    type: 'discussion',
    image: 'https://images.unsplash.com/photo-1589903308904-1010c2294adc?auto=format&fit=crop&q=80&w=800',
    tags: ['#microfrontends', '#podcast', '#javascript'],
    likes: 56,
    comments: 12,
    createdAt: new Date().toISOString()
  }
];

export async function seedDatabase() {
  const postsRef = collection(db, 'posts');
  const snapshot = await getDocs(postsRef);
  
  if (snapshot.empty) {
    console.log('Seeding database with initial posts...');
    for (const post of INITIAL_POSTS) {
      await addDoc(postsRef, {
        ...post,
        serverCreatedAt: serverTimestamp()
      });
    }
  }
}
