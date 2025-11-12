// Ingredient parsing utility for social media-style recipe creation

interface ParsedIngredient {
  quantity: number;
  unit: string;
  name: string;
  notes?: string;
}

// Common cooking units and their variations
const UNIT_PATTERNS = {
  // Volume
  'cup': ['cup', 'cups', 'c'],
  'tbsp': ['tablespoon', 'tablespoons', 'tbsp', 'tbs', 'T'],
  'tsp': ['teaspoon', 'teaspoons', 'tsp', 't'],
  'ml': ['milliliter', 'milliliters', 'ml', 'mL'],
  'l': ['liter', 'liters', 'l', 'L'],
  'fl-oz': ['fluid ounce', 'fluid ounces', 'fl oz', 'fl. oz'],
  
  // Weight
  'g': ['gram', 'grams', 'g'],
  'kg': ['kilogram', 'kilograms', 'kg'],
  'oz': ['ounce', 'ounces', 'oz'],
  'lb': ['pound', 'pounds', 'lbs', 'lb'],
  
  // Count
  'piece': ['piece', 'pieces', 'pc', 'pcs'],
  'slice': ['slice', 'slices'],
  'clove': ['clove', 'cloves'],
  'bunch': ['bunch', 'bunches']
};

// Fraction patterns
const FRACTION_PATTERNS: Record<string, number> = {
  '1/2': 0.5,
  '½': 0.5,
  '1/3': 0.33,
  '⅓': 0.33,
  '2/3': 0.67,
  '⅔': 0.67,
  '1/4': 0.25,
  '¼': 0.25,
  '3/4': 0.75,
  '¾': 0.75,
  '1/8': 0.125,
  '⅛': 0.125,
  '3/8': 0.375,
  '⅜': 0.375,
  '5/8': 0.625,
  '⅝': 0.625,
  '7/8': 0.875,
  '⅞': 0.875
};

function normalizeUnit(unit: string): string {
  const lowerUnit = unit.toLowerCase().replace(/[.,]/g, '');
  
  for (const [standardUnit, variations] of Object.entries(UNIT_PATTERNS)) {
    if (variations.includes(lowerUnit)) {
      return standardUnit;
    }
  }
  
  return unit; // Return original if no match found
}

function parseQuantity(quantityStr: string): number {
  // Handle fractions first
  for (const [fraction, value] of Object.entries(FRACTION_PATTERNS)) {
    if (quantityStr.includes(fraction)) {
      const beforeFraction = quantityStr.split(fraction)[0].trim();
      const wholeNumber = beforeFraction ? parseFloat(beforeFraction) : 0;
      return wholeNumber + value;
    }
  }
  
  // Handle decimal numbers and whole numbers
  const number = parseFloat(quantityStr);
  return isNaN(number) ? 1 : number;
}

function extractNotes(text: string): { cleanText: string; notes?: string } {
  // Common note patterns in parentheses or with keywords
  const notePatterns = [
    /\((.*?)\)/g, // Anything in parentheses
    /, (finely chopped|chopped|diced|sliced|minced|grated|fresh|dried|room temperature|softened)/gi,
    /, (plus extra for .*)/gi
  ];
  
  let notes: string[] = [];
  let cleanText = text;
  
  for (const pattern of notePatterns) {
    const matches = [...text.matchAll(pattern)];
    matches.forEach(match => {
      notes.push(match[1] || match[0]);
      cleanText = cleanText.replace(match[0], '').trim();
    });
  }
  
  // Clean up extra commas and spaces
  cleanText = cleanText.replace(/,\s*$/, '').replace(/,\s*,/g, ',').trim();
  
  return {
    cleanText,
    notes: notes.length > 0 ? notes.join(', ') : undefined
  };
}

function parseIngredientLine(line: string): ParsedIngredient | null {
  if (!line.trim()) return null;
  
  // Remove common prefixes like bullet points, numbers, etc.
  const cleanLine = line.replace(/^[-•*]\s*/, '').replace(/^\d+\.\s*/, '').trim();
  
  if (!cleanLine) return null;
  
  // Extract notes first
  const { cleanText, notes } = extractNotes(cleanLine);
  
  // Regex to match quantity, unit, and ingredient name
  // Examples: "2 cups flour", "1/2 tsp salt", "3 large eggs"
  const ingredientRegex = /^(\d+(?:\.\d+)?|\d*\s*[½⅓⅔¼¾⅛⅜⅝⅞]|\d+\/\d+)\s*([a-zA-Z\s]+?)?\s+(.+)$/;
  
  const match = cleanText.match(ingredientRegex);
  
  if (match) {
    const [, quantityStr, unitStr = '', nameStr] = match;
    
    return {
      quantity: parseQuantity(quantityStr),
      unit: normalizeUnit(unitStr.trim()) || 'piece',
      name: nameStr.trim(),
      notes
    };
  }
  
  // Fallback: treat as ingredient name with quantity 1
  return {
    quantity: 1,
    unit: 'piece',
    name: cleanText,
    notes
  };
}

export function parseIngredients(text: string): ParsedIngredient[] {
  if (!text.trim()) return [];
  
  // Split by line breaks and filter empty lines
  const lines = text.split(/\n/).map(line => line.trim()).filter(Boolean);
  
  const ingredients: ParsedIngredient[] = [];
  
  for (const line of lines) {
    const parsed = parseIngredientLine(line);
    if (parsed) {
      ingredients.push(parsed);
    }
  }
  
  return ingredients;
}

export function formatIngredientForDisplay(ingredient: ParsedIngredient): string {
  const { quantity, unit, name, notes } = ingredient;
  
  let formatted = '';
  
  // Format quantity
  if (quantity % 1 === 0) {
    formatted += quantity.toString();
  } else {
    // Try to convert to fraction for display
    const fractionEntry = Object.entries(FRACTION_PATTERNS).find(([, value]) => 
      Math.abs(value - (quantity % 1)) < 0.01
    );
    
    if (fractionEntry && quantity >= 1) {
      formatted += Math.floor(quantity) + fractionEntry[0];
    } else if (fractionEntry && quantity < 1) {
      formatted += fractionEntry[0];
    } else {
      formatted += quantity.toString();
    }
  }
  
  // Add unit if not 'piece'
  if (unit !== 'piece') {
    formatted += ` ${unit}`;
  }
  
  // Add ingredient name
  formatted += ` ${name}`;
  
  // Add notes if present
  if (notes) {
    formatted += ` (${notes})`;
  }
  
  return formatted;
}

// Example usage and test cases
export const EXAMPLE_INGREDIENT_TEXT = `2 cups all-purpose flour
1/2 tsp salt
1 cup butter (softened)
3/4 cup brown sugar
2 large eggs (room temperature)
1 tsp vanilla extract
1.5 cups chocolate chips
Pinch of baking soda`;

// For testing the parser
export function testIngredientParser() {
  console.log('Testing ingredient parser:');
  const parsed = parseIngredients(EXAMPLE_INGREDIENT_TEXT);
  parsed.forEach(ingredient => {
    console.log(ingredient);
    console.log('Formatted:', formatIngredientForDisplay(ingredient));
  });
}