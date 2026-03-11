export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  readTime: string;
  publishedAt: string;
  content: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'what-is-saju',
    title: 'What is Saju? A Complete Guide to Korean Four Pillars of Destiny',
    excerpt: 'Discover Saju, the ancient Korean system of reading your birth chart through the Four Pillars of Destiny. Learn about heavenly stems, earthly branches, and your Day Master.',
    readTime: '6 min read',
    publishedAt: '2025-01-15',
    content: `Saju, written as \u4e09\u67f1 in Korean Hanja, literally means "four pillars." It is one of Korea's most respected systems of destiny analysis, rooted in the same ancient Chinese metaphysical framework known as BaZi (\u516b\u5b57). While the two systems share a common origin, Korean Saju has evolved with its own interpretive traditions, vocabulary, and cultural nuances over centuries.

At its core, Saju analyzes the exact moment of your birth, encoded as four pillars: the Year, Month, Day, and Hour. Each pillar is composed of two characters, a Heavenly Stem and an Earthly Branch, giving you eight characters total (hence the Chinese name "Eight Characters").

## The Five Elements

Everything in Saju revolves around the Five Elements: Wood (\ubaa9), Fire (\ud654), Earth (\ud1a0), Metal (\uae08), and Water (\uc218). These elements are not just abstract concepts. They represent tangible energies that govern everything from personality traits to career aptitudes to health patterns.

The elements interact through two primary cycles. In the Generating Cycle, Wood feeds Fire, Fire creates Earth (ash), Earth produces Metal (ore), Metal collects Water (condensation), and Water nourishes Wood. In the Controlling Cycle, Wood penetrates Earth, Earth dams Water, Water extinguishes Fire, Fire melts Metal, and Metal chops Wood. Understanding these cycles is the key to reading any Saju chart.

## The Day Master

Your Day Master is the Heavenly Stem of your Day Pillar. It represents your core self, your fundamental nature and identity. There are ten possible Day Masters, two for each element (one Yang and one Yin).

For example, a Yang Wood (\uac11, Gap) Day Master is like a great tree. Tall, ambitious, pioneering, and always reaching upward. A Yin Wood (\uc744, Eul) Day Master is like a vine. Flexible, adaptive, and tenacious in a quieter way.

Your Day Master determines how you relate to every other element in your chart through the Ten Gods system, which maps relationships like Wealth, Authority, Seal (support), Output (expression), and Companion (peers).

## The Useful God

Perhaps the most important concept in applied Saju is the Useful God (\uc6a9\uc2e0, Yongshin). This is the element your chart most needs to achieve balance. If your Day Master is too strong, the Useful God is typically an element that drains or controls it. If too weak, the Useful God is one that supports or generates it.

Knowing your Useful God helps guide practical decisions. What colors to wear, what career fields suit you, which directions are favorable, and even which foods support your energy.

## Reading Your Chart

A complete Saju reading examines the interplay of all four pillars, their hidden stems (sub-elements within each branch), special stars (symbolic markers of talent, challenge, or destiny), and luck cycles (10-year periods that shift the energetic landscape of your life).

No single element of the chart tells the full story. The art lies in seeing how all the pieces interact, where clashes create tension, where harmonies create flow, and how the timeline of luck cycles activates different potentials at different ages.

## Saju in Modern Life

Today, millions of Koreans consult Saju for major life decisions. Choosing wedding dates, naming children, evaluating business partnerships, and planning career moves. It is not superstition. It is a structured system of pattern recognition that has been refined over more than a thousand years.

Modern platforms like SajuReading bring this tradition online, combining classical calculation with AI-powered interpretation to make Saju accessible to a global audience.`,
  },
  {
    slug: 'saju-vs-western-astrology',
    title: 'Saju vs Western Astrology: Key Differences Explained',
    excerpt: 'How does Korean Saju compare to Western horoscope astrology? Explore the fundamental differences in calculation, philosophy, and practical application.',
    readTime: '5 min read',
    publishedAt: '2025-02-01',
    content: `If you are familiar with Western astrology (zodiac signs, birth charts, planetary houses), you might wonder how Korean Saju compares. While both systems aim to understand personality and destiny through birth timing, their methods and philosophies differ substantially.

## Basis of Calculation

Western astrology is heliocentric. It maps the positions of planets (Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, and the outer planets) relative to the zodiac constellations at the moment of birth. Your "sign" is determined by where the Sun was positioned.

Saju uses a completely different framework. It does not track planetary positions at all. Instead, it encodes time through the sexagenary cycle, a 60-unit cycle formed by combining 10 Heavenly Stems with 12 Earthly Branches. This system is based on the Chinese calendar and the cycles of the Five Elements, not on astronomy.

## Core Framework

Western astrology has 12 zodiac signs, 12 houses, and various planetary aspects (conjunctions, oppositions, trines). The interpretation revolves around planetary energies and their angular relationships.

Saju has Four Pillars (Year, Month, Day, Hour), each with a Stem and Branch. The analysis centers on the Five Elements (Wood, Fire, Earth, Metal, Water) and how they relate to your Day Master through the Ten Gods system. Special stars, hidden stems, and luck cycles add further layers.

## Time Sensitivity

Western astrology is highly sensitive to the exact minute of birth, since the Ascendant (Rising Sign) changes roughly every two hours and the house system shifts continuously.

Saju divides the day into twelve two-hour periods. While the exact birth time matters, small variations within the same two-hour window produce the same chart. However, the Hour Pillar is optional. Many Saju readings can be done without it, using just the Year, Month, and Day pillars.

## Predictive Methods

Western astrology uses transits (current planetary positions), progressions (symbolic movement of the birth chart), and solar returns for prediction.

Saju uses Luck Cycles (10-year periods called \ub300\uc6b4, Daeun) and Annual Pillars (\uc138\uc6b4, Seun) for prediction. Each luck cycle brings a new Pillar that interacts with the birth chart, activating different potentials. This system makes Saju particularly effective for long-range life planning.

## Cultural Context

Western astrology is deeply embedded in Greco-Roman mythology and Hellenistic philosophy. The planets are named after gods, and their meanings reflect those mythological associations.

Saju is rooted in Daoist cosmology and the Yijing (I Ching). The Five Elements are not abstract symbols but represent fundamental forces of nature. The system reflects an East Asian worldview where harmony, balance, and cyclical change are central principles.

## Practical Application

Both systems offer personality insight and predictive guidance. Western astrology tends to be more psychologically oriented in modern practice, focusing on self-awareness and inner growth.

Saju has a stronger tradition of practical application. Koreans routinely use Saju for choosing wedding dates, naming children, evaluating business partnerships, and career guidance. The concept of the Useful God provides concrete, actionable advice: which elements to seek and which to avoid in daily life.

## Can They Work Together?

Many practitioners find value in both systems. Western astrology offers rich psychological insight through planetary archetypes, while Saju provides a structured elemental framework for practical decision-making. They analyze different aspects of birth timing and can complement each other beautifully.`,
  },
  {
    slug: 'how-to-read-saju-chart',
    title: 'How to Read a Saju Chart: Step-by-Step Tutorial',
    excerpt: 'Learn to interpret your Korean Saju chart from scratch. This tutorial walks through the Four Pillars, element balance, Day Master strength, and Ten Gods.',
    readTime: '8 min read',
    publishedAt: '2025-02-15',
    content: `Reading a Saju chart may seem intimidating at first, with all those Chinese characters and element interactions. But the logic is structured and learnable. This tutorial walks you through the key steps.

## Step 1: Identify Your Four Pillars

Your chart has four pillars arranged from right to left: Year, Month, Day, and Hour. Each pillar has two rows.

The top row is the Heavenly Stem (one of 10 characters). The bottom row is the Earthly Branch (one of 12 characters, each associated with an animal). Together, your four pillars encode the energetic signature of your birth moment.

The Year Pillar represents your social self, your ancestry, and early childhood. The Month Pillar represents your parents, career environment, and ages roughly 15 to 30. The Day Pillar is the most personal. The stem is your Day Master (your core identity), and the branch represents your spouse or closest partner. The Hour Pillar represents your children, your inner thoughts, and your later years.

## Step 2: Find Your Day Master

Look at the Heavenly Stem of your Day Pillar. This is your Day Master, the single most important character in your chart. It defines who you are at the deepest level.

There are ten Day Masters, and each has a distinct personality.

Yang Wood (Gap, \u7532): Like a great tree. Ambitious, upright, and competitive. Yin Wood (Eul, \u4e59): Like a vine. Flexible, diplomatic, and persistent. Yang Fire (Byeong, \u4e19): Like the sun. Warm, optimistic, and generous. Yin Fire (Jeong, \u4e01): Like a candle. Focused, artistic, and intense. Yang Earth (Mu, \u620a): Like a mountain. Stable, authoritative, and dependable. Yin Earth (Gi, \u5df1): Like farmland. Nurturing, practical, and receptive. Yang Metal (Gyeong, \u5e9a): Like a sword. Decisive, just, and forceful. Yin Metal (Sin, \u8f9b): Like a jewel. Refined, precise, and sensitive. Yang Water (Im, \u58ec): Like the ocean. Strategic, flowing, and expansive. Yin Water (Gye, \u7678): Like morning dew. Intuitive, gentle, and perceptive.

## Step 3: Map the Ten Gods

The Ten Gods system tells you how every other element in your chart relates to your Day Master. There are ten relationships, organized into five pairs.

Companion and Rob Wealth are peers of the same element. Eating God and Hurting Officer are your outputs (what you produce). Direct Wealth and Indirect Wealth represent what you control (resources, money). Direct Officer and Seven Killings represent what controls you (authority, discipline). Direct Seal and Indirect Seal represent what supports you (mentors, education).

Each position in your chart (stems and branches of all four pillars) will have a Ten God label. The distribution tells you which life themes are dominant. Many Wealth gods suggest financial focus. Many Seal gods suggest academic or spiritual orientation.

## Step 4: Assess Element Balance

Count how much of each element appears in your chart, considering both the visible stems and branches and the hidden stems within each branch. Every earthly branch contains one to three hidden stems that contribute additional elemental weight.

A balanced chart has all five elements reasonably represented. Most charts are not perfectly balanced, and the imbalance reveals both strengths and vulnerabilities.

## Step 5: Determine Day Master Strength

Is your Day Master strong or weak? This depends on how much support it receives from the rest of the chart.

Supporting factors include elements that are the same as or generate the Day Master, seasonal strength (the month of birth determines which element is in season), and support from hidden stems.

Draining factors include elements that the Day Master generates, controls, or is controlled by.

A strong Day Master can handle challenges and take on responsibilities. A weak Day Master needs support and nurturing. Extremely strong or extremely weak Day Masters follow special rules (called "following the flow" patterns).

## Step 6: Find Your Useful God

Based on the Day Master strength and element balance, determine the Useful God, the element your chart most needs.

If your Day Master is strong, the Useful God is typically an element that drains it (Wealth, Authority, or Output). If weak, it is an element that strengthens it (Seal or Companion). This concept has immediate practical applications for daily life choices.

## Step 7: Read the Luck Cycles

The final step is examining the Luck Cycles, 10-year periods that begin at a specific age (calculated from the distance between your birth date and the next seasonal node). Each luck cycle brings a new Pillar that overlays your birth chart, activating different Ten Gods and element interactions.

When a luck cycle brings your Useful God, that decade tends to be favorable. When it brings the Jealousy God (the element opposing your Useful God), challenges arise. Understanding your current and upcoming luck cycles provides a roadmap for life planning.

## Putting It All Together

Reading a Saju chart is like reading a story. The Four Pillars set the stage. The Day Master is the protagonist. The Ten Gods are the supporting characters. The element balance is the landscape. And the luck cycles are the plot, unfolding across decades.

No single element tells the whole story. The art is in seeing the connections, the tensions, and the opportunities within the whole picture. With practice, these patterns become intuitive, and the chart reveals its wisdom.`,
  },
  {
    slug: 'five-elements-explained',
    title: 'The Five Elements in Saju: Wood, Fire, Earth, Metal, Water',
    excerpt: 'A deep dive into the Five Elements that form the foundation of Korean Saju. Learn their meanings, cycles, and how they shape your personality and destiny.',
    readTime: '5 min read',
    publishedAt: '2025-03-01',
    content: `The Five Elements are the foundation of Saju. Everything in a chart, every calculation, every interpretation, flows from the interactions between Wood, Fire, Earth, Metal, and Water.

## Wood

Wood represents growth, expansion, and new beginnings. Like a tree pushing through soil toward sunlight, Wood energy is upward and outward. People with strong Wood in their chart are often ambitious, competitive, and innovative. They need room to grow and do not thrive in rigid environments.

Wood is associated with spring, the color green, the direction East, the liver and gallbladder in health, and the emotion of anger (or passionate drive when channeled well).

## Fire

Fire represents visibility, transformation, and connection. It is the most social of the elements. Fire energy is bright, warm, and radiant. Strong Fire people are charismatic, expressive, and often drawn to leadership or creative roles. They light up a room but can burn out without careful management.

Fire is associated with summer, the colors red and purple, the direction South, the heart and small intestine in health, and the emotion of joy (or anxiety when excessive).

## Earth

Earth represents stability, nurturing, and center. It is the grounding force among the elements. Earth energy is steady, reliable, and patient. People with dominant Earth are often the dependable anchors in their families and workplaces. They excel in roles requiring trustworthiness and follow-through.

Earth is associated with the transitions between seasons (especially late summer), yellow and brown colors, the Center direction, the spleen and stomach in health, and the emotion of pensiveness or worry.

## Metal

Metal represents discipline, refinement, and clarity. Like a blade being forged, Metal energy is sharp, precise, and cutting. Strong Metal people tend to be organized, principled, and detail-oriented. They value justice and can be excellent in roles requiring precision, from law to engineering to finance.

Metal is associated with autumn, white and silver colors, the direction West, the lungs and large intestine in health, and the emotion of grief (or dignified release).

## Water

Water represents wisdom, depth, and adaptability. Like a river finding its way around obstacles, Water energy is flowing, strategic, and deep. People with strong Water are often intuitive, intellectual, and resourceful. They excel in roles requiring strategic thinking and emotional intelligence.

Water is associated with winter, black and dark blue colors, the direction North, the kidneys and bladder in health, and the emotion of fear (or healthy respect and caution).

## The Generating Cycle

The elements support each other in a specific order. Wood feeds Fire (fuel). Fire creates Earth (ash and minerals). Earth produces Metal (ore). Metal collects Water (condensation on metal surfaces). Water nourishes Wood (plants need water). This cycle explains why certain elements in your chart strengthen others.

## The Controlling Cycle

The elements also restrain each other. Wood penetrates Earth (roots break soil). Earth dams Water (riverbanks). Water extinguishes Fire. Fire melts Metal. Metal chops Wood. This cycle creates the tension and discipline needed for growth. Without some control, any element runs wild.

Understanding these two cycles is the master key to reading any Saju chart and making practical decisions based on your elemental needs.`,
  },
  {
    slug: 'luck-cycles-guide',
    title: 'Understanding Luck Cycles in Saju: Your Decade-by-Decade Roadmap',
    excerpt: 'Luck cycles are the predictive backbone of Saju. Learn how these 10-year periods shape your life and how to navigate favorable and challenging decades.',
    readTime: '6 min read',
    publishedAt: '2025-03-15',
    content: `One of the most powerful aspects of Saju is its system of Luck Cycles, called Daeun (\ub300\uc6b4) in Korean. These are 10-year periods that overlay your birth chart, each bringing a new Pillar with its own Heavenly Stem and Earthly Branch. They provide a decade-by-decade roadmap of the energetic themes you will encounter.

## How Luck Cycles Are Calculated

Your luck cycles are derived from your Month Pillar, your gender, and the Yin/Yang polarity of your Year Stem. For a male born in a Yang year (or female in a Yin year), the cycles progress forward through the sexagenary cycle. For the opposite combinations, they progress backward.

The starting age of your first luck cycle is calculated from the number of days between your birth date and the next seasonal node (if progressing forward) or the previous one (if backward). Roughly three days equal one year, so if there are 15 days between your birth and the seasonal node, your first luck cycle begins at age 5.

## Reading Your Current Cycle

Each luck cycle brings a Pillar (Stem + Branch) that interacts with your birth chart. The Stem influences the first five years of the decade, and the Branch dominates the second five years.

When the cycle's element aligns with your Useful God, that decade tends to bring opportunity, growth, and flow. Career advances, good relationships, and financial gains are more likely.

When the cycle brings your Jealousy God (the element that opposes your Useful God), that decade tends to bring challenges: career setbacks, relationship friction, or health concerns.

## The Ten Gods in Luck Cycles

Each luck cycle's Stem and Branch produce Ten God relationships with your Day Master. These tell you what themes will be prominent.

A Wealth cycle may bring financial opportunities but also financial pressure. An Officer cycle may bring career advancement but also increased responsibility and scrutiny. A Seal cycle may bring support, education, or spiritual growth. A Companion cycle may bring peer connections but also competition. An Output cycle may bring creative expression but also exhaustion if overextended.

## Favorable vs Challenging Cycles

No cycle is entirely good or bad. Even "challenging" cycles provide growth opportunities, and even "favorable" cycles require effort to capitalize on. The key is understanding what each cycle demands.

During favorable cycles, take bold action. Launch projects, invest, expand. During challenging cycles, consolidate, protect your resources, focus on health, and build the foundation for the next favorable period.

## Transition Between Cycles

The transition from one luck cycle to the next (usually happening within a year of the changeover age) can be turbulent. Major life changes, relocations, career shifts, and relationship changes often coincide with luck cycle transitions.

Being aware of your transition years helps you prepare mentally and practically. It is one of the most practically useful aspects of Saju prediction.

## Annual and Monthly Layers

Beyond the 10-year luck cycles, each year brings its own Annual Pillar (Seun) and each month its own Monthly Pillar. These create shorter-term variations within the larger luck cycle framework. A challenging luck cycle might have some excellent individual years within it, and vice versa.

The most auspicious periods occur when the luck cycle, annual pillar, and monthly pillar all align favorably with your chart. The most challenging periods occur when multiple layers are unfavorable simultaneously.`,
  },
  {
    slug: 'saju-for-relationships',
    title: 'Using Saju for Relationship Compatibility',
    excerpt: 'How Korean Saju evaluates romantic compatibility between two charts. Learn about element harmony, Day Master interactions, and the traditional compatibility check.',
    readTime: '5 min read',
    publishedAt: '2025-04-01',
    content: `One of the most popular applications of Saju in Korea is relationship compatibility analysis, traditionally called Gunghap (\uad81\ud569). Families have consulted Saju masters about marriage compatibility for centuries, and the practice remains common today.

## Day Master Compatibility

The most important factor is how the two Day Masters interact. The five types of element relationships each create different dynamics.

Same element Day Masters (both Wood, both Fire, etc.) understand each other deeply but may compete for the same resources. Generating pairs (one's element feeds the other's) create a nurturing but potentially one-sided dynamic. Controlling pairs create tension and passion but also potential conflict if the controlling energy is too strong.

The ideal relationship in Saju is not the absence of tension but the presence of complementary balance. Some clash creates growth. Pure harmony can create stagnation.

## Element Balance Between Charts

Beyond the Day Masters, a compatibility analysis looks at how the overall element balance of both charts interacts. Ideally, what one chart lacks, the other provides.

If Person A has very little Water and Person B has strong Water, they naturally complement each other. Person B provides the depth, wisdom, and flexibility that Person A needs, while Person A might provide the structure or warmth that Person B's chart requires.

## Branch Interactions

The Earthly Branches of both charts are examined for harmonies and clashes. Certain branch combinations create Three Harmony or Six Harmony relationships, indicating natural affinity. Other combinations create Six Clashes or Punishments, indicating friction points.

The Day Branch is particularly important because in Saju, the Day Branch traditionally represents your spouse. If your Day Branch forms a harmony with your partner's Day Branch, this is a very favorable sign. If they clash, it indicates areas requiring conscious effort and communication.

## Practical Application

In traditional Korean culture, families would compare the Saju charts of a prospective couple before approving a marriage. While this practice is less rigid today, many Koreans still check compatibility as one factor in their decision-making.

Modern compatibility analysis focuses less on "yes or no" verdicts and more on understanding the dynamics. Where will this couple naturally complement each other? Where will friction arise? What elements should they introduce into their shared environment to support balance?

A high compatibility score does not guarantee a successful relationship, and a low score does not doom one. But understanding the elemental dynamics gives couples a framework for navigating their differences with awareness and intention.`,
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find(post => post.slug === slug);
}

export function getAllPosts(): BlogPost[] {
  return BLOG_POSTS;
}
