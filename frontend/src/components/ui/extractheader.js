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
      let text = match[2].trim(); // Heading text

      // Remove any HTML tags from the text (like <strong>, <em>, etc.)
      text = text.replace(/<\/?[^>]+(>|$)/g, '');

      // Clean up the heading text further to remove unwanted characters like periods
      const cleanedText = text.replace(/[^\w\s-]/g, ''); // Remove non-alphanumeric characters except spaces and hyphens
      const id = cleanedText.toLowerCase().replace(/\s+/g, '-'); // Generate a slug-like ID

      // Add to the list of headings
      headings.push({ level, text, id });
    }

    return headings;
  } catch (error) {
    console.error('Error extracting headers:', error);
    return [];
  }
};
