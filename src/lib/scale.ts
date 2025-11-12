// lib/scale.ts
export type Unit = 
  | 'g' | 'kg' | 'mg' | 'oz' | 'lb'
  | 'ml' | 'l' | 'cup' | 'tbsp' | 'tsp' | 'fl-oz'
  | 'piece' | 'slice' | 'clove' | 'bunch';

export type UnitType = 'weight' | 'volume' | 'count';

export interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: Unit;
  notes?: string;
}

export interface ScaledIngredient extends Ingredient {
  originalQuantity: number;
  scaleFactor: number;
}

// Conversion factors to base units (grams for weight, ml for volume)
const UNIT_CONVERSIONS: Record<Unit, { type: UnitType; factor: number }> = {
  // Weight (base: grams)
  'mg': { type: 'weight', factor: 0.001 },
  'g': { type: 'weight', factor: 1 },
  'kg': { type: 'weight', factor: 1000 },
  'oz': { type: 'weight', factor: 28.3495 },
  'lb': { type: 'weight', factor: 453.592 },
  
  // Volume (base: ml)
  'ml': { type: 'volume', factor: 1 },
  'l': { type: 'volume', factor: 1000 },
  'tsp': { type: 'volume', factor: 4.92892 },
  'tbsp': { type: 'volume', factor: 14.7868 },
  'fl-oz': { type: 'volume', factor: 29.5735 },
  'cup': { type: 'volume', factor: 236.588 },
  
  // Count (no conversion)
  'piece': { type: 'count', factor: 1 },
  'slice': { type: 'count', factor: 1 },
  'clove': { type: 'count', factor: 1 },
  'bunch': { type: 'count', factor: 1 },
};

export function getUnitType(unit: Unit): UnitType {
  return UNIT_CONVERSIONS[unit].type;
}

export function convertUnit(
  quantity: number,
  fromUnit: Unit,
  toUnit: Unit
): number {
  const fromConversion = UNIT_CONVERSIONS[fromUnit];
  const toConversion = UNIT_CONVERSIONS[toUnit];
  
  if (fromConversion.type !== toConversion.type) {
    throw new Error(`Cannot convert between ${fromConversion.type} and ${toConversion.type}`);
  }
  
  if (fromConversion.type === 'count') {
    return quantity; // Count units don't scale
  }
  
  // Convert to base unit, then to target unit
  const baseQuantity = quantity * fromConversion.factor;
  return baseQuantity / toConversion.factor;
}

export function scaleIngredients(
  ingredients: Ingredient[],
  baseServings: number,
  targetServings: number
): ScaledIngredient[] {
  if (baseServings <= 0 || targetServings <= 0) {
    throw new Error('Servings must be positive numbers');
  }
  
  const scaleFactor = targetServings / baseServings;
  
  return ingredients.map(ingredient => {
    const scaledQuantity = ingredient.quantity * scaleFactor;
    const roundedQuantity = roundToReasonablePrecision(scaledQuantity, ingredient.unit);
    
    return {
      ...ingredient,
      quantity: roundedQuantity,
      originalQuantity: ingredient.quantity,
      scaleFactor,
    };
  });
}

function roundToReasonablePrecision(quantity: number, unit: Unit): number {
  const unitInfo = UNIT_CONVERSIONS[unit];
  
  // Count units: round to nearest whole number
  if (unitInfo.type === 'count') {
    return Math.round(quantity);
  }
  
  // Small quantities: round to 2 decimal places
  if (quantity < 1) {
    return Math.round(quantity * 100) / 100;
  }
  
  // Medium quantities: round to 1 decimal place
  if (quantity < 10) {
    return Math.round(quantity * 10) / 10;
  }
  
  // Large quantities: round to nearest whole number
  return Math.round(quantity);
}

// Utility for recipe display
export function formatIngredientQuantity(
  quantity: number,
  unit: Unit,
  showFractions = true
): string {
  if (showFractions && quantity < 1 && quantity > 0) {
    return formatAsFraction(quantity);
  }
  
  if (quantity % 1 === 0) {
    return quantity.toString();
  }
  
  return quantity.toFixed(quantity < 10 ? 1 : 0);
}

function formatAsFraction(decimal: number): string {
  const fractions: Record<string, string> = {
    '0.125': '⅛',
    '0.25': '¼',
    '0.33': '⅓',
    '0.5': '½',
    '0.67': '⅔',
    '0.75': '¾',
  };
  
  const rounded = Math.round(decimal * 8) / 8; // Round to nearest 1/8
  const fractionStr = fractions[rounded.toString()];
  
  return fractionStr || decimal.toFixed(2);
}