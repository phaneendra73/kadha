import { remark } from 'remark';
import remarkHtml from 'remark-html';

export const extractHeaders = async (markdown) => {
  try {
    // Convert Markdown to HTML using remark
    const file = await remark().use(remarkHtml).process(markdown);

    // The HTML content
    const htmlContent = String(file);

    // Regular expression to match the headings (h1 to h6)
    const headingRegex = /<h([1-6])>(.*?)<\/h\1>/g;

    const headings = [];
    let match;

    // Find all headings using the regular expression
    while ((match = headingRegex.exec(htmlContent)) !== null) {
      const level = parseInt(match[1]); // Heading level (h1, h2, etc.)
      const text = match[2].trim(); // Heading text
      const id = text.toLowerCase().replace(/\s+/g, '-'); // Generate a slug-like ID

      // Add to the list of headings
      headings.push({ level, text, id });
    }

    return headings;
  } catch (error) {
    console.error('Error extracting headers:', error);
    return [];
  }
};
