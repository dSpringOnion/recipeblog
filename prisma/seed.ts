import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create demo users
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@recipeblog.com' },
    update: {},
    create: {
      email: 'admin@recipeblog.com',
      name: 'Recipe Admin',
      role: 'ADMIN',
    },
  });

  const testUser = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'Test User',
      role: 'USER',
    },
  });

  // Create dietary tags
  const dietaryTags = await Promise.all([
    prisma.dietaryTag.upsert({
      where: { name: 'vegetarian' },
      update: {},
      create: { name: 'vegetarian', color: '#22c55e' },
    }),
    prisma.dietaryTag.upsert({
      where: { name: 'vegan' },
      update: {},
      create: { name: 'vegan', color: '#16a34a' },
    }),
    prisma.dietaryTag.upsert({
      where: { name: 'gluten-free' },
      update: {},
      create: { name: 'gluten-free', color: '#f59e0b' },
    }),
    prisma.dietaryTag.upsert({
      where: { name: 'dairy-free' },
      update: {},
      create: { name: 'dairy-free', color: '#8b5cf6' },
    }),
  ]);

  // Create ingredients
  const ingredients = await Promise.all([
    prisma.ingredient.upsert({
      where: { name: 'flour' },
      update: {},
      create: { name: 'flour', category: 'baking' },
    }),
    prisma.ingredient.upsert({
      where: { name: 'sugar' },
      update: {},
      create: { name: 'sugar', category: 'baking' },
    }),
    prisma.ingredient.upsert({
      where: { name: 'eggs' },
      update: {},
      create: { name: 'eggs', category: 'protein' },
    }),
    prisma.ingredient.upsert({
      where: { name: 'milk' },
      update: {},
      create: { name: 'milk', category: 'dairy' },
    }),
    prisma.ingredient.upsert({
      where: { name: 'butter' },
      update: {},
      create: { name: 'butter', category: 'dairy' },
    }),
    prisma.ingredient.upsert({
      where: { name: 'vanilla extract' },
      update: {},
      create: { name: 'vanilla extract', category: 'flavoring' },
    }),
    prisma.ingredient.upsert({
      where: { name: 'baking powder' },
      update: {},
      create: { name: 'baking powder', category: 'baking' },
    }),
    prisma.ingredient.upsert({
      where: { name: 'salt' },
      update: {},
      create: { name: 'salt', category: 'seasoning' },
    }),
  ]);

  // Create a demo recipe
  const recipe = await prisma.recipe.create({
    data: {
      slug: 'classic-chocolate-chip-cookies',
      title: 'Classic Chocolate Chip Cookies',
      description: 'The perfect chewy and crispy chocolate chip cookies that everyone will love.',
      instructions: `# Classic Chocolate Chip Cookies

## Instructions

1. **Preheat the oven** to 375°F (190°C). Line baking sheets with parchment paper.

2. **Mix dry ingredients** in a medium bowl: flour, baking soda, and salt. Set aside.

3. **Cream butter and sugars** in a large bowl using an electric mixer until light and fluffy, about 2-3 minutes.

4. **Add eggs and vanilla** to the butter mixture, beating until well combined.

5. **Gradually add dry ingredients** to the wet ingredients, mixing until just combined. Don't overmix.

6. **Fold in chocolate chips** using a wooden spoon or spatula.

7. **Drop rounded tablespoons** of dough onto prepared baking sheets, spacing them 2 inches apart.

8. **Bake for 9-11 minutes** until edges are golden brown but centers still look slightly underbaked.

9. **Cool on baking sheet** for 5 minutes, then transfer to a wire rack.

## Tips
- For chewier cookies, slightly underbake them
- For crispier cookies, bake an extra 1-2 minutes
- Store in an airtight container for up to 1 week`,
      prepTimeMinutes: 15,
      cookTimeMinutes: 10,
      baseServings: 24,
      difficulty: 'EASY',
      cuisine: 'American',
      authorId: adminUser.id,
      isPublished: true,
      isFeatured: true,
      ingredients: {
        create: [
          {
            quantity: 2.25,
            unit: 'cup',
            orderIndex: 0,
            ingredient: { connect: { name: 'flour' } },
          },
          {
            quantity: 1,
            unit: 'tsp',
            orderIndex: 1,
            ingredient: { connect: { name: 'baking powder' } },
          },
          {
            quantity: 1,
            unit: 'tsp',
            orderIndex: 2,
            ingredient: { connect: { name: 'salt' } },
          },
          {
            quantity: 1,
            unit: 'cup',
            orderIndex: 3,
            notes: 'softened',
            ingredient: { connect: { name: 'butter' } },
          },
          {
            quantity: 0.75,
            unit: 'cup',
            orderIndex: 4,
            ingredient: { connect: { name: 'sugar' } },
          },
          {
            quantity: 2,
            unit: 'piece',
            orderIndex: 5,
            notes: 'large, room temperature',
            ingredient: { connect: { name: 'eggs' } },
          },
          {
            quantity: 2,
            unit: 'tsp',
            orderIndex: 6,
            ingredient: { connect: { name: 'vanilla extract' } },
          },
        ],
      },
      dietaryTags: {
        create: [
          {
            dietaryTag: { connect: { name: 'vegetarian' } },
          },
        ],
      },
    },
  });

  // Create additional featured recipes
  const italianRecipe = await prisma.recipe.create({
    data: {
      slug: 'homemade-pasta-marinara',
      title: 'Homemade Pasta with Fresh Marinara',
      description: 'Nothing beats fresh pasta with a simple, flavorful marinara sauce made from scratch.',
      instructions: `# Homemade Pasta with Fresh Marinara

## For the Pasta

1. **Make a well** with the flour on a clean surface. Crack eggs into the center.

2. **Gradually mix** the flour into the eggs using a fork, then knead for 8-10 minutes until smooth.

3. **Rest the dough** wrapped in plastic for 30 minutes.

4. **Roll out** using a pasta machine or rolling pin until thin.

5. **Cut into** desired shape (fettuccine, linguine, etc.).

## For the Marinara

1. **Heat olive oil** in a large pan over medium heat.

2. **Sauté garlic** until fragrant, about 1 minute.

3. **Add tomatoes** (crushed by hand), salt, and pepper.

4. **Simmer** for 20-25 minutes until thickened.

5. **Stir in fresh basil** and adjust seasoning.

## To Serve

1. **Cook pasta** in salted boiling water for 2-3 minutes.

2. **Toss with sauce** and serve immediately with Parmesan.

⏲️ **Tip**: Save some pasta water to thin the sauce if needed!`,
      prepTimeMinutes: 45,
      cookTimeMinutes: 30,
      baseServings: 4,
      difficulty: 'MEDIUM',
      cuisine: 'Italian',
      authorId: adminUser.id,
      isPublished: true,
      isFeatured: true,
    },
  });

  const asianRecipe = await prisma.recipe.create({
    data: {
      slug: 'teriyaki-salmon-bowls',
      title: 'Teriyaki Salmon Bowls',
      description: 'Flaky salmon glazed with homemade teriyaki sauce, served over rice with crisp vegetables.',
      instructions: `# Teriyaki Salmon Bowls

## For the Teriyaki Sauce

1. **Combine** soy sauce, mirin, sake, and sugar in a small saucepan.

2. **Bring to a boil**, then simmer until thickened, about 5 minutes.

3. **Set aside** to cool and thicken further.

## For the Salmon

1. **Season** salmon fillets with salt and pepper.

2. **Heat oil** in a non-stick pan over medium-high heat.

3. **Cook salmon** skin-side up for 4 minutes, then flip and cook 3 more minutes.

4. **Brush with teriyaki sauce** in the last minute of cooking.

## Assembly

1. **Serve** over steamed rice with cucumber, edamame, and avocado.

2. **Drizzle** with remaining teriyaki sauce and sprinkle with sesame seeds.

🌡️ **Temperature**: Cook salmon to 145°F (63°C) internal temperature.`,
      prepTimeMinutes: 15,
      cookTimeMinutes: 15,
      baseServings: 4,
      difficulty: 'MEDIUM',
      cuisine: 'Japanese',
      authorId: testUser.id,
      isPublished: true,
      isFeatured: true,
    },
  });

  const veganRecipe = await prisma.recipe.create({
    data: {
      slug: 'ultimate-veggie-burgers',
      title: 'Ultimate Black Bean Veggie Burgers',
      description: 'Hearty, flavorful veggie burgers that even meat-lovers will crave. Perfect for BBQs!',
      instructions: `# Ultimate Black Bean Veggie Burgers

## Instructions

1. **Preheat oven** to 375°F (190°C) if baking, or prepare grill.

2. **Mash black beans** in a large bowl, leaving some chunks for texture.

3. **Sauté onion and garlic** until softened, about 5 minutes.

4. **Mix together** beans, sautéed vegetables, breadcrumbs, and seasonings.

5. **Form into patties** and chill for 30 minutes to firm up.

6. **Cook** on grill or in pan with oil for 4-5 minutes per side until crispy.

7. **Serve** on toasted buns with your favorite toppings.

## Pro Tips
- 🍳 **Make ahead**: Patties can be frozen for up to 3 months
- 🥑 **Toppings**: Try avocado, sprouts, and chipotle mayo
- ⏲️ **Binding**: Chilling is crucial for patties that hold together

These burgers are so good, you won't miss the meat!`,
      prepTimeMinutes: 20,
      cookTimeMinutes: 15,
      baseServings: 6,
      difficulty: 'EASY',
      cuisine: 'American',
      authorId: adminUser.id,
      isPublished: true,
      isFeatured: true,
      dietaryTags: {
        create: [
          {
            dietaryTag: { connect: { name: 'vegan' } },
          },
          {
            dietaryTag: { connect: { name: 'dairy-free' } },
          },
        ],
      },
    },
  });

  const dessertRecipe = await prisma.recipe.create({
    data: {
      slug: 'decadent-chocolate-lava-cakes',
      title: 'Decadent Chocolate Lava Cakes',
      description: 'Individual chocolate cakes with a molten center that flows like lava. Pure indulgence!',
      instructions: `# Decadent Chocolate Lava Cakes

## Instructions

1. **Preheat oven** to 425°F (220°C). Butter and cocoa powder 6 ramekins.

2. **Melt chocolate and butter** together in a double boiler or microwave.

3. **Whisk in eggs** one at a time, then sugar until smooth.

4. **Fold in flour** and salt until just combined.

5. **Divide batter** among prepared ramekins.

6. **Bake** for 12-14 minutes until edges are firm but centers jiggle slightly.

7. **Rest** for 1 minute, then run a knife around edges and invert onto plates.

8. **Serve immediately** with vanilla ice cream and fresh berries.

## Perfect Timing
⏲️ **Key**: The centers should be liquid when you cut into them
🌡️ **Test**: Edges should be set but centers still soft
🍨 **Serving**: Best enjoyed within 2 minutes of unmolding

Pure chocolate bliss in every bite! 🍫`,
      prepTimeMinutes: 15,
      cookTimeMinutes: 14,
      baseServings: 6,
      difficulty: 'MEDIUM',
      cuisine: 'French',
      authorId: testUser.id,
      isPublished: true,
      isFeatured: true,
      dietaryTags: {
        create: [
          {
            dietaryTag: { connect: { name: 'vegetarian' } },
          },
        ],
      },
    },
  });

  console.log('Seed completed successfully!');
  console.log('Created users:', { adminUser: adminUser.email, testUser: testUser.email });
  console.log('Created featured recipes:', { 
    cookies: recipe.title,
    pasta: italianRecipe.title,
    salmon: asianRecipe.title, 
    burgers: veganRecipe.title,
    lava: dessertRecipe.title
  });
  console.log('🍳 Recipe Blog is ready to serve! Happy cooking!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });