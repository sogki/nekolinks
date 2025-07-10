export async function fetchLinkMetadata(url: string): Promise<{ title: string; favicon?: string }> {
  try {
    // For demo purposes, we'll use a simple approach
    // In production, you'd want to use a service like Linkpreview.net or similar
    const response = await fetch(`https://api.linkpreview.net/?key=demo&q=${encodeURIComponent(url)}`);
    const data = await response.json();
    
    if (data.title) {
      return {
        title: data.title,
        favicon: data.image || `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=64`,
      };
    }
  } catch (error) {
    console.error('Error fetching link metadata:', error);
  }
  
  // Fallback to domain name and favicon
  try {
    const domain = new URL(url).hostname;
    return {
      title: domain,
      favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
    };
  } catch {
    return {
      title: url,
    };
  }
}

export function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
}

export function extractTags(text: string): string[] {
  const tagRegex = /#(\w+)/g;
  const matches = text.match(tagRegex);
  return matches ? matches.map(tag => tag.substring(1)) : [];
}