export default class SVGIdProcessor {
  constructor(options = {}) {
    this.options = {
      prefix: options.prefix || '',
      cleanName: options.cleanName || 'framemask_1',
      ...options
    };
  }

  process(svgContent) {
    // First fix the amemask_ tag to clipPath (both opening and closing tags)
    let processedContent = svgContent
      .replace(/<amemask_/g, '<clipPath')
      .replace(/<\/amemask_>/g, '</clipPath>');
    
    // Pattern to match any framemask with random numbers: framemask_[numbers]_
    const framemaskPattern = /framemask_\d+_/g;
    const foundIds = new Set();
    
    // Find all framemask IDs in the content
    let match;
    let contentToSearch = processedContent;
    
    while ((match = framemaskPattern.exec(contentToSearch)) !== null) {
      foundIds.add(match[0]);
    }

    if (foundIds.size === 0) {
      console.log('No framemask IDs found to process');
      return processedContent;
    }
    
    // Replace each found framemask ID
    foundIds.forEach((originalId, index) => {
      const cleanId = foundIds.size === 1 
        ? this.options.cleanName 
        : `${this.options.cleanName.replace('_1', '')}_${index + 1}`;
      
      console.log(`Replacing ${originalId} with ${cleanId}`);
      
      // Escape special regex characters in the original ID
      const escapedId = originalId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      
      // Replace in all contexts where this ID appears
      const replacements = [
        // clipPath id attribute
        { 
          pattern: new RegExp(`id="${escapedId}"`, 'g'),
          replacement: `id="${cleanId}"`
        },
        // url() references in clip-path
        { 
          pattern: new RegExp(`url\\(#${escapedId}\\)`, 'g'),
          replacement: `url(#${cleanId})`
        },
        // xlink:href references
        { 
          pattern: new RegExp(`xlink:href="#${escapedId}"`, 'g'),
          replacement: `xlink:href="#${cleanId}"`
        }
      ];
      
      replacements.forEach(({ pattern, replacement }) => {
        processedContent = processedContent.replace(pattern, replacement);
      });
    });

    return processedContent;
  }
}
