
export function stripHtmlTags(html: string): string {
  // Create a temporary div element to help strip HTML tags
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  return tempDiv.textContent || tempDiv.innerText || '';
}
