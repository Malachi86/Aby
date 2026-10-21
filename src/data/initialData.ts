import { ArticlePost, AuthorProfile, Category } from '../types';

export const initialAuthorProfile: AuthorProfile = {
  name: 'Ruby Aumentado Orozco (aby)',
  title: 'Columnist, Essayist & Cultural Critic',
  columnName: 'Ink & Perspectives by Aby',
  bio: 'Writing on the intersection of modern culture, societal dynamics, feminine perspectives, public spaces, and mindful living. Believing that every opinion must be forged with truth, empathy, and critical inquiry.',
  avatar: '/src/assets/images/author_ruby_aby_portrait_1792571832285.jpg',
  email: 'ruby.orozco@pananaw.ph',
  location: 'Manila, Philippines',
  socials: {
    twitter: 'https://twitter.com',
    facebook: 'https://facebook.com',
    linkedin: 'https://linkedin.com',
    substack: 'https://substack.com',
  },
  motto: 'The pen is not merely an instrument of record; it is a luminous beacon cast into the unexamined depths of our collective consciousness.',
};

export const initialCategories: Category[] = [
  {
    id: 'cat-editorial',
    name: 'Editorial',
    slug: 'editorial',
    description: 'Incisive editorial stances and perspectives on paramount issues.',
    color: '#BA6E8F',
  },
  {
    id: 'cat-culture',
    name: 'Culture & Society',
    slug: 'culture-society',
    description: 'Critical essays examining community shifts, traditions, and the arts.',
    color: '#D391B0',
  },
  {
    id: 'cat-technology',
    name: 'Tech & Modernity',
    slug: 'tech-modernity',
    description: 'The profound impact of AI, algorithmic feeds, and digital hyper-connectivity.',
    color: '#9F6496',
  },
  {
    id: 'cat-reflections',
    name: 'Essays & Musings',
    slug: 'essays-musings',
    description: 'Intimate philosophical reflections on literature, memory, and everyday stillness.',
    color: '#7B466A',
  },
  {
    id: 'cat-urbanism',
    name: 'Policy & Spaces',
    slug: 'policy-spaces',
    description: 'Urban planning, transit justice, and the democratization of public spaces.',
    color: '#5D3C64',
  },
];

export const initialArticles: ArticlePost[] = [
  {
    id: 'art-1',
    title: 'The City at Twilight: Why We Must Reclaim Public Space for People Over Automobiles',
    kicker: 'Lead Editorial',
    slug: 'the-city-at-twilight',
    excerpt: 'As dusk descends over concrete flyovers and bumper-to-bumper boulevards, millions of commuters find themselves imprisoned in an endless standstill. It is time to ask: who are our cities truly designed for?',
    coverImage: '/src/assets/images/editorial_manila_dusk_1792570804269.jpg',
    coverCaption: 'Twilight settling across the urban skyline — a quiet contemplation on velocity and stillness.',
    categoryId: 'cat-editorial',
    categoryName: 'Editorial',
    publishedAt: 'October 20, 2026',
    readTimeMinutes: 6,
    featured: true,
    likes: 184,
    views: 2420,
    status: 'published',
    tags: ['Urbanism', 'Transit Justice', 'Editorial', 'City Life'],
    content: `## Gridlock is Not Just an Inconvenience — It is the Theft of Human Time

If there is a collective burden shouldered equally by every urban citizen, it is the glacial inching of metal on concrete during the evening commute. Every exhausted hour spent packed inside transit vans or waiting on elevated platforms is an hour stolen from finishing a book, preparing dinner for loved ones, or simply enjoying the restorative luxury of unhurried rest.

The crisis confronting our metropolitan landscape is not a lack of asphalt. It is the obsolete doctrine that progress can be quantified by elevated expressways built exclusively for private passenger cars.

> "A truly developed country is not a place where the poor have cars; it is where the wealthy gladly choose to ride public transit." — Enrique Peñalosa

### The Mirage of Car-Centric Expansion

Over the past decade, we have witnessed the systematic dismantling of tree-lined sidewalks to carve out supplementary car lanes. Yet through the indisputable economic principle of *induced demand*, adding lanes never alleviates congestion; it merely summons more vehicles until equilibrium collapses again.

Where are the shaded corridors where pedestrians of all generations can stroll without dread? Where is the breathing room in our civic design?

1. **Prioritizing the Public Majority**: Over 80% of urban inhabitants rely on collective transit and walking, yet less than 25% of civic road space is consecrated to their safe transit.
2. **Green Belts Over Concrete Cages**: Cities like Seoul and Paris tore down urban overpasses to restore living rivers and promenades. We possess both the imperative and the ingenuity to do the same along our waterways.
3. **Dignity and Living Wages for Transit Workers**: Fleet modernization must begin with fair working standards and respect for operators, rather than burying them beneath insurmountable debt.

### A Call for a Reimagined Horizon

We must reject the cynicism that dismisses this daily attrition as "just the price of city living." Advocating for dependable railways, generous pedestrian esplanades, and protected cycling corridors is not an eccentric luxury — it is the cornerstone of a humane society.

When the streetlights ignite at nightfall, every worker deserves to return home with dignity intact, with energy left to cultivate relationships, read, and dare to dream for tomorrow.`,
    comments: [
      {
        id: 'c-101',
        postId: 'art-1',
        authorName: 'Atty. Clara Santos',
        content: 'This articulates the issue with absolute precision. We cannot keep trying to pave our way out of traffic. Transit equity must be treated as a fundamental public good.',
        createdAt: '2 hours ago',
        likes: 24,
      },
      {
        id: 'c-102',
        postId: 'art-1',
        authorName: 'Ruby Aumentado Orozco (aby)',
        content: 'Thank you, Atty. Clara! Transit equity is not merely a technical equation; it is fundamentally a moral question about civic respect.',
        createdAt: '1 hour ago',
        likes: 18,
        isAuthor: true,
      },
      {
        id: 'c-103',
        postId: 'art-1',
        authorName: 'Daniel Reyes',
        content: 'As a commuter who spends four hours on the road every single day, this piece spoke to my very soul. Thank you for this courageous perspective, Aby!',
        createdAt: '35 minutes ago',
        likes: 11,
      },
    ],
  },
  {
    id: 'art-2',
    title: 'Between the Page and Silence: The Lost Art of Slow Reading in an Algorithmic Age',
    kicker: 'Essays & Musings',
    slug: 'between-page-and-silence',
    excerpt: 'In an ecosystem calibrated for rapid swipes and persistent notifications, dedicating an unhurried hour to a single essay and handwritten notes represents a quiet yet radical rebellion.',
    coverImage: '/src/assets/images/editorial_pen_notebook_1792570804853.jpg',
    coverCaption: 'The fountain pen, warm dark coffee, and the sacred expanse where memory converses with thought.',
    categoryId: 'cat-reflections',
    categoryName: 'Essays & Musings',
    publishedAt: 'October 18, 2026',
    readTimeMinutes: 5,
    featured: false,
    likes: 132,
    views: 1850,
    status: 'published',
    tags: ['Literature', 'Philosophy', 'Mindfulness', 'Writing'],
    content: `## The Dizziness of Algorithmic Velocity

There is a quietude slipping away from our contemporary consciousness: the stillness of sitting without an objective other than to read, ponder, and breathe.

This morning, I unlocked my leather-bound journal. The scent of textured archival paper and the smooth friction of nib against grain exerted an immediate calming gravity. No badge alerts. No recommendation engines nudging your gaze toward another ephemeral video loop.

> "To read deeply requires time that refuses to hurry; profound truth never surrenders itself to a hasty glance."

### Why We Must Reclaim Our Attention Span

Modern cognitive psychology consistently warns us that fragmented attention destroys reflective depth. When we jump incessantly between short clips and reactionary updates, our tolerance for nuanced ambiguity decays.

- **The Recovery of Depth**: Great insights never blossom in 15-second soundbites. They demand incubation, brooding, and the courage to wrestle with inner contradictions.
- **The Value of Imperfection**: On paper, when ink blurs or an idea falters, the physical trace remains. It is part of the honest struggle. In hyper-curated digital spaces, easy deletion breeds curated conformity.

Give yourself the gift of an undisturbed hour today. Brew fresh coffee, silence your network connections, and open the book you have long postponed. It is there that you may rediscover your own thoughts.`,
    comments: [
      {
        id: 'c-201',
        postId: 'art-2',
        authorName: 'Elena Rostova',
        content: 'This is pure poetry. It reminded me of university afternoons when we would sit on the lawn with actual physical books and zero distractions.',
        createdAt: 'Yesterday',
        likes: 14,
      },
    ],
  },
  {
    id: 'art-3',
    title: 'The Future of Language in the Dawn of AI: Can Machines Ever Carry the Soul of Words?',
    kicker: 'Tech & Modernity',
    slug: 'the-future-of-language-and-ai',
    excerpt: 'Large language models can mimic cadence, draft legal briefs, and compose verse with breathtaking velocity. Yet can probabilistic tokens ever feel the poignant ache of longing or the courage of solidarity?',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    coverCaption: 'Abstract digital illumination contrasting with the organic heartbeat of human emotion.',
    categoryId: 'cat-technology',
    categoryName: 'Tech & Modernity',
    publishedAt: 'October 15, 2026',
    readTimeMinutes: 7,
    featured: false,
    likes: 110,
    views: 1690,
    status: 'published',
    tags: ['AI', 'Language', 'Culture', 'Philosophy'],
    content: `## The Machine That Learns to Speak

The acceleration of Generative Artificial Intelligence over recent seasons has been nothing short of extraordinary. At the press of a keystroke, algorithms synthesize essays, generate stylistic summaries, and translate between hundreds of dialects with remarkable syntactical polish.

Yet amidst the awe, an essential philosophical question emerges: what happens to our living expression when the majority of public discourse is generated not from lived sorrow and joy, but from statistical probabilities trained on vast text corpora?

### Language is Far More Than Training Tokens

Human language is not merely an encoding protocol; it is an organic repository of collective triumphs, ancestral migrations, and singular vulnerabilities.

Consider terms whose resonance transcends mere dictionary definitions:
- **Ginhawa**: More than comfort; the deep, liberated inhalation of relief after protracted suffering.
- **Tampo**: Not mere petulance or cold silence; a gentle withdrawal awaiting reassuring affection from someone cherished.
- **Bayanihan**: Not commercial collaboration; the spontaneous, unprompted bearing of a neighbor's house on collective shoulders.

> "Language is the sanctuary of the human soul. When we surrender our writing entirely to machines, we become tenants in our own spiritual home."

We need not fear or reject technology. AI serves as a powerful research copilot and analytical partner. But the voice, the conviction, and the blood coursing through each editorial must always stem from the beating human heart.`,
    comments: [],
  },
];
