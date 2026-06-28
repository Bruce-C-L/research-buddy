const QUOTES = [
  {
    text: '科学的灵感，决不是坐等可以等来的。如果说，科学上的发现有什么偶然的机遇的话，那么这种"偶然的机遇"只能给那些有素养的人，给那些善于独立思考的人，给那些具有锲而不舍的精神的人，而不会给懒汉。',
    author: '华罗庚',
    category: '坚持',
  },
  {
    text: 'The important thing is not to stop questioning. Curiosity has its own reason for existence.',
    author: 'Albert Einstein',
    category: '探索',
  },
  {
    text: 'I have not failed. I\'ve just found 10,000 ways that won\'t work.',
    author: 'Thomas Edison',
    category: '坚持',
  },
  {
    text: 'Research is formalized curiosity. It is poking and prying with a purpose.',
    author: 'Zora Neale Hurston',
    category: '探索',
  },
  {
    text: '千里之行，始于足下。',
    author: '老子',
    category: '坚持',
  },
  {
    text: 'The scientist is not a person who gives the right answers, he is one who asks the right questions.',
    author: 'Claude Lévi-Strauss',
    category: '探索',
  },
  {
    text: 'Success is not final, failure is not fatal: it is the courage to continue that counts.',
    author: 'Winston Churchill',
    category: '坚持',
  },
  {
    text: 'The best way to predict the future is to invent it.',
    author: 'Alan Kay',
    category: '探索',
  },
  {
    text: '学而不思则罔，思而不学则殆。',
    author: '孔子',
    category: '探索',
  },
  {
    text: 'It does not matter how slowly you go as long as you do not stop.',
    author: 'Confucius',
    category: '坚持',
  },
  {
    text: 'The only way to do great work is to love what you do.',
    author: 'Steve Jobs',
    category: '坚持',
  },
  {
    text: 'In the middle of difficulty lies opportunity.',
    author: 'Albert Einstein',
    category: '探索',
  },
  {
    text: '路漫漫其修远兮，吾将上下而求索。',
    author: '屈原',
    category: '探索',
  },
  {
    text: 'The secret of getting ahead is getting started.',
    author: 'Mark Twain',
    category: '坚持',
  },
  {
    text: '科研的道路上没有平坦的大道，只有不畏劳苦沿着陡峭山路攀登的人，才有希望到达光辉的顶点。',
    author: '马克思',
    category: '坚持',
  },
]

export function getRandomQuote() {
  return QUOTES[Math.floor(Math.random() * QUOTES.length)]
}

export function getQuotesByCategory(category: string) {
  return QUOTES.filter((q) => q.category === category)
}

export { QUOTES }
