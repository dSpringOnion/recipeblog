// lib/scale.test.ts
import {
  scaleIngredients,
  convertUnit,
  getUnitType,
  formatIngredientQuantity,
  type Ingredient,
} from './scale';

describe('Ingredient Scaling Engine', () => {
  const mockIngredients: Ingredient[] = [
    { id: '1', name: 'Flour', quantity: 500, unit: 'g' },
    { id: '2', name: 'Milk', quantity: 1, unit: 'cup' },
    { id: '3', name: 'Eggs', quantity: 2, unit: 'piece' },
    { id: '4', name: 'Salt', quantity: 0.5, unit: 'tsp' },
  ];

  describe('scaleIngredients', () => {
    it('should scale ingredients correctly for double servings', () => {
      const result = scaleIngredients(mockIngredients, 4, 8);
      
      expect(result).toHaveLength(4);
      expect(result[0].quantity).toBe(1000); // 500g * 2
      expect(result[1].quantity).toBe(2); // 1 cup * 2
      expect(result[2].quantity).toBe(4); // 2 pieces * 2
      expect(result[3].quantity).toBe(1); // 0.5 tsp * 2
    });

    it('should scale ingredients correctly for half servings', () => {
      const result = scaleIngredients(mockIngredients, 4, 2);
      
      expect(result[0].quantity).toBe(250); // 500g / 2
      expect(result[1].quantity).toBe(0.5); // 1 cup / 2
      expect(result[2].quantity).toBe(1); // 2 pieces / 2 (rounded)
      expect(result[3].quantity).toBe(0.25); // 0.5 tsp / 2
    });

    it('should preserve original quantities and scale factor', () => {
      const result = scaleIngredients(mockIngredients, 4, 6);
      
      result.forEach((ingredient, index) => {
        expect(ingredient.originalQuantity).toBe(mockIngredients[index].quantity);
        expect(ingredient.scaleFactor).toBe(1.5);
      });
    });

    it('should throw error for invalid servings', () => {
      expect(() => scaleIngredients(mockIngredients, 0, 4)).toThrow();
      expect(() => scaleIngredients(mockIngredients, 4, -2)).toThrow();
    });
  });

  describe('convertUnit', () => {
    it('should convert between weight units', () => {
      expect(convertUnit(1000, 'g', 'kg')).toBeCloseTo(1);
      expect(convertUnit(1, 'oz', 'g')).toBeCloseTo(28.35, 1);
      expect(convertUnit(1, 'lb', 'oz')).toBeCloseTo(16, 1);
    });

    it('should convert between volume units', () => {
      expect(convertUnit(1000, 'ml', 'l')).toBeCloseTo(1);
      expect(convertUnit(1, 'cup', 'ml')).toBeCloseTo(236.6, 1);
      expect(convertUnit(3, 'tsp', 'tbsp')).toBeCloseTo(1, 1);
    });

    it('should not convert count units', () => {
      expect(convertUnit(5, 'piece', 'piece')).toBe(5);
      expect(convertUnit(3, 'clove', 'clove')).toBe(3);
    });

    it('should throw error for incompatible unit types', () => {
      expect(() => convertUnit(1, 'g', 'ml')).toThrow();
      expect(() => convertUnit(1, 'cup', 'piece')).toThrow();
    });
  });

  describe('getUnitType', () => {
    it('should return correct unit types', () => {
      expect(getUnitType('g')).toBe('weight');
      expect(getUnitType('ml')).toBe('volume');
      expect(getUnitType('piece')).toBe('count');
    });
  });

  describe('formatIngredientQuantity', () => {
    it('should format whole numbers without decimals', () => {
      expect(formatIngredientQuantity(2, 'piece')).toBe('2');
      expect(formatIngredientQuantity(1, 'cup')).toBe('1');
    });

    it('should format small quantities as fractions', () => {
      expect(formatIngredientQuantity(0.5, 'cup', true)).toBe('½');
      expect(formatIngredientQuantity(0.25, 'tsp', true)).toBe('¼');
    });

    it('should format decimals appropriately', () => {
      expect(formatIngredientQuantity(1.5, 'cup')).toBe('1.5');
      expect(formatIngredientQuantity(15.7, 'g')).toBe('16');
    });
  });

  describe('Edge cases', () => {
    it('should handle very small quantities', () => {
      const ingredients: Ingredient[] = [
        { id: '1', name: 'Vanilla', quantity: 0.125, unit: 'tsp' }
      ];
      
      const result = scaleIngredients(ingredients, 4, 8);
      expect(result[0].quantity).toBe(0.25);
    });

    it('should handle large quantities', () => {
      const ingredients: Ingredient[] = [
        { id: '1', name: 'Water', quantity: 2000, unit: 'ml' }
      ];
      
      const result = scaleIngredients(ingredients, 4, 2);
      expect(result[0].quantity).toBe(1000);
    });

    it('should round count items sensibly', () => {
      const ingredients: Ingredient[] = [
        { id: '1', name: 'Eggs', quantity: 3, unit: 'piece' }
      ];
      
      const result = scaleIngredients(ingredients, 4, 3);
      expect(result[0].quantity).toBe(2); // 3 * 0.75 = 2.25 → 2
    });
  });
});