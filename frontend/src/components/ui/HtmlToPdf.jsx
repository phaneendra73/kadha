/* eslint-disable react/prop-types */
import { useState } from 'react';
import { Button } from '@chakra-ui/react';

const HtmlToPdf = ({
  contentSelector = '.chakra-container',
  filename = 'document.pdf',
}) => {
  const [isConverting, setIsConverting] = useState(false);

  const convertToPdf = () => {
    setIsConverting(true);

    // Get the HTML content
    const content = document.querySelector(contentSelector);

    if (!content) {
      alert('No content found to convert');
      setIsConverting(false);
      return;
    }

    // Clone the content to avoid modifying the original
    const contentClone = content.cloneNode(true);

    // Process images in the clone to ensure they do not exceed 50% of the page height
    const images = contentClone.querySelectorAll('img');
    images.forEach((img) => {
      // Set max dimensions for images
      img.style.maxWidth = '100%'; // Allow images to take the full width of their container
      img.style.maxHeight = '10vh'; // Limit image height to 50% of the viewport height (50vh)
      img.style.objectFit = 'contain'; // Make sure images are scaled proportionally

      // Add image attribution if not present
      if (!img.getAttribute('alt')) {
        img.setAttribute('alt', 'Document Image');
      }
    });

    // Remove any Table of Contents elements
    const tocElements = contentClone.querySelectorAll(
      '.table-of-contents, .toc, nav[role="navigation"]'
    );
    tocElements.forEach((toc) => toc.remove());

    // Create a new window for printing
    const printWindow = window.open('', '_blank');

    if (!printWindow) {
      alert('Please allow popups for this website');
      setIsConverting(false);
      return;
    }

    // Get current date for footer
    const currentDate = new Date().toLocaleDateString();

    // Create styled content for the print window
    const styledHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${filename}</title>
        <style>
          @page {
            size: A4;
            margin: 1.5cm;
          }
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
          }
          .header {
            position: running(header);
            text-align: center;
            padding-bottom: 10px;
            border-bottom: 1px solid #eee;
          }
          .footer {
            position: running(footer);
            text-align: center;
            padding-top: 10px;
            border-top: 1px solid #eee;
            font-size: 12px;
            color: #666;
          }
          .page-content {
            padding: 20px 0;
          }
          h1 {
            color: #2c3e50;
            border-bottom: 2px solid #3498db;
            padding-bottom: 10px;
          }
          h2, h3, h4, h5, h6 {
            color: #2c3e50;
            margin-top: 20px;
          }
          p {
            margin-bottom: 16px;
          }
          ul, ol {
            padding-left: 20px;
            margin-bottom: 15px;
          }
          li {
            margin-bottom: 5px;
          }
          pre, code {
            background-color: #f5f5f5;
            border-radius: 3px;
            padding: 2px 5px;
            font-family: monospace;
            font-size: 14px;
            overflow-x: hidden;
            white-space: pre-wrap;
          }
          pre {
            padding: 10px;
          }
          blockquote {
            border-left: 4px solid #3498db;
            padding-left: 15px;
            margin-left: 0;
            color: #555;
          }
          img {
            display: block;
            margin: 20px auto;
            page-break-inside: avoid;
          }
          table {
            border-collapse: collapse;
            width: 100%;
            margin-bottom: 20px;
            page-break-inside: avoid;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
          }
          a {
            color: #3498db;
            text-decoration: none;
          }
          /* Ensure page breaks don't occur in the middle of elements */
          h1, h2, h3, h4, h5, h6, img, table {
            page-break-after: avoid;
            page-break-inside: avoid;
          }
          .page-break {
            page-break-after: always;
          }
          @page {
            @top-center { content: element(header) }
            @bottom-center { content: element(footer) }
          }
          @media print {
            button {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          ${document.title || window.location.hostname}
        </div>
        <div class="page-content">
          ${contentClone.innerHTML}
        </div>
        <div class="footer">
           ${currentDate} | ${filename}
        </div>
        <script>
          // Automatically number pages
          (function() {
            let pages = 0;
            const pageElements = document.querySelectorAll('.pageNumber');
            
            window.onload = function() {
              // Force images to load before printing
              const images = document.querySelectorAll('img');
              let imagesLoaded = 0;
              
              if (images.length === 0) {
                preparePrint();
                return;
              }
              
              images.forEach(img => {
                if (img.complete) {
                  imagesLoaded++;
                  if (imagesLoaded === images.length) {
                    preparePrint();
                  }
                } else {
                  img.onload = function() {
                    imagesLoaded++;
                    if (imagesLoaded === images.length) {
                      preparePrint();
                    }
                  };
                  
                  // Fallback if image fails to load
                  img.onerror = function() {
                    imagesLoaded++;
                    if (imagesLoaded === images.length) {
                      preparePrint();
                    }
                  };
                }
              });
            };
            
            function preparePrint() {
              // Process links to download instead of navigate
              const links = document.querySelectorAll('a');
              links.forEach(link => {
                const href = link.getAttribute('href');
                if (href && !href.startsWith('#')) {
                  link.setAttribute('download', '');
                }
              });
              
              setTimeout(function() {
                window.print();
                window.onafterprint = function() {
                  window.close();
                };
              }, 1000);
            }
          })();
        </script>
      </body>
      </html>
    `;

    // Write to the new window
    printWindow.document.write(styledHtml);
    printWindow.document.close();

    // Reset state after a timeout in case printing fails
    setTimeout(() => {
      setIsConverting(false);
    }, 5000);
  };

  return (
    <div className='pdf-container'>
      <Button onClick={convertToPdf} disabled={isConverting} size={'xs'}>
        {isConverting ? 'Processing...' : 'Download as PDF'}
      </Button>
    </div>
  );
};

export default HtmlToPdf;
