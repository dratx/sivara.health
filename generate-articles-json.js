const fs = require('fs');
const path = require('path');

const articlesDir = path.join(__dirname, 'content', 'articles');
const outputFile = path.join(articlesDir, 'articles.json');

function parseFrontmatter(content) {
  const match = content.match(/---([\s\S]*?)---/);
  if (!match) return null;
  const frontmatter = {};
  match[1].trim().split('\n').forEach(line => {
    const [key, ...valueParts] = line.split(':');
    if (!key) return;
    const value = valueParts.join(':').trim().replace(/^"(.*)"$/, '$1');
    frontmatter[key.trim()] = value;
  });
  return frontmatter;
}

function main() {
  const files = fs.readdirSync(articlesDir).filter(f => f.endsWith('.md'));
  const articles = [];
  for (const file of files) {
    const filePath = path.join(articlesDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const frontmatter = parseFrontmatter(content);
    if (frontmatter) {
      articles.push({
        slug: file.replace(/\.md$/, ''),
        title: frontmatter.title || '',
        date: frontmatter.date || '',
        summary: frontmatter.summary || '',
        hero: frontmatter.hero || '',
        category: frontmatter.category || 'General',
      });
    }
  }
  // Sort by date descending
  articles.sort((a, b) => new Date(b.date) - new Date(a.date));
  fs.writeFileSync(outputFile, JSON.stringify(articles, null, 2));
  console.log(`Wrote ${articles.length} articles to ${outputFile}`);
}

main(); 